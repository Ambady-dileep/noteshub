from django.shortcuts import render, redirect
from django.http import HttpResponse
from .forms import SignupForm
# Create your views here.

def homepage(request):
    return render(request,"users/homepage.html")

def signup_view(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            user = form.save(commit=False)
            user.set_password(form.cleaned_data["Password"])
            user.save()
            return redirect ("users:login")
    else:
        form = SignupForm()

    return render(request, "users/signup.html",{"form":form})

def login_view(request):
    return render(request, "users/login.html")

def logout_view(request):
    return HttpResponse("Logging out...")