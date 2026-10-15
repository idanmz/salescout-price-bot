import type { Product, PriceResult } from "./types";

/**
 * Чистая функция: рассчитывает новую цену для одного товара.
 * Правила — см. README, раздел «Правила расчёта цены».
 * Не меняйте сигнатуру и путь к файлу: решение проверяется автотестами.
 */
export function calculatePrice(product: Product): PriceResult {
  const availableCompetitors = product.competitors.filter(
    (competitor) => competitor.inStock,
  );

  if (availableCompetitors.length === 0) {
    return {
      sku: product.sku,
      oldPrice: product.myPrice,
      newPrice: product.maxPrice,
      reason: "NO_COMPETITORS",
    };
  }

  const best = Math.min(
    ...availableCompetitors.map((competitor) => competitor.price),
  );

  const candidate = Math.floor(best - product.step);

  if (candidate < product.minPrice) {
    return {
      sku: product.sku,
      oldPrice: product.myPrice,
      newPrice: product.minPrice,
      reason: "AT_MIN",
    };
  }

  if (candidate > product.maxPrice) {
    return {
      sku: product.sku,
      oldPrice: product.myPrice,
      newPrice: product.maxPrice,
      reason: "AT_MAX",
    };
  }

  return {
    sku: product.sku,
    oldPrice: product.myPrice,
    newPrice: candidate,
    reason: "UNDERCUT",
  };
}
