from django.views.generic.base import ContextMixin as BaseContextMixin


class ContextMixin(BaseContextMixin):
    """ Mixin that sets some context data common to the different view classes. """

    def get_context_data(self, **kwargs):
        context_data = super().get_context_data(**kwargs)

        # Workaround as self.object is not defined for list and detail views
        obj = getattr(self, 'object', None)

        if hasattr(self, 'formset_class'):
            if self.request.POST:
                context_data['formset'] = self.formset_class(self.request.POST, instance=obj)
            else:
                context_data['formset'] = self.formset_class(instance=obj)

        for attr in ['can_add', 'can_change', 'can_delete', 'can_list',
                     'can_view', 'list_fields', 'menu_item',
                     'object_description', 'object_description_plural',
                     'url_create']:
            if hasattr(self, attr):
                context_data[attr] = getattr(self, attr, None)

        return context_data
