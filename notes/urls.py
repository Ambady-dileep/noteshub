from django.urls import path
from . import views

app_name = 'notes'

urlpatterns = [
    path("", views.notes_list, name="notes_list"),
    path("add/", views.add_note, name="add_note"),
    path("edit/<int:pk>/", views.edit_note, name="edit_note"),
    path("delete/<int:pk>/", views.delete_note, name="delete_note"),
    path("chatbot/", views.chatbot, name="chatbot"),
]
