"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { track } from "@/lib/analytics";
import { addToCartUrl, formatPrice, hasPrice, wooOrigin, type Product } from "@/lib/products";

/**
 * Purchase panel. Standard products hand off to the WooCommerce cart;
 * made-to-order items go to the quote form; anything without a configured
 * shop or a real price falls back to "Ask about this item".
 */
export default function BuyBox({ p }: { p: Product }) {
  const [choice, setChoice] = useState<Record<string, string>>({});
  const [qty, setQty] = useState(1);

  useEffect(() => {
    track("product_view", { item_id: p.id, item_name: p.name, price: p.price || undefined, currency: p.currency });
  }, [p]);

  const variation = useMemo(() => {
    if (!p.variations.length) return null;
    return p.variations.find((v) => p.attributes.every((a) => choice[a.name] && v.attributes[a.name] === choice[a.name])) ?? null;
  }, [choice, p]);

  const needsChoice = p.attributes.length > 0 && !variation;
  const canBuy = Boolean(wooOrigin) && p.purchasable && p.inStock && hasPrice(p) && !p.quoteOnly;
  const cartUrl = canBuy && !needsChoice ? addToCartUrl(p, { quantity: qty, variationId: variation?.id }) : null;

  return (
    <div className="space-y-5">
      <p className="font-display text-3xl font-semibold text-forest">
        {hasPrice(p) ? (
          <>
            {p.quoteOnly ? <span className="text-lg font-normal text-ink-muted">From </span> : null}
            {formatPrice(p.price, p.currency)}
          </>
        ) : (
          <span className="text-xl text-ink-muted">Price on request</span>
        )}
      </p>

      {p.quoteOnly ? (
        <div className="rounded-2xl bg-mint-wash p-5">
          <p className="font-semibold text-forest">Made to order, quoted to your character</p>
          <p className="mt-1 text-sm text-ink-muted">The listed price is a starting point. Send your reference and we'll confirm the final price before you pay.</p>
          <Link href={`/get-a-quote/?service=custom&coverage=parts&source=${encodeURIComponent(p.slug)}`} className="btn-primary mt-4 w-full">
            Request a quote
          </Link>
        </div>
      ) : (
        <>
          {p.attributes.map((a) => (
            <fieldset key={a.name}>
              <legend className="field-label">
                {a.name.replace(/\b\w/g, (c) => c.toUpperCase())}
                {choice[a.name] ? <span className="font-normal text-ink-muted">: {choice[a.name]}</span> : null}
              </legend>
              <div className="flex flex-wrap gap-2">
                {a.options.map((o) => (
                  <label key={o} className="cursor-pointer">
                    <input type="radio" name={a.name} value={o} checked={choice[a.name] === o} onChange={() => setChoice((c) => ({ ...c, [a.name]: o }))} className="peer sr-only" />
                    <span className="inline-flex min-h-[44px] items-center rounded-full border-2 border-forest/15 px-4 text-sm font-semibold text-forest transition peer-checked:border-forest peer-checked:bg-mint-light peer-focus-visible:ring-2 peer-focus-visible:ring-mint-deep hover:border-forest/40">
                      {o}
                    </span>
                  </label>
                ))}
              </div>
            </fieldset>
          ))}

          <p className={`text-sm font-semibold ${p.inStock ? "text-mint-deep" : "text-red-700"}`}>{p.inStock ? "In stock" : "Out of stock"}</p>

          {canBuy ? (
            <div className="flex gap-3">
              <label className="sr-only" htmlFor="qty">
                Quantity
              </label>
              <input id="qty" type="number" min={1} max={20} value={qty} onChange={(e) => setQty(Math.max(1, Math.min(20, Number(e.target.value) || 1)))} className="field w-20 text-center" />
              {cartUrl ? (
                <a href={cartUrl} onClick={() => track("add_to_cart", { item_id: p.id, item_name: p.name, variation_id: variation?.id, quantity: qty, price: p.price, currency: p.currency })} className="btn-primary flex-1">
                  Add to cart
                </a>
              ) : (
                <button type="button" disabled className="btn-primary flex-1">
                  Choose {p.attributes.filter((a) => !choice[a.name]).map((a) => a.name.toLowerCase()).join(" & ")}
                </button>
              )}
            </div>
          ) : (
            <Link href={`/contact-us/?product=${encodeURIComponent(p.name)}`} className="btn-primary w-full">
              Ask about this item
            </Link>
          )}
          {canBuy ? <p className="text-xs text-ink-muted">You'll check out securely on our store with PayPal or card.</p> : null}
        </>
      )}

      <ul className="space-y-1.5 border-t border-forest/10 pt-5 text-sm text-ink-muted">
        <li>• Ships worldwide; shipping is calculated at checkout or included in your quote.</li>
        <li>• Import duties and taxes are paid by the buyer.</li>
        <li>
          •{" "}
          <Link href="/terms-and-conditions/" className="link font-normal">
            Terms, refunds &amp; shipping
          </Link>
        </li>
      </ul>
    </div>
  );
}
