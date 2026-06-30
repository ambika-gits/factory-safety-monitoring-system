from django.urls import path
from .views import create_violation, get_violations

urlpatterns = [
    path('violation/', create_violation),
    path('violations/', get_violations),
]