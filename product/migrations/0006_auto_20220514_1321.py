# Generated by Django 3.2.5 on 2022-05-14 07:21

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0005_product_img'),
    ]

    operations = [
        migrations.RenameField(
            model_name='product',
            old_name='Availability',
            new_name='availability',
        ),
        migrations.RenameField(
            model_name='product',
            old_name='Img',
            new_name='img',
        ),
        migrations.RenameField(
            model_name='product',
            old_name='Type',
            new_name='name',
        ),
        migrations.RenameField(
            model_name='product',
            old_name='Price_per_kg',
            new_name='price',
        ),
        migrations.RenameField(
            model_name='product',
            old_name='Quantity',
            new_name='quantity',
        ),
    ]