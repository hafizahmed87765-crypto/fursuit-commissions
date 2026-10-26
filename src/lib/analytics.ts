// Thin wrapper over the GTM dataLayer. Events are only queued; GTM itself is
// loaded by <Consent> after the visitor accepts, and GTM decides which
// destinations (GA4, Meta pixel…) receive them. No duplicate page views:
// GTM's own page-view tag handles those.

export type AnalyticsEvent =
  | "service_selection"
  | "commission_planner_start"
  | "commission_planner_complete"
  | "quote_form_start"
  | "quote_form_submit_success"
  | "repair_form_submit_success"
  | "contact_form_submit_success"
  | "product_view"
  | "add_to_cart";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function track(event: AnalyticsEvent, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });
}
