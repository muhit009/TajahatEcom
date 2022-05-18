from unittest.util import _MAX_LENGTH
from django.db import models

# Create your models here.
#types of mango
TYPE_CHOICES=[
    ('lengra','Lengra'),
    ('fojli','Fojli'),
    ('himshangar','Himshagor'),
    ('aamruplai','Aamrupali'),
    ('khirshapat','Khirshapat'),
    ('gopalbhog','Gopalvog'),
    ('kalivog','Kalivog'),
    ('mohonvog','Mohonvog'),
    ('harivanga','Hariavanga'),
    ('ashwina','Ashwina'),
]
#models for product
class Product(models.Model):

    name= models.CharField(max_length=20, choices=TYPE_CHOICES, default='Lengra')
    quantity= models.IntegerField()
    price= models.IntegerField()
    availability=models.BooleanField()
    img= models.ImageField(null=True, blank=True)

    def __str__(self):
        return self.name
