from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser

from product import serializer
from .models import *
from .serializers import*

# Create your views here.
class OrderView(APIView):

    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        order_serializer = OrderSerializer(data = request.data)
        if order_serializer.is_valid():
            if(int(order_serializer.validated_data.get('total_quantity')) >= 40):
                order_serializer.save()
                return Response({'status': 200, 'payload': order_serializer.data, 'message': "successful"})
            else:
                return Response({'message': "not enough order quantity"})
        return Response({'status': 403, 'payload': order_serializer.data, 'message': "failed"})



class OrderItemView(APIView):

    def get(self, request):
        orderItem = OrderItem.objects.all()
        serializer = OrderItemSerializer(orderItem, many = True)
        return Response(serializer.data)

    def post(self, request):
        order_item_serializer = OrderItemSerializer(data = request.data)
        if order_item_serializer.is_valid:
            if(int(order_item_serializer.validated_data.get('quantity')) >= 10):
                order_item_serializer.save()
                return Response({'status': 200, 'payload': order_item_serializer.data, 'message': "successful"})
            else:
                return Response({'message': "not enough order quantity"})
        return Response({'status': 403, 'payload': order_item_serializer.data, 'message': "failed"})


                