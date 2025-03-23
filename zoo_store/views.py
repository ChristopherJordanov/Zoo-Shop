import json

from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
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
from django.utils import timezone


def index(request):
    return render(request, "index.html")


def fish_page(request):
    return render(request, "fish.html")


def dog_page(request):
    return render(request, "dogs.html")


def cat_page(request):
    return render(request, "cats.html")


def contact(request):
    if request.method == "POST":
        name = request.POST.get("name")
        email = request.POST.get("email")
        phone = request.POST.get("phone")
        subject = request.POST.get("subject")
        message = request.POST.get("message")

        full_message = f"""
        New message from contact form:

        Name: {name}
        Email: {email}
        Phone: {phone}

        Subject: {subject}

        Message:
        {message}
        """

        send_mail(
            subject=f"Contact Form: {subject}",
            message=full_message,
            from_email="petpalsservice1@gmail.com",  # Must match your actual Gmail
            recipient_list=["petpalsservice1@gmail.com"],
            reply_to=[email],
            fail_silently=False,
        )

        print("📨 Contact form submitted")
        messages.success(request, "Message sent successfully!")
        return redirect("contact")  # or wherever you want to go after

    return render(request, "contact.html")


def bird_page(request):
    return render(request, "birds.html")


from django.shortcuts import render, redirect
from django.core.mail import send_mail
from .models import CheckoutInfo
from django.utils import timezone


def cart_page(request):
    cart = request.session.get("cart", {})
    return render(request, "cart.html", {"cart": cart})


def checkout(request):
    # 🐾 Debug cart at the moment of checkout
    print("🐾 SESSION CART DURING CHECKOUT:", request.session.get("cart"))

    cart = request.session.get("cart", {})
    cart_items = []
    total_price = 0

    # Build cart list + total (works for GET and POST)
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
            payment_token=data.get("cardNumber"),
            expiration_date=data.get("expDate"),
            cvv=data.get("cvv"),
            created_at=timezone.now()
        )

        # Build item list for email
        item_lines = "\n".join(
            f"- {item['name']} x{item['quantity']} = ${item['total']:.2f}" for item in cart_items
        ) if cart_items else "No items found in your cart."

        message_body = f"""Hi {data.get('firstName')},

Thank you for your order! 🐾

Here’s what you purchased:

{item_lines}

Total: ${total_price:.2f}

We'll begin processing your order shortly.

– PetPals Team"""

        send_mail(
            subject="Your Order Confirmation 🐾",
            message=message_body,
            from_email=None,
            recipient_list=[data.get("email")],
            fail_silently=False,
        )

        # Clear the cart
        request.session["cart"] = {}
        request.session.modified = True

        return redirect("index")

    return render(request, "index.html", {
        "cart_items": cart_items,
        "total_price": total_price,
        "show_checkout": True
    })

@csrf_exempt
def add_to_cart(request):
    if request.method == "POST":
        data = json.loads(request.body)

        product_id = data.get("product_id")
        name = data.get("name")
        price = float(data.get("price"))
        image = data.get("image")

        if not product_id:
            return JsonResponse({"error": "Missing product ID"}, status=400)

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

        return JsonResponse({"message": "Added to cart", "cart": cart})

    return JsonResponse({"error": "POST required"}, status=405)
