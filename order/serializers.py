from dataclasses import field
from rest_framework import serializers
from .models import *
from product.serializer import *

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'



class OrderItemSerializer(serializers.ModelSerializer):
    order_id = OrderSerializer()
    product = ProductSerializer() 
    
    class Meta:
        model = OrderItem
        fields = '__all__'