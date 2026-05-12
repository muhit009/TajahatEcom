from django.core.management.base import BaseCommand, CommandError
from product.models import Product
from ai_features.models import ProductEmbedding
from ai_features.services.recommendations import compute_embedding, build_product_text


class Command(BaseCommand):
    help = "Generate sentence-transformers embeddings for all products. Safe to re-run — updates existing embeddings."

    def add_arguments(self, parser):
        parser.add_argument('--force', action='store_true', help='Regenerate even if text is unchanged')
        parser.add_argument('--product-id', type=int, default=None, help='Only regenerate for this product ID')

    def handle(self, *args, **options):
        force = options['force']
        single_id = options['product_id']

        if single_id:
            try:
                products = [Product.objects.get(id=single_id)]
            except Product.DoesNotExist:
                raise CommandError(f"Product id={single_id} does not exist")
        else:
            products = list(Product.objects.all())

        if not products:
            self.stdout.write(self.style.WARNING("No products in database."))
            return

        self.stdout.write("Loading sentence-transformers model (first run downloads ~80MB)...")

        created = updated = skipped = 0

        for product in products:
            text = build_product_text(product)
            existing = ProductEmbedding.objects.filter(product=product).first()

            if existing and not force and existing.embedded_text == text:
                self.stdout.write(f"  SKIP   {product.get_name_display()}")
                skipped += 1
                continue

            vector = compute_embedding(text)

            if existing:
                existing.set_vector(vector)
                existing.embedded_text = text
                existing.save()
                self.stdout.write(self.style.SUCCESS(f"  UPDATE {product.get_name_display()}"))
                updated += 1
            else:
                emb = ProductEmbedding(product=product, embedded_text=text)
                emb.set_vector(vector)
                emb.save()
                self.stdout.write(self.style.SUCCESS(f"  CREATE {product.get_name_display()}"))
                created += 1

        self.stdout.write(self.style.SUCCESS(
            f"\nDone. Created: {created}  Updated: {updated}  Skipped: {skipped}"
        ))
