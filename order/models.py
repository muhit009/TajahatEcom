from collections import _OrderedDictItemsView
from itertools import product
from typing import OrderedDict
from xml.etree.ElementInclude import default_loader
from django.db import models
from pytz import timezone
from product.models import Product
import datetime
from django.utils import timezone

# Create your models here.

STATUS=[
    ('processing','processing'),
    ('complete','complete'),
]



class Order(models.Model):
    name = models.CharField(max_length=20, null=True)
    address = models.CharField(max_length=100)
    phone = models.CharField(max_length=20)
    order_status = models.CharField(max_length = 20,choices=STATUS, default='processing')
    confirmation_status = models.BooleanField(default=False)
    total_amount = models.IntegerField(default=20)
    total_price = models.FloatField()
    transaction_id = models.CharField(max_length=20 , null=False)
    date = models.DateTimeField(blank=True, default = timezone.now)

    def __str__(self):
        return self.name+" "+self.phone


class OrderItem(models.Model):
    order_id = models.ForeignKey(Order, on_delete=models.CASCADE)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    amount = models.IntegerField(default=10)
    price = models.FloatField()    

    def __str__(self):
        return str(self.order_id.id)
    

