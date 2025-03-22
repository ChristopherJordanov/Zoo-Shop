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


@csrf_exempt  # Temporarily disable CSRF for testing
@require_POST  # Ensure the method is POST
def checkout_view(request):
    try:
        # Parse the incoming JSON request
        data = json.loads(request.body)

        # Ensure the data looks correct
        print("Django received data:", data)

        # Create the checkout info entry in the database
        checkout_info = CheckoutInfo.objects.create(
            first_name=data['first_name'],
            last_name=data['last_name'],
            email=data['email'],
            phone_num=data['phone_num'],
            street_address=data['street_address'],
            city=data['city'],
            state=data['state'],
            zip_code=data['zip_code'],
            country=data['country_reference'],  # Directly save the country reference
            name_on_card=data['name_on_card'],
            payment_token=data['payment_token'],
            expiration_date=data['expiration_date'],
            cvv=data['cvv']
        )

        return JsonResponse({'message': 'Checkout successful!'}, status=201)

    except Exception as e:
        print(f"Error: {e}")
        return JsonResponse({'error': str(e)}, status=400)
