"""
Management command: fix_image_urls
Cleans corrupted Cloudinary image paths stored in the database.

Run with:
    python manage.py fix_image_urls
"""
from django.core.management.base import BaseCommand
from properties.models import PropertyImage
from accounts.models import Profile


def clean_path(path_str):
    """
    Strip any injected prefix from a stored image path so cloudinary_storage
    can build the correct URL from it.

    Patterns to clean:
      - 'https:/res.cloudinary.com/X/image/upload/profiles/file' → 'profiles/file'
      - 'https://res.cloudinary.com/X/image/upload/profiles/file' → 'profiles/file'
      - Already clean relative path like 'profiles/file.jpg' → keep as-is
    """
    if not path_str:
        return path_str

    s = str(path_str)

    # If it's a full Cloudinary URL (with https://), extract just the relative path
    if 'res.cloudinary.com' in s:
        # Find the upload/ marker and take everything after it
        marker = '/image/upload/'
        idx = s.rfind(marker)
        if idx != -1:
            relative = s[idx + len(marker):]
            # Strip version prefix like 'v1234567890/'
            import re
            relative = re.sub(r'^v\d+/', '', relative)
            # Strip 'media/' prefix if present (leftover from bad MEDIA_URL)
            if relative.startswith('media/'):
                relative = relative[len('media/'):]
            return relative

    # Strip leading 'media/' if present in a plain relative path
    if s.startswith('media/'):
        return s[len('media/'):]

    return s


class Command(BaseCommand):
    help = 'Fix corrupted Cloudinary image URLs stored in the database'

    def handle(self, *args, **options):
        self.stdout.write('Fixing PropertyImage paths...')
        fixed = 0
        for obj in PropertyImage.objects.all():
            original = str(obj.image)
            cleaned = clean_path(original)
            if cleaned != original:
                self.stdout.write(f'  PropertyImage {obj.id}: {original!r} → {cleaned!r}')
                obj.image = cleaned
                obj.save(update_fields=['image'])
                fixed += 1
        self.stdout.write(f'  Fixed {fixed} PropertyImage records.')

        self.stdout.write('Fixing Profile picture paths...')
        fixed2 = 0
        for obj in Profile.objects.all():
            if not obj.profile_picture:
                continue
            original = str(obj.profile_picture)
            cleaned = clean_path(original)
            if cleaned != original:
                self.stdout.write(f'  Profile {obj.id}: {original!r} → {cleaned!r}')
                obj.profile_picture = cleaned
                obj.save(update_fields=['profile_picture'])
                fixed2 += 1
        self.stdout.write(f'  Fixed {fixed2} Profile records.')

        self.stdout.write(self.style.SUCCESS('Done! All image paths cleaned.'))
