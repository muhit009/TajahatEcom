from django.urls import path
from .views import ChatView, RecommendationView, AnalyticsView

urlpatterns = [
    path('chat/', ChatView.as_view(), name='ai_chat'),
    path('recommendations/<int:product_id>/', RecommendationView.as_view(), name='ai_recommendations'),
    path('analytics/', AnalyticsView.as_view(), name='ai_analytics'),
]
