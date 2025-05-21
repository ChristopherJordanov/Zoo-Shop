from django.contrib.auth.models import User
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

    def __str__(self):
        return f"{self.first_name} {self.last_name} - {self.email}"


class Profile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        null=True,
        blank=True
    )
    username = models.CharField(max_length=50)
    full_name = models.CharField(
        max_length=150,
        validators=[MinLengthValidator(4)]
    )
    email = models.EmailField(
        max_length=50,
        unique=True
    )


class Order(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='orders'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    total_price = models.DecimalField(
        max_digits=8,
        decimal_places=2
    )

    def __str__(self):
        return f"Order #{self.id} from {self.user.username}"


class OrderItem(models.Model):
    order = models.ForeignKey(
        Order,
        on_delete=models.CASCADE,
        related_name='items'
    )
    name = models.CharField(max_length=100)
    image = models.URLField()
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(
        max_digits=5,
        decimal_places=2
    )

    def total(self):
        return self.price * self.quantity
