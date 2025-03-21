from django.core.validators import MinLengthValidator, MinValueValidator
from django.db import models


class Country(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=3)  # Example: 'US', 'CA', 'GB'
    currency = models.CharField(max_length=3)

    def __str__(self):
        return f"{self.name} ({self.code})"


class CheckoutInfo(models.Model):
    class CountryChoices(models.TextChoices):
        United_States = 'US', 'United States'
        Canada = 'CA', 'Canada'
        United_Kingdom = 'UK', 'United Kingdom',
        Australia = 'AU', 'Australia'

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
    country_reference = models.ForeignKey(
        Country,
        on_delete=models.CASCADE,
        related_name='checkouts'
    )
    name_on_card = models.CharField(max_length=100)
    payment_token = models.CharField(max_length=255)
    expiration_date = models.CharField(max_length=6)
    cvv = models.CharField(max_length=5)

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

