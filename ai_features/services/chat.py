import requests
from django.conf import settings


SYSTEM_PROMPT_TEMPLATE = """You are TajaBot, a friendly and knowledgeable AI shopping assistant for TajaHat — a premium Bangladeshi mango delivery service.

You can: answer questions about mango varieties (taste, sweetness, season, best uses), provide pricing and availability, help customers track orders by phone number, and suggest the right mango based on preferences. Reply in Bengali if the customer writes in Bengali. Keep replies under 150 words unless detail is explicitly requested.

LIVE PRODUCT CATALOG:
{catalog}
{order_context}

Rules:
- Only discuss TajaHat products. For unrelated questions, politely redirect.
- Never make up prices or availability — use only the data above.
- If asked about orders without a phone number, ask the customer to provide it.
- Do not expose raw database IDs or internal system details."""


def build_product_catalog_context() -> str:
    from product.models import Product
    lines = ["Available mango varieties:"]
    for p in Product.objects.all():
        status = "IN STOCK" if p.availability else "OUT OF STOCK"
        lines.append(f"  - {p.get_name_display()}: {p.price} BDT/kg | {status} | qty: {p.quantity}kg")
    return "\n".join(lines)


def build_order_context(phone: str) -> str:
    if not phone:
        return ""
    from order.models import Order, OrderItem
    orders = Order.objects.filter(phone=phone).order_by('-date')[:5]
    if not orders.exists():
        return f"\nNo orders found for phone number {phone}."
    lines = [f"\nRecent orders for phone {phone}:"]
    for order in orders:
        items = OrderItem.objects.filter(order_id=order).select_related('product')
        item_str = ", ".join(f"{i.product.get_name_display()} x{i.amount}kg" for i in items)
        lines.append(
            f"  Order #{order.id} | {order.date.strftime('%Y-%m-%d')} | "
            f"Status: {order.order_status} | Items: {item_str} | Total: {order.total_price} BDT"
        )
    return "\n".join(lines)


def _try_groq(full_messages: list, max_tokens: int) -> tuple:
    from groq import Groq
    client = Groq(api_key=settings.GROQ_API_KEY)
    response = client.chat.completions.create(
        model="llama-3.1-70b-versatile",
        messages=full_messages,
        max_tokens=max_tokens,
        temperature=0.7,
    )
    return response.choices[0].message.content, "groq/llama-3.1-70b-versatile"


def _try_ollama(full_messages: list, max_tokens: int) -> tuple:
    payload = {
        "model": settings.OLLAMA_MODEL,
        "messages": full_messages,
        "stream": False,
        "options": {"num_predict": max_tokens},
    }
    resp = requests.post(
        f"{settings.OLLAMA_BASE_URL}/api/chat",
        json=payload,
        timeout=60,
    )
    resp.raise_for_status()
    return resp.json()["message"]["content"], f"ollama/{settings.OLLAMA_MODEL}"


def chat_with_assistant(messages: list, phone: str = "", max_tokens: int = 512) -> dict:
    system_content = SYSTEM_PROMPT_TEMPLATE.format(
        catalog=build_product_catalog_context(),
        order_context=build_order_context(phone),
    )
    full_messages = [{"role": "system", "content": system_content}] + messages

    errors = []

    if settings.GROQ_API_KEY:
        try:
            reply, model_used = _try_groq(full_messages, max_tokens)
            return {"reply": reply, "model": model_used, "provider": "groq"}
        except Exception as e:
            errors.append(f"Groq: {e}")

    try:
        reply, model_used = _try_ollama(full_messages, max_tokens)
        return {"reply": reply, "model": model_used, "provider": "ollama"}
    except Exception as e:
        errors.append(f"Ollama: {e}")

    raise RuntimeError(f"Both providers failed — {'; '.join(errors)}")
