from rest_framework.routers import DefaultRouter

from .views import (
    CitaViewSet,
    EspecialidadViewSet,
    EstadoCitaViewSet,
    HistoriaClinicaViewSet,
    MedicoViewSet,
    PacienteViewSet,
)

router = DefaultRouter()
router.register("especialidades", EspecialidadViewSet, basename="especialidad")
router.register("medicos", MedicoViewSet, basename="medico")
router.register("pacientes", PacienteViewSet, basename="paciente")
router.register("citas", CitaViewSet, basename="cita")
router.register("estados", EstadoCitaViewSet, basename="estado")
router.register("historias", HistoriaClinicaViewSet, basename="historia")

urlpatterns = router.urls
