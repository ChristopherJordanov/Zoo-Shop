import json

from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.http import require_POST

from zoo_store.models import CheckoutInfo


def index(request):
    return render(request, "index.html")


from django.shortcuts import render


def fish_page(request):
    return render(request, "fish.html")


def dog_page(request):
    return render(request, "dogs.html")


def cat_page(request):
    return render(request, "cats.html")


def contact_page(request):
    return render(request, "contact.html")


def bird_page(request):
    return render(request, "birds.html")


def checkout(request):
    return render(request, "checkout.html")


def cart_page(request):
    cart = request.session.get("cart", {})
    return render(request, "cart.html", {"cart": cart})


@csrf_exempt
def add_to_cart(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "User not logged in"}, status=401)

    product_id = request.POST.get("product_id")

    if "cart" not in request.session:
        request.session["cart"] = {}

    cart = request.session["cart"]

    if product_id in cart:
        cart[product_id] += 1
    else:
        cart[product_id] = 1

    request.session["cart"] = cart
    request.session.modified = True

    return JsonResponse({"message": "Product added to cart!", "cart": cart})

