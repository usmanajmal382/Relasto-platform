from django.contrib import admin
from .models import Review, VisitRequest

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('user', 'agent', 'rating', 'created_at')
    list_filter = ('rating',)
    search_fields = ('user__username', 'agent__username')

@admin.register(VisitRequest)
class VisitRequestAdmin(admin.ModelAdmin):
    list_display = ('contact_name', 'property', 'agent', 'status', 'preferred_date')
    list_filter = ('status',)
    search_fields = ('contact_name', 'contact_email')
