from django.db import models

class Violation(models.Model):
    worker = models.CharField(max_length=100)
    violation_type = models.CharField(max_length=100)
    confidence = models.FloatField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.worker} - {self.violation_type}"