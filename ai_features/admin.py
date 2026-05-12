from django.contrib import admin
from .models import ProductEmbedding


@admin.register(ProductEmbedding)
class ProductEmbeddingAdmin(admin.ModelAdmin):
    list_display = ('product', 'embedded_text', 'updated_at')
    readonly_fields = ('vector_json', 'created_at', 'updated_at')
