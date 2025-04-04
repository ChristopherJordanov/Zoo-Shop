from django.core.validators import MinLengthValidator, MinValueValidator
from django.db import models
from django.utils import timezone


class CheckoutInfo(models.Model):
    class CountryChoices(models.TextChoices):
        United_States = 'US', 'United States'
        Canada = 'CA', 'Canada'
        United_Kingdom = 'UK', 'United Kingdom'
        Australia = 'AU', 'Australia'
        Bulgaria = 'BG', 'Bulgaria'

    first_name = models.CharField(
        max_length=50,
        validators=[MinLengthValidator(2)]
    )
    last_name = models.CharField(
        max_length=50,
        validators=[MinLengthValidator(2)]
    )
    email = models.EmailField()
    phone_num = models.CharField(max_length=15)
    street_address = models.CharField(max_length=200)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=50)
    zip_code = models.CharField(max_length=30)
    country = models.CharField(
        max_length=2,
        choices=CountryChoices.choices
    )
    name_on_card = models.CharField(max_length=100)
    payment_token = models.CharField(max_length=255)
    expiration_date = models.CharField(max_length=6)
    cvv = models.CharField(max_length=5)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"


class Products(models.Model):
    name = models.CharField(max_length=100)
    price = models.DecimalField(
        max_digits=4,
        decimal_places=2,
        validators=[MinValueValidator(0.00)]
    )
    description = models.TextField(
        validators=[MinLengthValidator(5)]
    )
    in_stock = models.SmallIntegerField(
        validators=[MinValueValidator(0)]
    )


class Profile(models.Model):
    full_name = models.CharField(
        max_length=150,
        validators=[MinLengthValidator(4)]
    )
    email = models.EmailField(
        max_length=50,
        unique=True
    )
    password = models.CharField(max_length=100)
