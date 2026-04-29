from rest_framework import mixins, status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import BusinessProfile, QrCode, ScanEvent, ThreeDModel
from .serializers import (
    BusinessProfileSerializer,
    PublicModelSerializer,
    QrCodeSerializer,
    ScanEventSerializer,
    ThreeDModelSerializer,
)


class BusinessProfileViewSet(viewsets.ModelViewSet):
    queryset = BusinessProfile.objects.all()
    serializer_class = BusinessProfileSerializer
    lookup_field = "slug"


class ThreeDModelViewSet(viewsets.ModelViewSet):
    queryset = ThreeDModel.objects.select_related("business").all()
    serializer_class = ThreeDModelSerializer


class QrCodeViewSet(viewsets.ModelViewSet):
    queryset = QrCode.objects.select_related("model", "model__business").all()
    serializer_class = QrCodeSerializer


class PublicModelViewSet(mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    queryset = ThreeDModel.objects.select_related("business").filter(status=ThreeDModel.Status.LIVE)
    serializer_class = PublicModelSerializer

    @action(detail=True, methods=["post"], url_path="scan")
    def scan(self, request, pk=None):
        model = self.get_object()
        qr_id = request.data.get("qr_code")

        qr_code = None
        if qr_id:
            qr_code = QrCode.objects.filter(id=qr_id, model=model, is_active=True).first()
        if qr_code is None:
            qr_code, _ = QrCode.objects.get_or_create(model=model, label="Direct scan")

        serializer = ScanEventSerializer(
            data={"qr_code": qr_code.id},
            context={"request": request},
        )
        serializer.is_valid(raise_exception=True)
        serializer.save(
            user_agent=request.META.get("HTTP_USER_AGENT", ""),
            ip_address=self._client_ip(request),
        )
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @staticmethod
    def _client_ip(request):
        forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")

# Create your views here.
