import { config } from "dotenv";
import { resolve } from "path";

// Загружаем переменные окружения из .env.local
config({ path: resolve(process.cwd(), ".env.local") });

import { sql, closeConnection } from "../lib/db/connection";
import { generateSlug } from "../lib/utils/slug";

interface ProductData {
  name_ru: string;
  name_en: string;
  category_slug: string;
}

const products: ProductData[] = [
  // Орехи (nuts)
  { name_ru: "Бодом", name_en: "Almonds", category_slug: "nuts" },
  { name_ru: "Миндаль", name_en: "Almonds", category_slug: "nuts" },
  { name_ru: "Миндаль Калифорния", name_en: "California Almonds", category_slug: "nuts" },
  { name_ru: "Фисташки Дулона", name_en: "Dulona Pistachios", category_slug: "nuts" },
  { name_ru: "Фисташки Агбари", name_en: "Aghbari Pistachios", category_slug: "nuts" },
  { name_ru: "Фисташки Ахмади", name_en: "Ahmadi Pistachios", category_slug: "nuts" },
  { name_ru: "Кешью", name_en: "Cashews", category_slug: "nuts" },
  { name_ru: "Гр орех бабочка", name_en: "Walnut Butterfly", category_slug: "nuts" },
  { name_ru: "Гр орех Китай", name_en: "Chinese Walnuts", category_slug: "nuts" },
  
  // Сухофрукты (dried-fruits)
  { name_ru: "Изюм светлый Калифар", name_en: "Light Raisins Kalifar", category_slug: "dried-fruits" },
  { name_ru: "Курага с костью кандак", name_en: "Dried Apricots with Stone Kandak", category_slug: "dried-fruits" },
  { name_ru: "Изюм Сояги 100таги", name_en: "Soyagi Raisins 100 Tagi", category_slug: "dried-fruits" },
  { name_ru: "Изюм Сояги 120 таги", name_en: "Soyagi Raisins 120 Tagi", category_slug: "dried-fruits" },
  { name_ru: "Изюм Сояги 80 таги", name_en: "Soyagi Raisins 80 Tagi", category_slug: "dried-fruits" },
  { name_ru: "Чернослив Балончик", name_en: "Prunes Balonchik", category_slug: "dried-fruits" },
  
  // Бобовые (legumes)
  { name_ru: "Фасоль каралевский", name_en: "Royal Beans", category_slug: "legumes" },
  { name_ru: "Маш местный", name_en: "Local Mung Beans", category_slug: "legumes" },
  { name_ru: "Маш Афганский", name_en: "Afghan Mung Beans", category_slug: "legumes" },
];

async function seedProducts() {
  try {
    console.log("Starting product seeding...");

    // Получаем категории
    const categories = await sql<Array<{ id: string; slug: string; name_ru: string }>>`
      SELECT id, slug, name_ru FROM categories
    `;

    const categoryMap = new Map<string, string>();
    categories.forEach((cat) => {
      categoryMap.set(cat.slug, cat.id);
    });

    console.log(`Found ${categories.length} categories:`, categories.map(c => c.name_ru).join(", "));

    let created = 0;
    let skipped = 0;

    for (const product of products) {
      const categoryId = categoryMap.get(product.category_slug);
      
      if (!categoryId) {
        console.error(`Category "${product.category_slug}" not found for product "${product.name_ru}"`);
        continue;
      }

      // Генерируем slug
      const baseSlug = generateSlug(product.name_ru);
      let slug = baseSlug;
      let counter = 1;

      // Проверяем уникальность slug
      while (true) {
        const [existing] = await sql`
          SELECT id FROM products WHERE slug = ${slug} LIMIT 1
        `;
        if (!existing) break;
        slug = `${baseSlug}-${counter}`;
        counter++;
      }

      // Проверяем, существует ли уже товар с таким именем
      const [existingProduct] = await sql`
        SELECT id FROM products WHERE name_ru = ${product.name_ru} LIMIT 1
      `;

      if (existingProduct) {
        console.log(`⏭️  Skipped: "${product.name_ru}" already exists`);
        skipped++;
        continue;
      }

      // Создаем товар
      try {
        const [newProduct] = await sql`
          INSERT INTO products (
            category_id,
            name_ru,
            name_en,
            slug,
            packaging_options,
            is_active,
            is_featured
          ) VALUES (
            ${categoryId},
            ${product.name_ru},
            ${product.name_en},
            ${slug},
            ${JSON.stringify([])}::jsonb,
            true,
            false
          )
          RETURNING id, name_ru, slug
        `;

        console.log(`✅ Created: "${newProduct.name_ru}" (slug: ${newProduct.slug})`);
        created++;
      } catch (error: any) {
        console.error(`❌ Error creating "${product.name_ru}":`, error.message);
      }
    }

    console.log("\n📊 Summary:");
    console.log(`   Created: ${created}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Total: ${products.length}`);

    await closeConnection();
    process.exit(0);
  } catch (error) {
    console.error("Unexpected error:", error);
    await closeConnection();
    process.exit(1);
  }
}

seedProducts();
