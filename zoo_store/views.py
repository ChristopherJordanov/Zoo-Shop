from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt


def index(request):
    return render(request, "index.html")


from django.shortcuts import render
# from .models import Order  # Ще добавим тази таблица после

def checkout(request):
    if request.method == "POST":
        name = request.POST["name"]
        email = request.POST["email"]
        address = request.POST["address"]

        # order = Order(name=name, email=email, address=address)
        # order.save()

        return render(request, "order_confirmation.html")

    return render(request, "checkout.html")



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


def cart_page(request):
    cart = request.session.get("cart", {})
    return render(request, "cart.html", {"cart": cart})


@login_required
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
