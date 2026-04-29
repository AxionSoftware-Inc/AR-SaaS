from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import BusinessProfileViewSet, PublicModelViewSet, QrCodeViewSet, ThreeDModelViewSet

router = DefaultRouter()
router.register("businesses", BusinessProfileViewSet, basename="business")
router.register("models", ThreeDModelViewSet, basename="model")
router.register("qr-codes", QrCodeViewSet, basename="qr-code")
router.register("public/models", PublicModelViewSet, basename="public-model")

urlpatterns = [
    path("", include(router.urls)),
]
