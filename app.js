const {
  useState,
  useMemo,
  useEffect,
  useRef
} = React;
function getTranslationValue(dictionary, key) {
  return key.split(".").reduce((value, part) => value?.[part], dictionary) || "";
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
  result = result.replace(/(\d+)\s*ML/g, "$1 ایم ایل");
  result = result.replace(/(\d+)\s*KG/g, "$1 کلو");
  result = result.replace(/(\d+)\s*G\b/g, "$1 گرام");
  result = result.replace(/RS\.?\s*(\d+)/g, "روپے $1");
  result = result.replace(/RP\.?\s*(\d+)/g, "روپے $1");
  result = result.replace(/(\d+)\s*INCH/g, "$1 انچ");
  const wordMap = {
    // Brands
    "PEARS": "پیرز",
    "PONDS": "پونڈز",
    "SAFEGUARD": "سیف گارڈ",
    "SAFE GUARD": "سیف گارڈ",
    "DETTOL": "ڈیٹول",
    "DETOL": "ڈیٹول",
    "LIFEBUOY": "لائف بوائے",
    "LUX": "لکس",
    "MEDORA": "میڈورا",
    "OLIVIA": "اولیویا",
    "TIBET": "تبت",
    "CAPRI": "کیپری",
    "MECLAY": "میکلے",
    "GARNIER": "گارنیئر",
    "VEET": "ویٹ",
    "FAIR & LOVELY": "فیئر اینڈ لولی",
    "FAIR AND LOVELY": "فیئر اینڈ لولی",
    "GOLDEN PEARL": "گولڈن پرل",
    "BIO AMLA": "بائیو آملا",
    "SUNSILK": "سن سلک",
    "PANTENE": "پینٹین",
    "DOVE": "ڈوو",
    "SENSODYNE": "سینسوڈائن",
    "COLGATE": "کولگیٹ",
    "DENTONIC": "ڈینٹونک",
    "CLOSE UP": "کلوز اپ",
    "GILLETTE": "جیلیٹ",
    "LEMON MAX": "لیمن میکس",
    "ARIEL": "ایریل",
    "SURF EXCEL": "سرف ایکسل",
    "BONUS": "بونس",
    "EXPRESS": "ایکسپریس",
    "BRITE": "برائٹ",
    "VIM": "وم",
    "HARPIC": "ہارپک",
    "JOHNSONS": "جانسنز",
    "JOHNSON'S": "جانسنز",
    "ROSE PETAL": "روز پیٹل",
    "LIPTON": "لپٹن",
    "TAPAL": "طاپل",
    "NESTLE": "نسلے",
    "EVERYDAY": "ایوری ڈے",
    // Product Types / Keywords
    "SOAP": "صابن",
    "SHAMPOO": "شیمپو",
    "CREAM": "کریم",
    "LOTION": "لوشن",
    "FACE WASH": "فیس واش",
    "FACEWASH": "فیس واش",
    "TOOTHPASTE": "ٹوتھ پیسٹ",
    "HAIR OIL": "بالوں کا تیل",
    "OIL": "تیل",
    "HAIR": "بال",
    "DEO": "باڈی اسپرے / پاؤڈر",
    "DEODORANT": "ڈی اوڈورنٹ",
    "TALCUM": "ٹالکم",
    "POWDER": "پاؤڈر",
    "PERFUME": "پرفیوم",
    "BODY SPRAY": "باڈی اسپرے",
    "SPRAY": "اسپرے",
    "DETERGENT": "سرف",
    "BABY": "بیبی",
    "CARE": "کیئر",
    "SHAVING": "شیونگ",
    "BLADE": "بلیڈ",
    "RAZOR": "ریزر",
    "PAD": "پیڈ",
    "PADS": "پیڈز",
    "MAXI": "میکسی",
    "BALLOON": "غبارہ",
    "TAPE": "ٹیپ",
    "PACKING": "پیکنگ",
    "GLYCERINE": "گلیسرین",
    "LIQUID": "لیکوئڈ",
    "DISHWASH": "ڈش واش",
    // Sizes / Attributes
    "SMALL": "چھوٹا",
    "MEDIUM": "درمیانہ",
    "LARGE": "بڑا",
    "BOX": "ڈبہ",
    "PACK": "پیک",
    "PACKET": "پیکٹ",
    "TUBE": "ٹیوب",
    "ROLL": "رول",
    "MIX": "مکس",
    "PINK": "گلابی",
    "GREEN": "سبز",
    "BROWN": "براؤن",
    "BLUE": "نیلا",
    "YELLOW": "پیلا",
    "RED": "سرخ",
    "BLACK": "کالا",
    "WHITE": "سفید",
    "GOLD": "گولڈ",
    "SILVER": "سلور",
    // Connectors
    "WITH": "کے ساتھ",
    "FOR": "کے لیے",
    "AND": "اور"
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

  // Character-by-character fallback for remaining English letters/numbers to convert completely to Urdu script
  const translitMap = {
    'A': 'ا',
    'B': 'ب',
    'C': 'ک',
    'D': 'ڈ',
    'E': 'ے',
    'F': 'ف',
    'G': 'گ',
    'H': 'ہ',
    'I': 'آئی',
    'J': 'ج',
    'K': 'ک',
    'L': 'ل',
    'M': 'م',
    'N': 'ن',
    'O': 'و',
    'P': 'پ',
    'Q': 'ق',
    'R': 'ر',
    'S': 'س',
    'T': 'ت',
    'U': 'یو',
    'V': 'و',
    'W': 'و',
    'X': 'ایکس',
    'Y': 'وائی',
    'Z': 'زیڈ',
    '0': '۰',
    '1': '۱',
    '2': '۲',
    '3': '۳',
    '4': '۴',
    '5': '۵',
    '6': '۶',
    '7': '۷',
    '8': '۸',
    '9': '۹'
  };
  let finalResult = Array.from(textAfterWordReplacements).map(char => {
    let upperChar = char.toUpperCase();
    return translitMap[upperChar] || char;
  }).join("");
  return finalResult.replace(/\s+/g, " ").trim();
}
function toTitleCase(str) {
  return str.toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}
function parseProductPriceAndName(name) {
  const regex = /RS[,\.\s]?\s*(\d+)/i;
  const match = String(name || "").match(regex);
  if (match) {
    const originalPrice = parseInt(match[1], 10);
    let clean = name.replace(regex, '').replace(/[-\s,]+$/, '').trim();
    return {
      originalPrice,
      cleanName: clean
    };
  }
  return {
    originalPrice: null,
    cleanName: name
  };
}
function getProductDisplayName(product, language) {
  const {
    cleanName
  } = parseProductPriceAndName(product.name);
  if (language === "ur") {
    return translateItemNameToUrdu(cleanName);
  }
  return toTitleCase(cleanName);
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
const CATEGORIES = [{
  id: "soaps",
  name: "Soaps"
}, {
  id: "shampoo",
  name: "Shampoo & Conditioner"
}, {
  id: "creams",
  name: "Creams & Lotions"
}, {
  id: "stationary",
  name: "Stationary & Tapes"
}, {
  id: "sports",
  name: "Sports & Toys"
}, {
  id: "birthday",
  name: "Birthday"
}, {
  id: "powders",
  name: "Powders"
}, {
  id: "shaving",
  name: "Shaving & Razers & Blades"
}, {
  id: "haircolour",
  name: "Hair Colour & Care & Oil"
}, {
  id: "condemn",
  name: "Condoms"
}, {
  id: "lock",
  name: "Lock & Cells"
}, {
  id: "general",
  name: "General Item & Others"
}, {
  id: "babycare",
  name: "Baby Care"
}, {
  id: "mosquito",
  name: "Anti-Mosquito"
}, {
  id: "personalcare",
  name: "Personal Care"
}, {
  id: "others",
  name: "Others"
}, {
  id: "fragnances",
  name: "Fragnances"
}, {
  id: "toothpasteandbrush",
  name: "Tooth Paste & Brush"
}, {
  id: "facewash",
  name: "Face Wash"
}];
const SWATCH_GRADIENTS = ["from-amber-400 to-orange-500", "from-violet-500 to-purple-600", "from-emerald-400 to-teal-600", "from-rose-400 to-pink-600", "from-sky-400 to-blue-600", "from-fuchsia-400 to-purple-600", "from-teal-400 to-cyan-600", "from-indigo-400 to-violet-600"];
const PRODUCTS = [{
  id: 1,
  name: "7 HERBAL OIL 100ML RS,250",
  price: 220,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 2,
  name: "7 HERBAL OIL 200ML RP,400",
  price: 369,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 3,
  name: "7 HERBAL OIL 50ML RS,170",
  price: 155,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 5,
  name: "AL RASHIEED OIL 100ML SASSO",
  price: 480,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 6,
  name: "ALOE VERA GEL TUBE (LARGE)",
  price: 140,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "A"
}, {
  id: 7,
  name: "ALOE VERA GEL TUBE 160ml (MEDIUM) 160ML",
  price: 99,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "A"
}, {
  id: 8,
  name: "ALOE VERA GEL TUBE (SMALL) 80ML",
  price: 70,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "A"
}, {
  id: 14,
  name: "SNOW FALL SPRAY (LARGE)",
  price: 180,
  categoryId: "birthday",
  categoryName: "Birthday"
}, {
  id: 15,
  name: "SNOW FALL SPRAY SMALL",
  price: 120,
  categoryId: "birthday",
  categoryName: "Birthday"
}, {
  id: 16,
  name: "SNOW FALL SPRAY SMALL (KIWI)",
  price: 140,
  categoryId: "birthday",
  categoryName: "Birthday"
}, {
  id: 17,
  name: "BAJAJ ALMOND OIL 100ml",
  price: 950,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 18,
  name: "BALL ADIDAS",
  price: 100,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 21,
  name: "BALL CA GOOD QUALITY (NON ORIGINAL)",
  price: 120,
  categoryId: "sports",
  categoryName: "Sports & Toys",
  filterName: "CA"
}, {
  id: 22,
  name: "BALL CA GOOD QUALITY (ORIGINAL)",
  price: 250,
  categoryId: "sports",
  categoryName: "Sports & Toys",
  filterName: "CA"
}, {
  id: 23,
  name: "BALL FINE (ORIGINAL)",
  price: 170,
  categoryId: "sports",
  categoryName: "Sports & Toys",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "B"
}, {
  id: 26,
  name: "BALL PEN MAX (BLACK)",
  price: 30,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 27,
  name: "BALL PEN MAX (BLUE)",
  price: 30,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 28,
  name: "BALL PEN MAX (RED)",
  price: 30,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 29,
  name: "BALL PEN PEN (SKY) BLACK",
  price: 15,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 30,
  name: "BALL PEN PEN (SKY) BLUE",
  price: 15,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 31,
  name: "BALL PEN PEN (SKY) RED",
  price: 15,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 32,
  name: "BALL PEN PIANO YELLOW BLUE CAP",
  price: 15,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 33,
  name: "BALL PEN PICASSO BLUE",
  price: 18,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 34,
  name: "BALL PEN PICASSO RED",
  price: 18,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 37,
  name: "BALL POINT PEN SIGNATURE (BLACK)",
  price: 18,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 38,
  name: "BALL POINT PEN SIGNATURE (BLUE)",
  price: 18,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 46,
  name: "BANYAN (# 38)",
  price: 165,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 47,
  name: "BANYAN (# 40)",
  price: 175,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 48,
  name: "BANYAN (# 42)",
  price: 185,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 49,
  name: "BANYAN (# 44)",
  price: 195,
  categoryId: "others",
  categoryName: "Others"
}, {
  id: 50,
  name: "BANYAN CHILD  30# GOOD QUALITY",
  price: 80,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 51,
  name: "BIO AMLA HAIR OIL 100ml RS,280",
  price: 190,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "B"
}, {
  id: 52,
  name: "BIO AMLA HAIR OIL 200ml FARVAL ORIGINAL RS,475",
  price: 380,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 53,
  name: "BIO AMLA HAIR OIL 50ml FARVAL ORIGINAL RS,160",
  price: 140,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 54,
  name: "BIRTHDAY CANDLE 0 TO 9 NUMBERS",
  price: 50,
  categoryId: "birthday",
  categoryName: "Birthday",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "B"
}, {
  id: 59,
  name: "BLACK COBRA SPRAY 300ML",
  price: 420,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "B"
}, {
  id: 60,
  name: "HUDA BEAUTY MASK SACHET",
  price: 50,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 61,
  name: "BLADE 7 O CLOCK GREEN",
  price: 80,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "B"
}, {
  id: 62,
  name: "BLADE TREET (BLACK)",
  price: 70,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "B"
}, {
  id: 64,
  name: "BLADE TREET (PLATINUM)",
  price: 90,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades"
}, {
  id: 65,
  name: "BODY RAZOR TINKLE (DOUBLE PACK SAFETY)",
  price: 190,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "B"
}, {
  id: 66,
  name: "BODY RAZOR TWINKLE LADIES (EYEBROW)",
  price: 75,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "B"
}, {
  id: 67,
  name: "BODY SPRAY (INDO) MIX",
  price: 240,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "B"
}, {
  id: 68,
  name: "BODY SPRAY AXE (CHOCOLATE)",
  price: 690,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "B"
}, {
  id: 69,
  name: "BODY SPRAY AXE (MIX)",
  price: 690,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "B"
}, {
  id: 70,
  name: "BODY SPRAY BOLD (MIX) OLD SLIM",
  price: 690,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "B"
}, {
  id: 71,
  name: "BODY SPRAY BRUT (GREEN)",
  price: 790,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 72,
  name: "BODY SPRAY CHI CHI (BLUE) FOR MEN",
  price: 690,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 73,
  name: "BODY SPRAY CHI CHI (CRAZY GIRL)",
  price: 690,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 75,
  name: "BODY SPRAY CHI CHI (PINK) WOMEN",
  price: 690,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "B"
}, {
  id: 76,
  name: "BODY SPRAY CHI CHI (SOLID)",
  price: 690,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "B"
}, {
  id: 77,
  name: "BODY SPRAY DUNHILL DESIRE (BLACK)",
  price: 640,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 78,
  name: "BODY SPRAY DUNHILL DESIRE (BLUE)",
  price: 640,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 79,
  name: "BODY SPRAY DUNHILL DESIRE (RED)",
  price: 640,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 81,
  name: "BODY SPRAY EVERY ONE",
  price: 590,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "B"
}, {
  id: 82,
  name: "BODY SPRAY FERRARI (MIX)",
  price: 390,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 83,
  name: "BODY SPRAY FOGG (BLACK) MARCO (PK)",
  price: 949,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "B"
}, {
  id: 84,
  name: "BODY SPRAY FOGG (DARK BLUE) ROYAL",
  price: 949,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 85,
  name: "BODY SPRAY FOGG (GREEN) VICTOR",
  price: 949,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 86,
  name: "BODY SPRAY FOGG (LIGHT,BLUE) IMPERIAL",
  price: 949,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 87,
  name: "BODY SPRAY FOGG (LIGHT,GREEN) MAJESTIC",
  price: 949,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 88,
  name: "BODY SPRAY FOGG (MEHROON) MONARCH",
  price: 949,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "B"
}, {
  id: 89,
  name: "BODY SPRAY FOGG (PURPLE) PARADISE",
  price: 949,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 90,
  name: "BODY SPRAY FOGG (RED) NAPOLEON",
  price: 949,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 91,
  name: "BODY SPRAY FOGG MASTER (WHITE) OAK",
  price: 949,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 92,
  name: "BODY SPRAY FOGG SMALL (MINI)",
  price: 190,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "B"
}, {
  id: 93,
  name: "BODY SPRAY HAVOC GERMANY (GOLD)",
  price: 980,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 94,
  name: "BODY SPRAY HAVOC GERMANY (SILVER)",
  price: 980,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "B"
}, {
  id: 95,
  name: "BODY SPRAY J. (OUD)",
  price: 749,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 96,
  name: "BODY SPRAY J. (ZARAR)",
  price: 749,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 97,
  name: "BODY SPRAY JANAN",
  price: 749,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 98,
  name: "BODY SPRAY LUMANI",
  price: 830,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 99,
  name: "BODY SPRAY LUMANI DO IT",
  price: 830,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 100,
  name: "BODY SPRAY MARKHOR (MIX) RP,625",
  price: 690,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 101,
  name: "BODY SPRAY MARQUIS (MEHROON)",
  price: 699,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 102,
  name: "BODY SPRAY ONE MAN SHOW (BLACK)",
  price: 790,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 105,
  name: "BODY SPRAY PURE BLACK",
  price: 590,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "B"
}, {
  id: 106,
  name: "BODY SPRAY RASSASI BLUE LADY",
  price: 880,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 107,
  name: "BODY SPRAY RASSASI BLUE MEN",
  price: 880,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 110,
  name: "BODY SPRAY RASSASI EMOTION (MEN)",
  price: 880,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 111,
  name: "BODY SPRAY RASSASI EMOTION (WOMEN)",
  price: 880,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 113,
  name: "BODY SPRAY RASSASI HOPE (MEN)",
  price: 880,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 117,
  name: "BODY SPRAY RASSASI ROMANCE (MEN)",
  price: 880,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 118,
  name: "BODY SPRAY RASSASI ROMANCE (WOMEN)",
  price: 880,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 119,
  name: "BODY SPRAY RASSASI ROYAL BLACK",
  price: 880,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 120,
  name: "BODY SPRAY RASSASI ROYAL BLUE",
  price: 880,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 121,
  name: "BODY SPRAY RASSASI ROYAL PINK (W,M)",
  price: 880,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 122,
  name: "BODY SPRAY RASSASI SECRET",
  price: 880,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 123,
  name: "BODY SPRAY RASSASI TWINKLE",
  price: 880,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 124,
  name: "BODY SPRAY SHALIS (MEN)",
  price: 890,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "B"
}, {
  id: 125,
  name: "BODY SPRAY SHALIS (WOMEN)",
  price: 890,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 127,
  name: "BODY SPRAY SHE (MIX)",
  price: 490,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "B"
}, {
  id: 130,
  name: "BODY SPRAY UDV (LARGE) BLACK (SILVER)",
  price: 880,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 132,
  name: "BODY SPRAY YARDLEY (MIX)",
  price: 1,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 133,
  name: "BRUSH CHILD CHOFN (CAR)",
  price: 110,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 134,
  name: "BRUSH COBOR",
  price: 60,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 135,
  name: "BRUSH COLGATE (WITH CAP) IMP",
  price: 120,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 136,
  name: "BRUSH HAIR (CHAMCHA)",
  price: 175,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "B"
}, {
  id: 137,
  name: "BRUSH HAIR (THAPA) GOOD QUALITY",
  price: 195,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "B"
}, {
  id: 139,
  name: "BRUSH ORAL-B (WITH CAP)",
  price: 150,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 140,
  name: "BRUSH SENSODYNE (STAND+CAP) SOFT",
  price: 170,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 141,
  name: "BRUSH SHAVING (GOOD QUALITY)",
  price: 190,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "B"
}, {
  id: 142,
  name: "BRUSH SUREE PLASTIC PACKING SINGLE (NYLON TAR) BLACK",
  price: 120,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 143,
  name: "BRUSH SUREE PLASTIC PACKING SINGLE (NYLON TAR) WHITE",
  price: 120,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "B"
}, {
  id: 144,
  name: "BRUSH TYR HANDLE",
  price: 70,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 145,
  name: "BRUSH TYR SADA",
  price: 70,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 146,
  name: "BRYLCREEM (MEDIUM) (ORIGINAL) RED",
  price: 580,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 148,
  name: "BUTTERFLY PAD ALWAYS DARK BLUE RS,480",
  price: 430,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 151,
  name: "BUTTERFLY PAD ALWAYS ULTRA (EXTRA LONG) RP,230",
  price: 210,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 152,
  name: "BUTTERFLY PAD ALWAYS ULTRA (LONG) RP,230",
  price: 210,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 153,
  name: "BUTTERFLY PAD MAXI THICK (EXTRA LONG 8PCS) RP,340",
  price: 310,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 154,
  name: "BUTTERFLY PAD MAXI THICK (LONG 9PCS) RP,340",
  price: 310,
  categoryId: "personalcare",
  categoryName: "Personal Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "B"
}, {
  id: 155,
  name: "CELL CAMELION LONGER LASTING AA",
  price: 50,
  categoryId: "lock",
  categoryName: "Lock & Cells"
}, {
  id: 156,
  name: "CELL DOUBLE CHARGER AA",
  price: 30,
  categoryId: "lock",
  categoryName: "Lock & Cells"
}, {
  id: 157,
  name: "CELL DOUBLE CHARGER AAA",
  price: 30,
  categoryId: "lock",
  categoryName: "Lock & Cells"
}, {
  id: 158,
  name: "CELL POWER PLUS AA",
  price: 30,
  categoryId: "lock",
  categoryName: "Lock & Cells",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "C"
}, {
  id: 159,
  name: "CELL TOSHIBA AA (BLACK)",
  price: 35,
  categoryId: "lock",
  categoryName: "Lock & Cells"
}, {
  id: 161,
  name: "CELL TOSHIBA AA (RED)",
  price: 35,
  categoryId: "lock",
  categoryName: "Lock & Cells"
}, {
  id: 162,
  name: "CELL TOSHIBA AAA (BLACK)",
  price: 35,
  categoryId: "lock",
  categoryName: "Lock & Cells"
}, {
  id: 163,
  name: "CELL TOSHIBA AAA (RED)",
  price: 35,
  categoryId: "lock",
  categoryName: "Lock & Cells",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "C"
}, {
  id: 165,
  name: "CELL TOSHIBA SIZE (D)",
  price: 140,
  categoryId: "lock",
  categoryName: "Lock & Cells"
}, {
  id: 167,
  name: "CHEERY POLISH (BLACK) LARGE RS,650",
  price: 590,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "C"
}, {
  id: 168,
  name: "CHEERY POLISH (BLACK) SMALL RS,325",
  price: 300,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "C"
}, {
  id: 169,
  name: "CHEERY POLISH (BROWN) LARGE RS,650",
  price: 590,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "C"
}, {
  id: 170,
  name: "CHEERY POLISH (BROWN) SMALL RS,325",
  price: 300,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "C"
}, {
  id: 171,
  name: "COBRA INSIST KILLER SPRAY 300ml",
  price: 0,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito"
}, {
  id: 172,
  name: "COBRA INSIST KILLER SPRAY 400ml",
  price: 0,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito"
}, {
  id: 173,
  name: "COBRA INSIST KILLER SPRAY 500ml",
  price: 0,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito"
}, {
  id: 174,
  name: "COBRA INSIST KILLER SPRAY 600ml",
  price: 0,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito"
}, {
  id: 175,
  name: "COFFEE SACHET (60 PCS)",
  price: 40,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "C"
}, {
  id: 177,
  name: "COLOUR BLACK ROSE # 43",
  price: 190,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 178,
  name: "COLOUR BLACK ROSE 45 # RS,220",
  price: 190,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "C"
}, {
  id: 183,
  name: "COLOUR GARNIER (ALL COLOURS) RS,1099",
  price: 899,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 184,
  name: "COLOUR GARNIER SACHET (NATURAL BLACK) RS,199",
  price: 185,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "C"
}, {
  id: 187,
  name: "COLOUR GODREJ SACHET (DARK,BROWN)",
  price: 70,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "C"
}, {
  id: 188,
  name: "COLOUR GODREJ SACHET (NATURAL BROWN)",
  price: 70,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "C"
}, {
  id: 189,
  name: "COLOUR HELLO HAIR (# 03 DARK BROWN)",
  price: 250,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "C"
}, {
  id: 190,
  name: "COLOUR JUST FOR MEN (DARK BROWN ) HAIR",
  price: 1849,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 191,
  name: "COLOUR JUST FOR MEN (BLACK) BEARD",
  price: 1849,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 192,
  name: "COLOUR KALA KOLA HAIR # 02 LARGE (M,BROWN)",
  price: 190,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 206,
  name: "COLOUR OLIVIA (ALL COLOURS) RS,300",
  price: 260,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "C"
}, {
  id: 207,
  name: "COLOUR POLY (# 43) RS,320",
  price: 290,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "C"
}, {
  id: 208,
  name: "COLOUR PRIMA HAIR (# 43 BROWN) RS,80",
  price: 60,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "C"
}, {
  id: 209,
  name: "COLOUR PRIMA HAIR (# 45 BLACK) RS,80",
  price: 60,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "C"
}, {
  id: 219,
  name: "COLOUR REVLON REGULAR (ALL COLOURS) (LARGE)",
  price: 790,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "C"
}, {
  id: 221,
  name: "COLOUR SAMSOLE (# 43 DARK BROWN) SMALL RS,160",
  price: 145,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "C"
}, {
  id: 222,
  name: "COLOUR SAMSOLE (# 45) BLACK SMALL RS,160",
  price: 145,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "C"
}, {
  id: 223,
  name: "COLOUR SAMSOLE (# 43) DARK BROWN LARGE RS,300",
  price: 260,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "C"
}, {
  id: 224,
  name: "COLOUR SAMSOLE (# 45) BLACK LARGE RS,300",
  price: 260,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "C"
}, {
  id: 225,
  name: "COLOUR WAJEE TUBE ( # 43 DARK BROWN) RS,70",
  price: 0,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 226,
  name: "COLOUR WAJEE TUBE ( # 45 BLACK) RS,70",
  price: 0,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 227,
  name: "COMBS ANTI LICE HANDLE LARGE",
  price: 80,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "C"
}, {
  id: 228,
  name: "COMBS ANTI LICE HANDLE MEDIUM",
  price: 80,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "C"
}, {
  id: 229,
  name: "COMBS CASET",
  price: 10,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "C"
}, {
  id: 230,
  name: "COMBS CRYSTAL",
  price: 25,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 231,
  name: "COMBS NEELAM",
  price: 20,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 233,
  name: "COMBS SAIRA",
  price: 10,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "C"
}, {
  id: 234,
  name: "CONDOM DO (RED)",
  price: 190,
  categoryId: "condemn",
  categoryName: "Condoms"
}, {
  id: 235,
  name: "CONDOM DO BLACK",
  price: 190,
  categoryId: "condemn",
  categoryName: "Condoms"
}, {
  id: 236,
  name: "CONDOM DUREX 3 IN 1 DIBI",
  price: 0,
  categoryId: "condemn",
  categoryName: "Condoms"
}, {
  id: 237,
  name: "CONDOM HAPPY LIFE (3 IN 1)",
  price: 70,
  categoryId: "condemn",
  categoryName: "Condoms"
}, {
  id: 238,
  name: "CONDOM JOSH (BLUE) DELAY",
  price: 100,
  categoryId: "condemn",
  categoryName: "Condoms",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "C"
}, {
  id: 239,
  name: "CONDOM KLIMAX (ECSTASY) ORIGINAL IMP",
  price: 190,
  categoryId: "condemn",
  categoryName: "Condoms"
}, {
  id: 240,
  name: "CONDOM NIGHT RIDER",
  price: 30,
  categoryId: "condemn",
  categoryName: "Condoms"
}, {
  id: 242,
  name: "CONDOM SATHI (MENTHOL)",
  price: 90,
  categoryId: "condemn",
  categoryName: "Condoms"
}, {
  id: 243,
  name: "CONDOM SATHI (RED)",
  price: 80,
  categoryId: "condemn",
  categoryName: "Condoms"
}, {
  id: 244,
  name: "CONDOM SATHI BOX RS,90",
  price: 80,
  categoryId: "condemn",
  categoryName: "Condoms",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "C"
}, {
  id: 245,
  name: "CONDOM TOUCH (BLUE) PACK 3 IN 1",
  price: 149,
  categoryId: "condemn",
  categoryName: "Condoms",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "C"
}, {
  id: 246,
  name: "CONDOM TOUCH (GREEN) 3IN 1",
  price: 90,
  categoryId: "condemn",
  categoryName: "Condoms",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "C"
}, {
  id: 247,
  name: "CONDOM TOUCH (RED)",
  price: 100,
  categoryId: "condemn",
  categoryName: "Condoms"
}, {
  id: 249,
  name: "CONDITIONER LOREAL (BLACK) RS,550",
  price: 499,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "C"
}, {
  id: 250,
  name: "CONDITIONER LOREAL (DREAM LONG) RS,550",
  price: 510,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "C"
}, {
  id: 251,
  name: "CONDITIONER LOREAL (GOLDEN) RS,550",
  price: 510,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "C"
}, {
  id: 252,
  name: "CONDITIONER LOREAL (HYALURON MOISTURE) BLUE RS,620",
  price: 570,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "C"
}, {
  id: 254,
  name: "CONDITIONER LOREAL (RED) RS,550",
  price: 510,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "C"
}, {
  id: 255,
  name: "CONDITIONER LOREAL (WHITE) RS,540",
  price: 510,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "C"
}, {
  id: 256,
  name: "CONDITIONER MECLAY (BLACK)",
  price: 370,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "C"
}, {
  id: 257,
  name: "CONDITIONER MECLAY (GOLDEN)",
  price: 370,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "C"
}, {
  id: 258,
  name: "CONDITIONER MECLAY (ORANGE)",
  price: 370,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "C"
}, {
  id: 259,
  name: "CONDITIONER MECLAY (PINK)",
  price: 370,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "C"
}, {
  id: 261,
  name: "CONDITIONER MECLAY (PP)",
  price: 370,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "C"
}, {
  id: 262,
  name: "CONDITIONER MECLAY (RED)",
  price: 370,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "C"
}, {
  id: 263,
  name: "CONDITIONER MECLAY (WHITE)",
  price: 370,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "C"
}, {
  id: 265,
  name: "CONDITIONER SUNSILK (COMPANY) BLACK RS,530",
  price: 490,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 266,
  name: "CONDITIONER TRESEMME (IMP) 175ml KERATIN",
  price: 500,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 267,
  name: "CONDITIONER TRESEMME 400ml (MIX)",
  price: 840,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "C"
}, {
  id: 269,
  name: "COTTON BUD DIBI 100 PIECESS (WOOD)",
  price: 80,
  categoryId: "personalcare",
  categoryName: "Personal Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "C"
}, {
  id: 270,
  name: "COTTON BUD (PACKET) PLASTIC",
  price: 30,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 271,
  name: "COTTON BUD (PACKET) WOOD",
  price: 30,
  categoryId: "personalcare",
  categoryName: "Personal Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "C"
}, {
  id: 272,
  name: "COTTON BUD (PKT) WOOD (100 PIECES) TOP TIP",
  price: 90,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 273,
  name: "COTTON BUD DIBI (PLASTIC) 100 PIECESS TOP TIP",
  price: 120,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 274,
  name: "COTTON BUD DIBI (WOOD) 100 PIECESS BLUE TOP TIP",
  price: 120,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "C"
}, {
  id: 278,
  name: "CREAM AJOOBA",
  price: 340,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "C"
}, {
  id: 279,
  name: "CREAM ARCHI PERL THAILAND",
  price: 130,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "C"
}, {
  id: 280,
  name: "CREAM ARENA (HAND & FOOT) RS,360",
  price: 295,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 281,
  name: "CREAM ARINA GOLD RS,350",
  price: 295,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 282,
  name: "CREAM ARINA GOLD (MEN) RP,350",
  price: 295,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 284,
  name: "CREAM B N B BEAUTY",
  price: 590,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 285,
  name: "CREAM BAREERA GOLD RS,375",
  price: 295,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 286,
  name: "CREAM BIO COS RP,375",
  price: 299,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "C"
}, {
  id: 287,
  name: "CREAM BLASSO BLEACH (BOX) RS,40",
  price: 35,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "C"
}, {
  id: 288,
  name: "CREAM BLASSO BLEACH 25g",
  price: 80,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 289,
  name: "CREAM CARE BLEACH (BOX) ALOE VERA (ORIGINAL) RS,40",
  price: 35,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "C"
}, {
  id: 290,
  name: "CREAM CHARISMA HAND & FOOT",
  price: 395,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 291,
  name: "CREAM DEEP HEAT 70G TUBE",
  price: 790,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 292,
  name: "CREAM DUE WHITENING RS,350",
  price: 295,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 293,
  name: "CREAM EU JAR (LARGE) RS,350",
  price: 300,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 295,
  name: "CREAM EU JAR (MEDIUM) RS,220",
  price: 200,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 296,
  name: "CREAM EU TUBE (LARGE) RS,250",
  price: 220,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 297,
  name: "CREAM EU TUBE (SMALL) RS,160",
  price: 145,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "C"
}, {
  id: 298,
  name: "CREAM EU TUBE 75g (MEDIUM) RS,320",
  price: 290,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 299,
  name: "CREAM FACE FRESH (LARGE) RS,360",
  price: 295,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "C"
}, {
  id: 300,
  name: "CREAM FACE FRESH CLEANSER (LARGE)",
  price: 360,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "C"
}, {
  id: 301,
  name: "CREAM FACE FRESH GOLD (LARGE) RS,360",
  price: 295,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 302,
  name: "CREAM FAIR & HANDSOME (LARGE)",
  price: 390,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 303,
  name: "CREAM FAIR & HANDSOME (SMALL)",
  price: 280,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 304,
  name: "CREAM FAIR MENZ (LARGE) RS,250",
  price: 230,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 305,
  name: "CREAM FAIZA BEAUTY SMALL RS,375",
  price: 320,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 306,
  name: "CREAM GLUPATONE",
  price: 350,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 307,
  name: "CREAM GLUTA WHITE",
  price: 390,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "C"
}, {
  id: 310,
  name: "CREAM GOLDEN PEARL RS,360",
  price: 290,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "C"
}, {
  id: 311,
  name: "CREAM GORI RS,550",
  price: 420,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 312,
  name: "CREAM JHALAK RS,360",
  price: 295,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 314,
  name: "CREAM M BETNOVATE RP,180.62",
  price: 175,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 315,
  name: "CREAM M DERMO VATE RP,199.06",
  price: 194,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 316,
  name: "CREAM M ITCH GUARD 25g",
  price: 150,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 317,
  name: "CREAM M MOOV 25g",
  price: 120,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "C"
}, {
  id: 318,
  name: "CREAM NEW GOLDEN STAR RP,400",
  price: 330,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 319,
  name: "CREAM NIVEA (BLUE) 60ml",
  price: 470,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 320,
  name: "CREAM NIVEA SOFT 100ml",
  price: 690,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 321,
  name: "CREAM NIVEA SOFT 50ML",
  price: 380,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "C"
}, {
  id: 322,
  name: "CREAM NO MARKS RS,350",
  price: 320,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "C"
}, {
  id: 323,
  name: "CREAM OLIVIA BLEACH HERBAL RS,70",
  price: 65,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 324,
  name: "CREAM OLIVIA BLEACH RS,80",
  price: 70,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 325,
  name: "CREAM PARLEY BEAUTY BLACK RS 400",
  price: 330,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "C"
}, {
  id: 326,
  name: "CREAM PARLEY BLEACH SACHET BLACK RS,70",
  price: 60,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "C"
}, {
  id: 327,
  name: "CREAM PARLEY URGENT FACIAL SACHET",
  price: 60,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 329,
  name: "CREAM PONDS BB (MEDIUM) 18g",
  price: 840,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "C"
}, {
  id: 330,
  name: "CREAM PONDS BB (SMALL) 9g",
  price: 490,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "C"
}, {
  id: 331,
  name: "CREAM PONDS JAR LARGE COMPANY RS,450",
  price: 430,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 332,
  name: "CREAM ROOP SINGHAR",
  price: 340,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 333,
  name: "CREAM KELLY PEARL",
  price: 130,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "C"
}, {
  id: 334,
  name: "CREAM MENA FACIAL",
  price: 130,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 335,
  name: "CREAM YOKO WHITENING",
  price: 130,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "C"
}, {
  id: 336,
  name: "CREAM SANDAL RP,360",
  price: 295,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 337,
  name: "CREAM SEVEN HERBAL UBTAN RS,170",
  price: 160,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 338,
  name: "CREAM SEVEN HERBAL UBTAN RS,260",
  price: 240,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 339,
  name: "CREAM SHAVING ADMIRAL",
  price: 200,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades"
}, {
  id: 340,
  name: "CREAM SHAVING DIPLOMAT RS,200",
  price: 190,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades"
}, {
  id: 341,
  name: "CREAM SHAVING JOLLY",
  price: 180,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades"
}, {
  id: 342,
  name: "CREAM SHAVING TOUCH ME RS,230",
  price: 210,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades"
}, {
  id: 343,
  name: "CREAM SHEESHA BEAUTY CREAM RP,360",
  price: 295,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 344,
  name: "CREAM SIA GOLD RP,360",
  price: 295,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 347,
  name: "CREAM SUDO 125GM (ORIGINAL)",
  price: 1550,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 348,
  name: "CREAM SUDO 60GM (ORIGINAL)",
  price: 1150,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 349,
  name: "CREAM TIBET COLD (LARGE) RS,250",
  price: 235,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 350,
  name: "CREAM TIBET COLD (SMALL) RS,180",
  price: 170,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "C"
}, {
  id: 351,
  name: "CREAM TIBET SNOW RS,230",
  price: 220,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "C"
}, {
  id: 352,
  name: "CREAM WHITE GOLD (BLACK) RS,400",
  price: 290,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 353,
  name: "CREAM WHITE GOLD (ORANGE) RS,400",
  price: 290,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 354,
  name: "CREAM WHITE GOLD (PAPIYA) RS,400",
  price: 290,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 355,
  name: "DABUR AMLA HAIR OIL (DUBAI) 100ml RS,360",
  price: 330,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "D"
}, {
  id: 356,
  name: "DABUR AMLA HAIR OIL (DUBAI) 300ML RS,880",
  price: 795,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "D"
}, {
  id: 357,
  name: "DABUR AMLA HAIR OIL (DUBAI) 50ml RS,180",
  price: 170,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "D"
}, {
  id: 358,
  name: "DABUR RED PASTE (LARGE)",
  price: 430,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 359,
  name: "DABUR RED PASTE (SMALL)",
  price: 235,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "D"
}, {
  id: 360,
  name: "DENTONIC POWDER BOX (MEDIUM)",
  price: 75,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "D"
}, {
  id: 362,
  name: "DETTOL PANI 50ML (SMALL) RP,250",
  price: 220,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "D"
}, {
  id: 363,
  name: "DOLLAR GEL PEN (BLACK)",
  price: 40,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 364,
  name: "DOLLAR GEL PEN (BLUE)",
  price: 40,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 365,
  name: "DOLLAR GEL PEN (GREEN)",
  price: 40,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 366,
  name: "DOLLAR GEL PEN (RED)",
  price: 40,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 367,
  name: "DOLLAR PEN (CLIPPER) BLACK",
  price: 18,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 368,
  name: "DOLLAR PEN (CLIPPER) BLUE",
  price: 18,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "D"
}, {
  id: 370,
  name: "DOLLAR PEN (CLIPPER) RED",
  price: 18,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 371,
  name: "DOLLAR POINTER (BLACK)",
  price: 30,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 372,
  name: "DOLLAR POINTER (BLUE)",
  price: 0,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 373,
  name: "DOOZ SPRAY 14000",
  price: 1150,
  categoryId: "condemn",
  categoryName: "Condoms"
}, {
  id: 374,
  name: "DUREX TESTER SMALL",
  price: 50,
  categoryId: "condemn",
  categoryName: "Condoms"
}, {
  id: 375,
  name: "DORCO RAZOR",
  price: 190,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "D"
}, {
  id: 377,
  name: "DUREX LUBE LARGE",
  price: 1050,
  categoryId: "condemn",
  categoryName: "Condoms"
}, {
  id: 378,
  name: "DUREX LUBE SMALL",
  price: 890,
  categoryId: "condemn",
  categoryName: "Condoms"
}, {
  id: 379,
  name: "ELFY JIMSA BOTTLE 20GM",
  price: 140,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "E"
}, {
  id: 380,
  name: "ELFY JIMSA BOX",
  price: 25,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "E"
}, {
  id: 381,
  name: "EMAMI 7 OILS IN ONE 100ML",
  price: 430,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 382,
  name: "EMAMI 7 OILS IN ONE 200ML",
  price: 730,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 383,
  name: "EMERGENCY LIGHT (LARGE)",
  price: 1200,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 384,
  name: "EMERGENCY LIGHT (MEDIUM)",
  price: 850,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 385,
  name: "EMERGENCY LIGHT (SMALL)",
  price: 650,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 386,
  name: "ENGLISH PRICKLY HEAT CREAM LARGE RS,270",
  price: 240,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "E"
}, {
  id: 387,
  name: "ERASER ORO",
  price: 10,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 397,
  name: "F & L BB CREAM 18g (MEDIUM) IMP",
  price: 590,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 398,
  name: "F & L BB CREAM 9g (SMALL) IMP",
  price: 350,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 399,
  name: "F & L M,V FACE WASH (SMALL) COMPANY RS.199",
  price: 190,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "F"
}, {
  id: 400,
  name: "F & L M,V JAR RP,450",
  price: 395,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "F"
}, {
  id: 403,
  name: "F & L M,V TUBE (SMALL) GLOW RS,170",
  price: 160,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "F"
}, {
  id: 404,
  name: "F & L M V FACE WASH (LARGE) COMPANY RS,380",
  price: 190,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "F"
}, {
  id: 407,
  name: "FACE WASH ACNI-PLUS",
  price: 490,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "F"
}, {
  id: 411,
  name: "FACE WASH B N B BRIGHTENING RICE",
  price: 640,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 412,
  name: "FACE WASH B N B CLEANSER",
  price: 640,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 414,
  name: "FACE WASH CLEAN & CLEAR (SMALL)",
  price: 299,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "F"
}, {
  id: 415,
  name: "FACE WASH DOVE (LARGE) (BLUE)",
  price: 590,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 416,
  name: "FACE WASH DOVE (LARGE) (GREEN)",
  price: 590,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 417,
  name: "FACE WASH DOVE (LARGE) (PINK)",
  price: 0,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 418,
  name: "FACE WASH FAIR MENZ (MIX) RP,210",
  price: 195,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "F"
}, {
  id: 419,
  name: "FACE WASH GARNIER ( LARGE)  ACNO FIGHT RP,949",
  price: 835,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 420,
  name: "FACE WASH GARNIER (LARGE)  OIL CLEAR RS,949",
  price: 835,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 421,
  name: "FACE WASH GARNIER (LARGE)  POWER WHITE RS,949",
  price: 835,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 422,
  name: "FACE WASH GARNIER (LARGE) SAKURE WHITE",
  price: 690,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 423,
  name: "FACE WASH GARNIER (LARGE) TURBO LIGHT WHITE+OIL CONTROL",
  price: 890,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 424,
  name: "FACE WASH GARNIER (LARGE) WOMEN (NEEM) PURE ACTIVE RS,649",
  price: 590,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 425,
  name: "FACE WASH GARNIER (LARGE) WOMEN (VITAMIN C) RP,619",
  price: 570,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "F"
}, {
  id: 426,
  name: "FACE WASH GARNIER (SMALL)  ACNO FIGHT RS,519",
  price: 470,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 427,
  name: "FACE WASH GARNIER (SMALL) OIL CLEAR RS,519",
  price: 470,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "F"
}, {
  id: 428,
  name: "FACE WASH GARNIER (SMALL) POWER WHITE RS,519",
  price: 470,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "F"
}, {
  id: 429,
  name: "FACE WASH GARNIER (SMALL) WOMEN (NEEM) RS,369",
  price: 340,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 430,
  name: "FACE WASH GARNIER (SMALL) WOMEN VITAMIN C RS,369",
  price: 340,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "F"
}, {
  id: 431,
  name: "FACE WASH GOLDEN PEARL (ACNO CLEAR)",
  price: 230,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 432,
  name: "FACE WASH GOLDEN PEARL (OIL & CONTROL)",
  price: 230,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 433,
  name: "FACE WASH GOLDEN PEARL (FLAWLESS SKIN)",
  price: 230,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 434,
  name: "FACE WASH GOLDEN PEARL (LIGHT & GLOW)",
  price: 230,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 435,
  name: "FACE WASH GOLDEN PEARL (GREEN) HERBAL",
  price: 230,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 436,
  name: "FACE WASH GOLDEN PEARL (TEA & TREE) ",
  price: 230,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 437,
  name: "FACE WASH GOLDEN PEARL (WHITE & BEAUTY)",
  price: 230,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 438,
  name: "FACE WASH GOLDEN PEARL (MEN)",
  price: 230,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 439,
  name: "FACE WASH GOLDEN PEARL (OIL CONTROL) LARGE",
  price: 450,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 440,
  name: "FACE WASH GOLDEN PEARL (FLAWLESS SKIN) LARGE",
  price: 450,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "F"
}, {
  id: 441,
  name: "FACE WASH GOLDEN PEARL (LIGHT & GLOW) LARGE",
  price: 450,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "F"
}, {
  id: 442,
  name: "FACE WASH GOLDEN PEARL (VITAMIN C) LARGE",
  price: 450,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 443,
  name: "FACE WASH GOLDEN PEARL (WHITE BEAUTY) LARGE",
  price: 450,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 444,
  name: "FACE WASH GOLDEN PEARL (DAILY FOAMING) LARGE",
  price: 450,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 445,
  name: "FACE WASH GOLDEN PEARL (HERBAL) LARGE",
  price: 450,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 446,
  name: "FACE WASH GOLDEN PEARL (WHITE BEAUTY) LARGE",
  price: 450,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 447,
  name: "FACE WASH GOLDEN PEARL (MEN) LARGE",
  price: 450,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 448,
  name: "FACE WASH HIMALAYA (LARGE) NEEM DUBAI RS,510",
  price: 460,
  categoryId: "others",
  categoryName: "Others"
}, {
  id: 449,
  name: "FACE WASH HIMALAYA (SMALL) DUBAI RS,310",
  price: 280,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "F"
}, {
  id: 450,
  name: "FACE WASH JHALAK",
  price: 180,
  categoryId: "others",
  categoryName: "Others"
}, {
  id: 451,
  name: "FACE WASH JUNSUI LARGE (BLACK)",
  price: 570,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "F"
}, {
  id: 452,
  name: "FACE WASH JUNSUI LARGE (ICE COOL)",
  price: 570,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 453,
  name: "FACE WASH JUNSUI LARGE (GREEN) NEEM",
  price: 570,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 455,
  name: "FACE WASH JUNSUI LARGE (L,GREEN COOL)",
  price: 570,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 456,
  name: "FACE WASH JUNSUI LARGE (PINK)",
  price: 570,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 457,
  name: "FACE WASH JUNSUI LARGE (RED) PIMPLE FIGHTING",
  price: 570,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 458,
  name: "FACE WASH JUNSUI LARGE ORANGE",
  price: 570,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 459,
  name: "FACE WASH MEC (ALOE VERA)",
  price: 390,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "F"
}, {
  id: 460,
  name: "FACE WASH MEC (BLACK CHARCOAL)",
  price: 390,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "F"
}, {
  id: 461,
  name: "FACE WASH MEC (PINK)",
  price: 390,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "F"
}, {
  id: 462,
  name: "FACE WASH MEC (ACNE CLEAN)",
  price: 390,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 463,
  name: "FACE WASH MEC (RICE BRIGHTENING)",
  price: 390,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 464,
  name: "FACE WASH MEC (LEMON)",
  price: 390,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 466,
  name: "FACE WASH PARLEY BLACK RS,300",
  price: 270,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "F"
}, {
  id: 467,
  name: "FACE WASH PONDS (IMP) ACNE SOLUTION",
  price: 450,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "F"
}, {
  id: 468,
  name: "FACE WASH PONDS (IMP) ACNE SOLUTION (SMALL)",
  price: 270,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "F"
}, {
  id: 469,
  name: "FACE WASH PONDS (IMP) BLACK (ACTIVATED CHARCOAL) LARGE",
  price: 450,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "F"
}, {
  id: 470,
  name: "FACE WASH PONDS (IMP) BLACK (ACTIVATED CHARCOAL) SMALL",
  price: 270,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "F"
}, {
  id: 471,
  name: "FACE WASH PONDS (IMP) FLAWLESS WHITE",
  price: 590,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 472,
  name: "FACE WASH PONDS (IMP) SUN DULLNESS (SCRUB)",
  price: 460,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "F"
}, {
  id: 473,
  name: "FACE WASH PONDS (IMP) WHITE BEAUTY (PINK)",
  price: 450,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "F"
}, {
  id: 474,
  name: "FACE WASH PONDS (IMP) WHITE BEAUTY (SMALL)",
  price: 270,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "F"
}, {
  id: 475,
  name: "FACE WASH PONDS LARGE (COMPANY) BLACK RP,490",
  price: 450,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 476,
  name: "FACE WASH PONDS LARGE (COMPANY) PINK RP,490",
  price: 450,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 477,
  name: "FACE WASH PONDS SMALL (COMPANY) BLACK RP,300",
  price: 270,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 478,
  name: "FACE WASH PONDS SMALL (COMPANY) PINK RS,300",
  price: 270,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 479,
  name: "FACE WASH PONDS MEN IMP (ACNE SOLUTION) LARGE",
  price: 590,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 480,
  name: "FACE WASH PONDS MEN IMP (ENERGY CHARGE) LARGE",
  price: 590,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 481,
  name: "FACE WASH PONDS MEN IMP (LIGHTNING OIL CLEAR) LARGE",
  price: 590,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 482,
  name: "FACE WASH PONDS MEN IMP (POLLUTION OUT) LARGE",
  price: 590,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 483,
  name: "FACE WASH PONDS MEN IMP (POWER CLEAR) LARGE",
  price: 590,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 484,
  name: "FACE WASH PONDS MEN IMP (WHITE BOOST) LARGE",
  price: 590,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 485,
  name: "FACE WASH RIVAJ LEMON (LARGE)",
  price: 310,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 486,
  name: "FACE WASH RIVAJ NEEM (LARGE)",
  price: 310,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 487,
  name: "FACE WASH SAEED GHANI VITAMIN C",
  price: 490,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 488,
  name: "FACE WASH SYED GHANI CHARCOAL",
  price: 490,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 489,
  name: "FACE WASH SYED GHANI GOAT MILK",
  price: 490,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 490,
  name: "FACE WASH RIVAJ LEMON (SMALL)",
  price: 175,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 491,
  name: "FACE WASH RIVAJ NEEM (SMALL)",
  price: 175,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "F"
}, {
  id: 492,
  name: "FACE WASH Y,C (LARGE) COCUMBER",
  price: 470,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "F"
}, {
  id: 493,
  name: "FACE WASH Y,C (LARGE) NEEM GREEN",
  price: 470,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 494,
  name: "FACE WASH Y,C (LARGE) YELLOW LEMON",
  price: 470,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "F"
}, {
  id: 495,
  name: "FACE WASH Y,C (LARGE) COW MILK EXTRACT",
  price: 470,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "F"
}, {
  id: 496,
  name: "FACE WASH Y,C (SMALL) COW MILK EXTRACT",
  price: 320,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "F"
}, {
  id: 497,
  name: "FACE WASH Y,C (SMALL) COCUMBER",
  price: 320,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 499,
  name: "FACE WASH Y,C (SMALL) NEEM GREEN",
  price: 320,
  categoryId: "facewash",
  categoryName: "Face Wash"
}, {
  id: 500,
  name: "FACE WASH Y,C (SMALL) YELLOW LEMON",
  price: 320,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "F"
}, {
  id: 502,
  name: "FEEDER (LARGE NIPPLE) LARGE",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 503,
  name: "FEEDER (LARGE NIPPLE) MEDIUM",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 504,
  name: "FEEDER GLASS LARGE",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 505,
  name: "FEEDER GLASS MEDIUM",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 506,
  name: "FEEDER GLASS SMALL",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 507,
  name: "FEEDER MINI TREE (LARGE)",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 508,
  name: "FEEDER MINI TREE (MEDIUM)",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 509,
  name: "FEEDER MINI TREE (SMALL)",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 510,
  name: "FEEDER PP (IMP) HANDLE LARGE",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "F"
}, {
  id: 511,
  name: "FEEDER PP (IMP) HANDLE MEDIUM",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "F"
}, {
  id: 512,
  name: "FEEDER PURE LOVE COLOR (LARGE)",
  price: 280,
  categoryId: "babycare",
  categoryName: "Baby Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "F"
}, {
  id: 513,
  name: "FORHANS HAIR TONIC 100ML (BLUE) RS,320",
  price: 310,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "F"
}, {
  id: 514,
  name: "FORHANS HAIR TONIC 100ML (RED) RS,320",
  price: 310,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 515,
  name: "FORHANS HAIR TONIC 200ml (RED) RP,550",
  price: 520,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 516,
  name: "GATS BY GEL (MEDIUM) MIX",
  price: 490,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 519,
  name: "4ME FOAM (LARGE) MIX",
  price: 380,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 520,
  name: "GILLETTE BLUE 2 PLUS",
  price: 140,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "G"
}, {
  id: 521,
  name: "GILLETTE FOAM 200ml (GREEN)",
  price: 860,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "G"
}, {
  id: 522,
  name: "GILLETTE FOAM 200ml (BLUE)",
  price: 860,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades"
}, {
  id: 523,
  name: "GILLETTE FOAM 200ml (RED)",
  price: 860,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "G"
}, {
  id: 524,
  name: "GILLETTE FOAMY (50gm) SMALL (MIX)",
  price: 445,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades"
}, {
  id: 525,
  name: "GILLETTE GEL (LARGE) MIX",
  price: 940,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "G"
}, {
  id: 526,
  name: "GILLETTE GEL (Small) MIX",
  price: 640,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "G"
}, {
  id: 528,
  name: "GOLDEN PEARL SKIN POLISHING",
  price: 160,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 529,
  name: "GOLDEN PEARL URGENT FACIAL",
  price: 50,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "G"
}, {
  id: 530,
  name: "GOLDEN PEARL URGENT FACIAL (FRUIT)",
  price: 50,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 534,
  name: "HAPPY BIRTHDAY SPELLING",
  price: 220,
  categoryId: "birthday",
  categoryName: "Birthday",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "H"
}, {
  id: 535,
  name: "HASHMI SORMA RS,200",
  price: 190,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "H"
}, {
  id: 536,
  name: "HIGHLIGHTER",
  price: 70,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 537,
  name: "HUDA BEAUTY BLACK MASK SACHET",
  price: 50,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 538,
  name: "HUSSAIN MANJAN BOX (MEDIUM) RS,80",
  price: 75,
  categoryId: "powders",
  categoryName: "Powders",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "H"
}, {
  id: 539,
  name: "INK BOTTLE DOLLAR (SMALL) BLACK",
  price: 60,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 540,
  name: "INK BOTTLE DOLLAR (SMALL) BLUE",
  price: 50,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "I"
}, {
  id: 541,
  name: "INK PEN DOLLAR",
  price: 70,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 542,
  name: "INK PEN PIANO CRYSTAL",
  price: 70,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 543,
  name: "INK REMOVER MARKER (ORO)",
  price: 40,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "I"
}, {
  id: 544,
  name: "INK REMOVER WHITENER",
  price: 70,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "I"
}, {
  id: 545,
  name: "J BABY BATH 200ML TOP TO TOE",
  price: 549,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 548,
  name: "J BABY LINER",
  price: 50,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 549,
  name: "J BABY LOTION 100ml (IMP)",
  price: 490,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 550,
  name: "J BABY LOTION 200ml (IMP)",
  price: 690,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 551,
  name: "J BABY OIL 125ml (IMP)",
  price: 650,
  categoryId: "babycare",
  categoryName: "Baby Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "J"
}, {
  id: 552,
  name: "J BABY OIL 200ml (IMP)",
  price: 840,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 553,
  name: "J BABY OIL 50ml (IMP)",
  price: 320,
  categoryId: "babycare",
  categoryName: "Baby Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "J"
}, {
  id: 554,
  name: "J BABY PERFUME COLOGNE",
  price: 690,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 555,
  name: "J BABY PETROLEUM GEL (PINK) SMALL",
  price: 490,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 556,
  name: "J BABY PETROLEUM GEL (BLUE) SMALL",
  price: 490,
  categoryId: "babycare",
  categoryName: "Baby Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "J"
}, {
  id: 557,
  name: "J BABY POWDER 100g (MIX)",
  price: 590,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 558,
  name: "J BABY POWDER 200g (MIX)",
  price: 590,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 559,
  name: "J BABY SHAMPOO 100ml (COMPANY)",
  price: 320,
  categoryId: "babycare",
  categoryName: "Baby Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "J"
}, {
  id: 560,
  name: "J BABY SHAMPOO 200ml (COMPANY)",
  price: 590,
  categoryId: "babycare",
  categoryName: "Baby Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "J"
}, {
  id: 561,
  name: "J BABY SHAMPOO 300ml (COMPANY)",
  price: 750,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 562,
  name: "J BABY SHAMPOO 750ml (COMPANY) (PUMP)",
  price: 1780,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 563,
  name: "J BABY SOAP 100g GREEN",
  price: 240,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 564,
  name: "J BABY SOAP 100g PINK",
  price: 240,
  categoryId: "babycare",
  categoryName: "Baby Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "J"
}, {
  id: 565,
  name: "J BABY SOAP 100g WHITE",
  price: 240,
  categoryId: "babycare",
  categoryName: "Baby Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "J"
}, {
  id: 566,
  name: "J BABY TOP-TO-TOE 100ML",
  price: 350,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 567,
  name: "J BABY WIPES (LARGE 84 PIECES) GOOD QUALITY",
  price: 240,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 569,
  name: "KALA KOLA HAIR TONIC (LARGE) RS,500",
  price: 460,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 570,
  name: "KALA KOLA HAIR TONIC (SMALL) RS,300",
  price: 270,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 571,
  name: "KEHKSHAN MAHNDI (BLACK) RS,80",
  price: 70,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 572,
  name: "KEUNE COLOUR (ALL COLOURS)",
  price: 0,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 573,
  name: "KEUNE POWDER (ALL COLOURS)",
  price: 0,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 575,
  name: "KEY CHAIN (SEND PIC)",
  price: 1,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 576,
  name: "KING COIL BLAKI (LARGE)",
  price: 110,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "K"
}, {
  id: 577,
  name: "KING COIL GREEN (LARGE)",
  price: 110,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito"
}, {
  id: 578,
  name: "KING MAAT",
  price: 7,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito"
}, {
  id: 579,
  name: "KING MACHINE SET",
  price: 560,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito"
}, {
  id: 580,
  name: "KING MOSPEL",
  price: 130,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "K"
}, {
  id: 581,
  name: "KING RAT BOOK",
  price: 180,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "K"
}, {
  id: 582,
  name: "KING REFILL",
  price: 240,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito"
}, {
  id: 583,
  name: "KINGTOX SPRAY 300ml (SMALL)",
  price: 440,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito"
}, {
  id: 584,
  name: "KINGTOX SPRAY 400ml (MEDIUM)",
  price: 540,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito"
}, {
  id: 585,
  name: "KINGTOX SPRAY 600 (LARGE)",
  price: 740,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito"
}, {
  id: 587,
  name: "KIWI POLISH LIQUID (BLACK) RS,450",
  price: 430,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "K"
}, {
  id: 588,
  name: "KIWI POLISH LIQUID (BROWN) RS,450",
  price: 430,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "K"
}, {
  id: 589,
  name: "KOHE NOOR OIL (CHANBALI) RP,350",
  price: 335,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "K"
}, {
  id: 592,
  name: "LASTIK BAREEK CHILD",
  price: 20,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "L"
}, {
  id: 593,
  name: "LASTIK CHORDA LADIES ROLL (LARGE)",
  price: 390,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 594,
  name: "LASTIK CHORDA LADIES ROLL (MEDIUM) 25 YARD",
  price: 330,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 595,
  name: "LASTIK CHORDA LADIES ROLL (SMALL)",
  price: 80,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "L"
}, {
  id: 596,
  name: "LASTIK CHORDA WHITE (LARGE)",
  price: 25,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "L"
}, {
  id: 599,
  name: "LIGHTER (ARCO GARARRI)",
  price: 40,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "L"
}, {
  id: 600,
  name: "LIGHTER (HEATER)",
  price: 30,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "L"
}, {
  id: 601,
  name: "LIGHTER (SADA TIK)",
  price: 25,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 603,
  name: "LIGHTER CHOLAH (PUZZO)",
  price: 199,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 604,
  name: "LIGHTER CHOLAH (REFILL)",
  price: 199,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 605,
  name: "LIGHTER CHOLAH FULL STEEL GUN",
  price: 0,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 606,
  name: "LIGHTER CIGARETTE GAS REFILL (RED)",
  price: 199,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 607,
  name: "LIGHTER ELECTRIC ARC (USB TYPE C)",
  price: 400,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 608,
  name: "LIP OIL POUCH",
  price: 40,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "L"
}, {
  id: 609,
  name: "LOCK BLACK 20mm",
  price: 70,
  categoryId: "lock",
  categoryName: "Lock & Cells"
}, {
  id: 610,
  name: "LOCK BLACK 25mm",
  price: 80,
  categoryId: "lock",
  categoryName: "Lock & Cells"
}, {
  id: 611,
  name: "LOCK BLACK 32mm",
  price: 140,
  categoryId: "lock",
  categoryName: "Lock & Cells"
}, {
  id: 612,
  name: "LOCK BLACK 38mm",
  price: 160,
  categoryId: "lock",
  categoryName: "Lock & Cells"
}, {
  id: 613,
  name: "LOCK BLACK 50mm",
  price: 260,
  categoryId: "lock",
  categoryName: "Lock & Cells"
}, {
  id: 614,
  name: "LOCK BLACK 63mm",
  price: 340,
  categoryId: "lock",
  categoryName: "Lock & Cells"
}, {
  id: 615,
  name: "LOCK FRONT KEY (LARGE) GOOD QUALITY",
  price: 680,
  categoryId: "lock",
  categoryName: "Lock & Cells"
}, {
  id: 616,
  name: "LOCK FRONT KEY (MEDIUM)",
  price: 520,
  categoryId: "lock",
  categoryName: "Lock & Cells"
}, {
  id: 617,
  name: "LOCK SILVER 40MM (WOHU)",
  price: 360,
  categoryId: "lock",
  categoryName: "Lock & Cells",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "L"
}, {
  id: 618,
  name: "LOCK SILVER 50MM (WOHU)",
  price: 440,
  categoryId: "lock",
  categoryName: "Lock & Cells",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "L"
}, {
  id: 619,
  name: "LOCK SILVER 60MM (WOHU)",
  price: 540,
  categoryId: "lock",
  categoryName: "Lock & Cells",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "L"
}, {
  id: 620,
  name: "LOCK SILVER 70MM (WOHU)",
  price: 580,
  categoryId: "lock",
  categoryName: "Lock & Cells",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "L"
}, {
  id: 621,
  name: "LOTION CARE (SMALL) RS,250",
  price: 230,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "L"
}, {
  id: 622,
  name: "LOTION ENCHANTEUR 100ML (SMALL)",
  price: 460,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 623,
  name: "LOTION MOTHER CARE 115ML RS,450",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 624,
  name: "LOTION MOTHER CARE 60ML RS,150",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 625,
  name: "LOTION NEXTON 125ML RP,499",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 626,
  name: "LOTION NEXTON 65ML RP,299",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 627,
  name: "LOTION NIVEA 100ML SMALL (MIX)",
  price: 509,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 628,
  name: "LOTION NIVEA 200ML (MIX)",
  price: 889,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 629,
  name: "LOTION NIVEA 400ML (MIX)",
  price: 1800,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 630,
  name: "LOTION OLIVIA 110ml RS,220 (MOISTURIZING)",
  price: 180,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 631,
  name: "LOTION OLIVIA 110ml RS,220 (HONEY)",
  price: 180,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 632,
  name: "LOTION OLIVIA 220ml RS,310 (MOISTURIZING)",
  price: 280,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 633,
  name: "LOTION OLIVIA 220ml RS,310 (HONEY)",
  price: 280,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 634,
  name: "LOTION PONDS 100ml HONEY RS,350",
  price: 330,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 635,
  name: "LOTION PONDS 100ML RS,350",
  price: 330,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "L"
}, {
  id: 636,
  name: "LOTION PONDS 200ml RP,600",
  price: 555,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 637,
  name: "LOTION PONDS 65ml RS,240",
  price: 229,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 638,
  name: "LOTION PONDS WHITE BEAUTY 150ml CLEANSING MILK",
  price: 499,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 639,
  name: "LOTION SKIN WHITE (VITAMIN C) RS,320",
  price: 280,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 640,
  name: "LOTION SKIN WHITE HONEY GOAT MILK RS,320",
  price: 280,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 641,
  name: "LOTION VASELINE 100ML (IMP) COCA B",
  price: 339,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "L"
}, {
  id: 642,
  name: "LOTION VASELINE 100ML (IMP) GREEN",
  price: 339,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "L"
}, {
  id: 643,
  name: "LOTION VASELINE 100ml (IMP) PINK",
  price: 339,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 644,
  name: "LOTION VASELINE 100ML (IMP) WHITE",
  price: 339,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "L"
}, {
  id: 645,
  name: "LOTION VASELINE 100ML (IMP) YELLOW",
  price: 339,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "L"
}, {
  id: 646,
  name: "LOTION VASELINE 200ml (IMP) WHITE",
  price: 699,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 647,
  name: "LOTION VASELINE 200ML (IMP) COCO",
  price: 699,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "L"
}, {
  id: 648,
  name: "LOTION VASELINE 200ML (IMP) PINK",
  price: 699,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "L"
}, {
  id: 649,
  name: "LOTION VASELINE 200ml (IMP) GREEN",
  price: 699,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 650,
  name: "LUBNA'S WONDER WAX (LARGE)",
  price: 250,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 651,
  name: "LUBNA'S WONDER WAX (SMALL)",
  price: 189,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 652,
  name: "LUDE POLISH (BLACK) ORIGINAL",
  price: 99,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 653,
  name: "LUDE POLISH (BROWN) ORIGINAL",
  price: 99,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "L"
}, {
  id: 654,
  name: "LUDO (CARPET)",
  price: 449,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 655,
  name: "LUDO (LARGE) ",
  price: 199,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 656,
  name: "LUDO (XL) (GOOD QUALITY)",
  price: 289,
  categoryId: "sports",
  categoryName: "Sports & Toys",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "L"
}, {
  id: 657,
  name: "LUDO (LARGE) WOOD GOOD QUALITY",
  price: 489,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 658,
  name: "LUDO (MEDIUM)",
  price: 144,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 659,
  name: "LUDO (MEDIUM) WOOD GOOD QUALITY",
  price: 429,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 660,
  name: "LUDO (SMALL)",
  price: 89,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 661,
  name: "LUDO (SMALL) WOOD GOOD QUALITY",
  price: 299,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 662,
  name: "LUDO DANA CRYSTAL",
  price: 10,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 663,
  name: "LUDO DANA MILKY",
  price: 10,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 664,
  name: "LUX BODY WASH SOFT TOUCH (BLUE) (IMP)",
  price: 430,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 665,
  name: "LUX BODY WASH SOFT TOUCH (PINK) (IMP)",
  price: 430,
  categoryId: "soaps",
  categoryName: "Soaps",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "L"
}, {
  id: 666,
  name: "LUX BODY WASH SOFT TOUCH (PURPLE) (IMP)",
  price: 430,
  categoryId: "soaps",
  categoryName: "Soaps",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "L"
}, {
  id: 667,
  name: "MAGIC DEPOXI BOX (SMALL)",
  price: 71,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "M"
}, {
  id: 668,
  name: "MARKER 604 (BLACK)",
  price: 20,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "M"
}, {
  id: 669,
  name: "MARKER 604 (BLUE)",
  price: 20,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "M"
}, {
  id: 670,
  name: "MARKER MERCURY (BLUE)",
  price: 20,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "M"
}, {
  id: 671,
  name: "MARKER MERCURY (BLACK)",
  price: 20,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "M"
}, {
  id: 672,
  name: "MARKER BOARD INK",
  price: 89,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 673,
  name: "MARKER BLACK BOARD (BLACK)",
  price: 69,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "M"
}, {
  id: 674,
  name: "MARKER BLACK BOARD (BLUE)",
  price: 69,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "M"
}, {
  id: 675,
  name: "MARKER PERMANENT (BLACK) DEER",
  price: 69,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "M"
}, {
  id: 676,
  name: "MARKER PERMANENT (BLUE) DEER",
  price: 69,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 677,
  name: "MARKER SADA (BLACK)",
  price: 15,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "M"
}, {
  id: 678,
  name: "MARKER SADA (BLUE)",
  price: 15,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "M"
}, {
  id: 679,
  name: "MARKER SADA DOLLAR (BLUE)",
  price: 21,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 681,
  name: "MEHNDI ARAQ",
  price: 30,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 682,
  name: "MEHNDI CONE",
  price: 40,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 683,
  name: "MEHNDI CONE SINGHAR",
  price: 50,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 684,
  name: "CAT FOOD (FLUFFY)",
  price: 830,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 685,
  name: "METRO +7 AGAER BATTI (LARGE)",
  price: 120,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 686,
  name: "METRO AGHER BATTI (SMALL)",
  price: 50,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "M"
}, {
  id: 687,
  name: "MIRROR DOUBLE SIDED (LARGE)",
  price: 240,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "M"
}, {
  id: 688,
  name: "MIRROR DOUBLE SIDED (MEDIUM)",
  price: 189,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "M"
}, {
  id: 689,
  name: "MIRROR DOUBLE SIDED (SMALL)",
  price: 129,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "M"
}, {
  id: 690,
  name: "MOOV SPRAY",
  price: 849,
  categoryId: "personalcare",
  categoryName: "Personal Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "M"
}, {
  id: 691,
  name: "MORTEIN COIL LARGE",
  price: 0,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito"
}, {
  id: 692,
  name: "MORTEIN MACHINE RP,560",
  price: 0,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito"
}, {
  id: 693,
  name: "MORTEIN REFILLL (30 NIGHT)",
  price: 239,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito"
}, {
  id: 694,
  name: "MORTEIN REFILLL (60 NIGHT)",
  price: 439,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito"
}, {
  id: 695,
  name: "MORTEIN SPRAY 300ML",
  price: 529,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "M"
}, {
  id: 696,
  name: "MORTEIN SPRAY 375ML",
  price: 699,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito"
}, {
  id: 697,
  name: "MORTEIN SPRAY 600ML LARGE",
  price: 899,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito"
}, {
  id: 698,
  name: "MOSPEL RS,350",
  price: 319,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "M"
}, {
  id: 700,
  name: "MOTHER CARE OIL 125ML RP,480",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 701,
  name: "MOTHER CARE OIL 65ML",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 702,
  name: "MOUTH WASH COLGATE 250ML (IMP) MIX",
  price: 489,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 703,
  name: "MOUTH WASH LISTERINE (MIX)",
  price: 489,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 704,
  name: "MOUTH WASH ORAL-B",
  price: 489,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 705,
  name: "MOUTH WASH SENSODYNE (MIX)",
  price: 539,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 706,
  name: "MULTANI MUTTI JAR",
  price: 80,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 708,
  name: "MUNDIAL OLIVE OIL 175ML",
  price: 579,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 709,
  name: "NAIL CUTTER 555 (LARGE)",
  price: 0,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 710,
  name: "NAIL CUTTER AKAI (JAPANI ORIGINAL) (LARGE) JAPANI",
  price: 799,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 711,
  name: "NAIL CUTTER AKAI (JAPANI ORIGINAL) (MEDIUM) JAPANI",
  price: 749,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 712,
  name: "NAIL CUTTER MINI",
  price: 60,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 713,
  name: "NAIL CUTTER V9 (GOOD QUALITY)",
  price: 149,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "N"
}, {
  id: 714,
  name: "NALKI (MIX)",
  price: 70,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 715,
  name: "NAIR HAIR REMOVAL SPRAY (MIX)",
  price: 0,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 716,
  name: "NALKI (BLACK)",
  price: 15,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "N"
}, {
  id: 717,
  name: "NALKI (WHITE)",
  price: 15,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "N"
}, {
  id: 718,
  name: "NEXTON BABY COLOGNE BLUE",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 719,
  name: "NEXTON BABY KIT MEDIUM",
  price: 1800,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 720,
  name: "NEXTON BABY KIT SMALL",
  price: 999,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 721,
  name: "NEXTON BABY LOTION 125ML RP,525",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 722,
  name: "NEXTON BABY LOTION 250ML",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 723,
  name: "NEXTON BABY LOTION 65ML RP,315",
  price: 299,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 724,
  name: "NEXTON BABY POWDER 100g RP,275 (MIX)",
  price: 249,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 725,
  name: "NEXTON BABY POWDER 200g RP,430 (MIX)",
  price: 399,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 726,
  name: "NEXTON BABY SHAMPOO 125ML RP,399",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 727,
  name: "NEXTON BABY SHAMPOO 250ML RP,699",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 728,
  name: "NEXTON BABY SHAMPOO 500ML RP,999",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 729,
  name: "NEXTON BABY SHAMPOO 65ML RP,260",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 730,
  name: "NEXTON BABY SHAMPOO PUMP",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 731,
  name: "NEXTON BABY SOAP RP,225",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 732,
  name: "NEXTON OIL 125ML RP,470",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 733,
  name: "NEXTON WIPES",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 734,
  name: "NIPLE PP SMALL",
  price: 29,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 735,
  name: "NIPPLE PP LARGE",
  price: 49,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 736,
  name: "NITRO HAIR WAX (MIX)",
  price: 420,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 737,
  name: "NOVA GOLD HAIR SPRAY (LARGE)",
  price: 595,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 738,
  name: "NOVA GOLD HAIR SPRAY (SMALL) (COPY)",
  price: 375,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "N"
}, {
  id: 753,
  name: "PAPER COPY (ALL TYPES)",
  price: 0,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 754,
  name: "PARACHUTE COCONUT OIL (LARGE) ORIGINAL",
  price: 989,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 755,
  name: "PARACHUTE COCONUT OIL (LARGE) HEMANI",
  price: 889,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 756,
  name: "PARACHUTE COCONUT OIL (MEDIUM) HEMANI",
  price: 489,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "P"
}, {
  id: 757,
  name: "PARACHUTE COCONUT OIL (MEDIUM) ORIGINAL",
  price: 589,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 758,
  name: "PARACHUTE COCONUT OIL (SMALL) HEMANI",
  price: 269,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 759,
  name: "PARACHUTE COCONUT OIL (SMALL) ORIGINAL",
  price: 299,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 760,
  name: "PARTY PACK TISSUE ROSE PETAL (PINK) RP,250",
  price: 229,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 761,
  name: "PARTY PACK TISSUE ROSE PETAL (WHITE) RP,275",
  price: 249,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 762,
  name: "PARTY POPPER (MEDIUM)",
  price: 129,
  categoryId: "birthday",
  categoryName: "Birthday",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "P"
}, {
  id: 763,
  name: "PARTY POPPER (SMALL)",
  price: 89,
  categoryId: "birthday",
  categoryName: "Birthday",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "P"
}, {
  id: 764,
  name: "PASTE CHILD (ABC) RS,180 (MIX)",
  price: 169,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 765,
  name: "PASTE CHILD KODOMO (MIX)",
  price: 199,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "P"
}, {
  id: 766,
  name: "PASTE CLOSE UP (IMP) LARGE GREEN",
  price: 399,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 767,
  name: "PASTE CLOSE UP (IMP) LARGE RED",
  price: 399,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 768,
  name: "PASTE CLOSE UP (IMP) XL BLUE (ICY WHITE)",
  price: 449,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 769,
  name: "PASTE CLOSE UP (SMALL) GREEN",
  price: 199,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "P"
}, {
  id: 770,
  name: "PASTE CLOSE UP (SMALL) RED",
  price: 199,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "P"
}, {
  id: 771,
  name: "PASTE COLGATE 100g HERBAL RS,220",
  price: 205,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 772,
  name: "PASTE COLGATE 100g SADA RS,230",
  price: 214,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 773,
  name: "PASTE COLGATE 125G MAX FRESH (GREEN) RS,325",
  price: 310,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "P"
}, {
  id: 774,
  name: "PASTE COLGATE 125g MAX FRESH (BLUE) RS,325",
  price: 310,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 775,
  name: "PASTE COLGATE 125G MAX FRESH (RED) RS,325",
  price: 310,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "P"
}, {
  id: 776,
  name: "PASTE COLGATE 150g HERBAL RS,330",
  price: 309,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 777,
  name: "PASTE COLGATE 200g HERBAL RS,420",
  price: 397,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 778,
  name: "PASTE COLGATE 200g SADA RS,430",
  price: 405,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 779,
  name: "PASTE COLGATE 20g HERBAL RS,50",
  price: 46,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 780,
  name: "PASTE COLGATE 20g SADA RS,50",
  price: 46,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "P"
}, {
  id: 781,
  name: "PASTE COLGATE 40g SADA RS,75",
  price: 69,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 782,
  name: "PASTE COLGATE 45g HERBAL RS,75",
  price: 69,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 783,
  name: "PASTE COLGATE 75g HERBAL RS,180",
  price: 169,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 784,
  name: "PASTE COLGATE 75g SADA RS,190",
  price: 179,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 785,
  name: "PASTE COLGATE 75g MAX FRESH RS,220 (GREEN)",
  price: 209,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 786,
  name: "PASTE COLGATE 75g MAX FRESH RS,220 (RED)",
  price: 209,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 787,
  name: "PASTE COLGATE 75g MAX FRESH RS,220 (BLUE)",
  price: 209,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "P"
}, {
  id: 788,
  name: "PASTE DOCTOR RS,110",
  price: 96,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "P"
}, {
  id: 789,
  name: "PASTE DOCTOR RS,220",
  price: 199,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "P"
}, {
  id: 790,
  name: "PASTE ENGLISH SMALL RS,140",
  price: 125,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 791,
  name: "PASTE FORHANS (LARGE) RS,300",
  price: 285,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 792,
  name: "PASTE FORHANS (SMALL) RS,180",
  price: 169,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "P"
}, {
  id: 793,
  name: "PASTE MEDICAM 35GM RS,120",
  price: 109,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 794,
  name: "PASTE MEDICAM 65GM RS,250",
  price: 224,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 795,
  name: "PASTE MEDICAM 90GM RS,320",
  price: 289,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 796,
  name: "PASTE PARODONTAX 50g RS,250",
  price: 235,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 797,
  name: "PASTE PARODONTAX 100g RS,400",
  price: 375,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 798,
  name: "PASTE SENSODYNE 100g (FLUORIDE) RS,450",
  price: 429,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 799,
  name: "PASTE SENSODYNE 100g (ORIGINAL) RS,450",
  price: 429,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 800,
  name: "PASTE SENSODYNE 100g (RAPID ACTION) RS,545",
  price: 519,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 801,
  name: "PASTE SENSODYNE 30g (COMPLETE PROTECTION +) RS,165",
  price: 155,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 802,
  name: "PASTE SENSODYNE 30g (RAPID ACTION) RS,165",
  price: 154,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "P"
}, {
  id: 804,
  name: "PASTE SENSODYNE 70g (FLUORIDE) RS,380",
  price: 354,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "P"
}, {
  id: 805,
  name: "PASTE SENSODYNE 70g (ORIGINAL) RS,380",
  price: 354,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "P"
}, {
  id: 806,
  name: "PASTE SENSODYNE 70g (RAPID ACTION) RS,420",
  price: 399,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "P"
}, {
  id: 807,
  name: "PASTE SPARKLE RS,105",
  price: 99,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 808,
  name: "PASTE SPARKLE RS,180",
  price: 170,
  categoryId: "toothpasteandbrush",
  categoryName: "Tooth Paste & Brush"
}, {
  id: 809,
  name: "PEN (BLUE SIGNATURE) BLACK",
  price: 17,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 810,
  name: "PEN (BLUE SIGNATURE) BLUE",
  price: 17,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 811,
  name: "PEN DOLLAR SP 10",
  price: 70,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 812,
  name: "PEN PIANO (BLACK) GRIPPER 0.8MM",
  price: 20,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "P"
}, {
  id: 813,
  name: "PEN PIANO (BLUE) GRIPPER 0.8MM",
  price: 20,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "P"
}, {
  id: 814,
  name: "PEN PIANO (RED) GRIPPER 0.8MM",
  price: 20,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "P"
}, {
  id: 815,
  name: "PEN PIANO OLD YELLOW",
  price: 17,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "P"
}, {
  id: 816,
  name: "PENCIL GOLDFISH",
  price: 19,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "P"
}, {
  id: 817,
  name: "PENCIL MY DOLLAR",
  price: 19,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "P"
}, {
  id: 818,
  name: "PENCIL ORO",
  price: 19,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "P"
}, {
  id: 819,
  name: "PERFUME ALISHA (GOLD)",
  price: 1590,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 820,
  name: "PERFUME ALISHA (NAVY)",
  price: 1590,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 821,
  name: "PERFUME ALISHA (ROSE)",
  price: 1590,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 822,
  name: "PERFUME ASEEL",
  price: 1790,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "P"
}, {
  id: 823,
  name: "PERFUME DELYCIA (MEDIUM) BEAUTY RS,650",
  price: 619,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "P"
}, {
  id: 824,
  name: "PERFUME DELYCIA (MEDIUM) CHECK RS,650",
  price: 619,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "P"
}, {
  id: 825,
  name: "PERFUME DELYCIA (SMALL) BEAUTY RS,350",
  price: 325,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "P"
}, {
  id: 826,
  name: "PERFUME DELYCIA (SMALL) CHECK RS,350",
  price: 325,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "P"
}, {
  id: 827,
  name: "PERFUME DELYCIA (SMALL) FEELING RS,350",
  price: 325,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "P"
}, {
  id: 828,
  name: "PERFUME DO IT",
  price: 1790,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 829,
  name: "PERFUME EVERY ONE",
  price: 1690,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "P"
}, {
  id: 830,
  name: "PERFUME FOR EVER",
  price: 790,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 831,
  name: "PERFUME GAMBIT",
  price: 790,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 832,
  name: "PERFUME HAVOC (DUBAI) GOLDEN",
  price: 2140,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 833,
  name: "PERFUME HAVOC (DUBAI) SILVER",
  price: 2140,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 835,
  name: "PERFUME MEDORA (MEDIUM) BLUE RS,650",
  price: 619,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "P"
}, {
  id: 836,
  name: "PERFUME MEDORA (MEDIUM) GREEN RS,650",
  price: 619,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "P"
}, {
  id: 837,
  name: "PERFUME MEDORA (SMALL) BLUE RS,350",
  price: 325,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "P"
}, {
  id: 838,
  name: "PERFUME MEDORA (SMALL) GREEN RS,350",
  price: 325,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "P"
}, {
  id: 839,
  name: "PERFUME MEDORA (SMALL) RED RS,350",
  price: 325,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "P"
}, {
  id: 840,
  name: "PERFUME MEDORA (MEDIUM) RED RS,650",
  price: 325,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "P"
}, {
  id: 841,
  name: "PERFUME MUTUAL LOVE (GOLD)",
  price: 390,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "P"
}, {
  id: 842,
  name: "PERFUME MUTUAL LOVE (PINK)",
  price: 390,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "P"
}, {
  id: 843,
  name: "PERFUME MUTUAL LOVE (RED)",
  price: 390,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "P"
}, {
  id: 844,
  name: "PERFUME ONE MAN SHOW",
  price: 2340,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "P"
}, {
  id: 845,
  name: "PERFUME PENCIL (MEN + W,M)",
  price: 140,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "P"
}, {
  id: 846,
  name: "PERFUME RASSASI BLUE LADY",
  price: 2440,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "P"
}, {
  id: 847,
  name: "PERFUME RASSASI ROMANCE (WOMAN)",
  price: 2480,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "P"
}, {
  id: 848,
  name: "PERFUME RASSASI SECRET",
  price: 2530,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "P"
}, {
  id: 849,
  name: "PERFUME ROYAL MARRIAGE",
  price: 2480,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 850,
  name: "PERFUME SHALIS MEN (LARGE)",
  price: 3650,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 851,
  name: "PERFUME SHALIS MEN (SMALL)",
  price: 2690,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 852,
  name: "PERFUME SHALIS WOMEN (LARGE)",
  price: 3650,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 853,
  name: "PERFUME SHALIS WOMEN (SMALL)",
  price: 2690,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 854,
  name: "POWDER BERG (LARGE) RS,380",
  price: 349,
  categoryId: "powders",
  categoryName: "Powders"
}, {
  id: 855,
  name: "POWDER BERG (SMALL) RS,220",
  price: 180,
  categoryId: "powders",
  categoryName: "Powders"
}, {
  id: 856,
  name: "POWDER BLACK BEAUTY (LARGE) RS,450",
  price: 410,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "P"
}, {
  id: 857,
  name: "POWDER BLACK BEAUTY (SMALL) RP,220",
  price: 195,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "P"
}, {
  id: 858,
  name: "POWDER BLACK CAT (LARGE) RS,480",
  price: 430,
  categoryId: "powders",
  categoryName: "Powders"
}, {
  id: 859,
  name: "POWDER BLACK CAT (SMALL) RS,250",
  price: 210,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "P"
}, {
  id: 861,
  name: "POWDER COOL COOL RS,210",
  price: 170,
  categoryId: "powders",
  categoryName: "Powders"
}, {
  id: 862,
  name: "POWDER DENTONIC BOX 100GM (MEDIUM) RS,75",
  price: 0,
  categoryId: "powders",
  categoryName: "Powders"
}, {
  id: 863,
  name: "POWDER DENTONIC BOX 200GM (LARGE) RS,130",
  price: 0,
  categoryId: "powders",
  categoryName: "Powders"
}, {
  id: 864,
  name: "POWDER EDEN ROCK (LARGE) RS,310",
  price: 260,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "P"
}, {
  id: 865,
  name: "POWDER EDEN ROCK (SMALL) RS,210",
  price: 180,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "P"
}, {
  id: 866,
  name: "POWDER ENCHANTEUR 125g (PURPLE)",
  price: 479,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "P"
}, {
  id: 867,
  name: "POWDER ENCHANTEUR 125g (PINK)",
  price: 479,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "P"
}, {
  id: 868,
  name: "POWDER ENCHANTEUR 125g (ROSE)",
  price: 479,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "P"
}, {
  id: 869,
  name: "POWDER ENCHANTEUR 125g (YELLOW)",
  price: 479,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "P"
}, {
  id: 870,
  name: "POWDER ENGLISH PRICKLY HEAT LARGE",
  price: 390,
  categoryId: "powders",
  categoryName: "Powders"
}, {
  id: 871,
  name: "POWDER ENGLISH PRICKLY HEAT SMALL",
  price: 239,
  categoryId: "powders",
  categoryName: "Powders"
}, {
  id: 872,
  name: "POWDER MEDORA (LARGE) (JOY) RS,480",
  price: 440,
  categoryId: "powders",
  categoryName: "Powders"
}, {
  id: 873,
  name: "POWDER MEDORA (SMALL) (JOY) RS,230",
  price: 210,
  categoryId: "powders",
  categoryName: "Powders"
}, {
  id: 874,
  name: "POWDER MEDORA (SMALL) (MIX) RS,230",
  price: 210,
  categoryId: "powders",
  categoryName: "Powders"
}, {
  id: 875,
  name: "POWDER MOTHER CARE GO-RASH 150g SMALL RS,400",
  price: 360,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "P"
}, {
  id: 876,
  name: "POWDER MOTHER CARE GO-RASH 250g LARGE RS,550",
  price: 499,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "P"
}, {
  id: 877,
  name: "POWDER TIBET (LARGE) RS,580",
  price: 540,
  categoryId: "powders",
  categoryName: "Powders"
}, {
  id: 878,
  name: "POWDER TIBET (SMALL) RS,190",
  price: 179,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "P"
}, {
  id: 881,
  name: "RAZOR DARCO",
  price: 199,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades"
}, {
  id: 882,
  name: "RAZOR FEMINA PINK",
  price: 40,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades"
}, {
  id: 883,
  name: "RAZOR TREET HYGIENE",
  price: 45,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "R"
}, {
  id: 884,
  name: "RAZOR TRIM",
  price: 59,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "R"
}, {
  id: 904,
  name: "REGISTER (ALL TYPES)",
  price: 0,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 905,
  name: "RACKET (SET) (EXCELLENT QUALITY)",
  price: 2250,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 906,
  name: "RACKET (SET) (NORMAL QUALITY)",
  price: 999,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 907,
  name: "RACKET (SET) (MEDIUM QUALITY)",
  price: 1450,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 908,
  name: "ROLL ON FA (AQUA)",
  price: 449,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 909,
  name: "ROLL ON ENCHANTEUR (MIX) WOMEN",
  price: 499,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 910,
  name: "ROLL ON FA (GREEN)",
  price: 449,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "R"
}, {
  id: 911,
  name: "ROLL ON FA (PINK)",
  price: 449,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 912,
  name: "ROLL ON FA (MYSTIC MOMENT)",
  price: 449,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "R"
}, {
  id: 913,
  name: "ROLL ON FA (SPORT)",
  price: 449,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "R"
}, {
  id: 914,
  name: "ROLL ON NIVEA (MEN)",
  price: 499,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 915,
  name: "ROLL ON NIVEA (WOMEN)",
  price: 499,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "R"
}, {
  id: 917,
  name: "ROLL ON YARDLEY MIX",
  price: 499,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 918,
  name: "ROOM SPRAY  DO IT",
  price: 239,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 919,
  name: "ROOM SPRAY (FRESH FRAGRANCE) MIX",
  price: 269,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 920,
  name: "ROOM SPRAY (IMP) DARHAM",
  price: 650,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "R"
}, {
  id: 921,
  name: "ROOM SPRAY (HOUSE CARE) MIX",
  price: 279,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "R"
}, {
  id: 922,
  name: "ROOM SPRAY (FREY) MIX",
  price: 299,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 923,
  name: "ROOM SPRAY NEW (GOOD MORNING) MIX",
  price: 239,
  categoryId: "fragnances",
  categoryName: "Fragnances"
}, {
  id: 926,
  name: "ROSE PETAL TISSUE ROLL MAXOB",
  price: 119,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 927,
  name: "SABALON SPRAY (PK) LARGE",
  price: 419,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "S"
}, {
  id: 928,
  name: "SABALON SPRAY (PK) SMALL",
  price: 299,
  categoryId: "fragnances",
  categoryName: "Fragnances",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "S"
}, {
  id: 929,
  name: "SAFETY BOX UNIVERSAL RS,10",
  price: 10,
  categoryId: "shaving",
  categoryName: "Shaving & Razers & Blades"
}, {
  id: 930,
  name: "SAFETY PIN (LARGE)",
  price: 30,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 931,
  name: "SAFETY PIN (MEDIUM)",
  price: 20,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 932,
  name: "SAMAD BOND BOX (SMALL)",
  price: 130,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "S"
}, {
  id: 933,
  name: "SAVOLI OIL 100ml",
  price: 590,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 934,
  name: "SCALE ORO LARGE",
  price: 59,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "S"
}, {
  id: 935,
  name: "SCALE ORO SMALL",
  price: 35,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "S"
}, {
  id: 936,
  name: "SCISSOR STEEL LARGE",
  price: 439,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 937,
  name: "SCISSOR STEEL MEDIUM",
  price: 329,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 938,
  name: "SCISSOR STEEL MINI",
  price: 129,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 939,
  name: "SCISSOR STEEL SMALL",
  price: 109,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "S"
}, {
  id: 940,
  name: "SERUM UJOOBA",
  price: 89,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 941,
  name: "SERUM BIO COSS",
  price: 89,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "S"
}, {
  id: 942,
  name: "SERUM DERMA PLUS",
  price: 89,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 944,
  name: "SERUM FAIZA (LARGE)",
  price: 109,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 945,
  name: "SERUM GOLDEN PEARL (GOLDEN)",
  price: 105,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "S"
}, {
  id: 946,
  name: "SERUM JHALAK",
  price: 89,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 947,
  name: "SERUM SANDAL",
  price: 89,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 948,
  name: "SET WET GEL (MIX)",
  price: 419,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 949,
  name: "SHAMPOO BIO AMLA FARVAL ORIGINAL RS,700",
  price: 599,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 950,
  name: "SHAMPOO BIO AMLA FARVEL ORIGINAL RS,340",
  price: 295,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 951,
  name: "SHAMPOO BIO AMLA FARVEL ORIGINAL RS,500",
  price: 430,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 952,
  name: "SHAMPOO BIO AMLA FARVEL ORIGINAL RS,180",
  price: 145,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "S"
}, {
  id: 953,
  name: "SHAMPOO CLEAR 200ml  (MEN) BLUE RS,499",
  price: 479,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 955,
  name: "SHAMPOO CLEAR 400ml (MEN) BLUE RS,830",
  price: 789,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 958,
  name: "SHAMPOO DOVE 175ml (GOLDEN) DAILY MOISTURE RS,520",
  price: 495,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "S"
}, {
  id: 959,
  name: "SHAMPOO DOVE 175ML (HAIR FALL) RS,520",
  price: 495,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "S"
}, {
  id: 960,
  name: "SHAMPOO DOVE 175ml (INTENSIVE REPAIR) RS,520",
  price: 495,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "S"
}, {
  id: 961,
  name: "SHAMPOO DOVE 175ml (LIGHT BLUE) RS,520",
  price: 495,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "S"
}, {
  id: 962,
  name: "SHAMPOO DOVE 400ml (INTENSIVE REPAIR) RS,940",
  price: 495,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 964,
  name: "SHAMPOO ENGLISH ANTI LICE (LARGE) RS,370",
  price: 350,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 965,
  name: "SHAMPOO ENGLISH ANTI LICE (MEDIUM) RS,240",
  price: 225,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "S"
}, {
  id: 966,
  name: "SHAMPOO ENGLISH ANTI LICE (SMALL) RS,170",
  price: 159,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "S"
}, {
  id: 971,
  name: "SHAMPOO LIFEBUOY 100ml (GREEN) RS,200",
  price: 189,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "S"
}, {
  id: 972,
  name: "SHAMPOO LIFEBUOY 100ml (ONION) RP,200",
  price: 189,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "S"
}, {
  id: 973,
  name: "SHAMPOO LIFEBUOY 200ml (GREEN) RS,320",
  price: 299,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 974,
  name: "SHAMPOO LIFEBUOY 200ml (ONION) RS,320",
  price: 299,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "S"
}, {
  id: 975,
  name: "SHAMPOO LIFEBUOY 200ml (YELLOW) RS,320",
  price: 299,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "S"
}, {
  id: 976,
  name: "SHAMPOO LIFEBUOY 200ml (RETHA AMLA) RS,320",
  price: 299,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 977,
  name: "SHAMPOO LIFEBUOY 400ml (GREEN) RS,620",
  price: 589,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "S"
}, {
  id: 978,
  name: "SHAMPOO LOREAL LARGE (HYALURON MOISTURE) RS,930",
  price: 849,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 979,
  name: "SHAMPOO LOREAL LARGE (HYALURON PURE) RS,930",
  price: 849,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 980,
  name: "SHAMPOO LOREAL LARGE (GLYCOLIC EXTRA GLOSS) RS,1050",
  price: 949,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 981,
  name: "SHAMPOO LOREAL LARGE (TOTAL REPAIR 5) RS,930",
  price: 849,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 982,
  name: "SHAMPOO LOREAL LARGE (EXTRA-ORDINARY OIL) RP,930",
  price: 849,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 983,
  name: "SHAMPOO LOREAL LARGE (COLOR VIBRANCY) RS,930",
  price: 849,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 984,
  name: "SHAMPOO LOREAL LARGE (DREAM LONG) RS,930",
  price: 849,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "S"
}, {
  id: 985,
  name: "SHAMPOO LOREAL LARGE (FALL RESIST 3D) RS,930",
  price: 849,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 986,
  name: "SHAMPOO LOREAL MEDIUM (HYALURON MOISTURE) RS,600",
  price: 559,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "S"
}, {
  id: 987,
  name: "SHAMPOO LOREAL MEDIUM (HYALURON PURE) RS,530",
  price: 489,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 988,
  name: "SHAMPOO LOREAL MEDIUM (GLYCOLIC EXTRA GLOSS) RS,530",
  price: 489,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "S"
}, {
  id: 989,
  name: "SHAMPOO LOREAL MEDIUM (TOTAL REPAIR 5) RS,530",
  price: 489,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 990,
  name: "SHAMPOO LOREAL MEDIUM (EXTRA-ORDINARY OIL) RS,530",
  price: 489,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "S"
}, {
  id: 991,
  name: "SHAMPOO LOREAL MEDIUM (COLOR VIBRANCY) RS,530",
  price: 489,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "S"
}, {
  id: 992,
  name: "SHAMPOO LOREAL MEDIUM (DREAM LONG) RS,530",
  price: 489,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "S"
}, {
  id: 993,
  name: "SHAMPOO LOREAL MEDIUM (FALL RESIST 3D) RS,530",
  price: 489,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 994,
  name: "SHAMPOO MECLAY MEDIUM (PINK)",
  price: 369,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "S"
}, {
  id: 995,
  name: "SHAMPOO MECLAY MEDIUM (PURPLE)",
  price: 369,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "S"
}, {
  id: 996,
  name: "SHAMPOO MECLAY MEDIUM (DARK BLUE)",
  price: 369,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "S"
}, {
  id: 997,
  name: "SHAMPOO MECLAY MEDIUM (GREEN)",
  price: 369,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "S"
}, {
  id: 998,
  name: "SHAMPOO MECLAY MEDIUM (BLACK)",
  price: 369,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "S"
}, {
  id: 999,
  name: "SHAMPOO MECLAY MEDIUM (RED)",
  price: 369,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "S"
}, {
  id: 1000,
  name: "SHAMPOO MECLAY MEDIUM (ORANGE)",
  price: 369,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1001,
  name: "SHAMPOO MECLAY MEDIUM (GOLDEN) ",
  price: 369,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "S"
}, {
  id: 1002,
  name: "SHAMPOO MECLAY MEDIUM (WHITE)",
  price: 369,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "S"
}, {
  id: 1003,
  name: "SHAMPOO MECLAY LARGE (PINK)",
  price: 660,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "S"
}, {
  id: 1004,
  name: "SHAMPOO MECLAY LARGE (PURPLE)",
  price: 660,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1005,
  name: "SHAMPOO MECLAY LARGE (DARK BLUE)",
  price: 660,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1006,
  name: "SHAMPOO MECLAY LARGE (GREEN)",
  price: 660,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1007,
  name: "SHAMPOO MECLAY LARGE (BLACK)",
  price: 660,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1008,
  name: "SHAMPOO MECLAY LARGE (RED)",
  price: 660,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "S"
}, {
  id: 1009,
  name: "SHAMPOO MECLAY LARGE (ORANGE)",
  price: 660,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1010,
  name: "SHAMPOO MECLAY LARGE (GOLDEN)",
  price: 660,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "S"
}, {
  id: 1011,
  name: "SHAMPOO MECLAY LARGE (WHITE)",
  price: 660,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1012,
  name: "SHAMPOO PALMOLIVE (LARGE) (GREEN) HEALTHY & SMOOTH RS,700",
  price: 660,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1013,
  name: "SHAMPOO PALMOLIVE (LARGE) (PINK) INTENSIVE MOISTURE RS,700",
  price: 660,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1014,
  name: "SHAMPOO PALMOLIVE (LARGE) (WHITE) BRILLIANT SHINE RS,700",
  price: 660,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1015,
  name: "SHAMPOO PALMOLIVE (MEDIUM) (WHITE) BRILLIANT SHINE RS,330",
  price: 379,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1016,
  name: "SHAMPOO PALMOLIVE (MEDIUM) (GREEN) HEALTHY & SMOOTH RS,330",
  price: 379,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1017,
  name: "SHAMPOO PALMOLIVE (MEDIUM) (PINK) INTENSIVE MOISTURE RS,330",
  price: 379,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1034,
  name: "SHAMPOO REVLON COLOUR SACHET 30#",
  price: 70,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "S"
}, {
  id: 1035,
  name: "SHAMPOO SUNSILK (IMP) LARGE (BLACK) BLACK SHINE",
  price: 889,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1036,
  name: "SHAMPOO SUNSILK (IMP) LARGE (BLUE) ANTI DANDRUFF",
  price: 889,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1037,
  name: "SHAMPOO SUNSILK (IMP) LARGE (GOLDEN) H,F SOLUTION",
  price: 889,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1038,
  name: "SHAMPOO SUNSILK (IMP) MEDIUM (GREEN)",
  price: 439,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1040,
  name: "SHAMPOO SUNSILK (IMP) MEDIUM (BLACK)",
  price: 439,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1041,
  name: "SHAMPOO SUNSILK 100ml (BLACK) BLACK SHINE RS,190",
  price: 179,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "S"
}, {
  id: 1042,
  name: "SHAMPOO SUNSILK 200ml (BLACK) BLACK SHINE RS,499",
  price: 479,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "S"
}, {
  id: 1043,
  name: "SHAMPOO SUNSILK 200ml (GOLDEN) H,F SOLUTION RS,499",
  price: 479,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "S"
}, {
  id: 1044,
  name: "SHAMPOO SUNSILK 200ml (PINK) THICK & LONG RS,449",
  price: 479,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "S"
}, {
  id: 1045,
  name: "SHAMPOO SUNSILK 400ml (PINK) THICK & LONG RS,799",
  price: 769,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1046,
  name: "SHAMPOO SUNSILK 400ml (GOLDEN) SOFT & SMOOTH",
  price: 769,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1047,
  name: "SHAMPOO TRESEMME (IMP) 170ml (BLACK)",
  price: 520,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1048,
  name: "SHAMPOO TRESEMME (IMP) 170ml (GREEN)",
  price: 520,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1049,
  name: "SHAMPOO TRESEMME (IMP) 170ml (RED)",
  price: 520,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1051,
  name: "SHAMPOO TRESEMME 400ml (GREEN)",
  price: 885,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1052,
  name: "SHAMPOO TRESEMME 400ml (BLACK)",
  price: 885,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1053,
  name: "SHAMPOO TRESEMME 400ml (RED)",
  price: 885,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1054,
  name: "SHAMPOO VATIKA DUBAI LARGE (BLACK) RP,720",
  price: 659,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1055,
  name: "SHAMPOO VATIKA DUBAI LARGE (OLIVE) RS,720",
  price: 659,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1056,
  name: "SHAMPOO VATIKA DUBAI LARGE (COCO,N) BLUE RS,720",
  price: 659,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1057,
  name: "SHAMPOO VATIKA DUBAI LARGE (CACTUS) RS,720",
  price: 659,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1058,
  name: "SHAMPOO VATIKA DUBAI MEDIUM (ALMOND & HONEY) RS,435",
  price: 399,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1059,
  name: "SHAMPOO VATIKA DUBAI MEDIUM (OLIVE) RS,435",
  price: 399,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1060,
  name: "SHAMPOO VATIKA DUBAI MEDIUM (CACTUS) RS,435",
  price: 399,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1061,
  name: "SHAMPOO VATIKA DUBAI MEDIUM (BLACK) RS,435",
  price: 399,
  categoryId: "shampoo",
  categoryName: "Shampoo & Conditioners"
}, {
  id: 1062,
  name: "SHARPENER ORO RS,10",
  price: 9,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "S"
}, {
  id: 1063,
  name: "SHUTTLECOCK (PAR WALI) GOOD QUALITY",
  price: 0,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 1064,
  name: "SHUTTLECOCK (PAR WALI) EXCELLENT QUALITY",
  price: 0,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 1065,
  name: "SHUTTLECOCK (PLASTIC) EXCELLENT QUALITY",
  price: 0,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 1066,
  name: "SHUTTLECOCK (PLASTIC) GOOD QUALITY",
  price: 85,
  categoryId: "sports",
  categoryName: "Sports & Toys",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "S"
}, {
  id: 1067,
  name: "SHIELD CHOOSNI (3 MONTH)",
  price: 90,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 1068,
  name: "SHIELD CHOOSNI (6 MONTH)",
  price: 90,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 1075,
  name: "SHIELD NIPPLE BOX",
  price: 80,
  categoryId: "babycare",
  categoryName: "Baby Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "S"
}, {
  id: 1076,
  name: "SOAP CAPRI (FAMILY PACK) 135g (YELLOW)",
  price: 130,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1081,
  name: "SOAP CAPRI (3 IN 1) YELLOW RS,390",
  price: 350,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1083,
  name: "SOAP DETTOL JUMBO COMPANY RS,150 (COOL)",
  price: 139,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1084,
  name: "SOAP DETTOL JUMBO COMPANY RS,150 (GREEN)",
  price: 139,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1086,
  name: "SOAP DETTOL MEDIUM COMPANY (COOL) RS,140",
  price: 129,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1087,
  name: "SOAP DETTOL SMALL COMPANY (COOL)",
  price: 129,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1088,
  name: "SOAP DOVE LARGE WHITE (IMP)",
  price: 449,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1089,
  name: "SOAP DOVE LARGE PINK (IMP)",
  price: 449,
  categoryId: "soaps",
  categoryName: "Soaps",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "S"
}, {
  id: 1090,
  name: "SOAP DOVE SMALL WHITE (IMP)",
  price: 0,
  categoryId: "soaps",
  categoryName: "Soaps",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "S"
}, {
  id: 1091,
  name: "SOAP DOVE SMALL PINK (IMP)",
  price: 0,
  categoryId: "soaps",
  categoryName: "Soaps",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "S"
}, {
  id: 1092,
  name: "SOAP FAIZA (NEEM)",
  price: 110,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1093,
  name: "SOAP FAIZA (PP)",
  price: 110,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1094,
  name: "SOAP GOLDEN PEARL (BLUE)",
  price: 125,
  categoryId: "soaps",
  categoryName: "Soaps",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "S"
}, {
  id: 1095,
  name: "SOAP GOLDEN PEARL (PINK)",
  price: 125,
  categoryId: "soaps",
  categoryName: "Soaps",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "S"
}, {
  id: 1096,
  name: "SOAP GOLDEN PEARL (YELLOW)",
  price: 125,
  categoryId: "soaps",
  categoryName: "Soaps",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "S"
}, {
  id: 1097,
  name: "SOAP IMPERIAL 175gm LARGE",
  price: 390,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1098,
  name: "SOAP IMPERIAL LEATHER SMALL",
  price: 239,
  categoryId: "soaps",
  categoryName: "Soaps",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "S"
}, {
  id: 1099,
  name: "SOAP LIFEBUOY (LARGE) GREEN RS,125",
  price: 119,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1100,
  name: "SOAP LIFEBUOY (MEDIUM) (BLUE) RS,95",
  price: 90,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1101,
  name: "SOAP LIFEBUOY (XL) BLUE RS,125",
  price: 119,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1102,
  name: "SOAP LIFEBUOY (XL) GREEN RS,125",
  price: 119,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1103,
  name: "SOAP PALMOLIVE (LARGE) RS,150 BLACK",
  price: 139,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1104,
  name: "SOAP PALMOLIVE (LARGE) RS,150 ORANGE",
  price: 139,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1105,
  name: "SOAP PALMOLIVE (LARGE) RS,150 YELLOW",
  price: 139,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1109,
  name: "SOAP PEARS (BLUE)",
  price: 399,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1110,
  name: "SOAP PEARS (GREEN)",
  price: 399,
  categoryId: "soaps",
  categoryName: "Soaps",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "S"
}, {
  id: 1111,
  name: "SOAP PEARS (ORANGE)",
  price: 399,
  categoryId: "soaps",
  categoryName: "Soaps"
}, {
  id: 1112,
  name: "SOAP SKIN WHITE (BLUE) RS,150",
  price: 129,
  categoryId: "soaps",
  categoryName: "Soaps",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "S"
}, {
  id: 1113,
  name: "SOAP SKIN WHITE (GREEN) RS,150",
  price: 129,
  categoryId: "soaps",
  categoryName: "Soaps",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "S"
}, {
  id: 1114,
  name: "SOAP SKIN WHITE (PINK) RS,150",
  price: 129,
  categoryId: "soaps",
  categoryName: "Soaps",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "S"
}, {
  id: 1115,
  name: "SOAP TIBET (LARGE FAMILY SIZE) RS,109",
  price: 104,
  categoryId: "soaps",
  categoryName: "Soaps",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "S"
}, {
  id: 1116,
  name: "SOAP TIBET (MEDIUM BATH SIZE) RS,89",
  price: 85,
  categoryId: "soaps",
  categoryName: "Soaps",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "S"
}, {
  id: 1117,
  name: "SOAP TIBET (SMALL STANDARD SIZE) RS,70",
  price: 66,
  categoryId: "soaps",
  categoryName: "Soaps",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "S"
}, {
  id: 1118,
  name: "SOFT TOUCH WONDER WAX LARGE GREEN",
  price: 249,
  categoryId: "personalcare",
  categoryName: "Personal Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "S"
}, {
  id: 1119,
  name: "SOFT TOUCH WONDER WAX LARGE LEMON",
  price: 249,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1120,
  name: "SOFT TOUCH WONDER WAX SMALL GREEN",
  price: 209,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1121,
  name: "SOFT TOUCH WONDER WAX SMALL LEMON",
  price: 209,
  categoryId: "personalcare",
  categoryName: "Personal Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "S"
}, {
  id: 1122,
  name: "STUD SPRAY 10000",
  price: 1350,
  categoryId: "condemn",
  categoryName: "Condoms"
}, {
  id: 1130,
  name: "SUNBLOCK RIVAJ (LARGE) RP,630",
  price: 579,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "S"
}, {
  id: 1131,
  name: "SUNBLOCK RIVAJ SPF 60 (SMALL) RP,300",
  price: 260,
  categoryId: "facewash",
  categoryName: "Face Wash",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "S"
}, {
  id: 1132,
  name: "TOY AUTO CAR",
  price: 50,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 1133,
  name: "TOY AUTO CAR METAL",
  price: 130,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 1134,
  name: "TOY BALL FOAM",
  price: 60,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 1135,
  name: "TOY BARREL O SLIME",
  price: 45,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 1136,
  name: "TOY BARREL O SLIME JAR LARGE 200g",
  price: 99,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 1137,
  name: "TOY CUBE BLOCKS GAME",
  price: 399,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 1139,
  name: "TOY BUBBLE CARTOON FACE (GOOD QUALITY)",
  price: 99,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 1145,
  name: "TOY CAR JUMPING LARGE PIECE 18 (DORAEMON)",
  price: 130,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 1148,
  name: "TOY CHORDI MAGIC GAME",
  price: 190,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 1149,
  name: "TOY CLAY LARGE",
  price: 85,
  categoryId: "sports",
  categoryName: "Sports & Toys",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "T"
}, {
  id: 1150,
  name: "TOY LASER LIGHT GUN",
  price: 0,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 1151,
  name: "TOY LIGHTING BALL",
  price: 0,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 1152,
  name: "TOY POP UP PATAKA (YELLOW)",
  price: 40,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 1154,
  name: "TOY WATER GUN",
  price: 120,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 1155,
  name: "TOY YOYO DORI (GOOD QUALITY)",
  price: 80,
  categoryId: "sports",
  categoryName: "Sports & Toys"
}, {
  id: 1156,
  name: "TAPE DOUBLE SIDED (2 INCH)",
  price: 120,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 1157,
  name: "TAPE DOUBLE SIDED (1 INCH)",
  price: 65,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "T"
}, {
  id: 1160,
  name: "TAPE KAGHAZ (0.5 INCH)",
  price: 40,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 1161,
  name: "TAPE KAGHAZ 1 INCH",
  price: 65,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "T"
}, {
  id: 1162,
  name: "TAPE KAGHAZ 2 INCH",
  price: 0,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 1163,
  name: "TAPE OSAKA (BLACK)",
  price: 50,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "T"
}, {
  id: 1164,
  name: "TAPE OSAKA (BLACK) FULL LENGTH",
  price: 65,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 1165,
  name: "TAPE OSAKA (RED)",
  price: 50,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "T"
}, {
  id: 1166,
  name: "TAPE OSAKA (RED) FULL LENGTH",
  price: 65,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 1167,
  name: "TAPE OSAKA (WHITE)",
  price: 50,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "T"
}, {
  id: 1168,
  name: "TAPE OSAKA (WHITE) FULL LENGTH",
  price: 65,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 1169,
  name: "TAPE PACKING BROWN (2 INCH)",
  price: 95,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "T"
}, {
  id: 1173,
  name: "TAPE TRANSPARENT (0.5 INCH) EX QUALITY",
  price: 35,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 1174,
  name: "TAPE TRANSPARENT (1 INCH)",
  price: 55,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "T"
}, {
  id: 1176,
  name: "TAPE TRANSPARENT (2 INCH)",
  price: 95,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "T"
}, {
  id: 1178,
  name: "TAPE TRANSPARENT RS,10",
  price: 8,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[2],
  initial: "T"
}, {
  id: 1179,
  name: "TASH ROYAAL",
  price: 180,
  categoryId: "sports",
  categoryName: "Sports & Toys",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "T"
}, {
  id: 1183,
  name: "TOOTH PICK DENTAL FLOSS",
  price: 59,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "T"
}, {
  id: 1184,
  name: "TOOTH PICK LARGE",
  price: 89,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "T"
}, {
  id: 1190,
  name: "TWEEZER GENTS",
  price: 120,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 1191,
  name: "TWEEZER LADIES",
  price: 120,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 1192,
  name: "TUSBHI (LED)",
  price: 135,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "T"
}, {
  id: 1194,
  name: "TUSBHI (LED) PATA",
  price: 115,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 1195,
  name: "TUSBHI (SADA)",
  price: 59,
  categoryId: "general",
  categoryName: "General Item & Others",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "T"
}, {
  id: 1196,
  name: "UHU PATA",
  price: 49,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "U"
}, {
  id: 1197,
  name: "UHU TUBE (# 11)",
  price: 110,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 1198,
  name: "UHU TUBE (# 12)",
  price: 165,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 1199,
  name: "UHU TUBE (# 13)",
  price: 275,
  categoryId: "stationary",
  categoryName: "Stationary & Tapes"
}, {
  id: 1200,
  name: "UNDERWEAR LADIES  BLACK & SKIN (LARGE) GOOD QUALITY (# 520)",
  price: 200,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1201,
  name: "UNDERWEAR LADIES  BLACK & SKIN (MEDIUM) GOOD QUALITY (# 320)",
  price: 200,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1202,
  name: "UNDERWEAR LADIES  BLACK & SKIN (SMALL) GOOD QUALITY (# 120)",
  price: 200,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1203,
  name: "UNDERWEAR LADIES  BLACK & SKIN (X,L) GOOD QUALITY (# 620)",
  price: 200,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1205,
  name: "VASELINE HAIR TONIC 100ml (ORIGINAL)",
  price: 499,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 1207,
  name: "VASELINE HAIR TONIC 200ml (ORIGINAL)",
  price: 899,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 1208,
  name: "VASELINE PETROLEUM (IMP) 250ML S,A (BLUE)",
  price: 899,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 1209,
  name: "VASELINE PETROLEUM (IMP) 100ml S,A (BLUE)",
  price: 399,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "V"
}, {
  id: 1210,
  name: "VASELINE PETROLEUM (IMP) 100ml S,A (COCA BUTTER)",
  price: 399,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 1211,
  name: "VASELINE PETROLEUM (IMP) 50ml S,A (BLUE)",
  price: 249,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "V"
}, {
  id: 1212,
  name: "VASELINE PETROLEUM (IMP) 50ml S,A (GREEN,ALOE FRESH)",
  price: 249,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "V"
}, {
  id: 1213,
  name: "VASELINE PETROLEUM (IMP) 50ml S,A (COCO BUTTER)",
  price: 249,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[6],
  initial: "V"
}, {
  id: 1214,
  name: "VASELINE PETROLEUM (IMP) 50ml S,A (PINK BABY)",
  price: 249,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[7],
  initial: "V"
}, {
  id: 1215,
  name: "VASELINE PETROLEUM (IMP) 50ml S,A (VITAMIN E)",
  price: 249,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "V"
}, {
  id: 1216,
  name: "VASELINE TIBET RS,130",
  price: 119,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "V"
}, {
  id: 1217,
  name: "VASELINE THERAPY PINK",
  price: 0,
  categoryId: "creams",
  categoryName: "Creams & Lotions"
}, {
  id: 1218,
  name: "VATIKA HAIR OIL 100ml (ALMOND) COMPANY RS,370",
  price: 339,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 1219,
  name: "VATIKA HAIR OIL 100ml (CACTUS) COMPANY RP,350",
  price: 319,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 1220,
  name: "VATIKA HAIR OIL 100ml (Coconut) COMPANY RP,350",
  price: 319,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "V"
}, {
  id: 1221,
  name: "VATIKA HAIR OIL 100ML (GARLIC) COMPANY RP,350",
  price: 319,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 1222,
  name: "VATIKA HAIR OIL 100ml (OLIVE) COMPANY RP,350",
  price: 319,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "V"
}, {
  id: 1223,
  name: "VATIKA HAIR OIL 200ml (ALMOND) COMPANY RP,640",
  price: 599,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 1224,
  name: "VATIKA HAIR OIL 200ml (CACTUS) COMPANY RP,640",
  price: 599,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "V"
}, {
  id: 1225,
  name: "VATIKA HAIR OIL 200ml (Coconut) COMPANY RP,640",
  price: 599,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 1226,
  name: "VATIKA HAIR OIL 200ml (GARLIC) COMPANY RP,640",
  price: 599,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 1227,
  name: "VATIKA HAIR OIL 200ml (OLIVE) COMPANY RP,640",
  price: 599,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "V"
}, {
  id: 1228,
  name: "VATIKA HAIR OIL 200ml (ONION) COMPANY RP,640",
  price: 599,
  categoryId: "haircolour",
  categoryName: "Hair Colour & Care & Oil"
}, {
  id: 1229,
  name: "VEET JAR LARGE (BLUE) RS,595",
  price: 559,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1230,
  name: "VEET JAR LARGE (GREEN) RS,595",
  price: 559,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1232,
  name: "VEET JAR LARGE (PINK) RS,595",
  price: 559,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1233,
  name: "VEET JAR SMALL (GREEN) RS,300",
  price: 269,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1234,
  name: "VEET JAR SMALL (BLUE) RS,300",
  price: 269,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1236,
  name: "VEET STRIPS (BLUE)",
  price: 399,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1237,
  name: "VEET STRIPS (GREEN)",
  price: 399,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1238,
  name: "VEET STRIPS (PINK)",
  price: 399,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1239,
  name: "VEET TUBE LARGE (BLUE) FULL SIZE",
  price: 799,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1240,
  name: "VEET TUBE MEDIUM (PINK) RP,495",
  price: 699,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1241,
  name: "VEET TUBE MEDIUM (BLUE) RP,495",
  price: 459,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1242,
  name: "VEET TUBE MEDIUM (GREEN) RP,495",
  price: 459,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1243,
  name: "VEET TUBE MEDIUM 50G (MIX)",
  price: 459,
  categoryId: "personalcare",
  categoryName: "Personal Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[0],
  initial: "V"
}, {
  id: 1244,
  name: "VEET TUBE SMALL 25G (MIX) RS,250",
  price: 229,
  categoryId: "personalcare",
  categoryName: "Personal Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "V"
}, {
  id: 1245,
  name: "VENEEZIA WAX (JAR)",
  price: 499,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1246,
  name: "VENEEZIA WAX (LARGE) RS,280",
  price: 249,
  categoryId: "personalcare",
  categoryName: "Personal Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "V"
}, {
  id: 1247,
  name: "VENEEZIA WAX (SMALL) RP,220",
  price: 195,
  categoryId: "personalcare",
  categoryName: "Personal Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[5],
  initial: "V"
}, {
  id: 1249,
  name: "VITAMIN (E) CAPSULES (FACIAL ESSENCE)",
  price: 5,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "V"
}, {
  id: 1250,
  name: "VITAMIN CAPSULE LARGE WHITE",
  price: 8,
  categoryId: "creams",
  categoryName: "Creams & Lotions",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "V"
}, {
  id: 1251,
  name: "WASH ROOM TIKI (GOOD QUALITY) FRESH",
  price: 150,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 1252,
  name: "WASH ROOM TIKI (SASTI)",
  price: 70,
  categoryId: "general",
  categoryName: "General Item & Others"
}, {
  id: 1255,
  name: "WAX PATI BUKRAM",
  price: 90,
  categoryId: "personalcare",
  categoryName: "Personal Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[1],
  initial: "W"
}, {
  id: 1256,
  name: "WHITE ROSE H,R JAR (LARGE) RS,280",
  price: 239,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1257,
  name: "WHITE ROSE H,R JAR (MEDIUM) RS,220",
  price: 199,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1258,
  name: "WHITE ROSE H,R JAR (SMALL) RS,190",
  price: 169,
  categoryId: "personalcare",
  categoryName: "Personal Care"
}, {
  id: 1259,
  name: "WIPES CHINA BABY",
  price: 99,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 1260,
  name: "WIPES JEEP CAMERA",
  price: 169,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 1261,
  name: "WIPES NEXTON",
  price: 0,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 1262,
  name: "WIPES PAMPER (NON ORIGINAL)",
  price: 249,
  categoryId: "babycare",
  categoryName: "Baby Care",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[4],
  initial: "W"
}, {
  id: 1264,
  name: "WIPES SOFT-CREAM (BLUE)",
  price: 129,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 1265,
  name: "WIPES SOFT-CREAM (WHITE)",
  price: 129,
  categoryId: "babycare",
  categoryName: "Baby Care"
}, {
  id: 1266,
  name: "ZERO MOSQUITO SACHET BOX RS,10",
  price: 8,
  categoryId: "mosquito",
  categoryName: "Anti-Mosquito",
  hasImage: true,
  gradient: SWATCH_GRADIENTS[3],
  initial: "Z"
}];
const PAGE_SIZE = 10;
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
function SahilTraders() {
  const products = PRODUCTS;
  const [language, setLanguage] = useState("en");
  const [showSplash, setShowSplash] = useState(true);
  const [fadeSplash, setFadeSplash] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState(null); // null = show category home
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchBoxRef = useRef(null);
  const [cartNotice, setCartNotice] = useState(false);
  const cartNoticeTimerRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Dynamically sync html lang attribute and title when language changes
  useEffect(() => {
    document.documentElement.lang = language;
    if (language === 'ur') {
      document.title = 'ساحل ٹریڈرز | ہول سیل اور پرچون | Sahil Traders';
    } else {
      document.title = 'Sahil Traders | Wholesale & Retail Pakistan';
    }
  }, [language]);

  // Hash Routing Listener: Supports shareable URLs (#category=catId or #product=prodId)
  useEffect(() => {
    function handleHashChange() {
      const hash = window.location.hash;
      if (hash.startsWith('#category=')) {
        const catId = decodeURIComponent(hash.replace('#category=', ''));
        setSelectedCategory(catId);
        setActiveCategory(catId);
      } else if (hash.startsWith('#product=')) {
        const prodId = parseInt(hash.replace('#product=', ''), 10);
        const prod = PRODUCTS.find(p => p.id === prodId);
        if (prod) setSelectedProduct(prod);
      } else if (!hash || hash === '#') {
        setSelectedCategory(null);
        setSelectedProduct(null);
      }
    }
    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);
  function selectCategoryWithHash(catId) {
    setSelectedCategory(catId);
    setActiveCategory(catId);
    if (catId) {
      window.location.hash = `category=${encodeURIComponent(catId)}`;
    } else {
      window.location.hash = '';
    }
  }
  function selectProductWithHash(prod) {
    setSelectedProduct(prod);
    if (prod) {
      window.location.hash = `product=${prod.id}`;
    } else if (selectedCategory) {
      window.location.hash = `category=${encodeURIComponent(selectedCategory)}`;
    } else {
      window.location.hash = '';
    }
  }

  // Ã¢â€â‚¬Ã¢â€â‚¬ CART STATE Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
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
  const [exitModalOpen, setExitModalOpen] = useState(false);
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
      selectedProduct,
      exitModalOpen,
      selectedCategory,
      selectedBrand,
      filterMenuOpen,
      searchTerm,
      isSearching,
      activeCategory
    };
  }, [checkoutOpen, cartOpen, selectedProduct, exitModalOpen, selectedCategory, selectedBrand, filterMenuOpen, searchTerm, isSearching, activeCategory]);

  // App Back Button Controller: browser/device Back restores the previous store screen first.
  useEffect(() => {
    const getSnapshot = state => ({
      checkoutOpen: !!state.checkoutOpen,
      cartOpen: !!state.cartOpen,
      selectedProductId: state.selectedProduct?.id || null,
      selectedCategory: state.selectedCategory || null,
      selectedBrand: state.selectedBrand || "all",
      filterMenuOpen: !!state.filterMenuOpen,
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
      setCheckoutOpen(!!snapshot.checkoutOpen);
      setCartOpen(!!snapshot.cartOpen);
      setSelectedProduct(snapshot.selectedProductId ? PRODUCTS.find(p => p.id === snapshot.selectedProductId) || null : null);
      setSearchTerm(snapshot.searchTerm || "");
      setSelectedCategory(snapshot.selectedCategory || null);
      setSelectedBrand(snapshot.selectedBrand || "all");
      setFilterMenuOpen(!!snapshot.filterMenuOpen);
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
  }, [checkoutOpen, cartOpen, selectedProduct, selectedCategory, selectedBrand, filterMenuOpen, searchTerm, activeCategory, exitModalOpen]);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  function addToCart(product, qty = 1) {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? {
          ...i,
          qty: i.qty + qty
        } : i);
      }
      return [...prev, {
        product,
        qty
      }];
    });
    showCartNotice();
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
      img.alt = product.name || '';
      img.loading = 'lazy';
      img.decoding = 'async';
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
  function updateQty(productId, delta) {
    setCart(prev => {
      const updated = prev.map(i => i.product.id === productId ? {
        ...i,
        qty: Math.max(0, i.qty + delta)
      } : i).filter(i => i.qty > 0);
      return updated;
    });
  }
  function removeFromCart(productId) {
    setCart(prev => prev.filter(i => i.product.id !== productId));
  }
  function clearCart() {
    setCart([]);
    try {
      localStorage.removeItem("sahil_traders_cart");
    } catch (e) {}
  }
  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

  // Ã¢â€â‚¬Ã¢â€â‚¬ CATEGORY VIEW STATE Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
  function handleGoBack() {
    setSearchTerm("");
    setSelectedCategory(null);
    setSelectedBrand("all");
    setFilterMenuOpen(false);
    setActiveCategory("all");
  }
  function handleSelectProductFromCart(product) {
    setCartOpen(false);
    if (product && product.categoryId) {
      setSelectedCategory(product.categoryId);
      setSelectedBrand("all");
      setFilterMenuOpen(false);
    }
    if (product && product.name) {
      setSearchTerm(product.name);
    }
    window.scrollTo({
      top: 180,
      behavior: 'smooth'
    });
  }
  // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

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
      const opacity = 0.05 + Math.random() * 0.07; // very faint, barely visible (0.05Ã¢â‚¬â€œ0.12)
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

    // Only preload first 20 images eagerly — rest load lazily as user scrolls
    // This dramatically speeds up mobile load time
    const allIds = Array.from(window.PRODUCT_IMAGES || []);
    const eagerIds = allIds.slice(0, 20);
    eagerIds.forEach(id => {
      const img = new Image();
      img.loading = 'lazy';
      img.decoding = 'async';
      img.src = `images/${id}.jpg`;
      img.onerror = () => {
        const fallback = new Image();
        fallback.loading = 'lazy';
        fallback.decoding = 'async';
        fallback.src = `images/${id}.png`;
      };
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
  }, [selectedCategory, searchTerm]);
  const baseFiltered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term === "") {
      if (selectedCategory) return products.filter(p => p.categoryId === selectedCategory);
      return products;
    }
    return products.filter(p => p.name.toLowerCase().includes(term));
  }, [products, selectedCategory, searchTerm]);
  const brandFilters = useMemo(() => {
    if (!selectedCategory || isSearching) return [];
    return getBrandFilters(baseFiltered);
  }, [baseFiltered, selectedCategory, isSearching]);
  const filtered = useMemo(() => {
    if (!selectedCategory || isSearching || selectedBrand === "all") return baseFiltered;
    return baseFiltered.filter(p => getProductFilterName(p) === selectedBrand);
  }, [baseFiltered, selectedCategory, isSearching, selectedBrand]);
  const suggestions = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term === "") return [];
    return products.filter(p => p.name.toLowerCase().includes(term)).slice(0, 6);
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
  const selectedCategoryName = selectedCategory ? langData.categories?.[selectedCategory] || CATEGORIES.find(c => c.id === selectedCategory)?.name || selectedCategory : null;
  return /*#__PURE__*/React.createElement("div", {
    className: "min-h-screen relative text-white overflow-x-hidden",
    style: {
      fontFamily: language === 'ur' ? "'Noto Sans Urdu', 'Inter', sans-serif" : "'Inter', system-ui, sans-serif"
    }
  }, showSplash && /*#__PURE__*/React.createElement("div", {
    className: `fixed inset-0 z-50 bg-[#020205] flex flex-col items-center justify-center transition-all duration-1000 ${fadeSplash ? "opacity-0 scale-105 pointer-events-none" : "opacity-100"}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 splash-grid opacity-40 pointer-events-none"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute inset-0 overflow-hidden pointer-events-none select-none"
  }, floatingSilhouettes.map(item => {
    return /*#__PURE__*/React.createElement("div", {
      key: item.id,
      className: "absolute transform-gpu text-black",
      style: {
        left: `${item.left}%`,
        top: `${item.top}%`,
        opacity: item.opacity,
        transform: `scale(${item.scale})`,
        animation: `float-drift-${item.animType} ${item.duration}s ease-in-out infinite`,
        animationDelay: `${item.delay}s`
      }
    }, /*#__PURE__*/React.createElement(item.Icon, {
      className: "w-16 h-16 sm:w-20 sm:h-20"
    }));
  })), /*#__PURE__*/React.createElement("div", {
    className: "absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent w-0 opacity-0 laser-line z-20"
  }), /*#__PURE__*/React.createElement("div", {
    className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] rounded-full bg-gradient-to-br from-amber-500/20 to-transparent blur-[50px] portal-glow pointer-events-none"
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setFadeSplash(true);
      setTimeout(() => setShowSplash(false), 500);
    },
    className: "absolute bottom-6 right-6 z-[60] bg-black/60 hover:bg-black/90 border border-gray-200 px-4 py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-widest text-gray-700 hover:text-black hover:border-gray-200 transition-all cursor-pointer pointer-events-auto flex items-center gap-1.5 shadow-lg backdrop-blur-sm"
  }, translate(langData, "skipIntro"), /*#__PURE__*/React.createElement("svg", {
    className: "w-3.5 h-3.5 text-gray-700",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M13 5l7 7-7 7M5 5l7 7-7 7"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "relative flex flex-col items-center gap-7 max-w-sm px-4 z-10"
  }, /*#__PURE__*/React.createElement("div", {
    className: "relative flex items-center justify-center w-40 h-32 sm:w-48 sm:h-40 group logo-emerge"
  }, /*#__PURE__*/React.createElement("img", {
    src: "images/sahil-traders-logo.png",
    alt: "Sahil Traders",
    loading: "lazy",
    decoding: "async",
    className: "w-full h-full object-contain drop-shadow-xl"
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-center text-carve"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "text-4xl sm:text-5xl font-black tracking-[0.2em] uppercase gold-shimmer",
    style: {
      fontFamily: "'Poppins', sans-serif"
    }
  }, "Sahil Traders")), /*#__PURE__*/React.createElement("div", {
    className: "w-48 h-[2px] bg-white/5 rounded-full overflow-hidden mt-3 relative text-carve"
  }, /*#__PURE__*/React.createElement("div", {
    className: "h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full gold-progress-bar"
  })), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-gray-700 font-semibold tracking-widest uppercase mt-1.5 animate-pulse"
  }, "Pre-caching Store Catalog & Images..."))), /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 -z-10 bg-white"
  }), /*#__PURE__*/React.createElement("header", {
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
    loading: "lazy",
    decoding: "async",
    className: "w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0"
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    className: "mobile-logo-title text-lg sm:text-xl font-black leading-tight tracking-widest uppercase",
    style: {
      fontFamily: "'Poppins', sans-serif",
      color: '#000000'
    }
  }, "Sahil Traders"))), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("select", {
    value: language,
    onChange: e => setLanguage(e.target.value),
    className: "border rounded-xl px-2.5 py-2 text-xs font-semibold transition-all cursor-pointer language-select-mobile",
    style: {
      background: '#ffffff',
      borderColor: 'rgba(0,0,0,0.12)',
      color: '#111111'
    },
    onMouseEnter: e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)',
    onMouseLeave: e => e.currentTarget.style.borderColor = 'rgba(0,0,0,0.12)'
  }, /*#__PURE__*/React.createElement("option", {
    value: "en",
    style: {
      background: '#ffffff',
      color: '#1a1a2e'
    }
  }, "English"), /*#__PURE__*/React.createElement("option", {
    value: "ur",
    style: {
      background: '#ffffff',
      color: '#1a1a2e'
    }
  }, "اردو")), /*#__PURE__*/React.createElement("button", {
    id: "cart-btn",
    onClick: () => setCartOpen(true),
    className: "relative flex items-center gap-2 border px-3 py-2 rounded-xl text-sm font-semibold transition-all cart-btn-mobile",
    style: {
      background: '#ffffff',
      borderColor: cartCount > 0 ? '#000000' : 'rgba(0,0,0,0.12)',
      color: '#111111'
    },
    onMouseEnter: e => e.currentTarget.style.borderColor = cartCount > 0 ? '#000000' : 'rgba(0,0,0,0.18)',
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
  }, "Cart"), cartCount > 0 && /*#__PURE__*/React.createElement("span", {
    className: "absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full text-[11px] font-black flex items-center justify-center",
    style: {
      background: 'linear-gradient(135deg,#000000,#000000)',
      color: '#ffffff'
    }
  }, cartCount)))), /*#__PURE__*/React.createElement("div", {
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
    onSelectCategory: selectCategoryWithHash,
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
  }, filtered.length, " ", translate(langData, "itemsLabel")))), brandFilters.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      marginBottom: 16,
      display: 'flex',
      justifyContent: 'flex-end'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setFilterMenuOpen(v => !v),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      border: '1px solid #111111',
      background: '#ffffff',
      color: '#111111',
      borderRadius: 999,
      padding: '9px 14px',
      fontSize: 12,
      fontWeight: 900,
      letterSpacing: '0.08em',
      textTransform: 'uppercase',
      cursor: 'pointer',
      boxShadow: '0 5px 16px rgba(0,0,0,0.08)'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      width: 15,
      height: 15
    },
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M3 5h18M6 12h12M10 19h4"
  })), "Filter", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: '#666666',
      letterSpacing: 0,
      textTransform: 'none'
    }
  }, selectedBrand === "all" ? 'All' : selectedBrand)), filterMenuOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: 0,
      top: 'calc(100% + 8px)',
      zIndex: 25,
      width: 'min(92vw, 360px)',
      background: '#ffffff',
      border: '1px solid #d1d5db',
      borderRadius: 16,
      padding: 12,
      boxShadow: '0 18px 45px rgba(0,0,0,0.16)'
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
  }, "(", brand.count, ")")))))), filtered.length === 0 ? /*#__PURE__*/React.createElement("div", {
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
  }, filtered.slice(0, visibleCount).map(p => /*#__PURE__*/React.createElement(ProductCard, {
    key: p.id,
    product: p,
    langData: langData,
    language: language,
    cartQty: cart.find(i => i.product.id === p.id)?.qty || 0,
    onAddToCart: addToCart,
    onFlyToCart: flyProductToCart,
    onSelectProduct: selectProductWithHash
  }))), visibleCount < filtered.length && /*#__PURE__*/React.createElement("div", {
    className: "flex justify-center mt-8 mb-4"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setVisibleCount(prev => prev + 24),
    className: "px-8 py-3 bg-black text-white font-bold rounded-xl shadow-lg hover:bg-gray-800 transition-all text-xs tracking-wider uppercase cursor-pointer border-none",
    "aria-label": "Load more products"
  }, language === 'ur' ? `مزید پروڈکٹس دیکھیں (${filtered.length - visibleCount} باقی)` : `Show More Products (${filtered.length - visibleCount} remaining)`))))), /*#__PURE__*/React.createElement("footer", {
    className: "border-t mt-10 py-8 text-center",
    style: {
      borderColor: 'rgba(0,0,0,0.12)'
    }
  }, /*#__PURE__*/React.createElement("p", {
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
  }, translate(langData, "added")))), /*#__PURE__*/React.createElement(CartDrawer, {
    open: cartOpen,
    cart: cart,
    cartTotal: cartTotal,
    langData: langData,
    onClose: () => setCartOpen(false),
    onUpdateQty: updateQty,
    onRemove: removeFromCart,
    onCheckout: () => {
      setCartOpen(false);
      setCheckoutOpen(true);
    },
    onSelectProduct: handleSelectProductFromCart
  }), /*#__PURE__*/React.createElement(ProductDetailModal, {
    product: selectedProduct,
    open: !!selectedProduct,
    onClose: () => selectProductWithHash(null),
    onAddToCart: (product, qty) => {
      addToCart(product, qty);
      selectProductWithHash(null);
    },
    langData: langData,
    language: language
  }), checkoutOpen && /*#__PURE__*/React.createElement(CheckoutModal, {
    cart: cart,
    cartTotal: cartTotal,
    langData: langData,
    onClose: () => setCheckoutOpen(false),
    onBack: () => {
      setCheckoutOpen(false);
      setCartOpen(true);
    },
    onOrderPlaced: () => {
      clearCart();
      setCheckoutOpen(false);
    }
  }), exitModalOpen && /*#__PURE__*/React.createElement("div", {
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
  }, language === 'ur' ? 'ویب سائٹ سے باہر جانا چاہتے ہیں؟' : 'Exit Sahil Traders?'), /*#__PURE__*/React.createElement("p", {
    className: "text-xs text-gray-700 mt-1.5 leading-relaxed"
  }, language === 'ur' ? 'کیا آپ واقعی Sahil Traders بند کرنا چاہتے ہیں؟' : 'Are you sure you want to leave the store?')), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-3 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      setExitModalOpen(false);
      setTimeout(() => restoreBackGuardRef.current(), 50);
    },
    className: "flex-1 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-black text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-all cursor-pointer"
  }, language === 'ur' ? 'نہیں، واپس رہیں' : 'No, Stay'), /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      if (window.sahilExitStore) window.sahilExitStore();
    },
    className: "flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-extrabold uppercase tracking-wider hover:brightness-110 transition-all shadow-md cursor-pointer"
  }, language === 'ur' ? 'ہاں، باہر جائیں' : 'Yes, Exit')))));
}

// Ã¢â€â‚¬Ã¢â€â‚¬ CATEGORY META (icons + gradients per category) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
// To add a category image: set the `image` field to a URL or relative file path.
// Example: image: 'images/soaps.jpg'  or  image: 'https://...'  Ã¢â‚¬â€ leave as '' to use default gradient+icon.
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
  birthday: {
    image: '',
    gradient: 'linear-gradient(135deg,#ff9a9e,#fecfef)',
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
      d: "M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "12",
      cy: "7",
      r: "4"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M12 1v3M10 2h4"
    }))
  },
  powders: {
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
    }, /*#__PURE__*/React.createElement("path", {
      d: "M3 6h18l-1.5 14H4.5L3 6z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M3 6l2-3h14l2 3"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 11c0 2 8 2 8 0"
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
  },
  others: {
    image: '',
    gradient: 'linear-gradient(135deg,#8e9eab,#eef2f3)',
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
      r: "1"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "19",
      cy: "12",
      r: "1"
    }), /*#__PURE__*/React.createElement("circle", {
      cx: "5",
      cy: "12",
      r: "1"
    }))
  }
};

// ————— CATEGORY HOME ————————————————————————————————————————————————————————————————————————————
function CategoryHome({
  products,
  onSelectCategory,
  langData
}) {
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14,
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
  }, CATEGORIES.length, " Categories · ", products.length.toLocaleString(), "+ Items")), /*#__PURE__*/React.createElement("div", {
    className: "cat-home-grid"
  }, CATEGORIES.map(cat => {
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
      onClick: () => onSelectCategory(cat.id),
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
        src: `images/${item.id}.${ext}`,
        alt: item.name,
        loading: "lazy",
        decoding: "async",
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
        padding: '14px 16px',
        background: '#ffffff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid rgba(0,0,0,0.12)'
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      className: "cat-card-title",
      style: {
        fontSize: '13px',
        fontWeight: 800,
        fontFamily: "'Poppins', sans-serif",
        letterSpacing: '0.02em',
        color: '#1a1a2e',
        lineHeight: 1.3,
        marginBottom: 3
      }
    }, langData.categories?.[cat.id] || cat.name), /*#__PURE__*/React.createElement("p", {
      className: "cat-card-subtitle",
      style: {
        fontSize: 12,
        color: '#555555',
        fontWeight: 600,
        letterSpacing: '0.03em',
        display: 'flex',
        alignItems: 'center',
        gap: 4
      }
    }, "Explore Catalog →")), /*#__PURE__*/React.createElement("div", {
      className: "w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300"
    }, /*#__PURE__*/React.createElement("svg", {
      className: "w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "3",
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
  langData
}) {
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
    className: "w-full text-left px-4 py-2.5 text-sm font-semibold border-b transition-colors",
    style: {
      borderColor: 'rgba(0,0,0,0.12)',
      color: activeCategory === "all" ? '#111111' : '#1a1a2e',
      background: activeCategory === "all" ? 'rgba(0,0,0,0.12)' : 'transparent'
    },
    onMouseEnter: e => {
      if (activeCategory !== 'all') e.currentTarget.style.background = 'rgba(0,0,0,0.12)';
    },
    onMouseLeave: e => {
      if (activeCategory !== 'all') e.currentTarget.style.background = 'transparent';
    }
  }, translate(langData, "allCategories")), CATEGORIES.map(c => /*#__PURE__*/React.createElement("button", {
    key: c.id,
    onClick: () => {
      setActiveCategory(c.id);
      setCatMenuOpen(false);
    },
    className: "w-full text-left px-4 py-2.5 text-sm border-b last:border-0 transition-colors",
    style: {
      borderColor: 'rgba(0,0,0,0.12)',
      color: activeCategory === c.id ? '#111111' : '#1a1a2e',
      background: activeCategory === c.id ? 'rgba(0,0,0,0.12)' : 'transparent',
      fontWeight: activeCategory === c.id ? '600' : '400'
    },
    onMouseEnter: e => {
      if (activeCategory !== c.id) e.currentTarget.style.background = 'rgba(0,0,0,0.12)';
    },
    onMouseLeave: e => {
      if (activeCategory !== c.id) e.currentTarget.style.background = 'transparent';
    }
  }, langData.categories?.[c.id] || c.name)));
}
function TruckIcon({
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    style: style,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "7",
    cy: "17",
    r: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "17",
    cy: "17",
    r: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5 17h2m10 0h2m-4 0h-6m-4 0H3V6a1 1 0 011-1h9v12m4-1v-4a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1"
  }));
}
function PackageIcon({
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    style: style,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
  }));
}
function ReturnIcon({
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    style: style,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    strokeWidth: "2.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 4v5h.582m15.356 2A8.001 8.001 0 1121.21 7.89M9 11l3-3 3 3"
  }));
}
function WhatsAppIcon({
  className,
  style
}) {
  return /*#__PURE__*/React.createElement("svg", {
    className: className,
    style: style,
    fill: "currentColor",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"
  }));
}
function PriceDisplay({
  product,
  size = 'sm',
  langData,
  language
}) {
  const {
    originalPrice
  } = parseProductPriceAndName(product.name);
  const isUrdu = language === 'ur';
  if (product.price === 0) {
    return /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: size === 'lg' ? 14 : 11,
        fontWeight: 600,
        color: '#9ca3af',
        letterSpacing: '0.04em'
      }
    }, isUrdu ? 'قیمت دستیاب نہیں' : 'Price N/A');
  }
  const hasDiscount = originalPrice && originalPrice > product.price;
  const savings = hasDiscount ? originalPrice - product.price : 0;
  const pct = hasDiscount ? Math.round(savings / originalPrice * 100) : 0;
  if (size === 'lg') {
    return /*#__PURE__*/React.createElement("div", {
      className: "flex flex-col gap-1"
    }, /*#__PURE__*/React.createElement("div", {
      className: "flex items-baseline gap-3"
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-3xl font-black text-black"
    }, "Rs. ", product.price.toLocaleString()), hasDiscount && /*#__PURE__*/React.createElement("span", {
      className: "text-base font-semibold text-gray-400 line-through"
    }, "Rs. ", originalPrice.toLocaleString())), hasDiscount && /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-bold text-green-600"
    }, isUrdu ? `آپ کی بچت: Rs. ${savings.toLocaleString()} (${pct}% OFF)` : `You save: Rs. ${savings.toLocaleString()} (${pct}% OFF)`));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-0.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline gap-1.5 flex-wrap"
  }, /*#__PURE__*/React.createElement("span", {
    className: "font-extrabold text-sm sm:text-base text-black"
  }, "Rs. ", product.price.toLocaleString()), hasDiscount && /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] sm:text-xs text-gray-400 line-through font-normal"
  }, "Rs. ", originalPrice.toLocaleString())), hasDiscount && /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] sm:text-[10px] font-bold text-green-600 leading-none"
  }, isUrdu ? `بچت: Rs. ${savings.toLocaleString()} (${pct}% OFF)` : `Save: Rs. ${savings.toLocaleString()} (${pct}% OFF)`));
}
function ProductDetailModal({
  product,
  open,
  onClose,
  onAddToCart,
  langData,
  language
}) {
  const [qty, setQty] = React.useState(1);
  const [addedText, setAddedText] = React.useState(false);
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      setQty(1);
      setAddedText(false);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  if (!open || !product) return null;
  const hasFile = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id];
  const imageSrc = hasFile ? `images/${product.id}.${window.PRODUCT_IMAGE_MAP[product.id]}` : null;
  const brandName = getProductBrand(product.name) || "N/A";
  const isUrdu = language === 'ur';
  function handleAddToCartClick() {
    onAddToCart(product, qty);
    setAddedText(true);
    setTimeout(() => {
      setAddedText(false);
    }, 2000);
  }
  const waNumber = window.STORE_CONFIG && window.STORE_CONFIG.whatsappNumber || '923368945775';
  const waText = encodeURIComponent(isUrdu ? `السلام علیکم! مجھے اس پروڈکٹ کے بارے میں پوچھنا ہے:\nپروڈکٹ کا نام: ${product.name}\nپروڈکٹ ID: ${product.id}` : `Assalam-o-Alaikum! I want to ask about this product:\nProduct: ${product.name}\nID: ${product.id}`);
  const waLink = `https://wa.me/${waNumber}?text=${waText}`;
  return /*#__PURE__*/React.createElement("div", {
    className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in",
    onClick: onClose
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white rounded-3xl w-full max-w-lg overflow-hidden relative shadow-2xl animate-scale-in",
    onClick: e => e.stopPropagation(),
    style: {
      maxHeight: '90vh',
      overflowY: 'auto'
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-black flex items-center justify-center transition-colors cursor-pointer border-none font-bold text-lg"
  }, "×"), /*#__PURE__*/React.createElement("div", {
    className: "p-6"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-full h-56 bg-gray-50 rounded-2xl flex items-center justify-center p-4 mb-6 relative overflow-hidden border border-gray-100"
  }, imageSrc ? /*#__PURE__*/React.createElement("img", {
    src: imageSrc,
    alt: product.name,
    loading: "lazy",
    decoding: "async",
    className: "max-w-full max-h-full object-contain"
  }) : product.hasImage ? /*#__PURE__*/React.createElement("div", {
    className: `w-32 h-32 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center shadow-lg`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-white text-4xl font-bold font-poppins"
  }, product.initial)) : /*#__PURE__*/React.createElement("div", {
    className: "w-24 h-24 rounded-xl bg-gray-100 flex flex-col items-center justify-center gap-1"
  }, /*#__PURE__*/React.createElement(ImageOff, {
    className: "w-8 h-8 text-gray-300"
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[10px] text-gray-400 font-medium"
  }, isUrdu ? 'تصویر نہیں ہے' : 'No Photo'))), /*#__PURE__*/React.createElement("h2", {
    className: "text-xl font-black text-black leading-tight mb-2 tracking-tight"
  }, getProductDisplayName(product, language)), /*#__PURE__*/React.createElement("div", {
    className: "mb-4"
  }, /*#__PURE__*/React.createElement(PriceDisplay, {
    product: product,
    size: "lg",
    langData: langData,
    language: language
  })), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-gray-100 my-4"
  }), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-y-2 text-xs mb-4"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-gray-400 font-medium"
  }, isUrdu ? 'دستیابی (Availability):' : 'Availability:'), /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-green-600 text-right"
  }, product.price === 0 ? isUrdu ? 'قیمت دستیاب نہیں' : 'Price N/A' : isUrdu ? 'اسٹاک میں ہے (In Stock)' : 'In Stock'), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-400 font-medium"
  }, isUrdu ? 'برانڈ (Brand):' : 'Brand:'), /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-gray-900 text-right"
  }, brandName), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-400 font-medium"
  }, isUrdu ? 'کیٹیگری (Category):' : 'Category:'), /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-gray-900 text-right"
  }, product.categoryName || product.categoryId)), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-gray-100 my-4"
  }), product.price !== 0 && /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3 mb-5 items-stretch"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center border border-gray-300 rounded-xl overflow-hidden shrink-0"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(q => Math.max(1, q - 1)),
    className: "px-3 py-2 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-600 font-bold border-none transition-colors cursor-pointer"
  }, "-"), /*#__PURE__*/React.createElement("span", {
    className: "w-8 text-center text-sm font-extrabold text-black"
  }, qty), /*#__PURE__*/React.createElement("button", {
    onClick: () => setQty(q => q + 1),
    className: "px-3 py-2 bg-gray-50 hover:bg-gray-100 active:bg-gray-200 text-gray-600 font-bold border-none transition-colors cursor-pointer"
  }, "+")), /*#__PURE__*/React.createElement("button", {
    onClick: handleAddToCartClick,
    className: "flex-1 py-3 rounded-xl text-xs font-black tracking-widest uppercase transition-all flex items-center justify-center gap-2 border-none cursor-pointer text-white",
    style: {
      background: addedText ? '#16a34a' : '#111111',
      boxShadow: addedText ? '0 8px 20px rgba(22,163,74,0.25)' : '0 8px 20px rgba(0,0,0,0.15)'
    }
  }, /*#__PURE__*/React.createElement(ShoppingBag, {
    className: "w-4 h-4"
  }), addedText ? isUrdu ? 'کارٹ میں شامل ہو گیا!' : 'Added to Cart!' : isUrdu ? 'کارٹ میں شامل کریں' : 'Add to Cart')), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 rounded-2xl p-4 border border-gray-100 flex flex-col gap-3 text-xs leading-normal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3 items-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-1.5 rounded-lg bg-black text-white shrink-0"
  }, /*#__PURE__*/React.createElement(TruckIcon, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-black"
  }, isUrdu ? 'ڈیلیوری کا وقت (Estimated Delivery):' : 'Estimated Delivery:'), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-700"
  }, isUrdu ? 'آج ہی یا 1 دن میں ڈیلیور ہوگا' : 'Today or 1 Day'))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3 items-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-1.5 rounded-lg bg-black text-white shrink-0"
  }, /*#__PURE__*/React.createElement(PackageIcon, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-black"
  }, isUrdu ? 'شپنگ چارجز (Free Shipping Policy):' : 'Free Shipping Policy:'), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-700"
  }, isUrdu ? 'کم سے کم Rs. 2,000 کے سامان پر فری شپنگ، ورنہ Rs. 99 چارجز لگیں گے' : 'Free shipping on orders above Rs. 2,000, otherwise Rs. 99 shipping charges apply'))), /*#__PURE__*/React.createElement("div", {
    className: "flex gap-3 items-start"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-1.5 rounded-lg bg-black text-white shrink-0"
  }, /*#__PURE__*/React.createElement(ReturnIcon, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-black"
  }, isUrdu ? 'تبدیلی اور واپسی (Returns & Exchange):' : 'Returns & Exchange:'), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-700"
  }, isUrdu ? 'اسی دن تبدیلی یا واپسی کی سہولت' : 'Same-day return and exchange policy'))), /*#__PURE__*/React.createElement("div", {
    className: "border-t border-gray-200 my-1"
  }), /*#__PURE__*/React.createElement("a", {
    href: waLink,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "flex gap-3 items-center hover:bg-green-50 p-1.5 rounded-xl transition-colors cursor-pointer text-decoration-none"
  }, /*#__PURE__*/React.createElement("div", {
    className: "p-1.5 rounded-lg bg-green-500 text-white shrink-0"
  }, /*#__PURE__*/React.createElement(WhatsAppIcon, {
    className: "w-4 h-4"
  })), /*#__PURE__*/React.createElement("div", {
    className: "flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-green-600"
  }, isUrdu ? 'کوئی سوال پوچھیں (Ask a Question):' : 'Ask a Question:'), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-700 font-medium"
  }, isUrdu ? 'سوالات کے لیے واٹس ایپ پر رابطہ کریں' : 'Have a query? Ask us on WhatsApp!')))))));
}
function ProductCard({
  product,
  langData,
  language,
  cartQty = 0,
  onAddToCart,
  onFlyToCart,
  onSelectProduct
}) {
  const [added, setAdded] = useState(false);
  const hasFile = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id];
  const [imgErr, setImgErr] = useState(!hasFile);
  useEffect(() => {
    if (cartQty === 0) setAdded(false);
  }, [cartQty]);
  function handleAdd(e) {
    onAddToCart(product);
    if (onFlyToCart) onFlyToCart(product, e.currentTarget);
    setAdded(true);
  }
  function handleImgError() {
    setImgErr(true);
  }
  const imageSrc = hasFile ? `images/${product.id}.${window.PRODUCT_IMAGE_MAP[product.id]}` : null;
  const isAdded = added || cartQty > 0;
  return /*#__PURE__*/React.createElement("div", {
    className: "product-card rounded-2xl overflow-hidden flex flex-col transition-all duration-300 group",
    style: {
      background: '#ffffff',
      border: '1px solid #e5e7eb',
      boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
    },
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = '#000000';
      e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
      e.currentTarget.style.transform = 'translateY(-3px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = '#e5e7eb';
      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
      e.currentTarget.style.transform = 'translateY(0)';
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: () => onSelectProduct?.(product),
    className: "product-img-area h-44 sm:h-48 w-full flex items-center justify-center p-2.5 relative overflow-visible cursor-pointer",
    style: {
      background: 'transparent'
    }
  }, !imgErr ? /*#__PURE__*/React.createElement("img", {
    src: imageSrc,
    alt: product.name,
    onError: handleImgError,
    loading: "lazy",
    decoding: "async",
    className: "product-card-main-img w-full h-full object-contain transition-transform duration-300 group-hover:scale-105",
    style: {
      filter: 'none'
    }
  }) : product.hasImage ? /*#__PURE__*/React.createElement("div", {
    className: `w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center shrink-0 shadow-lg`
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-white text-3xl sm:text-4xl font-bold",
    style: {
      fontFamily: "'Poppins', sans-serif"
    }
  }, product.initial)) : /*#__PURE__*/React.createElement("div", {
    className: "w-24 h-24 sm:w-28 sm:h-28 rounded-xl flex flex-col items-center justify-center gap-1 shrink-0",
    style: {
      background: 'rgba(0,0,0,0.12)'
    }
  }, /*#__PURE__*/React.createElement(ImageOff, {
    className: "w-7 h-7 sm:w-8 sm:h-8",
    style: {
      color: 'rgba(0,0,0,0.12)'
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "text-[9px] font-medium",
    style: {
      color: 'rgba(0,0,0,0.12)'
    }
  }, translate(langData, "noPhoto")))), /*#__PURE__*/React.createElement("div", {
    className: "h-px mx-3",
    style: {
      background: 'transparent'
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "product-card-body p-3.5 pt-2.5 flex flex-col gap-1.5 flex-1 bg-white"
  }, /*#__PURE__*/React.createElement("p", {
    onClick: () => onSelectProduct?.(product),
    className: "product-name-text text-xs sm:text-sm font-bold leading-snug line-clamp-2 tracking-tight cursor-pointer hover:text-green-600 transition-colors",
    style: {
      color: '#1a1a2e'
    }
  }, getProductDisplayName(product, language)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between text-[10px] my-0.5"
  }, /*#__PURE__*/React.createElement("span", {
    className: product.price === 0 ? "text-gray-400 font-semibold" : "text-green-600 font-bold"
  }, product.price === 0 ? language === 'ur' ? 'دستیاب نہیں' : 'Price N/A' : language === 'ur' ? '✓ اسٹاک میں ہے' : '✓ In Stock')), /*#__PURE__*/React.createElement("div", {
    className: "product-price-text font-extrabold text-sm sm:text-base"
  }, /*#__PURE__*/React.createElement(PriceDisplay, {
    product: product,
    size: "sm",
    langData: langData,
    language: language
  })), /*#__PURE__*/React.createElement("button", {
    onClick: product.price === 0 ? undefined : handleAdd,
    disabled: product.price === 0,
    className: "product-add-btn mt-auto w-full py-2 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2",
    style: {
      background: product.price === 0 ? '#e5e7eb' : isAdded ? '#16a34a' : '#111111',
      border: `1px solid ${product.price === 0 ? '#d1d5db' : isAdded ? '#15803d' : '#111111'}`,
      color: product.price === 0 ? '#9ca3af' : '#ffffff',
      boxShadow: product.price === 0 ? 'none' : isAdded ? '0 8px 18px rgba(22,163,74,0.24)' : '0 6px 14px rgba(0,0,0,0.16)',
      transform: 'translateY(0)',
      cursor: product.price === 0 ? 'not-allowed' : 'pointer'
    },
    onMouseEnter: e => {
      if (!isAdded && product.price !== 0) {
        e.currentTarget.style.background = '#1f2937';
        e.currentTarget.style.borderColor = '#1f2937';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }
    },
    onMouseLeave: e => {
      if (!isAdded && product.price !== 0) {
        e.currentTarget.style.background = '#111111';
        e.currentTarget.style.borderColor = '#111111';
        e.currentTarget.style.transform = 'translateY(0)';
      }
    }
  }, product.price === 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("svg", {
    className: "w-3.5 h-3.5",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
  })), "Price N/A") : isAdded ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("svg", {
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
    strokeWidth: "2",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 4.5v15m7.5-7.5h-15"
  })), translate(langData, "addToCart")))));
}

// Ã¢â€â‚¬Ã¢â€â‚¬ CART DRAWER Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function CartDrawer({
  open,
  cart,
  cartTotal,
  langData,
  onClose,
  onUpdateQty,
  onRemove,
  onCheckout,
  onSelectProduct
}) {
  const [deleteConfirm, setDeleteConfirm] = React.useState(null);
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);
  function handleMinusClick(productId, qty) {
    if (qty === 1) {
      setDeleteConfirm(productId);
    } else {
      onUpdateQty(productId, -1);
    }
  }
  function confirmDelete() {
    if (deleteConfirm) {
      onRemove(deleteConfirm);
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
  }, cart.length === 0 ? /*#__PURE__*/React.createElement("div", {
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
    qty
  }) => /*#__PURE__*/React.createElement("div", {
    key: product.id,
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
    className: "shrink-0 transition-transform active:scale-95",
    title: "Click to view product details"
  }, window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id] ? /*#__PURE__*/React.createElement("img", {
    src: `images/${product.id}.${window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id] || "png"}`,
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
      marginBottom: 4,
      overflow: 'hidden',
      display: '-webkit-box',
      WebkitLineClamp: 2,
      WebkitBoxOrient: 'vertical'
    },
    className: "hover:text-black hover:underline transition-colors",
    title: "Click to view product details"
  }, toTitleCase(product.name)), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 12,
      color: '#000000',
      fontWeight: 700
    }
  }, translate(langData, "priceLabel", {
    amount: product.price.toLocaleString()
  }), " × ", qty), /*#__PURE__*/React.createElement("p", {
    style: {
      display: 'inline-block',
      fontSize: 11,
      color: '#111111',
      background: '#ffffff',
      border: '1px solid rgba(0,0,0,0.18)',
      borderRadius: 8,
      padding: '2px 7px',
      fontWeight: 800,
      marginTop: 4
    }
  }, "= ", translate(langData, "priceLabel", {
    amount: (product.price * qty).toLocaleString()
  }))), /*#__PURE__*/React.createElement("div", {
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
    onClick: () => handleMinusClick(product.id, qty),
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
    onClick: () => handleMinusClick(product.id, qty),
    style: {
      width: 28,
      height: 28,
      border: 'none',
      background: 'none',
      color: '#000000',
      fontSize: 20,
      fontWeight: 700,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      transition: 'background 0.2s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(0,0,0,0.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'none'
  }, "−"), /*#__PURE__*/React.createElement("span", {
    style: {
      minWidth: 24,
      textAlign: 'center',
      fontSize: 14,
      fontWeight: 700,
      color: '#1a1a2e'
    }
  }, qty), /*#__PURE__*/React.createElement("button", {
    onClick: () => onUpdateQty(product.id, 1),
    style: {
      width: 28,
      height: 28,
      border: 'none',
      background: 'none',
      color: '#000000',
      fontSize: 20,
      fontWeight: 700,
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 8,
      transition: 'background 0.2s'
    },
    onMouseEnter: e => e.currentTarget.style.background = 'rgba(0,0,0,0.12)',
    onMouseLeave: e => e.currentTarget.style.background = 'none'
  }, "+"))))))), deleteConfirm && /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement("div", {
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

// Ã¢â€â‚¬Ã¢â€â‚¬ CHECKOUT MODAL Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
function CheckoutModal({
  cart,
  cartTotal,
  langData,
  onClose,
  onBack,
  onOrderPlaced
}) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);
  function validate() {
    const e = {};
    if (!name.trim()) e.name = translate(langData, "validationName") || 'Name is required';
    if (!phone.trim()) e.phone = translate(langData, "validationPhone") || 'Phone number is required';else if (!/^(\+92|0092|0)?[0-9]{10}$/.test(phone.replace(/[\s\-]/g, ''))) e.phone = translate(langData, "validationPhone") || 'Enter valid number (e.g. 03001234567 or +923001234567)';
    if (!address.trim()) e.address = translate(langData, "validationAddress") || 'Address is required';
    return e;
  }
  function handleOrder() {
    const e = validate();
    if (Object.keys(e).length > 0) {
      setErrors(e);
      return;
    }

    // Open window synchronously on user click to prevent browser popup blockers
    const win = window.open('about:blank', '_blank');
    setPlacing(true);
    const orderId = 'ST-' + Math.floor(100000 + Math.random() * 900000);
    const waNumber = window.STORE_CONFIG && window.STORE_CONFIG.whatsappNumber || '923368945775';

    // Build WhatsApp message
    const itemLines = cart.map(({
      product,
      qty
    }) => `• ${product.name}\n  Qty: ${qty}  |  Rate: Rs ${product.price.toLocaleString()}  |  Total: Rs ${(product.price * qty).toLocaleString()}`).join('\n\n');
    const deliveryCharges = cartTotal >= 2000 ? 0 : 99;
    const finalBill = cartTotal + deliveryCharges;
    const msg = [`📦 *NEW ORDER — ${orderId}*`, '──────────────────────────────────', '', '*📋 ORDER DETAILS:*', itemLines, '', '──────────────────────────────────', `*🛒 Subtotal: Rs ${cartTotal.toLocaleString()}*`, `*🚚 Delivery: ${deliveryCharges === 0 ? 'FREE (Order above 2000)' : `Rs ${deliveryCharges}`}*`, `*💰 TOTAL BILL: Rs ${finalBill.toLocaleString()}*`, '──────────────────────────────────', '', '*👤 CUSTOMER INFO:*', `• Name: ${name.trim()}`, `• Phone: ${phone.trim()}`, `• Address: ${address.trim()}`, '', '──────────────────────────────────', `📅 Date: ${new Date().toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`].join('\n');
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
    if (win) {
      win.location.href = waUrl;
    } else {
      window.location.href = waUrl;
    }
    setTimeout(() => {
      setPlacing(false);
      setSuccess(true);
      setTimeout(() => {
        onOrderPlaced();
      }, 2500);
    }, 500);
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
  }, success ? /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 48,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 72,
      height: 72,
      borderRadius: '50%',
      background: 'rgba(34,197,94,0.15)',
      border: '2px solid rgba(34,197,94,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    style: {
      width: 36,
      height: 36,
      color: '#4ade80'
    },
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2.5",
    viewBox: "0 0 24 24"
  }, /*#__PURE__*/React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M4.5 12.75l6 6 9-13.5"
  }))), /*#__PURE__*/React.createElement("h3", {
    style: {
      fontSize: 22,
      fontWeight: 800,
      color: '#000000',
      fontFamily: "'Poppins',sans-serif",
      marginBottom: 10
    }
  }, translate(langData, "orderPlacedSuccess")), /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 14,
      color: '#555555',
      lineHeight: 1.6
    }
  }, translate(langData, "successNotice"))) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
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
    qty
  }) => /*#__PURE__*/React.createElement("div", {
    key: product.id,
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
    src: `images/${product.id}.${window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id] || "png"}`,
    onError: e => {
      e.target.onerror = null;
    },
    alt: product.name,
    loading: "lazy",
    decoding: "async",
    className: "w-7 h-7 rounded-lg object-contain bg-black/40 p-0.5 shrink-0 border border-gray-200"
  }) : /*#__PURE__*/React.createElement("div", {
    className: `w-7 h-7 rounded-lg bg-gradient-to-br ${product.gradient} flex items-center justify-center shrink-0`
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: '#1a1a2e',
      fontSize: 10,
      fontWeight: 800
    }
  }, product.initial)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: '#1a1a2e',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    }
  }, toTitleCase(product.name))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12,
      color: '#000000',
      fontWeight: 700,
      whiteSpace: 'nowrap',
      flexShrink: 0
    }
  }, "× ", qty, " = ", translate(langData, "priceLabel", {
    amount: (product.price * qty).toLocaleString()
  }))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      padding: '12px 14px',
      border: '1px solid rgba(0,0,0,0.16)',
      borderRadius: 14,
      background: 'linear-gradient(135deg,#ffffff 0%,#f8fafc 100%)',
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      boxShadow: '0 6px 18px rgba(0,0,0,0.08)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: '#444',
      fontWeight: 600
    }
  }, translate(langData, "subtotal") || "Subtotal"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: '#111'
    }
  }, translate(langData, "priceLabel", {
    amount: cartTotal.toLocaleString()
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13,
      color: '#444',
      fontWeight: 600
    }
  }, translate(langData, "deliveryCharges") || "Delivery Charges"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      fontWeight: 700,
      color: cartTotal >= 2000 ? '#16a34a' : '#111'
    }
  }, cartTotal >= 2000 ? translate(langData, "freeDelivery") || "FREE" : translate(langData, "priceLabel", {
    amount: "99"
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: 'rgba(0,0,0,0.1)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: 4
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
    amount: (cartTotal + (cartTotal >= 2000 ? 0 : 99)).toLocaleString()
  }))), cartTotal >= 2000 && /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: '#16a34a',
      fontWeight: 600,
      textAlign: 'right',
      marginTop: -4
    }
  }, "*(Free delivery on orders above Rs. 2,000)*"))), /*#__PURE__*/React.createElement("div", {
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
  }, errors.phone)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("label", {
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
  }, errors.address))), /*#__PURE__*/React.createElement("div", {
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
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);
root.render(/*#__PURE__*/React.createElement(SahilTraders, null));