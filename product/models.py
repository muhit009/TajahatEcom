from unittest.util import _MAX_LENGTH
from django.db import models

# Create your models here.
#types of mango
TYPE_CHOICES=[
    ('lengra','LENGRA'),
    ('fojli','FOJLI'),
    ('himshangar','HIMSHAGAR'),
    ('aamruplai','AAMRUPALI'),
    ('khirshapat','KHIRSHAPAT'),
    ('gopalbhog','GOPALBHOG'),
    ('kalivog','KALIVOG'),
    ('mohonvog','MOHONVOG'),
    ('harivanga','HARIVANGA'),
    ('ashwina','ASHWINA'),
]
#models for product
class Product(models.Model):

    Type= models.CharField(max_length=20, choices=TYPE_CHOICES, default='Lengra')
    Quantity= models.IntegerField()
    Price_per_kg= models.IntegerField()
    Availability=models.BooleanField()
    Img= models.ImageField(upload_to=None, width_field=None,max_length=100)

