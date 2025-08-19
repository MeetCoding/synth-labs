from django.shortcuts import get_object_or_404
from rest_framework import generics, viewsets, status
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Song, Layer
from .serializers import RegisterSerializer, SongListSerializer, SongDetailSerializer, LayerSerializer

# --- User Registration ---
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

# --- Song Views ---
class SongViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Only return songs owned by the current user
        return self.request.user.songs.all()

    def get_serializer_class(self):
        # Use a different serializer for list vs. detail action
        if self.action == 'list':
            return SongListSerializer
        return SongDetailSerializer

    def perform_create(self, serializer):
        # When creating a new song, automatically set the owner
        song = serializer.save(owner=self.request.user)
        # Add one default layer as requested
        Layer.objects.create(song=song, name="Default Layer", index=0)

# --- Layer Views ---
class LayerListView(generics.ListCreateAPIView):
    serializer_class = LayerSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        song = get_object_or_404(Song, pk=self.kwargs['song_pk'], owner=self.request.user)
        return song.layers.all()

    def perform_create(self, serializer):
        song = get_object_or_404(Song, pk=self.kwargs['song_pk'], owner=self.request.user)
        # Determine the next index for the new layer
        last_layer = song.layers.order_by('index').last()
        new_index = last_layer.index + 1 if last_layer else 0
        serializer.save(song=song, index=new_index)

class LayerDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = LayerSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Fetch the layer, ensuring it belongs to a song owned by the user
        layer = get_object_or_404(Layer, pk=self.kwargs['layer_pk'])
        if layer.song.owner != self.request.user:
            self.permission_denied(self.request)
        return layer
