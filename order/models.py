from collections import _OrderedDictItemsView
from itertools import product
from pickle import FALSE
from tkinter import CASCADE
from typing import OrderedDict
from xml.etree.ElementInclude import default_loader
from django.db import models
from product.models import Product

# Create your models here.

STATUS=[
    ('processing','processing'),
    ('complete','complete'),
]



class Order(models.Model):
    shipping_address = models.CharField(max_length=100)
    phone_number = models.CharField(max_length=20)
    order_status = models.CharField(max_length = 20,choices=STATUS)
    confirmation_status = models.BooleanField(default=FALSE)
    total_quantity = models.IntegerField()
    total_price = models.FloatField()


class OrderItem(models.Model):
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=10)
    price = models.FloatField()    

    

