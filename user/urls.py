from django.contrib.auth.views import LogoutView
from django.urls import path

from .views import (UserProfileUpdateView,
                    LoginView, PasswordChangeView,
                    PasswordResetView, PasswordResetDoneView,
                    PasswordResetConfirmView)

app_name = 'user'

urlpatterns = [
    path('profile/', UserProfileUpdateView.as_view(), name='profile'),

    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),

    path('password_change/', PasswordChangeView.as_view(), name='password_change'),

    path('password_reset/', PasswordResetView.as_view(), name='password_reset'),
    path('password_reset/done/', PasswordResetDoneView.as_view(), name='password_reset_done'),
    path('reset/<uidb64>/<token>/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
]
