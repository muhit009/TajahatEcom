from rest_framework import serializers
from .models import Product


class ProductSerializer(serializers.ModelSerializer):
    display_name = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'display_name', 'price', 'img', 'availability']

    def get_display_name(self, obj):
        return obj.get_name_display()
       
        
      
