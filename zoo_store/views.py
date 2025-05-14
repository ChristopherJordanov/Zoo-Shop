import json

from django.contrib.auth.decorators import login_required
from django.core.exceptions import ObjectDoesNotExist
from django.core.mail import send_mail
from django.http import JsonResponse, HttpResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.template.defaultfilters import slugify
from django.utils.crypto import get_random_string
from django.utils.html import format_html
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.core.mail import EmailMessage
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.shortcuts import render
from zoo_store.models import CheckoutInfo, Profile
from django.contrib.auth.models import User
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

        email_message = EmailMessage(
            subject=f"Contact Form: {subject}",
            body=full_message,
            from_email="fluffemoservice@gmail.com",
            to=["fluffemoservice@gmail.com"],
            reply_to=[email],
        )

        email_message.send(fail_silently=False)

        messages.success(request, "Message sent successfully!")
        return render(request, "index.html")

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
    # 👇 If coming from the JS-based form with cartData
    if request.method == "POST" and "cartData" in request.POST:
        try:
            cart_json = request.POST.get("cartData")
            cart_dict = json.loads(cart_json)
            request.session["cart"] = cart_dict
            request.session.modified = True
        except Exception as e:
            print("Error parsing cart data:", e)

    print("🐾 SESSION CART DURING CHECKOUT:", request.session.get("cart"))

    # 🛒 Rebuild cart from session
    cart = request.session.get("cart", {})
    cart_items = []
    total_price = 0

    for name, item in cart.items():  # fixed here
        item_total = item["price"] * item["quantity"]
        total_price += item_total
        cart_items.append({
            "name": name,  # product name from key
            "image": item.get("image", ""),
            "price": item.get("price", 0),
            "quantity": item.get("quantity", 1),
            "total": item_total
        })

    # 💳 Form submission with billing + payment info
    if request.method == "POST" and "firstName" in request.POST:
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
        )

        # 📨 Email with order summary
        item_lines = "\n".join(
            f"- {item['name']} x{item['quantity']} = ${item['total']:.2f}" for item in cart_items
        ) if cart_items else "No items found in your cart."

        message_body = f"""Hi {data.get('firstName')},

Thank you for your order!

Here’s what you purchased:

{item_lines}

Total: ${total_price:.2f}

We'll begin processing your order shortly.

– PetPals Team"""

        send_mail(
            subject="Your Order Confirmation",
            message=message_body,
            from_email=None,
            recipient_list=[data.get("email")],
            fail_silently=False,
        )

        # 🧹 Clear cart
        request.session["cart"] = {}
        request.session.modified = True

        return redirect("index")

    return render(request, "checkout.html", {
        "cart_items": cart_items,
        "total_price": total_price
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


@csrf_protect
def subscribe_view(request):
    if request.method == "POST":
        email = request.POST.get("email")

        # Send a cute little welcome email
        send_mail(
            subject="Thanks for subscribing to Fluffemo 🐾",
            message="Hey there!\n\nThanks for subscribing to Fluffemo's newsletter. Get ready for pet tips, exclusive offers, and furry goodness right in your inbox!",
            from_email="petpalsservice1@gmail.com",
            recipient_list=[email],
            fail_silently=False
        )

        messages.success(request, "You've successfully subscribed!")
        email = request.POST.get("email")
        return redirect("index")  # or any page you want

    return redirect("index")


def login_view(request):
    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        user = None
        users = User.objects.filter(email=email)
        if users.exists():
            user_obj = users.first()  # use first match if duplicates exist
            user = authenticate(request, username=user_obj.username, password=password)

        if user is not None:
            login(request, user)
            return redirect('index')

        return render(request, "login_register.html", {
            "error": "Invalid email or password."
        })

    return render(request, "login_register.html")


def register_view(request):
    if request.method == "POST":
        full_name = request.POST.get("full_name")
        email = request.POST.get("email")
        password = request.POST.get("password")

        # Generate a unique username from the full name
        base_username = slugify(full_name)
        username = base_username
        while User.objects.filter(username=username).exists():
            username = f"{base_username}-{get_random_string(4)}"

        # ✅ Create the user with hashed password
        user = User.objects.create_user(username=username, email=email, password=password)

        # ✅ Store additional info in your custom Profile model
        Profile.objects.create(
            user=user,
            full_name=full_name,
            email=email
        )

        # ✅ Log them in
        login(request, user)

        # ✅ Send welcome email
        send_mail(
            subject="Welcome to PetPals!",
            message=f"Hi {full_name}, thanks for registering with PetPals!",
            from_email="petpalsservice1@gmail.com",
            recipient_list=[email],
            fail_silently=True
        )

        return redirect('index')  # Homepage
    return render(request, "login_register.html")


def logout_view(request):
    logout(request)
    return redirect('index')


@login_required(login_url='login')
def account_view(request):
    return render(request, 'account.html')
