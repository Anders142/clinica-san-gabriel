from rest_framework import viewsets
from rest_framework.exceptions import ValidationError
from django.db.models import ProtectedError

from .models import Cita, Especialidad, EstadoCita, HistoriaClinica, Medico, Paciente
from .serializers import (
    CitaSerializer,
    EspecialidadSerializer,
    EstadoCitaSerializer,
    HistoriaClinicaSerializer,
    MedicoSerializer,
    PacienteSerializer,
)


class ProtegidoMixin:
    """Devuelve 400 con un mensaje claro si el borrado viola un on_delete=PROTECT."""

    def perform_destroy(self, instance):
        try:
            instance.delete()
        except ProtectedError:
            raise ValidationError(
                {"detail": "No se puede eliminar: tiene registros relacionados."}
            )


class EspecialidadViewSet(ProtegidoMixin, viewsets.ModelViewSet):
    queryset = Especialidad.objects.all()
    serializer_class = EspecialidadSerializer


class MedicoViewSet(ProtegidoMixin, viewsets.ModelViewSet):
    serializer_class = MedicoSerializer

    def get_queryset(self):
        qs = Medico.objects.select_related("especialidad")
        especialidad = self.request.query_params.get("especialidad")  # ?especialidad=<id>
        if especialidad:
            qs = qs.filter(especialidad_id=especialidad)
        return qs


class PacienteViewSet(ProtegidoMixin, viewsets.ModelViewSet):
    queryset = Paciente.objects.all()
    serializer_class = PacienteSerializer


class EstadoCitaViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = EstadoCita.objects.all()
    serializer_class = EstadoCitaSerializer


class HistoriaClinicaViewSet(viewsets.ModelViewSet):
    queryset = HistoriaClinica.objects.select_related("paciente")
    serializer_class = HistoriaClinicaSerializer


class CitaViewSet(ProtegidoMixin, viewsets.ModelViewSet):
    serializer_class = CitaSerializer

    def get_queryset(self):
        qs = Cita.objects.select_related(
            "paciente", "medico", "medico__especialidad", "estado"
        )
        fecha = self.request.query_params.get("fecha")  # ?fecha=aaaa-mm-dd
        if fecha:
            qs = qs.filter(fecha=fecha)
        return qs
