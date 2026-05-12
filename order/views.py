from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser

from .models import Order, OrderItem
from .serializers import OrderSerializer, OrderItemSerializer
from product.models import Product


class OrderView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAdminUser()]
        return []

    def get(self, request):
        orders = Order.objects.all()
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data
        order_serializer = OrderSerializer(data=data)
        order_list = list(data.get('order_list', []))

        if not order_serializer.is_valid():
            return Response(
                {'status': 400, 'message': 'Invalid order data', 'errors': order_serializer.errors},
                status=status.HTTP_400_BAD_REQUEST
            )

        order_serializer.save()
        order_obj = Order.objects.latest('date')

        for item in order_list:
            product = Product.objects.get(id=item['id'])
            OrderItem.objects.create(
                order_id=order_obj,
                product=product,
                amount=item['amount'],
                price=item['price']
            )

        return Response({'message': 'successful', 'payload': order_serializer.data})


class OrderItemView(APIView):

    def get_permissions(self):
        if self.request.method == 'GET':
            return [IsAdminUser()]
        return []

    def get(self, request):
        order_items = OrderItem.objects.all()
        serializer = OrderItemSerializer(order_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        order_item_serializer = OrderItemSerializer(data=request.data)
        if order_item_serializer.is_valid():
            if int(order_item_serializer.validated_data.get('amount', 0)) >= 10:
                order_item_serializer.save()
                return Response(
                    {'status': 200, 'payload': order_item_serializer.data, 'message': 'successful'}
                )
            return Response({'message': 'not enough order quantity'})
        return Response(
            {'status': 400, 'errors': order_item_serializer.errors, 'message': 'failed'},
            status=status.HTTP_400_BAD_REQUEST
        )
