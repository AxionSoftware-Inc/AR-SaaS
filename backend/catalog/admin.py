from django.contrib import admin

from .models import BusinessProfile, QrCode, ScanEvent, ThreeDModel


@admin.register(BusinessProfile)
class BusinessProfileAdmin(admin.ModelAdmin):
    list_display = ("name", "slug", "segment", "location", "created_at")
    search_fields = ("name", "slug", "segment", "location")
    prepopulated_fields = {"slug": ("name",)}


@admin.register(ThreeDModel)
class ThreeDModelAdmin(admin.ModelAdmin):
    list_display = ("name", "business", "kind", "status", "created_at")
    list_filter = ("kind", "status", "business")
    search_fields = ("name", "category", "material", "business__name")


@admin.register(QrCode)
class QrCodeAdmin(admin.ModelAdmin):
    list_display = ("label", "model", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("label", "model__name")


@admin.register(ScanEvent)
class ScanEventAdmin(admin.ModelAdmin):
    list_display = ("qr_code", "ip_address", "created_at")
    search_fields = ("qr_code__label", "qr_code__model__name", "ip_address")

# Register your models here.
