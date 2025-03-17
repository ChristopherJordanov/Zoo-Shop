from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.contrib import messages


def index(request):
    return render(request, "index.html")


def register(request):
    if request.method == "POST":
        username = request.POST["name"]
        email = request.POST["email"]
        password = request.POST["password"]
        confirm_password = request.POST["confirmPassword"]

        if password == confirm_password:
            if User.objects.filter(email=email).exists():
                messages.error(request, "Email already registered!")
            else:
                user = User.objects.create_user(username=username, email=email, password=password)
                user.save()
                messages.success(request, "Registration successful! Please log in.")
                return redirect("index")  # Връща към главната страница след регистрация
        else:
            messages.error(request, "Passwords do not match!")

    return redirect("index")  # Ако има грешка, пак се връща в index.html

def login_view(request):
    if request.method == "POST":
        email = request.POST["email"]
        password = request.POST["password"]
        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            return redirect("index")  # Връща към главната страница след успешен логин
        else:
            messages.error(request, "Invalid email or password!")

    return redirect("index")  # Ако има грешка, пак се връща в index.html


def logout_view(request):
    logout(request)
    return redirect("index")
