from django.urls import path
from .views import index, fish_page, dog_page, cat_page, contact, bird_page, \
    add_to_cart, cart_page, checkout, subscribe_view, account_view, register_view, \
    logout_view, login_view

urlpatterns = [
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('register/', register_view, name='register'),
    path("account/", account_view, name="account"),
    path("subscribe/", subscribe_view, name="subscribe"),
    path("", index, name="index"),
    path("fish/", fish_page, name="fish"),
    path("dogs/", dog_page, name="dogs"),
    path("cats/", cat_page, name="cats"),
    path("contact/", contact, name="contact"),
    path("birds/", bird_page, name="birds"),
    path("add_to_cart/", add_to_cart, name="add_to_cart"),
    path("cart/", cart_page, name="cart"),
    path('add_to_cart/', add_to_cart, name='add_to_cart'),
    path("checkout/", checkout, name="checkout"),
]
