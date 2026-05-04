from django.db import models
from django.conf import settings
from django.utils.text import slugify

class Property(models.Model):
    STATUS_CHOICES = (
        ('sale', 'For Sale'),
        ('rent', 'For Rent'),
    )
    TYPE_CHOICES = (
        ('residential', 'Residential'),
        ('commercial', 'Commercial'),
        ('industrial', 'Industrial'),
        ('agricultural', 'Agricultural'),
    )
    
    agent = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='properties')
    slug = models.SlugField(unique=True, max_length=255, blank=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    price = models.DecimalField(max_digits=12, decimal_places=2)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    property_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    address = models.TextField()
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.title)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class PropertyImage(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='properties/')
    is_primary = models.BooleanField(default=False)

    def __str__(self):
        return f"Image for {self.property.title}"

class PropertyFeature(models.Model):
    property = models.ForeignKey(Property, on_delete=models.CASCADE, related_name='features')
    key = models.CharField(max_length=100) # e.g., 'Bedrooms', 'Pool'
    value = models.CharField(max_length=100) # e.g., '3', 'Yes'

    def __str__(self):
        return f"{self.key}: {self.value}"
