from pathlib import Path
from shutil import copyfile

from django.conf import settings
from django.core.management.base import BaseCommand

from catalog.models import BusinessProfile, QrCode, ThreeDModel


class Command(BaseCommand):
    help = "Create demo business, model, and QR code."

    def handle(self, *args, **options):
        business, _ = BusinessProfile.objects.get_or_create(
            slug="espresso-bar",
            defaults={
                "name": "Espresso Bar",
                "segment": "Cafe",
                "location": "Tashkent City",
            },
        )

        source = settings.BASE_DIR.parent / "public" / "models" / "signature-chair.glb"
        target_dir = Path(settings.MEDIA_ROOT) / "models"
        target_dir.mkdir(parents=True, exist_ok=True)
        target = target_dir / "signature-chair.glb"

        if source.exists() and not target.exists():
            copyfile(source, target)

        model, _ = ThreeDModel.objects.get_or_create(
            business=business,
            name="Signature lounge chair",
            defaults={
                "category": "Interior seating",
                "kind": ThreeDModel.Kind.CHAIR,
                "color": "#0f766e",
                "material": "Walnut frame, dark teal fabric",
                "file": "models/signature-chair.glb",
                "status": ThreeDModel.Status.LIVE,
            },
        )

        qr_code, _ = QrCode.objects.get_or_create(
            model=model,
            label="Table 08",
            defaults={"is_active": True},
        )

        self.stdout.write(self.style.SUCCESS(f"Business: {business.id}"))
        self.stdout.write(self.style.SUCCESS(f"Model: {model.id}"))
        self.stdout.write(self.style.SUCCESS(f"QR: {qr_code.id}"))
