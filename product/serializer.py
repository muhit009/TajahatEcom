from rest_framework import serializers
from .models import Product,TYPE_CHOICES

#serialize product
class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Product
        fields = ['id', 'name', 'price', 'img','availability']

    # Type= serializers.CharField(max_length=20, choices=TYPE_CHOICES, default='Lengra')
    # Quantity= serializers.IntegerField()
    # Price_per_kg= serializers.IntegerField()
    # Availability=serializers.BooleanField()

    # def create(self, validated_data):
    #     return super().create(validated_data)

    # def update(self, instance, validated_data):
    #     instance.Type= validated_data.get('Type', instance.Type)
    #     instance.Quantity= validated_data.get('Quantity', instance.Quantity)
    #     instance.Price_per_kg= validated_data.get('Price_per_kg', instance.Price_per_kg)
    #     instance.Availability=validated_data.get('Availability', instance.Availability)
        
        
    #     instance.save()
    #     return instance
       
        
      
