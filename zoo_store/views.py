from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages
from django.views.decorators.csrf import csrf_exempt


def index(request):
    return render(request, "index.html")


def register(request):
    if request.method == "POST":
        full_name = request.POST["name"]
        email = request.POST["email"]
        password = request.POST["password"]
        confirm_password = request.POST["confirmPassword"]

        if password == confirm_password:
            if User.objects.filter(email=email).exists():
                messages.error(request, "Email already registered!")
            else:
                # Разделяме full_name на първо и фамилно име
                name_parts = full_name.split()
                first_name = name_parts[0] if len(name_parts) > 0 else ""
                last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""

                user = User.objects.create_user(
                    username=full_name,  # Django изисква username
                    email=email,
                    password=password,
                    first_name=first_name,
                    last_name=last_name
                )
                user.save()
                messages.success(request, "Registration successful! Please log in.")
                return redirect("index")
        else:
            messages.error(request, "Passwords do not match!")

    return redirect("index")


def login_view(request):
    if request.method == "POST":
        email = request.POST["email"]
        password = request.POST["password"]

        try:
            user = User.objects.get(email=email)  # Взимаме потребителя по email
            user = authenticate(request, username=user.username, password=password)  # Логваме по username
        except User.DoesNotExist:
            user = None

        if user is not None:
            login(request, user)
            messages.success(request, "Successfully logged in!")
            return redirect(request.GET.get("next", "index"))
        else:
            messages.error(request, "Invalid email or password!")
            return render(request, "login.html", {"error": "Invalid email or password"})

    return render(request, "login.html")


def logout_view(request):
    logout(request)
    return redirect("index")


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
