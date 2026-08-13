import { formatDiscount, formatPrice } from "@/lib/format";

export function PriceTag({ price, priceLabel, compareAtPrice, size = "default" }: { price: number; priceLabel: string; compareAtPrice: number | null; size?: "default" | "large" }) {
  const discount = formatDiscount(price, compareAtPrice);
  return <div className="flex flex-wrap items-center gap-2"><span className={size === "large" ? "text-3xl font-bold tracking-tight" : "text-lg font-bold"}>{priceLabel}</span>{compareAtPrice && compareAtPrice > price ? <span className="text-sm text-muted-foreground line-through">{formatPrice(compareAtPrice)}</span> : null}{discount ? <span className="rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent-foreground">{discount}</span> : null}</div>;
}
