/**
 * ClausaFractalAI — Internationalization (i18n) Module
 *
 * Modular architecture: Loads individual language files from ./locales/
 * Supports 22 Global & Indian Legal Jurisdictions (14 Global + 8 Indian Traditions)
 * following the ThiraiKuzhuAI enterprise localization pattern.
 */

import { LanguageCode } from "../types";
import { LanguageOption, TranslationDictionary, LocaleDictionary } from "./types";

import { ar } from "./locales/ar";
import { bn } from "./locales/bn";
import { de } from "./locales/de";
import { en } from "./locales/en";
import { es } from "./locales/es";
import { fr } from "./locales/fr";
import { hi } from "./locales/hi";
import { it } from "./locales/it";
import { ja } from "./locales/ja";
import { kn } from "./locales/kn";
import { ko } from "./locales/ko";
import { ml } from "./locales/ml";
import { mr } from "./locales/mr";
import { pa } from "./locales/pa";
import { pt } from "./locales/pt";
import { ru } from "./locales/ru";
import { sv } from "./locales/sv";
import { ta } from "./locales/ta";
import { te } from "./locales/te";
import { tr } from "./locales/tr";
import { zh } from "./locales/zh";
import { zh_hk } from "./locales/zh_hk";

export * from "./types";

export const LOCALES: Record<LanguageCode, LocaleDictionary> = {
  en,
  fr,
  ja,
  ko,
  es,
  de,
  it,
  zh,
  "zh-HK": zh_hk,
  ar,
  pt,
  ru,
  sv,
  tr,
  ta,
  hi,
  te,
  ml,
  kn,
  bn,
  mr,
  pa,
};

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  // Global International Commercial & Civil Law Jurisdictions (14)
  { code: "en", name: "English (Common Law / Delaware / UK)" },
  { code: "fr", name: "Français (Droit Civil / OHADA / Paris)" },
  { code: "ja", name: "日本語 (東京国際仲裁 / 民法)" },
  { code: "ko", name: "한국어 (상법 / 대한상사중재원 KCAB)" },
  { code: "es", name: "Español (Derecho Civil / Iberoamérica)" },
  { code: "de", name: "Deutsch (BGB / DIS Schiedsgerichtsbarkeit)" },
  { code: "it", name: "Italiano (Codice Civile / Milano Arbitrato)" },
  { code: "zh", name: "简体中文 (涉外商事 / CIETAC 仲裁)" },
  { code: "zh-HK", name: "繁體中文 (普通法 / 香港國際仲裁中心 HKIAC)" },
  { code: "ar", name: "العربية (DIAC / الشريعة والقانون التجاري)", dir: "rtl" },
  { code: "pt", name: "Português (Direito Civil / Lusofonia)" },
  { code: "ru", name: "Русский (Гражданский кодекс / Арбитраж)" },
  { code: "sv", name: "Svenska (SCC Skiljedom / Nordisk Rätt)" },
  { code: "tr", name: "Türkçe (Ticaret Hukuku / ISTAC)" },

  // Indian Legal Jurisdictions & High Court Traditions (8)
  { code: "ta", name: "தமிழ் (Madras High Court / தமிழ்நாடு)" },
  { code: "hi", name: "हिन्दी (Supreme Court of India / दिल्ली)" },
  { code: "te", name: "తెలుగు (Telangana & AP High Courts / న్యాయ)" },
  { code: "ml", name: "മലയാളം (Kerala High Court / നിയമ വ്യവസ്ഥ)" },
  { code: "kn", name: "ಕನ್ನಡ (Karnataka High Court / ಕಾನೂನು)" },
  { code: "bn", name: "বাংলা (Calcutta High Court / আইন ও বিচার)" },
  { code: "mr", name: "मराठी (Bombay High Court / विधी व न्याय)" },
  { code: "pa", name: "ਪੰਜਾਬੀ (Punjab & Haryana High Court / ਕਾਨੂੰਨ)" },
];

/**
 * Retrieves translations dictionary for the given language code.
 * Safe fallback to English for any missing keys or unsupported codes.
 *
 * @param lang Target language code.
 * @returns Localized dictionary.
 */
export function getTranslation(lang: LanguageCode | string): TranslationDictionary {
  const selected = LOCALES[lang as LanguageCode] || LOCALES.en;
  return { ...LOCALES.en, ...selected } as TranslationDictionary;
}

/**
 * Check if the given language code is Right-to-Left (RTL).
 *
 * @param lang Target language code.
 * @returns boolean
 */
export function isRTL(lang: LanguageCode | string): boolean {
  return lang === "ar";
}
