from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Song, Layer

class LayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Layer
        fields = ['id', 'name', 'index', 'data']

class SongListSerializer(serializers.ModelSerializer):
    layer_count = serializers.IntegerField(source='layers.count', read_only=True)

    class Meta:
        model = Song
        fields = ['id', 'name', 'layer_count', 'created_at']

class SongDetailSerializer(serializers.ModelSerializer):
    layers = LayerSerializer(many=True, read_only=True)

    class Meta:
        model = Song
        fields = ['id', 'name', 'layers', 'created_at']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['username'], password=validated_data['password'])
        return user
