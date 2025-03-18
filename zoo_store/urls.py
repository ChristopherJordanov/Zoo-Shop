from django.urls import path
from .views import register, login_view, logout_view, index, fish_page, dog_page, cat_page, contact_page, bird_page, \
    add_to_cart, cart_page

urlpatterns = [
    path("register/", register, name="register"),
    path("login/", login_view, name="login"),
    path("logout/", logout_view, name="logout"),
    path("", index, name="index"),
    path("fish/", fish_page, name="fish"),
    path("dogs/", dog_page, name="dogs"),
    path("cats/", cat_page, name="cats"),
    path("contact/", contact_page, name="contact"),
    path("birds/", bird_page, name="birds"),
    path("add_to_cart/", add_to_cart, name="add_to_cart"),
    path("cart/", cart_page, name="cart"),
    path('add_to_cart/', add_to_cart, name='add_to_cart'),
]
