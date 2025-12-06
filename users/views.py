from django.shortcuts import render, redirect
from django.http import HttpResponse
from .forms import SignupForm, LoginForm
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required
# Create your views here.

def homepage(request):
    return render(request,"users/homepage.html")

def signup_view(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data["password"])
            user.save()
            messages.success(request,"Your account has been created successfully! Please login.")
            return redirect ("users:login")
    else:
        form = SignupForm()

    return render(request, "users/signup.html",{"form":form})

def login_view(request):
    if request.method == "POST":
        form = LoginForm(request.POST)

        if form.is_valid():
            username = form.cleaned_data["username"]
            password = form.cleaned_data["password"]
            user = authenticate(request, username=username,password=password)

            if user is not None:
                login(request,user)
                return redirect("homepage")
            else:
                form.add_error(None,"Invalid username or password")
    else:
        form = LoginForm()

    return render(request, "users/login.html", {"form": form})

@login_required(login_url='users:login')
def home_view(request):
    return render(request, "users/homepage.html")

def logout_view(request):
    logout(request)
    return redirect("users:login")
