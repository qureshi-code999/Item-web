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
function unusedTranslateItemNameToUrdu(text) {
  if (!text) return "";
  let result = text.toUpperCase();

  // Pre-process common units and pricing patterns
  result = result.replace(/(\d+)\s*ML/g, "$1 Ã˜Â§Ã›Å’Ã™â€¦ Ã˜Â§Ã›Å’Ã™â€ž");
  result = result.replace(/(\d+)\s*G/g, "$1 ÃšÂ¯Ã˜Â±Ã˜Â§Ã™â€¦");
  result = result.replace(/(\d+)\s*KG/g, "$1 ÃšÂ©Ã™â€žÃ™Ë†");
  result = result.replace(/RS\.?\s*(\d+)/g, "Ã˜Â±Ã™Ë†Ã™Â¾Ã›â€™ $1");
  result = result.replace(/RP\.?\s*(\d+)/g, "Ã˜Â±Ã™Ë†Ã™Â¾Ã›â€™ $1");
  result = result.replace(/(\d+)\s*INCH/g, "$1 Ã˜Â§Ã™â€ Ãšâ€ ");
  const wordMap = {
    // Brands
    "PEARS": "Ã™Â¾Ã›Å’Ã˜Â±Ã˜Â²",
    "PONDS": "Ã™Â¾Ã™Ë†Ã™â€ ÃšË†Ã˜Â²",
    "SAFEGUARD": "Ã˜Â³Ã›Å’Ã™Â ÃšÂ¯Ã˜Â§Ã˜Â±ÃšË†",
    "SAFE GUARD": "Ã˜Â³Ã›Å’Ã™Â ÃšÂ¯Ã˜Â§Ã˜Â±ÃšË†",
    "DETTOL": "ÃšË†Ã›Å’Ã™Â¹Ã™Ë†Ã™â€ž",
    "DETOL": "ÃšË†Ã›Å’Ã™Â¹Ã™Ë†Ã™â€ž",
    "LIFEBUOY": "Ã™â€žÃ˜Â§Ã˜Â¦Ã™Â Ã˜Â¨Ã™Ë†Ã˜Â§Ã˜Â¦Ã›â€™",
    "LUX": "Ã™â€žÃšÂ©Ã˜Â³",
    "MEDORA": "Ã™â€¦Ã›Å’ÃšË†Ã™Ë†Ã˜Â±Ã˜Â§",
    "OLIVIA": "Ã˜Â§Ã™Ë†Ã™â€žÃ›Å’Ã™Ë†Ã›Å’Ã˜Â§",
    "TIBET": "Ã˜ÂªÃ˜Â¨Ã˜Âª",
    "CAPRI": "ÃšÂ©Ã›Å’Ã™Â¾Ã˜Â±Ã›Å’",
    "MECLAY": "Ã™â€¦Ã›Å’ÃšÂ©Ã™â€žÃ›â€™",
    "GARNIER": "ÃšÂ¯Ã˜Â§Ã˜Â±Ã™â€ Ã›Å’Ã˜Â¦Ã˜Â±",
    "VEET": "Ã™Ë†Ã›Å’Ã™Â¹",
    "FAIR & LOVELY": "Ã™ÂÃ›Å’Ã˜Â¦Ã˜Â± Ã˜Â§Ã›Å’Ã™â€ ÃšË† Ã™â€žÃ™Ë†Ã™â€žÃ›Å’",
    "FAIR AND LOVELY": "Ã™ÂÃ›Å’Ã˜Â¦Ã˜Â± Ã˜Â§Ã›Å’Ã™â€ ÃšË† Ã™â€žÃ™Ë†Ã™â€žÃ›Å’",
    "GOLDEN PEARL": "ÃšÂ¯Ã™Ë†Ã™â€žÃšË†Ã™â€  Ã™Â¾Ã˜Â±Ã™â€ž",
    "BIO AMLA": "Ã˜Â¨Ã˜Â§Ã˜Â¦Ã›Å’Ã™Ë† Ã˜Â¢Ã™â€¦Ã™â€žÃ›Â",
    "SUNSILK": "Ã˜Â³Ã™â€  Ã˜Â³Ã™â€žÃšÂ©",
    "PANTENE": "Ã™Â¾Ã›Å’Ã™â€ Ã™Â¹Ã›Å’Ã™â€ ",
    "DOVE": "ÃšË†Ã™Ë†",
    "SENSODYNE": "Ã˜Â³Ã™â€ Ã˜Â³Ã™Ë†ÃšË†Ã˜Â§Ã˜Â¦Ã™â€ ",
    "COLGATE": "ÃšÂ©Ã™Ë†Ã™â€žÃšÂ¯Ã›Å’Ã™Â¹",
    "DENTONIC": "ÃšË†Ã›Å’Ã™â€ Ã™Â¹Ã™Ë†Ã™â€ ÃšÂ©",
    "CLOSE UP": "ÃšÂ©Ã™â€žÃ™Ë†Ã˜Â² Ã˜Â§Ã™Â¾",
    "GILLETTE": "Ã˜Â¬Ã™â€žÃ›Å’Ã™Â¹",
    "LEMON MAX": "Ã™â€žÃ›Å’Ã™â€¦Ã™â€  Ã™â€¦Ã›Å’ÃšÂ©Ã˜Â³",
    "ARIEL": "Ã˜Â§Ã›Å’Ã˜Â±Ã›Å’Ã™â€ž",
    "SURF EXCEL": "Ã˜Â³Ã˜Â±Ã™Â Ã˜Â§Ã›Å’ÃšÂ©Ã˜Â³Ã™â€ž",
    "BONUS": "Ã˜Â¨Ã™Ë†Ã™â€ Ã˜Â³",
    "EXPRESS": "Ã˜Â§Ã›Å’ÃšÂ©Ã˜Â³Ã™Â¾Ã˜Â±Ã›Å’Ã˜Â³",
    "BRITE": "Ã˜Â¨Ã˜Â±Ã˜Â§Ã˜Â¦Ã™Â¹",
    "VIM": "Ã™Ë†Ã™ÂÃ™â€¦",
    "HARPIC": "Ã›ÂÃ˜Â§Ã˜Â±Ã™Â¾ÃšÂ©",
    "JOHNSONS": "Ã˜Â¬Ã˜Â§Ã™â€ Ã˜Â³Ã™â€ Ã˜Â²",
    "JOHNSON'S": "Ã˜Â¬Ã˜Â§Ã™â€ Ã˜Â³Ã™â€ Ã˜Â²",
    "ROSE PETAL": "Ã˜Â±Ã™Ë†Ã˜Â² Ã™Â¾Ã›Å’Ã™Â¹Ã™â€ž",
    "LIPTON": "Ã™â€žÃ™Â¾Ã™Â¹Ã™â€ ",
    "TAPAL": "Ã™Â¹Ã˜Â§Ã™Â¾Ã™â€ž",
    "NESTLE": "Ã™â€ Ã›Å’Ã˜Â³Ã™â€žÃ›â€™",
    "EVERYDAY": "Ã˜Â§Ã›Å’Ã™Ë†Ã˜Â±Ã›Å’ ÃšË†Ã›â€™",
    "SMILE": "Ã˜Â§Ã˜Â³Ã™â€¦Ã˜Â§Ã˜Â¦Ã™â€ž",
    "ALWAYS": "Ã˜Â¢Ã™â€žÃ™Ë†Ã›Å’Ã˜Â²",
    "ACNO FIGHT": "Ã˜Â§Ã›Å’ÃšÂ©Ã™â€ Ã™Ë† Ã™ÂÃ˜Â§Ã˜Â¦Ã™Â¹",
    "ACNO CLEAR": "Ã˜Â§Ã›Å’ÃšÂ©Ã™â€ Ã™Ë† ÃšÂ©Ã™â€žÃ›Å’Ã˜Â¦Ã˜Â±",
    "DERMI COOL": "ÃšË†Ã˜Â±Ã™â€¦Ã›Å’ ÃšÂ©Ã™Ë†Ã™â€ž",
    "EDEN ROCK": "Ã˜Â§Ã›Å’ÃšË†Ã™â€  Ã˜Â±Ã˜Â§ÃšÂ©",
    "IMPERIAL LEATHER": "Ã˜Â§Ã™â€¦Ã™Â¾Ã›Å’Ã˜Â±Ã›Å’Ã™â€ž Ã™â€žÃ›Å’Ã˜Â¯Ã˜Â±",
    "KOHE NOOR": "ÃšÂ©Ã™Ë†Ã›ÂÃ™Â Ã™â€ Ã™Ë†Ã˜Â±",
    "CHANBALI": "Ãšâ€ Ã˜Â§Ã™â€ Ã˜Â¯ Ã˜Â¨Ã˜Â§Ã™â€žÃ›Å’",
    // Product Types / Keywords
    "SOAP": "Ã˜ÂµÃ˜Â§Ã˜Â¨Ã™Ë†Ã™â€ ",
    "SHAMPOO": "Ã˜Â´Ã›Å’Ã™â€¦Ã™Â¾Ã™Ë†",
    "CREAM": "ÃšÂ©Ã˜Â±Ã›Å’Ã™â€¦",
    "LOTION": "Ã™â€žÃ™Ë†Ã˜Â´Ã™â€ ",
    "FACE WASH": "Ã™ÂÃ›Å’Ã˜Â³ Ã™Ë†Ã˜Â§Ã˜Â´",
    "FACEWASH": "Ã™ÂÃ›Å’Ã˜Â³ Ã™Ë†Ã˜Â§Ã˜Â´",
    "TOOTHPASTE": "Ã™Â¹Ã™Ë†Ã˜ÂªÃšÂ¾ Ã™Â¾Ã›Å’Ã˜Â³Ã™Â¹",
    "HAIR OIL": "Ã˜Â¨Ã˜Â§Ã™â€žÃ™Ë†ÃšÂº ÃšÂ©Ã˜Â§ Ã˜ÂªÃ›Å’Ã™â€ž",
    "OIL": "Ã˜ÂªÃ›Å’Ã™â€ž",
    "HAIR": "Ã˜Â¨Ã˜Â§Ã™â€ž",
    "DEO": "Ã˜Â¨Ã˜Â§ÃšË†Ã›Å’ Ã˜Â³Ã™Â¾Ã˜Â±Ã›â€™ / Ã™Â¾Ã˜Â§Ã˜Â¤ÃšË†Ã˜Â±",
    "DEODORANT": "ÃšË†Ã›Å’ Ã˜Â§Ã™Ë†ÃšË†Ã™Ë†Ã˜Â±Ã™â€ Ã™Â¹",
    "TALCUM": "Ã™Â¹Ã˜Â§Ã™â€žÃšÂ©Ã™â€¦",
    "POWDER": "Ã™Â¾Ã˜Â§Ã˜Â¤ÃšË†Ã˜Â±",
    "PERFUME": "Ã™Â¾Ã˜Â±Ã™ÂÃ›Å’Ã™Ë†Ã™â€¦",
    "BODY SPRAY": "Ã˜Â¨Ã˜Â§ÃšË†Ã›Å’ Ã˜Â³Ã™Â¾Ã˜Â±Ã›â€™",
    "SPRAY": "Ã˜Â§Ã˜Â³Ã™Â¾Ã˜Â±Ã›â€™",
    "DETERGENT": "Ã˜Â³Ã˜Â±Ã™Â",
    "BABY": "Ã˜Â¨Ã›Å’Ã˜Â¨Ã›Å’",
    "CARE": "ÃšÂ©Ã›Å’Ã˜Â¦Ã˜Â±",
    "SHAVING": "Ã˜Â´Ã›Å’Ã™Ë†Ã™â€ ÃšÂ¯",
    "BLADE": "Ã˜Â¨Ã™â€žÃ›Å’ÃšË†",
    "RAZOR": "Ã˜Â±Ã›Å’Ã˜Â²Ã˜Â±",
    "PAD": "Ã™Â¾Ã›Å’ÃšË†",
    "PADS": "Ã™Â¾Ã›Å’ÃšË†Ã˜Â²",
    "MAXI": "Ã™â€¦Ã›Å’ÃšÂ©Ã˜Â³Ã›Å’",
    "BALLOON": "Ã˜ÂºÃ˜Â¨Ã˜Â§Ã˜Â±Ã›Â",
    "TAPE": "Ã™Â¹Ã›Å’Ã™Â¾",
    "PACKING": "Ã™Â¾Ã›Å’ÃšÂ©Ã™â€ ÃšÂ¯",
    "GLYCERINE": "ÃšÂ¯Ã™â€žÃ›Å’Ã˜Â³Ã˜Â±Ã›Å’Ã™â€ ",
    "LIQUID": "Ã™â€žÃ›Å’ÃšÂ©Ã™Ë†Ã›Å’ÃšË†",
    "DISHWASH": "ÃšË†Ã˜Â´ Ã™Ë†Ã˜Â§Ã˜Â´",
    // Sizes / Attributes
    "SMALL": "Ãšâ€ ÃšÂ¾Ã™Ë†Ã™Â¹Ã˜Â§",
    "MEDIUM": "Ã˜Â¯Ã˜Â±Ã™â€¦Ã›Å’Ã˜Â§Ã™â€ Ã›Â",
    "LARGE": "Ã˜Â¨Ãšâ€˜Ã˜Â§",
    "BOX": "ÃšË†Ã˜Â¨Ã›Â",
    "PACK": "Ã™Â¾Ã›Å’ÃšÂ©",
    "PACKET": "Ã™Â¾Ã›Å’ÃšÂ©Ã™Â¹",
    "TUBE": "Ã™Â¹Ã›Å’Ã™Ë†Ã˜Â¨",
    "ROLL": "Ã˜Â±Ã™Ë†Ã™â€ž",
    "MIX": "Ã™â€¦ÃšÂ©Ã˜Â³",
    "PINK": "ÃšÂ¯Ã™â€žÃ˜Â§Ã˜Â¨Ã›Å’",
    "GREEN": "Ã˜Â³Ã˜Â¨Ã˜Â²",
    "BROWN": "Ã˜Â¨Ã˜Â±Ã˜Â§Ã˜Â¤Ã™â€ ",
    "BLUE": "Ã™â€ Ã›Å’Ã™â€žÃ˜Â§",
    "YELLOW": "Ã™Â¾Ã›Å’Ã™â€žÃ˜Â§",
    "RED": "Ã˜Â³Ã˜Â±Ã˜Â®",
    "BLACK": "ÃšÂ©Ã˜Â§Ã™â€žÃ˜Â§",
    "WHITE": "Ã˜Â³Ã™ÂÃ›Å’Ã˜Â¯",
    "GOLD": "ÃšÂ¯Ã™Ë†Ã™â€žÃšË†",
    "SILVER": "Ã˜Â³Ã™â€žÃ™Ë†Ã˜Â±",
    // Connectors
    "WITH": "ÃšÂ©Ã›â€™ Ã˜Â³Ã˜Â§Ã˜ÂªÃšÂ¾",
    "FOR": "ÃšÂ©Ã›â€™ Ã™â€žÃ›Å’Ã›â€™",
    "AND": "Ã˜Â§Ã™Ë†Ã˜Â±"
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
    'A': 'Ã˜Â§',
    'B': 'Ã˜Â¨',
    'C': 'ÃšÂ©',
    'D': 'ÃšË†',
    'E': 'Ã›Å’',
    'F': 'Ã™Â',
    'G': 'ÃšÂ¯',
    'H': 'Ã›Â',
    'I': 'Ã˜Â¢Ã˜Â¦Ã›Å’',
    'J': 'Ã˜Â¬',
    'K': 'ÃšÂ©',
    'L': 'Ã™â€ž',
    'M': 'Ã™â€¦',
    'N': 'Ã™â€ ',
    'O': 'Ã™Ë†',
    'P': 'Ã™Â¾',
    'Q': 'Ã™â€š',
    'R': 'Ã˜Â±',
    'S': 'Ã˜Â³',
    'T': 'Ã™Â¹',
    'U': 'Ã›Å’Ã™Ë†',
    'V': 'Ã™Ë†',
    'W': 'Ã™Ë†',
    'X': 'Ã˜Â§Ã›Å’ÃšÂ©Ã˜Â³',
    'Y': 'Ã™Ë†Ã˜Â§Ã˜Â¦Ã›â€™',
    'Z': 'Ã˜Â²Ã›Å’ÃšË†',
    '0': 'Ã›Â°',
    '1': 'Ã›Â±',
    '2': 'Ã›Â²',
    '3': 'Ã›Â³',
    '4': 'Ã›Â´',
    '5': 'Ã›Âµ',
    '6': 'Ã›Â¶',
    '7': 'Ã›Â·',
    '8': 'Ã›Â¸',
    '9': 'Ã›Â¹'
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
function getProductDisplayName(product, language) {
  if (language === "ur") {
    return translateItemNameToUrdu(product.name);
  }
  return toTitleCase(product.name);
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
var CATEGORIES = [{
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
function AboutUsModal({
  isOpen,
  onClose,
  language
}) {
  if (!isOpen) return null;
  const isUrdu = language === 'ur';
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
    className: "relative bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-6 pb-8 text-center"
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
  }, isUrdu ? 'کراچی کا قابلِ اعتماد ہول سیل و پرچون اسٹور — قائم شدہ 2021' : 'Trusted Wholesale & Retail Store — Est. 2021, Karachi')), /*#__PURE__*/React.createElement("div", {
    className: "p-6 overflow-y-auto space-y-5 flex-1 text-gray-800 text-sm leading-relaxed"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-red-50 border border-red-200 rounded-2xl p-4 text-red-950 space-y-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-black text-xs text-red-900 uppercase tracking-wide"
  }, "⚠️ ", isUrdu ? 'قیمتوں اور اسٹاک سے متعلق ضروری اعلان' : 'Important Notice — Please Read!'), /*#__PURE__*/React.createElement("p", {
    className: isUrdu ? 'font-urdu text-right text-xs leading-loose text-red-950 font-bold' : 'text-xs text-red-950 leading-relaxed font-semibold'
  }, isUrdu ? 'ہمارے پاس ہزاروں قسم کی چیزیں ہیں — اس وجہ سے کچھ چیزوں کا ریٹ مارکیٹ کے حساب سے کم یا زیادہ ہو سکتا ہے۔ لیکن ہم آپ سے وعدہ کرتے ہیں کہ ہمارا ریٹ ہمیشہ سب سے سستا ہوگا!' : 'We have thousands of different items — so some prices may go slightly up or down depending on the market. But we promise you: our prices will always be the cheapest you can find anywhere!')), /*#__PURE__*/React.createElement("div", {
    className: "bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-amber-950 shadow-sm"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-bold text-base mb-2 text-amber-900"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xl"
  }, "🏬"), /*#__PURE__*/React.createElement("span", null, isUrdu ? 'ہماری کہانی (Our Story)' : 'Our Story Since 2021')), /*#__PURE__*/React.createElement("p", {
    className: isUrdu ? 'font-urdu text-right text-sm leading-loose' : 'text-xs sm:text-sm text-gray-700 leading-normal'
  }, isUrdu ? 'ساحل ٹریڈرز کا آغاز 2021 میں کراچی سے ایک قابلِ اعتماد خاندانی ہول سیل بزنس کے طور پر ہوا۔ ہمارا مقصد تمام گاہکوں کو 4,000+ مصنوعات باضابطہ برانڈز سے براہِ راست ہول سیل قیمتوں پر فراہم کرنا ہے، چاہے وہ 1 آئٹم ہی کیوں نہ خرید رہے ہوں۔' : 'Established in 2021 in Karachi, Sahil Traders started as a trusted family wholesale business. Our mission is simple: bringing direct wholesale prices to retail customers across Pakistan on 4,000+ daily essentials and branded products.')), /*#__PURE__*/React.createElement("div", {
    className: "relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl p-4 shadow-lg border-2 border-amber-300"
  }, /*#__PURE__*/React.createElement("div", {
    className: "absolute top-2 right-2 bg-yellow-300 text-amber-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm"
  }, "🔥 ", isUrdu ? 'سب سے منفرد بات — شرطیہ' : 'Guaranteed Lowest Rates'), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2.5 mb-2 font-black text-base pr-20"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-2xl"
  }, "⚡"), /*#__PURE__*/React.createElement("span", {
    className: "tracking-wide"
  }, isUrdu ? 'پاکستان کے بڑے سے بڑے سپر مارٹ سے سستا!' : 'Lower Rates Than Any Supermart')), /*#__PURE__*/React.createElement("p", {
    className: isUrdu ? 'font-urdu text-right text-xs sm:text-sm font-semibold leading-relaxed text-amber-50' : 'text-xs sm:text-sm font-medium leading-relaxed text-amber-50'
  }, isUrdu ? 'ہمارے 90% سے زائد پروڈکٹس کے ریٹس پاکستان کے بڑے سے بڑے سپر مارٹ سے بھی کم ہوتے ہیں — شرطیہ! یہی ہماری سب سے بڑی خصوصیت اور منفرد بات ہے جس کی وجہ سے ہم نے یہ کام شروع کیا۔ اتنی زیادہ ورائٹی اور اتنی کم قیمت آپ کو اور کہیں نہیں ملے گی!' : 'Over 90% of our product prices are strictly lower than any big supermart across Pakistan — Guaranteed! This unique commitment to direct wholesale pricing and huge variety is the core reason why we started Sahil Traders.')), /*#__PURE__*/React.createElement("div", {
    className: "bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-800 rounded-2xl p-4 text-white shadow-md space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-black text-sm text-amber-400 uppercase tracking-wider border-b border-gray-800 pb-2"
  }, /*#__PURE__*/React.createElement("span", null, "🤝"), /*#__PURE__*/React.createElement("span", null, isUrdu ? 'قیادت اور پارٹنرشپ (Leadership & Partnership)' : 'Leadership & Partnership')), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-white/10 border border-white/10 rounded-xl p-3 flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-lg bg-amber-400 text-gray-950 font-black text-lg flex items-center justify-center shrink-0 shadow-sm"
  }, "🏬"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-extrabold uppercase text-amber-300 tracking-wider"
  }, isUrdu ? 'دکان کے مالکان (بڑے بھائی)' : 'Shop Owner (Elder Brother)'), /*#__PURE__*/React.createElement("div", {
    className: "font-black text-sm text-white"
  }, "Muhammad Zubair Moin"), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-300 font-medium"
  }, isUrdu ? 'آنر BS Mart' : 'Owner — BS Mart'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-white/10 border border-white/10 rounded-xl p-3 flex items-center gap-2.5"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-10 h-10 rounded-lg bg-yellow-400 text-gray-950 font-black text-lg flex items-center justify-center shrink-0 shadow-sm"
  }, "👨‍💻"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] font-extrabold uppercase text-yellow-300 tracking-wider"
  }, isUrdu ? 'ویب سائٹ میکر اور پارٹنر' : 'Website Creator & Partner'), /*#__PURE__*/React.createElement("div", {
    className: "font-black text-sm text-white"
  }, "Muhammad Sahil Saleem"), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-300 font-medium"
  }, isUrdu ? 'بانی و ڈیولپر' : 'Founder & Developer')))), /*#__PURE__*/React.createElement("p", {
    className: isUrdu ? 'font-urdu text-right text-xs text-amber-200/90 pt-1 leading-relaxed' : 'text-xs text-amber-200/90 pt-1 leading-relaxed'
  }, isUrdu ? '💡 یہ تمام تر سیٹ اپ اور بزنس محمد زبیر معین (مالک BS Mart) اور محمد ساحل سلیم دونوں بھائی مل کر مشترکہ طور پر چلا رہے ہیں۔' : '💡 This complete business setup is jointly managed by both brothers, Muhammad Zubair Moin (Owner, BS Mart) & Muhammad Sahil Saleem.')), /*#__PURE__*/React.createElement("div", {
    className: "bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-emerald-950 space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-bold text-sm text-emerald-900"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg"
  }, "🏬"), /*#__PURE__*/React.createElement("span", null, isUrdu ? 'ہماری فزیکل دکان (BS Mart)' : 'Visit Our Physical Shop (BS Mart)')), /*#__PURE__*/React.createElement("span", {
    className: "bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider"
  }, isUrdu ? 'BS مارٹ' : 'BS Mart')), /*#__PURE__*/React.createElement("p", {
    className: isUrdu ? 'font-urdu text-right text-xs sm:text-sm text-emerald-900 leading-relaxed font-semibold' : 'text-xs sm:text-sm text-emerald-900 leading-relaxed font-semibold'
  }, isUrdu ? 'ہے۔ ویب سائٹ پر موجود تقریباً تمام تر مصنوعات آپ کو ہماری دکان (BS Mart) پر بھی مل جائیں گی۔ (نوٹ: شارٹیج یا زیادہ ڈیمانڈ کی صورت میں شاید کچھ پروڈکٹس عارضی طور پر دکان پر اسٹاک میں نہ ہوں، لیکن ہم مسلسل ری اسٹاک کرتے ہیں!)' : 'Visit our physical shop BS Mart! Almost all items listed on this website are available in person at our store. (Note: Due to high demand or market shortage, certain items may temporarily be out of stock, but we restock continuously!)')), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 gap-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 border border-gray-200/70 p-3 rounded-2xl text-center flex flex-col items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl mb-1"
  }, "📦"), /*#__PURE__*/React.createElement("div", {
    className: "font-black text-gray-900 text-sm"
  }, "4,000+"), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-600 font-medium mt-0.5"
  }, isUrdu ? 'مصنوعات کی ورائٹی' : 'Total Products')), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 border border-gray-200/70 p-3 rounded-2xl text-center flex flex-col items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl mb-1"
  }, "🏷️"), /*#__PURE__*/React.createElement("div", {
    className: "font-black text-gray-900 text-sm"
  }, isUrdu ? 'ہول سیل ریٹس' : 'Wholesale Rates'), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-600 font-medium mt-0.5"
  }, isUrdu ? 'عام گاہکوں کے لیے' : 'For Everyone')), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 border border-gray-200/70 p-3 rounded-2xl text-center flex flex-col items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl mb-1"
  }, "💯"), /*#__PURE__*/React.createElement("div", {
    className: "font-black text-gray-900 text-sm"
  }, "100% Original"), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-600 font-medium mt-0.5"
  }, isUrdu ? 'اصلی برانڈز' : 'Genuine Brands')), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 border border-gray-200/70 p-3 rounded-2xl text-center flex flex-col items-center"
  }, /*#__PURE__*/React.createElement("div", {
    className: "text-2xl mb-1"
  }, "🚚"), /*#__PURE__*/React.createElement("div", {
    className: "font-black text-gray-900 text-sm"
  }, isUrdu ? 'فاسٹ ڈیلیوری' : 'Fast Delivery'), /*#__PURE__*/React.createElement("div", {
    className: "text-[11px] text-gray-600 font-medium mt-0.5"
  }, isUrdu ? 'پورے پاکستان میں' : 'Across Pakistan'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 text-purple-950 space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-bold text-sm text-purple-900"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg"
  }, "⏰"), /*#__PURE__*/React.createElement("span", null, isUrdu ? 'اوقاتِ کار (Business Hours)' : 'Store Business Hours')), /*#__PURE__*/React.createElement("div", {
    className: "bg-white/90 border border-purple-100 rounded-xl p-3 text-xs flex justify-between items-center shadow-xs"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-gray-900"
  }, isUrdu ? 'پیر تا ہفتہ (Monday to Saturday):' : 'Monday to Saturday:'), /*#__PURE__*/React.createElement("div", {
    className: "text-purple-700 font-extrabold text-sm mt-0.5"
  }, isUrdu ? 'صبح 8:00 بجے سے رات 11:30 بجے تک' : '8:00 AM – 11:30 PM')), /*#__PURE__*/React.createElement("span", {
    className: "bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-200 uppercase"
  }, isUrdu ? 'کھلا ہے' : 'Open'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-emerald-950 text-xs space-y-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-bold text-sm text-emerald-900"
  }, /*#__PURE__*/React.createElement("span", null, "✨"), /*#__PURE__*/React.createElement("span", null, isUrdu ? 'ہماری خصوصیات (Why Choose Us)' : 'Why Customers Trust Us')), /*#__PURE__*/React.createElement("ul", {
    className: "space-y-1.5 list-disc list-inside text-emerald-900"
  }, /*#__PURE__*/React.createElement("li", null, isUrdu ? '2021 سے خاندانی اعتماد کے ساتھ خدمت' : 'Family business serving with trust since 2021'), /*#__PURE__*/React.createElement("li", null, isUrdu ? 'Rs. 2,000 سے زائد پر مفت شپنگ (Free Delivery)' : 'Free delivery on orders above Rs. 2,000'), /*#__PURE__*/React.createElement("li", null, isUrdu ? 'اسی دن تبدیلی اور واپسی کی سہولت (Same-day Return)' : 'Same-day return & exchange policy'), /*#__PURE__*/React.createElement("li", null, isUrdu ? 'براہِ راست واٹس ایپ پر فوری سپورٹ' : 'Direct WhatsApp customer support'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 space-y-3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between gap-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-bold text-sm text-blue-950"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg"
  }, "📍"), /*#__PURE__*/React.createElement("span", null, isUrdu ? 'دکان کا مکمل پتہ اور نقشہ' : 'Store Address & Exact Location')), /*#__PURE__*/React.createElement("a", {
    href: "https://www.google.com/maps/search/?api=1&query=R4C4%2BRV6%2C+Safaid+White+Masjid+Rd%2C+Allah+Wala+Town+Sector+H+Korangi%2C+Karachi%2C+Pakistan",
    target: "_blank",
    rel: "noopener noreferrer",
    className: "text-[11px] font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1 text-decoration-none"
  }, isUrdu ? 'نقشہ کھولیں ↗' : 'Open Map ↗')), /*#__PURE__*/React.createElement("div", {
    className: "bg-white/90 border border-blue-100 rounded-xl p-3 text-xs text-gray-800 font-medium leading-relaxed flex items-start gap-2 shadow-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-blue-600 font-bold shrink-0 mt-0.5 text-sm"
  }, "🏬"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-gray-900"
  }, "Sahil Traders (Wholesale & Retail)"), /*#__PURE__*/React.createElement("div", {
    className: "text-gray-600 mt-0.5"
  }, isUrdu ? 'R4C4+RV6، سفید مسجد روڈ، اللہ والا ٹاؤن سیکٹر ایچ، کورنگی، کراچی، پاکستان' : 'R4C4+RV6, Safaid White Masjid Rd, Allah Wala Town Sector H Korangi, Karachi, Pakistan'))), /*#__PURE__*/React.createElement("div", {
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
    href: `https://wa.me/${window.STORE_CONFIG && window.STORE_CONFIG.whatsappNumber || '923368945775'}?text=${encodeURIComponent(isUrdu ? 'سلام! میں ساحل ٹریڈرز کے بارے میں معلومات حاصل کرنا چاہتا ہوں۔' : 'Hi Sahil Traders! I have an inquiry about your store.')}`,
    target: "_blank",
    rel: "noopener noreferrer",
    className: "flex-1 py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs tracking-wider uppercase text-center transition-colors flex items-center justify-center gap-2 text-decoration-none"
  }, /*#__PURE__*/React.createElement("span", null, "💬"), /*#__PURE__*/React.createElement("span", null, isUrdu ? 'واٹس ایپ پر رابطہ کریں' : 'Chat on WhatsApp')), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "py-3 px-5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
  }, isUrdu ? 'بند کریں' : 'Close'))));
}
function WelcomeDisclaimerModal({
  isOpen,
  onClose,
  onOpenAbout,
  language
}) {
  if (!isOpen) return null;
  const isUrdu = language === 'ur';
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
  }, isUrdu ? 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ' : 'Assalam U alaikum!'), /*#__PURE__*/React.createElement("h4", {
    className: "text-lg font-extrabold text-amber-600 mt-1 font-poppins"
  }, isUrdu ? 'ساحل ٹریڈرز میں خوش آمدید' : 'Welcome to Sahil Traders'), /*#__PURE__*/React.createElement("div", {
    className: "my-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-center gap-1.5 font-bold text-sm text-amber-900 mb-1.5"
  }, "📢 ", isUrdu ? 'ضروری گزارش / اعلان' : 'Important Notice'), /*#__PURE__*/React.createElement("p", {
    className: isUrdu ? 'font-urdu text-right text-xs leading-loose' : 'text-xs text-gray-700 leading-normal text-left'
  }, isUrdu ? 'ہماری آپ سے گزارش ہے کہ ایک بار ہمارا "About Us (ہماری معلومات)" سیکشن لازمی پڑھ لیں، تاکہ آپ کو تمام ضروری اور اہم معلومات مل سکیں اور خریداری میں کوئی مسئلہ پیش نہ آئے۔' : 'We kindly request you to please read our "About Us" section at least once so you get all the essential information and shop with complete clarity.')), /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col gap-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      onOpenAbout();
      onClose();
    },
    className: "w-full py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs tracking-wider uppercase transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
  }, "📖 ", isUrdu ? 'ہماری معلومات پڑھیں (Read About Us)' : 'Read About Us'), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "w-full py-2.5 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs tracking-wider uppercase transition-all cursor-pointer"
  }, isUrdu ? 'ٹھیک ہے، آگے بڑھیں' : 'Understood, Continue'))));
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
  const imageSrc = hasFile ? `images/${product.id}.${window.PRODUCT_IMAGE_MAP[product.id]}` : null;
  const handleDirectWhatsAppOrder = () => {
    const pName = getProductDisplayName(product, language);
    const total = product.price * modalQty;
    const msg = `Assalam U Alaikum Sahil Traders!\nI want to order this item directly:\n\n📦 *Product:* ${pName}\n🔢 *Quantity:* ${modalQty}\n💰 *Price:* Rs ${product.price.toLocaleString()} x ${modalQty} = *Rs ${total.toLocaleString()}*\n\nPlease confirm my order.`;
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
  }, isUrdu ? 'پروڈکٹ کی مکمل تفصیلات' : 'Product Details & Info'), /*#__PURE__*/React.createElement("span", {
    className: "bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-200"
  }, isUrdu ? 'بہترین ہول سیل ریٹ' : 'Wholesale Rate')), /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "w-8 h-8 rounded-full bg-gray-200 hover:bg-black hover:text-white text-gray-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
  }, "✕")), /*#__PURE__*/React.createElement("div", {
    className: "p-5 overflow-y-auto space-y-5 flex-1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-col sm:flex-row gap-4 items-center sm:items-start bg-gradient-to-br from-gray-50 to-amber-50/30 p-4 rounded-2xl border border-gray-200 shadow-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "w-36 h-36 sm:w-40 sm:h-40 shrink-0 bg-white rounded-2xl p-2.5 border border-gray-200 flex items-center justify-center shadow-sm relative group"
  }, hasFile ? /*#__PURE__*/React.createElement("img", {
    src: imageSrc,
    alt: product.name,
    loading: "lazy",
    decoding: "async",
    className: "w-full h-full object-contain"
  }) : /*#__PURE__*/React.createElement("div", {
    className: `w-full h-full rounded-xl bg-gradient-to-br ${product.gradient || 'from-amber-400 to-amber-600'} flex items-center justify-center text-white text-4xl font-black`
  }, product.initial || 'P'), /*#__PURE__*/React.createElement("span", {
    className: "absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider"
  }, "Original")), /*#__PURE__*/React.createElement("div", {
    className: "flex-1 space-y-2.5 text-center sm:text-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex flex-wrap gap-1.5 justify-center sm:justify-start items-center"
  }, /*#__PURE__*/React.createElement("span", {
    className: "bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase"
  }, isUrdu ? '✓ اسٹاک میں دستیاب' : '✓ In Stock'), product.categoryName && /*#__PURE__*/React.createElement("span", {
    className: "bg-gray-200 text-gray-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full"
  }, product.categoryName)), /*#__PURE__*/React.createElement("h3", {
    className: "text-base font-black text-gray-900 leading-snug"
  }, getProductDisplayName(product, language)), /*#__PURE__*/React.createElement("div", {
    className: "flex items-baseline justify-center sm:justify-start gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-2xl font-black text-black"
  }, "Rs. ", product.price.toLocaleString()), /*#__PURE__*/React.createElement("span", {
    className: "text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200"
  }, isUrdu ? 'سپر مارکیٹ سے سستا' : 'Cheaper than Supermarts')), /*#__PURE__*/React.createElement("div", {
    className: "pt-1 flex items-center justify-center sm:justify-start gap-3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-xs font-bold text-gray-700"
  }, isUrdu ? 'تعداد (Quantity):' : 'Quantity:'), /*#__PURE__*/React.createElement("div", {
    className: "flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-2xs"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => setModalQty(q => Math.max(1, q - 1)),
    className: "w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-sm flex items-center justify-center cursor-pointer transition-colors"
  }, "-"), /*#__PURE__*/React.createElement("span", {
    className: "w-10 text-center font-black text-sm text-black"
  }, modalQty), /*#__PURE__*/React.createElement("button", {
    onClick: () => setModalQty(q => q + 1),
    className: "w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-sm flex items-center justify-center cursor-pointer transition-colors"
  }, "+"))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: () => {
      for (let i = 0; i < modalQty; i++) onAddToCart(product);
      onClose();
    },
    className: "w-full py-2.5 px-3 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
  }, /*#__PURE__*/React.createElement("span", null, "🛒"), /*#__PURE__*/React.createElement("span", null, translate(langData, "addToCart"))), /*#__PURE__*/React.createElement("button", {
    onClick: handleDirectWhatsAppOrder,
    className: "w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
  }, /*#__PURE__*/React.createElement("span", null, "💬"), /*#__PURE__*/React.createElement("span", null, isUrdu ? 'واٹس ایپ پر آرڈر کریں' : 'Buy on WhatsApp'))))), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs"
  }, /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg"
  }, "💯"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-gray-900"
  }, isUrdu ? '100% اصلی آئٹم' : '100% Original'), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-gray-500"
  }, isUrdu ? 'گارنٹی شدہ معیار' : 'Guaranteed Quality'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg"
  }, "🚚"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-gray-900"
  }, isUrdu ? 'ہوم ڈیلیوری' : 'Home Delivery'), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-gray-500"
  }, isUrdu ? 'Rs. 2000+ پر مفت' : 'Free on Rs 2000+'))), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-lg"
  }, "🏬"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "font-bold text-gray-900"
  }, isUrdu ? 'دکان سے پک اپ' : 'Store Pickup'), /*#__PURE__*/React.createElement("div", {
    className: "text-[10px] text-gray-500"
  }, isUrdu ? 'BS Mart دکان سے لیں' : 'BS Mart Shop Karachi')))), relatedProducts.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "space-y-3 pt-2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center justify-between"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2 font-black text-sm text-gray-900 uppercase tracking-wider"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-amber-500 text-base"
  }, "✨"), /*#__PURE__*/React.createElement("span", null, isUrdu ? 'یہ بھی دیکھیں (Related Products)' : 'You May Also Like')), /*#__PURE__*/React.createElement("span", {
    className: "text-[11px] text-gray-400 font-medium"
  }, relatedProducts.length, " ", isUrdu ? 'مصنوعات' : 'items')), /*#__PURE__*/React.createElement("div", {
    className: "grid grid-cols-2 sm:grid-cols-3 gap-2.5"
  }, relatedProducts.map(rel => {
    const relHasFile = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[rel.id];
    const relImgSrc = relHasFile ? `images/${rel.id}.${window.PRODUCT_IMAGE_MAP[rel.id]}` : null;
    return /*#__PURE__*/React.createElement("div", {
      key: rel.id,
      onClick: () => onSelectProduct && onSelectProduct(rel),
      className: "bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-2.5 flex flex-col justify-between transition-all cursor-pointer group shadow-xs hover:shadow-md"
    }, /*#__PURE__*/React.createElement("div", {
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
    }, /*#__PURE__*/React.createElement("span", {
      className: "text-xs font-extrabold text-black"
    }, "Rs.", rel.price), /*#__PURE__*/React.createElement("button", {
      onClick: e => {
        e.stopPropagation();
        onAddToCart(rel);
      },
      className: "w-6 h-6 rounded-lg bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center transition-colors cursor-pointer",
      title: "Quick Add to Cart"
    }, "+")));
  })))), /*#__PURE__*/React.createElement("div", {
    className: "p-3 border-t border-gray-100 bg-gray-50 text-center"
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    className: "w-full py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
  }, isUrdu ? 'بند کریں' : 'Close'))));
}
function SahilTraders() {
  const products = PRODUCTS;
  const [aboutOpen, setAboutOpen] = useState(false);
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
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]);
  const searchBoxRef = useRef(null);
  const [cartNotice, setCartNotice] = useState(false);
  const cartNoticeTimerRef = useRef(null);

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
      filterMenuOpen,
      searchTerm,
      isSearching,
      activeCategory
    };
  }, [checkoutOpen, cartOpen, exitModalOpen, selectedCategory, selectedBrand, filterMenuOpen, searchTerm, isSearching, activeCategory]);

  // App Back Button Controller: browser/device Back restores the previous store screen first.
  useEffect(() => {
    const getSnapshot = state => ({
      checkoutOpen: !!state.checkoutOpen,
      cartOpen: !!state.cartOpen,
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
  }, [checkoutOpen, cartOpen, selectedCategory, selectedBrand, filterMenuOpen, searchTerm, activeCategory, exitModalOpen]);
  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.product.price * i.qty, 0);
  function addToCart(product) {
    setCart(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      if (existing) {
        return prev.map(i => i.product.id === product.id ? {
          ...i,
          qty: i.qty + 1
        } : i);
      }
      return [...prev, {
        product,
        qty: 1
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
      img.src = `images/${id}.jpg`;
      img.onerror = () => {
        const fallback = new Image();
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
    setVisibleCount(24);
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
  }, [filtered, sortBy]);
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
    className: "min-h-screen relative text-gray-900 overflow-x-hidden",
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
  }), /*#__PURE__*/React.createElement("div", {
    className: "bg-gray-900 text-white text-[11px] font-medium py-1.5 px-4 shadow-inner border-b border-gray-800"
  }, /*#__PURE__*/React.createElement("div", {
    className: "max-w-6xl mx-auto flex items-center justify-between gap-2 flex-wrap text-gray-200"
  }, /*#__PURE__*/React.createElement("div", {
    className: "flex items-center gap-2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-amber-400 font-bold"
  }, "⏰ ", language === 'ur' ? 'ڈیلیوری ٹائمنگ:' : 'Delivery Timing:'), /*#__PURE__*/React.createElement("span", {
    className: "font-semibold text-white"
  }, language === 'ur' ? 'صبح 10:00 بجے سے رات 8:00 بجے تک (پیر تا ہفتہ)' : '10:00 AM – 8:00 PM (Mon – Sat)')), /*#__PURE__*/React.createElement("div", {
    className: "hidden sm:flex items-center gap-3 text-[10px] text-gray-400"
  }, /*#__PURE__*/React.createElement("span", null, "🚚 ", language === 'ur' ? 'مفت ڈیلیوری Rs. 2,000 سے زائد پر' : 'Free Shipping on Rs. 2,000+'), /*#__PURE__*/React.createElement("span", null, "•"), /*#__PURE__*/React.createElement("span", null, "💬 ", language === 'ur' ? 'واٹس ایپ آرڈرز جاری' : 'WhatsApp Orders Active')))), /*#__PURE__*/React.createElement("header", {
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
    onClick: () => setAboutOpen(true),
    className: "flex items-center gap-1.5 border px-2.5 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-gray-50 cursor-pointer",
    style: {
      background: '#ffffff',
      borderColor: 'rgba(0,0,0,0.12)',
      color: '#111111'
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-sm"
  }, "🏬"), /*#__PURE__*/React.createElement("span", {
    className: "hidden sm:inline"
  }, language === 'ur' ? 'ہمارے بارے میں' : 'About Us')), /*#__PURE__*/React.createElement("button", {
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
  }, language === 'ur' ? 'ترتیب:' : 'Sort:'), /*#__PURE__*/React.createElement("select", {
    value: sortBy,
    onChange: e => setSortBy(e.target.value),
    className: "bg-transparent text-xs font-bold text-gray-900 cursor-pointer outline-none border-none py-0.5 pr-1"
  }, /*#__PURE__*/React.createElement("option", {
    value: "default"
  }, language === 'ur' ? 'عام ترتیب (Default)' : 'Default Order'), /*#__PURE__*/React.createElement("option", {
    value: "price_asc"
  }, language === 'ur' ? 'قیمت: کم سے زیادہ (Low to High)' : 'Price: Low to High'), /*#__PURE__*/React.createElement("option", {
    value: "price_desc"
  }, language === 'ur' ? 'قیمت: زیادہ سے کم (High to Low)' : 'Price: High to Low'), /*#__PURE__*/React.createElement("option", {
    value: "popularity"
  }, language === 'ur' ? 'مقبول ترین (Popularity)' : 'Popularity / Featured'), /*#__PURE__*/React.createElement("option", {
    value: "name_asc"
  }, language === 'ur' ? 'نام: A سے Z (Name: A-Z)' : 'Name: A to Z'))), brandFilters.length > 1 && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
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
    d: "M3 5h18M6 12h10M10 19h4"
  })), "Filter", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 10,
      color: '#666666',
      letterSpacing: 0,
      textTransform: 'none'
    }
  }, selectedBrand === "all" ? 'All' : selectedBrand)), filterMenuOpen && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
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
    cartQty: cart.find(i => i.product.id === p.id)?.qty || 0,
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
  })), /*#__PURE__*/React.createElement("span", null, language === 'ur' ? `مزید اشیاء دیکھیں (${Math.min(visibleCount, sortedProducts.length)} / ${sortedProducts.length})` : `Load More Items (${Math.min(visibleCount, sortedProducts.length)} of ${sortedProducts.length})`)))))), /*#__PURE__*/React.createElement("footer", {
    className: "border-t mt-10 py-8 text-center",
    style: {
      borderColor: 'rgba(0,0,0,0.12)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mb-3 inline-flex items-center gap-2 text-xs font-bold text-gray-800 border border-gray-200 rounded-full px-4 py-1.5 bg-gray-50 shadow-xs"
  }, /*#__PURE__*/React.createElement("span", {
    className: "text-amber-600"
  }, "⏰"), /*#__PURE__*/React.createElement("span", null, language === 'ur' ? 'ڈیلیوری ٹائمنگ: صبح 10:00 بجے سے رات 8:00 بجے تک (پیر تا ہفتہ)' : 'Delivery Timing: 10:00 AM – 8:00 PM (Mon – Sat)')), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    onClick: () => setAboutOpen(true),
    className: "mb-3 inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-black border border-gray-300 rounded-full px-4 py-1.5 transition-colors cursor-pointer bg-white"
  }, /*#__PURE__*/React.createElement("span", null, "🏬"), /*#__PURE__*/React.createElement("span", null, language === 'ur' ? 'ہمارے بارے میں (About Sahil Traders)' : 'About Sahil Traders'))), /*#__PURE__*/React.createElement("p", {
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
    onClose: () => setCartOpen(false),
    onUpdateQty: updateQty,
    onRemove: removeFromCart,
    onCheckout: () => {
      setCartOpen(false);
      setCheckoutOpen(true);
    },
    onSelectProduct: handleSelectProductFromCart
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
  // Only attempt image loading if this product's image file exists in images/ folder
  const hasFile = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id];
  const [imgErr, setImgErr] = useState(!hasFile);
  const [imgType, setImgType] = useState('jpg'); // Try jpg first, then png

  useEffect(() => {
    if (cartQty === 0) setAdded(false);
  }, [cartQty]);
  function handleAdd(e) {
    e.stopPropagation();
    onAddToCart(product);
    if (onFlyToCart) onFlyToCart(product, e.currentTarget);
    setAdded(true);
  }
  function handleImgError() {
    if (imgType === 'jpg') {
      setImgType('png');
    } else {
      setImgErr(true);
    }
  }
  const imageSrc = hasFile ? `images/${product.id}.${imgType}` : null;
  const isAdded = added || cartQty > 0;
  return /*#__PURE__*/React.createElement("div", {
    onClick: () => onSelectProduct && onSelectProduct(product),
    className: "product-card rounded-2xl overflow-hidden flex flex-col transition-all duration-300 group cursor-pointer",
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
    className: "product-img-area h-44 sm:h-48 w-full flex items-center justify-center p-2.5 relative overflow-visible",
    style: {
      background: 'transparent'
    }
  }, !imgErr ? /*#__PURE__*/React.createElement("img", {
    src: imageSrc,
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
    className: "product-name-text text-xs sm:text-sm font-bold leading-snug line-clamp-2 tracking-tight",
    style: {
      color: '#1a1a2e'
    }
  }, getProductDisplayName(product, language)), /*#__PURE__*/React.createElement("p", {
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
  }, "🚚"), /*#__PURE__*/React.createElement("span", null, cartTotal >= 2000 ? '🎉 Mubarak! Free Delivery Unlocked!' : `Free Delivery on Rs 2,000+ (Rs ${(2000 - cartTotal).toLocaleString()} remaining)`)), /*#__PURE__*/React.createElement("div", {
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
  }, /*#__PURE__*/React.createElement("span", null, "🏠 Home Delivery Available"), /*#__PURE__*/React.createElement("span", null, "🏬 BS Mart Pickup Free"))), cart.length === 0 ? /*#__PURE__*/React.createElement("div", {
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
  const [deliveryMethod, setDeliveryMethod] = useState("home");
  const [errors, setErrors] = useState({});
  const [placing, setPlacing] = useState(false);
  const [success, setSuccess] = useState(false);
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

    // Build WhatsApp message
    const itemLines = cart.map(({
      product,
      qty
    }) => `\u{2022} ${product.name}\n   Qty: ${qty}  |  Rate: Rs ${product.price.toLocaleString()}  |  Total: Rs ${(product.price * qty).toLocaleString()}`).join('\n\n');
    const deliveryText = deliveryMethod === 'pickup' ? '\u{1F3EC} Store Pickup (BS Mart Shop)\n  \u{23F1}\u{FE0F} Pickup Time: Ready in 20 Mins to 1 Hour' : `\u{1F69A} Home Delivery (${deliveryFee === 0 ? 'FREE Delivery' : 'Rs 150 Delivery Fee'})`;
    const msg = ['\u{1F6D2} *NEW ORDER — Sahil Traders*', '═════════════════════════', '', '*\u{1F4E6} ORDER DETAILS:*', itemLines, '', '═════════════════════════', `*Subtotal:* Rs ${cartTotal.toLocaleString()}`, `*Delivery:* ${deliveryText}`, `*\u{1F4B0} TOTAL BILL: Rs ${grandTotal.toLocaleString()}*`, '═════════════════════════', '', '*\u{1F464} CUSTOMER INFO:*', `\u{2022} Name: ${name.trim()}`, `\u{2022} Phone: ${phone.trim()}`, deliveryMethod === 'home' ? `\u{2022} Delivery Address: ${address.trim()}` : `\u{2022} Store Location: BS Mart Shop (Muhammad Zubair Moin & Sahil Saleem)\n  \u{23F1}\u{FE0F} Note: Order will be ready for pickup in 20 mins to 1 hour`, '', '═════════════════════════', `\u{1F4C5} Date: ${new Date().toLocaleDateString('en-PK', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`].join('\n');
    const waUrl = `https://wa.me/923368945775?text=${encodeURIComponent(msg)}`;

    // Open WhatsApp immediately on user action to avoid browser popup blocker freeze
    window.open(waUrl, '_blank');
    setPlacing(false);
    setSuccess(true);
    setTimeout(() => {
      onOrderPlaced();
    }, 1500);
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
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      fontSize: 11,
      fontWeight: 900,
      color: '#111111',
      letterSpacing: '0.2em',
      textTransform: 'uppercase'
    }
  }, "Delivery Option"), /*#__PURE__*/React.createElement("div", {
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
  }, "Home Delivery"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 10,
      color: '#6b7280',
      marginTop: 2
    }
  }, cartTotal >= 2000 ? 'FREE' : 'Rs 150')), /*#__PURE__*/React.createElement("div", {
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
  }, "🏬"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      fontWeight: 800,
      color: '#111',
      marginTop: 4
    }
  }, "Store Pickup"), /*#__PURE__*/React.createElement("div", {
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
