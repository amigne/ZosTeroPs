from django.contrib.auth import views as auth_views


class LoginView(auth_views.LoginView):
    menu_item = 'login'

    def get_context_data(self, **kwargs):
        context_data = super().get_context_data(**kwargs)
        context_data['menu_item'] = self.menu_item

        return context_data
