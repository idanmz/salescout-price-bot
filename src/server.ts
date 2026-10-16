import express from "express";
import { calculatePrice } from "./pricing";
import type { Product } from "./types";

const app = express();

app.use(express.json());

app.post("/reprice", (req, res) => {
  const products: Product[] = req.body;

  if (!Array.isArray(products)) {
    res.status(400).json({
      error: "Ожидается массив товаров",
    });
    return;
  }

  const results = products.map((product) => calculatePrice(product));

  res.json(results);
});

app.listen(3000, () => {
  console.log("Сервер запущен: http://localhost:3000");
}); 