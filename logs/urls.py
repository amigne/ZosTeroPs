from django.urls import path

from . import views


app_name = 'logs'


urlpatterns = [
    # Logs
    path('', views.LogsListView.as_view(), name='list'),
    path('<pk>/', views.LogsDetailView.as_view(), name='detail'),
]
