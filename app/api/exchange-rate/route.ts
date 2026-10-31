import { NextResponse } from "next/server";

export const revalidate = 3600;

export async function GET() {
  const sources = [
    "https://api.factura.bo/ExchangeRate",
    "https://tcbolivia.com/api/promedio",
  ];

  for (const source of sources) {
    try {
      const response = await fetch(source, { next: { revalidate: 3600 }, headers: { Accept: "application/json" } });
      if (!response.ok) continue;
      const payload = await response.json();
      const data = payload?.datos ?? payload?.data ?? payload;
      const rate = Number(data?.usd_bob ?? data?.promedio ?? data?.tipo_cambio ?? data?.rate);
      if (Number.isFinite(rate) && rate > 0) {
        return NextResponse.json({ rate, updatedAt: data?.fecha_actualizacion ?? payload?.timestamp ?? new Date().toISOString(), source: "Banco Central de Bolivia", reference: source });
      }
    } catch {
      // Try the next public mirror; never display a fabricated exchange rate.
    }
  }
  return NextResponse.json({ error: "Cotización temporalmente no disponible" }, { status: 503 });
}
