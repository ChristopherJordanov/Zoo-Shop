import json

from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.utils.html import format_html
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.shortcuts import render
from zoo_store.models import CheckoutInfo


def index(request):
    return render(request, "index.html")


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
    cart = request.session.get("cart", {})
    cart_items = []
    total_price = 0

    # build cart summary for template
    for item in cart.values():
        item_total = item["price"] * item["quantity"]
        total_price += item_total
        cart_items.append({
            "name": item["name"],
            "image": item["image"],
            "price": item["price"],
            "quantity": item["quantity"],
            "total": item_total
        })

    # POST: Save to DB
    if request.method == "POST":
        data = request.POST

        CheckoutInfo.objects.create(
            first_name=data.get("firstName"),
            last_name=data.get("lastName"),
            email=data.get("email"),
            phone_num=data.get("phone"),
            street_address=data.get("address"),
            city=data.get("city"),
            state=data.get("state"),
            zip_code=data.get("zip"),
            country=data.get("country"),
            name_on_card=data.get("cardName"),
            payment_token=data.get("cardNumber"),  # ⚠️ placeholder, use Stripe/etc. in real app
            expiration_date=data.get("expDate"),
            cvv=data.get("cvv"),
        )

        # Optional: clear the cart
        request.session["cart"] = {}
        request.session.modified = True

        return redirect("index")  # or 'order_success' page

    return render(request, "index.html", {
        "cart_items": cart_items,
        "total_price": total_price,
        "show_checkout": True
    })


def cart_page(request):
    cart = request.session.get("cart", {})
    return render(request, "cart.html", {"cart": cart})


@csrf_exempt
def add_to_cart(request):
    if request.method == "POST":
        data = json.loads(request.body)

        product_id = data.get("product_id")
        name = data.get("name")
        price = float(data.get("price"))
        image = data.get("image")

        if not product_id:
            return JsonResponse({"error": "Missing product_id"}, status=400)

        if "cart" not in request.session:
            request.session["cart"] = {}

        cart = request.session["cart"]

        if product_id in cart:
            cart[product_id]["quantity"] += 1
        else:
            cart[product_id] = {
                "name": name,
                "price": price,
                "image": image,
                "quantity": 1
            }

        request.session.modified = True

        print("CART:", request.session["cart"])  # <--- PRINT THIS

        return JsonResponse({"message": "Added to cart!", "cart": cart})


