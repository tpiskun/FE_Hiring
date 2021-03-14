import json
import requests
from itertools import groupby
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.db import IntegrityError
from django.http import JsonResponse
from django.shortcuts import HttpResponse, HttpResponseRedirect, render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
def index(request):
    if request.method == "GET":
        return render(request, "Fetch/index.html")
