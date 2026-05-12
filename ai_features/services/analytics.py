from django.db.models import Count, Sum, F, FloatField
from django.db.models.functions import TruncDate
from django.utils import timezone
from datetime import timedelta


def get_trending_products(days: int = 30, limit: int = 5) -> list:
    from order.models import OrderItem
    since = timezone.now() - timedelta(days=days)
    results = (
        OrderItem.objects
        .filter(order_id__date__gte=since)
        .values('product__id', 'product__name')
        .annotate(total_kg=Sum('amount'), order_count=Count('order_id', distinct=True))
        .order_by('-total_kg')[:limit]
    )
    return [
        {
            "product_id": r['product__id'],
            "name": r['product__name'],
            "total_kg_ordered": r['total_kg'],
            "distinct_orders": r['order_count'],
        }
        for r in results
    ]


def get_revenue_by_product() -> list:
    from order.models import OrderItem
    results = (
        OrderItem.objects
        .values('product__id', 'product__name')
        .annotate(
            revenue=Sum(F('amount') * F('price'), output_field=FloatField()),
            kg=Sum('amount'),
        )
        .order_by('-revenue')
    )
    return [
        {
            "product_id": r['product__id'],
            "name": r['product__name'],
            "revenue_bdt": round(r['revenue'] or 0, 2),
            "kg_sold": r['kg'] or 0,
        }
        for r in results
    ]


def get_busiest_dates(limit: int = 10) -> list:
    from order.models import Order
    results = (
        Order.objects
        .annotate(day=TruncDate('date'))
        .values('day')
        .annotate(orders=Count('id'), revenue=Sum('total_price'))
        .order_by('-orders')[:limit]
    )
    return [
        {
            "date": r['day'].isoformat(),
            "order_count": r['orders'],
            "revenue_bdt": round(r['revenue'] or 0, 2),
        }
        for r in results
    ]


def get_low_stock_alerts(threshold: int = 50) -> list:
    from product.models import Product
    return [
        {
            "product_id": p.id,
            "name": p.get_name_display(),
            "quantity_kg": p.quantity,
            "available": p.availability,
            "alert": "out_of_stock" if not p.availability else "low_stock",
        }
        for p in Product.objects.filter(quantity__lt=threshold)
    ]


def get_full_analytics(days: int = 30) -> dict:
    return {
        "period_days": days,
        "trending_products": get_trending_products(days=days),
        "revenue_by_product": get_revenue_by_product(),
        "busiest_dates": get_busiest_dates(),
        "low_stock_alerts": get_low_stock_alerts(),
    }
