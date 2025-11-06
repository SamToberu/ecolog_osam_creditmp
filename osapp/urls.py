from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name = 'index'),
    path('login', views.login, name = 'login'),
    path('clientpool2',views.clientpool2, name = 'clientpools2')
]