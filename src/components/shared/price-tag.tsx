import { formatDiscount, formatPrice } from "@/lib/format";

export function PriceTag({ price, priceLabel, compareAtPrice, size = "default" }: { price: number; priceLabel: string; compareAtPrice: number | null; size?: "default" | "large" }) {
  const discount = formatDiscount(price, compareAtPrice);
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className={size === "large" ? "text-2xl font-bold tracking-tight" : "text-sm font-bold"}>{priceLabel}</span>
      {compareAtPrice && compareAtPrice > price ? <span className="text-xs text-muted-foreground line-through">{formatPrice(compareAtPrice)}</span> : null}
      {discount ? <span className="rounded-full bg-accent/20 px-1.5 py-0.5 text-[9px] font-semibold text-accent-foreground">{discount}</span> : null}
    </div>
  );
}
