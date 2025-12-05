from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.

def homepage(request):
    return render(request,"users/homepage.html")

def signup_view(request):
    return render(request, "users/signup.html")

def login_view(request):
    return render(request, "users/login.html")

def logout_view(request):
    return HttpResponse("Logging out...")