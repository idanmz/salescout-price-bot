import "./style.css";
import { useState } from "react";
import { createRoot } from "react-dom/client";
import products from "../data/products.json";
import type { PriceResult } from "./types";


function App() {
  const [results, setResults] = useState<PriceResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function reprice() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/reprice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(products),
      });

      if (!response.ok) {
        throw new Error("Сервер не смог пересчитать цены");
      }

      const data: PriceResult[] = await response.json();
      setResults(data);
    } catch {
      setError("Не удалось получить цены. Проверь, запущен ли сервер.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h1>Пересчёт цен</h1>

      <button onClick={reprice} disabled={loading}>
        {loading ? "Считаем..." : "Пересчитать цены"}
      </button>

      {error && <p role="alert">{error}</p>}

      <table>
        <thead>
          <tr>
            <th>SKU</th>
            <th>Название</th>
            <th>Старая цена, ₸</th>
            <th>Новая цена, ₸</th>
            <th>Причина</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result) => (
            <tr key={result.sku}>
              <td>{result.sku}</td>
              <td>
                {products.find((product) => product.sku === result.sku)?.name}
              </td>
              <td>{result.oldPrice}</td>
              <td>{result.newPrice}</td>
              <td>{result.reason}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Не найден элемент root");
}

createRoot(rootElement).render(<App />);