import { expect, test } from "vitest";
import { calculatePrice } from "./pricing";
import type { Product } from "./types";

test("снижает цену на заданный шаг относительно конкурента", () => {
  const product: Product = {
    sku: "PHONE-001",
    name: "Телефон",
    myPrice: 1200,
    minPrice: 900,
    maxPrice: 1500,
    step: 10,
    competitors: [
      {
        seller: "Магазин А",
        price: 1000,
        inStock: true,
      },
    ],
  };

  const result = calculatePrice(product);

  expect(result).toEqual({
    sku: "PHONE-001",
    oldPrice: 1200,
    newPrice: 990,
    reason: "UNDERCUT",
  });
});
test("ставит максимальную цену, если у конкурентов нет товара", () => {
  const product: Product = {
    sku: "PHONE-002",
    name: "Телефон",
    myPrice: 1200,
    minPrice: 900,
    maxPrice: 1500,
    step: 10,
    competitors: [
      {
        seller: "Магазин А",
        price: 800,
        inStock: false,
      },
    ],
  };

  const result = calculatePrice(product);

  expect(result).toEqual({
    sku: "PHONE-002",
    oldPrice: 1200,
    newPrice: 1500,
    reason: "NO_COMPETITORS",
  });
});

test("не снижает цену ниже разрешённого минимума", () => {
  const product: Product = {
    sku: "PHONE-003",
    name: "Телефон",
    myPrice: 1200,
    minPrice: 900,
    maxPrice: 1500,
    step: 10,
    competitors: [
      {
        seller: "Магазин А",
        price: 850,
        inStock: true,
      },
    ],
  };

  const result = calculatePrice(product);

  expect(result).toEqual({
    sku: "PHONE-003",
    oldPrice: 1200,
    newPrice: 900,
    reason: "AT_MIN",
  });
});

test("не поднимает цену выше разрешённого максимума", () => {
  const product: Product = {
    sku: "PHONE-004",
    name: "Телефон",
    myPrice: 1200,
    minPrice: 900,
    maxPrice: 1500,
    step: 10,
    competitors: [
      {
        seller: "Магазин А",
        price: 1700,
        inStock: true,
      },
    ],
  };

  const result = calculatePrice(product);

  expect(result).toEqual({
    sku: "PHONE-004",
    oldPrice: 1200,
    newPrice: 1500,
    reason: "AT_MAX",
  });
});

test("округляет рассчитанную цену вниз до целого числа", () => {
  const product: Product = {
    sku: "PHONE-005",
    name: "Телефон",
    myPrice: 1200,
    minPrice: 900,
    maxPrice: 1500,
    step: 0.5,
    competitors: [
      {
        seller: "Магазин А",
        price: 1000.4,
        inStock: true,
      },
    ],
  };

  const result = calculatePrice(product);

  expect(result).toEqual({
    sku: "PHONE-005",
    oldPrice: 1200,
    newPrice: 999,
    reason: "UNDERCUT",
  });
});

test("оставляет UNDERCUT, если рассчитанная цена равна минимуму", () => {
  const product: Product = {
    sku: "PHONE-006",
    name: "Телефон",
    myPrice: 1200,
    minPrice: 900,
    maxPrice: 1500,
    step: 10,
    competitors: [
      {
        seller: "Магазин А",
        price: 910,
        inStock: true,
      },
    ],
  };

  const result = calculatePrice(product);

  expect(result).toEqual({
    sku: "PHONE-006",
    oldPrice: 1200,
    newPrice: 900,
    reason: "UNDERCUT",
  });
});

test.each([
  { competitorPrice: 910, expectedPrice: 900 },
  { competitorPrice: 1510, expectedPrice: 1500 },
])(
  "возвращает UNDERCUT при точном попадании на границу: $expectedPrice",
  ({ competitorPrice, expectedPrice }) => {
    const product: Product = {
      sku: "BOUNDARY",
      name: "Проверка границ",
      myPrice: 1200,
      minPrice: 900,
      maxPrice: 1500,
      step: 10,
      competitors: [
        {
          seller: "Магазин А",
          price: competitorPrice,
          inStock: true,
        },
      ],
    };

    const result = calculatePrice(product);

    expect(result).toEqual({
      sku: "BOUNDARY",
      oldPrice: 1200,
      newPrice: expectedPrice,
      reason: "UNDERCUT",
    });
  }
);