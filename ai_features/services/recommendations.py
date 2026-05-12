import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from django.db.models import Count

_model = None


def _get_model():
    global _model
    if _model is None:
        from sentence_transformers import SentenceTransformer
        _model = SentenceTransformer('all-MiniLM-L6-v2')
    return _model


def build_product_text(product) -> str:
    status = "available" if product.availability else "out of stock"
    return f"{product.get_name_display()} mango - {product.price} BDT/kg - {status}"


def compute_embedding(text: str) -> list:
    return _get_model().encode(text, convert_to_numpy=True).tolist()


def get_co_purchase_scores(product_id: int, candidate_ids: list) -> dict:
    from order.models import OrderItem
    shared_orders = (
        OrderItem.objects
        .filter(product_id=product_id)
        .values_list('order_id_id', flat=True)
    )
    co_counts = (
        OrderItem.objects
        .filter(order_id_id__in=shared_orders)
        .exclude(product_id=product_id)
        .values('product_id')
        .annotate(count=Count('id'))
    )
    scores = {r['product_id']: r['count'] for r in co_counts}
    if scores:
        max_count = max(scores.values())
        scores = {pid: c / max_count for pid, c in scores.items()}
    return scores


def get_recommendations(product_id: int, top_n: int = 3):
    from ai_features.models import ProductEmbedding

    try:
        target = ProductEmbedding.objects.get(product_id=product_id)
    except ProductEmbedding.DoesNotExist:
        return {"error": "Embeddings not generated. Run: python manage.py generate_embeddings"}

    others = list(
        ProductEmbedding.objects
        .select_related('product')
        .exclude(product_id=product_id)
    )
    if not others:
        return []

    target_vec = np.array(target.get_vector()).reshape(1, -1)
    other_vecs = np.array([e.get_vector() for e in others])
    sim_scores = cosine_similarity(target_vec, other_vecs)[0]
    co_scores = get_co_purchase_scores(product_id, [e.product_id for e in others])

    results = []
    for idx, emb in enumerate(others):
        sim = float(sim_scores[idx])
        co = co_scores.get(emb.product_id, 0.0)
        combined = round(0.6 * sim + 0.4 * co, 4)
        results.append({
            "product_id": emb.product_id,
            "name": emb.product.get_name_display(),
            "price": emb.product.price,
            "availability": emb.product.availability,
            "similarity_score": round(sim, 4),
            "co_purchase_score": round(co, 4),
            "combined_score": combined,
        })

    return sorted(results, key=lambda x: x['combined_score'], reverse=True)[:top_n]
