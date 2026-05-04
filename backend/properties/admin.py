from django.contrib import admin
from .models import Property, PropertyImage, PropertyFeature

class PropertyImageInline(admin.TabularInline):
    model = PropertyImage
    extra = 1

class PropertyFeatureInline(admin.TabularInline):
    model = PropertyFeature
    extra = 1

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    inlines = [PropertyImageInline, PropertyFeatureInline]
    prepopulated_fields = {'slug': ('title',)}
    list_display = ('title', 'price', 'status', 'property_type', 'agent')
    list_filter = ('status', 'property_type')
    search_fields = ('title', 'address')

admin.site.register(PropertyImage)
admin.site.register(PropertyFeature)
