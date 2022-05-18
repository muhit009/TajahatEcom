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

    # def post(self, request):
    #     order_serializer = OrderSerializer(data = request.data)
    #     if order_serializer.is_valid():
    #         if(int(order_serializer.validated_data.get('total_quantity')) >= 40):
    #             order_serializer.save()
    #             return Response({'status': 200, 'payload': order_serializer.data, 'message': "successful"})
    #         else:
    #             return Response({'message': "not enough order quantity"})
    #     return Response({'status': 403, 'payload': order_serializer.data, 'message': "failed"})

    def post(self, request):
        data = request.data
        order = OrderSerializer(data = data)
        order_item = list(data.get('order_list'))
        #print(order_item)

        flag = 0
        if order.is_valid():
            order.save()
        
        order_obj = Order.objects.latest('date')
        print(order_obj)
        #print(order_obj.id)
        for item in order_item:
            item['order_id'] = order_obj
            products = Product.objects.get(id = item['id'])
            order_item_obj = OrderItem(order_id=item['order_id'], product=products, amount = item['amount'], price= item['price'])
            order_item_obj.save()
        
        if flag==0:
            return Response({'message': 'successfull', 'payload': order.data})
        
        return Response({'message': '403'})




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


                