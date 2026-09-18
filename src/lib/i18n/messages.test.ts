import assert from "node:assert/strict";
import { test } from "node:test";
import { LOCALES } from "./locales";
import { getMessages } from "./messages";

test("interest forms in every locale mention upcoming guest reviews, not a live product", () => {
  const upcoming = {
    pt: /ainda não está ativo/i,
    en: /not live yet/i,
    es: /todavía no está activo/i,
    it: /non è ancora attivo/i,
  } as const;
  const reviews = {
    pt: /avaliações de hóspedes/i,
    en: /guest reviews/i,
    es: /reseñas de huéspedes/i,
    it: /recensioni degli ospiti/i,
  } as const;

  for (const locale of LOCALES) {
    const hint = getMessages(locale).interest.reviewsHint;
    assert.match(hint, reviews[locale], `${locale} should mention guest reviews`);
    assert.match(hint, upcoming[locale], `${locale} should say reviews are not live`);
    assert.match(hint, /ranking/i, `${locale} should mention ranking`);
  }
});
