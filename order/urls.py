from typing import List
from django.urls import path
from product import views
from .views import OrderView, OrderItemView

urlpatterns = [
    path('',OrderView.as_view(),name='order'),
    path('item/', OrderItemView.as_view(), name='order_item'),
]