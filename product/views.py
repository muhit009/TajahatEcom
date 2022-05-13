from itertools import product
from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import authentication, permissions
from .models import Product
from .serializer import ProductSerializer

# Create your views here.
class ListProduct(APIView):
    def get(self,request,format=None):
        products=Product.objects.all()
        serializer=ProductSerializer(products, many=True)
        return Response(serializer.data)
        