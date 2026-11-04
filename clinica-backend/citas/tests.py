from datetime import date, time, timedelta

from rest_framework.test import APITestCase

from .models import Cita, Especialidad, EstadoCita, Medico, Paciente


class CitasAPITests(APITestCase):
    def setUp(self):
        self.pendiente = EstadoCita.objects.create(nombre="pendiente", es_final=False)
        EstadoCita.objects.create(nombre="atendida", es_final=True)
        esp = Especialidad.objects.create(nombre="Cardiología")
        esp2 = Especialidad.objects.create(nombre="Pediatría")
        self.medico = Medico.objects.create(nombres="Dr. A", cmp="1", especialidad=esp)
        Medico.objects.create(nombres="Dra. B", cmp="2", especialidad=esp2)
        self.paciente = Paciente.objects.create(
            dni="12345678", nombres="Ana", fecha_nacimiento=date(1990, 1, 1)
        )
        self.manana = date.today() + timedelta(days=1)

    def _payload(self, **kw):
        data = {
            "paciente": self.paciente.id, "medico": self.medico.id,
            "fecha": str(self.manana), "hora": "09:00",
            "motivo": "Control", "estado": self.pendiente.id,
        }
        data.update(kw)
        return data

    def test_crear_cita_y_campos_de_solo_lectura(self):
        r = self.client.post("/api/citas/", self._payload(), format="json")
        self.assertEqual(r.status_code, 201)
        self.assertEqual(r.data["paciente_nombre"], "Ana")
        self.assertEqual(r.data["medico_nombre"], "Dr. A")
        self.assertEqual(r.data["especialidad"], "Cardiología")
        self.assertEqual(r.data["estado_nombre"], "pendiente")

    def test_rechaza_fecha_pasada(self):
        ayer = str(date.today() - timedelta(days=1))
        r = self.client.post("/api/citas/", self._payload(fecha=ayer), format="json")
        self.assertEqual(r.status_code, 400)
        self.assertIn("fecha", r.data)

    def test_rechaza_horario_ocupado(self):
        self.client.post("/api/citas/", self._payload(), format="json")
        r = self.client.post("/api/citas/", self._payload(), format="json")
        self.assertEqual(r.status_code, 400)
        self.assertIn("hora", r.data)

    def test_patch_estado_no_dispara_error_de_horario(self):
        r = self.client.post("/api/citas/", self._payload(), format="json")
        atendida = EstadoCita.objects.get(nombre="atendida")
        r2 = self.client.patch(f"/api/citas/{r.data['id']}/", {"estado": atendida.id}, format="json")
        self.assertEqual(r2.status_code, 200)
        self.assertTrue(r2.data["estado_es_final"])

    def test_filtros(self):
        self.client.post("/api/citas/", self._payload(), format="json")
        self.assertEqual(len(self.client.get(f"/api/citas/?fecha={self.manana}").data), 1)
        self.assertEqual(len(self.client.get("/api/citas/?fecha=2000-01-01").data), 0)
        esp_id = Especialidad.objects.get(nombre="Pediatría").id
        meds = self.client.get(f"/api/medicos/?especialidad={esp_id}").data
        self.assertEqual([m["nombres"] for m in meds], ["Dra. B"])

    def test_dni_invalido_y_unico(self):
        base = {"dni": "123", "nombres": "X", "fecha_nacimiento": "2000-01-01"}
        self.assertEqual(self.client.post("/api/pacientes/", base, format="json").status_code, 400)
        base["dni"] = "12345678"
        self.assertEqual(self.client.post("/api/pacientes/", base, format="json").status_code, 400)

    def test_borrar_especialidad_con_medicos_protegido(self):
        r = self.client.delete(f"/api/especialidades/{self.medico.especialidad_id}/")
        self.assertEqual(r.status_code, 400)

    def test_borrar_paciente_borra_sus_citas(self):
        self.client.post("/api/citas/", self._payload(), format="json")
        self.assertEqual(self.client.delete(f"/api/pacientes/{self.paciente.id}/").status_code, 204)
        self.assertEqual(Cita.objects.count(), 0)
