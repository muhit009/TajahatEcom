from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Product
from .serializer import ProductSerializer

# Create your views here.
class ListProduct(APIView):
    def get(self,request,format=None):
        products=Product.objects.all()
        serializer=ProductSerializer(products, many=True)
        return Response(serializer.data)
        