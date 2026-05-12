import json
from django.db import models
from product.models import Product


class ProductEmbedding(models.Model):
    product = models.OneToOneField(Product, on_delete=models.CASCADE, related_name='embedding')
    vector_json = models.TextField()
    embedded_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def get_vector(self) -> list:
        return json.loads(self.vector_json)

    def set_vector(self, vector) -> None:
        if hasattr(vector, 'tolist'):
            vector = vector.tolist()
        self.vector_json = json.dumps(vector)

    def __str__(self):
        return f"Embedding for {self.product.get_name_display()}"
