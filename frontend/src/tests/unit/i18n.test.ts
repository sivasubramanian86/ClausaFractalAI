import { describe, it, expect } from "vitest";
import { getTranslation, isRTL, SUPPORTED_LANGUAGES, LOCALES } from "../../i18n";
import {
  getLocalizedFaqs,
  getLocalizedFaqCategories,
  getLocalizedPapers,
} from "../../i18n/sectionContent";

describe("i18n & Localization Unit Tests", () => {
  it("verifies all 22 supported languages are registered", () => {
    expect(SUPPORTED_LANGUAGES.length).toBe(22);
    const codes = SUPPORTED_LANGUAGES.map((l) => l.code);
    expect(codes).toContain("en");
    expect(codes).toContain("hi");
    expect(codes).toContain("ta");
    expect(codes).toContain("ar");
    expect(codes).toContain("ja");
  });

  it("returns translations for valid language code", () => {
    const en = getTranslation("en");
    expect(en.appTitle).toBe("ClausaFractalAI");
    expect(en.blindspotTitle).toBe("Blindspot Risk Matrix");

    const hi = getTranslation("hi");
    expect(hi.appTitle).toBe("ClausaFractalAI");
  });

  it("falls back to English when an unknown language code is supplied", () => {
    const fallback = getTranslation("unknown-lang" as any);
    expect(fallback).toBeDefined();
    expect(fallback.appTitle).toBe("ClausaFractalAI");
  });

  it("checks RTL languages properly", () => {
    expect(isRTL("ar")).toBe(true);
    expect(isRTL("en")).toBe(false);
    expect(isRTL("hi")).toBe(false);
  });

  it("loads localized FAQs with exact language and unknown fallback", () => {
    const enFaqs = getLocalizedFaqs("en");
    expect(enFaqs.length).toBeGreaterThan(0);

    const hiFaqs = getLocalizedFaqs("hi");
    expect(hiFaqs.length).toBeGreaterThan(0);

    const fallbackFaqs = getLocalizedFaqs("nonexistent-lang");
    expect(fallbackFaqs.length).toBeGreaterThan(0);
    expect(fallbackFaqs[0].question).toBe(enFaqs[0].question);

    const defaultFaqs = getLocalizedFaqs();
    expect(defaultFaqs.length).toBe(enFaqs.length);
  });

  it("loads localized FAQ categories with exact language and unknown fallback", () => {
    const enCats = getLocalizedFaqCategories("en");
    expect(enCats.length).toBeGreaterThan(0);

    const fallbackCats = getLocalizedFaqCategories("nonexistent-lang");
    expect(fallbackCats.length).toBeGreaterThan(0);

    const defaultCats = getLocalizedFaqCategories();
    expect(defaultCats.length).toBe(enCats.length);
  });

  it("loads localized research papers with exact language and unknown fallback", () => {
    const enPapers = getLocalizedPapers("en");
    expect(enPapers.length).toBe(5);

    const taPapers = getLocalizedPapers("ta");
    expect(taPapers.length).toBe(5);

    const fallbackPapers = getLocalizedPapers("nonexistent-lang");
    expect(fallbackPapers.length).toBe(5);

    const defaultPapers = getLocalizedPapers();
    expect(defaultPapers.length).toBe(5);
  });

  it("verifies every registered locale in LOCALES has valid structure", () => {
    for (const [code, dict] of Object.entries(LOCALES)) {
      expect(dict.appTitle).toBe("ClausaFractalAI");
      expect(dict.courtroomTitle).toBeDefined();
      expect(dict.meshTitle).toBeDefined();
      expect(dict.analyticsTitle).toBeDefined();
    }
  });
});
