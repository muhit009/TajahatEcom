from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAdminUser


class ChatView(APIView):
    permission_classes = []

    def post(self, request):
        messages = request.data.get('messages', [])
        phone = request.data.get('phone', '').strip()

        if not messages or not isinstance(messages, list):
            return Response(
                {"error": "messages field is required and must be a non-empty list"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        for msg in messages:
            if not isinstance(msg, dict) or 'role' not in msg or 'content' not in msg:
                return Response(
                    {"error": "Each message must have 'role' and 'content' fields"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            if msg['role'] not in ('user', 'assistant'):
                return Response(
                    {"error": "Message role must be 'user' or 'assistant'"},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        try:
            from ai_features.services.chat import chat_with_assistant
            result = chat_with_assistant(messages=messages, phone=phone)
            return Response(result, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(
                {"error": "AI service unavailable", "detail": str(e)},
                status=status.HTTP_502_BAD_GATEWAY,
            )


class RecommendationView(APIView):
    permission_classes = []

    def get(self, request, product_id):
        from product.models import Product
        from ai_features.services.recommendations import get_recommendations

        top_n = max(1, min(int(request.query_params.get('top_n', 3)), 9))

        try:
            product = Product.objects.get(id=product_id)
        except Product.DoesNotExist:
            return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

        result = get_recommendations(product_id=product_id, top_n=top_n)

        if isinstance(result, dict) and "error" in result:
            return Response(result, status=status.HTTP_503_SERVICE_UNAVAILABLE)

        return Response({
            "product_id": product.id,
            "product_name": product.get_name_display(),
            "recommendations": result,
        }, status=status.HTTP_200_OK)


class AnalyticsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        from ai_features.services.analytics import get_full_analytics

        try:
            days = max(1, min(int(request.query_params.get('days', 30)), 365))
        except (ValueError, TypeError):
            days = 30

        return Response(get_full_analytics(days=days), status=status.HTTP_200_OK)
