from django.contrib.auth import views as auth_views, get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.shortcuts import get_object_or_404
from django.urls import reverse_lazy
from django.utils.translation import gettext_lazy as _
from django.views.generic.edit import UpdateView

from .models import User


class UserProfileUpdateView(LoginRequiredMixin, SuccessMessageMixin, UpdateView):
    model = get_user_model()
    template_name = 'user/profile_form.html'
    menu_item = 'user_profile'
    fields = ['email', 'first_name', 'last_name']
    success_url = reverse_lazy('user:profile')
    success_message = _('Your profile has successfully been updated.')

    def get_object(self, **kwargs):
        return get_object_or_404(User, pk=self.request.user.pk)

    def get_context_data(self, **kwargs):
        context_data = super().get_context_data(**kwargs)
        context_data['menu_item'] = 'user_profile'

        return context_data


class LoginContextMixin:
    menu_item = 'login'

    def get_context_data(self, **kwargs):
        context_data = super().get_context_data(**kwargs)
        context_data['menu_item'] = self.menu_item

        return context_data


class LoginView(LoginContextMixin, auth_views.LoginView):
    pass


class PasswordChangeView(LoginContextMixin, SuccessMessageMixin, auth_views.PasswordChangeView):
    success_url = reverse_lazy('home')
    menu_item = 'user_profile'
    success_message = _('Your password has successfully been updated.')


class PasswordResetView(LoginContextMixin, auth_views.PasswordResetView):
    success_url = reverse_lazy('user:password_reset_done')


class PasswordResetDoneView(LoginContextMixin, auth_views.PasswordResetDoneView):
    pass


class PasswordResetConfirmView(LoginContextMixin, SuccessMessageMixin, auth_views.PasswordResetConfirmView):
    success_url = reverse_lazy('user:login')
    success_message = _('Your new password has been set. You can now login.')
