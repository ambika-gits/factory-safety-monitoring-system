from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Violation
from .serializers import ViolationSerializer


# POST API
# Used by Member 2 (YOLO AI) to save violations
@api_view(['POST'])
def create_violation(request):
    serializer = ViolationSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)


# GET API
# Used by Member 4 (Dashboard) to fetch all violations
@api_view(['GET'])
def get_violations(request):
    violations = Violation.objects.all().order_by('-timestamp')

    serializer = ViolationSerializer(
        violations,
        many=True
    )

    return Response(serializer.data)