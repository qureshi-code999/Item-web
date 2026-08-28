// âš ï¸ AUTO-GENERATED FILE â€” DO NOT EDIT DIRECTLY!
// =====================================================
//  Filename : app.js
//  Generated: compile_jsx.ps1 se auto-build hoti hai
//  Source   : INDEX.JSX (ORIGINAL source hai woh)
//  WARNING  : Is file mein koi bhi manual edit karo
//             to agli compile par OVERWRITE ho jayegi!
//             Sirf INDEX.JSX edit karo â†’ compile karo.
// =====================================================
// =============================================================
//  ✅ MASTER SOURCE FILE — SAHIL TRADERS WEBSITE
//  Filename : INDEX.JSX
//  Purpose  : Ye ORIGINAL source file hai. Sirf isi file ko edit karo.
//  Build    : Edit karne ke baad compile_jsx.ps1 chalao jo
//             INDEX.JSX → app.js generate karta hai.
//  WARNING  : app.js ko KABHI directly edit mat karo — woh
//             auto-generated file hai aur overwrite ho jaati hai.
// =============================================================
const {
  useState,
  useMemo,
  useEffect,
  useRef
} = React;
function getTranslationValue(dictionary, key) {
  return key.split(".").reduce((value, part) => value?.[part], dictionary) || "";
}
function tr(language, en, ro, ur) {
  if (language === "ur") return ur;
  if (language === "ro") return ro !== undefined && ro !== null ? ro : en;
  return en;
}
function getImgUrl(path) {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `https://sahiltraders.vercel.app/${path}`;
}
function translate(dictionary, key, params = {}) {
  let value = getTranslationValue(dictionary, key);
  if (!value) value = key;
  return Object.entries(params).reduce((result, [token, replacement]) => {
    return result.replace(new RegExp(`\\{${token}\\}`, "g"), replacement);
  }, value);
}
function translateItemNameToUrdu(text) {
  if (!text) return "";
  let result = text.toUpperCase();
  // Pre-process common units and pricing patterns
  result = result.replace(/(\d+)\s*ML/gi, "$1 \u0627\u06cc\u0645 \u0627\u06cc\u064c");
  result = result.replace(/(\d+)\s*G/gi, "$1 \u06af\u0631\u0627\u0645");
  result = result.replace(/(\d+)\s*KG/gi, "$1 \u06a9\u0644\u0648");
  result = result.replace(/RS\.?\s*(\d+)/gi, "\u0631\u0648\u067e\u06d2 $1");
  result = result.replace(/RP\.?\s*(\d+)/gi, "\u0631\u0648\u067e\u06d2 $1");
  result = result.replace(/(\d+)\s*INCH/gi, "$1 \u0627\u0646\u0686");
  result = result.replace(/(\d+)\s*PCS/gi, "$1 \u0639\u062f\u062f");
  const wordMap = {
    // Brands
    "PEARS": "\u067e\u06cc\u0626\u0631\u0632",
    "PONDS": "\u067e\u0648\u0646\u0686\u0632",
    "SAFEGUARD": "\u0633\u06cc\u0641 \u06af\u0627\u0631\u0686",
    "SAFE GUARD": "\u0633\u06cc\u0641 \u06af\u0627\u0631\u0686",
    "DETTOL": "\u0686\u06cc\u067e\u0648\u0644",
    "DETOL": "\u0686\u06cc\u067e\u0648\u0644",
    "LIFEBUOY": "\u0644\u0627\u0626\u0641 \u0628\u0648\u0627\u0626\u06d2",
    "LUX": "\u0644\u06a9\u0633",
    "MEDORA": "\u0645\u06cc\u0686\u0648\u0631\u0627",
    "OLIVIA": "\u0627\u0648\u0644\u06cc\u0648\u06cc\u0627",
    "TIBET": "\u062a\u0628\u062a",
    "CAPRI": "\u06a9\u06cc\u067e\u0631\u06cc",
    "MECLAY": "\u0645\u06cc\u06a9\u0644\u06d2",
    "GARNIER": "\u06af\u0627\u0631\u0646\u06cc\u0626\u0631",
    "VEET": "\u0648\u06cc\u067e",
    "FAIR & LOVELY": "\u0641\u06cc\u0626\u0631 \u0627\u06cc\u0646\u0686 \u0644\u0648\u0644\u06cc",
    "FAIR AND LOVELY": "\u0641\u06cc\u0626\u0631 \u0627\u06cc\u0646\u0686 \u0644\u0648\u0644\u06cc",
    "GOLDEN PEARL": "\u06af\u0648\u0644\u0686\u0646 \u067e\u0631\u0644",
    "BIO AMLA": "\u0628\u0627\u0626\u06cc\u0648 \u0622\u0645\u0644\u06c1",
    "SUNSILK": "\u0633\u0646 \u0633\u0644\u06a9",
    "PANTENE": "\u067e\u06cc\u0646\u067e\u06cc\u0646",
    "DOVE": "\u0686\u0648",
    "SENSODYNE": "\u0633\u0646\u0633\u0648\u0686\u0627\u0626\u0646",
    "COLGATE": "\u06a9\u0648\u0644\u06af\u06cc\u067e",
    "DENTONIC": "\u0686\u06cc\u0646\u067e\u0648\u0646\u06a9",
    "CLOSE UP": "\u06a9\u0644\u0648\u0632 \u0627\u067e",
    "GILLETTE": "\u062c\u0644\u06cc\u067e",
    "LEMON MAX": "\u0644\u06cc\u0645\u0646 \u0645\u06cc\u06a9\u0633",
    "ARIEL": "\u0627\u06cc\u0631\u06cc\u0644",
    "SURF EXCEL": "\u0633\u0631\u0641 \u0627\u06cc\u06a9\u0633\u0644",
    "BONUS": "\u0628\u0648\u0646\u0633",
    "EXPRESS": "\u0627\u06cc\u06a9\u0633\u067e\u0631\u06cc\u0633",
    "BRITE": "\u0628\u0631\u0627\u0626\u067e",
    "VIM": "\u0648\u0650\u0645",
    "HARPIC": "\u06c1\u0627\u0631\u067e\u06a9",
    "JOHNSONS": "\u062c\u0627\u0646\u0633\u0646\u0632",
    "JOHNSON'S": "\u062c\u0627\u0646\u0633\u0646\u0632",
    "ROSE PETAL": "\u0631\u0648\u0632 \u067e\u06cc\u067e\u0644",
    "LIPTON": "\u0644\u067e\u067e\u0646",
    "TAPAL": "\u067c\u0627\u067e\u0644",
    "NESTLE": "\u0646\u06cc\u0633\u0644\u06d2",
    "EVERYDAY": "\u0627\u06cc\u0648\u0631\u06cc \u0686\u06d2",
    // Product Types / Keywords
    "SOAP": "\u0635\u0627\u0628\u0646",
    "SHAMPOO": "\u0634\u06cc\u0645\u067e\u0648",
    "CREAM": "\u06a9\u0631\u06cc\u0645",
    "LOTION": "\u0644\u0648\u0634\u0646",
    "FACE WASH": "\u0641\u06cc\u0633 \u0648\u0627\u0634",
    "FACEWASH": "\u0641\u06cc\u0633 \u0648\u0627\u0634",
    "TOOTHPASTE": "\u067c\u0648\u062a\u06be \u067e\u06cc\u0633\u067c",
    "HAIR OIL": "\u0628\u0627\u0644\u0648\u06ba \u06a9\u0627 \u062a\u06cc\u0644",
    "OIL": "\u062a\u06cc\u0644",
    "HAIR": "\u0628\u0627\u0644",
    "DEO": "\u0628\u0627\u0686\u06cc \u0627\u0633\u067e\u0631\u06d2 / \u067e\u0627\u0624\u0681\u0631",
    "TALCUM": "\u067c\u0627\u0644\u06a9\u0645",
    "POWDER": "\u067e\u0627\u0624\u0681\u0631",
    "PERFUME": "\u067e\u0631\u0641\u06cc\u0648\u0645",
    "SPRAY": "\u0627\u0633\u067e\u0631\u06d2",
    "DETERGENT": "\u0633\u0631\u0641",
    "BABY": "\u0628\u06cc\u0628\u06cc",
    "CARE": "\u06a9\u06cc\u0626\u0631",
    "SHAVING": "\u0634\u06cc\u0648\u0646\u06af",
    "BLADE": "\u0628\u0644\u06cc\u0686",
    "RAZOR": "\u0631\u06cc\u0622\u0631",
    "PAD": "\u067e\u06cc\u0686",
    "PADS": "\u067e\u06cc\u0686\u0632",
    "PACK": "\u067e\u06cc\u06a9",
    "PACKET": "\u067e\u06cc\u06a9\u067e",
    "TUBE": "\u067c\u06cc\u0648\u0628",
    "BOX": "\u0686\u0628\u06c1",
    "BOTTLE": "\u0628\u0648\u062a\u0644",
    "SMALL": "\u0686\u06be\u0648\u067f\u0627",
    "MEDIUM": "\u062f\u0631\u0645\u06cc\u0627\u0646\u06c1",
    "LARGE": "\u0628\u0686\u0627",
    "WITH": "\u06a9\u06d2 \u0633\u0627\u062a\u06be",
    "FOR": "\u06a9\u06d2 \u0644\u06cc\u06d2",
    "AND": "\u0627\u0648\u0631"
  };
  let words = result.split(/(\s+|,|\(|\)|\/|&)/);
  let translatedWords = words.map(w => {
    let trimmed = w.trim().toUpperCase();
    if (wordMap[trimmed]) {
      return wordMap[trimmed];
    }
    return w;
  });
  let textAfterWordReplacements = translatedWords.join("");
  // Transliterate all remaining A-Z letters and 0-9 digits into Urdu script
  const translitMap = {
    'A': '\u0627',
    'B': '\u0628',
    'C': '\u06a9',
    'D': '\u0686',
    'E': '\u06cc',
    'F': '\u0641',
    'G': '\u06af',
    'H': '\u06c1',
    'I': '\u0622\u0626\u06cc',
    'J': '\u062c',
    'K': '\u06a9',
    'L': '\u0644',
    'M': '\u0645',
    'N': '\u0646',
    'O': '\u0648',
    'P': '\u067e',
    'Q': '\u0642',
    'R': '\u0631',
    'S': '\u0633',
    'T': '\u067c',
    'U': '\u06cc\u0648',
    'V': '\u0648',
    'W': '\u0648',
    'X': '\u0627\u06cc\u06a9\u0633',
    'Y': '\u0648\u0627\u0626\u06d2',
    'Z': '\u0632\u06cc\u0686',
    '0': '\u06f0',
    '1': '\u06f1',
    '2': '\u06f2',
    '3': '\u06f3',
    '4': '\u06f4',
    '5': '\u06f5',
    '6': '\u06f6',
    '7': '\u06f7',
    '8': '\u06f8',
    '9': '\u06f9'
  };
  let finalResult = Array.from(textAfterWordReplacements).map(char => {
    let upperChar = char.toUpperCase();
    return translitMap[upperChar] || char;
  }).join("");
  return finalResult.replace(/\s+/g, " ").trim();
}
function toTitleCase(str) {
  if (!str) return "";
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}
function getProductPricing(product) {
  if (!product) return {
    hasDiscount: false,
    retailPrice: 0,
    sellingPrice: 0,
    savings: 0,
    discountPercent: 0,
    isAutoMarket: false
  };
  const sellingPrice = Number(product.price) || 0;
  let retailPrice = Number(product.retailPrice) || 0;
  let isAutoMarket = false;
  if (!retailPrice && product.name) {
    const match = product.name.match(/(?:RS|RP|Rs|Rp)[\.,:\s]*(\d+)/i);
    if (match && match[1]) {
      const parsed = parseInt(match[1], 10);
      if (!isNaN(parsed)) {
        retailPrice = parsed;
      }
    }
  }

  // AUTO ESTIMATED MARKET PRICE — Category-specific inverse-scaled markup
  if (!retailPrice && sellingPrice > 0) {
    isAutoMarket = true;
    const idNum = Number(product.id) || 1;
    const catId = product.categoryId || '';
    let markupPercent;
    if (catId === 'sports') {
      // Sports & Toys & Birthday: 25% to 38%, INVERSE — cheap = higher %, expensive = lower %
      // Price range roughly Rs 20 to Rs 1500 for sports items
      // Higher price → lower markup (approaching 25%), Lower price → higher markup (approaching 38%)
      const priceClamp = Math.max(20, Math.min(sellingPrice, 1500));
      const ratio = (priceClamp - 20) / (1500 - 20); // 0 (cheap) to 1 (expensive)
      const baseMarkup = 38 - Math.round(ratio * 13); // 38% → 25%
      const jitter = (idNum * 17 + 7) % 3; // 0, 1, or 2 for natural variation
      markupPercent = baseMarkup + jitter;
      markupPercent = Math.max(25, Math.min(38, markupPercent));
    } else if (catId === 'stationary') {
      // Stationary & Tapes: 25% to 39%, INVERSE — cheap = higher %, expensive = lower %
      // Price range roughly Rs 10 to Rs 600 for stationary items
      const priceClamp = Math.max(10, Math.min(sellingPrice, 600));
      const ratio = (priceClamp - 10) / (600 - 10); // 0 (cheap) to 1 (expensive)
      const baseMarkup = 39 - Math.round(ratio * 14); // 39% → 25%
      const jitter = (idNum * 23 + 11) % 3; // 0, 1, or 2 variation
      markupPercent = baseMarkup + jitter;
      markupPercent = Math.max(25, Math.min(39, markupPercent));
    } else {
      // All other categories: 14% to 26% varied by product ID
      markupPercent = 14 + (idNum * 37 + 13) % 13; // 14% to 26%
    }
    const rawMarket = sellingPrice * (1 + markupPercent / 100);
    if (sellingPrice < 50) {
      retailPrice = Math.ceil(rawMarket / 5) * 5;
    } else if (sellingPrice < 200) {
      retailPrice = Math.ceil(rawMarket / 10) * 10;
    } else if (sellingPrice < 1000) {
      retailPrice = Math.ceil(rawMarket / 10) * 10;
    } else {
      retailPrice = Math.ceil(rawMarket / 50) * 50;
    }
    if (retailPrice <= sellingPrice) {
      retailPrice = sellingPrice + 10;
    }
  }
  if (retailPrice > sellingPrice && sellingPrice > 0) {
    const savings = retailPrice - sellingPrice;
    const discountPercent = Math.round(savings / retailPrice * 100);
    return {
      hasDiscount: true,
      retailPrice,
      sellingPrice,
      savings,
      discountPercent,
      isAutoMarket
    };
  }
  return {
    hasDiscount: false,
    retailPrice: 0,
    sellingPrice,
    savings: 0,
    discountPercent: 0,
    isAutoMarket: false
  };
}
// --- Wholesale Bulk Quantity Discount Tiers ---
function getBulkDiscountTier(qty) {
  const q = Math.max(0, Number(qty) || 0);
  if (q >= 60) return {
    percent: 3.2,
    label: '3.2% Extra Bulk Discount'
  };
  if (q >= 48) return {
    percent: 2.8,
    label: '2.8% Extra Bulk Discount'
  };
  if (q >= 36) return {
    percent: 2.2,
    label: '2.2% Extra Bulk Discount'
  };
  if (q >= 24) return {
    percent: 1.8,
    label: '1.8% Extra Bulk Discount'
  };
  if (q >= 12) return {
    percent: 1.2,
    label: '1.2% Extra Bulk Discount'
  };
  if (q >= 6) return {
    percent: 0.6,
    label: '0.6% Extra Bulk Discount'
  };
  return {
    percent: 0,
    label: ''
  };
}
function calculateBulkPricing(sellingPrice, qty) {
  const q = Math.max(1, Number(qty) || 1);
  const sp = Number(sellingPrice) || 0;
  const baseTotal = sp * q;
  const tier = getBulkDiscountTier(q);
  const extraPercent = tier.percent;
  const extraSavings = extraPercent > 0 ? Math.round(baseTotal * (extraPercent / 100)) : 0;
  const finalTotal = baseTotal - extraSavings;
  const effectiveUnitPrice = q > 0 ? Math.round(finalTotal / q) : sp;
  return {
    qty: q,
    baseTotal,
    extraPercent,
    extraSavings,
    finalTotal,
    effectiveUnitPrice,
    tierLabel: tier.label
  };
}
function getProductDisplayName(product, language) {
  if (!product) return "";
  if (language === "ur" && product.nameUrdu) {
    return product.nameUrdu;
  }
  let name = product.name || "";
  // Clean off trailing price tags like RS,250 or RP,400 for neat display
  name = name.replace(/\s*\(?\b(?:RS|RP|Rs|Rp)[\.,:\s]*\d+\)?\s*$/i, "").trim();
  return toTitleCase(name);
}
// --- Lucide Icons Replacements (SVG Components) ---
function Search({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "21",
    x2: "16.65",
    y2: "16.65"
  }));
}
function ChevronDown({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "6 9 12 15 18 9"
  }));
}
function ShoppingBag({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "6",
    x2: "21",
    y2: "6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 10a4 4 0 0 1-8 0"
  }));
}
function ImageOff({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "1",
    y1: "1",
    x2: "23",
    y2: "23"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M21 21H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3m4 0h9a2 2 0 0 1 2 2v12"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "9.5",
    cy: "9.5",
    r: "1.5"
  }));
}
function X({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "18",
    y1: "6",
    x2: "6",
    y2: "18"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "6",
    y1: "6",
    x2: "18",
    y2: "18"
  }));
}
function Store({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "9 22 9 12 15 12 15 22"
  }));
}
function Clock({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "12",
    cy: "12",
    r: "10"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "12 6 12 12 16 14"
  }));
}
function EditIcon({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
  }));
}
function TrashIcon({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("polyline", {
    points: "3 6 5 6 21 6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "10",
    y1: "11",
    x2: "10",
    y2: "17"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "14",
    y1: "11",
    x2: "14",
    y2: "17"
  }));
}
function PlusIcon({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "12",
    y1: "5",
    x2: "12",
    y2: "19"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "12",
    x2: "19",
    y2: "12"
  }));
}
function ShampooIcon({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 21a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v11z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 2v6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 5h6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 13h4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 17h4"
  }));
}
function SoapIcon({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "6",
    width: "18",
    height: "12",
    rx: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "12",
    r: "1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "10",
    cy: "10",
    r: "1.5"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "14",
    cy: "14",
    r: "1"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "11",
    r: "2"
  }));
}
function FaceWashIcon({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M6 3h12l-2 15H8L6 3z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 18h6v3H9z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 8h8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M10 12h4"
  }));
}
function CreamIcon({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M5 9h14v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V9z"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "5",
    width: "16",
    height: "4",
    rx: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 14c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 4 2"
  }));
}
function RazorIcon({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M12 8v13"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "3",
    width: "12",
    height: "5",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "5",
    x2: "16",
    y2: "5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "8",
    y1: "6.5",
    x2: "16",
    y2: "6.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "11",
    y1: "12",
    x2: "13",
    y2: "12"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "11",
    y1: "15",
    x2: "13",
    y2: "15"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "11",
    y1: "18",
    x2: "13",
    y2: "18"
  }));
}
function PerfumeIcon({
  className
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "10",
    width: "14",
    height: "11",
    rx: "2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "10",
    y: "7",
    width: "4",
    height: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M12 3v4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M9 3h6"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 5c-1-1-2-1-3 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M19 5c1-1 2-1 3 0"
  }));
}
// --- Product Categories and Data ---
var DEFAULT_CATEGORIES = [{
  id: "soaps",
  name: "Soaps"
}, {
  id: "shampoo",
  name: "Shampoo & Conditioners"
}, {
  id: "creams",
  name: "Creams & Lotions & Bleach"
}, {
  id: "stationary",
  name: "Stationary & Tapes"
}, {
  id: "sports",
  name: "Sports & Toys"
}, {
  id: "shaving",
  name: "Shaving & Razers & Blades"
}, {
  id: "haircolour",
  name: "Hair Colors & Care & Oils"
}, {
  id: "condemn",
  name: "Condoms"
}, {
  id: "lock",
  name: "Locks & Cells & Lighters"
}, {
  id: "general",
  name: "General Items & Others"
}, {
  id: "babycare",
  name: "Baby Care & Powders"
}, {
  id: "mosquito",
  name: "Anti- Mosquitoes"
}, {
  id: "personalcare",
  name: "Personal Care"
}, {
  id: "fragnances",
  name: "Fragnances & Roll on"
}, {
  id: "toothpasteandbrush",
  name: "Dental Cares"
}, {
  id: "facewash",
  name: "Face Wash & Body Washes"
}];
function getGlobalCategories() {
  return typeof window !== 'undefined' && Array.isArray(window.CATEGORIES) && window.CATEGORIES.length > 0 ? window.CATEGORIES : DEFAULT_CATEGORIES;
}
var CATEGORIES = DEFAULT_CATEGORIES;
var PAGE_SIZE = 10;
const RECENT_LIMIT = 15;
const BRAND_STOP_WORDS = new Set(["SOAP", "SOAPS", "SHAMPOO", "CONDITIONER", "CREAM", "LOTION", "POWDER", "SPRAY", "BODY", "FACE", "WASH", "TOOTH", "PASTE", "BRUSH", "RAZOR", "BLADE", "OIL", "HAIR", "COLOUR", "COLOR", "BALL", "PEN", "TOY", "TAPE", "CELL", "LOCK", "CANDLE", "PAD", "WIPES", "PERFUME", "PERFUMES", "DEO", "DEODORANT", "TALCUM", "ROOM", "FRESHNER", "FRESHENER", "ROLL", "ON", "AIR", "LARGE", "MEDIUM", "SMALL", "SACHET", "PACK", "PCS", "PIECE", "SIZE", "FULL", "HALF", "MIX", "ALL", "GOOD", "QUALITY", "ORIGINAL", "NON", "IMP", "PK", "RS", "RP", "ML", "G", "GM", "KG", "INCH", "BLACK", "WHITE", "BLUE", "GREEN", "RED", "PINK", "YELLOW", "GOLDEN", "BROWN", "ORANGE", "PURPLE", "DARK", "LIGHT"]);
const BRAND_PHRASES = ["BIO AMLA", "BLACK ROSE", "AL RASHIEED", "JUST FOR MEN", "ONE MAN SHOW", "WHITE ROSE", "SOFT CREME", "SOFT CREAM", "SKIN WHITE", "CHI CHI", "7 HERBAL", "BODY SHOP"];
function getProductBrand(name) {
  const clean = String(name || "").toUpperCase().replace(/[#(),.&/+_-]/g, " ").replace(/\b\d+\s*(ML|G|GM|KG|PCS|PC|INCH|METER)\b/g, " ").replace(/\b(RS|RP)\s*\d+\b/g, " ").replace(/\s+/g, " ").trim();
  const phrase = BRAND_PHRASES.find(p => clean.includes(p));
  if (phrase) return phrase.split(" ").map(w => w.charAt(0) + w.slice(1).toLowerCase()).join(" ");
  const words = clean.split(" ").filter(w => w && !BRAND_STOP_WORDS.has(w) && !/^\d+$/.test(w));
  if (!words.length) return "";
  const first = words[0];
  if (/^\d+[A-Z]*$/.test(first) && words[1]) return `${first} ${words[1].charAt(0)}${words[1].slice(1).toLowerCase()}`;
  return first.charAt(0) + first.slice(1).toLowerCase();
}
function getProductFilterName(product) {
  const custom = product && product.filterName ? String(product.filterName).trim() : "";
  if (custom === "__none__") return "";
  return custom || getProductBrand(product && product.name);
}
function getBrandFilters(items) {
  const counts = new Map();
  items.forEach(p => {
    const brand = getProductFilterName(p);
    if (brand) counts.set(brand, (counts.get(brand) || 0) + 1);
  });
  return Array.from(counts.entries()).filter(([, count]) => count >= 2).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 18).map(([name, count]) => ({
    name,
    count
  }));
}
function matchProductTokens(product, query) {
  if (!query || !product) return 0;
  const cleanQuery = query.trim().toLowerCase();
  if (!cleanQuery) return 0;
  const tokens = cleanQuery.split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 0;
  const name = (product.name || "").toLowerCase();
  const nameUrdu = (product.nameUrdu || "").toLowerCase();
  const catName = (product.categoryName || "").toLowerCase();
  const catId = (product.categoryId || "").toLowerCase();
  const brand = (getProductFilterName(product) || "").toLowerCase();
  // Full concatenated searchable text
  const fullText = `${name} ${nameUrdu} ${catName} ${catId} ${brand}`;
  // Punctuation-stripped version (replaces commas, brackets, hyphens, colons with spaces)
  const cleanText = fullText.replace(/[^a-z0-9\u0600-\u06FF\s]/gi, " ");
  // Every single token must match somewhere in fullText or cleanText
  const allTokensMatch = tokens.every(t => cleanText.includes(t) || fullText.includes(t));
  if (!allTokensMatch) return 0;
  // Calculate relevance score
  let score = 10;
  if (name === cleanQuery) {
    score += 100; // Exact full match
  } else if (name.startsWith(cleanQuery)) {
    score += 80; // Starts with full query
  } else if (name.includes(cleanQuery)) {
    score += 60; // Contains full query consecutively
  } else {
    score += 40; // All tokens present (out-of-order / partial word)
  }
  // Bonus if matched inside the product name specifically
  const cleanNameOnly = name.replace(/[^a-z0-9\u0600-\u06FF\s]/gi, " ");
  const inName = tokens.every(t => name.includes(t) || cleanNameOnly.includes(t));
  if (inName) score += 20;
  return score;
}
function AboutUsModal({
  isOpen,
  onClose,
  language
}) {
  if (!isOpen) return null;
  const [modalLang, setModalLang] = React.useState('ro');
  const isUrdu = modalLang === 'ur';
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-scale-in relative",
    style: {
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-6 pb-6 text-center"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold w-9 h-9 flex items-center justify-center rounded-full bg-white/10 transition-colors cursor-pointer"
  }, "×"), /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 mx-auto mb-3 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("img", {
    src: "images/sahil-traders-logo.png",
    alt: "Sahil Traders Logo",
    loading: "lazy",
    decoding: "async",
    className: "w-full h-full object-contain"
  })), /*#__PURE__*/React.createElement("h2", {
    className: "text-2xl font-black tracking-wider uppercase text-amber-400 font-poppins"
  }, "Sahil Traders"), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-300 font-medium mt-1 tracking-widest uppercase"
  }, tr(modalLang, 'Trusted Wholesale & Retail Store — Est. 2021, Karachi', 'Karachi ka Qabil-e-Aitemad Wholesale Store — Qayam Shuda 2021', 'کراچی کا قابلِ اعتماد ہول سیل و پرچون اسٹور — قائم شدہ 2021')), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-1.5 mt-3 pt-2 border-t border-white/10"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setModalLang('ro'),
    className: `px-3 py-1 rounded-full text-xs font-black transition-all cursor-pointer ${modalLang === 'ro' ? 'bg-amber-400 text-gray-950 shadow-md scale-105' : 'bg-white/15 text-white hover:bg-white/25'}`
  }, "🇵🇰 Roman Urdu"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setModalLang('en'),
    className: `px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${modalLang === 'en' ? 'bg-amber-400 text-gray-950 shadow-md scale-105' : 'bg-white/15 text-white hover:bg-white/25'}`
  }, "🇬🇧 English"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setModalLang('ur'),
    className: `px-3 py-1 rounded-full text-xs font-bold font-urdu transition-all cursor-pointer ${modalLang === 'ur' ? 'bg-amber-400 text-gray-950 shadow-md scale-105' : 'bg-white/15 text-white hover:bg-white/25'}`
  }, "اردو"))), /*#__PURE__*/React.createElement("div", {
    className: "p-6 overflow-y-auto space-y-5 flex-1 text-gray-800 text-sm leading-relaxed"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-red-50 border border-red-200 rounded-2xl p-4 text-red-950 space-y-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-black text-xs text-red-900 uppercase tracking-wide"
  }, "⚠️ ", tr(modalLang, 'Important Notice — Please Read!', 'Zaroori Ailaan — Lazmi Parhein!', 'قیمتوں اور اسٹاک سے متعلق ضروری اعلان')), /*#__PURE__*/React.createElement("p", {
    className: isUrdu ? 'font-urdu text-right text-xs leading-loose text-red-950 font-bold' : 'text-xs text-red-950 leading-relaxed font-semibold'
  }, tr(modalLang, 'We have thousands of different items — so some prices may go slightly up or down depending on the market. But we promise you: our prices will always be the cheapest you can find anywhere!', 'Hamare paas hazaron qisam ki cheezein hain — is wajah se kuch cheezon ka rate market ke hisab se kam ya ziada ho sakta hai. Lekin hamara wada hai ke hamara rate hamesha sabse sasta hoga!', 'ہمارے پاس ہزاروں قسم کی چیزیں ہیں — اس وجہ سے کچھ چیزوں کا ریٹ مارکیٹ کے حساب سے کم یا زیادہ ہو سکتا ہے۔ لیکن ہم آپ سے وعدہ کرتے ہیں کہ ہمارا ریٹ ہمیشہ سب سے سستا ہوگا!'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-amber-950 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-bold text-base mb-2 text-amber-900"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xl"
  }, "🏬"), /*#__PURE__*/React.createElement("span", null, tr(modalLang, 'Our Story Since 2021', 'Hamari Kahani (Our Story)', 'ہماری کہانی (Our Story)'))), /*#__PURE__*/React.createElement("p", {
    className: isUrdu ? 'font-urdu text-right text-sm leading-loose' : 'text-xs sm:text-sm text-gray-700 leading-normal'
  }, tr(modalLang, 'Established in 2021 in Karachi, Sahil Traders brings direct wholesale prices to customers on 4,000+ daily essentials and branded products, even if you are buying just 1 item.', 'Sahil Traders ka aaghaz 2021 mein Karachi se wholesale business ke tor par hua. Hamara maqsad har customer ko 4,000+ products direct wholesale rates par faraham karna hai, chahe aap 1 item hi kyun na le rahe hon.', 'ساحل ٹریڈرز کا آغاز 2021 میں کراچی سے ہول سیل بزنس کے طور پر ہوا۔ ہمارا مقصد تمام گاہکوں کو 4,000+ مصنوعات براہِ راست ہول سیل ریٹس پر فراہم کرنا ہے، چاہے وہ 1 آئٹم ہی کیوں نہ خرید رہے ہوں۔'))), /*#__PURE__*/React.createElement("div", {
    className: "relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl p-4 shadow-lg border-2 border-amber-300"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      background: '#fde047',
      color: '#451a03',
      fontWeight: 900,
      fontSize: 10,
      padding: '3px 10px',
      borderRadius: 999,
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
      marginBottom: 8
    }
  }, "🔥 ", tr(modalLang, 'Guaranteed Lowest Rates', 'Sabse Munfarid Baat — Shartiya Kam Rate', 'سب سے منفرد بات — شرطیہ')), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 mb-2 font-black text-base"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-2xl"
  }, "⚡"), /*#__PURE__*/React.createElement("span", {
    className: "tracking-wide"
  }, tr(modalLang, 'Lower Rates Than Any Supermart', 'Pakistan ke Baray se Baray Supermart se Sasta!', 'پاکستان کے بڑے سے بڑے سپر مارٹ سے سستا!'))), /*#__PURE__*/React.createElement("p", {
    className: isUrdu ? 'font-urdu text-right text-xs sm:text-sm font-semibold leading-relaxed text-amber-50' : 'text-xs sm:text-sm font-medium leading-relaxed text-amber-50'
  }, tr(modalLang, 'Over 90% of our product prices are strictly lower than any big supermart across Pakistan — Guaranteed! This unique commitment to direct wholesale pricing and huge variety is the core reason why we started Sahil Traders.', 'Hamare 90% se ziada products ke rates Pakistan ke baray se baray supermart se bhi kam hote hain — Shartiya! Yahi hamari sabse bari khasiyat hai. Itni ziada variety aur itni kam qeemat aapko aur kahin nahi milegi!', 'ہمارے 90% سے زائد پروڈکٹس کے ریٹس پاکستان کے بڑے سے بڑے سپر مارٹ سے بھی کم ہوتے ہیں — شرطیہ! یہی ہماری سب سے بڑی خصوصیت اور منفرد بات ہے جس کی وجہ سے ہم نے یہ کام شروع کیا۔ اتنی زیادہ ورائٹی اور اتنی کم قیمت آپ کو اور کہیں نہیں ملے گی!'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-800 rounded-2xl p-4 text-white shadow-md space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-black text-sm text-amber-400 uppercase tracking-wider border-b border-gray-800 pb-2"
  }, /*#__PURE__*/React.createElement("span", null, "🤝"), /*#__PURE__*/React.createElement("span", null, tr(modalLang, 'Leadership & Partnership', 'Qayadat aur Partnership', 'قیادت اور پارٹنرشپ (Leadership & Partnership)'))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white/10 border border-white/10 rounded-xl p-3 flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-lg bg-amber-400 text-gray-950 font-black text-lg flex items-center justify-center shrink-0 shadow-sm"
  }, "🏬"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-extrabold uppercase text-amber-300 tracking-wider"
  }, tr(modalLang, 'Shop Owner (Elder Brother)', 'Dukan ke Malik (Barray Bhai)', 'دکان کے مالکان (بڑے بھائی)')), /*#__PURE__*/React.createElement("div", {
    className: "font-black text-sm text-white"
  }, "Muhammad Zubair Moin"), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-300 font-medium"
  }, tr(modalLang, 'Owner — BS Mart', 'Owner — BS Mart', 'آنر BS Mart')))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white/10 border border-white/10 rounded-xl p-3 flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-lg bg-yellow-400 text-gray-950 font-black text-lg flex items-center justify-center shrink-0 shadow-sm"
  }, "👨‍💻"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-extrabold uppercase text-yellow-300 tracking-wider"
  }, tr(modalLang, 'Website Creator & Partner', 'Website Creator aur Partner', 'ویب سائٹ میکر اور پارٹنر')), /*#__PURE__*/React.createElement("div", {
    className: "font-black text-sm text-white"
  }, "Muhammad Sahil Saleem"), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-300 font-medium"
  }, tr(modalLang, 'Founder & Developer', 'Founder aur Developer', 'بانی و ڈیولپر'))))), /*#__PURE__*/React.createElement("p", {
    className: isUrdu ? 'font-urdu text-right text-xs text-amber-200/90 pt-1 leading-relaxed' : 'text-xs text-amber-200/90 pt-1 leading-relaxed'
  }, tr(modalLang, '💡 This complete business setup is jointly managed by both brothers, Muhammad Zubair Moin (Owner, BS Mart) & Muhammad Sahil Saleem.', '💡 Ye pura business setup dono bhai Muhammad Zubair Moin (Owner, BS Mart) aur Muhammad Sahil Saleem mil kar chala rahe hain.', '💡 یہ تمام تر سیٹ اپ اور بزنس محمد زبیر معین (مالک BS Mart) اور محمد ساحل سلیم دونوں بھائی مل کر مشترکہ طور پر چلا رہے ہیں۔'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-emerald-950 space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-bold text-sm text-emerald-900"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg"
  }, "🏬"), /*#__PURE__*/React.createElement("span", null, tr(modalLang, 'Visit Our Physical Shop (BS Mart)', 'Hamari Dukan par Tashreef Layein (BS Mart)', 'ہماری فزیکل دکان (BS Mart)'))), /*#__PURE__*/React.createElement("span", {
    className: "bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
  }, tr(modalLang, 'BS Mart', 'BS Mart', 'BS مارٹ'))), /*#__PURE__*/React.createElement("p", {
    className: isUrdu ? 'font-urdu text-right text-xs sm:text-sm text-emerald-900 leading-relaxed font-semibold' : 'text-xs sm:text-sm text-emerald-900 leading-relaxed font-semibold'
  }, tr(modalLang, 'Visit our physical shop BS Mart! Almost all items listed on this website are available in person at our store. (Note: Due to high demand or market shortage, certain items may temporarily be out of stock, but we restock continuously!)', 'Aap hamari physical dukan BS Mart par bhi aa sakte hain! Website ki taqreeban tamam cheezein dukan par dastyab hain. (Note: Market shortage ki wajah se kuch cheezein temporary out of stock ho sakti hain, lekin hum daily restock karte hain!)', 'ہے۔ ویب سائٹ پر موجود تقریباً تمام تر مصنوعات آپ کو ہماری دکان (BS Mart) پر بھی مل جائیں گی۔ (نوٹ: شارٹیج یا زیادہ ڈیمانڈ کی صورت میں شاید کچھ پروڈکٹس عارضی طور پر دکان پر اسٹاک میں نہ ہوں، لیکن ہم مسلسل ری اسٹاک کرتے ہیں!)'))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 border border-gray-200/70 p-3 rounded-2xl text-center flex flex-col items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl mb-1"
  }, "📦"), /*#__PURE__*/React.createElement("div", {
    className: "font-black text-gray-900 text-sm"
  }, "4,000+"), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-600 font-medium mt-0.5"
  }, tr(modalLang, 'Total Products', 'Variety', 'مصنوعات کی ورائٹی'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 border border-gray-200/70 p-3 rounded-2xl text-center flex flex-col items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl mb-1"
  }, "🏷️"), /*#__PURE__*/React.createElement("div", {
    className: "font-black text-gray-900 text-sm"
  }, tr(modalLang, 'Wholesale Rates', 'Wholesale Rates', 'ہول سیل ریٹس')), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-600 font-medium mt-0.5"
  }, tr(modalLang, 'For Everyone', 'Sab Customers ke Liye', 'عام گاہکوں کے لیے'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 border border-gray-200/70 p-3 rounded-2xl text-center flex flex-col items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl mb-1"
  }, "💯"), /*#__PURE__*/React.createElement("div", {
    className: "font-black text-gray-900 text-sm"
  }, "100% Original"), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-600 font-medium mt-0.5"
  }, tr(modalLang, 'Genuine Brands', 'Asli Brands', 'اصلی برانڈز'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 border border-gray-200/70 p-3 rounded-2xl text-center flex flex-col items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl mb-1"
  }, "🚚"), /*#__PURE__*/React.createElement("div", {
    className: "font-black text-gray-900 text-sm"
  }, tr(modalLang, 'Fast Delivery', 'Fast Delivery', 'فاسٹ ڈیلیوری')), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-600 font-medium mt-0.5"
  }, tr(modalLang, 'All Over Karachi', 'Poore Karachi Mein', 'پورے کراچی میں')))), /*#__PURE__*/React.createElement("div", {
    className: "bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 text-purple-950 space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-bold text-sm text-purple-900"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg"
  }, "⏰"), /*#__PURE__*/React.createElement("span", null, tr(modalLang, 'Store Business Hours', 'Dukan ke Auqat (Timings)', 'اوقاتِ کار (Business Hours)'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white/90 border border-purple-100 rounded-xl p-3 text-xs flex justify-between items-center shadow-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-gray-900"
  }, tr(modalLang, 'Monday to Saturday:', 'Peer ta Hafta (Mon to Sat):', 'پیر تا ہفتہ (Monday to Saturday):')), /*#__PURE__*/React.createElement("div", {
    className: "text-purple-700 font-extrabold text-sm mt-0.5"
  }, tr(modalLang, '8:00 AM – 11:30 PM', 'Subha 8:00 se Raat 11:30 tak', 'صبح 8:00 بجے سے رات 11:30 بجے تک'))), /*#__PURE__*/React.createElement("span", {
    className: "bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-200 uppercase"
  }, tr(modalLang, 'Open', 'Khula Hai', 'کھلا ہے')))), /*#__PURE__*/React.createElement("div", {
    className: "bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-emerald-950 text-xs space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-bold text-sm text-emerald-900"
  }, /*#__PURE__*/React.createElement("span", null, "✨"), /*#__PURE__*/React.createElement("span", null, tr(modalLang, 'Why Customers Trust Us', 'Khandani Aitemad aur Khasiyat', 'ہماری خصوصیات (Why Choose Us)'))), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-1.5 list-disc list-inside text-emerald-900"
  }, /*#__PURE__*/React.createElement("li", null, tr(modalLang, 'Family business serving with trust since 2021', '2021 se khandani aitemad ke sath khidmat', '2021 سے خاندانی اعتماد کے ساتھ خدمت')), /*#__PURE__*/React.createElement("li", null, tr(modalLang, 'Free delivery on orders above Rs. 2,000', 'Rs. 2,000 se ziada par muft delivery', 'Rs. 2,000 سے زائد پر مفت شپنگ (Free Delivery)')), /*#__PURE__*/React.createElement("li", null, tr(modalLang, 'Same-day return & exchange policy', 'Usi din tabdeeli aur wapsi ki sahulat (Same-Day Return)', 'اسی دن تبدیلی اور واپسی کی سہولت (Same-day Return)')), /*#__PURE__*/React.createElement("li", null, tr(modalLang, 'Direct WhatsApp customer support', 'Direct WhatsApp par fori support', 'براہِ راست واٹس ایپ پر فوری سپورٹ')))), /*#__PURE__*/React.createElement("div", {
    className: "bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-bold text-sm text-blue-950"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg"
  }, "📍"), /*#__PURE__*/React.createElement("span", null, tr(modalLang, 'Store Address & Exact Location', 'Dukan ka Pura Pata aur Map', 'دکان کا مکمل پتہ اور نقشہ'))), /*#__PURE__*/React.createElement("a", {
    href: "https://www.google.com/maps/search/?api=1&query=R4C4%2BRV6%2C+Safaid+White+Masjid+Rd%2C+Allah+Wala+Town+Sector+H+Korangi%2C+Karachi%2C+Pakistan",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "text-[11px] font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1 text-decoration-none"
  }, tr(modalLang, 'Open Map ↗', 'Map Kholein ↗', 'نقشہ کھولیں ↗'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white/90 border border-blue-100 rounded-xl p-3 text-xs text-gray-800 font-medium leading-relaxed flex items-start gap-2 shadow-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-blue-600 font-bold shrink-0 mt-0.5 text-sm"
  }, "🏬"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-gray-900"
  }, "Sahil Traders (Wholesale & Retail)"), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-600 mt-0.5"
  }, tr(modalLang, 'R4C4+RV6, Safaid White Masjid Rd, Allah Wala Town Sector H Korangi, Karachi, Pakistan', 'R4C4+RV6, Safaid White Masjid Rd, Allah Wala Town Sector H Korangi, Karachi, Pakistan', 'R4C4+RV6، سفید مسجد روڈ، اللہ والا ٹاؤن سیکٹر ایچ، کورنگی، کراچی، پاکستان')))), /*#__PURE__*/React.createElement("div", {
    className: "w-full h-48 sm:h-52 rounded-xl overflow-hidden border border-blue-200 shadow-inner relative bg-gray-100"
  }, /*#__PURE__*/React.createElement("iframe", {
    title: "Sahil Traders Google Map Location",
    src: "https://maps.google.com/maps?q=R4C4%2BRV6%2C+Safaid+White+Masjid+Rd%2C+Allah+Wala+Town+Sector+H+Korangi%2C+Karachi%2C+Pakistan&t=&z=17&ie=UTF8&iwloc=&output=embed",
    className: "w-full h-full border-0",
    loading: "lazy",
    allowFullScreen: true,
    referrerPolicy: "no-referrer-when-downgrade"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("a", {
    href: `https://wa.me/${window.STORE_CONFIG && window.STORE_CONFIG.whatsappNumber || '923368945775'}?text=${encodeURIComponent(tr(modalLang, 'Hi Sahil Traders! I have an inquiry about your store.', 'Salam Sahil Traders! Mujhe aapke store ke baare mein maloomat chahiye.', 'سلام! میں ساحل ٹریڈرز کے بارے میں معلومات حاصل کرنا چاہتا ہوں۔'))}`,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "flex-1 py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs tracking-wider uppercase text-center transition-colors flex items-center justify-center gap-2 text-decoration-none"
  }, /*#__PURE__*/React.createElement("span", null, "💬"), /*#__PURE__*/React.createElement("span", null, tr(modalLang, 'Chat on WhatsApp', 'WhatsApp par Rabta Karein', 'واٹس ایپ پر رابطہ کریں'))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "py-3 px-5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
  }, tr(modalLang, 'Close', 'Band Karein', 'بند کریں')))));
}
function ReturnPolicyModal({
  isOpen,
  onClose,
  language
}) {
  if (!isOpen) return null;
  const isUrdu = language === 'ur';
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-scale-in relative",
    style: {
      maxHeight: '90vh',
      display: 'flex',
      flexDirection: 'column'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative bg-gradient-to-r from-emerald-900 via-teal-900 to-gray-900 text-white p-6 pb-7 text-center"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "absolute top-4 right-4 text-gray-300 hover:text-white w-9 h-9 flex items-center justify-center rounded-full bg-white/10 transition-colors cursor-pointer",
    "aria-label": "Close"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M6 18L18 6M6 6l12 12"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/15 border border-white/20 p-2 shadow-lg flex items-center justify-center"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-8 h-8 text-emerald-300",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
  }))), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl sm:text-2xl font-black tracking-wider uppercase text-emerald-300 font-poppins"
  }, tr(language, 'Return & Exchange Policy', 'Wapsi aur Tabdeeli ki Policy', 'واپسی اور تبدیلی کی پالیسی')), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-emerald-100/90 font-semibold mt-1 tracking-wide"
  }, tr(language, '100% Guaranteed Customer Protection & Care', 'Sahil Traders — 100% Tasalli aur Guarantee', 'ساحل ٹریڈرز - 100% تسلی اور ضمانت'))), /*#__PURE__*/React.createElement("div", {
    className: "p-6 overflow-y-auto space-y-4 flex-1 text-gray-800 text-sm leading-relaxed"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-emerald-50 border-2 border-emerald-300 rounded-2xl p-4 text-emerald-950 shadow-sm space-y-1.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-black text-sm text-emerald-900"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5 text-emerald-600 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  })), /*#__PURE__*/React.createElement("span", null, tr(language, 'What Happens If Product Is Damaged or Faulty?', 'Agar koi cheez kharab ya leak nikle to kya hoga?', 'اگر پروڈکٹ خراب یا لیک نکلے تو کیا ہوگا؟'))), /*#__PURE__*/React.createElement("p", {
    className: isUrdu ? 'font-urdu text-right text-xs leading-loose text-emerald-950 font-bold' : 'text-xs text-emerald-950 leading-relaxed font-semibold'
  }, tr(language, 'If any product received by you turns out to be damaged, leaked, expired, or incorrect - DO NOT WORRY AT ALL! We will immediately issue a 100% Free Replacement or Full Money Refund without any hassle.', 'Agar aapko mosool hone wali koi bhi cheez kharab, leak, expired ya ghalat nikle to pareshan bilkul na hon! Hum bina kisi behas ke nayi cheez tabdeel (Replace) kar ke denge ya 100% paise wapas (Refund) karenge!', 'اگر آپ کو موصول ہونے والی کوئی بھی چیز خراب، لیک، ایکسپائر یا غلط نکلے تو پریشان بالکل نہ ہوں! ہم بنا کسی بحث کے آپ کو نئی چیز تبدیل (Replace) کر کے دیں گے یا آپ کے مکمل پیسے واپس (100% Money Refund) کریں گے!'))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 border border-gray-200 rounded-2xl p-3.5 space-y-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-black text-gray-900"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 text-emerald-600 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
  })), /*#__PURE__*/React.createElement("span", null, tr(language, 'Same-Day Return & Exchange', 'Usi Din (Same Day) ki Sahulat', 'اسی دن (Same Day) کی سہولت'))), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-600 leading-relaxed font-medium"
  }, tr(language, 'You can claim return or exchange on the same day of delivery.', 'Order mosool hone ke usi din (Same Day) aap fori claim kar sakte hain.', 'آرڈر موصول ہونے کے اسی دن (Same Day) آپ فوری کلیم کر سکتے ہیں।'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 border border-gray-200 rounded-2xl p-3.5 space-y-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-black text-gray-900"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 text-emerald-600 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.215-9.124l-2.005-2.005A2.25 2.25 0 0015.682 6H13.5m0 0V3.375c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v10.875"
  })), /*#__PURE__*/React.createElement("span", null, tr(language, 'Free Pickup & Delivery', 'Muft Tabdeeli Delivery', 'مفت تبدیلی ڈلیوری'))), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-600 leading-relaxed font-medium"
  }, tr(language, 'If the issue is from our side, exchange delivery charges will be 100% FREE.', 'Agar masla hamari taraf se ho to tabdeeli ke delivery charges 100% FREE honge!', 'اگر مسئلہ ہماری طرف سے ہو تو تبدیلی کے ڈلیوری چارجز صفر (مفت) ہوں گے!'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 border border-gray-200 rounded-2xl p-3.5 space-y-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-black text-gray-900"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 text-emerald-600 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H21m-4.5 0H12m-9 0h4.5m0 0V9a2.25 2.25 0 012.25-2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44.505.75.958.75h3.423a.75.75 0 00.75-.75V6.75A2.25 2.25 0 0017.25 4.5h-10.5A2.25 2.25 0 004.5 6.75V21"
  })), /*#__PURE__*/React.createElement("span", null, tr(language, 'In-Store Exchange', 'Dukan par Direct Tabdeeli', 'دکان پر براہِ راست تبدیلی'))), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-600 leading-relaxed font-medium"
  }, tr(language, 'You can also visit BS Mart (Korangi, Karachi) for immediate in-person exchange.', 'Hamari physical shop BS Mart (Korangi, Karachi) aakar bhi fori tabdeel karwa sakte hain.', 'ہماری فزیکل شاپ BS Mart (کورنگی، کراچی) آکر بھی تبدیل کروا سکتے ہیں'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 border border-gray-200 rounded-2xl p-3.5 space-y-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-black text-gray-900"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 text-emerald-600 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  })), /*#__PURE__*/React.createElement("span", null, tr(language, 'Instant Refund Option', 'Fori Refund Sahulat', 'فوری ری فنڈ (Refund)'))), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-600 leading-relaxed font-medium"
  }, tr(language, 'Get 100% money back sent to your EasyPaisa, JazzCash, or Bank account.', 'Agar aap tabdeel nahi karna chahte to aapke paise EasyPaisa / JazzCash / Bank mein wapas kar diye jayenge.', 'اگر آپ تبدیل نہیں کرنا چاہتے تو آپ کے پیسے EasyPaisa / JazzCash / Bank میں واپس کر دیے جائیں گے')))), /*#__PURE__*/React.createElement("div", {
    className: "bg-blue-50/70 border border-blue-200 rounded-2xl p-4 space-y-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-bold text-sm text-blue-950"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 text-blue-600 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z"
  })), /*#__PURE__*/React.createElement("span", null, tr(language, 'Easy 3-Step Claim Process:', 'Claim Karne Ka Aasan Tareeqa (3 Steps):', 'کلیم کرنے کا آسان طریقہ (How to Claim):'))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2 text-xs text-blue-900 font-medium"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5 bg-white/80 p-2.5 rounded-xl border border-blue-100"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-5 h-5 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-[10px] shrink-0 mt-0.5"
  }, "1"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-gray-900"
  }, tr(language, 'Send Photo/Video on WhatsApp:', 'Kharab Cheez ki Photo Bhejein:', 'واپسی یا تبدیلی کی تصویر بھیجیں:')), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-600 mt-0.5"
  }, tr(language, 'Take a quick photo or video of the damaged item & WhatsApp to 03368945775.', 'Kharab ya leak cheez ki tasveer hamare WhatsApp (03368945775) par bhejein.', 'خراب یا لیک شدہ چیز کی تصویر ہمارے واپس ایپ (03368945775) پر بھیجیں')))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5 bg-white/80 p-2.5 rounded-xl border border-blue-100"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-5 h-5 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-[10px] shrink-0 mt-0.5"
  }, "2"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-gray-900"
  }, tr(language, 'Instant Verification:', 'Fori Tasdeeq:', 'فوری تصدیق:')), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-600 mt-0.5"
  }, tr(language, 'Our customer support team will verify & approve your claim instantly.', 'Hamari team 10 minute ke andar apka claim approve karegi.', 'ہماری ٹیم 10 منٹ کے اندر آپ کا کلیم منظور کرے گی')))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-start gap-2.5 bg-white/80 p-2.5 rounded-xl border border-blue-100"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-5 h-5 rounded-full bg-blue-600 text-white font-black flex items-center justify-center text-[10px] shrink-0 mt-0.5"
  }, "3"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "font-bold text-gray-900"
  }, tr(language, 'Replacement / Refund Sent:', 'Tabdeeli ya Refund:', 'تبدیلی یا ری فنڈ:')), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-600 mt-0.5"
  }, tr(language, 'Our rider will replace the item at your doorstep or send your money refund.', 'Rider nayi cheez de kar purani le jayega ya paise refund honge.', 'رائڈر نئی چیز دے کر پرانی لے جائے گا یا پیسے ری فنڈ ہوں گے'))))))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3 shrink-0"
  }, /*#__PURE__*/React.createElement("a", {
    href: `https://wa.me/${window.STORE_CONFIG && window.STORE_CONFIG.whatsappNumber || '923368945775'}?text=${encodeURIComponent(tr(language, 'Hi Sahil Traders! I want to claim a return/exchange for my order.', 'Salam Sahil Traders! Mujhe apne order ka return/exchange claim karna hai.', 'سلام! میں اپنے آرڈر کی واپسی یا تبدیلی کا کلیم کرنا چاہتا ہوں۔'))}`,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "flex-1 py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs tracking-wider uppercase text-center transition-colors flex items-center justify-center gap-2 text-decoration-none"
  }, /*#__PURE__*/React.createElement("span", null, "💬"), /*#__PURE__*/React.createElement("span", null, tr(language, 'WhatsApp Claim', 'WhatsApp par Claim Karein', 'واٹس ایپ پر کلیم کریں'))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "py-3 px-5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
  }, tr(language, 'Close', 'Band Karein', 'بند کریں')))));
}
function WelcomeDisclaimerModal({
  isOpen,
  onClose,
  onOpenAbout,
  language
}) {
  if (!isOpen) return null;
  const [modalLang, setModalLang] = React.useState('ro');
  const isUrdu = modalLang === 'ur';
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-[99] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-2 border-amber-400 animate-scale-in relative p-6 text-center",
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl shadow-lg"
  }, "👋"), /*#__PURE__*/React.createElement("h3", {
    className: "text-xl font-black text-gray-900 tracking-wide"
  }, tr(modalLang, 'Assalam U alaikum!', 'Assalam-o-Alaikum!', 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ')), /*#__PURE__*/React.createElement("h4", {
    className: "text-lg font-extrabold text-amber-600 mt-1 font-poppins"
  }, tr(modalLang, 'Welcome to Sahil Traders', 'Sahil Traders mein Khush Amdeed', 'ساحل ٹریڈرز میں خوش آمدید')), /*#__PURE__*/React.createElement("div", {
    className: "my-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-1.5 font-bold text-sm text-amber-900 mb-1.5"
  }, "📢 ", tr(modalLang, 'Important Notice', 'Zaroori Guzarish / Ailaan', 'ضروری گزارش / اعلان')), /*#__PURE__*/React.createElement("p", {
    className: isUrdu ? 'font-urdu text-right text-xs leading-loose' : 'text-xs text-gray-700 leading-normal text-center'
  }, tr(modalLang, 'We kindly request you to please read our "About Us" section at least once so you get all the essential information and shop with complete clarity.', 'Hamari aapse guzarish hai ke ek baar hamara "About Us" section lazmi parh lein, taake aapko tamam zaroori aur ahem maloomat mil sakein aur shopping mein koi masla na aaye.', 'ہماری آپ سے گزارش ہے کہ ایک بار ہمارا "About Us (ہماری معلومات)" سیکشن لازمی پڑھ لیں، تاکہ آپ کو تمام ضروری اور اہم معلومات مل سکیں اور خریداری میں کوئی مسئلہ پیش نہ آئے۔'))), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onOpenAbout();
      onClose();
    },
    className: "w-full py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs tracking-wider uppercase transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
  }, "📖 ", tr(modalLang, 'Read About Us', 'Hamare Baare Mein Parhein (About Us)', 'ہماری معلومات پڑھیں (Read About Us)')), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "w-full py-2.5 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs tracking-wider uppercase transition-all cursor-pointer"
  }, tr(modalLang, 'Understood, Continue', 'Theek Hai, Aage Barhein', 'ٹھیک ہے، آگے بڑھیں')))));
}
function ProductDetailModal({
  product,
  open,
  onClose,
  onAddToCart,
  products,
  langData,
  language,
  onSelectProduct
}) {
  if (!open || !product) return null;
  const isUrdu = language === 'ur';
  const [modalQty, setModalQty] = React.useState(1);
  const pricing = useMemo(() => getProductPricing(product), [product]);
  const bulkPricing = useMemo(() => calculateBulkPricing(pricing.sellingPrice, modalQty), [pricing.sellingPrice, modalQty]);
  // Find 4-6 Related Products from the same category (excluding current product)
  const relatedProducts = useMemo(() => {
    if (!product || !products) return [];
    const sameCat = products.filter(p => p.categoryId === product.categoryId && p.id !== product.id);
    if (sameCat.length >= 4) return sameCat.slice(0, 6);

    // Fallback: items with same brand or general items
    const brand = getProductFilterName(product);
    const sameBrand = products.filter(p => p.id !== product.id && getProductFilterName(p) === brand);
    const combined = Array.from(new Set([...sameCat, ...sameBrand]));
    return combined.slice(0, 6);
  }, [product, products]);
  const hasFile = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id];
  const imageSrc = hasFile ? getImgUrl(`images/${product.id}.${window.PRODUCT_IMAGE_MAP[product.id]}`) : null;
  const handleDirectWhatsAppOrder = () => {
    const pName = getProductDisplayName(product, language);
    let discountInfo = '';
    if (bulkPricing.extraPercent > 0) {
      discountInfo += `\n🎁 *Bulk Volume Discount (${bulkPricing.extraPercent}%):* -Rs ${bulkPricing.extraSavings.toLocaleString()}`;
    }
    if (pricing.hasDiscount) {
      discountInfo += `\n🏷️ *Retail:* ~Rs ${(pricing.retailPrice * modalQty).toLocaleString()}~ (Total Savings: Rs ${(pricing.savings * modalQty + bulkPricing.extraSavings).toLocaleString()})`;
    }
    const msg = `Assalam U Alaikum Sahil Traders!\nI want to order this item directly:\n\n📦 *Product:* ${pName}\n🔢 *Quantity:* ${modalQty}\n💰 *Price:* *Rs ${bulkPricing.finalTotal.toLocaleString()}*${discountInfo}\n\nPlease confirm my order.`;
    window.open(`https://wa.me/923368945775?text=${encodeURIComponent(msg)}`, '_blank');
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-in relative flex flex-col",
    style: {
      maxHeight: '90vh'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-black tracking-widest uppercase text-gray-500 font-poppins"
  }, tr(language, 'Product Details & Info', 'Product ki Mukammal Tafseel', 'پروڈکٹ کی مکمل تفصیلات')), pricing.hasDiscount ? /*#__PURE__*/React.createElement("span", {
    className: "bg-red-100 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-200 flex items-center gap-1"
  }, /*#__PURE__*/React.createElement("span", null, "🔥"), /*#__PURE__*/React.createElement("span", null, pricing.discountPercent, "% ", tr(language, 'OFF', 'OFF', 'رعایت'))) : /*#__PURE__*/React.createElement("span", {
    className: "bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-200"
  }, tr(language, 'Wholesale Rate', 'Behtareen Wholesale Rate', 'بہترین ہول سیل ریٹ'))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "w-8 h-8 rounded-full bg-gray-200 hover:bg-black hover:text-white text-gray-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
  }, "✕")), /*#__PURE__*/React.createElement("div", {
    className: "p-4 sm:p-5 overflow-y-auto space-y-4 flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-3 bg-gradient-to-br from-gray-50 to-amber-50/30 p-4 rounded-2xl border border-gray-200 shadow-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-3.5 items-center sm:items-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-36 h-36 sm:w-40 sm:h-40 shrink-0 bg-white rounded-2xl p-2.5 border border-gray-200 flex items-center justify-center shadow-sm relative group overflow-hidden"
  }, pricing.hasDiscount && /*#__PURE__*/React.createElement("span", {
    className: "absolute top-2 left-2 z-10 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1 uppercase tracking-wider"
  }, /*#__PURE__*/React.createElement("span", null, "🔥"), /*#__PURE__*/React.createElement("span", null, pricing.discountPercent, "% OFF")), hasFile ? /*#__PURE__*/React.createElement("img", {
    src: imageSrc,
    alt: product.name,
    loading: "lazy",
    decoding: "async",
    className: "w-full h-full object-contain"
  }) : /*#__PURE__*/React.createElement("div", {
    className: `w-full h-full rounded-xl bg-gradient-to-br ${product.gradient || 'from-amber-400 to-amber-600'} flex items-center justify-center text-white text-4xl font-black`
  }, product.initial || 'P'), !pricing.hasDiscount && /*#__PURE__*/React.createElement("span", {
    className: "absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider"
  }, "Original")), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 space-y-2 text-center sm:text-left w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-1.5 justify-center sm:justify-start items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase"
  }, tr(language, '✓ In Stock', '✓ Stock mein Dastyab Hai', '✓ اسٹاک میں دستیاب')), product.categoryName && /*#__PURE__*/React.createElement("span", {
    className: "bg-gray-200 text-gray-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
  }, product.categoryName)), /*#__PURE__*/React.createElement("h3", {
    className: "text-base sm:text-lg font-black text-gray-900 leading-snug"
  }, getProductDisplayName(product, language)), pricing.hasDiscount ? /*#__PURE__*/React.createElement("div", {
    className: "space-y-1.5 bg-gradient-to-r from-emerald-50/70 via-white to-red-50/50 p-2.5 sm:p-3 rounded-2xl border border-emerald-200/80 shadow-2xs text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between flex-wrap gap-1"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-extrabold uppercase tracking-wider text-gray-500"
  }, tr(language, 'Wholesale Selling Price', 'Hamari Wholesale Qeemat', 'ہماری ہول سیل قیمت')), /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-2xl sm:text-3xl font-black text-gray-950"
  }, "Rs. ", pricing.sellingPrice.toLocaleString()), /*#__PURE__*/React.createElement("span", {
    className: "text-sm sm:text-base text-gray-400 line-through font-bold"
  }, "Rs. ", pricing.retailPrice.toLocaleString()))), /*#__PURE__*/React.createElement("span", {
    className: "inline-block bg-red-600 text-white text-xs sm:text-sm font-black px-2.5 py-1 rounded-xl shadow-xs"
  }, pricing.discountPercent, "% OFF")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-100/90 px-2 py-1 rounded-lg border border-emerald-300"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-3.5 h-3.5 text-emerald-700 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
  })), /*#__PURE__*/React.createElement("span", null, tr(language, `You Save: Rs. ${pricing.savings.toLocaleString()} per item`, `Apki Bachat: Rs. ${pricing.savings.toLocaleString()} fi item`, `آپ کی بچت: Rs. ${pricing.savings.toLocaleString()} فی آئٹم`)))) : /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline justify-center sm:justify-start gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-2xl font-black text-black"
  }, "Rs. ", product.price.toLocaleString()), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
  }, tr(language, 'Cheaper than Supermarts', 'Supermarket se Sasta', 'سپر مارکیٹ سے سستا'))))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5 pt-2 border-t border-gray-200/80 w-full"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-2xs shrink-0"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setModalQty(q => Math.max(1, q - 1)),
    className: "w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-base flex items-center justify-center cursor-pointer transition-colors",
    title: "Minus 1"
  }, "-"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    value: modalQty,
    onChange: e => {
      const val = parseInt(e.target.value, 10);
      setModalQty(isNaN(val) || val < 1 ? 1 : val);
    },
    className: "w-12 text-center font-black text-sm text-black border-none focus:outline-hidden py-0.5"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setModalQty(q => q + 1),
    className: "w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-base flex items-center justify-center cursor-pointer transition-colors",
    title: "Plus 1"
  }, "+")), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 min-w-0"
  }, /*#__PURE__*/React.createElement("select", {
    value: [6, 12, 24, 36, 48, 60].includes(modalQty) ? modalQty : "custom",
    onChange: e => {
      if (e.target.value !== "custom") {
        setModalQty(Number(e.target.value));
      }
    },
    className: "w-full bg-slate-50 border border-slate-300 hover:border-slate-800 text-slate-900 font-extrabold text-xs rounded-xl px-2.5 py-1.5 focus:outline-hidden focus:ring-2 focus:ring-black cursor-pointer shadow-2xs transition-colors truncate"
  }, /*#__PURE__*/React.createElement("option", {
    value: "custom"
  }, "📦 ", tr(language, 'Wholesale Packs', 'Wholesale Pack Chunain', 'ہول سیل پیک')), /*#__PURE__*/React.createElement("option", {
    value: "6"
  }, "6 Pcs (Half Dozen - Extra 0.6% OFF)"), /*#__PURE__*/React.createElement("option", {
    value: "12"
  }, "12 Pcs (1 Dozen - Extra 1.2% OFF)"), /*#__PURE__*/React.createElement("option", {
    value: "24"
  }, "24 Pcs (2 Dozen - Extra 1.8% OFF)"), /*#__PURE__*/React.createElement("option", {
    value: "36"
  }, "36 Pcs (3 Dozen - Extra 2.2% OFF)"), /*#__PURE__*/React.createElement("option", {
    value: "48"
  }, "48 Pcs (4 Dozen - Extra 2.8% OFF)"), /*#__PURE__*/React.createElement("option", {
    value: "60"
  }, "60 Pcs (5 Dozen - Extra 3.2% OFF)")))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'linear-gradient(135deg,#ecfdf5 0%,#d1fae5 100%)',
      border: '1px solid #6ee7b7',
      borderRadius: 12,
      padding: '7px 10px'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 9,
      fontWeight: 900,
      color: '#065f46',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
      display: 'block',
      marginBottom: 5
    }
  }, "🎁 Bulk Extra Discount"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: 3
    }
  }, [{
    qty: 6,
    pct: 0.6
  }, {
    qty: 12,
    pct: 1.2
  }, {
    qty: 24,
    pct: 1.8
  }, {
    qty: 36,
    pct: 2.2
  }, {
    qty: 48,
    pct: 2.8
  }, {
    qty: 60,
    pct: 3.2
  }].map(({
    qty: q,
    pct
  }) => {
    const isCurrent = getBulkDiscountTier(modalQty).percent === pct && modalQty >= q;
    return /*#__PURE__*/React.createElement("button", {
      key: q,
      type: "button",
      onClick: () => setModalQty(q),
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '3px 2px',
        borderRadius: 8,
        border: isCurrent ? '2px solid #059669' : '1px solid #a7f3d0',
        background: isCurrent ? '#059669' : '#ffffff',
        cursor: 'pointer',
        transition: 'all 0.15s',
        boxShadow: isCurrent ? '0 2px 6px rgba(5,150,105,0.3)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 11,
        fontWeight: 900,
        color: isCurrent ? '#ffffff' : '#111827',
        lineHeight: 1.2
      }
    }, q), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 8.5,
        fontWeight: 800,
        color: isCurrent ? '#bbf7d0' : '#059669',
        lineHeight: 1.3
      }
    }, "+", pct, "%"));
  }))), /*#__PURE__*/React.createElement("div", {
    className: `border rounded-xl px-3 py-2 shadow-2xs ${bulkPricing.extraPercent > 0 ? 'bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border-emerald-300' : 'bg-amber-50/70 border-amber-200/80'}`
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: pricing.hasDiscount || bulkPricing.extraPercent > 0 ? 6 : 0
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-gray-500 font-bold text-[10px] uppercase tracking-wider"
  }, tr(language, 'Total for', 'Kul Qeemat Baraye', 'کل قیمت برائے'), " ", modalQty, " ", modalQty > 1 ? tr(language, 'items', 'cheezein', 'اشیاء') : tr(language, 'item', 'cheez', 'چیز'), ":"), bulkPricing.extraPercent > 0 && /*#__PURE__*/React.createElement("span", {
    className: "bg-emerald-600 text-white text-[9.5px] font-black px-1.5 py-0.2 rounded-md uppercase"
  }, "🔥 +", bulkPricing.extraPercent, "% OFF")), /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-1.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm sm:text-base font-black text-gray-950 font-poppins"
  }, "Rs. ", bulkPricing.finalTotal.toLocaleString()), bulkPricing.extraPercent > 0 && /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-gray-400 line-through font-bold"
  }, "Rs. ", bulkPricing.baseTotal.toLocaleString())))), (pricing.hasDiscount || bulkPricing.extraPercent > 0) && (() => {
    const itemSaving = pricing.savings * modalQty;
    const bulkSaving = bulkPricing.extraSavings;
    const totalSaving = itemSaving + bulkSaving;
    return /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: '1px dashed #6ee7b7',
        paddingTop: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }
    }, pricing.hasDiscount && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9.5,
        color: '#065f46',
        fontWeight: 700
      }
    }, "🏷️ Item Discount (", pricing.discountPercent, "% OFF × ", modalQty, ")"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 900,
        color: '#065f46',
        background: '#d1fae5',
        borderRadius: 5,
        padding: '1px 6px'
      }
    }, "-Rs. ", itemSaving.toLocaleString())), bulkSaving > 0 && /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9.5,
        color: '#065f46',
        fontWeight: 700
      }
    }, "🎁 Bulk Discount (+", bulkPricing.extraPercent, "% for ", modalQty, " pcs)"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 900,
        color: '#065f46',
        background: '#d1fae5',
        borderRadius: 5,
        padding: '1px 6px'
      }
    }, "-Rs. ", bulkSaving.toLocaleString())), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid #6ee7b7',
        paddingTop: 4,
        marginTop: 2
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: '#065f46',
        fontWeight: 900,
        textTransform: 'uppercase',
        letterSpacing: '0.06em'
      }
    }, "💰 ", tr(language, 'Total Savings', 'Kul Bachat', 'کل بچت')), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        fontWeight: 900,
        color: '#ffffff',
        background: '#059669',
        borderRadius: 7,
        padding: '2px 8px',
        boxShadow: '0 2px 6px rgba(5,150,105,0.3)'
      }
    }, "Rs. ", totalSaving.toLocaleString())));
  })()), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onAddToCart(product, null, modalQty);
      onClose();
    },
    className: "w-full py-2.5 px-3 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
  }, /*#__PURE__*/React.createElement("span", null, "🛒"), /*#__PURE__*/React.createElement("span", null, translate(langData, "addToCart"), " (", modalQty, ")")), /*#__PURE__*/React.createElement("button", {
    onClick: handleDirectWhatsAppOrder,
    className: "w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
  }, /*#__PURE__*/React.createElement("span", null, "💬"), /*#__PURE__*/React.createElement("span", null, tr(language, 'Buy on WhatsApp', 'WhatsApp par Order Karein', 'واٹس ایپ پر آرڈر کریں')))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg"
  }, "💯"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-gray-900"
  }, tr(language, '100% Original', '100% Asli Item', '100% اصلی آئٹم')), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-gray-500"
  }, tr(language, 'Guaranteed Quality', 'Guaranteed Mayaar', 'گارنٹی شدہ معیار')))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg"
  }, "🚚"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-gray-900"
  }, tr(language, 'Home Delivery', 'Home Delivery', 'ہوم ڈیلیوری')), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-gray-500"
  }, tr(language, 'Free on Rs 2000+', 'Rs. 2000+ par Muft', 'Rs. 2000+ پر مفت')))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg"
  }, "🏬"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-gray-900"
  }, tr(language, 'Store Pickup', 'Dukan se Pickup', 'دکان سے پک اپ')), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-gray-500"
  }, tr(language, 'BS Mart Shop Karachi', 'BS Mart Dukan Karachi', 'BS Mart دکان سے لیں'))))), relatedProducts.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 pt-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-black text-sm text-gray-900 uppercase tracking-wider"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-amber-500 text-base"
  }, "✨"), /*#__PURE__*/React.createElement("span", null, tr(language, 'You May Also Like', 'Ye Bhi Dekhein (Related Products)', 'یہ بھی دیکھیں (Related Products)'))), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-gray-400 font-medium"
  }, relatedProducts.length, " ", tr(language, 'items', 'cheezein', 'مصنوعات'))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5"
  }, relatedProducts.map(rel => {
    const relPricing = getProductPricing(rel);
    const relHasFile = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[rel.id];
    const relImgSrc = relHasFile ? getImgUrl(`images/${rel.id}.${window.PRODUCT_IMAGE_MAP[rel.id]}`) : null;
    return /*#__PURE__*/React.createElement("div", {
      key: rel.id,
      onClick: () => onSelectProduct && onSelectProduct(rel),
      className: "bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-2.5 flex flex-col justify-between transition-all cursor-pointer group shadow-xs hover:shadow-md relative overflow-hidden"
    }, relPricing.hasDiscount && /*#__PURE__*/React.createElement("span", {
      className: "absolute top-1.5 left-1.5 z-10 bg-red-600 text-white text-[8.5px] font-black px-1.5 py-0.5 rounded shadow-2xs uppercase"
    }, relPricing.discountPercent, "% OFF"), /*#__PURE__*/React.createElement("div", {
      className: "h-20 w-full bg-gray-50 rounded-xl p-1 mb-2 flex items-center justify-center overflow-hidden"
    }, relHasFile ? /*#__PURE__*/React.createElement("img", {
      src: relImgSrc,
      alt: rel.name,
      loading: "lazy",
      decoding: "async",
      className: "w-full h-full object-contain group-hover:scale-105 transition-transform"
    }) : /*#__PURE__*/React.createElement("div", {
      className: `w-10 h-10 rounded-lg bg-gradient-to-br ${rel.gradient || 'from-gray-400 to-gray-600'} flex items-center justify-center text-white text-xs font-bold`
    }, rel.initial || 'P')), /*#__PURE__*/React.createElement("p", {
      className: "text-[11px] font-bold text-gray-800 line-clamp-2 leading-tight mb-1 group-hover:text-black"
    }, getProductDisplayName(rel, language)), /*#__PURE__*/React.createElement("div", {
      className: "flex items-center justify-between gap-1 mt-auto pt-1 border-t border-gray-100"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-extrabold text-black"
    }, "Rs.", relPricing.sellingPrice.toLocaleString()), relPricing.hasDiscount && /*#__PURE__*/React.createElement("span", {
      className: "text-[9.5px] text-gray-400 line-through font-semibold"
    }, "Rs.", relPricing.retailPrice.toLocaleString())), /*#__PURE__*/React.createElement("button", {
      onClick: e => {
        e.stopPropagation();
        onAddToCart(rel);
      },
      className: "w-6 h-6 rounded-lg bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center transition-colors cursor-pointer shrink-0",
      title: "Quick Add to Cart"
    }, "+")));
  })))), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border-t border-gray-100 bg-gray-50 text-center"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "w-full py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
  }, tr(language, 'Close', 'Band Karein', 'بند کریں')))));
}

// -----------------------------------------------------------------------------
// Variant Selection Modal (for Hair Colour Shades and options)
// -----------------------------------------------------------------------------
function VariantSelectionModal({
  product,
  open,
  onClose,
  onConfirm,
  language,
  langData
}) {
  if (!open || !product) return null;
  const config = window.PRODUCT_VARIANTS && window.PRODUCT_VARIANTS[product.id] || {
    title: "Select Option",
    options: []
  };
  const [selectedOption, setSelectedOption] = useState(() => config.options[0] || "");
  const [qty, setQty] = useState(1);
  useEffect(() => {
    if (config.options && config.options.length > 0) {
      setSelectedOption(config.options[0]);
    }
    setQty(1);
  }, [product]);
  const ext = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id];
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full max-w-lg bg-white rounded-3xl border border-gray-200 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-4 sm:p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, ext ? /*#__PURE__*/React.createElement("img", {
    src: getImgUrl(`images/${product.id}.${ext}`),
    alt: "",
    className: "w-12 h-12 rounded-xl object-contain bg-white border border-gray-200 p-1 shrink-0"
  }) : /*#__PURE__*/React.createElement("div", {
    className: `w-12 h-12 rounded-xl bg-gradient-to-br ${product.gradient || 'from-gray-400 to-gray-600'} flex items-center justify-center shrink-0 text-slate-800 font-bold text-lg`
  }, product.initial || 'P'), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "font-black text-slate-900 text-sm sm:text-base leading-snug"
  }, toTitleCase(product.name)), /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-extrabold text-emerald-600 mt-0.5"
  }, "Rs ", product.price.toLocaleString()))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "w-9 h-9 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-colors shrink-0 font-bold"
  }, "✕")), /*#__PURE__*/React.createElement("div", {
    className: "px-4 py-3 bg-amber-50 border-b border-amber-100 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-base"
  }, "🎨"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-black text-amber-900"
  }, tr(language, 'Select Hair Colour Shade', 'Colour Shade / Number Chunain:', '\u06a9\u0644\u0631 \u0634\u06cc\u0688 \u0645\u0646\u062a\u062e\u0628 \u06a9\u0631\u06cc\u06ba:')), /*#__PURE__*/React.createElement("p", {
    className: "text-[10.5px] font-bold text-amber-700"
  }, tr(language, 'Choose your preferred shade number before adding to cart', 'Cart mein add karne se pehle apna pasandida colour number select karein', '\u06a9\u0627\u0631\u067c \u0645\u06cc\u06ba \u0634\u0627\u0645\u0644 \u06a9\u0631\u0646\u06d2 \u0633\u06d2 \u067e\u06c1\u0644\u06d2 \u0627\u067e\u0646\u0627 \u06a9\u0644\u0631 \u0646\u0645\u0628\u0631 \u0645\u0646\u062a\u062e\u0628 \u06a9\u0631\u06cc\u06ba'))))), /*#__PURE__*/React.createElement("div", {
    className: "p-4 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-2"
  }, config.options.map(opt => {
    const isSelected = selectedOption === opt;
    const spaceIdx = opt.indexOf(' ');
    const num = spaceIdx > -1 ? opt.substring(0, spaceIdx) : '';
    const label = spaceIdx > -1 ? opt.substring(spaceIdx + 1) : opt;
    return /*#__PURE__*/React.createElement("button", {
      key: opt,
      type: "button",
      onClick: () => setSelectedOption(opt),
      className: `p-3 rounded-2xl border text-left flex items-center justify-between gap-2.5 transition-all duration-200 cursor-pointer ${isSelected ? 'border-emerald-600 bg-emerald-50/80 shadow-md ring-2 ring-emerald-500/20' : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'}`
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-center gap-2.5 min-w-0"
    }, /*#__PURE__*/React.createElement("span", {
      className: `w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs shrink-0 ${isSelected ? 'bg-emerald-600 text-white shadow-sm' : 'bg-slate-100 text-slate-700'}`
    }, num || '•'), /*#__PURE__*/React.createElement("span", {
      className: `text-xs font-bold truncate ${isSelected ? 'text-emerald-950 font-black' : 'text-slate-700'}`
    }, label)), /*#__PURE__*/React.createElement("div", {
      className: `w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-emerald-600 bg-emerald-600 text-white' : 'border-gray-300 bg-white'}`
    }, isSelected && /*#__PURE__*/React.createElement("span", {
      className: "text-[10px] font-bold"
    }, "✓")));
  })), /*#__PURE__*/React.createElement("div", {
    className: "p-4 border-t border-gray-100 bg-white space-y-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-1 text-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-bold text-gray-400 uppercase tracking-wider"
  }, tr(language, 'Wholesale Packs:', 'Bulk Packs:', 'ہول سیل پیک:')), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1 overflow-x-auto py-0.5"
  }, [6, 12, 24, 36, 48, 60].map(qOpt => /*#__PURE__*/React.createElement("button", {
    key: qOpt,
    type: "button",
    onClick: () => setQty(qOpt),
    className: `text-[11px] font-black px-2.5 py-0.5 rounded-md border transition-all cursor-pointer ${qty === qOpt ? 'bg-black text-white border-black shadow-xs' : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'}`
  }, qOpt)))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 bg-slate-100 border border-slate-200 rounded-xl p-1 shrink-0"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setQty(q => Math.max(1, q - 1)),
    className: "w-7 h-7 rounded-lg bg-white text-slate-800 font-black text-sm flex items-center justify-center hover:bg-slate-200 shadow-2xs cursor-pointer"
  }, "-"), /*#__PURE__*/React.createElement("input", {
    type: "number",
    min: "1",
    value: qty,
    onChange: e => {
      const val = parseInt(e.target.value, 10);
      setQty(isNaN(val) || val < 1 ? 1 : val);
    },
    className: "w-8 text-center font-black text-xs text-slate-900 bg-transparent border-none focus:outline-hidden"
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => setQty(q => q + 1),
    className: "w-7 h-7 rounded-lg bg-white text-slate-800 font-black text-sm flex items-center justify-center hover:bg-slate-200 shadow-2xs cursor-pointer"
  }, "+")), /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      if (!selectedOption) return;
      onConfirm(product, selectedOption, qty);
    },
    className: "flex-1 py-3 px-4 rounded-2xl bg-black hover:bg-emerald-700 text-white font-black text-xs sm:text-sm tracking-wide uppercase shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
  }, /*#__PURE__*/React.createElement("span", null, "+ ", translate(langData, "addToCart"), " (", qty, ")"), /*#__PURE__*/React.createElement("span", {
    className: "opacity-75 font-normal text-[11px]"
  }, "(", selectedOption, ")"))))));
}
function SahilTraders() {
  const products = typeof window !== 'undefined' && Array.isArray(window.PRODUCTS) && window.PRODUCTS.length > 0 ? window.PRODUCTS : PRODUCTS;
  const [aboutOpen, setAboutOpen] = useState(false);
  const [returnPolicyOpen, setReturnPolicyOpen] = useState(false);
  const [language, setLanguage] = useState("en");
  const [welcomeOpen, setWelcomeOpen] = useState(() => {
    try {
      return !sessionStorage.getItem("sahil_traders_welcome_seen");
    } catch (e) {
      return true;
    }
  });
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState(null); // null = show category home
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [variantModalProduct, setVariantModalProduct] = useState(null);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchBoxRef = useRef(null);
  const [cartNotice, setCartNotice] = useState(false);
  const cartNoticeTimerRef = useRef(null);
  // -----------------------------------------------------------------------------
  // Persistent Cart State via localStorage (reloads/refreshes won't lose items!)
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem("sahil_traders_cart");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderHistoryOpen, setOrderHistoryOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [orderHistory, setOrderHistory] = useState(() => {
    try {
      const saved = localStorage.getItem("sahil_traders_order_history");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [exitModalOpen, setExitModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  function selectProductWithHash(product) {
    setSelectedProduct(product);
  }
  const isSearching = searchTerm.trim() !== "";
  const backStateRef = useRef({});
  const allowRealBackRef = useRef(false);
  const restoreBackGuardRef = useRef(() => {});
  const appHistoryReadyRef = useRef(false);
  const restoringHistoryRef = useRef(false);
  const lastHistoryKeyRef = useRef("");
  const appHistoryDepthRef = useRef(0);
  const lastSearchActiveRef = useRef(false);
  useEffect(() => {
    try {
      localStorage.setItem("sahil_traders_cart", JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Auto-scroll to absolute top of page whenever category or brand selection changes
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant'
    });
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }, [selectedCategory, activeCategory, selectedBrand]);
  function persistCartSnapshot(nextCart) {
    try {
      if (!nextCart || nextCart.length === 0) {
        localStorage.removeItem("sahil_traders_cart");
      } else {
        localStorage.setItem("sahil_traders_cart", JSON.stringify(nextCart));
      }
    } catch (e) {}
  }
  useEffect(() => {
    return () => {
      if (cartNoticeTimerRef.current) clearTimeout(cartNoticeTimerRef.current);
    };
  }, []);
  function showCartNotice() {
    if (cartNoticeTimerRef.current) clearTimeout(cartNoticeTimerRef.current);
    setCartNotice(true);
    cartNoticeTimerRef.current = setTimeout(() => setCartNotice(false), 1100);
  }
  useEffect(() => {
    backStateRef.current = {
      checkoutOpen,
      cartOpen,
      exitModalOpen,
      selectedCategory,
      selectedBrand,
      searchTerm,
      isSearching,
      activeCategory
    };
  }, [checkoutOpen, cartOpen, exitModalOpen, selectedCategory, selectedBrand, searchTerm, isSearching, activeCategory]);
  // App Back Button Controller: browser/device Back restores the previous store screen first.
  useEffect(() => {
    const getSnapshot = state => ({
      checkoutOpen: !!state.checkoutOpen,
      cartOpen: !!state.cartOpen,
      selectedCategory: state.selectedCategory || null,
      selectedBrand: state.selectedBrand || "all",
      searchTerm: state.searchTerm || "",
      activeCategory: state.activeCategory || "all"
    });
    const keyOf = snapshot => JSON.stringify(snapshot);
    const pushCurrentAppState = (replace, force) => {
      if (allowRealBackRef.current) return;
      try {
        const snapshot = getSnapshot(backStateRef.current || {});
        const key = keyOf(snapshot);
        if (!force && !replace && key === lastHistoryKeyRef.current) return;
        const entry = {
          page: 'sahil-app-state',
          sahilApp: true,
          snapshot
        };
        if (replace) window.history.replaceState(entry, '', window.location.href);else {
          window.history.pushState(entry, '', window.location.href);
          appHistoryDepthRef.current += 1;
        }
        lastHistoryKeyRef.current = key;
      } catch (e) {}
    };
    restoreBackGuardRef.current = (replace, force) => pushCurrentAppState(!!replace, !!force);
    const exitStore = () => {
      allowRealBackRef.current = true;
      setExitModalOpen(false);
      const steps = Math.max(2, appHistoryDepthRef.current + 1);
      try {
        window.history.go(-steps);
      } catch (e) {}
      setTimeout(() => {
        try {
          window.location.replace('about:blank');
        } catch (e) {}
      }, 900);
    };
    window.sahilExitStore = exitStore;
    const restoreSnapshot = snapshot => {
      restoringHistoryRef.current = true;
      setExitModalOpen(false);
      setFilterMenuOpen(false);
      setSuggestOpen(false);
      setCheckoutOpen(!!snapshot.checkoutOpen);
      setCartOpen(!!snapshot.cartOpen);
      setSearchTerm(snapshot.searchTerm || "");
      setSelectedCategory(snapshot.selectedCategory || null);
      setSelectedBrand(snapshot.selectedBrand || "all");
      setActiveCategory(snapshot.activeCategory || "all");
      setTimeout(() => {
        restoringHistoryRef.current = false;
      }, 0);
    };
    try {
      window.history.replaceState({
        page: 'sahil-back-base'
      }, '', window.location.href);
      pushCurrentAppState(false);
      appHistoryReadyRef.current = true;
    } catch (e) {}
    const handlePopState = event => {
      if (allowRealBackRef.current) return;
      if (event && event.preventDefault) event.preventDefault();
      if (event.state && event.state.sahilApp && event.state.snapshot) {
        lastHistoryKeyRef.current = keyOf(event.state.snapshot);
        restoreSnapshot(event.state.snapshot);
        return;
      }
      pushCurrentAppState(false, true);
      setExitModalOpen(true);
    };
    const handlePageShow = () => {
      allowRealBackRef.current = false;
      pushCurrentAppState(false, true);
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('pageshow', handlePageShow);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('pageshow', handlePageShow);
      if (window.sahilExitStore === exitStore) delete window.sahilExitStore;
    };
  }, []);
  useEffect(() => {
    if (!appHistoryReadyRef.current || restoringHistoryRef.current || exitModalOpen) return;
    const searchingNow = searchTerm.trim() !== "";
    const replaceSearchTyping = searchingNow && lastSearchActiveRef.current;
    lastSearchActiveRef.current = searchingNow;
    const timer = setTimeout(() => restoreBackGuardRef.current(replaceSearchTyping, false), 0);
    return () => clearTimeout(timer);
  }, [checkoutOpen, cartOpen, selectedCategory, selectedBrand, searchTerm, activeCategory, exitModalOpen]);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + calculateBulkPricing(i.product.price, i.qty).finalTotal, 0);
  const cartBulkSavings = cart.reduce((sum, i) => sum + calculateBulkPricing(i.product.price, i.qty).extraSavings, 0);
  function addToCart(product, variant = null, qtyToAdd = 1, sourceElement = null) {
    if (window.PRODUCT_VARIANTS && window.PRODUCT_VARIANTS[product.id] && !variant) {
      setVariantModalProduct(product);
      return;
    }
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id && (i.variant || null) === (variant || null));
      let next;
      if (existing) {
        next = prev.map(i => i.product.id === product.id && (i.variant || null) === (variant || null) ? {
          ...i,
          qty: i.qty + qtyToAdd
        } : i);
      } else {
        next = [...prev, {
          product,
          qty: qtyToAdd,
          variant: variant || null
        }];
      }
      persistCartSnapshot(next);
      return next;
    });
    showCartNotice();
    if (sourceElement) {
      flyProductToCart(product, sourceElement);
    }
  }
  function flyProductToCart(product, sourceElement) {
    const cartBtn = document.getElementById('cart-btn');
    if (!cartBtn || !sourceElement) return;
    const sourceCard = sourceElement.closest('.product-card');
    const sourceImage = sourceCard?.querySelector('.product-card-main-img');
    const sourceRect = (sourceImage || sourceElement).getBoundingClientRect();
    const cartRect = cartBtn.getBoundingClientRect();
    const startX = sourceRect.right - Math.min(12, sourceRect.width * 0.12);
    const startY = sourceRect.top + sourceRect.height / 2;
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 2;
    const flyerSize = 58;
    const flyer = document.createElement('div');
    const ext = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id];
    Object.assign(flyer.style, {
      position: 'fixed',
      left: `${startX - flyerSize / 2}px`,
      top: `${startY - flyerSize / 2}px`,
      width: `${flyerSize}px`,
      height: `${flyerSize}px`,
      zIndex: 120,
      pointerEvents: 'none',
      borderRadius: '16px',
      background: '#ffffff',
      border: '1px solid rgba(22,163,74,0.35)',
      boxShadow: '0 18px 40px rgba(0,0,0,0.24)',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      willChange: 'transform, opacity'
    });
    if (ext) {
      const img = document.createElement('img');
      img.src = `images/${product.id}.${ext}`;
      img.alt = '';
      Object.assign(img.style, {
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        padding: '5px'
      });
      flyer.appendChild(img);
    } else {
      flyer.textContent = product.initial || product.name?.charAt(0) || '+';
      Object.assign(flyer.style, {
        color: '#16a34a',
        fontWeight: 900,
        fontFamily: "'Poppins', sans-serif",
        fontSize: '22px'
      });
    }
    document.body.appendChild(flyer);
    const dx = endX - startX;
    const dy = endY - startY;
    const rightExitX = Math.max(44, Math.min(96, sourceRect.width * 0.45));
    const downSweepY = Math.max(92, Math.min(170, Math.abs(dy) * 0.25 + 70));
    const leftSweepX = -Math.max(80, Math.min(175, Math.abs(dx) * 0.18 + 60));
    const leftOfCartX = dx - Math.max(72, cartRect.width * 1.2);
    const rightOfCartX = dx + Math.max(48, cartRect.width * 0.75);
    const overCartY = dy - Math.max(92, cartRect.height * 2.2);
    const underCartY = dy + Math.max(30, cartRect.height * 0.55);
    const keyframes = [{
      transform: 'translate3d(0,0,0) scale(1) rotate(0deg)',
      opacity: 1,
      offset: 0
    }, {
      transform: `translate3d(${rightExitX}px, ${downSweepY * 0.18}px, 0) scale(1.05) rotate(20deg)`,
      opacity: 1,
      offset: 0.12
    }, {
      transform: `translate3d(${leftSweepX}px, ${downSweepY}px, 0) scale(1) rotate(-95deg)`,
      opacity: 1,
      offset: 0.3
    }, {
      transform: `translate3d(${leftOfCartX}px, ${overCartY}px, 0) scale(0.82) rotate(230deg)`,
      opacity: 1,
      offset: 0.54
    }, {
      transform: `translate3d(${rightOfCartX}px, ${dy - 24}px, 0) scale(0.62) rotate(470deg)`,
      opacity: 0.96,
      offset: 0.72
    }, {
      transform: `translate3d(${dx - 28}px, ${underCartY}px, 0) scale(0.42) rotate(690deg)`,
      opacity: 0.9,
      offset: 0.86
    }, {
      transform: `translate3d(${dx + 10}px, ${dy - 10}px, 0) scale(0.24) rotate(820deg)`,
      opacity: 0.7,
      offset: 0.95
    }, {
      transform: `translate3d(${dx}px, ${dy}px, 0) scale(0.12) rotate(900deg)`,
      opacity: 0,
      offset: 1
    }];
    const timing = {
      duration: 2900,
      easing: 'cubic-bezier(.18,.72,.2,1)',
      fill: 'forwards'
    };
    const finish = () => {
      flyer.remove();
      if (cartBtn.animate) {
        cartBtn.animate([{
          transform: 'scale(1)'
        }, {
          transform: 'scale(1.12)'
        }, {
          transform: 'scale(1)'
        }], {
          duration: 340,
          easing: 'ease-out'
        });
      }
    };
    if (flyer.animate) {
      const animation = flyer.animate(keyframes, timing);
      animation.onfinish = finish;
      animation.oncancel = finish;
    } else {
      flyer.style.transition = 'transform 0.9s ease, opacity 0.9s ease';
      requestAnimationFrame(() => {
        flyer.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(0.12) rotate(900deg)`;
        flyer.style.opacity = '0';
      });
      setTimeout(finish, 2920);
    }
  }
  function updateQty(productId, delta, variant = null) {
    setCart(prev => {
      const updated = prev.map(i => i.product.id === productId && (i.variant || null) === (variant || null) ? {
        ...i,
        qty: Math.max(0, i.qty + delta)
      } : i).filter(i => i.qty > 0);
      persistCartSnapshot(updated);
      return updated;
    });
  }
  function removeFromCart(productId, variant = null) {
    setCart(prev => {
      const updated = prev.filter(i => !(i.product.id === productId && (i.variant || null) === (variant || null)));
      persistCartSnapshot(updated);
      return updated;
    });
  }
  function clearCart() {
    setCart([]);
    try {
      localStorage.removeItem("sahil_traders_cart");
    } catch (e) {}
  }
  function saveOrderHistory(order) {
    if (!order) return;
    setOrderHistory(prev => {
      const next = [order, ...prev].slice(0, 50);
      try {
        localStorage.setItem("sahil_traders_order_history", JSON.stringify(next));
      } catch (e) {}
      return next;
    });
  }
  function clearOrderHistory() {
    setOrderHistory([]);
    try {
      localStorage.removeItem("sahil_traders_order_history");
    } catch (e) {}
  }
  // -----------------------------------------------------------------------------
  // -----------------------------------------------------------------------------
  function handleGoBack() {
    setFilterMenuOpen(false);
    if (selectedBrand !== "all") {
      setSelectedBrand("all");
      return;
    }
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedBrand("all");
    setActiveCategory("all");
  }
  function handleSelectProductFromCart(product) {
    setCartOpen(false);
    if (product) {
      setSelectedProduct(product);
    }
  }
  // -----------------------------------------------------------------------------
  const langData = useMemo(() => {
    return window.TRANSLATIONS?.[language] || window.TRANSLATIONS?.en || {};
  }, [language]);
  // Memoized 18 random floating product silhouettes (raw line-art vector outlines)
  const floatingSilhouettes = useMemo(() => {
    const types = [ShampooIcon, SoapIcon, FaceWashIcon, CreamIcon, RazorIcon, PerfumeIcon];
    return Array.from({
      length: 18
    }).map((_, idx) => {
      const Icon = types[idx % types.length];
      const left = Math.random() * 90 + 5; // 5% to 95%
      const top = Math.random() * 90 + 5; // 5% to 95%
      const scale = 0.4 + Math.random() * 0.7; // size variety
      const opacity = 0.05 + Math.random() * 0.07; // very faint, barely visible (0.05–0.12)
      const duration = 20 + Math.random() * 25; // 20s to 45s
      const delay = -Math.random() * 25;
      const animType = Math.floor(Math.random() * 4) + 1; // float-drift-1 to 4
      return {
        id: idx,
        Icon,
        left,
        top,
        scale,
        opacity,
        duration,
        delay,
        animType
      };
    });
  }, []);
  // Intelligent Asset & Image Preloader during Intro Animation
  useEffect(() => {
    if (!showSplash) return;
    // Preload first 20 product images eagerly with mapped extension
    const imageMap = window.PRODUCT_IMAGE_MAP || {};
    const eagerIds = Object.keys(imageMap).slice(0, 20);
    eagerIds.forEach(id => {
      const ext = imageMap[id] || 'png';
      const img = new Image();
      img.src = `images/${id}.${ext}`;
    });
    const fadeTimer = setTimeout(() => {
      setFadeSplash(true);
    }, 2500);
    const removeTimer = setTimeout(() => {
      setShowSplash(false);
    }, 3200);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, [showSplash]);
  useEffect(() => {
    function handleClickOutside(e) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setSuggestOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  useEffect(() => {
    setSelectedBrand("all");
    setFilterMenuOpen(false);
    setVisibleCount(24);
  }, [selectedCategory, searchTerm]);
  // Automatic background image pre-caching to user phone internal storage
  useEffect(() => {
    if (typeof window !== 'undefined' && window.PRODUCT_IMAGE_MAP) {
      const timer = setTimeout(() => {
        const ids = Object.keys(window.PRODUCT_IMAGE_MAP);
        let idx = 0;
        const preloadBatch = () => {
          if (idx >= ids.length) return;
          const batch = ids.slice(idx, idx + 6);
          idx += 6;
          batch.forEach(id => {
            const ext = window.PRODUCT_IMAGE_MAP[id];
            const img = new Image();
            img.src = `https://sahiltraders.vercel.app/images/${id}.${ext}`;
          });
          if (idx < ids.length) {
            if ('requestIdleCallback' in window) {
              window.requestIdleCallback(preloadBatch, {
                timeout: 2000
              });
            } else {
              setTimeout(preloadBatch, 400);
            }
          }
        };
        preloadBatch();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, []);
  const baseFiltered = useMemo(() => {
    const term = searchTerm.trim();
    if (term === "") {
      if (selectedCategory) return products.filter(p => p.categoryId === selectedCategory);
      return products;
    }
    const scored = [];
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const score = matchProductTokens(p, term);
      if (score > 0) {
        scored.push({
          product: p,
          score
        });
      }
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.map(item => item.product);
  }, [products, selectedCategory, searchTerm]);
  const brandFilters = useMemo(() => {
    if (!selectedCategory || isSearching) return [];
    return getBrandFilters(baseFiltered);
  }, [baseFiltered, selectedCategory, isSearching]);
  const filtered = useMemo(() => {
    if (!selectedCategory || isSearching || selectedBrand === "all") return baseFiltered;
    return baseFiltered.filter(p => getProductFilterName(p) === selectedBrand);
  }, [baseFiltered, selectedCategory, isSearching, selectedBrand]);
  const sortedProducts = useMemo(() => {
    const list = [...filtered];
    if (sortBy === "price_asc") {
      return list.sort((a, b) => {
        if (a.price === 0) return 1;
        if (b.price === 0) return -1;
        return a.price - b.price;
      });
    } else if (sortBy === "price_desc") {
      return list.sort((a, b) => b.price - a.price);
    } else if (sortBy === "popularity") {
      if (isSearching) {
        return list;
      }
      return list.sort((a, b) => {
        const aHasImg = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[a.id] || a.hasImage ? 1 : 0;
        const bHasImg = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[b.id] || b.hasImage ? 1 : 0;
        if (aHasImg !== bHasImg) return bHasImg - aHasImg;
        return a.id - b.id;
      });
    } else if (sortBy === "name_asc") {
      return list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [filtered, sortBy, isSearching]);
  const suggestions = useMemo(() => {
    const term = searchTerm.trim();
    if (term === "") return [];
    const scored = [];
    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      const score = matchProductTokens(p, term);
      if (score > 0) {
        scored.push({
          product: p,
          score
        });
      }
    }
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, 6).map(item => item.product);
  }, [products, searchTerm]);
  function recordSearch(product) {
    if (!product) return;
    setRecentSearches(prev => {
      const withoutDup = prev.filter(p => p.id !== product.id);
      return [product, ...withoutDup].slice(0, RECENT_LIMIT);
    });
  }
  function handleSuggestionClick(product) {
    setSearchTerm(product.name);
    setSuggestOpen(false);
    recordSearch(product);
  }
  function handleSearchKeyDown(e) {
    if (e.key === "Enter" && suggestions.length > 0) {
      recordSearch(suggestions[0]);
      setSuggestOpen(false);
    }
  }
  // Show search results if searching, else show category home or products
  const showCategoryHome = !isSearching && !selectedCategory;
  const categoriesList = getGlobalCategories();
  const selectedCategoryName = selectedCategory ? langData.categories?.[selectedCategory] || categoriesList.find(c => c.id === selectedCategory)?.name || selectedCategory : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen relative text-gray-900 overflow-x-hidden",
    style: {
      fontFamily: language === 'ur' ? "'Noto Sans Urdu', 'Inter', sans-serif" : "'Inter', system-ui, sans-serif"
    }
  }, showSplash && /*#__PURE__*/React.createElement("div", {
    className: `fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-all duration-700 select-none overflow-hidden ${fadeSplash ? "opacity-0 scale-105 pointer-events-none" : "opacity-100"}`,
    style: {
      background: 'radial-gradient(ellipse at center, #0f172a 0%, #090d16 60%, #030712 100%)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full bg-emerald-500/15 luxury-aura pointer-events-none -translate-y-8"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute w-[260px] h-[260px] sm:w-[380px] sm:h-[380px] rounded-full bg-amber-500/10 luxury-aura pointer-events-none translate-y-12",
    style: {
      animationDelay: '2s'
    }
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setFadeSplash(true);
      setTimeout(() => setShowSplash(false), 400);
    },
    className: "absolute top-6 right-6 z-30 bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 px-3.5 py-1.5 rounded-full text-[11px] font-bold tracking-wider text-slate-300 hover:text-white transition-all cursor-pointer backdrop-blur-md flex items-center gap-1.5 shadow-lg"
  }, /*#__PURE__*/React.createElement("span", null, translate(langData, "skipIntro")), /*#__PURE__*/React.createElement("svg", {
    className: "w-3.5 h-3.5 text-slate-300",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M13 5l7 7-7 7M5 5l7 7-7 7"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "relative flex flex-col items-center px-6 z-10 max-w-sm text-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "luxury-logo-box"
  }, /*#__PURE__*/React.createElement("div", {
    className: "luxury-float relative w-28 h-28 sm:w-36 sm:h-36 rounded-3xl bg-white/10 border border-white/20 backdrop-blur-xl p-4 flex items-center justify-center shadow-2xl shadow-emerald-950/60"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 rounded-3xl bg-gradient-to-tr from-emerald-500/20 via-transparent to-amber-500/20 pointer-events-none"
  }), /*#__PURE__*/React.createElement("img", {
    src: "images/sahil-traders-logo.png",
    alt: "Sahil Traders",
    className: "w-full h-full object-contain filter drop-shadow-md"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "luxury-text-anim-1 mt-6"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-3xl sm:text-4xl font-black tracking-[0.2em] uppercase text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-100 to-slate-300 drop-shadow-sm",
    style: {
      fontFamily: "'Poppins', sans-serif"
    }
  }, "Sahil Traders")), /*#__PURE__*/React.createElement("div", {
    className: "luxury-text-anim-2 mt-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 backdrop-blur-md"
  }, /*#__PURE__*/React.createElement("span", {
    className: "w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] font-extrabold tracking-[0.15em] text-emerald-400 uppercase"
  }, "Wholesale & Retail Pakistan"))), /*#__PURE__*/React.createElement("div", {
    className: "luxury-text-anim-3 mt-8 flex flex-col items-center w-full max-w-[200px]"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full h-1 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/5 backdrop-blur-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-400 rounded-full luxury-progress shadow-sm shadow-emerald-400/50"
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] font-semibold text-slate-400 tracking-widest uppercase mt-2.5"
  }, "Loading Store Catalog...")))), /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 -z-10 bg-white"
  }), /*#__PURE__*/React.createElement("div", {
    className: "top-delivery-bar bg-gray-900 text-white text-[11px] font-medium py-1.5 px-4 shadow-inner border-b border-gray-800"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-6xl mx-auto flex items-center justify-between gap-2 flex-wrap text-gray-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-amber-400 font-bold"
  }, "⏰ ", tr(language, 'Delivery Timing:', 'Delivery Timing:', 'ڈیلیوری ٹائمنگ:')), /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-white"
  }, tr(language, '10:00 AM – 8:00 PM (Mon – Sat)', '10:00 AM – 8:00 PM (Peer ta Hafta)', 'صبح 10:00 بجے سے رات 8:00 بجے تک (پیر تا ہفتہ)'))), /*#__PURE__*/React.createElement("div", {
    className: "hidden sm:flex items-center gap-3 text-[10px] text-gray-400"
  }, /*#__PURE__*/React.createElement("span", null, "📍 ", tr(language, "Delivery in Karachi Only", "Delivery Sirf Karachi ke Liye Hai", "ڈلیوری صرف کراچی کے لئے دستیاب ہے")), /*#__PURE__*/React.createElement("span", null, "•"), /*#__PURE__*/React.createElement("span", null, "🚚 ", tr(language, 'Free Shipping on Rs. 2,000+', 'Rs. 2,000+ par Free Delivery', 'مفت ڈیلیوری Rs. 2,000 سے زائد پر')), /*#__PURE__*/React.createElement("span", null, "•"), /*#__PURE__*/React.createElement("span", null, "💬 ", tr(language, 'WhatsApp Orders Active', 'WhatsApp Orders Jari', 'واٹس ایپ آرڈرز جاری')), /*#__PURE__*/React.createElement("span", null, "•"), /*#__PURE__*/React.createElement("a", {
    href: "tel:03368945775",
    className: "hover:underline text-white font-bold flex items-center gap-1 text-decoration-none"
  }, /*#__PURE__*/React.createElement("span", null, "📞"), /*#__PURE__*/React.createElement("span", null, tr(language, "Call: 0336-8945775", "Call: 0336-8945775", "\u06a9\u0627\u0644: 0336-8945775")))))), /*#__PURE__*/React.createElement("header", {
    className: "sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-6xl mx-auto px-4 py-3 mobile-header-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("img", {
    src: "images/sahil-traders-logo.png",
    alt: "Sahil Traders",
    className: "w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "mobile-logo-title text-lg sm:text-xl font-black leading-tight tracking-widest uppercase",
    style: {
      fontFamily: "'Poppins', sans-serif",
      color: '#000000'
    }
  }, "Sahil Traders"))), /*#__PURE__*/React.createElement("div", {
    className: "hidden sm:flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("select", {
    value: language,
    onChange: e => setLanguage(e.target.value),
    className: "border rounded-xl px-2.5 py-2 text-xs font-semibold transition-all cursor-pointer",
    style: {
      background: '#ffffff',
      borderColor: 'rgba(0,0,0,0.12)',
      color: '#111111'
    },
    onMouseEnter: e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.25)',
    onMouseLeave: e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'
  }, /*#__PURE__*/React.createElement("option", {
    value: "en",
    style: {
      background: '#ffffff',
      color: '#1a1a2e'
    }
  }, "English"), /*#__PURE__*/React.createElement("option", {
    value: "ro",
    style: {
      background: '#ffffff',
      color: '#1a1a2e'
    }
  }, "Roman Urdu"), /*#__PURE__*/React.createElement("option", {
    value: "ur",
    style: {
      background: '#ffffff',
      color: '#1a1a2e'
    }
  }, "اردو")), /*#__PURE__*/React.createElement("button", {
    onClick: () => setReturnPolicyOpen(true),
    className: "flex items-center gap-1.5 border px-2.5 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-gray-50 cursor-pointer",
    style: {
      background: '#ffffff',
      borderColor: 'rgba(0,0,0,0.12)',
      color: '#111111'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 text-emerald-600",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
  })), /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline"
  }, tr(language, 'Return Policy', 'Wapsi Policy', '\u0648\u0627\u067e\u0633\u06cc \u06a9\u06cc \u067e\u0627\u0644\u06cc\u0633\u06cc'))), /*#__PURE__*/React.createElement("a", {
    href: "tel:03368945775",
    className: "flex items-center gap-1.5 border px-2.5 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-gray-50 cursor-pointer text-decoration-none",
    style: {
      background: '#ffffff',
      borderColor: 'rgba(0,0,0,0.12)',
      color: '#111111'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 text-blue-600",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.15 1.15 0 00-1.01.258l-1.589 1.589a13.385 13.385 0 01-6.697-6.697l1.589-1.589a1.15 1.15 0 00.258-1.01L7.544 3.102A1.125 1.125 0 006.453 2.25H5.08A2.25 2.25 0 002.25 4.5v2.25z"
  })), /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline"
  }, tr(language, 'Call: 0336-8945775', 'Call: 0336-8945775', '\u06a9\u0627\u0644: 0336-8945775'))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setAboutOpen(true),
    className: "flex items-center gap-1.5 border px-2.5 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-gray-50 cursor-pointer",
    style: {
      background: '#ffffff',
      borderColor: 'rgba(0,0,0,0.12)',
      color: '#111111'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 text-gray-700",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H21m-4.5 0H12m-9 0h4.5m0 0V9a2.25 2.25 0 012.25-2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44.505.75.958.75h3.423a.75.75 0 00.75-.75V6.75A2.25 2.25 0 0017.25 4.5h-10.5A2.25 2.25 0 004.5 6.75V21"
  })), /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline"
  }, tr(language, 'About Us', 'Hamare Baare Mein', '\u06c1\u0645\u0627\u0631\u06d2 \u0628\u0627\u0631\u06d2 \u0645\u06cc\u06ba'))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setOrderHistoryOpen(true),
    className: "relative flex items-center gap-1.5 border px-2.5 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-gray-50 cursor-pointer",
    style: {
      background: '#ffffff',
      borderColor: orderHistory.length > 0 ? '#111111' : 'rgba(0,0,0,0.12)',
      color: '#111111'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 text-gray-700",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
  })), /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline"
  }, tr(language, 'Orders', 'Orders', '\u0622\u0631\u0688\u0631 \u06c1\u0633\u0679\u0631\u06cc')), orderHistory.length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-2 -right-2 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black flex items-center justify-center",
    style: {
      background: '#16a34a',
      color: '#ffffff'
    }
  }, orderHistory.length)), /*#__PURE__*/React.createElement("button", {
    id: "cart-btn",
    onClick: () => setCartOpen(true),
    className: "relative flex items-center gap-2 border px-3 py-2 rounded-xl text-sm font-semibold transition-all cursor-pointer",
    style: {
      background: '#ffffff',
      borderColor: cartCount > 0 ? '#000000' : 'rgba(0,0,0,0.12)',
      color: '#111111'
    },
    onMouseEnter: e => e.currentTarget.style.borderColor = cartCount > 0 ? '#000000' : 'rgba(0,0,0,0.25)',
    onMouseLeave: e => e.currentTarget.style.borderColor = cartCount > 0 ? '#000000' : 'rgba(0,0,0,0.12)'
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
  })), /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline"
  }, tr(language, 'Cart', 'Cart', '\u06a9\u0627\u0631\u0679')), cartCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full text-[11px] font-black flex items-center justify-center",
    style: {
      background: '#000000',
      color: '#ffffff'
    }
  }, cartCount))), /*#__PURE__*/React.createElement("div", {
    className: "flex sm:hidden items-center gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    id: "cart-btn-mobile",
    onClick: () => setCartOpen(true),
    className: "relative flex items-center justify-center border px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs",
    style: {
      background: cartCount > 0 ? '#000000' : '#ffffff',
      borderColor: cartCount > 0 ? '#000000' : 'rgba(0,0,0,0.15)',
      color: cartCount > 0 ? '#ffffff' : '#111111'
    },
    "aria-label": "View Shopping Cart"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
  })), cartCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "ml-1 font-extrabold"
  }, cartCount), cartCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-black flex items-center justify-center border-2 border-white shadow-xs",
    style: {
      background: '#ef4444',
      color: '#ffffff'
    }
  }, cartCount)), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMobileMenuOpen(prev => !prev),
    className: "relative flex items-center justify-center border p-2 rounded-xl transition-all hover:bg-gray-100 cursor-pointer shadow-xs",
    style: {
      background: '#ffffff',
      borderColor: 'rgba(0,0,0,0.15)',
      color: '#111111'
    },
    "aria-label": "Open Navigation Menu"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
  })), orderHistory.length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mt-3 relative search-wrapper-mobile",
    ref: searchBoxRef
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative"
  }, /*#__PURE__*/React.createElement(Search, {
    className: "absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700"
  }), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: searchTerm,
    onChange: e => {
      setSearchTerm(e.target.value);
      setSuggestOpen(true);
    },
    onKeyDown: handleSearchKeyDown,
    placeholder: translate(langData, "searchPlaceholder"),
    className: "w-full border rounded-xl pl-10 pr-9 py-2.5 text-sm transition-all focus:outline-none",
    style: {
      background: '#ffffff',
      borderColor: 'rgba(0,0,0,0.12)',
      color: '#1a1a2e',
      caretColor: '#000000'
    },
    onFocus: e => {
      setSuggestOpen(true);
      e.target.style.borderColor = 'rgba(0,0,0,0.12)';
      e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.12)';
    },
    onBlur: e => {
      e.target.style.borderColor = 'rgba(0,0,0,0.12)';
      e.target.style.boxShadow = 'none';
    }
  }), searchTerm && /*#__PURE__*/React.createElement("button", {
    onClick: () => setSearchTerm(""),
    className: "absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black transition-colors"
  }, /*#__PURE__*/React.createElement(X, {
    className: "w-4 h-4"
  }))), suggestOpen && searchTerm && /*#__PURE__*/React.createElement("div", {
    className: "absolute mt-2 w-full backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-40 border",
    style: {
      background: '#ffffff',
      borderColor: 'rgba(0,0,0,0.12)'
    }
  }, suggestions.length > 0 ? suggestions.map(s => /*#__PURE__*/React.createElement("button", {
    key: s.id,
    onClick: () => handleSuggestionClick(s),
    className: "w-full flex items-center justify-between text-left px-4 py-2.5 text-sm border-b transition-colors",
    style: {
      borderColor: '#e5e7eb',
      color: '#111111'
    },
    onMouseEnter: e => e.currentTarget.style.background = '#f3f4f6',
    onMouseLeave: e => e.currentTarget.style.background = 'transparent'
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#111111',
      fontWeight: 600
    }
  }, getProductDisplayName(s, language)), /*#__PURE__*/React.createElement("span", {
    className: "font-bold whitespace-nowrap ml-3",
    style: {
      color: '#000000'
    }
  }, translate(langData, 'priceLabel', {
    amount: s.price.toLocaleString()
  })))) : /*#__PURE__*/React.createElement("p", {
    className: "px-4 py-3 text-sm",
    style: {
      color: '#777777'
    }
  }, translate(langData, "noMatch")))))), /*#__PURE__*/React.createElement("main", {
    className: "max-w-6xl mx-auto px-4 py-6 main-content-area"
  }, showCategoryHome ? /*#__PURE__*/React.createElement(CategoryHome, {
    products: products,
    onSelectCategory: setSelectedCategory,
    langData: langData,
    language: language
  }) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10
    }
  }, (selectedCategory || isSearching || activeCategory !== "all") && /*#__PURE__*/React.createElement("button", {
    onClick: handleGoBack,
    className: "flex items-center gap-1.5 border px-3 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-sm cursor-pointer shrink-0",
    style: {
      background: 'linear-gradient(135deg, rgba(0,0,0,0.12), rgba(255,255,255,0.95))',
      borderColor: 'rgba(0,0,0,0.12)',
      color: '#111111'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-3.5 h-3.5 text-black",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
  })), /*#__PURE__*/React.createElement("span", null, translate(langData, "backBtn") || "BACK")), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'right',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginLeft: 'auto'
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 14,
      fontWeight: 900,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: '#111111',
      fontFamily: "'Poppins', sans-serif"
    }
  }, isSearching ? `Search: "${searchTerm}"` : selectedCategoryName), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      color: '#111111',
      background: 'rgba(0,0,0,0.12)',
      border: '1px solid rgba(0,0,0,0.12)',
      borderRadius: 12,
      padding: '1px 8px',
      whiteSpace: 'nowrap'
    }
  }, filtered.length, " ", translate(langData, "itemsLabel")))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-1.5 bg-white border border-gray-900 rounded-full px-3 py-1.5 shadow-sm"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-3.5 h-3.5 text-gray-900 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-6L16.5 21m0 0L12 16.5m4.5 4.5V7.5"
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] font-black uppercase text-gray-900 hidden sm:inline tracking-wider"
  }, tr(language, 'Sort:', 'Sort:', 'ترتیب:')), /*#__PURE__*/React.createElement("select", {
    value: sortBy,
    onChange: e => setSortBy(e.target.value),
    className: "bg-transparent text-xs font-bold text-gray-900 cursor-pointer outline-none border-none py-0.5 pr-1"
  }, /*#__PURE__*/React.createElement("option", {
    value: "default"
  }, tr(language, 'Default Order', 'Default Order', 'عام ترتیب (Default)')), /*#__PURE__*/React.createElement("option", {
    value: "price_asc"
  }, tr(language, 'Price: Low to High', 'Price: Low to High', 'قیمت: کم سے زیادہ (Low to High)')), /*#__PURE__*/React.createElement("option", {
    value: "price_desc"
  }, tr(language, 'Price: High to Low', 'Price: High to Low', 'قیمت: زیادہ سے کم (High to Low)')), /*#__PURE__*/React.createElement("option", {
    value: "popularity"
  }, tr(language, 'Popularity / Featured', 'Popularity / Featured', 'مقبول ترین (Popularity)')), /*#__PURE__*/React.createElement("option", {
    value: "name_asc"
  }, tr(language, 'Name: A to Z', 'Name: A to Z', 'نام: A سے Z (Name: A-Z)')))), brandFilters.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setFilterMenuOpen(v => !v),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 7,
      border: selectedBrand !== "all" ? '1.5px solid #000000' : '1px solid #111111',
      background: selectedBrand !== "all" ? '#000000' : '#ffffff',
      color: selectedBrand !== "all" ? '#ffffff' : '#111111',
      borderRadius: 999,
      padding: '8px 14px',
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      boxShadow: '0 5px 16px rgba(0,0,0,0.08)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      width: 14,
      height: 14
    },
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M3 5h18M6 12h10M10 19h4"
  })), /*#__PURE__*/React.createElement("span", null, "Filter"), selectedBrand !== "all" && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      background: '#ffffff',
      color: '#000000',
      borderRadius: 999,
      padding: '1px 8px',
      fontWeight: 800,
      letterSpacing: 0,
      textTransform: 'none'
    }
  }, selectedBrand)), selectedBrand !== "all" && /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setSelectedBrand("all");
      setFilterMenuOpen(false);
    },
    title: "Clear Brand Filter",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      background: '#fee2e2',
      border: '1px solid #fecaca',
      color: '#991b1b',
      borderRadius: 999,
      padding: '7px 11px',
      fontSize: 11,
      fontWeight: 800,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("span", null, "✕"), /*#__PURE__*/React.createElement("span", null, "Reset")), filterMenuOpen && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: () => setFilterMenuOpen(false),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 49,
      background: 'rgba(0,0,0,0.3)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      right: 12,
      left: 12,
      bottom: 'auto',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 50,
      maxWidth: 380,
      margin: '0 auto',
      background: '#ffffff',
      border: '1px solid #d1d5db',
      borderRadius: 20,
      padding: 16,
      boxShadow: '0 24px 60px rgba(0,0,0,0.3)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 10,
      marginBottom: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#111111',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      fontFamily: "'Poppins', sans-serif"
    }
  }, "Brand Filter"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      color: '#666666',
      whiteSpace: 'nowrap'
    }
  }, selectedBrand === "all" ? baseFiltered.length : filtered.length, " items")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap',
      maxHeight: 260,
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setSelectedBrand("all");
      setFilterMenuOpen(false);
    },
    style: {
      border: selectedBrand === "all" ? '1px solid #111111' : '1px solid #d1d5db',
      background: selectedBrand === "all" ? '#111111' : '#f9fafb',
      color: selectedBrand === "all" ? '#ffffff' : '#111111',
      borderRadius: 999,
      padding: '8px 12px',
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: '0.04em',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      boxShadow: selectedBrand === "all" ? '0 8px 18px rgba(0,0,0,0.18)' : 'none'
    }
  }, "All Brands ", /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.72
    }
  }, "(", baseFiltered.length, ")")), brandFilters.map(brand => /*#__PURE__*/React.createElement("button", {
    key: brand.name,
    onClick: () => {
      setSelectedBrand(brand.name);
      setFilterMenuOpen(false);
    },
    style: {
      border: selectedBrand === brand.name ? '1px solid #111111' : '1px solid #d1d5db',
      background: selectedBrand === brand.name ? '#111111' : '#ffffff',
      color: selectedBrand === brand.name ? '#ffffff' : '#111111',
      borderRadius: 999,
      padding: '8px 12px',
      fontSize: 12,
      fontWeight: 850,
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      boxShadow: selectedBrand === brand.name ? '0 8px 18px rgba(0,0,0,0.18)' : '0 2px 8px rgba(0,0,0,0.04)'
    }
  }, brand.name, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: 0.72
    }
  }, "(", brand.count, ")")))))))), filtered.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "text-center py-16 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm"
  }, /*#__PURE__*/React.createElement(ShoppingBag, {
    className: "w-12 h-12 mx-auto mb-3 text-gray-700"
  }), /*#__PURE__*/React.createElement("p", {
    className: "text-base font-bold text-black mb-2"
  }, "No items found matching \"", searchTerm, "\""), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-700 mb-6"
  }, "Try searching with a different item name or go back to main categories."), /*#__PURE__*/React.createElement("button", {
    onClick: handleGoBack,
    className: "inline-flex items-center gap-2 border px-6 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer",
    style: {
      background: 'linear-gradient(135deg, #000000, #f59e0b)',
      color: '#ffffff'
    }
  }, "← Back to Main Categories")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "product-grid"
  }, sortedProducts.slice(0, visibleCount).map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    product: p,
    langData: langData,
    language: language,
    cartQty: cart.filter(i => i.product.id === p.id).reduce((s, i) => s + i.qty, 0),
    onAddToCart: addToCart,
    onFlyToCart: flyProductToCart,
    onSelectProduct: selectProductWithHash
  }))), visibleCount < sortedProducts.length && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 32,
      marginBottom: 20,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setVisibleCount(prev => prev + 24),
    className: "inline-flex items-center gap-3 border px-8 py-3.5 rounded-2xl text-sm font-black tracking-wider uppercase transition-all shadow-xl cursor-pointer",
    style: {
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      color: '#ffffff',
      border: '1px solid #333333',
      boxShadow: '0 10px 25px rgba(0,0,0,0.25)'
    },
    onMouseEnter: e => e.currentTarget.style.transform = 'scale(1.04)',
    onMouseLeave: e => e.currentTarget.style.transform = 'scale(1)'
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5 text-amber-400",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
  })), /*#__PURE__*/React.createElement("span", null, tr(language, `Load More Items (${Math.min(visibleCount, sortedProducts.length)} of ${sortedProducts.length})`, `Mazeed Items Dekhein (${Math.min(visibleCount, sortedProducts.length)} / ${sortedProducts.length})`, `مزید اشیاء دیکھیں (${Math.min(visibleCount, sortedProducts.length)} / ${sortedProducts.length})`))))))), /*#__PURE__*/React.createElement("footer", {
    className: "border-t mt-10 py-8 text-center",
    style: {
      borderColor: 'rgba(0,0,0,0.12)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 inline-flex items-center gap-2 text-xs font-bold text-gray-800 border border-gray-200 rounded-full px-4 py-1.5 bg-gray-50 shadow-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-amber-600"
  }, "⏰"), /*#__PURE__*/React.createElement("span", null, tr(language, 'Delivery Timing: 10:00 AM – 8:00 PM (Mon – Sat)', 'Delivery Timing: Subah 10:00 AM se Raat 8:00 PM tak (Peer ta Hafta)', 'ڈیلیوری ٹائمنگ: صبح 10:00 بجے سے رات 8:00 بجے تک (پیر تا ہفتہ)'))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setAboutOpen(true),
    className: "mb-3 inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-black border border-gray-300 rounded-full px-4 py-1.5 transition-colors cursor-pointer bg-white"
  }, /*#__PURE__*/React.createElement("span", null, "🏬"), /*#__PURE__*/React.createElement("span", null, tr(language, 'About Sahil Traders', 'Hamare Baare Mein (About Sahil Traders)', 'ہمارے بارے میں (About Sahil Traders)')))), /*#__PURE__*/React.createElement("p", {
    className: "text-xs tracking-[0.3em] uppercase",
    style: {
      color: 'rgba(0,0,0,0.12)'
    }
  }, translate(langData, "footer"))), cartNotice && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-x-0 top-1/2 z-[95] flex justify-center px-4 pointer-events-none",
    style: {
      transform: 'translateY(-50%)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#ffffff',
      border: '1px solid rgba(22,163,74,0.28)',
      borderRadius: 18,
      padding: '13px 18px',
      boxShadow: '0 18px 45px rgba(0,0,0,0.18)',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      minWidth: 220
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 999,
      background: '#16a34a',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      width: 20,
      height: 20
    },
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M4.5 12.75l6 6 9-13.5"
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      fontWeight: 900,
      color: '#111111',
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      fontFamily: "'Poppins',sans-serif"
    }
  }, translate(langData, "added")))), /*#__PURE__*/React.createElement(ProductDetailModal, {
    product: selectedProduct,
    open: !!selectedProduct,
    onClose: () => setSelectedProduct(null),
    onAddToCart: addToCart,
    products: products,
    langData: langData,
    language: language,
    onSelectProduct: selectProductWithHash
  }), /*#__PURE__*/React.createElement(VariantSelectionModal, {
    product: variantModalProduct,
    open: !!variantModalProduct,
    onClose: () => setVariantModalProduct(null),
    language: language,
    langData: langData,
    onConfirm: (product, shade, qty) => {
      setVariantModalProduct(null);
      addToCart(product, shade, qty);
    }
  }), /*#__PURE__*/React.createElement(ReturnPolicyModal, {
    isOpen: returnPolicyOpen,
    onClose: () => setReturnPolicyOpen(false),
    language: language
  }), /*#__PURE__*/React.createElement(AboutUsModal, {
    isOpen: aboutOpen,
    onClose: () => setAboutOpen(false),
    language: language
  }), !showSplash && /*#__PURE__*/React.createElement(WelcomeDisclaimerModal, {
    isOpen: welcomeOpen,
    onClose: () => {
      setWelcomeOpen(false);
      try {
        sessionStorage.setItem("sahil_traders_welcome_seen", "1");
      } catch (e) {}
    },
    onOpenAbout: () => setAboutOpen(true),
    language: language
  }), /*#__PURE__*/React.createElement(CartDrawer, {
    open: cartOpen,
    cart: cart,
    cartTotal: cartTotal,
    langData: langData,
    language: language,
    onClose: () => setCartOpen(false),
    onUpdateQty: updateQty,
    onRemove: removeFromCart,
    onCheckout: () => {
      setCartOpen(false);
      setCheckoutOpen(true);
    },
    onSelectProduct: handleSelectProductFromCart
  }), /*#__PURE__*/React.createElement(OrderHistoryModal, {
    open: orderHistoryOpen,
    orders: orderHistory,
    langData: langData,
    language: language,
    onClose: () => setOrderHistoryOpen(false),
    onClear: clearOrderHistory
  }), checkoutOpen && /*#__PURE__*/React.createElement(CheckoutModal, {
    cart: cart,
    cartTotal: cartTotal,
    langData: langData,
    language: language,
    saveOrderHistory: saveOrderHistory,
    clearCart: clearCart,
    onClose: () => setCheckoutOpen(false),
    onBack: () => {
      setCheckoutOpen(false);
      setCartOpen(true);
    }
  }), mobileMenuOpen && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex justify-end sm:hidden animate-fade-in",
    style: {
      background: 'rgba(0,0,0,0.6)',
      backdropFilter: 'blur(4px)',
      WebkitBackdropFilter: 'blur(4px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0",
    onClick: () => setMobileMenuOpen(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "relative w-[85%] max-w-[320px] h-full bg-white shadow-2xl flex flex-col justify-between p-5 overflow-y-auto animate-scale-in",
    style: {
      zIndex: 60,
      borderLeft: '1px solid rgba(0,0,0,0.1)'
    },
    onClick: e => e.stopPropagation()
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between pb-4 border-b border-gray-100 mb-5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("img", {
    src: "images/sahil-traders-logo.png",
    alt: "Sahil Traders",
    className: "w-9 h-9 object-contain"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-sm font-black tracking-wider uppercase text-black"
  }, "Sahil Traders"), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-500"
  }, tr(language, 'Main Menu', 'Main Menu', '\u0645\u06cc\u06ba \u0645\u06cc\u0646\u0648')))), /*#__PURE__*/React.createElement("button", {
    onClick: () => setMobileMenuOpen(false),
    className: "w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-700 hover:bg-gray-200 transition-all cursor-pointer",
    "aria-label": "Close menu"
  }, /*#__PURE__*/React.createElement(X, {
    className: "w-4 h-4"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "mb-5 p-3.5 bg-gray-50 rounded-2xl border border-gray-100"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-xs font-bold text-gray-800 mb-2.5 flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("span", null, tr(language, 'Switch Language', 'Zaban Tabdeel Karein', '\u0632\u0628\u0627\u0646 \u062a\u0628\u062f\u06cc\u0644 \u06a9\u0631\u06cc\u06ba')), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-gray-500 font-normal"
  }, tr(language, 'English Active', 'Roman Urdu Active', '\u0627\u0631\u062f\u0648 \u0641\u0639\u0627\u0644 \u06c1\u06d2'))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-3 gap-1.5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setLanguage("en");
    },
    className: `py-2 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${language === 'en' ? 'bg-black text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'}`
  }, /*#__PURE__*/React.createElement("span", null, "English")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setLanguage("ro");
    },
    className: `py-2 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${language === 'ro' ? 'bg-black text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'}`
  }, /*#__PURE__*/React.createElement("span", null, "Roman")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setLanguage("ur");
    },
    className: `py-2 px-2 rounded-xl text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${language === 'ur' ? 'bg-black text-white shadow-sm' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-100'}`
  }, /*#__PURE__*/React.createElement("span", null, '\u0627\u0631\u062f\u0648')))), /*#__PURE__*/React.createElement("div", {
    className: "space-y-2.5"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setMobileMenuOpen(false);
      setOrderHistoryOpen(true);
    },
    className: "w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 transition-all text-left cursor-pointer shadow-2xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-lg"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5 text-amber-700",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-gray-900"
  }, tr(language, 'Order History', 'Order History', '\u0622\u0631\u0688\u0631 \u06c1\u0633\u0679\u0631\u06cc')), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-500"
  }, tr(language, 'View past orders & receipts', 'Pichle orders aur receipt dekhein', '\u067e\u0686\u06be\u0644\u06d2 \u0622\u0631\u0688\u0631\u0632 \u0627\u0648\u0631 \u0631\u0633\u06cc\u062f\u06cc\u06ba')))), orderHistory.length > 0 ? /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-600 text-white"
  }, orderHistory.length) : /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400 text-xs"
  }, "›")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setMobileMenuOpen(false);
      setReturnPolicyOpen(true);
    },
    className: "w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 transition-all text-left cursor-pointer shadow-2xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-lg"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5 text-emerald-700",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-gray-900"
  }, tr(language, 'Return & Exchange Policy', 'Wapsi aur Tabdeeli ki Policy', '\u0648\u0627\u067e\u0633\u06cc \u0627\u0648\u0631 \u062a\u0628\u062f\u06cc\u0644\u06cc \u06a9\u06cc \u067e\u0627\u0644\u06cc\u0633\u06cc')), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-500"
  }, tr(language, '100% replacement or money refund', '100% tabdeeli ya paise wapas', '\u062e\u0631\u0627\u0628 \u0686\u06cc\u0632 \u06a9\u06cc 100% \u062a\u0628\u062f\u06cc\u0644\u06cc \u06cc\u0627 \u0631\u06cc \u0641\u0646\u0688')))), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400 text-xs"
  }, "›")), /*#__PURE__*/React.createElement("a", {
    href: "tel:03368945775",
    className: "w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 transition-all text-left cursor-pointer shadow-2xs text-decoration-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5 text-blue-600",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106a1.15 1.15 0 00-1.01.258l-1.589 1.589a13.385 13.385 0 01-6.697-6.697l1.589-1.589a1.15 1.15 0 00.258-1.01L7.544 3.102A1.125 1.125 0 006.453 2.25H5.08A2.25 2.25 0 002.25 4.5v2.25z"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-gray-900"
  }, tr(language, 'Direct Phone Call (0336-8945775)', 'Direct Call Karein (0336-8945775)', '\u0628\u0631\u0627\u06c1\u0650 \u0631\u0627\u0633\u062a \u0641\u0648\u0646 \u06a9\u0627\u0644 (0336-8945775)')), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-500"
  }, tr(language, 'Tap to call us directly', 'Fori call kar ke maloomat ya order dein', '\u0641\u0648\u0631\u06cc \u06a9\u0627\u0644 \u06a9\u0631 \u06a9\u06d2 \u0645\u0639\u0644\u0648\u0645\u0627\u0622 \u06cc\u0627 \u0622\u0631\u0688\u0631 \u062f\u06cc\u06ba')))), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400 text-xs"
  }, "›")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setMobileMenuOpen(false);
      setAboutOpen(true);
    },
    className: "w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 transition-all text-left cursor-pointer shadow-2xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-lg"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5 text-blue-700",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H21m-4.5 0H12m-9 0h4.5m0 0V9a2.25 2.25 0 012.25-2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44.505.75.958.75h3.423a.75.75 0 00.75-.75V6.75A2.25 2.25 0 0017.25 4.5h-10.5A2.25 2.25 0 004.5 6.75V21"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-gray-900"
  }, tr(language, 'About Us', 'Hamare Baare Mein', '\u06c1\u0645\u0627\u0631\u06d2 \u0628\u0627\u0631\u06d2 \u0645\u06cc\u06ba')), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-500"
  }, tr(language, 'Shop info, timings & owners', 'Dukan ki maloomat aur timings', '\u062f\u06a9\u0627\u0646 \u06a9\u06cc \u0645\u0639\u0644\u0648\u0645\u0627\u062a \u0627\u0648\u0631 \u0627\u0648\u0642\u0627\u062a')))), /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400 text-xs"
  }, "›")), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setMobileMenuOpen(false);
      setCartOpen(true);
    },
    className: "w-full flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 transition-all text-left cursor-pointer shadow-2xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-lg"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5 text-purple-700",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("p", {
    className: "text-xs font-bold text-gray-900"
  }, tr(language, 'Shopping Cart', 'Shopping Cart', '\u0634\u0627\u067e\u0646\u06af \u06a9\u0627\u0631\u0679')), /*#__PURE__*/React.createElement("p", {
    className: "text-[11px] text-gray-500"
  }, cartCount > 0 ? tr(language, `${cartCount} items in cart`, `Cart mein ${cartCount} cheezein hain`, `${cartCount} \u0627\u0634\u06cc\u0627\u0621 \u0645\u0648\u062c\u0648\u062f \u06c1\u06cc\u06ba`) : tr(language, 'Cart is empty', 'Cart khali hai', '\u06a9\u0627\u0631\u0679 \u062e\u0627\u0644\u06cc \u06c1\u06d2')))), cartCount > 0 ? /*#__PURE__*/React.createElement("span", {
    className: "px-2 py-0.5 rounded-full text-[10px] font-black bg-black text-white"
  }, cartCount) : /*#__PURE__*/React.createElement("span", {
    className: "text-gray-400 text-xs"
  }, "›")))), /*#__PURE__*/React.createElement("div", {
    className: "pt-4 border-t border-gray-100 mt-4 space-y-3"
  }, /*#__PURE__*/React.createElement("a", {
    href: "https://wa.me/923368945775",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-95 cursor-pointer",
    style: {
      background: '#25D366'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-4 h-4 text-white fill-current",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
  })), /*#__PURE__*/React.createElement("span", null, tr(language, 'WhatsApp (+92 336 8945775)', 'WhatsApp (+92 336 8945775)', '\u0648\u0627\u067c\u0633 \u0627\u06cc\u067e \u067e\u0631 \u0631\u0627\u0628\u0637\u06c1 \u06a9\u0631\u06cc\u06ba'))), /*#__PURE__*/React.createElement("div", {
    className: "text-center text-[10px] text-gray-500 space-y-0.5"
  }, /*#__PURE__*/React.createElement("p", {
    className: "font-semibold text-gray-700"
  }, tr(language, 'Delivery Timing: 10:00 AM – 8:00 PM (Mon – Sat)', 'Delivery Timing: 10:00 AM – 8:00 PM (Peer ta Hafta)', '\u0688\u0644\u06cc\u0648\u0631\u06cc \u06a9\u06d2 \u0627\u0648\u0642\u0627\u062a: \u0635\u0628\u062d 10:00 \u0628\u062c\u06d2 \u062a\u0627 \u0631\u0627\u062a 8:00 \u0628\u062c\u06d2 (\u067e\u06cc\u0631 \u062a\u0627 \u06c1\u0641\u062a\u06c1)')), /*#__PURE__*/React.createElement("p", null, tr(language, 'Sahil Saleem & Muhammad Zubair Moin', 'Sahil Saleem & Muhammad Zubair Moin', '\u0633\u0627\u062d\u0644 \u0633\u0644\u06cc\u0645 \u0627\u0648\u0631 \u0645\u062d\u0645\u062f \u0632\u0628\u06cc\u0631 \u0645\u0639\u06cc\u0646')))))), exitModalOpen && /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white border border-gray-200 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-14 h-14 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center mx-auto"
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-7 h-7 text-black",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-extrabold text-black uppercase tracking-wider"
  }, tr(language, 'Exit Sahil Traders?', 'Sahil Traders se Bahar Jana Chahte Hain?', 'ویب سائٹ سے باہر جانا چاہتے ہیں؟')), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-700 mt-1.5 leading-relaxed"
  }, tr(language, 'Are you sure you want to leave the store?', 'Kya aap Sahil Traders band karna chahte hain?', 'کیا آپ واقعی Sahil Traders بند کرنا چاہتے ہیں؟'))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setExitModalOpen(false);
      setTimeout(() => restoreBackGuardRef.current(), 50);
    },
    className: "flex-1 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-black text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-all cursor-pointer"
  }, tr(language, 'No, Stay', 'Nahi, Wapis Rahein', 'نہیں، واپس رہیں')), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.sahilExitStore) window.sahilExitStore();
    },
    className: "flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-extrabold uppercase tracking-wider hover:brightness-110 transition-all shadow-md cursor-pointer"
  }, tr(language, 'Yes, Exit', 'Haan, Bahar Jaein', 'ہاں، باہر جائیں'))))));
}
// -----------------------------------------------------------------------------
// To add a category image: set the `image` field to a URL or relative file path.
// -----------------------------------------------------------------------------
const CATEGORY_META = {
  soaps: {
    image: '',
    gradient: 'linear-gradient(135deg,#667eea,#764ba2)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "6",
      width: "18",
      height: "12",
      rx: "3"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "7",
      cy: "12",
      r: "1"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "10.5",
      cy: "9.5",
      r: "1.5"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "14.5",
      cy: "14",
      r: "1"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "17",
      cy: "11",
      r: "2"
    }))
  },
  shampoo: {
    image: '',
    gradient: 'linear-gradient(135deg,#f093fb,#f5576c)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 21a2 2 0 002 2h6a2 2 0 002-2V10a2 2 0 00-2-2H9a2 2 0 00-2 2v11z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 2v6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 5h6"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 13h4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 17h4"
    }))
  },
  perfumes: {
    image: '',
    gradient: 'linear-gradient(135deg,#f7971e,#ffd200)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "5",
      y: "10",
      width: "14",
      height: "11",
      rx: "2"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "10",
      y: "7",
      width: "4",
      height: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 3v4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M9 3h6"
    }))
  },
  bodyspray: {
    image: '',
    gradient: 'linear-gradient(135deg,#30cfd0,#330867)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "8",
      y: "4",
      width: "8",
      height: "16",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 2h4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 8v4"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "15",
      r: "1"
    }))
  },
  creams: {
    image: '',
    gradient: 'linear-gradient(135deg,#fa709a,#fee140)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 9h14v9a3 3 0 01-3 3H8a3 3 0 01-3-3V9z"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "5",
      width: "16",
      height: "4",
      rx: "1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 14c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 4 2"
    }))
  },
  bleachfacial: {
    image: '',
    gradient: 'linear-gradient(135deg,#e0c3fc,#8ec5fc)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 14s1.5 2 4 2 4-2 4-2"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "9",
      y1: "9",
      x2: "9.01",
      y2: "9"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "15",
      y1: "9",
      x2: "15.01",
      y2: "9"
    }))
  },
  stationary: {
    image: '',
    gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 20h9"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
    }))
  },
  sports: {
    image: '',
    gradient: 'linear-gradient(135deg,#f6d365,#fda085)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "10"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M2 12h20"
    }))
  },
  toys: {
    image: '',
    gradient: 'linear-gradient(135deg,#fd79a8,#e84393)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"
    }))
  },
  tapes: {
    image: '',
    gradient: 'linear-gradient(135deg,#a1c4fd,#c2e9fb)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "9"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "4"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "12",
      y1: "3",
      x2: "12",
      y2: "8"
    }))
  },
  shaving: {
    image: '',
    gradient: 'linear-gradient(135deg,#373b44,#4286f4)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 8v13"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "6",
      y: "3",
      width: "12",
      height: "5",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "8",
      y1: "5",
      x2: "16",
      y2: "5"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "11",
      y1: "12",
      x2: "13",
      y2: "12"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "11",
      y1: "15",
      x2: "13",
      y2: "15"
    }), /*#__PURE__*/React.createElement("line", {
      x1: "11",
      y1: "18",
      x2: "13",
      y2: "18"
    }))
  },
  haircolour: {
    image: '',
    gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3c-1.5 3-5 5-5 9a5 5 0 0010 0c0-4-3.5-6-5-9z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 17v4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 21h4"
    }))
  },
  haircare: {
    image: '',
    gradient: 'linear-gradient(135deg,#c471ed,#12c2e9)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 3c-1.5 3-5 5-5 9a5 5 0 0010 0c0-4-3.5-6-5-9z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 10c1 2 5 2 6 0"
    }))
  },
  condemn: {
    image: '',
    gradient: 'linear-gradient(135deg,#e96c6c,#c0392b)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M12 2C8 2 5 5 5 9v6l7 7 7-7V9c0-4-3-7-7-7z"
    }))
  },
  lock: {
    image: '',
    gradient: 'linear-gradient(135deg,#636e72,#2d3436)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "5",
      y: "11",
      width: "14",
      height: "11",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M7 11V7a5 5 0 0110 0v4"
    }))
  },
  general: {
    image: '',
    gradient: 'linear-gradient(135deg,#000000,#9b7a00)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "3",
      width: "8",
      height: "8",
      rx: "1"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "13",
      y: "3",
      width: "8",
      height: "8",
      rx: "1"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "3",
      y: "13",
      width: "8",
      height: "8",
      rx: "1"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "13",
      y: "13",
      width: "8",
      height: "8",
      rx: "1"
    }))
  },
  bodylotion: {
    image: '',
    gradient: 'linear-gradient(135deg,#fa709a,#fee140)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M5 9h14v9a3 3 0 01-3 3H8a3 3 0 01-3-3V9z"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "5",
      width: "16",
      height: "4",
      rx: "1"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 14c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 4 2"
    }))
  },
  babycare: {
    image: '',
    gradient: 'linear-gradient(135deg,#ffecd2,#fcb69f)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "8",
      r: "4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6 20v-2a6 6 0 0112 0v2"
    }))
  },
  blades: {
    image: '',
    gradient: 'linear-gradient(135deg,#b8c6db,#f5f7fa)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 3L6 21"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M6 3l12 18"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "4",
      y: "9",
      width: "16",
      height: "6",
      rx: "1"
    }))
  },
  cells: {
    image: '',
    gradient: 'linear-gradient(135deg,#56ab2f,#a8e063)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "7",
      y: "4",
      width: "10",
      height: "16",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 2h4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 9v4"
    }))
  },
  mosquito: {
    image: '',
    gradient: 'linear-gradient(135deg,#11998e,#38ef7d)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "12",
      r: "3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 2v4M12 18v4M2 12h4M18 12h4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3"
    }))
  },
  personalcare: {
    image: '',
    gradient: 'linear-gradient(135deg,#ee9ca7,#ffdde1)',
    icon: /*#__PURE__*/React.createElement("svg", {
      style: {
        width: 40,
        height: 40,
        color: 'white'
      },
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.8",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
    }))
  }
};
// ————— CATEGORY HOME ————————————————————————————————————————————————————————————————————————————
function CategoryHome({
  products,
  onSelectCategory,
  langData,
  language
}) {
  const isUrdu = language === 'ur';
  const categoriesList = getGlobalCategories();
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid rgba(0,0,0,0.12)',
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 14,
      fontWeight: 900,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      color: '#000000',
      fontFamily: "'Poppins', sans-serif"
    }
  }, translate(langData, "categoriesLabel")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      color: '#333333',
      background: 'rgba(0,0,0,0.12)',
      border: '1px solid rgba(0,0,0,0.12)',
      borderRadius: 12,
      padding: '2px 8px',
      whiteSpace: 'nowrap'
    }
  }, categoriesList.length, " Categories · ", products.length.toLocaleString(), "+ Items")), /*#__PURE__*/React.createElement("div", {
    className: "cat-home-grid"
  }, categoriesList.map(cat => {
    const catProducts = products.filter(p => p.categoryId === cat.id);
    const count = catProducts.length;
    const meta = CATEGORY_META[cat.id] || {
      gradient: 'linear-gradient(135deg,#000000,#9b7a00)',
      icon: null
    };
    // Find all items in this category that have images
    const imageProducts = catProducts.filter(p => window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[p.id] || p.hasImage);
    // Prepare item list for infinite marquee loop (repeat if < 6)
    let marqueeItems = imageProducts;
    if (marqueeItems.length > 0 && marqueeItems.length < 6) {
      while (marqueeItems.length < 6) {
        marqueeItems = marqueeItems.concat(imageProducts);
      }
    }
    // Standardize max items per track for equal visual balance
    if (marqueeItems.length > 10) {
      marqueeItems = marqueeItems.slice(0, 10);
    }
    const doubleItems = [...marqueeItems, ...marqueeItems];
    // Dynamic uniform speed: 4.2 seconds per item so ALL categories revolve smoothly with perfect lively pace!
    const animSpeed = marqueeItems.length * 4.2 + 's';
    return /*#__PURE__*/React.createElement("div", {
      key: cat.id,
      onClick: () => {
        onSelectCategory(cat.id);
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'instant'
        });
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;
      },
      className: "cat-card-container group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300",
      style: {
        background: '#ffffff',
        border: '1px solid #e5e7eb',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      },
      onMouseEnter: e => {
        e.currentTarget.style.borderColor = '#000000';
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
      },
      onMouseLeave: e => {
        e.currentTarget.style.borderColor = '#e5e7eb';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "cat-img-reel-area",
      style: {
        height: 180,
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: '#ffffff'
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "cat-count-badge",
      style: {
        position: 'absolute',
        top: 10,
        right: 10,
        zIndex: 20,
        padding: '3px 10px',
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 800,
        letterSpacing: '0.06em',
        background: '#f3f4f6',
        border: '1px solid #e5e7eb',
        color: '#111111'
      }
    }, count, " ", translate(langData, "itemsLabel")), imageProducts.length > 0 ? /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        width: 28,
        zIndex: 10,
        pointerEvents: 'none',
        background: 'linear-gradient(to right, #ffffff, transparent)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        right: 0,
        width: 28,
        zIndex: 10,
        pointerEvents: 'none',
        background: 'linear-gradient(to left, #ffffff, transparent)'
      }
    }), /*#__PURE__*/React.createElement("div", {
      className: "cat-marquee-track",
      style: {
        animation: `catSlideTrack ${animSpeed} linear infinite`
      }
    }, doubleItems.map((item, idx) => {
      const ext = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[item.id];
      return /*#__PURE__*/React.createElement("div", {
        key: idx,
        className: "cat-img-box"
      }, ext && /*#__PURE__*/React.createElement("img", {
        src: getImgUrl(`images/${item.id}.${ext}`),
        alt: "",
        loading: "lazy",
        onError: e => {
          e.target.style.display = 'none';
        }
      }));
    }))) : /*#__PURE__*/React.createElement("div", {
      style: {
        opacity: 0.95,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 52,
        height: 52,
        borderRadius: 16,
        background: meta.gradient,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 8px 25px rgba(0,0,0,0.5)'
      }
    }, meta.icon || '🛍️'))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '12px 14px',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 6,
        borderTop: '1px solid #f3f4f6'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0,
        flex: 1
      }
    }, /*#__PURE__*/React.createElement("h3", {
      className: "cat-card-title",
      style: {
        fontSize: '13px',
        fontWeight: 900,
        fontFamily: "'Poppins', sans-serif",
        letterSpacing: '0.02em',
        color: '#111827',
        lineHeight: 1.25,
        marginBottom: 4
      }
    }, langData.categories?.[cat.id] || cat.name), /*#__PURE__*/React.createElement("div", {
      className: "cat-view-pill inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-900 group-hover:bg-amber-600 text-white transition-all duration-300 shadow-2xs"
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9.5,
        fontWeight: 800,
        letterSpacing: '0.04em',
        textTransform: 'uppercase'
      }
    }, tr(language, 'View Products', 'Cheezein Dekhein', 'چیزیں دیکھیں')), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 900
      },
      className: "transform group-hover:translate-x-1 transition-transform"
    }, "➔"))), /*#__PURE__*/React.createElement("div", {
      className: "w-8 h-8 rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300 shrink-0"
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-4 h-4 transform group-hover:translate-x-0.5 transition-transform",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2.5",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M8.25 4.5l7.5 7.5-7.5 7.5"
    })))));
  })));
}
function CategoryDropdown({
  activeCategory,
  setActiveCategory,
  setCatMenuOpen,
  fullWidth,
  langData,
  language
}) {
  const categoriesList = getGlobalCategories();
  return /*#__PURE__*/React.createElement("div", {
    className: `absolute mt-2 ${fullWidth ? "w-full" : "w-64 right-0"} backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-40 max-h-80 overflow-y-auto border`,
    style: {
      background: 'rgba(9,9,13,0.97)',
      borderColor: 'rgba(0,0,0,0.12)'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setActiveCategory("all");
      setCatMenuOpen(false);
    },
    className: "w-full text-left px-4 py-3 text-xs font-bold transition-colors flex items-center justify-between border-b",
    style: {
      borderColor: 'rgba(0,0,0,0.12)',
      color: activeCategory === "all" ? '#000000' : 'rgba(0,0,0,0.7)',
      background: activeCategory === "all" ? 'rgba(0,0,0,0.12)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("span", null, tr(language, 'All Categories', 'Tamam Categories', 'تمام کیٹیگریز')), activeCategory === "all" && /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#000000'
    }
  }, "✓")), CATEGORIES.map(cat => /*#__PURE__*/React.createElement("button", {
    key: cat.id,
    onClick: () => {
      setActiveCategory(cat.id);
      setCatMenuOpen(false);
    },
    className: "w-full text-left px-4 py-3 text-xs font-semibold transition-colors flex items-center justify-between border-b",
    style: {
      borderColor: 'rgba(0,0,0,0.12)',
      color: activeCategory === cat.id ? '#000000' : 'rgba(0,0,0,0.7)',
      background: activeCategory === cat.id ? 'rgba(0,0,0,0.12)' : 'transparent'
    }
  }, /*#__PURE__*/React.createElement("span", null, langData.categories?.[cat.id] || cat.name), activeCategory === cat.id && /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#000000'
    }
  }, "✓"))));
}
// -----------------------------------------------------------------------------
function ProductCard({
  product,
  onAddToCart,
  langData,
  language,
  onSelectProduct
}) {
  const [isAdded, setIsAdded] = useState(false);
  const isUrdu = language === 'ur';
  const pricing = useMemo(() => getProductPricing(product), [product]);
  const handleAdd = e => {
    e.stopPropagation();
    onAddToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 900);
  };
  const hasFile = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id];
  const imageSrc = hasFile ? getImgUrl(`images/${product.id}.${window.PRODUCT_IMAGE_MAP[product.id]}`) : null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => onSelectProduct && onSelectProduct(product),
    className: "product-card group bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-3 sm:p-4 flex flex-col justify-between transition-all duration-300 cursor-pointer shadow-xs hover:shadow-lg relative overflow-hidden"
  }, pricing.hasDiscount && /*#__PURE__*/React.createElement("span", {
    className: "absolute top-2 left-2 z-10 bg-gradient-to-r from-red-600 to-rose-600 text-white text-[9px] sm:text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm flex items-center gap-1 uppercase tracking-wider"
  }, /*#__PURE__*/React.createElement("span", null, "🔥"), /*#__PURE__*/React.createElement("span", null, pricing.discountPercent, "% OFF")), /*#__PURE__*/React.createElement("div", {
    className: "product-image-box h-32 sm:h-40 w-full bg-gray-50 rounded-xl p-2 mb-3 flex items-center justify-center relative overflow-hidden group-hover:bg-amber-50/30 transition-colors"
  }, hasFile ? /*#__PURE__*/React.createElement("img", {
    src: imageSrc,
    alt: product.name,
    loading: "lazy",
    decoding: "async",
    className: "w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
  }) : /*#__PURE__*/React.createElement("div", {
    className: `w-16 h-16 rounded-2xl bg-gradient-to-br ${product.gradient || 'from-gray-400 to-gray-600'} flex items-center justify-center text-white text-xl font-bold shadow-inner`
  }, product.initial || 'P')), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col flex-1"
  }, /*#__PURE__*/React.createElement("h4", {
    className: "product-name font-bold text-xs sm:text-sm text-gray-900 line-clamp-2 leading-snug mb-1 group-hover:text-black transition-colors"
  }, getProductDisplayName(product, language)), pricing.hasDiscount ? /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-0.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-1.5 flex-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "product-price-text font-black text-sm sm:text-base text-gray-950"
  }, translate(langData, 'priceLabel', {
    amount: pricing.sellingPrice.toLocaleString()
  })), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] sm:text-xs text-gray-400 line-through font-semibold"
  }, "Rs. ", pricing.retailPrice.toLocaleString())), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] sm:text-[11px] font-bold text-emerald-700 flex items-center gap-1 flex-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-emerald-50 text-emerald-800 px-1.5 py-0.5 rounded border border-emerald-200"
  }, tr(language, `Save Rs ${pricing.savings.toLocaleString()}`, `Bachat: Rs ${pricing.savings.toLocaleString()}`, `بچت: Rs ${pricing.savings.toLocaleString()}`)))) : /*#__PURE__*/React.createElement("p", {
    className: "product-price-text font-extrabold text-sm sm:text-base",
    style: {
      color: '#000000'
    }
  }, translate(langData, 'priceLabel', {
    amount: product.price.toLocaleString()
  })), /*#__PURE__*/React.createElement("button", {
    onClick: handleAdd,
    className: "product-add-btn mt-auto w-full py-2 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2",
    style: {
      background: isAdded ? '#16a34a' : '#111111',
      border: `1px solid ${isAdded ? '#15803d' : '#111111'}`,
      color: '#ffffff',
      boxShadow: isAdded ? '0 8px 18px rgba(22,163,74,0.24)' : '0 6px 14px rgba(0,0,0,0.16)',
      transform: 'translateY(0)'
    },
    onMouseEnter: e => {
      if (!isAdded) {
        e.currentTarget.style.background = '#1f2937';
        e.currentTarget.style.borderColor = '#1f2937';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }
    },
    onMouseLeave: e => {
      if (!isAdded) {
        e.currentTarget.style.background = '#111111';
        e.currentTarget.style.borderColor = '#111111';
        e.currentTarget.style.transform = 'translateY(0)';
      }
    }
  }, isAdded ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("svg", {
    className: "w-3.5 h-3.5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M4.5 12.75l6 6 9-13.5"
  })), translate(langData, "added")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("svg", {
    className: "w-3.5 h-3.5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 4.5v15m7.5-7.5h-15"
  })), translate(langData, "addToCart")))));
}
// -----------------------------------------------------------------------------
function CartDrawer({
  open,
  cart,
  cartTotal,
  langData,
  language,
  onClose,
  onUpdateQty,
  onRemove,
  onCheckout,
  onSelectProduct
}) {
  const [deleteConfirm, setDeleteConfirm] = React.useState(null);
  const isUrdu = language === 'ur';
  const totalSavings = useMemo(() => {
    return cart.reduce((sum, {
      product,
      qty
    }) => {
      const pricing = getProductPricing(product);
      const bulk = calculateBulkPricing(product.price, qty);
      const normalSavings = pricing.hasDiscount ? pricing.savings * qty : 0;
      return sum + normalSavings + bulk.extraSavings;
    }, 0);
  }, [cart]);
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  function handleMinusClick(productId, qty, variant = null) {
    if (qty === 1) {
      setDeleteConfirm({
        id: productId,
        variant
      });
    } else {
      onUpdateQty(productId, -1, variant);
    }
  }
  function confirmDelete() {
    if (deleteConfirm) {
      onRemove(deleteConfirm.id, deleteConfirm.variant);
      setDeleteConfirm(null);
    }
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      background: 'rgba(0,0,0,0.7)',
      backdropFilter: 'blur(4px)',
      opacity: open ? 1 : 0,
      pointerEvents: open ? 'auto' : 'none',
      transition: 'opacity 0.3s'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      top: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      maxWidth: '420px',
      zIndex: 51,
      background: '#ffffff',
      borderLeft: '1px solid rgba(0,0,0,0.12)',
      boxShadow: '-8px 0 60px rgba(0,0,0,0.8)',
      transform: open ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px',
      borderBottom: '1px solid rgba(0,0,0,0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      width: 22,
      height: 22,
      color: '#000000'
    },
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 800,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      color: '#000000',
      fontFamily: "'Poppins',sans-serif"
    }
  }, translate(langData, "cartTitle")), cart.length > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      background: 'rgba(0,0,0,0.12)',
      border: '1px solid rgba(0,0,0,0.12)',
      borderRadius: 20,
      padding: '1px 10px',
      fontSize: 11,
      fontWeight: 700,
      color: '#000000'
    }
  }, cart.reduce((s, i) => s + i.qty, 0), " ", translate(langData, "itemsLabel"))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: '#f3f4f6',
      border: '1px solid rgba(0,0,0,0.28)',
      borderRadius: 10,
      padding: '6px',
      color: '#111111',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      boxShadow: '0 1px 2px rgba(0,0,0,0.12)'
    },
    onMouseEnter: e => e.currentTarget.style.color = '#000000',
    onMouseLeave: e => e.currentTarget.style.color = '#111111'
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      width: 18,
      height: 18
    },
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M6 18L18 6M6 6l12 12"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px'
    }
  }, cart.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14,
      padding: '12px 14px',
      borderRadius: 14,
      background: cartTotal >= 2000 ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 'linear-gradient(135deg, #fffbe6 0%, #fef3c7 100%)',
      border: cartTotal >= 2000 ? '1px solid #bbf7d0' : '1px solid #fde68a'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 12,
      fontWeight: 800,
      color: cartTotal >= 2000 ? '#166534' : '#92400e'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, "🚚"), /*#__PURE__*/React.createElement("span", null, cartTotal >= 2000 ? tr(language, '🎉 Mubarak! Free Delivery Unlocked!', '🎉 Mubarak! Free Delivery Unlocked!', '🎉 مبارک! مفت ڈیلیوری فعال ہو گئی!') : tr(language, `Free Delivery on Rs 2,000+ (Rs ${(2000 - cartTotal).toLocaleString()} remaining)`, `Rs 2,000+ par Free Delivery (Rs ${(2000 - cartTotal).toLocaleString()} baqi)`, `Rs. 2,000 پر مفت ڈیلیوری (Rs ${(2000 - cartTotal).toLocaleString()} باقی)`))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      height: 6,
      width: '100%',
      background: 'rgba(0,0,0,0.08)',
      borderRadius: 10,
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      width: `${Math.min(100, cartTotal / 2000 * 100)}%`,
      background: cartTotal >= 2000 ? '#22c55e' : '#f59e0b',
      borderRadius: 10,
      transition: 'width 0.4s ease'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 10,
      fontWeight: 700,
      color: '#555',
      marginTop: 4
    }
  }, /*#__PURE__*/React.createElement("span", null, "🏠 ", tr(language, 'Home Delivery Available', 'Home Delivery Dastyab Hai', 'ہوم ڈیلیوری دستیاب')), /*#__PURE__*/React.createElement("span", null, "🏬 ", tr(language, 'BS Mart Pickup Free', 'BS Mart Pickup Muft', 'BS Mart پک اپ مفت')))), cart.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      paddingTop: 80,
      color: '#777777'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      width: 60,
      height: 60,
      margin: '0 auto 16px',
      color: 'rgba(0,0,0,0.12)'
    },
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      fontWeight: 600
    }
  }, translate(langData, "cartEmpty")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      marginTop: 6,
      color: '#888888'
    }
  }, translate(langData, "noProducts")), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      marginTop: 20,
      background: 'rgba(0,0,0,0.12)',
      border: '1px solid rgba(0,0,0,0.12)',
      borderRadius: 12,
      padding: '10px 24px',
      color: '#000000',
      fontSize: 13,
      fontWeight: 700,
      cursor: 'pointer',
      letterSpacing: '0.1em',
      textTransform: 'uppercase'
    }
  }, translate(langData, "continueShopping"))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, cart.map(({
    product,
    qty,
    variant
  }) => {
    const pricing = getProductPricing(product);
    const bulk = calculateBulkPricing(product.price, qty);
    return /*#__PURE__*/React.createElement("div", {
      key: `${product.id}-${variant || ''}`,
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '12px 14px',
        background: 'rgba(0,0,0,0.12)',
        border: '1px solid rgba(0,0,0,0.12)',
        borderRadius: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => onSelectProduct && onSelectProduct(product),
      style: {
        cursor: 'pointer'
      },
      className: "shrink-0 transition-transform active:scale-95 relative",
      title: "Click to view product details"
    }, pricing.hasDiscount && /*#__PURE__*/React.createElement("span", {
      className: "absolute -top-1.5 -left-1.5 z-10 bg-red-600 text-white text-[8px] font-black px-1.5 py-0.2 rounded-md shadow-2xs uppercase"
    }, pricing.discountPercent, "%"), window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id] ? /*#__PURE__*/React.createElement("img", {
      src: getImgUrl(`images/${product.id}.${window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id] || "png"}`),
      onError: e => {
        e.target.onerror = null;
      },
      alt: product.name,
      className: "w-12 h-12 rounded-xl object-contain bg-black/40 p-1 border border-gray-200 hover:border-gray-300 transition-colors"
    }) : /*#__PURE__*/React.createElement("div", {
      className: `w-12 h-12 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center`
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#1a1a2e',
        fontWeight: 800,
        fontSize: 16,
        fontFamily: "'Poppins',sans-serif"
      }
    }, product.initial))), /*#__PURE__*/React.createElement("div", {
      style: {
        flex: 1,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("p", {
      onClick: () => onSelectProduct && onSelectProduct(product),
      style: {
        cursor: 'pointer',
        fontSize: 13,
        fontWeight: 600,
        color: '#1a1a2e',
        lineHeight: 1.3,
        marginBottom: 2,
        overflow: 'hidden',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical'
      },
      className: "hover:text-black hover:underline transition-colors",
      title: "Click to view product details"
    }, getProductDisplayName(product, language)), variant && /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 1,
        marginBottom: 3
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10.5,
        fontWeight: 800,
        color: '#92400e',
        background: '#fef3c7',
        border: '1px solid #fde68a',
        borderRadius: 6,
        padding: '2px 7px',
        display: 'inline-block'
      }
    }, "🎨 Shade: ", variant)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: '#000000',
        fontWeight: 700
      }
    }, translate(langData, "priceLabel", {
      amount: product.price.toLocaleString()
    }), " × ", qty), pricing.hasDiscount && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        color: '#9ca3af',
        textDecoration: 'line-through',
        fontWeight: 600
      }
    }, "Rs. ", pricing.retailPrice.toLocaleString())), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap',
        marginTop: 4
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        display: 'inline-block',
        fontSize: 11,
        color: '#111111',
        background: '#ffffff',
        border: '1px solid rgba(0,0,0,0.18)',
        borderRadius: 8,
        padding: '2px 7px',
        fontWeight: 800,
        margin: 0
      }
    }, "= ", translate(langData, "priceLabel", {
      amount: bulk.finalTotal.toLocaleString()
    })), bulk.extraPercent > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9.5,
        color: '#166534',
        background: '#dcfce7',
        border: '1px solid #bbf7d0',
        borderRadius: 6,
        padding: '1px 5px',
        fontWeight: 800
      }
    }, "🎁 +", bulk.extraPercent, "% Bulk OFF (-Rs ", bulk.extraSavings.toLocaleString(), ")"), pricing.hasDiscount && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9.5,
        color: '#15803d',
        background: '#f0fdf4',
        border: '1px solid #bbf7d0',
        borderRadius: 6,
        padding: '1px 5px',
        fontWeight: 700
      }
    }, tr(language, `Save Rs ${(pricing.savings * qty).toLocaleString()}`, `Bachat: Rs ${(pricing.savings * qty).toLocaleString()}`, `بچت: Rs ${(pricing.savings * qty).toLocaleString()}`)))), /*#__PURE__*/React.createElement("div", {
      style: {
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 5,
        background: 'rgba(0,0,0,0.12)',
        borderRadius: 10,
        padding: '4px 6px',
        border: '1px solid rgba(0,0,0,0.12)'
      }
    }, qty === 1 ? /*#__PURE__*/React.createElement("button", {
      onClick: () => handleMinusClick(product.id, qty, variant),
      title: "Remove item",
      style: {
        width: 28,
        height: 28,
        border: 'none',
        background: 'rgba(239,68,68,0.12)',
        color: 'rgba(239,68,68,0.9)',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        transition: 'all 0.2s'
      },
      onMouseEnter: e => {
        e.currentTarget.style.background = 'rgba(239,68,68,0.25)';
        e.currentTarget.style.color = '#ef4444';
      },
      onMouseLeave: e => {
        e.currentTarget.style.background = 'rgba(239,68,68,0.12)';
        e.currentTarget.style.color = 'rgba(239,68,68,0.9)';
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "13",
      height: "13",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    }))) : /*#__PURE__*/React.createElement("button", {
      onClick: () => onUpdateQty(product.id, -1, variant),
      title: "Decrease quantity",
      style: {
        width: 28,
        height: 28,
        border: 'none',
        background: '#ffffff',
        color: '#111827',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        fontWeight: 900,
        fontSize: 15,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }
    }, "-"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 900,
        color: '#111827',
        width: 20,
        textAlign: 'center'
      }
    }, qty), /*#__PURE__*/React.createElement("button", {
      onClick: () => onUpdateQty(product.id, 1, variant),
      title: "Increase quantity",
      style: {
        width: 28,
        height: 28,
        border: 'none',
        background: '#ffffff',
        color: '#111827',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        fontWeight: 900,
        fontSize: 15,
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }
    }, "+"))));
  }))), deleteConfirm && /*#__PURE__*/React.createElement("div", {
    onClick: () => setDeleteConfirm(null),
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 200,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    style: {
      background: '#fff',
      borderRadius: 16,
      padding: '32px 24px 24px',
      maxWidth: 320,
      width: '100%',
      boxShadow: '0 24px 64px rgba(0,0,0,0.55)',
      textAlign: 'center',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDeleteConfirm(null),
    style: {
      position: 'absolute',
      top: 12,
      right: 14,
      background: 'none',
      border: 'none',
      fontSize: 18,
      color: '#aaa',
      cursor: 'pointer'
    }
  }, "✕"), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: '50%',
      background: 'rgba(239,68,68,0.1)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 16px'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "26",
    height: "26",
    fill: "none",
    stroke: "#ef4444",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 16,
      fontWeight: 700,
      color: '#111',
      marginBottom: 8
    }
  }, "Are you sure to delete this item?"), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: '#888',
      marginBottom: 24
    }
  }, "This item will be removed from your cart."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setDeleteConfirm(null),
    style: {
      flex: 1,
      padding: '12px',
      border: '1.5px solid #ddd',
      borderRadius: 10,
      background: '#fff',
      color: '#444',
      fontSize: 14,
      fontWeight: 600,
      cursor: 'pointer',
      transition: 'background 0.2s'
    },
    onMouseEnter: e => e.currentTarget.style.background = '#f5f5f5',
    onMouseLeave: e => e.currentTarget.style.background = '#fff'
  }, "Cancel"), /*#__PURE__*/React.createElement("button", {
    onClick: confirmDelete,
    style: {
      flex: 1,
      padding: '12px',
      border: 'none',
      borderRadius: 10,
      background: '#1a1a2e',
      color: '#fff',
      fontSize: 14,
      fontWeight: 700,
      cursor: 'pointer',
      transition: 'background 0.2s'
    },
    onMouseEnter: e => e.currentTarget.style.background = '#2d2d50',
    onMouseLeave: e => e.currentTarget.style.background = '#1a1a2e'
  }, "Delete")))), "            ", cart.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '16px 20px',
      borderTop: '1px solid rgba(0,0,0,0.12)',
      flexShrink: 0
    }
  }, totalSavings > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 10,
      padding: '8px 12px',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      border: '1px solid #86efac',
      borderRadius: 12,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: '#166534',
      display: 'flex',
      alignItems: 'center',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("span", null, "🎉"), /*#__PURE__*/React.createElement("span", null, tr(language, 'Total Savings on this order:', 'Is order par apki kul bachat:', 'اس آرڈر پر آپ کی کل بچت:'))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      fontWeight: 900,
      color: '#15803d',
      background: '#ffffff',
      padding: '2px 8px',
      borderRadius: 8,
      border: '1px solid #bbf7d0'
    }
  }, "Rs. ", totalSavings.toLocaleString())), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 14,
      padding: '13px 14px',
      background: 'linear-gradient(135deg,#f8fafc 0%,#ffffff 100%)',
      border: '1px solid rgba(0,0,0,0.16)',
      borderRadius: 14,
      boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: '#111111',
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '0.12em'
    }
  }, translate(langData, "totalBill")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 22,
      fontWeight: 900,
      color: '#ffffff',
      background: '#000000',
      borderRadius: 12,
      padding: '5px 12px',
      fontFamily: "'Poppins',sans-serif",
      boxShadow: '0 4px 12px rgba(0,0,0,0.18)'
    }
  }, translate(langData, "priceLabel", {
    amount: cartTotal.toLocaleString()
  }))), /*#__PURE__*/React.createElement("button", {
    onClick: onCheckout,
    style: {
      width: '100%',
      padding: '14px',
      borderRadius: 14,
      border: 'none',
      background: 'linear-gradient(135deg,#000000 0%,#000000 100%)',
      color: '#ffffff',
      fontSize: 14,
      fontWeight: 800,
      letterSpacing: '0.15em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      transition: 'all 0.2s'
    },
    onMouseEnter: e => {
      e.currentTarget.style.filter = 'brightness(1.1)';
      e.currentTarget.style.boxShadow = '0 6px 28px rgba(0,0,0,0.12)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.filter = 'none';
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.12)';
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      width: 18,
      height: 18
    },
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M17 8l4 4m0 0l-4 4m4-4H3"
  })), translate(langData, "proceedOrder")))));
}
function OrderHistoryModal({
  open,
  orders,
  langData,
  language,
  onClose,
  onClear
}) {
  if (!open) return null;
  // Default expand the first (latest) order
  const [expandedId, setExpandedId] = useState(orders.length > 0 ? orders[0].id : null);
  const toggleOrder = id => {
    setExpandedId(prev => prev === id ? null : id);
  };
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 70,
      background: 'rgba(0,0,0,0.72)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    },
    className: "animate-fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 580,
      maxHeight: '88vh',
      overflow: 'hidden',
      background: '#ffffff',
      borderRadius: 22,
      border: '1px solid rgba(0,0,0,0.12)',
      boxShadow: '0 24px 70px rgba(0,0,0,0.45)',
      display: 'flex',
      flexDirection: 'column'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '18px 20px',
      borderBottom: '1px solid rgba(0,0,0,0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      background: '#ffffff'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 40,
      height: 40,
      borderRadius: 12,
      background: '#fffbeb',
      border: '1px solid #fef3c7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#b45309'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 16,
      fontWeight: 900,
      color: '#111827',
      letterSpacing: '0.05em',
      textTransform: 'uppercase',
      margin: 0
    }
  }, tr(language, 'Order History', 'Order History', '\u0622\u0631\u0688\u0631 \u06c1\u0633\u067c\u0631\u06cc')), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: '#6b7280',
      marginTop: 2
    }
  }, tr(language, 'Tap an order card to view full items', 'Order card par click karein aur mukammal tafseel dekhein', '\u06a9\u0644\u06a9 \u06a9\u0631\u06cc\u06ba \u0627\u0648\u0631 \u0645\u06a9\u0645\u0644 \u0622\u0631\u0688\u0631 \u062f\u06cc\u06a9\u06be\u06cc\u06ba')))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      width: 34,
      height: 34,
      borderRadius: 10,
      border: '1px solid rgba(0,0,0,0.18)',
      background: '#f3f4f6',
      color: '#111827',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    "aria-label": "Close modal"
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      width: 18,
      height: 18
    },
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M6 18L18 6M6 6l12 12"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 18,
      overflowY: 'auto'
    }
  }, orders.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '44px 18px',
      textAlign: 'center',
      background: '#f9fafb',
      border: '1px dashed #d1d5db',
      borderRadius: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 48,
      height: 48,
      borderRadius: '50%',
      background: '#f3f4f6',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 10px',
      color: '#9ca3af'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-6 h-6",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
  }))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 15,
      fontWeight: 900,
      color: '#111827',
      margin: 0
    }
  }, tr(language, 'No saved orders yet', 'Abhi koi order save nahi hai', '\u0627\u0628\u06be\u06cc \u06a9\u0648\u0626\u06cc \u0622\u0631\u0688\u0631 \u0645\u062d\u0641\u0648\u0638 \u0646\u06c1\u06cc\u06ba')), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: '#6b7280',
      marginTop: 6
    }
  }, tr(language, 'Your placed orders will appear here automatically.', 'Apka agla order yahan khud ba khud show hoga.', '\u0622\u067e \u06a9\u0627 \u0627\u06af\u0644\u0627 \u0622\u0631\u0688\u0631 \u06cc\u06c1\u0627\u06ba \u0646\u0630\u0631 \u0622\u0624 \u06af\u0627'))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }
  }, orders.map((order, idx) => {
    const isExpanded = expandedId === order.id;
    const totalItemsCount = order.items ? order.items.reduce((acc, item) => acc + (item.qty || 1), 0) : 0;
    const itemsSummaryNames = order.items ? order.items.slice(0, 2).map(i => toTitleCase(i.name)).join(', ') + (order.items.length > 2 ? ` +${order.items.length - 2} more` : '') : '';
    return /*#__PURE__*/React.createElement("div", {
      key: order.id,
      style: {
        border: isExpanded ? '1.5px solid #111827' : '1px solid #e5e7eb',
        borderRadius: 16,
        overflow: 'hidden',
        background: '#ffffff',
        boxShadow: isExpanded ? '0 10px 25px rgba(0,0,0,0.1)' : '0 2px 8px rgba(0,0,0,0.04)',
        transition: 'all 0.2s ease'
      }
    }, /*#__PURE__*/React.createElement("div", {
      onClick: () => toggleOrder(order.id),
      style: {
        padding: '14px 16px',
        background: isExpanded ? '#f8fafc' : '#ffffff',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12
      },
      className: "hover:bg-gray-50 transition-colors"
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 10,
        background: isExpanded ? '#111827' : '#f3f4f6',
        color: isExpanded ? '#ffffff' : '#111827',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 13,
        fontWeight: 900,
        flexShrink: 0
      }
    }, "#", orders.length - idx), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 13,
        fontWeight: 900,
        color: '#111827'
      }
    }, "#", order.id), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 800,
        padding: '2px 8px',
        borderRadius: 12,
        background: order.deliveryMethod === 'pickup' ? '#eff6ff' : '#f0fdf4',
        color: order.deliveryMethod === 'pickup' ? '#1d4ed8' : '#15803d',
        border: `1px solid ${order.deliveryMethod === 'pickup' ? '#bfdbfe' : '#bbf7d0'}`
      }
    }, order.deliveryMethod === 'pickup' ? tr(language, 'Store Pickup', 'Dukan se Pickup', '\u0627\u0633\u067c\u0648\u0631 \u067e\u06a9 \u0627\u067e') : tr(language, 'Home Delivery', 'Home Delivery', '\u06c1\u0648\u0645 \u0688\u0644\u06cc\u0648\u0631\u06cc'))), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: '#6b7280',
        marginTop: 4,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        flexWrap: 'wrap'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-3.5 h-3.5 text-gray-400",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"
    })), /*#__PURE__*/React.createElement("span", null, order.dateText)), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#d1d5db'
      }
    }, "\\u2022"), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        fontWeight: 600
      }
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-3.5 h-3.5 text-gray-400",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
    })), /*#__PURE__*/React.createElement("span", null, totalItemsCount, " ", totalItemsCount === 1 ? tr(language, 'item', 'cheez', 'آئٹم') : tr(language, 'items', 'cheezein', 'اشیاء')))), !isExpanded && /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 11,
        color: '#9ca3af',
        marginTop: 2,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        maxWidth: '240px'
      }
    }, itemsSummaryNames))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        flexShrink: 0
      }
    }, /*#__PURE__*/React.createElement("img", {
      src: getImgUrl(`images/${item.id}.${item.imageExt}`),
      alt: item.name,
      style: {
        width: 36,
        height: 36,
        objectFit: 'contain',
        borderRadius: 8,
        background: '#f8fafc',
        border: '1px solid #e2e8f0'
      }
    }), /*#__PURE__*/React.createElement("div", {
      style: {
        textAlign: 'right'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 15,
        fontWeight: 900,
        color: '#111827'
      }
    }, "Rs ", Number(order.grandTotal || 0).toLocaleString()), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 10,
        fontWeight: 700,
        color: isExpanded ? '#2563eb' : '#9ca3af'
      }
    }, isExpanded ? tr(language, 'Collapse ▲', 'Band Karein ▲', '\u0628\u0646\u062f \u06a9\u0631\u06cc\u06ba \u25b2') : tr(language, 'View Details ▼', 'Tafseel Dekhein ▼', '\u062a\u0641\u0635\u06cc\u0644 \u062f\u06cc\u06a9\u06be\u06cc\u06ba \u25bc'))))), isExpanded && /*#__PURE__*/React.createElement("div", {
      style: {
        borderTop: '1px solid #e5e7eb',
        background: '#ffffff',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 12,
        background: '#f8fafc',
        borderRadius: 12,
        border: '1px solid #e2e8f0',
        fontSize: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontWeight: 800,
        color: '#334155',
        display: 'flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-4 h-4 text-slate-600 shrink-0",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
    })), /*#__PURE__*/React.createElement("span", null, order.customer?.name, " (", order.customer?.phone, ")")), order.customer?.address && /*#__PURE__*/React.createElement("div", {
      style: {
        color: '#64748b',
        fontSize: 11,
        display: 'flex',
        alignItems: 'flex-start',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-4 h-4 text-slate-500 shrink-0 mt-0.5",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      viewBox: "0 0 24 24"
    }, /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
    }), /*#__PURE__*/React.createElement("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
    })), /*#__PURE__*/React.createElement("span", null, order.customer.address))), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 11,
        fontWeight: 800,
        color: '#64748b',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        margin: 0
      }
    }, tr(language, 'Itemized Receipt:', 'Ashya ki List (Receipt):', '\u0627\u0634\u06cc\u0622 \u06a9\u06cc \u0641\u06c1\u0631\u0633\u067c:')), order.items.map(item => /*#__PURE__*/React.createElement("div", {
      key: `${order.id}-${item.id}`,
      style: {
        display: 'grid',
        gridTemplateColumns: '36px 1fr auto',
        alignItems: 'center',
        gap: 12,
        padding: '6px 0',
        borderBottom: '1px border-dashed #f1f5f9'
      }
    }, item.imageExt ? /*#__PURE__*/React.createElement("img", {
      src: `images/${item.id}.${item.imageExt}`,
      alt: item.name,
      style: {
        width: 36,
        height: 36,
        objectFit: 'contain',
        borderRadius: 8,
        background: '#f8fafc',
        border: '1px solid #e2e8f0'
      }
    }) : /*#__PURE__*/React.createElement("div", {
      style: {
        width: 36,
        height: 36,
        borderRadius: 8,
        background: '#f1f5f9',
        border: '1px solid #e2e8f0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 12,
        fontWeight: 900,
        color: '#475569'
      }
    }, item.initial || 'S'), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: '#0f172a',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    }, toTitleCase(item.name)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: '#64748b'
      }
    }, "Qty ", item.qty, " x Rs ", Number(item.price || 0).toLocaleString())), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: '#0f172a',
        fontWeight: 900
      }
    }, "Rs ", Number(item.total || 0).toLocaleString())))), /*#__PURE__*/React.createElement("div", {
      style: {
        padding: '10px 14px',
        background: '#f8fafc',
        borderRadius: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 4,
        fontSize: 12,
        border: '1px solid #f1f5f9'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        color: '#64748b'
      }
    }, /*#__PURE__*/React.createElement("span", null, "Subtotal"), /*#__PURE__*/React.createElement("span", null, "Rs ", Number(order.subtotal || 0).toLocaleString())), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        color: '#64748b'
      }
    }, /*#__PURE__*/React.createElement("span", null, "Delivery Fee"), /*#__PURE__*/React.createElement("span", null, order.deliveryFee === 0 ? 'FREE' : `Rs ${order.deliveryFee}`)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontWeight: 900,
        color: '#0f172a',
        fontSize: 14,
        paddingTop: 4,
        borderTop: '1px solid #e2e8f0',
        marginTop: 2
      }
    }, /*#__PURE__*/React.createElement("span", null, "Total Paid"), /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#16a34a'
      }
    }, "Rs ", Number(order.grandTotal || 0).toLocaleString())))));
  }))), orders.length > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px 18px',
      borderTop: '1px solid #e5e7eb',
      background: '#ffffff',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: '#6b7280',
      fontWeight: 700
    }
  }, orders.length, " ", tr(language, orders.length === 1 ? 'order saved' : 'orders saved', orders.length === 1 ? 'order save hua' : 'orders save hue', orders.length === 1 ? 'آرڈر محفوظ' : 'آرڈرز محفوظ')), /*#__PURE__*/React.createElement("button", {
    onClick: onClear,
    style: {
      border: '1px solid #fecaca',
      background: '#fee2e2',
      color: '#991b1b',
      borderRadius: 10,
      padding: '8px 14px',
      fontSize: 11,
      fontWeight: 900,
      cursor: 'pointer',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  }, tr(language, 'Clear History', 'History Saaf Karein', 'ہسٹری صاف کریں')))));
}
function CheckoutModal({
  cart,
  cartTotal,
  langData,
  language,
  saveOrderHistory,
  clearCart,
  onClose,
  onBack
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const [waUrlState, setWaUrlState] = useState("");
  const isUrdu = language === 'ur';
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  const deliveryFee = deliveryMethod === 'pickup' ? 0 : cartTotal >= 2000 ? 0 : 150;
  const grandTotal = cartTotal + deliveryFee;
  function validate() {
    const e = {};
    if (!name.trim()) e.name = translate(langData, "validationName") || 'Name is required';
    if (!phone.trim()) e.phone = translate(langData, "validationPhone") || 'Phone number is required';else if (!/^[0-9]{10,11}$/.test(phone.replace(/\s/g, ''))) e.phone = translate(langData, "validationPhone") || 'Enter valid 10-11 digit number';
    if (deliveryMethod === 'home' && !address.trim()) e.address = translate(langData, "validationAddress") || 'Address is required';
    return e;
  }
  function handleOrder() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }
    setPlacing(true);
    const itemLines = cart.map(({
      product,
      qty,
      variant
    }) => {
      const bulk = calculateBulkPricing(product.price, qty);
      const shadeText = variant ? `\n   🎨 Shade / Colour: ${variant}` : '';
      const bulkText = bulk.extraPercent > 0 ? `\n   🎁 Extra Bulk Discount (${bulk.extraPercent}%): -Rs ${bulk.extraSavings.toLocaleString()}` : '';
      return `• ${product.name}${shadeText}\n   Qty: ${qty}  |  Rate: Rs ${product.price.toLocaleString()}  |  Total: Rs ${bulk.finalTotal.toLocaleString()}${bulkText}`;
    }).join('\n\n');
    const deliveryText = deliveryMethod === 'pickup' ? '🏪 Store Pickup (BS Mart Shop)\n  ⏱️ Pickup Time: Ready in 20 Mins to 1 Hour' : `🚚 Home Delivery (${deliveryFee === 0 ? 'FREE Delivery' : 'Rs 150 Delivery Fee'})`;
    const msg = ['🛒 *NEW ORDER – Sahil Traders*', '═════════════════════════', '', '*📦 ORDER DETAILS:*', itemLines, '', '═════════════════════════', `*Subtotal:* Rs ${cartTotal.toLocaleString()}`, `*Delivery:* ${deliveryText}`, `*💰 TOTAL BILL: Rs ${grandTotal.toLocaleString()}*`, '═════════════════════════', '', '*👤 CUSTOMER INFO:*', `• Name: ${name.trim()}`, `• Phone: ${phone.trim()}`, deliveryMethod === 'home' ? `• Delivery Address: ${address.trim()}` : `• Store Location: BS Mart Shop (Muhammad Zubair Moin & Sahil Saleem)\n  ⏱️ Note: Order will be ready for pickup in 20 mins to 1 hour`, '', '═════════════════════════', `📅 Date: ${new Date().toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`].join('\n');
    const waUrl = `https://wa.me/923368945775?text=${encodeURIComponent(msg)}`;
    const orderDate = new Date();
    const orderRecord = {
      id: `${orderDate.getFullYear()}${String(orderDate.getMonth() + 1).padStart(2, '0')}${String(orderDate.getDate()).padStart(2, '0')}-${String(orderDate.getHours()).padStart(2, '0')}${String(orderDate.getMinutes()).padStart(2, '0')}${String(orderDate.getSeconds()).padStart(2, '0')}`,
      dateText: orderDate.toLocaleDateString('en-PK', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      customer: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim()
      },
      deliveryMethod,
      subtotal: cartTotal,
      deliveryFee,
      grandTotal,
      items: cart.map(({
        product,
        qty,
        variant
      }) => {
        const bulk = calculateBulkPricing(product.price, qty);
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          qty,
          variant: variant || null,
          extraPercent: bulk.extraPercent,
          extraSavings: bulk.extraSavings,
          total: bulk.finalTotal,
          initial: product.initial,
          imageExt: window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id] ? window.PRODUCT_IMAGE_MAP[product.id] : null
        };
      })
    };
    try {
      window.open(waUrl, '_blank');
    } catch (err) {}
    if (typeof saveOrderHistory === 'function') {
      saveOrderHistory(orderRecord);
    }
    if (typeof clearCart === 'function') {
      clearCart();
    }
    setWaUrlState(waUrl);
    setPlacedOrder(orderRecord);
    setPlacing(false);
    setSuccess(true);
  }
  const inputStyle = hasErr => ({
    width: '100%',
    boxSizing: 'border-box',
    padding: '13px 15px',
    borderRadius: 12,
    border: `1px solid ${hasErr ? 'rgba(239,68,68,0.65)' : 'rgba(0,0,0,0.18)'}`,
    background: '#ffffff',
    color: '#111827',
    fontSize: 14,
    outline: 'none',
    caretColor: '#000000',
    boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
    transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s'
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 60,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(8px)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 500,
      background: '#ffffff',
      border: '1px solid rgba(0,0,0,0.12)',
      borderRadius: 24,
      boxShadow: '0 24px 80px rgba(0,0,0,0.9)',
      maxHeight: '90vh',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column'
    }
  }, success && placedOrder ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 22,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    },
    className: "animate-fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      border: '1px solid #bbf7d0',
      borderRadius: 20,
      padding: '20px 16px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 60,
      height: 60,
      borderRadius: '50%',
      background: '#16a34a',
      color: '#ffffff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 10px',
      boxShadow: '0 8px 20px rgba(22,163,74,0.3)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      width: 32,
      height: 32
    },
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "3",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M4.5 12.75l6 6 9-13.5"
  }))), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 19,
      fontWeight: 900,
      color: '#14532d',
      margin: 0
    }
  }, tr(language, 'Thank You! Order Placed! 🎉', 'Mubarak! Order Kamiyabi se Bhej Diya Gaya! 🎉', '\u0622\u0631\u0688\u0631 \u06a9\u0627\u0645\u06cc\u0627\u0628\u06cc \u0633\u06d2 \u0645\u062d\u0641\u0648\u0638 \u06c1\u0648 \u06af\u06cc\u0627!')), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: '#166534',
      fontWeight: 700,
      margin: '4px 0 0'
    }
  }, tr(language, 'Your order receipt is saved below and sent to WhatsApp.', 'Apka order hamare system mein save ho chuka hai aur WhatsApp par bhej diya gaya hai.', '\u0622\u067e \u06a9\u0627 \u0622\u0631\u0688\u0631 \u06c1\u0645\u0627\u0631\u06d2 \u0633\u0633\u067c\u0645 \u0645\u06cc\u06ba \u0645\u062d\u0641\u0648\u0638 \u06c1\u0648 \u0686\u06a9\u0627 \u06c1\u06d2')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      background: '#ffffff',
      border: '1px solid #86efac',
      borderRadius: 10,
      padding: '4px 12px',
      marginTop: 10,
      fontSize: 12,
      fontWeight: 900,
      color: '#166534'
    }
  }, /*#__PURE__*/React.createElement("span", null, tr(language, 'Order Ref #:', 'Order Ref #:', 'آرڈر ریفرنس نمبر:')), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#111827'
    }
  }, "#", placedOrder.id))), /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: 18,
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid #e2e8f0',
      paddingBottom: 8
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: '#334155',
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-3.5 h-3.5 text-slate-500",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
  })), /*#__PURE__*/React.createElement("span", null, placedOrder.customer.name, " (", placedOrder.customer.phone, ")")), placedOrder.customer.address && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#64748b',
      marginTop: 2,
      display: 'flex',
      alignItems: 'center',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-3 h-3 text-slate-400",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
  }), /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
  })), /*#__PURE__*/React.createElement("span", null, placedOrder.customer.address))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 900,
      padding: '3px 8px',
      borderRadius: 8,
      background: placedOrder.deliveryMethod === 'pickup' ? '#eff6ff' : '#f0fdf4',
      color: placedOrder.deliveryMethod === 'pickup' ? '#1d4ed8' : '#15803d',
      border: `1px solid ${placedOrder.deliveryMethod === 'pickup' ? '#bfdbfe' : '#bbf7d0'}`
    }
  }, placedOrder.deliveryMethod === 'pickup' ? tr(language, 'Store Pickup', 'Dukan se Pickup', '\u0627\u0633\u067c\u0648\u0631 \u067e\u06a9 \u0627\u067e') : tr(language, 'Home Delivery', 'Home Delivery', '\u06c1\u0648\u0645 \u0688\u0644\u06cc\u0648\u0631\u06cc'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      maxHeight: 150,
      overflowY: 'auto'
    }
  }, placedOrder.items.map((item, idx) => /*#__PURE__*/React.createElement("div", {
    key: idx,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 8,
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 700,
      color: '#0f172a',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      display: 'block'
    }
  }, toTitleCase(item.name)), item.variant && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      fontWeight: 800,
      color: '#92400e',
      background: '#fef3c7',
      padding: '1px 5px',
      borderRadius: 4,
      display: 'inline-block',
      marginTop: 1
    }
  }, "Shade: ", item.variant)), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#475569',
      fontWeight: 800,
      whiteSpace: 'nowrap'
    }
  }, "Qty ", item.qty, " x Rs ", Number(item.price).toLocaleString(), " = ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#0f172a'
    }
  }, "Rs ", Number(item.total).toLocaleString()))))), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid #e2e8f0',
      paddingTop: 8,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontWeight: 900,
      fontSize: 13
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#334155'
    }
  }, tr(language, 'Total Bill Amount:', 'Kul Bill Amount:', 'کل بل کی رقم:')), /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#16a34a',
      fontSize: 17
    }
  }, "Rs ", Number(placedOrder.grandTotal).toLocaleString()))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '10px 12px',
      background: '#fffbeb',
      border: '1px solid #fef3c7',
      borderRadius: 12,
      fontSize: 11,
      color: '#92400e',
      lineHeight: 1.4,
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      width: 18,
      height: 18,
      color: '#16a34a',
      flexShrink: 0
    },
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, tr(language, 'WhatsApp Chat:', 'WhatsApp Chat:', '\u0648\u0627\u067e\u0633 \u0627\u06cc\u067e \u0686\u0627\u067c:')), " ", tr(language, 'If chat did not open automatically, click button below.', 'Agar WhatsApp khud ba khud nahi khula to neeche button dabayein.', '\u0627\u06af\u0631 \u0648\u0627\u067e\u0633 \u0627\u06cc\u067e \u062e\u0648\u062f \u0628\u062e\u0648\u062f \u0646\u06c1\u06cc\u06ba \u06a9\u06be\u0644\u0627 \u062a\u0648 \u0646\u06cc\u0686\u06d2 \u0628\u067c\u0646 \u062f\u0628\u0627\u0626\u06cc\u06ba\u06d5'))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8
    }
  }, waUrlState && /*#__PURE__*/React.createElement("a", {
    href: waUrlState,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      background: '#25d366',
      color: '#ffffff',
      borderRadius: 12,
      padding: '11px 16px',
      fontSize: 13,
      fontWeight: 900,
      textAlign: 'center',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      boxShadow: '0 4px 14px rgba(37,211,102,0.3)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      width: 18,
      height: 18
    },
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
  })), /*#__PURE__*/React.createElement("span", null, tr(language, 'Open WhatsApp Chat', 'WhatsApp par Chat Kholein', '\u0648\u0627\u067e\u0633 \u0627\u06cc\u067e \u067e\u0631 \u0686\u0627\u067c \u06a9\u06be\u0644\u06cc\u06ba'))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: '#111827',
      color: '#ffffff',
      border: 'none',
      borderRadius: 12,
      padding: '11px 16px',
      fontSize: 12,
      fontWeight: 900,
      cursor: 'pointer',
      textTransform: 'uppercase',
      letterSpacing: '0.05em'
    }
  }, tr(language, 'Done & Continue Shopping', 'Mukammal Karein (Done)', '\u0645\u06a9\u0645\u0644 \u06a9\u0631\u06cc\u06ba (Done)')))) : /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px',
      borderBottom: '1px solid rgba(0,0,0,0.12)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      background: '#f3f4f6',
      border: '1px solid rgba(0,0,0,0.28)',
      borderRadius: 10,
      padding: '6px 10px',
      color: '#111111',
      cursor: 'pointer',
      fontSize: 12,
      fontWeight: 800,
      display: 'flex',
      alignItems: 'center',
      gap: 4,
      boxShadow: '0 1px 2px rgba(0,0,0,0.12)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      width: 14,
      height: 14
    },
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15.75 19.5L8.25 12l7.5-7.5"
  })), translate(langData, "backBtn")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16,
      fontWeight: 800,
      color: '#000000',
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      fontFamily: "'Poppins',sans-serif"
    }
  }, translate(langData, "checkoutTitle"))), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    style: {
      background: 'none',
      border: 'none',
      color: 'rgba(255,255,255,0.4)',
      cursor: 'pointer',
      display: 'flex'
    },
    onMouseEnter: e => e.currentTarget.style.color = 'white',
    onMouseLeave: e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      width: 20,
      height: 20
    },
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M6 18L18 6M6 6l12 12"
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '20px 24px',
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: '#f8f9fa',
      border: '1px solid rgba(0,0,0,0.12)',
      borderRadius: 16,
      padding: '14px 16px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#111111',
      letterSpacing: '0.2em',
      textTransform: 'uppercase',
      marginBottom: 12
    }
  }, translate(langData, "orderSummary")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      maxHeight: 180,
      overflowY: 'auto'
    }
  }, cart.map(({
    product,
    qty,
    variant
  }) => {
    const bulk = calculateBulkPricing(product.price, qty);
    return /*#__PURE__*/React.createElement("div", {
      key: `${product.id}-${variant || ''}`,
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        minWidth: 0
      }
    }, window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id] ? /*#__PURE__*/React.createElement("img", {
      src: getImgUrl(`images/${product.id}.${window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id] || "png"}`),
      onError: e => {
        e.target.onerror = null;
      },
      alt: product.name,
      className: "w-7 h-7 rounded-lg object-contain bg-black/40 p-0.5 shrink-0 border border-gray-200"
    }) : /*#__PURE__*/React.createElement("div", {
      className: `w-7 h-7 rounded-lg bg-gradient-to-br ${product.gradient} flex items-center justify-center shrink-0`
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: '#1a1a2e',
        fontSize: 10,
        fontWeight: 800
      }
    }, product.initial)), /*#__PURE__*/React.createElement("div", {
      style: {
        minWidth: 0
      }
    }, /*#__PURE__*/React.createElement("p", {
      style: {
        fontSize: 12,
        color: '#1a1a2e',
        margin: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap'
      }
    }, toTitleCase(product.name)), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        flexWrap: 'wrap'
      }
    }, variant && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9.5,
        fontWeight: 800,
        color: '#92400e',
        background: '#fef3c7',
        border: '1px solid #fde68a',
        borderRadius: 4,
        padding: '0.5px 4px',
        display: 'inline-block'
      }
    }, "Shade: ", variant), bulk.extraPercent > 0 && /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 9,
        fontWeight: 800,
        color: '#166534',
        background: '#dcfce7',
        borderRadius: 4,
        padding: '0.5px 4px'
      }
    }, "🎁 -", bulk.extraPercent, "% Bulk OFF")))), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12,
        color: '#000000',
        fontWeight: 700,
        whiteSpace: 'nowrap',
        flexShrink: 0
      }
    }, "× ", qty, " = ", translate(langData, "priceLabel", {
      amount: bulk.finalTotal.toLocaleString()
    })));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      padding: '12px 14px',
      border: '1px solid rgba(0,0,0,0.16)',
      borderRadius: 14,
      background: 'linear-gradient(135deg,#ffffff 0%,#f8fafc 100%)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: '#111111',
      fontWeight: 900,
      textTransform: 'uppercase',
      letterSpacing: '0.12em'
    }
  }, translate(langData, "totalBill")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 20,
      fontWeight: 900,
      color: '#ffffff',
      background: '#000000',
      borderRadius: 12,
      padding: '5px 12px',
      fontFamily: "'Poppins',sans-serif",
      boxShadow: '0 4px 12px rgba(0,0,0,0.18)'
    }
  }, translate(langData, "priceLabel", {
    amount: cartTotal.toLocaleString()
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: "10px 12px",
      background: "#eff6ff",
      border: "1px solid #bfdbfe",
      borderRadius: 12,
      display: "flex",
      alignItems: "center",
      gap: 8,
      fontSize: 11,
      color: "#1e40af",
      fontWeight: 800
    }
  }, /*#__PURE__*/React.createElement("svg", {
    className: "w-3.5 h-3.5 text-blue-600 shrink-0",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
  }), /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
  })), /*#__PURE__*/React.createElement("span", null, tr(language, "Notice: Home Delivery is ONLY available within Karachi city.", "Note: Home Delivery SIRF Karachi sheher ke liye dastyab hai.", "\u0646\u0648\u067c\u0633: \u06c1\u0648\u0645 \u0688\u0644\u06cc\u0648\u0631\u06cc \u0635\u0631\u0641 \u06a9\u0631\u0627\u0686\u06cc \u06a9\u06d2 \u0634\u06c1\u0631 \u06a9\u06d2 \u0644\u0626\u06d2 \u062f\u0633\u062a\u06cc\u0627\u0628 \u06c1\u06d2\u06d5"))), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#111111',
      letterSpacing: '0.2em',
      textTransform: 'uppercase'
    }
  }, tr(language, 'Delivery Option', 'Delivery Ka Tareeqa', 'ڈلیوری کا طریقہ')), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => setDeliveryMethod('home'),
    style: {
      padding: '12px',
      borderRadius: 14,
      border: deliveryMethod === 'home' ? '2px solid #000' : '1px solid #e5e7eb',
      background: deliveryMethod === 'home' ? '#f9fafb' : '#fff',
      cursor: 'pointer',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18
    }
  }, "🚚"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: '#111',
      marginTop: 4
    }
  }, tr(language, 'Home Delivery', 'Ghar par Delivery', 'ہوم ڈلیوری')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#6b7280',
      marginTop: 2
    }
  }, cartTotal >= 2000 ? tr(language, 'FREE', 'FREE (Muft)', 'مفت') : 'Rs 150')), /*#__PURE__*/React.createElement("div", {
    onClick: () => setDeliveryMethod('pickup'),
    style: {
      padding: '12px',
      borderRadius: 14,
      border: deliveryMethod === 'pickup' ? '2px solid #000' : '1px solid #e5e7eb',
      background: deliveryMethod === 'pickup' ? '#f9fafb' : '#fff',
      cursor: 'pointer',
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 18
    }
  }, "🏪"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: '#111',
      marginTop: 4
    }
  }, tr(language, 'Store Pickup', 'Dukan se Pickup', 'دکان سے پک اپ')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#16a34a',
      fontWeight: 700,
      marginTop: 2
    }
  }, "BS Mart (FREE)")))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#111111',
      letterSpacing: '0.2em',
      textTransform: 'uppercase'
    }
  }, translate(langData, "yourDetails")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 12,
      color: '#444444',
      fontWeight: 600,
      display: 'block',
      marginBottom: 6
    }
  }, translate(langData, "fullName")), /*#__PURE__*/React.createElement("input", {
    type: "text",
    placeholder: translate(langData, "fullNamePlaceholder"),
    value: name,
    onChange: e => {
      setName(e.target.value);
      if (errors.name) setErrors(p => ({
        ...p,
        name: ''
      }));
    },
    style: inputStyle(errors.name),
    onFocus: e => {
      e.target.style.borderColor = 'rgba(0,0,0,0.42)';
      e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.08), inset 0 1px 2px rgba(0,0,0,0.04)';
    },
    onBlur: e => {
      e.target.style.borderColor = errors.name ? 'rgba(239,68,68,0.65)' : 'rgba(0,0,0,0.18)';
      e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)';
    }
  }), errors.name && /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(239,68,68,0.9)',
      fontSize: 11,
      marginTop: 4,
      fontWeight: 600
    }
  }, errors.name)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 12,
      color: '#444444',
      fontWeight: 600,
      display: 'block',
      marginBottom: 6
    }
  }, translate(langData, "mobileNumber")), /*#__PURE__*/React.createElement("input", {
    type: "tel",
    placeholder: "03xxxxxxxxx",
    value: phone,
    onChange: e => {
      setPhone(e.target.value);
      if (errors.phone) setErrors(p => ({
        ...p,
        phone: ''
      }));
    },
    style: inputStyle(errors.phone),
    onFocus: e => {
      e.target.style.borderColor = 'rgba(0,0,0,0.42)';
      e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.08), inset 0 1px 2px rgba(0,0,0,0.04)';
    },
    onBlur: e => {
      e.target.style.borderColor = errors.phone ? 'rgba(239,68,68,0.65)' : 'rgba(0,0,0,0.18)';
      e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)';
    }
  }), errors.phone && /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(239,68,68,0.9)',
      fontSize: 11,
      marginTop: 4,
      fontWeight: 600
    }
  }, errors.phone)), deliveryMethod === 'home' ? /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
    style: {
      fontSize: 12,
      color: '#444444',
      fontWeight: 600,
      display: 'block',
      marginBottom: 6
    }
  }, translate(langData, "deliveryAddress")), /*#__PURE__*/React.createElement("textarea", {
    placeholder: translate(langData, "addressPlaceholder"),
    value: address,
    onChange: e => {
      setAddress(e.target.value);
      if (errors.address) setErrors(p => ({
        ...p,
        address: ''
      }));
    },
    rows: 3,
    style: {
      ...inputStyle(errors.address),
      resize: 'none',
      fontFamily: 'inherit'
    },
    onFocus: e => {
      e.target.style.borderColor = 'rgba(0,0,0,0.42)';
      e.target.style.boxShadow = '0 0 0 3px rgba(0,0,0,0.08), inset 0 1px 2px rgba(0,0,0,0.04)';
    },
    onBlur: e => {
      e.target.style.borderColor = errors.address ? 'rgba(239,68,68,0.65)' : 'rgba(0,0,0,0.18)';
      e.target.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.04)';
    }
  }), errors.address && /*#__PURE__*/React.createElement("p", {
    style: {
      color: 'rgba(239,68,68,0.9)',
      fontSize: 11,
      marginTop: 4,
      fontWeight: 600
    }
  }, errors.address)) : /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '14px',
      borderRadius: 14,
      background: '#f0fdf4',
      border: '1px solid #bbf7d0',
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13,
      fontWeight: 800,
      color: '#166534'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 18
    }
  }, "⏱️"), /*#__PURE__*/React.createElement("span", null, "پک اپ کا وقت: 20 منٹ سے 1 گھنٹہ")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      color: '#15803d',
      fontWeight: 600,
      lineHeight: 1.5,
      margin: 0
    }
  }, "آپ کا آرڈر تیار ہونے میں 20 منٹ سے 1 گھنٹہ لگ سکتا ہے۔ اس وقت کے بعد آپ BS Mart اسٹور (محمد زبیر معین / محمد سہیل سلیم) سے اپنا سامان پک اپ کر سکتے ہیں۔"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 10,
      background: 'rgba(37,211,102,0.06)',
      border: '1px solid rgba(37,211,102,0.2)',
      borderRadius: 12,
      padding: '12px 14px'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      width: 18,
      height: 18,
      color: '#25d366',
      flexShrink: 0,
      marginTop: 1
    },
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: '#444444',
      lineHeight: 1.5
    }
  }, translate(langData, "whatsappNotice"))), /*#__PURE__*/React.createElement("button", {
    onClick: handleOrder,
    disabled: placing,
    style: {
      width: '100%',
      padding: '15px',
      borderRadius: 14,
      border: 'none',
      background: placing ? 'rgba(0,0,0,0.12)' : 'linear-gradient(135deg,#25d366 0%,#128C7E 100%)',
      color: '#1a1a2e',
      fontSize: 15,
      fontWeight: 800,
      letterSpacing: '0.12em',
      textTransform: 'uppercase',
      cursor: placing ? 'not-allowed' : 'pointer',
      boxShadow: '0 4px 20px rgba(37,211,102,0.3)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      transition: 'all 0.2s',
      marginBottom: 4
    },
    onMouseEnter: e => {
      if (!placing) {
        e.currentTarget.style.filter = 'brightness(1.08)';
        e.currentTarget.style.boxShadow = '0 6px 28px rgba(37,211,102,0.45)';
      }
    },
    onMouseLeave: e => {
      e.currentTarget.style.filter = 'none';
      e.currentTarget.style.boxShadow = '0 4px 20px rgba(37,211,102,0.3)';
    }
  }, placing ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("svg", {
    style: {
      width: 18,
      height: 18,
      animation: 'spin 1s linear infinite'
    },
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99"
  })), translate(langData, "placingOrder")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("svg", {
    style: {
      width: 20,
      height: 20
    },
    viewBox: "0 0 24 24",
    fill: "currentColor"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
  })), translate(langData, "placeOrderBtn")))))));
}
// Auto-mount React App safely when DOM is ready
(function() {
  function mount() {
    var rootEl = document.getElementById('root');
    if (rootEl && !rootEl.__reactRootMounted) {
      rootEl.__reactRootMounted = true;
      ReactDOM.createRoot(rootEl).render(React.createElement(SahilTraders));
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();