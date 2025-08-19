from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, SongViewSet, LayerListView, LayerDetailView

# Use a router for the SongViewSet to get all CRUD endpoints automatically
router = DefaultRouter()
router.register(r'songs', SongViewSet, basename='song')

urlpatterns = [
    path('', include(router.urls)),
    # Endpoint for listing all layers of a specific song or creating a new one
    path('songs/<int:song_pk>/layers/', LayerListView.as_view(), name='layer-list'),
    # Endpoint for retrieving, updating, or deleting a specific layer
    path('songs/<int:song_pk>/layers/<int:layer_pk>/', LayerDetailView.as_view(), name='layer-detail'),
    # User registration endpoint
    path('register/', RegisterView.as_view(), name='register'),
]
