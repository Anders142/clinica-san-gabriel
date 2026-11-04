from datetime import date, time, timedelta

from django.core.management.base import BaseCommand

from citas.models import (
    Cita, Especialidad, EstadoCita, HistoriaClinica, Medico, Paciente,
)


class Command(BaseCommand):
    help = "Carga estados, 3 especialidades, 4 médicos, 5 pacientes y citas de ejemplo."

    def handle(self, *args, **options):
        estados = {}
        for nombre, final in [
            ("pendiente", False), ("confirmada", False),
            ("atendida", True), ("cancelada", True),
        ]:
            estados[nombre], _ = EstadoCita.objects.get_or_create(
                nombre=nombre, defaults={"es_final": final}
            )

        esp = {}
        for nombre, desc in [
            ("Cardiología", "Enfermedades del corazón y sistema circulatorio."),
            ("Pediatría", "Atención médica de niños y adolescentes."),
            ("Dermatología", "Cuidado y enfermedades de la piel."),
        ]:
            esp[nombre], _ = Especialidad.objects.get_or_create(
                nombre=nombre, defaults={"descripcion": desc}
            )

        medicos = []
        for nombres, cmp, e, tel, mail in [
            ("Dr. Luis Ramírez", "10234", "Cardiología", "987111222", "lramirez@sangabriel.pe"),
            ("Dra. Carmen Torres", "20456", "Pediatría", "987333444", "ctorres@sangabriel.pe"),
            ("Dr. Jorge Salas", "30789", "Dermatología", "987555666", "jsalas@sangabriel.pe"),
            ("Dra. Ana Quispe", "40123", "Cardiología", "987777888", "aquispe@sangabriel.pe"),
        ]:
            m, _ = Medico.objects.get_or_create(
                cmp=cmp,
                defaults=dict(nombres=nombres, especialidad=esp[e], telefono=tel, correo=mail),
            )
            medicos.append(m)

        pacientes = []
        for dni, nombres, nac, tel, mail in [
            ("70123456", "María Fernández", date(1990, 3, 12), "999111222", "maria@mail.com"),
            ("70234567", "Carlos Huamán", date(1985, 7, 25), "999222333", "carlos@mail.com"),
            ("70345678", "Lucía Paredes", date(2015, 1, 9), "999333444", "lucia@mail.com"),
            ("70456789", "Pedro Castillo", date(1972, 11, 30), "999444555", "pedro@mail.com"),
            ("70567890", "Rosa Mendoza", date(2000, 5, 18), "999555666", "rosa@mail.com"),
        ]:
            p, _ = Paciente.objects.get_or_create(
                dni=dni,
                defaults=dict(nombres=nombres, fecha_nacimiento=nac, telefono=tel, correo=mail),
            )
            pacientes.append(p)

        HistoriaClinica.objects.get_or_create(
            paciente=pacientes[0],
            defaults=dict(grupo_sanguineo="O+", alergias="Penicilina", antecedentes="Hipertensión leve"),
        )

        manana = date.today() + timedelta(days=1)
        for i, (p, m, h, mot, est) in enumerate([
            (pacientes[0], medicos[0], time(9, 0), "Control de presión", "pendiente"),
            (pacientes[2], medicos[1], time(10, 30), "Control de crecimiento", "confirmada"),
            (pacientes[4], medicos[2], time(11, 0), "Revisión de alergia cutánea", "pendiente"),
        ]):
            Cita.objects.get_or_create(
                medico=m, fecha=manana, hora=h,
                defaults=dict(paciente=p, motivo=mot, estado=estados[est]),
            )

        self.stdout.write(self.style.SUCCESS("Datos de ejemplo cargados."))
