from django.db import models
from django.contrib.auth.models import User

def get_default_layer_data():
    """Returns the default JSON structure for a new layer."""
    return {
      "volume": -6, "pitch": "C4", "waveform": "sawtooth", "panning": 0,
      "eq": {"low": 0, "mid": 0, "high": 0},
      "adsr": {"attack": 0.01, "decay": 0.2, "sustain": 0.5, "release": 0.8},
      "effects": {
        "reverb": {"enabled": False, "decay": 1.5, "wet": 0},
        "feedbackDelay": {"enabled": False, "delayTime": "8n", "feedback": 0.5, "wet": 0},
        "chorus": {"enabled": False, "frequency": 1.5, "depth": 0.7, "wet": 0},
        "distortion": {"enabled": False, "distortion": 0, "wet": 0},
        "phaser": {"enabled": False, "frequency": 0.5, "octaves": 3, "baseFrequency": 350},
        "flanger": {"enabled": False, "speed": 0.5, "depth": 0.5},
        "vibrato": {"enabled": False, "frequency": 5, "depth": 0.1},
        "compressor": {"enabled": False, "threshold": -24, "ratio": 12}
      }
    }

class Song(models.Model):
    owner = models.ForeignKey(User, related_name='songs', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name

class Layer(models.Model):
    song = models.ForeignKey(Song, related_name='layers', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    # JSONField is perfect for storing your complex layer object
    data = models.JSONField(default=get_default_layer_data)
    # This helps in ordering layers within a song
    index = models.PositiveIntegerField()

    class Meta:
        # Ensures each layer index is unique within a song
        unique_together = ('song', 'index')
        ordering = ['index']

    def __str__(self):
        return f"{self.song.name} - Layer {self.index}: {self.name}"
