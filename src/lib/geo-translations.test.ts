import { describe, it, expect } from "vitest";
import {
  ZONE_TRANSLATIONS,
  STATE_TRANSLATIONS,
  DISTRICT_TRANSLATIONS,
  CITY_TRANSLATIONS,
  ALERT_TEMPLATES,
  getLocalizedZoneName,
  getLocalizedDistrict,
  getLocalizedState,
  getLocalizedCityName,
  getLocalizedZoneLocation,
  getLocalizedExplanation,
  getLocalizedAlertMessage,
  normalizeLanguage,
  type LanguageCode,
} from "./geo-translations";

const ALL_LANGUAGES: LanguageCode[] = [
  "en",
  "hi",
  "bn",
  "as",
  "ne",
  "mni",
  "lus",
  "kha",
  "grt",
];

describe("geo-translations — Monitored Hill Zones (15 Zones)", () => {
  it("contains all 15 operational zones mapped to all 9 supported languages", () => {
    for (let zoneId = 1; zoneId <= 15; zoneId++) {
      const zoneData = ZONE_TRANSLATIONS[zoneId];
      expect(zoneData, `Zone ${zoneId} must exist`).toBeDefined();
      if (!zoneData) continue;
      expect(zoneData.en).toBeTruthy();

      for (const lang of ALL_LANGUAGES) {
        const localized = zoneData[lang];
        expect(
          localized,
          `Zone ${zoneId} must have valid translation for ${lang}`
        ).toBeTruthy();
        expect(typeof localized).toBe("string");
        expect(localized.length).toBeGreaterThan(1);
      }
    }
  });

  it("getLocalizedZoneName returns localized names with various caller patterns", () => {
    // 1. Pass language code directly for Zone 1 (Tamenglong)
    expect(getLocalizedZoneName(1, "Tamenglong", "hi")).toBe("तामेंगलॉन्ग");
    expect(getLocalizedZoneName(1, "Tamenglong", "bn")).toBe("তামেংলং");
    expect(getLocalizedZoneName(1, "Tamenglong", "as")).toBe("তামেংলং");
    expect(getLocalizedZoneName(1, "Tamenglong", "ne")).toBe("तामेङलोङ");
    expect(getLocalizedZoneName(1, "Tamenglong", "mni")).toBe("তামেংলোং");
    expect(getLocalizedZoneName(1, "Tamenglong", "lus")).toBe("Tamenglong");
    expect(getLocalizedZoneName(1, "Tamenglong", "kha")).toBe("Tamenglong");
    expect(getLocalizedZoneName(1, "Tamenglong", "grt")).toBe("Tamenglong");

    // Check Zone 5 (Shillong-Sohra Escarpment) and Zone 11 (Gangtok-Singtam Corridor)
    expect(getLocalizedZoneName(5, "Shillong-Sohra Escarpment", "hi")).toBe("शिलांग-सोहरा कगार");
    expect(getLocalizedZoneName(11, "Gangtok-Singtam Corridor", "hi")).toBe("गैंगटॉक-सिंगताम गलियारा");
    expect(getLocalizedZoneName(11, "Gangtok-Singtam Corridor", "bn")).toBe("গ্যাংটক-সিংতাম করিডোর");
    expect(getLocalizedZoneName(11, "Gangtok-Singtam Corridor", "ne")).toBe("गान्तोक-सिङताम कोरिडोर");

    // 2. Pass i18n mock t function
    const mockT = { i18n: { language: "hi" } };
    expect(getLocalizedZoneName(1, "Tamenglong", mockT)).toBe("तामेंगलॉन्ग");

    // 3. Fallback for unknown zone ID
    expect(getLocalizedZoneName(999, "Custom Fallback Slope", "hi")).toBe("Custom Fallback Slope");
  });
});

describe("geo-translations — NER States (8 States)", () => {
  const NER_STATES = [
    "Sikkim",
    "Assam",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Manipur",
    "Arunachal Pradesh",
    "Tripura",
  ];

  it("translates all 8 Northeastern states across all 9 languages", () => {
    for (const state of NER_STATES) {
      for (const lang of ALL_LANGUAGES) {
        const localized = getLocalizedState(state, lang);
        expect(localized, `State ${state} for lang ${lang}`).toBeTruthy();
        expect(typeof localized).toBe("string");
      }
    }
  });

  it("verifies specific state localized spellings", () => {
    expect(getLocalizedState("Sikkim", "hi")).toBe("सिक्किम");
    expect(getLocalizedState("Assam", "as")).toBe("অসম");
    expect(getLocalizedState("Meghalaya", "kha")).toBe("Meghalaya");
    expect(getLocalizedState("Mizoram", "lus")).toBe("Mizoram");
    expect(getLocalizedState("Manipur", "mni")).toBe("মণিপুর");
  });
});

describe("geo-translations — NER Cities (447 Cities)", () => {
  it("translates key major NER cities across languages", () => {
    const testCities = [
      { name: "Gangtok", hi: "गैंगटॉक", as: "গেংটক", bn: "গ্যাংটক", ne: "गान्तोक" },
      { name: "Guwahati", hi: "गुवाहाटी", as: "গুৱাহাটী", bn: "গুয়াহাটি" },
      { name: "Shillong", hi: "शिलांग", kha: "Shillong", as: "শ্বিলং" },
      { name: "Aizawl", hi: "आइजोल", lus: "Aizawl" },
      { name: "Kohima", hi: "कोहिमा" },
      { name: "Imphal", hi: "इम्फाल", mni: "ইম্ফাল" },
      { name: "Itanagar", hi: "ईटानगर", as: "ইটানগৰ" },
      { name: "Agartala", hi: "अगरतला", bn: "আগরতলা" },
    ];

    for (const city of testCities) {
      expect(getLocalizedCityName(city.name, "hi")).toBe(city.hi);
      if (city.as) expect(getLocalizedCityName(city.name, "as")).toBe(city.as);
      if (city.bn) expect(getLocalizedCityName(city.name, "bn")).toBe(city.bn);
      if (city.ne) expect(getLocalizedCityName(city.name, "ne")).toBe(city.ne);
      if (city.kha) expect(getLocalizedCityName(city.name, "kha")).toBe(city.kha);
      if (city.lus) expect(getLocalizedCityName(city.name, "lus")).toBe(city.lus);
      if (city.mni) expect(getLocalizedCityName(city.name, "mni")).toBe(city.mni);
    }
  });

  it("falls back to city name if not in catalog or when language is en", () => {
    expect(getLocalizedCityName("Unknown Remote Peak", "hi")).toBe("Unknown Remote Peak");
    expect(getLocalizedCityName("Gangtok", "en")).toBe("Gangtok");
  });
});

describe("geo-translations — getLocalizedZoneLocation", () => {
  it("formats localized zone + district + state correctly", () => {
    const zoneObj = {
      id: 11,
      zone_name: "Gangtok-Singtam Corridor",
      district: "East Sikkim",
      state: "Sikkim",
    };

    const hiLoc = getLocalizedZoneLocation(zoneObj, "hi");
    expect(hiLoc).toContain("गैंगटॉक-सिंगताम गलियारा");
    expect(hiLoc).toContain("सिक्किम");

    const bnLoc = getLocalizedZoneLocation(zoneObj, "bn");
    expect(bnLoc).toContain("গ্যাংটক-সিংতাম করিডোর");
  });
});

describe("geo-translations — getLocalizedExplanation", () => {
  it("translates canonical dynamic factor ranking explanation into multiple Indic languages", () => {
    const factorExplanation =
      "Main driver: 72-hr rainfall intensity (42% of total risk score). Secondary contributors: 30-day antecedent rainfall, soil moisture. Detail — 72-hr rainfall: 85.0mm (intensity 28.3 mm/day vs zone threshold 25.0 mm/day; threshold source: IMD). 30-day antecedent: 210.0mm vs zone E-threshold 180.0mm. Soil moisture: 65.0% (status: real). Slope: 32.0°. Historical events in zone: 4. Combined score: 78.5/100 → High.";

    const hiTrans = getLocalizedExplanation(factorExplanation, "hi");
    expect(hiTrans).toContain("प्रमुख कारण: 72-घंटे की वर्षा तीव्रता");
    expect(hiTrans).toContain("मृदा नमी: 65.0%");
    expect(hiTrans).toContain("ढलान: 32.0°");
    expect(hiTrans).toContain("उच्च");

    const bnTrans = getLocalizedExplanation(factorExplanation, "bn");
    expect(bnTrans).toContain("প্রধান কারণ: ৭২-ঘণ্টার বৃষ্টিপাতের তীব্রতা");
    expect(bnTrans).toContain("মাটির আর্দ্রতা: 65.0%");
    expect(bnTrans).toContain("উচ্চ");

    const asTrans = getLocalizedExplanation(factorExplanation, "as");
    expect(asTrans).toContain("মুখ্য কাৰক: ৭২-ঘণ্টাৰ বৰষুণৰ তীব্রতা");
    expect(asTrans).toContain("মাটিৰ আৰ্দ্ৰতা: 65.0%");
  });

  it("translates canonical legacy formula-based explanation", () => {
    const legacyExplanation =
      "72-hr cumulative rainfall of 85.0mm gives an intensity of 28.3 mm/day against the Sikkim I-D threshold of 25.0 mm/day (I = 43.26 x D^-0.78, D = 3 days). 30-day antecedent rainfall is 210.0mm against the NE-Himalaya moisture threshold of 180.0mm (E = -11.10 + 0.62 x D, D = 720 hr). Mean terrain slope 32.0 deg and 4 recorded historical landslide(s) in this zone raise the terrain weighting. Combined risk score: 78.5 / 100 which maps to High.";

    const hiTrans = getLocalizedExplanation(legacyExplanation, "hi");
    expect(hiTrans).toContain("72 घंटे की कुल 85.0 मिमी वर्षा");
    expect(hiTrans).toContain("30-दिवसीय पूर्ववर्ती वर्षा 210.0 मिमी");
    expect(hiTrans).toContain("औसत ढलान 32.0°");

    const bnTrans = getLocalizedExplanation(legacyExplanation, "bn");
    expect(bnTrans).toContain("৭২ ঘণ্টার সঞ্চিত 85.0 মিমি বৃষ্টিপাত");
  });

  it("returns original explanation for English or unknown text", () => {
    const raw = "Simple custom explanation text without metrics.";
    expect(getLocalizedExplanation(raw, "en")).toBe(raw);
  });
});

describe("geo-translations — getLocalizedAlertMessage", () => {
  it("produces natural localized emergency broadcast messages for all 9 languages", () => {
    for (const lang of ALL_LANGUAGES) {
      const severeMsg = getLocalizedAlertMessage("Gangtok Slope", "Severe", lang);
      const highMsg = getLocalizedAlertMessage("Gangtok Slope", "High", lang);

      expect(severeMsg).toBeTruthy();
      expect(highMsg).toBeTruthy();
      expect(severeMsg).toContain("Gangtok Slope");
      expect(highMsg).toContain("Gangtok Slope");
    }

    // Check specific languages
    expect(getLocalizedAlertMessage("Gangtok Slope", "Severe", "hi")).toContain("अति गंभीर");
    expect(getLocalizedAlertMessage("Gangtok Slope", "High", "hi")).toContain("उच्च");

    expect(getLocalizedAlertMessage("Gangtok Slope", "Severe", "bn")).toContain("মারাত্মক");
    expect(getLocalizedAlertMessage("Gangtok Slope", "High", "bn")).toContain("উচ্চ");

    expect(getLocalizedAlertMessage("Gangtok Slope", "Severe", "as")).toContain("গুৰুতৰ");
    expect(getLocalizedAlertMessage("Gangtok Slope", "High", "as")).toContain("উচ্চ");

    expect(getLocalizedAlertMessage("Gangtok Slope", "Severe", "ne")).toContain("गम्भीर");
  });
});
