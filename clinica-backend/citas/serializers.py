from datetime import date

from rest_framework import serializers

from .models import Cita, Especialidad, EstadoCita, HistoriaClinica, Medico, Paciente


class EspecialidadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Especialidad
        fields = ["id", "nombre", "descripcion"]


class MedicoSerializer(serializers.ModelSerializer):
    especialidad_nombre = serializers.CharField(source="especialidad.nombre", read_only=True)

    class Meta:
        model = Medico
        fields = [
            "id", "nombres", "cmp", "especialidad", "especialidad_nombre",
            "telefono", "correo",
        ]


class PacienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Paciente
        fields = ["id", "dni", "nombres", "fecha_nacimiento", "telefono", "correo"]


class EstadoCitaSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoCita
        fields = ["id", "nombre", "es_final"]


class HistoriaClinicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoriaClinica
        fields = ["id", "paciente", "grupo_sanguineo", "alergias", "antecedentes"]


class CitaSerializer(serializers.ModelSerializer):
    paciente_nombre = serializers.CharField(source="paciente.nombres", read_only=True)
    medico_nombre = serializers.CharField(source="medico.nombres", read_only=True)
    especialidad = serializers.CharField(source="medico.especialidad.nombre", read_only=True)
    estado_nombre = serializers.CharField(source="estado.nombre", read_only=True)
    estado_es_final = serializers.BooleanField(source="estado.es_final", read_only=True)

    class Meta:
        model = Cita
        fields = [
            "id", "paciente", "paciente_nombre", "medico", "medico_nombre",
            "especialidad", "fecha", "hora", "motivo", "estado",
            "estado_nombre", "estado_es_final",
        ]
        # Desactivamos el validador automático del UniqueConstraint para devolver
        # nuestro propio mensaje claro desde validate().
        validators = []

    def validate(self, attrs):
        # En un PATCH parcial algunos campos no vienen: se toman de la instancia.
        instancia = self.instance
        fecha = attrs.get("fecha", getattr(instancia, "fecha", None))
        hora = attrs.get("hora", getattr(instancia, "hora", None))
        medico = attrs.get("medico", getattr(instancia, "medico", None))

        # Fecha pasada: solo se valida si se está creando o cambiando la fecha.
        if "fecha" in attrs and fecha < date.today():
            raise serializers.ValidationError(
                {"fecha": "No se puede registrar una cita con una fecha pasada."}
            )

        # Horario ocupado: solo si cambia alguno de los campos que lo definen.
        if {"fecha", "hora", "medico"} & set(attrs) and medico and fecha and hora:
            ocupado = Cita.objects.filter(medico=medico, fecha=fecha, hora=hora)
            if instancia:
                ocupado = ocupado.exclude(pk=instancia.pk)
            if ocupado.exists():
                raise serializers.ValidationError(
                    {
                        "hora": (
                            f"El médico {medico.nombres} ya tiene una cita el "
                            f"{fecha} a las {hora.strftime('%H:%M')}. Elija otro horario."
                        )
                    }
                )
        return attrs
