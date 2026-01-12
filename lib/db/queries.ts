import { sql } from "./connection";
import type { Database } from "@/types/database";

type Category = Database["public"]["Tables"]["categories"]["Row"];
type Product = Database["public"]["Tables"]["products"]["Row"];
type Manager = Database["public"]["Tables"]["managers"]["Row"];
type Inquiry = Database["public"]["Tables"]["inquiries"]["Row"];

/**
 * Нормализует image_urls из JSONB в массив строк
 */
function normalizeImageUrls(product: Product): void {
  if (product.image_urls) {
    if (typeof product.image_urls === 'string') {
      try {
        product.image_urls = JSON.parse(product.image_urls);
      } catch {
        product.image_urls = [];
        return;
      }
    } else if (!Array.isArray(product.image_urls)) {
      product.image_urls = [];
      return;
    }
    // Фильтруем только строки
    if (Array.isArray(product.image_urls)) {
      product.image_urls = product.image_urls.filter((url): url is string => typeof url === 'string');
    }
  } else {
    product.image_urls = [];
  }
}

/**
 * Нормализует calibers из JSONB в массив строк
 */
function normalizeCalibers(product: Product): void {
  if (product.calibers) {
    if (typeof product.calibers === 'string') {
      try {
        product.calibers = JSON.parse(product.calibers);
      } catch {
        product.calibers = [];
        return;
      }
    } else if (!Array.isArray(product.calibers)) {
      product.calibers = [];
      return;
    }
    // Фильтруем только строки
    if (Array.isArray(product.calibers)) {
      product.calibers = product.calibers.filter((caliber): caliber is string => typeof caliber === 'string');
    }
  } else {
    product.calibers = [];
  }
}

/**
 * Нормализует новые JSONB поля продукта
 */
function normalizeProductEnhancements(product: Product): void {
  // Certificates
  ['certificates_ru', 'certificates_en'].forEach((field) => {
    const value = (product as any)[field];
    if (value) {
      if (typeof value === 'string') {
        try {
          (product as any)[field] = JSON.parse(value);
        } catch {
          (product as any)[field] = [];
        }
      } else if (!Array.isArray(value)) {
        (product as any)[field] = [];
      }
    } else {
      (product as any)[field] = [];
    }
  });

  // Seasonality
  if (product.seasonality) {
    if (typeof product.seasonality === 'string') {
      try {
        product.seasonality = JSON.parse(product.seasonality);
      } catch {
        product.seasonality = [];
      }
    } else if (!Array.isArray(product.seasonality)) {
      product.seasonality = [];
    }
    // Фильтруем только числа от 1 до 12
    product.seasonality = (product.seasonality as any[]).filter(
      (m): m is number => typeof m === 'number' && m >= 1 && m <= 12
    );
  } else {
    product.seasonality = [];
  }

  // FAQs
  ['faqs_ru', 'faqs_en'].forEach((field) => {
    const value = (product as any)[field];
    if (value) {
      if (typeof value === 'string') {
        try {
          (product as any)[field] = JSON.parse(value);
        } catch {
          (product as any)[field] = [];
        }
      } else if (!Array.isArray(value)) {
        (product as any)[field] = [];
      }
    } else {
      (product as any)[field] = [];
    }
  });

  // Logistics info - оставляем как объект или null
  ['logistics_info_ru', 'logistics_info_en'].forEach((field) => {
    const value = (product as any)[field];
    if (value && typeof value === 'string') {
      try {
        (product as any)[field] = JSON.parse(value);
      } catch {
        (product as any)[field] = null;
      }
    }
  });
}

// Categories
export async function getCategories() {
  const categories = await sql<Category[]>`
    SELECT * FROM categories
    ORDER BY name_ru
  `;
  return categories;
}

export async function getCategoryBySlug(slug: string) {
  const [category] = await sql<Category[]>`
    SELECT * FROM categories
    WHERE slug = ${slug}
    LIMIT 1
  `;
  if (!category) throw new Error("Category not found");
  return category;
}

// Products
export async function getProducts(categoryIdOrSlug?: string) {
  let products: (Product & { categories: Category })[];
  
  if (categoryIdOrSlug) {
    // Проверяем, является ли это UUID (формат: xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(categoryIdOrSlug);
    
    if (isUUID) {
      // Если это UUID, используем напрямую
      products = await sql<(Product & { categories: Category })[]>`
        SELECT 
          p.*,
          json_build_object(
            'id', c.id,
            'name_ru', c.name_ru,
            'name_en', c.name_en,
            'slug', c.slug,
            'description_ru', c.description_ru,
            'description_en', c.description_en,
            'image_url', c.image_url,
            'sort_order', c.sort_order,
            'is_active', c.is_active,
            'created_at', c.created_at,
            'updated_at', c.updated_at
          ) as categories
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = true AND p.category_id = ${categoryIdOrSlug}
        ORDER BY p.name_ru
      `;
    } else {
      // Если это slug, находим категорию по slug и фильтруем по её ID
      products = await sql<(Product & { categories: Category })[]>`
        SELECT 
          p.*,
          json_build_object(
            'id', c.id,
            'name_ru', c.name_ru,
            'name_en', c.name_en,
            'slug', c.slug,
            'description_ru', c.description_ru,
            'description_en', c.description_en,
            'image_url', c.image_url,
            'sort_order', c.sort_order,
            'is_active', c.is_active,
            'created_at', c.created_at,
            'updated_at', c.updated_at
          ) as categories
        FROM products p
        JOIN categories c ON p.category_id = c.id
        WHERE p.is_active = true AND c.slug = ${categoryIdOrSlug}
        ORDER BY p.name_ru
      `;
    }
  } else {
    products = await sql<(Product & { categories: Category })[]>`
      SELECT 
        p.*,
        json_build_object(
          'id', c.id,
          'name_ru', c.name_ru,
          'name_en', c.name_en,
          'slug', c.slug,
          'description_ru', c.description_ru,
          'description_en', c.description_en,
          'image_url', c.image_url,
          'sort_order', c.sort_order,
          'is_active', c.is_active,
          'created_at', c.created_at,
          'updated_at', c.updated_at
        ) as categories
      FROM products p
      JOIN categories c ON p.category_id = c.id
      WHERE p.is_active = true
      ORDER BY p.name_ru
    `;
  }
  
  // Нормализуем image_urls для каждого продукта
  products.forEach(product => normalizeImageUrls(product));
  products.forEach(product => normalizeCalibers(product));
  
  return products;
}

export async function getFeaturedProducts(limit: number = 6) {
  // Получаем все активные товары
  const allProducts = await sql<(Product & { categories: Category })[]>`
    SELECT 
      p.*,
      json_build_object(
        'id', c.id,
        'name_ru', c.name_ru,
        'name_en', c.name_en,
        'slug', c.slug,
        'description_ru', c.description_ru,
        'description_en', c.description_en,
        'image_url', c.image_url,
        'sort_order', c.sort_order,
        'is_active', c.is_active,
        'created_at', c.created_at,
        'updated_at', c.updated_at
      ) as categories
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.is_active = true
  `;
  
  // Нормализуем image_urls и calibers для каждого продукта
  allProducts.forEach(product => normalizeImageUrls(product));
  allProducts.forEach(product => normalizeCalibers(product));
  
  // Разделяем на группы: приоритетные (is_featured = true ИЛИ новые за 30 дней) и остальные
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
  
  const featured: (Product & { categories: Category })[] = [];
  const regular: (Product & { categories: Category })[] = [];
  
  allProducts.forEach(product => {
    const createdAt = new Date(product.created_at);
    const isNew = createdAt > thirtyDaysAgo;
    const isFeatured = product.is_featured === true;
    
    if (isFeatured || isNew) {
      featured.push(product);
    } else {
      regular.push(product);
    }
  });
  
  // Функция для случайного перемешивания массива (Fisher-Yates shuffle)
  const shuffle = <T>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Применяем смешанную рандомизацию
  let selected: (Product & { categories: Category })[] = [];
  
  const featuredCount = Math.ceil(limit * 0.7);
  const regularCount = Math.floor(limit * 0.3);
  
  if (featured.length >= featuredCount) {
    // Берем 70% из приоритетных
    const shuffledFeatured = shuffle(featured);
    selected.push(...shuffledFeatured.slice(0, featuredCount));
    
    // Берем 30% из остальных
    if (regular.length > 0) {
      const shuffledRegular = shuffle(regular);
      selected.push(...shuffledRegular.slice(0, regularCount));
    }
  } else {
    // Если приоритетных мало, берем все и дополняем остальными
    selected.push(...shuffle(featured));
    
    const remaining = limit - selected.length;
    if (remaining > 0 && regular.length > 0) {
      const shuffledRegular = shuffle(regular);
      selected.push(...shuffledRegular.slice(0, remaining));
    }
  }
  
  // Перемешиваем финальный массив для смешанного порядка
  return shuffle(selected).slice(0, limit);
}

export async function getProductBySlug(slug: string) {
  const [product] = await sql<(Product & { categories: Category })[]>`
    SELECT 
      p.*,
      json_build_object(
        'id', c.id,
        'name_ru', c.name_ru,
        'name_en', c.name_en,
        'slug', c.slug,
        'description_ru', c.description_ru,
        'description_en', c.description_en,
        'image_url', c.image_url,
        'sort_order', c.sort_order,
        'is_active', c.is_active,
        'created_at', c.created_at,
        'updated_at', c.updated_at
      ) as categories
    FROM products p
    JOIN categories c ON p.category_id = c.id
    WHERE p.slug = ${slug} AND p.is_active = true
    LIMIT 1
  `;
  if (!product) throw new Error("Product not found");
  
  // Нормализуем все поля
  normalizeImageUrls(product);
  normalizeCalibers(product);
  normalizeProductEnhancements(product);
  
  return product;
}

// Export revalidation constant for Next.js caching
export const productRevalidate = 3600; // 1 hour

// Managers
export async function getActiveManagers() {
  const managers = await sql<Manager[]>`
    SELECT * FROM managers
    WHERE is_active = true
    ORDER BY name
  `;
  return managers;
}

export async function getDefaultManager() {
  const [manager] = await sql<Manager[]>`
    SELECT * FROM managers
    WHERE is_active = true AND is_default = true
    LIMIT 1
  `;
  return manager || null;
}

export async function getDefaultManagerAdmin() {
  const [manager] = await sql<Manager[]>`
    SELECT * FROM managers
    WHERE is_active = true AND is_default = true
    LIMIT 1
  `;
  return manager || null;
}

// Admin queries
export async function getAllProducts() {
  const products = await sql<(Product & { categories: Category })[]>`
    SELECT 
      p.*,
      json_build_object(
        'id', c.id,
        'name_ru', c.name_ru,
        'name_en', c.name_en,
        'slug', c.slug,
        'description_ru', c.description_ru,
        'description_en', c.description_en,
        'image_url', c.image_url,
        'sort_order', c.sort_order,
        'is_active', c.is_active,
        'created_at', c.created_at,
        'updated_at', c.updated_at
      ) as categories
    FROM products p
    JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `;
  
  // Нормализуем image_urls для каждого продукта
  products.forEach(product => normalizeImageUrls(product));
  
  return products;
}

export async function getAllInquiries() {
  const inquiries = await sql<(Inquiry & {
    products: Product | null;
    managers: Manager;
  })[]>`
    SELECT 
      i.*,
      CASE 
        WHEN i.product_id IS NOT NULL THEN
          json_build_object(
            'id', p.id,
            'name_ru', p.name_ru,
            'name_en', p.name_en,
            'slug', p.slug
          )
        ELSE NULL
      END as products,
      json_build_object(
        'id', m.id,
        'name', m.name,
        'telegram_username', m.telegram_username,
        'telegram_link', m.telegram_link
      ) as managers
    FROM inquiries i
    LEFT JOIN products p ON i.product_id = p.id
    JOIN managers m ON i.manager_id = m.id
    ORDER BY i.created_at DESC
  `;
  return inquiries;
}

export async function getAllManagers() {
  const managers = await sql<Manager[]>`
    SELECT * FROM managers
    ORDER BY name
  `;
  return managers;
}

export async function getAllCategories() {
  const categories = await sql<Category[]>`
    SELECT * FROM categories
    ORDER BY name_ru
  `;
  return categories;
}

// Analytics queries
export async function getInquiriesByDate(days: number = 30) {
  const inquiries = await sql<{ date: string; count: number }[]>`
    SELECT 
      DATE(created_at) as date,
      COUNT(*)::int as count
    FROM inquiries
    WHERE created_at >= NOW() - INTERVAL '1 day' * ${days}
    GROUP BY DATE(created_at)
    ORDER BY date ASC
  `;
  return inquiries;
}

export async function getTopProductsByInquiries(limit: number = 5) {
  const topProducts = await sql<{ name: string; count: number }[]>`
    SELECT 
      COALESCE(p.name_en, p.name_ru) as name,
      COUNT(i.id)::int as count
    FROM inquiries i
    LEFT JOIN products p ON i.product_id = p.id
    WHERE i.created_at >= NOW() - INTERVAL '1 day' * 30
    GROUP BY p.id, p.name_en, p.name_ru
    ORDER BY count DESC
    LIMIT ${limit}
  `;
  return topProducts;
}

export async function getInquiriesByCategory() {
  const categoryStats = await sql<{ name: string; value: number }[]>`
    SELECT 
      COALESCE(c.name_en, c.name_ru) as name,
      COUNT(i.id)::int as value
    FROM inquiries i
    LEFT JOIN products p ON i.product_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE i.created_at >= NOW() - INTERVAL '1 day' * 30
    GROUP BY c.id, c.name_en, c.name_ru
    ORDER BY value DESC
  `;
  return categoryStats;
}

export async function getInquiryStats() {
  const [stats] = await sql<{
    total: number;
    contacted: number;
    closed: number;
  }[]>`
    SELECT 
      COUNT(*)::int as total,
      COUNT(*) FILTER (WHERE status = 'contacted')::int as contacted,
      COUNT(*) FILTER (WHERE status = 'closed')::int as closed
    FROM inquiries
    WHERE created_at >= NOW() - INTERVAL '1 day' * 30
  `;
  return stats || { total: 0, contacted: 0, closed: 0 };
}

// Product Submissions queries
type ProductSubmission = Database["public"]["Tables"]["product_submissions"]["Row"];

/**
 * Нормализует JSONB поля в массивы строк
 */
function normalizeSubmissionArrays(submission: ProductSubmission): void {
  // Normalize images
  if (submission.images) {
    if (typeof submission.images === 'string') {
      try {
        submission.images = JSON.parse(submission.images);
      } catch {
        submission.images = [];
        return;
      }
    } else if (!Array.isArray(submission.images)) {
      submission.images = [];
    }
    if (Array.isArray(submission.images)) {
      submission.images = submission.images.filter((url): url is string => typeof url === 'string');
    }
  } else {
    submission.images = [];
  }

  // Normalize certificates
  if (submission.certificates) {
    if (typeof submission.certificates === 'string') {
      try {
        submission.certificates = JSON.parse(submission.certificates);
      } catch {
        submission.certificates = [];
        return;
      }
    } else if (!Array.isArray(submission.certificates)) {
      submission.certificates = [];
    }
    if (Array.isArray(submission.certificates)) {
      submission.certificates = submission.certificates.filter((url): url is string => typeof url === 'string');
    }
  } else {
    submission.certificates = [];
  }

  // Normalize calibers
  if (submission.calibers) {
    if (typeof submission.calibers === 'string') {
      try {
        submission.calibers = JSON.parse(submission.calibers);
      } catch {
        submission.calibers = [];
        return;
      }
    } else if (!Array.isArray(submission.calibers)) {
      submission.calibers = [];
    }
    if (Array.isArray(submission.calibers)) {
      submission.calibers = submission.calibers.filter((caliber): caliber is string => typeof caliber === 'string');
    }
  } else {
    submission.calibers = [];
  }

  // Normalize packaging_options
  if (submission.packaging_options) {
    if (typeof submission.packaging_options === 'string') {
      try {
        submission.packaging_options = JSON.parse(submission.packaging_options);
      } catch {
        submission.packaging_options = [];
        return;
      }
    } else if (!Array.isArray(submission.packaging_options)) {
      submission.packaging_options = [];
    }
    if (Array.isArray(submission.packaging_options)) {
      submission.packaging_options = submission.packaging_options.filter((opt): opt is string => typeof opt === 'string');
    }
  } else {
    submission.packaging_options = [];
  }
}

export async function createProductSubmission(data: Database["public"]["Tables"]["product_submissions"]["Insert"]) {
  const [submission] = await sql<ProductSubmission[]>`
    INSERT INTO product_submissions (
      supplier_name,
      supplier_email,
      supplier_phone,
      supplier_company,
      supplier_location,
      product_name_ru,
      product_name_en,
      category_id,
      description_ru,
      description_en,
      hs_code,
      grade_ru,
      grade_en,
      origin_place_ru,
      origin_place_en,
      calibers,
      processing_method_ru,
      processing_method_en,
      packaging_options,
      moq,
      shelf_life,
      export_readiness,
      images,
      certificates
    ) VALUES (
      ${data.supplier_name},
      ${data.supplier_email || null},
      ${data.supplier_phone},
      ${data.supplier_company || null},
      ${data.supplier_location || null},
      ${data.product_name_ru},
      ${data.product_name_en},
      ${data.category_id || null},
      ${data.description_ru || null},
      ${data.description_en || null},
      ${data.hs_code || null},
      ${data.grade_ru || null},
      ${data.grade_en || null},
      ${data.origin_place_ru || null},
      ${data.origin_place_en || null},
      ${JSON.stringify(data.calibers || [])}::jsonb,
      ${data.processing_method_ru || null},
      ${data.processing_method_en || null},
      ${JSON.stringify(data.packaging_options || [])}::jsonb,
      ${data.moq || null},
      ${data.shelf_life || null},
      ${data.export_readiness || null},
      ${JSON.stringify(data.images || [])}::jsonb,
      ${JSON.stringify(data.certificates || [])}::jsonb
    )
    RETURNING *
  `;
  normalizeSubmissionArrays(submission);
  return submission;
}

export async function getProductSubmissionById(id: string) {
  const [submission] = await sql<ProductSubmission[]>`
    SELECT * FROM product_submissions WHERE id = ${id}
  `;
  if (submission) {
    normalizeSubmissionArrays(submission);
  }
  return submission || null;
}

export async function getProductSubmissionByToken(token: string) {
  const [submission] = await sql<ProductSubmission[]>`
    SELECT * FROM product_submissions WHERE access_token = ${token}
  `;
  if (submission) {
    normalizeSubmissionArrays(submission);
  }
  return submission || null;
}

export async function getAllProductSubmissions() {
  const submissions = await sql<ProductSubmission[]>`
    SELECT * FROM product_submissions
    ORDER BY created_at DESC
  `;
  submissions.forEach(normalizeSubmissionArrays);
  return submissions;
}

export async function getProductSubmissionsByStatus(status: "pending" | "approved" | "rejected" | "needs_revision") {
  const submissions = await sql<ProductSubmission[]>`
    SELECT * FROM product_submissions
    WHERE status = ${status}
    ORDER BY created_at DESC
  `;
  submissions.forEach(normalizeSubmissionArrays);
  return submissions;
}

export async function updateProductSubmission(
  id: string,
  data: Partial<Database["public"]["Tables"]["product_submissions"]["Update"]>
) {
  // Build SET parts dynamically, only for defined fields
  const updates: string[] = [];
  const params: any[] = [];
  let paramNum = 1;

  if (data.status !== undefined) {
    updates.push(`status = $${paramNum}`);
    params.push(data.status);
    paramNum++;
  }

  if (data.rejection_reason !== undefined) {
    updates.push(`rejection_reason = $${paramNum}`);
    params.push(data.rejection_reason);
    paramNum++;
  }

  if (data.reviewed_by !== undefined) {
    updates.push(`reviewed_by = $${paramNum}`);
    params.push(data.reviewed_by);
    paramNum++;
  }

  if (data.reviewed_at !== undefined) {
    updates.push(`reviewed_at = $${paramNum}`);
    params.push(data.reviewed_at ? new Date(data.reviewed_at) : null);
    paramNum++;
  }

  // Always update updated_at
  updates.push(`updated_at = NOW()`);

  if (updates.length === 1) {
    // Only updated_at, no other fields to update
    const [submission] = await sql<ProductSubmission[]>`
      UPDATE product_submissions SET updated_at = NOW()
      WHERE id = ${id}
      RETURNING *
    `;
    if (submission) {
      normalizeSubmissionArrays(submission);
    }
    return submission || null;
  }

  // Build dynamic query using sql.unsafe with proper parameter numbering
  const setClause = updates.join(', ');
  
  const query = `
    UPDATE product_submissions 
    SET ${setClause}
    WHERE id = $${paramNum}
    RETURNING *
  `;

  params.push(id); // Add id as the last parameter

  const result = await sql.unsafe(query, params) as ProductSubmission[];
  const [submission] = result;
  
  if (submission) {
    normalizeSubmissionArrays(submission);
  }
  return submission || null;
}

export async function getPendingSubmissionsCount() {
  const [result] = await sql<{ count: number }[]>`
    SELECT COUNT(*)::int as count
    FROM product_submissions
    WHERE status = 'pending'
  `;
  return result?.count || 0;
}

// ============================================================================
// Market Index Queries (Product Market Quotes & FX Rates)
// ============================================================================

type ProductMarketQuote = Database["public"]["Tables"]["product_market_quotes"]["Row"];
type FxRateDaily = Database["public"]["Tables"]["fx_rates_daily"]["Row"];

export interface MarketQuotePoint {
  date: string;
  priceMidUsd: number;
  toleranceUsd: number;
  usdUzs: number | null;
}

/**
 * Normalize a date to "YYYY-MM-DD" string format
 */
function normalizeDate(date: string | Date): string {
  if (typeof date === 'string') {
    // If already a string, try to parse and format it
    const d = new Date(date);
    if (!isNaN(d.getTime())) {
      return d.toISOString().split('T')[0];
    }
    return date;
  }
  // If it's a Date object, format it
  return date.toISOString().split('T')[0];
}

/**
 * Get market quotes for a product within a date range
 */
export async function getProductMarketQuotes(
  productId: string,
  options?: { from?: string; to?: string }
) {
  try {
    const { from, to } = options || {};
    
    let quotes: ProductMarketQuote[];
    
    if (from && to) {
      quotes = await sql<ProductMarketQuote[]>`
        SELECT * FROM product_market_quotes
        WHERE product_id = ${productId}
          AND quote_date >= ${from}::date
          AND quote_date <= ${to}::date
        ORDER BY quote_date ASC
      `;
    } else if (from) {
      quotes = await sql<ProductMarketQuote[]>`
        SELECT * FROM product_market_quotes
        WHERE product_id = ${productId}
          AND quote_date >= ${from}::date
        ORDER BY quote_date ASC
      `;
    } else if (to) {
      quotes = await sql<ProductMarketQuote[]>`
        SELECT * FROM product_market_quotes
        WHERE product_id = ${productId}
          AND quote_date <= ${to}::date
        ORDER BY quote_date ASC
      `;
    } else {
      quotes = await sql<ProductMarketQuote[]>`
        SELECT * FROM product_market_quotes
        WHERE product_id = ${productId}
        ORDER BY quote_date ASC
      `;
    }
    return quotes;
  } catch (error: any) {
    // If table doesn't exist, return empty array instead of throwing
    if (error?.code === '42P01' || error?.message?.includes('does not exist')) {
      console.warn('product_market_quotes table does not exist, returning empty array');
      return [];
    }
    throw error;
  }
}

/**
 * Get all market quotes for a product (admin use)
 */
export async function getAllProductMarketQuotes(productId: string) {
  const quotes = await sql<ProductMarketQuote[]>`
    SELECT * FROM product_market_quotes
    WHERE product_id = ${productId}
    ORDER BY quote_date DESC
  `;
  return quotes;
}

/**
 * Get a single market quote by ID
 */
export async function getMarketQuoteById(quoteId: string) {
  const [quote] = await sql<ProductMarketQuote[]>`
    SELECT * FROM product_market_quotes
    WHERE id = ${quoteId}
    LIMIT 1
  `;
  return quote || null;
}

/**
 * Create a new market quote
 */
export async function createMarketQuote(data: {
  product_id: string;
  quote_date: string;
  price_mid_usd: number;
  tolerance_usd?: number;
  notes?: string;
  created_by?: string;
}) {
  const [quote] = await sql<ProductMarketQuote[]>`
    INSERT INTO product_market_quotes (
      product_id,
      quote_date,
      price_mid_usd,
      tolerance_usd,
      notes,
      created_by
    ) VALUES (
      ${data.product_id},
      ${data.quote_date}::date,
      ${data.price_mid_usd},
      ${data.tolerance_usd ?? 0.005},
      ${data.notes || null},
      ${data.created_by || null}
    )
    RETURNING *
  `;
  return quote;
}

/**
 * Update a market quote
 */
export async function updateMarketQuote(
  quoteId: string,
  data: {
    quote_date?: string;
    price_mid_usd?: number;
    tolerance_usd?: number;
    notes?: string;
  }
) {
  const [quote] = await sql<ProductMarketQuote[]>`
    UPDATE product_market_quotes SET
      quote_date = COALESCE(${data.quote_date ? data.quote_date : null}::date, quote_date),
      price_mid_usd = COALESCE(${data.price_mid_usd ?? null}, price_mid_usd),
      tolerance_usd = COALESCE(${data.tolerance_usd ?? null}, tolerance_usd),
      notes = COALESCE(${data.notes ?? null}, notes)
    WHERE id = ${quoteId}
    RETURNING *
  `;
  return quote || null;
}

/**
 * Delete a market quote
 */
export async function deleteMarketQuote(quoteId: string) {
  const [deleted] = await sql<{ id: string }[]>`
    DELETE FROM product_market_quotes
    WHERE id = ${quoteId}
    RETURNING id
  `;
  return !!deleted;
}

/**
 * Get FX rates within a date range
 */
export async function getFxRatesDaily(options?: { from?: string; to?: string }) {
  try {
    const { from, to } = options || {};
    
    let rates: FxRateDaily[];
    
    if (from && to) {
      rates = await sql<FxRateDaily[]>`
        SELECT * FROM fx_rates_daily
        WHERE rate_date >= ${from}::date
          AND rate_date <= ${to}::date
        ORDER BY rate_date ASC
      `;
    } else if (from) {
      rates = await sql<FxRateDaily[]>`
        SELECT * FROM fx_rates_daily
        WHERE rate_date >= ${from}::date
        ORDER BY rate_date ASC
      `;
    } else {
      rates = await sql<FxRateDaily[]>`
        SELECT * FROM fx_rates_daily
        ORDER BY rate_date ASC
      `;
    }
    
    // Convert to map for easy lookup
    const rateMap = new Map<string, number>();
    rates.forEach(rate => {
      const dateKey = normalizeDate(rate.rate_date);
      rateMap.set(dateKey, Number(rate.usd_uzs));
    });
    return rateMap;
  } catch (error: any) {
    // If table doesn't exist, return empty map instead of throwing
    if (error?.code === '42P01' || error?.message?.includes('does not exist')) {
      console.warn('fx_rates_daily table does not exist, returning empty map');
      return new Map<string, number>();
    }
    throw error;
  }
}

/**
 * Get or create FX rate for a specific date
 */
export async function upsertFxRate(data: {
  rate_date: string;
  usd_uzs: number;
  source?: string;
}) {
  const [rate] = await sql<FxRateDaily[]>`
    INSERT INTO fx_rates_daily (rate_date, usd_uzs, source)
    VALUES (${data.rate_date}::date, ${data.usd_uzs}, ${data.source || null})
    ON CONFLICT (rate_date) DO UPDATE SET
      usd_uzs = EXCLUDED.usd_uzs,
      source = EXCLUDED.source
    RETURNING *
  `;
  return rate;
}

/**
 * Get latest FX rate
 */
export async function getLatestFxRate() {
  const [rate] = await sql<FxRateDaily[]>`
    SELECT * FROM fx_rates_daily
    ORDER BY rate_date DESC
    LIMIT 1
  `;
  return rate || null;
}

/**
 * Get all FX rates as array (for admin panel)
 */
export async function getAllFxRates(limit?: number) {
  try {
    const rates = await sql<FxRateDaily[]>`
      SELECT * FROM fx_rates_daily
      ORDER BY rate_date DESC
      ${limit ? sql`LIMIT ${limit}` : sql``}
    `;
    return rates;
  } catch (error: any) {
    if (error?.code === '42P01' || error?.message?.includes('does not exist')) {
      console.warn('fx_rates_daily table does not exist');
      return [];
    }
    throw error;
  }
}

/**
 * Get combined market series with FX rates for a product
 * Returns array of points with USD price, tolerance, and UZS rate
 */
export async function getProductMarketSeries(
  productId: string,
  options?: { from?: string; to?: string }
): Promise<MarketQuotePoint[]> {
  try {
    const quotes = await getProductMarketQuotes(productId, options);
    
    if (quotes.length === 0) {
      return [];
    }
    
    // Get date range from quotes
    const dates = quotes.map(q => q.quote_date);
    const minDate = dates[0];
    const maxDate = dates[dates.length - 1];
    
    // Get FX rates for this range
    const fxRates = await getFxRatesDaily({ from: minDate, to: maxDate });
    
    // Combine quotes with FX rates
    const series: MarketQuotePoint[] = quotes.map(quote => {
      const dateKey = normalizeDate(quote.quote_date);
      return {
        date: dateKey,
        priceMidUsd: Number(quote.price_mid_usd),
        toleranceUsd: Number(quote.tolerance_usd),
        usdUzs: fxRates.get(dateKey) || null,
      };
    });
    
    return series;
  } catch (error: any) {
    // If table doesn't exist or other DB error, return empty array
    if (error?.code === '42P01' || error?.message?.includes('does not exist')) {
      console.warn('Market index tables do not exist, returning empty series');
      return [];
    }
    throw error;
  }
}

/**
 * Get the latest market quote for a product
 */
export async function getLatestProductMarketQuote(productId: string) {
  try {
    const [quote] = await sql<ProductMarketQuote[]>`
      SELECT * FROM product_market_quotes
      WHERE product_id = ${productId}
      ORDER BY quote_date DESC
      LIMIT 1
    `;
    return quote || null;
  } catch (error: any) {
    // If table doesn't exist, return null instead of throwing
    if (error?.code === '42P01' || error?.message?.includes('does not exist')) {
      console.warn('product_market_quotes table does not exist, returning null');
      return null;
    }
    throw error;
  }
}
