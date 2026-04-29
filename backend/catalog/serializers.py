from django.conf import settings
from rest_framework import serializers

from .models import BusinessProfile, QrCode, ScanEvent, ThreeDModel


class BusinessProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessProfile
        fields = ["id", "name", "slug", "segment", "location", "created_at"]
        read_only_fields = ["id", "created_at"]


class ThreeDModelSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = ThreeDModel
        fields = [
            "id",
            "business",
            "name",
            "category",
            "kind",
            "color",
            "material",
            "file",
            "file_url",
            "status",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "file_url", "created_at", "updated_at"]

    def get_file_url(self, obj: ThreeDModel) -> str:
        request = self.context.get("request")
        if not obj.file:
            return ""

        url = obj.file.url
        return request.build_absolute_uri(url) if request else url


class QrCodeSerializer(serializers.ModelSerializer):
    model_name = serializers.CharField(source="model.name", read_only=True)
    scan_url = serializers.SerializerMethodField()
    scan_count = serializers.IntegerField(source="scans.count", read_only=True)

    class Meta:
        model = QrCode
        fields = [
            "id",
            "model",
            "model_name",
            "label",
            "is_active",
            "scan_url",
            "scan_count",
            "created_at",
        ]
        read_only_fields = ["id", "model_name", "scan_url", "scan_count", "created_at"]

    def get_scan_url(self, obj: QrCode) -> str:
        path = f"/ar/{obj.model_id}?qr={obj.id}"
        return f"{settings.FRONTEND_BASE_URL}{path}"


class PublicModelSerializer(serializers.ModelSerializer):
    file_url = serializers.SerializerMethodField()
    business_name = serializers.CharField(source="business.name", read_only=True)

    class Meta:
        model = ThreeDModel
        fields = [
            "id",
            "business_name",
            "name",
            "category",
            "kind",
            "color",
            "material",
            "file_url",
            "status",
        ]

    def get_file_url(self, obj: ThreeDModel) -> str:
        request = self.context.get("request")
        url = obj.file.url if obj.file else ""
        return request.build_absolute_uri(url) if request and url else url


class ScanEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScanEvent
        fields = ["id", "qr_code", "user_agent", "ip_address", "created_at"]
        read_only_fields = ["id", "user_agent", "ip_address", "created_at"]
