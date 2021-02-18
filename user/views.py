from django.contrib.auth import views as auth_views
from django.urls import reverse_lazy

class LoginContextMixin:
    menu_item = 'login'

    def get_context_data(self, **kwargs):
        context_data = super().get_context_data(**kwargs)
        context_data['menu_item'] = self.menu_item

        return context_data


class LoginView(LoginContextMixin, auth_views.LoginView):
    pass


class PasswordChangeView(LoginContextMixin, auth_views.PasswordChangeView):
    success_url = reverse_lazy('user:password_change_done')
    menu_item = 'user_profile'


class PasswordChangeDoneView(LoginContextMixin, auth_views.PasswordChangeDoneView):
    menu_item = 'user_profile'


class PasswordResetView(LoginContextMixin, auth_views.PasswordResetView):
    success_url = reverse_lazy('user:password_reset_done')


class PasswordResetDoneView(LoginContextMixin, auth_views.PasswordResetDoneView):
    pass


class PasswordResetConfirmView(LoginContextMixin, auth_views.PasswordResetConfirmView):
    success_url = reverse_lazy('user:password_reset_complete')


class PasswordResetCompleteView(LoginContextMixin, auth_views.PasswordResetCompleteView):
    pass
