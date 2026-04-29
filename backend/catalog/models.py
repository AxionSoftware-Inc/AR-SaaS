import uuid

from django.db import models


class BusinessProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True)
    segment = models.CharField(max_length=120, blank=True)
    location = models.CharField(max_length=160, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["name"]

    def __str__(self) -> str:
        return self.name


class ThreeDModel(models.Model):
    class Kind(models.TextChoices):
        CHAIR = "chair", "Chair"
        TABLE = "table", "Table"
        LAMP = "lamp", "Lamp"
        OTHER = "other", "Other"

    class Status(models.TextChoices):
        DRAFT = "draft", "Draft"
        LIVE = "live", "Live"
        ARCHIVED = "archived", "Archived"

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    business = models.ForeignKey(BusinessProfile, related_name="models", on_delete=models.CASCADE)
    name = models.CharField(max_length=180)
    category = models.CharField(max_length=140, blank=True)
    kind = models.CharField(max_length=20, choices=Kind.choices, default=Kind.OTHER)
    color = models.CharField(max_length=7, default="#0f766e")
    material = models.CharField(max_length=220, blank=True)
    file = models.FileField(upload_to="models/")
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.LIVE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return self.name


class QrCode(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    model = models.ForeignKey(ThreeDModel, related_name="qr_codes", on_delete=models.CASCADE)
    label = models.CharField(max_length=120)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self) -> str:
        return f"{self.label} -> {self.model.name}"


class ScanEvent(models.Model):
    qr_code = models.ForeignKey(QrCode, related_name="scans", on_delete=models.CASCADE)
    user_agent = models.TextField(blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-created_at"]

# Create your models here.
