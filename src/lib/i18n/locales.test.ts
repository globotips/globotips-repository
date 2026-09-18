import assert from "node:assert/strict";
import { test } from "node:test";
import {
  DEFAULT_LOCALE,
  detectLocaleFromAcceptLanguage,
  interestPath,
  parseLocale,
} from "./locales";

test("parseLocale accepts pt-BR and language prefixes", () => {
  assert.equal(parseLocale("pt-BR"), "pt");
  assert.equal(parseLocale("pt"), "pt");
  assert.equal(parseLocale("en-US"), "en");
  assert.equal(parseLocale("es-MX"), "es");
  assert.equal(parseLocale("it-IT"), "it");
  assert.equal(parseLocale("fr"), null);
});

test("Accept-Language prefers pt-BR when present", () => {
  assert.equal(
    detectLocaleFromAcceptLanguage("pt-BR,pt;q=0.9,en-US;q=0.8"),
    "pt",
  );
  assert.equal(detectLocaleFromAcceptLanguage("pt;q=0.8,en;q=1"), "pt");
  assert.equal(detectLocaleFromAcceptLanguage("en-US,en;q=0.9"), "en");
});

test("Accept-Language without Portuguese stays English", () => {
  assert.equal(detectLocaleFromAcceptLanguage("es-MX,es;q=0.9"), DEFAULT_LOCALE);
  assert.equal(detectLocaleFromAcceptLanguage("it-IT,it;q=0.8"), DEFAULT_LOCALE);
  assert.equal(detectLocaleFromAcceptLanguage(null), DEFAULT_LOCALE);
});

test("interest path is Portuguese-first except English", () => {
  assert.equal(interestPath("pt"), "/interesse");
  assert.equal(interestPath("es"), "/interesse");
  assert.equal(interestPath("it"), "/interesse");
  assert.equal(interestPath("en"), "/en/interest");
});
