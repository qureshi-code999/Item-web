import React, { useState, useMemo, useEffect, useRef } from "react";

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
      return toTitleCase(text);
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
        'A': 'Ã˜Â§', 'B': 'Ã˜Â¨', 'C': 'ÃšÂ©', 'D': 'ÃšË†', 'E': 'Ã›Å’', 'F': 'Ã™Â', 'G': 'ÃšÂ¯', 'H': 'Ã›Â', 'I': 'Ã˜Â¢Ã˜Â¦Ã›Å’', 'J': 'Ã˜Â¬', 'K': 'ÃšÂ©', 'L': 'Ã™â€ž', 'M': 'Ã™â€¦', 'N': 'Ã™â€ ', 'O': 'Ã™Ë†', 'P': 'Ã™Â¾', 'Q': 'Ã™â€š', 'R': 'Ã˜Â±', 'S': 'Ã˜Â³', 'T': 'Ã™Â¹', 'U': 'Ã›Å’Ã™Ë†', 'V': 'Ã™Ë†', 'W': 'Ã™Ë†', 'X': 'Ã˜Â§Ã›Å’ÃšÂ©Ã˜Â³', 'Y': 'Ã™Ë†Ã˜Â§Ã˜Â¦Ã›â€™', 'Z': 'Ã˜Â²Ã›Å’ÃšË†',
        '0': 'Ã›Â°', '1': 'Ã›Â±', '2': 'Ã›Â²', '3': 'Ã›Â³', '4': 'Ã›Â´', '5': 'Ã›Âµ', '6': 'Ã›Â¶', '7': 'Ã›Â·', '8': 'Ã›Â¸', '9': 'Ã›Â¹'
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
    function Search({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
      );
    }

    function ChevronDown({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      );
    }

    function ShoppingBag({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <path d="M16 10a4 4 0 0 1-8 0"></path>
        </svg>
      );
    }

    function ImageOff({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="1" y1="1" x2="23" y2="23"></line>
          <path d="M21 21H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3m4 0h9a2 2 0 0 1 2 2v12"></path>
          <circle cx="9.5" cy="9.5" r="1.5"></circle>
        </svg>
      );
    }

    function X({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      );
    }

    function Store({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
          <polyline points="9 22 9 12 15 12 15 22"></polyline>
        </svg>
      );
    }

    function Clock({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      );
    }

    function EditIcon({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      );
    }

    function TrashIcon({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      );
    }

    function PlusIcon({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
      );
    }

    function ShampooIcon({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 21a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v11z" />
          <path d="M12 2v6" />
          <path d="M9 5h6" />
          <path d="M10 13h4" />
          <path d="M10 17h4" />
        </svg>
      );
    }

    function SoapIcon({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="18" height="12" rx="3" />
          <circle cx="7" cy="12" r="1" />
          <circle cx="10" cy="10" r="1.5" />
          <circle cx="14" cy="14" r="1" />
          <circle cx="17" cy="11" r="2" />
        </svg>
      );
    }

    function FaceWashIcon({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M6 3h12l-2 15H8L6 3z" />
          <path d="M9 18h6v3H9z" />
          <path d="M8 8h8" />
          <path d="M10 12h4" />
        </svg>
      );
    }

    function CreamIcon({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 9h14v9a3 3 0 0 1-3 3H8a3 3 0 0 1-3-3V9z" />
          <rect x="4" y="5" width="16" height="4" rx="1" />
          <path d="M5 14c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 4 2" />
        </svg>
      );
    }

    function RazorIcon({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 8v13" />
          <rect x="6" y="3" width="12" height="5" rx="1.5" />
          <line x1="8" y1="5" x2="16" y2="5" />
          <line x1="8" y1="6.5" x2="16" y2="6.5" />
          <line x1="11" y1="12" x2="13" y2="12" />
          <line x1="11" y1="15" x2="13" y2="15" />
          <line x1="11" y1="18" x2="13" y2="18" />
        </svg>
      );
    }

    function PerfumeIcon({ className }) {
      return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="5" y="10" width="14" height="11" rx="2" />
          <rect x="10" y="7" width="4" height="3" />
          <path d="M12 3v4" />
          <path d="M9 3h6" />
          <path d="M5 5c-1-1-2-1-3 0" />
          <path d="M19 5c1-1 2-1 3 0" />
        </svg>
      );
    }

    // --- Product Categories and Data ---
    var CATEGORIES = [
      { id: "soaps",        name: "Soaps" },
      { id: "shampoo",      name: "Shampoo & Conditioner" },
{ id: "creams",       name: "Creams & Lotions" },
{ id: "stationary",   name: "Stationary & Tapes" },
      { id: "sports",       name: "Sports & Toys" },
{ id: "birthday",     name: "Birthday" },
      { id: "powders",      name: "Powders" },
{ id: "shaving",      name: "Shaving & Razers & Blades" },
      { id: "haircolour",   name: "Hair Colour & Care & Oil" },
{ id: "condemn",      name: "Condoms" },
      { id: "lock",         name: "Lock & Cells" },
      { id: "general",      name: "General Item & Others" },
{ id: "babycare",     name: "Baby Care" },
{ id: "mosquito",     name: "Anti-Mosquito" },
      { id: "personalcare", name: "Personal Care" },
      { id: "others",       name: "Others" },
    
      { id: "fragnances",        name: "Fragnances" },
      { id: "toothpasteandbrush",        name: "Tooth Paste & Brush" },
      { id: "facewash",        name: "Face Wash" },];

    var SWATCH_GRADIENTS = [
      "from-amber-400 to-orange-500",
      "from-violet-500 to-purple-600",
      "from-emerald-400 to-teal-600",
      "from-rose-400 to-pink-600",
      "from-sky-400 to-blue-600",
      "from-fuchsia-400 to-purple-600",
      "from-teal-400 to-cyan-600",
      "from-indigo-400 to-violet-600",
    ];
    var PRODUCTS = [

      { id: 1, name: "7 HERBAL OIL 100ML RS,250", price: 220, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 2, name: "7 HERBAL OIL 200ML RP,400", price: 369, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 3, name: "7 HERBAL OIL 50ML RS,170", price: 155, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 5, name: "AL RASHIEED OIL 100ML SASSO", price: 480, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 6, name: "ALOE VERA GEL TUBE (LARGE)", price: 140, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "A" },
      { id: 7, name: "ALOE VERA GEL TUBE 160ml (MEDIUM) 160ML", price: 99, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "A" },
      { id: 8, name: "ALOE VERA GEL TUBE (SMALL) 80ML", price: 70, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "A" },
      { id: 14, name: "SNOW FALL SPRAY (LARGE)", price: 180, categoryId: "birthday", categoryName: "Birthday" },
      { id: 15, name: "SNOW FALL SPRAY SMALL", price: 120, categoryId: "birthday", categoryName: "Birthday" },
      { id: 16, name: "SNOW FALL SPRAY SMALL (KIWI)", price: 140, categoryId: "birthday", categoryName: "Birthday" },
      { id: 17, name: "BAJAJ ALMOND OIL 100ml", price: 950, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 18, name: "BALL ADIDAS", price: 100, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 21, name: "BALL CA GOOD QUALITY (NON ORIGINAL)", price: 120, categoryId: "sports", categoryName: "Sports & Toys" , filterName: "CA" },
      { id: 22, name: "BALL CA GOOD QUALITY (ORIGINAL)", price: 250, categoryId: "sports", categoryName: "Sports & Toys" , filterName: "CA" },
      { id: 23, name: "BALL FINE (ORIGINAL)", price: 170, categoryId: "sports", categoryName: "Sports & Toys", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "B" },
      { id: 26, name: "BALL PEN MAX (BLACK)", price: 30, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 27, name: "BALL PEN MAX (BLUE)", price: 30, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 28, name: "BALL PEN MAX (RED)", price: 30, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 29, name: "BALL PEN PEN (SKY) BLACK", price: 15, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 30, name: "BALL PEN PEN (SKY) BLUE", price: 15, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 31, name: "BALL PEN PEN (SKY) RED", price: 15, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 32, name: "BALL PEN PIANO YELLOW BLUE CAP", price: 15, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 33, name: "BALL PEN PICASSO BLUE", price: 18, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 34, name: "BALL PEN PICASSO RED", price: 18, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 37, name: "BALL POINT PEN SIGNATURE (BLACK)", price: 18, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 38, name: "BALL POINT PEN SIGNATURE (BLUE)", price: 18, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 46, name: "BANYAN (# 38)", price: 165, categoryId: "general", categoryName: "General Item & Others" },
      { id: 47, name: "BANYAN (# 40)", price: 175, categoryId: "general", categoryName: "General Item & Others" },
      { id: 48, name: "BANYAN (# 42)", price: 185, categoryId: "general", categoryName: "General Item & Others" },
      { id: 49, name: "BANYAN (# 44)" ,price: 195, categoryId: "others", categoryName: "Others" },
      { id: 50, name: "BANYAN CHILD  30# GOOD QUALITY", price: 80, categoryId: "general", categoryName: "General Item & Others" },
      { id: 51, name: "BIO AMLA HAIR OIL 100ml RS,280", price: 190, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
      { id: 52, name: "BIO AMLA HAIR OIL 200ml FARVAL ORIGINAL RS,475", price: 380, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 53, name: "BIO AMLA HAIR OIL 50ml FARVAL ORIGINAL RS,160", price: 140, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 54, name: "BIRTHDAY CANDLE 0 TO 9 NUMBERS", price: 50, categoryId: "birthday", categoryName: "Birthday", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "B" },
      { id: 59, name: "BLACK COBRA SPRAY 300ML", price: 420, categoryId: "mosquito", categoryName: "Anti-Mosquito", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "B" },
      { id: 60, name: "HUDA BEAUTY MASK SACHET", price: 50, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 61, name: "BLADE 7 O CLOCK GREEN", price: 80, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "B" },
      { id: 62, name: "BLADE TREET (BLACK)", price: 70, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "B" },
      { id: 64, name: "BLADE TREET (PLATINUM)", price: 90, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 65, name: "BODY RAZOR TINKLE (DOUBLE PACK SAFETY)", price: 190, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
      { id: 66, name: "BODY RAZOR TWINKLE LADIES (EYEBROW)", price: 75, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "B" },
      { id: 67, name: "BODY SPRAY (INDO) MIX", price: 240, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "B" },
      { id: 68, name: "BODY SPRAY AXE (CHOCOLATE)", price: 690, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "B" },
      { id: 69, name: "BODY SPRAY AXE (MIX)", price: 690, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "B" },
      { id: 70, name: "BODY SPRAY BOLD (MIX) OLD SLIM", price: 690, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "B" },
      { id: 71, name: "BODY SPRAY BRUT (GREEN)", price: 790, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 72, name: "BODY SPRAY CHI CHI (BLUE) FOR MEN", price: 690, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 73, name: "BODY SPRAY CHI CHI (CRAZY GIRL)", price: 690, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 75, name: "BODY SPRAY CHI CHI (PINK) WOMEN", price: 690, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "B" },
      { id: 76, name: "BODY SPRAY CHI CHI (SOLID)", price: 690, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "B" },
      { id: 77, name: "BODY SPRAY DUNHILL DESIRE (BLACK)", price: 640, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 78, name: "BODY SPRAY DUNHILL DESIRE (BLUE)", price: 640, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 79, name: "BODY SPRAY DUNHILL DESIRE (RED)", price: 640, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 81, name: "BODY SPRAY EVERY ONE", price: 590, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "B" },
      { id: 82, name: "BODY SPRAY FERRARI (MIX)", price: 390, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 83, name: "BODY SPRAY FOGG (BLACK) MARCO (PK)", price: 949, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "B" },
      { id: 84, name: "BODY SPRAY FOGG (DARK BLUE) ROYAL", price: 949, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 85, name: "BODY SPRAY FOGG (GREEN) VICTOR", price: 949, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 86, name: "BODY SPRAY FOGG (LIGHT,BLUE) IMPERIAL", price: 949, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 87, name: "BODY SPRAY FOGG (LIGHT,GREEN) MAJESTIC", price: 949, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 88, name: "BODY SPRAY FOGG (MEHROON) MONARCH", price: 949, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
      { id: 89, name: "BODY SPRAY FOGG (PURPLE) PARADISE", price: 949, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 90, name: "BODY SPRAY FOGG (RED) NAPOLEON", price: 949, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 91, name: "BODY SPRAY FOGG MASTER (WHITE) OAK", price: 949, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 92, name: "BODY SPRAY FOGG SMALL (MINI)", price: 190, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "B" },
      { id: 93, name: "BODY SPRAY HAVOC GERMANY (GOLD)", price: 980, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 94, name: "BODY SPRAY HAVOC GERMANY (SILVER)", price: 980, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "B" },
      { id: 95, name: "BODY SPRAY J. (OUD)", price:749, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 96, name: "BODY SPRAY J. (ZARAR)", price: 749, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 97, name: "BODY SPRAY JANAN", price: 749, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 98, name: "BODY SPRAY LUMANI", price: 830, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 99, name: "BODY SPRAY LUMANI DO IT", price: 830, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 100, name: "BODY SPRAY MARKHOR (MIX) RP,625", price: 690, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 101, name: "BODY SPRAY MARQUIS (MEHROON)", price: 699, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 102, name: "BODY SPRAY ONE MAN SHOW (BLACK)", price: 790, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 105, name: "BODY SPRAY PURE BLACK", price: 590, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "B" },
      { id: 106, name: "BODY SPRAY RASSASI BLUE LADY", price: 880, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 107, name: "BODY SPRAY RASSASI BLUE MEN", price: 880, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 110, name: "BODY SPRAY RASSASI EMOTION (MEN)", price: 880, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 111, name: "BODY SPRAY RASSASI EMOTION (WOMEN)", price: 880, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 113, name: "BODY SPRAY RASSASI HOPE (MEN)", price: 880, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 117, name: "BODY SPRAY RASSASI ROMANCE (MEN)", price: 880, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 118, name: "BODY SPRAY RASSASI ROMANCE (WOMEN)", price: 880, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 119, name: "BODY SPRAY RASSASI ROYAL BLACK", price: 880, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 120, name: "BODY SPRAY RASSASI ROYAL BLUE", price: 880, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 121, name: "BODY SPRAY RASSASI ROYAL PINK (W,M)", price: 880, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 122, name: "BODY SPRAY RASSASI SECRET", price: 880, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 123, name: "BODY SPRAY RASSASI TWINKLE", price: 880, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 124, name: "BODY SPRAY SHALIS (MEN)", price: 890, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "B" },
      { id: 125, name: "BODY SPRAY SHALIS (WOMEN)", price: 890, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 127, name: "BODY SPRAY SHE (MIX)", price: 490, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
      { id: 130, name: "BODY SPRAY UDV (LARGE) BLACK (SILVER)", price: 880, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 132, name: "BODY SPRAY YARDLEY (MIX)", price: 1, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 133, name: "BRUSH CHILD CHOFN (CAR)", price: 110, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 134, name: "BRUSH COBOR", price: 60, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 135, name: "BRUSH COLGATE (WITH CAP) IMP", price: 120, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 136, name: "BRUSH HAIR (CHAMCHA)", price: 175, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "B" },
      { id: 137, name: "BRUSH HAIR (THAPA) GOOD QUALITY", price: 195, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "B" },
      { id: 139, name: "BRUSH ORAL-B (WITH CAP)", price: 150, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 140, name: "BRUSH SENSODYNE (STAND+CAP) SOFT", price: 170, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 141, name: "BRUSH SHAVING (GOOD QUALITY)", price: 190, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "B" },
      { id: 142, name: "BRUSH SUREE PLASTIC PACKING SINGLE (NYLON TAR) BLACK", price: 120, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 143, name: "BRUSH SUREE PLASTIC PACKING SINGLE (NYLON TAR) WHITE", price: 120, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
      { id: 144, name: "BRUSH TYR HANDLE", price: 70, categoryId: "general", categoryName: "General Item & Others" },
      { id: 145, name: "BRUSH TYR SADA", price: 70, categoryId: "general", categoryName: "General Item & Others" },
      { id: 146, name: "BRYLCREEM (MEDIUM) (ORIGINAL) RED", price: 580, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 148, name: "BUTTERFLY PAD ALWAYS DARK BLUE RS,480", price: 430, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 151, name: "BUTTERFLY PAD ALWAYS ULTRA (EXTRA LONG) RP,230", price: 210, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 152, name: "BUTTERFLY PAD ALWAYS ULTRA (LONG) RP,230", price: 210, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 153, name: "BUTTERFLY PAD MAXI THICK (EXTRA LONG 8PCS) RP,340", price: 310, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 154, name: "BUTTERFLY PAD MAXI THICK (LONG 9PCS) RP,340", price: 310, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "B" },
      { id: 155, name: "CELL CAMELION LONGER LASTING AA", price: 50, categoryId: "lock", categoryName: "Lock & Cells" },
      { id: 156, name: "CELL DOUBLE CHARGER AA", price: 30, categoryId: "lock", categoryName: "Lock & Cells" },
      { id: 157, name: "CELL DOUBLE CHARGER AAA", price: 30, categoryId: "lock", categoryName: "Lock & Cells" },
      { id: 158, name: "CELL POWER PLUS AA", price: 30, categoryId: "lock", categoryName: "Lock & Cells", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 159, name: "CELL TOSHIBA AA (BLACK)", price: 35, categoryId: "lock", categoryName: "Lock & Cells" },
      { id: 161, name: "CELL TOSHIBA AA (RED)", price: 35, categoryId: "lock", categoryName: "Lock & Cells" },
      { id: 162, name: "CELL TOSHIBA AAA (BLACK)", price: 35, categoryId: "lock", categoryName: "Lock & Cells" },
      { id: 163, name: "CELL TOSHIBA AAA (RED)", price: 35, categoryId: "lock", categoryName: "Lock & Cells", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 165, name: "CELL TOSHIBA SIZE (D)", price: 140, categoryId: "lock", categoryName: "Lock & Cells" },
      { id: 167, name: "CHEERY POLISH (BLACK) LARGE RS,650", price: 590, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 168, name: "CHEERY POLISH (BLACK) SMALL RS,325", price: 300, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 169, name: "CHEERY POLISH (BROWN) LARGE RS,650", price: 590, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 170, name: "CHEERY POLISH (BROWN) SMALL RS,325", price: 300, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 171, name: "COBRA INSIST KILLER SPRAY 300ml", price: 0, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 172, name: "COBRA INSIST KILLER SPRAY 400ml", price: 0, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 173, name: "COBRA INSIST KILLER SPRAY 500ml", price: 0, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 174, name: "COBRA INSIST KILLER SPRAY 600ml", price: 0, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 175, name: "COFFEE SACHET (60 PCS)", price: 40, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 177, name: "COLOUR BLACK ROSE # 43", price: 190, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 178, name: "COLOUR BLACK ROSE 45 # RS,220", price: 190, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 183, name: "COLOUR GARNIER (ALL COLOURS) RS,1099", price: 899, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 184, name: "COLOUR GARNIER SACHET (NATURAL BLACK) RS,199", price: 185, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 187, name: "COLOUR GODREJ SACHET (DARK,BROWN)", price: 70, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 188, name: "COLOUR GODREJ SACHET (NATURAL BROWN)", price: 70, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 189, name: "COLOUR HELLO HAIR (# 03 DARK BROWN)", price: 250, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 190, name: "COLOUR JUST FOR MEN (DARK BROWN ) HAIR", price: 1849, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 191, name: "COLOUR JUST FOR MEN (BLACK) BEARD", price: 1849, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 192, name: "COLOUR KALA KOLA HAIR # 02 LARGE (M,BROWN)", price: 190, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 206, name: "COLOUR OLIVIA (ALL COLOURS) RS,300", price: 260, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 207, name: "COLOUR POLY (# 43) RS,320", price: 290, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 208, name: "COLOUR PRIMA HAIR (# 43 BROWN) RS,80", price: 60, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 209, name: "COLOUR PRIMA HAIR (# 45 BLACK) RS,80", price: 60, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 219, name: "COLOUR REVLON REGULAR (ALL COLOURS) (LARGE)", price: 790, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 221, name: "COLOUR SAMSOLE (# 43 DARK BROWN) SMALL RS,160", price: 145, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 222, name: "COLOUR SAMSOLE (# 45) BLACK SMALL RS,160", price: 145, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 223, name: "COLOUR SAMSOLE (# 43) DARK BROWN LARGE RS,300", price: 260, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 224, name: "COLOUR SAMSOLE (# 45) BLACK LARGE RS,300", price: 260, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 225, name: "COLOUR WAJEE TUBE ( # 43 DARK BROWN) RS,70", price: 0, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 226, name: "COLOUR WAJEE TUBE ( # 45 BLACK) RS,70", price: 0, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 227, name: "COMBS ANTI LICE HANDLE LARGE", price: 80, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 228, name: "COMBS ANTI LICE HANDLE MEDIUM", price: 80, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 229, name: "COMBS CASET", price: 10, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 230, name: "COMBS CRYSTAL", price: 25, categoryId: "general", categoryName: "General Item & Others" },
      { id: 231, name: "COMBS NEELAM", price: 20, categoryId: "general", categoryName: "General Item & Others" },
      { id: 233, name: "COMBS SAIRA", price: 10, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 234, name: "CONDOM DO (RED)", price: 190, categoryId: "condemn", categoryName: "Condoms" },
      { id: 235, name: "CONDOM DO BLACK", price: 190, categoryId: "condemn", categoryName: "Condoms" },
      { id: 236, name: "CONDOM DUREX 3 IN 1 DIBI", price: 0, categoryId: "condemn", categoryName: "Condoms" },
      { id: 237, name: "CONDOM HAPPY LIFE (3 IN 1)", price: 70, categoryId: "condemn", categoryName: "Condoms" },
      { id: 238, name: "CONDOM JOSH (BLUE) DELAY", price: 100, categoryId: "condemn", categoryName: "Condoms", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 239, name: "CONDOM KLIMAX (ECSTASY) ORIGINAL IMP", price: 190, categoryId: "condemn", categoryName: "Condoms" },
      { id: 240, name: "CONDOM NIGHT RIDER", price: 30, categoryId: "condemn", categoryName: "Condoms" },
      { id: 242, name: "CONDOM SATHI (MENTHOL)", price: 90, categoryId: "condemn", categoryName: "Condoms" },
      { id: 243, name: "CONDOM SATHI (RED)", price: 80, categoryId: "condemn", categoryName: "Condoms" },
      { id: 244, name: "CONDOM SATHI BOX RS,90", price: 80, categoryId: "condemn", categoryName: "Condoms", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 245, name: "CONDOM TOUCH (BLUE) PACK 3 IN 1", price: 149, categoryId: "condemn", categoryName: "Condoms", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 246, name: "CONDOM TOUCH (GREEN) 3IN 1", price: 90, categoryId: "condemn", categoryName: "Condoms", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 247, name: "CONDOM TOUCH (RED)", price: 100, categoryId: "condemn", categoryName: "Condoms" },
      { id: 249, name: "CONDITIONER LOREAL (BLACK) RS,550", price: 499, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 250, name: "CONDITIONER LOREAL (DREAM LONG) RS,550", price: 510, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 251, name: "CONDITIONER LOREAL (GOLDEN) RS,550", price: 510, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 252, name: "CONDITIONER LOREAL (HYALURON MOISTURE) BLUE RS,620", price: 570, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 254, name: "CONDITIONER LOREAL (RED) RS,550", price: 510, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 255, name: "CONDITIONER LOREAL (WHITE) RS,540", price: 510, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 256, name: "CONDITIONER MECLAY (BLACK)", price: 370, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 257, name: "CONDITIONER MECLAY (GOLDEN)", price: 370, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 258, name: "CONDITIONER MECLAY (ORANGE)", price: 370, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 259, name: "CONDITIONER MECLAY (PINK)", price: 370, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 261, name: "CONDITIONER MECLAY (PP)", price: 370, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 262, name: "CONDITIONER MECLAY (RED)", price: 370, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 263, name: "CONDITIONER MECLAY (WHITE)", price: 370, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 265, name: "CONDITIONER SUNSILK (COMPANY) BLACK RS,530", price: 490, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 266, name: "CONDITIONER TRESEMME (IMP) 175ml KERATIN", price: 500, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 267, name: "CONDITIONER TRESEMME 400ml (MIX)", price: 840, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 269, name: "COTTON BUD DIBI 100 PIECESS (WOOD)", price: 80, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 270, name: "COTTON BUD (PACKET) PLASTIC", price: 30, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 271, name: "COTTON BUD (PACKET) WOOD", price: 30, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 272, name: "COTTON BUD (PKT) WOOD (100 PIECES) TOP TIP", price: 90, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 273, name: "COTTON BUD DIBI (PLASTIC) 100 PIECESS TOP TIP", price: 120, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 274, name: "COTTON BUD DIBI (WOOD) 100 PIECESS BLUE TOP TIP", price: 120, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 278, name: "CREAM AJOOBA", price: 340, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 279, name: "CREAM ARCHI PERL THAILAND", price: 130, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 280, name: "CREAM ARENA (HAND & FOOT) RS,360", price: 295, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 281, name: "CREAM ARINA GOLD RS,350", price: 295, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 282, name: "CREAM ARINA GOLD (MEN) RP,350", price: 295, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 284, name: "CREAM B N B BEAUTY", price: 590, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 285, name: "CREAM BAREERA GOLD RS,375", price: 295, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 286, name: "CREAM BIO COS RP,375", price: 299, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 287, name: "CREAM BLASSO BLEACH (BOX) RS,40", price: 35, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 288, name: "CREAM BLASSO BLEACH 25g", price: 80, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 289, name: "CREAM CARE BLEACH (BOX) ALOE VERA (ORIGINAL) RS,40", price: 35, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 290, name: "CREAM CHARISMA HAND & FOOT", price: 395, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 291, name: "CREAM DEEP HEAT 70G TUBE", price: 790, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 292, name: "CREAM DUE WHITENING RS,350", price: 295, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 293, name: "CREAM EU JAR (LARGE) RS,350", price: 300, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 295, name: "CREAM EU JAR (MEDIUM) RS,220", price: 200, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 296, name: "CREAM EU TUBE (LARGE) RS,250", price: 220, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 297, name: "CREAM EU TUBE (SMALL) RS,160", price: 145, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 298, name: "CREAM EU TUBE 75g (MEDIUM) RS,320", price: 290, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 299, name: "CREAM FACE FRESH (LARGE) RS,360", price: 295, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 300, name: "CREAM FACE FRESH CLEANSER (LARGE)", price: 360, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 301, name: "CREAM FACE FRESH GOLD (LARGE) RS,360", price: 295, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 302, name: "CREAM FAIR & HANDSOME (LARGE)", price: 390, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 303, name: "CREAM FAIR & HANDSOME (SMALL)", price: 280, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 304, name: "CREAM FAIR MENZ (LARGE) RS,250", price: 230, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 305, name: "CREAM FAIZA BEAUTY SMALL RS,375", price: 320, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 306, name: "CREAM GLUPATONE", price: 350, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 307, name: "CREAM GLUTA WHITE", price: 390, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 310, name: "CREAM GOLDEN PEARL RS,360", price: 290, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 311, name: "CREAM GORI RS,550", price: 420, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 312, name: "CREAM JHALAK RS,360", price: 295, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 314, name: "CREAM M BETNOVATE RP,180.62", price: 175, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 315, name: "CREAM M DERMO VATE RP,199.06", price: 194, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 316, name: "CREAM M ITCH GUARD 25g", price: 150, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 317, name: "CREAM M MOOV 25g", price: 120, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 318, name: "CREAM NEW GOLDEN STAR RP,400", price: 330, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 319, name: "CREAM NIVEA (BLUE) 60ml", price: 470, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 320, name: "CREAM NIVEA SOFT 100ml", price: 690, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 321, name: "CREAM NIVEA SOFT 50ML", price: 380, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 322, name: "CREAM NO MARKS RS,350", price: 320, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 323, name: "CREAM OLIVIA BLEACH HERBAL RS,70", price: 65, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 324, name: "CREAM OLIVIA BLEACH RS,80", price: 70, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 325, name: "CREAM PARLEY BEAUTY BLACK RS 400", price: 330, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 326, name: "CREAM PARLEY BLEACH SACHET BLACK RS,70", price: 60, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 327, name: "CREAM PARLEY URGENT FACIAL SACHET", price: 60, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 329, name: "CREAM PONDS BB (MEDIUM) 18g", price: 840, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 330, name: "CREAM PONDS BB (SMALL) 9g", price: 490, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 331, name: "CREAM PONDS JAR LARGE COMPANY RS,450", price: 430, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 332, name: "CREAM ROOP SINGHAR", price: 340, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 333, name: "CREAM KELLY PEARL", price: 130, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 334, name: "CREAM MENA FACIAL", price: 130, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 335, name: "CREAM YOKO WHITENING", price: 130, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 336, name: "CREAM SANDAL RP,360", price: 295, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 337, name: "CREAM SEVEN HERBAL UBTAN RS,170", price: 160, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 338, name: "CREAM SEVEN HERBAL UBTAN RS,260", price: 240, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 339, name: "CREAM SHAVING ADMIRAL", price: 200, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 340, name: "CREAM SHAVING DIPLOMAT RS,200", price: 190, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 341, name: "CREAM SHAVING JOLLY", price: 180, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 342, name: "CREAM SHAVING TOUCH ME RS,230", price: 210, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 343, name: "CREAM SHEESHA BEAUTY CREAM RP,360", price: 295, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 344, name: "CREAM SIA GOLD RP,360", price: 295, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 347, name: "CREAM SUDO 125GM (ORIGINAL)", price: 1550, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 348, name: "CREAM SUDO 60GM (ORIGINAL)", price: 1150, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 349, name: "CREAM TIBET COLD (LARGE) RS,250", price: 235, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 350, name: "CREAM TIBET COLD (SMALL) RS,180", price: 170, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 351, name: "CREAM TIBET SNOW RS,230", price: 220, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 352, name: "CREAM WHITE GOLD (BLACK) RS,400", price: 290, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 353, name: "CREAM WHITE GOLD (ORANGE) RS,400", price: 290, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 354, name: "CREAM WHITE GOLD (PAPIYA) RS,400", price: 290, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 355, name: "DABUR AMLA HAIR OIL (DUBAI) 100ml RS,360", price: 330, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "D" },
      { id: 356, name: "DABUR AMLA HAIR OIL (DUBAI) 300ML RS,880", price: 795, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "D" },
      { id: 357, name: "DABUR AMLA HAIR OIL (DUBAI) 50ml RS,180", price: 170, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "D" },
      { id: 358, name: "DABUR RED PASTE (LARGE)", price: 430, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 359, name: "DABUR RED PASTE (SMALL)", price: 235, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "D" },
      { id: 360, name: "DENTONIC POWDER BOX (MEDIUM)", price: 75, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "D" },
      { id: 362, name: "DETTOL PANI 50ML (SMALL) RP,250", price: 220, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "D" },
      { id: 363, name: "DOLLAR GEL PEN (BLACK)", price: 40, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 364, name: "DOLLAR GEL PEN (BLUE)", price: 40, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 365, name: "DOLLAR GEL PEN (GREEN)", price: 40, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 366, name: "DOLLAR GEL PEN (RED)", price: 40, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 367, name: "DOLLAR PEN (CLIPPER) BLACK", price: 18, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 368, name: "DOLLAR PEN (CLIPPER) BLUE", price: 18, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "D" },
      { id: 370, name: "DOLLAR PEN (CLIPPER) RED", price: 18, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 371, name: "DOLLAR POINTER (BLACK)", price: 30, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 372, name: "DOLLAR POINTER (BLUE)", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 373, name: "DOOZ SPRAY 14000", price: 1150, categoryId: "condemn", categoryName: "Condoms" },
      { id: 374, name: "DUREX TESTER SMALL", price: 50, categoryId: "condemn", categoryName: "Condoms" },
      { id: 375, name: "DORCO RAZOR", price: 190, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "D" },
      { id: 377, name: "DUREX LUBE LARGE", price: 1050, categoryId: "condemn", categoryName: "Condoms" },
      { id: 378, name: "DUREX LUBE SMALL", price: 890, categoryId: "condemn", categoryName: "Condoms" },
      { id: 379, name: "ELFY JIMSA BOTTLE 20GM", price: 140, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "E" },
      { id: 380, name: "ELFY JIMSA BOX", price: 25, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "E" },
      { id: 381, name: "EMAMI 7 OILS IN ONE 100ML", price: 430, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 382, name: "EMAMI 7 OILS IN ONE 200ML", price: 730, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 383, name: "EMERGENCY LIGHT (LARGE)", price: 1200, categoryId: "general", categoryName: "General Item & Others" },
      { id: 384, name: "EMERGENCY LIGHT (MEDIUM)", price: 850, categoryId: "general", categoryName: "General Item & Others" },
      { id: 385, name: "EMERGENCY LIGHT (SMALL)", price: 650, categoryId: "general", categoryName: "General Item & Others" },
      { id: 386, name: "ENGLISH PRICKLY HEAT CREAM LARGE RS,270", price: 240, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "E" },
      { id: 387, name: "ERASER ORO", price: 10, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 397, name: "F & L BB CREAM 18g (MEDIUM) IMP", price: 590, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 398, name: "F & L BB CREAM 9g (SMALL) IMP", price: 350, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 399, name: "F & L M,V FACE WASH (SMALL) COMPANY RS.199", price: 190, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "F" },
      { id: 400, name: "F & L M,V JAR RP,450", price: 395, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 403, name: "F & L M,V TUBE (SMALL) GLOW RS,170", price: 160, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
      { id: 404, name: "F & L M V FACE WASH (LARGE) COMPANY RS,380", price: 190, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 407, name: "FACE WASH ACNI-PLUS", price: 490, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
      { id: 411, name: "FACE WASH B N B BRIGHTENING RICE", price: 640, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 412, name: "FACE WASH B N B CLEANSER", price: 640, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 414, name: "FACE WASH CLEAN & CLEAR (SMALL)", price: 299, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 415, name: "FACE WASH DOVE (LARGE) (BLUE)", price: 590, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 416, name: "FACE WASH DOVE (LARGE) (GREEN)", price: 590, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 417, name: "FACE WASH DOVE (LARGE) (PINK)", price: 0, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 418, name: "FACE WASH FAIR MENZ (MIX) RP,210", price: 195, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
      { id: 419, name: "FACE WASH GARNIER ( LARGE)  ACNO FIGHT RP,949", price: 835, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 420, name: "FACE WASH GARNIER (LARGE)  OIL CLEAR RS,949", price: 835, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 421, name: "FACE WASH GARNIER (LARGE)  POWER WHITE RS,949", price: 835, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 422, name: "FACE WASH GARNIER (LARGE) SAKURE WHITE", price: 690, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 423, name: "FACE WASH GARNIER (LARGE) TURBO LIGHT WHITE+OIL CONTROL", price: 890, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 424, name: "FACE WASH GARNIER (LARGE) WOMEN (NEEM) PURE ACTIVE RS,649", price: 590, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 425, name: "FACE WASH GARNIER (LARGE) WOMEN (VITAMIN C) RP,619", price: 570, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 426, name: "FACE WASH GARNIER (SMALL)  ACNO FIGHT RS,519", price: 470, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 427, name: "FACE WASH GARNIER (SMALL) OIL CLEAR RS,519", price: 470, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
      { id: 428, name: "FACE WASH GARNIER (SMALL) POWER WHITE RS,519", price: 470, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 429, name: "FACE WASH GARNIER (SMALL) WOMEN (NEEM) RS,369", price: 340, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 430, name: "FACE WASH GARNIER (SMALL) WOMEN VITAMIN C RS,369", price: 340, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
      { id: 431, name: "FACE WASH GOLDEN PEARL (ACNO CLEAR)", price: 230, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 432, name: "FACE WASH GOLDEN PEARL (OIL & CONTROL)", price: 230, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 433, name: "FACE WASH GOLDEN PEARL (FLAWLESS SKIN)", price: 230, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 434, name: "FACE WASH GOLDEN PEARL (LIGHT & GLOW)", price: 230, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 435, name: "FACE WASH GOLDEN PEARL (GREEN) HERBAL", price: 230, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 436, name: "FACE WASH GOLDEN PEARL (TEA & TREE) ", price: 230, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 437, name: "FACE WASH GOLDEN PEARL (WHITE & BEAUTY)", price: 230, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 438, name: "FACE WASH GOLDEN PEARL (MEN)", price: 230, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 439, name: "FACE WASH GOLDEN PEARL (OIL CONTROL) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 440, name: "FACE WASH GOLDEN PEARL (FLAWLESS SKIN) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
      { id: 441, name: "FACE WASH GOLDEN PEARL (LIGHT & GLOW) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
      { id: 442, name: "FACE WASH GOLDEN PEARL (VITAMIN C) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 443, name: "FACE WASH GOLDEN PEARL (WHITE BEAUTY) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 444, name: "FACE WASH GOLDEN PEARL (DAILY FOAMING) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 445, name: "FACE WASH GOLDEN PEARL (HERBAL) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 446, name: "FACE WASH GOLDEN PEARL (WHITE BEAUTY) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 447, name: "FACE WASH GOLDEN PEARL (MEN) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 448, name: "FACE WASH HIMALAYA (LARGE) NEEM DUBAI RS,510" , price: 460, categoryId: "others", categoryName: "Others" },
      { id: 449, name: "FACE WASH HIMALAYA (SMALL) DUBAI RS,310", price: 280, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 450, name: "FACE WASH JHALAK" , price: 180, categoryId: "others", categoryName: "Others" },
      { id: 451, name: "FACE WASH JUNSUI LARGE (BLACK)", price: 570, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
      { id: 452, name: "FACE WASH JUNSUI LARGE (ICE COOL)", price: 570, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 453, name: "FACE WASH JUNSUI LARGE (GREEN) NEEM", price: 570, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 455, name: "FACE WASH JUNSUI LARGE (L,GREEN COOL)", price: 570, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 456, name: "FACE WASH JUNSUI LARGE (PINK)", price: 570, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 457, name: "FACE WASH JUNSUI LARGE (RED) PIMPLE FIGHTING", price: 570, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 458, name: "FACE WASH JUNSUI LARGE ORANGE", price: 570, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 459, name: "FACE WASH MEC (ALOE VERA)", price: 390, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
      { id: 460, name: "FACE WASH MEC (BLACK CHARCOAL)", price: 390, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 461, name: "FACE WASH MEC (PINK)", price: 390, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "F" },
      { id: 462, name: "FACE WASH MEC (ACNE CLEAN)", price: 390, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 463, name: "FACE WASH MEC (RICE BRIGHTENING)", price: 390, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 464, name: "FACE WASH MEC (LEMON)", price: 390, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 466, name: "FACE WASH PARLEY BLACK RS,300", price: 270, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
      { id: 467, name: "FACE WASH PONDS (IMP) ACNE SOLUTION", price: 450, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 468, name: "FACE WASH PONDS (IMP) ACNE SOLUTION (SMALL)", price: 270, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "F" },
      { id: 469, name: "FACE WASH PONDS (IMP) BLACK (ACTIVATED CHARCOAL) LARGE", price: 450, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 470, name: "FACE WASH PONDS (IMP) BLACK (ACTIVATED CHARCOAL) SMALL", price: 270, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
      { id: 471, name: "FACE WASH PONDS (IMP) FLAWLESS WHITE", price: 590, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 472, name: "FACE WASH PONDS (IMP) SUN DULLNESS (SCRUB)", price: 460, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
      { id: 473, name: "FACE WASH PONDS (IMP) WHITE BEAUTY (PINK)", price: 450, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 474, name: "FACE WASH PONDS (IMP) WHITE BEAUTY (SMALL)", price: 270, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 475, name: "FACE WASH PONDS LARGE (COMPANY) BLACK RP,490", price: 450, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 476, name: "FACE WASH PONDS LARGE (COMPANY) PINK RP,490", price: 450, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 477, name: "FACE WASH PONDS SMALL (COMPANY) BLACK RP,300", price: 270, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 478, name: "FACE WASH PONDS SMALL (COMPANY) PINK RS,300", price: 270, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 479, name: "FACE WASH PONDS MEN IMP (ACNE SOLUTION) LARGE", price: 590, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 480, name: "FACE WASH PONDS MEN IMP (ENERGY CHARGE) LARGE", price: 590, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 481, name: "FACE WASH PONDS MEN IMP (LIGHTNING OIL CLEAR) LARGE", price: 590, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 482, name: "FACE WASH PONDS MEN IMP (POLLUTION OUT) LARGE", price: 590, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 483, name: "FACE WASH PONDS MEN IMP (POWER CLEAR) LARGE", price: 590, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 484, name: "FACE WASH PONDS MEN IMP (WHITE BOOST) LARGE", price: 590, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 485, name: "FACE WASH RIVAJ LEMON (LARGE)", price: 310, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 486, name: "FACE WASH RIVAJ NEEM (LARGE)", price: 310, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 487, name: "FACE WASH SAEED GHANI VITAMIN C", price: 490, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 488, name: "FACE WASH SYED GHANI CHARCOAL", price: 490, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 489, name: "FACE WASH SYED GHANI GOAT MILK", price: 490, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 490, name: "FACE WASH RIVAJ LEMON (SMALL)", price: 175, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 491, name: "FACE WASH RIVAJ NEEM (SMALL)", price: 175, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
      { id: 492, name: "FACE WASH Y,C (LARGE) COCUMBER", price: 470, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "F" },
      { id: 493, name: "FACE WASH Y,C (LARGE) NEEM GREEN", price: 470, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 494, name: "FACE WASH Y,C (LARGE) YELLOW LEMON", price: 470, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
      { id: 495, name: "FACE WASH Y,C (LARGE) COW MILK EXTRACT", price: 470, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
      { id: 496, name: "FACE WASH Y,C (SMALL) COW MILK EXTRACT", price: 320, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 497, name: "FACE WASH Y,C (SMALL) COCUMBER", price: 320, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 499, name: "FACE WASH Y,C (SMALL) NEEM GREEN", price: 320, categoryId: "facewash", categoryName: "Face Wash" },
      { id: 500, name: "FACE WASH Y,C (SMALL) YELLOW LEMON", price: 320, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "F" },
      { id: 502, name: "FEEDER (LARGE NIPPLE) LARGE", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 503, name: "FEEDER (LARGE NIPPLE) MEDIUM", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 504, name: "FEEDER GLASS LARGE", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 505, name: "FEEDER GLASS MEDIUM", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 506, name: "FEEDER GLASS SMALL", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 507, name: "FEEDER MINI TREE (LARGE)", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 508, name: "FEEDER MINI TREE (MEDIUM)", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 509, name: "FEEDER MINI TREE (SMALL)", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 510, name: "FEEDER PP (IMP) HANDLE LARGE", price: 0, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 511, name: "FEEDER PP (IMP) HANDLE MEDIUM", price: 0, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
      { id: 512, name: "FEEDER PURE LOVE COLOR (LARGE)", price: 280, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "F" },
      { id: 513, name: "FORHANS HAIR TONIC 100ML (BLUE) RS,320", price: 310, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "F" },
      { id: 514, name: "FORHANS HAIR TONIC 100ML (RED) RS,320", price: 310, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 515, name: "FORHANS HAIR TONIC 200ml (RED) RP,550", price: 520, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 516, name: "GATS BY GEL (MEDIUM) MIX", price: 490, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 519, name: "4ME FOAM (LARGE) MIX", price: 380, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 520, name: "GILLETTE BLUE 2 PLUS", price: 140, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "G" },
      { id: 521, name: "GILLETTE FOAM 200ml (GREEN)", price: 860, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "G" },
      { id: 522, name: "GILLETTE FOAM 200ml (BLUE)", price: 860, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 523, name: "GILLETTE FOAM 200ml (RED)", price: 860, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "G" },
      { id: 524, name: "GILLETTE FOAMY (50gm) SMALL (MIX)", price: 445, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 525, name: "GILLETTE GEL (LARGE) MIX", price: 940, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "G" },
      { id: 526, name: "GILLETTE GEL (Small) MIX", price: 640, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "G" },
      { id: 528, name: "GOLDEN PEARL SKIN POLISHING", price: 160, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 529, name: "GOLDEN PEARL URGENT FACIAL", price: 50, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "G" },
      { id: 530, name: "GOLDEN PEARL URGENT FACIAL (FRUIT)", price: 50, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 534, name: "HAPPY BIRTHDAY SPELLING", price: 220, categoryId: "birthday", categoryName: "Birthday", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "H" },
      { id: 535, name: "HASHMI SORMA RS,200", price: 190, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "H" },
      { id: 536, name: "HIGHLIGHTER", price: 70, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 537, name: "HUDA BEAUTY BLACK MASK SACHET", price: 50, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 538, name: "HUSSAIN MANJAN BOX (MEDIUM) RS,80", price: 75, categoryId: "powders", categoryName: "Powders", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "H" },
      { id: 539, name: "INK BOTTLE DOLLAR (SMALL) BLACK", price: 60, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 540, name: "INK BOTTLE DOLLAR (SMALL) BLUE", price: 50, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "I" },
      { id: 541, name: "INK PEN DOLLAR", price: 70, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 542, name: "INK PEN PIANO CRYSTAL", price: 70, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 543, name: "INK REMOVER MARKER (ORO)", price: 40, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "I" },
      { id: 544, name: "INK REMOVER WHITENER", price: 70, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "I" },
      { id: 545, name: "J BABY BATH 200ML TOP TO TOE", price: 549, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 548, name: "J BABY LINER", price: 50, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 549, name: "J BABY LOTION 100ml (IMP)", price: 490, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 550, name: "J BABY LOTION 200ml (IMP)", price: 690, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 551, name: "J BABY OIL 125ml (IMP)", price: 650, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "J" },
      { id: 552, name: "J BABY OIL 200ml (IMP)", price: 840, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 553, name: "J BABY OIL 50ml (IMP)", price: 320, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "J" },
      { id: 554, name: "J BABY PERFUME COLOGNE", price: 690, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 555, name: "J BABY PETROLEUM GEL (PINK) SMALL", price: 490, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 556, name: "J BABY PETROLEUM GEL (BLUE) SMALL", price: 490, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "J" },
      { id: 557, name: "J BABY POWDER 100g (MIX)", price: 590, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 558, name: "J BABY POWDER 200g (MIX)", price: 590, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 559, name: "J BABY SHAMPOO 100ml (COMPANY)", price: 320, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "J" },
      { id: 560, name: "J BABY SHAMPOO 200ml (COMPANY)", price: 590, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "J" },
      { id: 561, name: "J BABY SHAMPOO 300ml (COMPANY)", price: 750, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 562, name: "J BABY SHAMPOO 750ml (COMPANY) (PUMP)", price: 1780, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 563, name: "J BABY SOAP 100g GREEN", price: 240, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 564, name: "J BABY SOAP 100g PINK", price: 240, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "J" },
      { id: 565, name: "J BABY SOAP 100g WHITE", price: 240, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "J" },
      { id: 566, name: "J BABY TOP-TO-TOE 100ML", price: 350, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 567, name: "J BABY WIPES (LARGE 84 PIECES) GOOD QUALITY", price: 240, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 569, name: "KALA KOLA HAIR TONIC (LARGE) RS,500", price: 460, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 570, name: "KALA KOLA HAIR TONIC (SMALL) RS,300", price: 270, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 571, name: "KEHKSHAN MAHNDI (BLACK) RS,80", price: 70, categoryId: "general", categoryName: "General Item & Others" },
      { id: 572, name: "KEUNE COLOUR (ALL COLOURS)", price: 0, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 573, name: "KEUNE POWDER (ALL COLOURS)", price: 0, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 575, name: "KEY CHAIN (SEND PIC)", price: 1, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 576, name: "KING COIL BLAKI (LARGE)", price: 110, categoryId: "mosquito", categoryName: "Anti-Mosquito", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "K" },
      { id: 577, name: "KING COIL GREEN (LARGE)", price: 110, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 578, name: "KING MAAT", price: 7, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 579, name: "KING MACHINE SET", price: 560, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 580, name: "KING MOSPEL", price: 130, categoryId: "mosquito", categoryName: "Anti-Mosquito", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "K" },
      { id: 581, name: "KING RAT BOOK", price: 180, categoryId: "mosquito", categoryName: "Anti-Mosquito", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "K" },
      { id: 582, name: "KING REFILL", price: 240, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 583, name: "KINGTOX SPRAY 300ml (SMALL)", price: 440, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 584, name: "KINGTOX SPRAY 400ml (MEDIUM)", price: 540, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 585, name: "KINGTOX SPRAY 600 (LARGE)", price: 740, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 587, name: "KIWI POLISH LIQUID (BLACK) RS,450", price: 430, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "K" },
      { id: 588, name: "KIWI POLISH LIQUID (BROWN) RS,450", price: 430, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "K" },
      { id: 589, name: "KOHE NOOR OIL (CHANBALI) RP,350", price: 335, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "K" },
      { id: 592, name: "LASTIK BAREEK CHILD", price: 20, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "L" },
      { id: 593, name: "LASTIK CHORDA LADIES ROLL (LARGE)", price: 390, categoryId: "general", categoryName: "General Item & Others" },
      { id: 594, name: "LASTIK CHORDA LADIES ROLL (MEDIUM) 25 YARD", price: 330, categoryId: "general", categoryName: "General Item & Others" },
      { id: 595, name: "LASTIK CHORDA LADIES ROLL (SMALL)", price: 80, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "L" },
      { id: 596, name: "LASTIK CHORDA WHITE (LARGE)", price: 25, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "L" },
      { id: 599, name: "LIGHTER (ARCO GARARRI)", price: 40, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "L" },
      { id: 600, name: "LIGHTER (HEATER)", price: 30, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "L" },
      { id: 601, name: "LIGHTER (SADA TIK)", price: 25, categoryId: "general", categoryName: "General Item & Others" },
      { id: 603, name: "LIGHTER CHOLAH (PUZZO)", price: 199, categoryId: "general", categoryName: "General Item & Others" },
      { id: 604, name: "LIGHTER CHOLAH (REFILL)", price: 199, categoryId: "general", categoryName: "General Item & Others" },
      { id: 605, name: "LIGHTER CHOLAH FULL STEEL GUN", price: 0, categoryId: "general", categoryName: "General Item & Others" },
      { id: 606, name: "LIGHTER CIGARETTE GAS REFILL (RED)", price: 199, categoryId: "general", categoryName: "General Item & Others" },
      { id: 607, name: "LIGHTER ELECTRIC ARC (USB TYPE C)", price: 400, categoryId: "general", categoryName: "General Item & Others" },
      { id: 608, name: "LIP OIL POUCH", price: 40, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "L" },
      { id: 609, name: "LOCK BLACK 20mm", price: 70, categoryId: "lock", categoryName: "Lock & Cells" },
      { id: 610, name: "LOCK BLACK 25mm", price: 80, categoryId: "lock", categoryName: "Lock & Cells" },
      { id: 611, name: "LOCK BLACK 32mm", price: 140, categoryId: "lock", categoryName: "Lock & Cells" },
      { id: 612, name: "LOCK BLACK 38mm", price: 160, categoryId: "lock", categoryName: "Lock & Cells" },
      { id: 613, name: "LOCK BLACK 50mm", price: 260, categoryId: "lock", categoryName: "Lock & Cells" },
      { id: 614, name: "LOCK BLACK 63mm", price: 340, categoryId: "lock", categoryName: "Lock & Cells" },
      { id: 615, name: "LOCK FRONT KEY (LARGE) GOOD QUALITY", price: 680, categoryId: "lock", categoryName: "Lock & Cells" },
      { id: 616, name: "LOCK FRONT KEY (MEDIUM)", price: 520, categoryId: "lock", categoryName: "Lock & Cells" },
      { id: 617, name: "LOCK SILVER 40MM (WOHU)", price: 360, categoryId: "lock", categoryName: "Lock & Cells", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "L" },
      { id: 618, name: "LOCK SILVER 50MM (WOHU)", price: 440, categoryId: "lock", categoryName: "Lock & Cells", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "L" },
      { id: 619, name: "LOCK SILVER 60MM (WOHU)", price: 540, categoryId: "lock", categoryName: "Lock & Cells", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "L" },
      { id: 620, name: "LOCK SILVER 70MM (WOHU)", price: 580, categoryId: "lock", categoryName: "Lock & Cells", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "L" },
      { id: 621, name: "LOTION CARE (SMALL) RS,250", price: 230, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "L" },
      { id: 622, name: "LOTION ENCHANTEUR 100ML (SMALL)", price: 460, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 623, name: "LOTION MOTHER CARE 115ML RS,450", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 624, name: "LOTION MOTHER CARE 60ML RS,150", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 625, name: "LOTION NEXTON 125ML RP,499", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 626, name: "LOTION NEXTON 65ML RP,299", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 627, name: "LOTION NIVEA 100ML SMALL (MIX)", price: 509, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 628, name: "LOTION NIVEA 200ML (MIX)", price: 889, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 629, name: "LOTION NIVEA 400ML (MIX)", price: 1800, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 630, name: "LOTION OLIVIA 110ml RS,220 (MOISTURIZING)", price: 180, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 631, name: "LOTION OLIVIA 110ml RS,220 (HONEY)", price: 180, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 632, name: "LOTION OLIVIA 220ml RS,310 (MOISTURIZING)", price: 280, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 633, name: "LOTION OLIVIA 220ml RS,310 (HONEY)", price: 280, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 634, name: "LOTION PONDS 100ml HONEY RS,350", price: 330, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 635, name: "LOTION PONDS 100ML RS,350", price: 330, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "L" },
      { id: 636, name: "LOTION PONDS 200ml RP,600", price: 555, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 637, name: "LOTION PONDS 65ml RS,240", price: 229, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 638, name: "LOTION PONDS WHITE BEAUTY 150ml CLEANSING MILK", price: 499, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 639, name: "LOTION SKIN WHITE (VITAMIN C) RS,320", price: 280, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 640, name: "LOTION SKIN WHITE HONEY GOAT MILK RS,320", price: 280, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 641, name: "LOTION VASELINE 100ML (IMP) COCA B", price: 339, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "L" },
      { id: 642, name: "LOTION VASELINE 100ML (IMP) GREEN", price: 339, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "L" },
      { id: 643, name: "LOTION VASELINE 100ml (IMP) PINK", price: 339, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 644, name: "LOTION VASELINE 100ML (IMP) WHITE", price: 339, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "L" },
      { id: 645, name: "LOTION VASELINE 100ML (IMP) YELLOW", price: 339, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "L" },
      { id: 646, name: "LOTION VASELINE 200ml (IMP) WHITE", price: 699, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 647, name: "LOTION VASELINE 200ML (IMP) COCO", price: 699, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "L" },
      { id: 648, name: "LOTION VASELINE 200ML (IMP) PINK", price: 699, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "L" },
      { id: 649, name: "LOTION VASELINE 200ml (IMP) GREEN", price: 699, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 650, name: "LUBNA'S WONDER WAX (LARGE)", price: 250, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 651, name: "LUBNA'S WONDER WAX (SMALL)", price: 189, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 652, name: "LUDE POLISH (BLACK) ORIGINAL", price: 99, categoryId: "general", categoryName: "General Item & Others" },
      { id: 653, name: "LUDE POLISH (BROWN) ORIGINAL", price: 99, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "L" },
      { id: 654, name: "LUDO (CARPET)", price: 449, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 655, name: "LUDO (LARGE) ", price: 199, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 656, name: "LUDO (XL) (GOOD QUALITY)", price: 289, categoryId: "sports", categoryName: "Sports & Toys", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "L" },
      { id: 657, name: "LUDO (LARGE) WOOD GOOD QUALITY", price: 489, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 658, name: "LUDO (MEDIUM)", price: 144, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 659, name: "LUDO (MEDIUM) WOOD GOOD QUALITY", price: 429, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 660, name: "LUDO (SMALL)", price: 89, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 661, name: "LUDO (SMALL) WOOD GOOD QUALITY", price: 299, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 662, name: "LUDO DANA CRYSTAL", price: 10, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 663, name: "LUDO DANA MILKY", price: 10, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 664, name: "LUX BODY WASH SOFT TOUCH (BLUE) (IMP)", price: 430, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 665, name: "LUX BODY WASH SOFT TOUCH (PINK) (IMP)", price: 430, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "L" },
      { id: 666, name: "LUX BODY WASH SOFT TOUCH (PURPLE) (IMP)", price: 430, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "L" },
      { id: 667, name: "MAGIC DEPOXI BOX (SMALL)", price: 71, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "M" },
      { id: 668, name: "MARKER 604 (BLACK)", price: 20, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "M" },
      { id: 669, name: "MARKER 604 (BLUE)", price: 20, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "M" },
      { id: 670, name: "MARKER MERCURY (BLUE)", price: 20, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "M" },
      { id: 671, name: "MARKER MERCURY (BLACK)", price: 20, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "M" },
      { id: 672, name: "MARKER BOARD INK", price: 89, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 673, name: "MARKER BLACK BOARD (BLACK)", price: 69, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "M" },
      { id: 674, name: "MARKER BLACK BOARD (BLUE)", price: 69, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "M" },
      { id: 675, name: "MARKER PERMANENT (BLACK) DEER", price: 69, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "M" },
      { id: 676, name: "MARKER PERMANENT (BLUE) DEER", price: 69, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 677, name: "MARKER SADA (BLACK)", price: 15, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "M" },
      { id: 678, name: "MARKER SADA (BLUE)", price: 15, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "M" },
      { id: 679, name: "MARKER SADA DOLLAR (BLUE)", price: 21, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 681, name: "MEHNDI ARAQ", price: 30, categoryId: "general", categoryName: "General Item & Others" },
      { id: 682, name: "MEHNDI CONE", price: 40, categoryId: "general", categoryName: "General Item & Others" },
      { id: 683, name: "MEHNDI CONE SINGHAR", price: 50, categoryId: "general", categoryName: "General Item & Others" },
      { id: 684, name: "CAT FOOD (FLUFFY)", price: 830, categoryId: "general", categoryName: "General Item & Others" },
      { id: 685, name: "METRO +7 AGAER BATTI (LARGE)", price: 120, categoryId: "general", categoryName: "General Item & Others" },
      { id: 686, name: "METRO AGHER BATTI (SMALL)", price: 50, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "M" },
      { id: 687, name: "MIRROR DOUBLE SIDED (LARGE)", price: 240, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "M" },
      { id: 688, name: "MIRROR DOUBLE SIDED (MEDIUM)", price: 189, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "M" },
      { id: 689, name: "MIRROR DOUBLE SIDED (SMALL)", price: 129, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "M" },
      { id: 690, name: "MOOV SPRAY", price: 849, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "M" },
      { id: 691, name: "MORTEIN COIL LARGE", price: 0, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 692, name: "MORTEIN MACHINE RP,560", price: 0, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 693, name: "MORTEIN REFILLL (30 NIGHT)", price: 239, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 694, name: "MORTEIN REFILLL (60 NIGHT)", price: 439, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 695, name: "MORTEIN SPRAY 300ML", price: 529, categoryId: "mosquito", categoryName: "Anti-Mosquito", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "M" },
      { id: 696, name: "MORTEIN SPRAY 375ML", price: 699, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 697, name: "MORTEIN SPRAY 600ML LARGE", price: 899, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 698, name: "MOSPEL RS,350", price: 319, categoryId: "mosquito", categoryName: "Anti-Mosquito", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "M" },
      { id: 700, name: "MOTHER CARE OIL 125ML RP,480", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 701, name: "MOTHER CARE OIL 65ML", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 702, name: "MOUTH WASH COLGATE 250ML (IMP) MIX", price: 489, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 703, name: "MOUTH WASH LISTERINE (MIX)", price: 489, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 704, name: "MOUTH WASH ORAL-B", price: 489, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 705, name: "MOUTH WASH SENSODYNE (MIX)", price: 539, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 706, name: "MULTANI MUTTI JAR", price: 80, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 708, name: "MUNDIAL OLIVE OIL 175ML", price: 579, categoryId: "general", categoryName: "General Item & Others" },
      { id: 709, name: "NAIL CUTTER 555 (LARGE)", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 710, name: "NAIL CUTTER AKAI (JAPANI ORIGINAL) (LARGE) JAPANI", price: 799, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 711, name: "NAIL CUTTER AKAI (JAPANI ORIGINAL) (MEDIUM) JAPANI", price: 749, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 712, name: "NAIL CUTTER MINI", price: 60, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 713, name: "NAIL CUTTER V9 (GOOD QUALITY)", price: 149, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "N" },
      { id: 714, name: "NALKI (MIX)", price: 70, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 715, name: "NAIR HAIR REMOVAL SPRAY (MIX)", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 716, name: "NALKI (BLACK)", price: 15, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "N" },
      { id: 717, name: "NALKI (WHITE)", price: 15, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "N" },
      { id: 718, name: "NEXTON BABY COLOGNE BLUE", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 719, name: "NEXTON BABY KIT MEDIUM", price: 1800, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 720, name: "NEXTON BABY KIT SMALL", price: 999, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 721, name: "NEXTON BABY LOTION 125ML RP,525", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 722, name: "NEXTON BABY LOTION 250ML", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 723, name: "NEXTON BABY LOTION 65ML RP,315", price: 299, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 724, name: "NEXTON BABY POWDER 100g RP,275 (MIX)", price: 249, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 725, name: "NEXTON BABY POWDER 200g RP,430 (MIX)", price: 399, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 726, name: "NEXTON BABY SHAMPOO 125ML RP,399", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 727, name: "NEXTON BABY SHAMPOO 250ML RP,699", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 728, name: "NEXTON BABY SHAMPOO 500ML RP,999", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 729, name: "NEXTON BABY SHAMPOO 65ML RP,260", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 730, name: "NEXTON BABY SHAMPOO PUMP", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 731, name: "NEXTON BABY SOAP RP,225", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 732, name: "NEXTON OIL 125ML RP,470", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 733, name: "NEXTON WIPES", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 734, name: "NIPLE PP SMALL", price: 29, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 735, name: "NIPPLE PP LARGE", price: 49, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 736, name: "NITRO HAIR WAX (MIX)", price:420, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 737, name: "NOVA GOLD HAIR SPRAY (LARGE)", price: 595, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 738, name: "NOVA GOLD HAIR SPRAY (SMALL) (COPY)", price: 375, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "N" },
      { id: 753, name: "PAPER COPY (ALL TYPES)", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 754, name: "PARACHUTE COCONUT OIL (LARGE) ORIGINAL", price: 989, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 755, name: "PARACHUTE COCONUT OIL (LARGE) HEMANI", price: 889, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 756, name: "PARACHUTE COCONUT OIL (MEDIUM) HEMANI", price: 489, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 757, name: "PARACHUTE COCONUT OIL (MEDIUM) ORIGINAL", price: 589, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 758, name: "PARACHUTE COCONUT OIL (SMALL) HEMANI", price: 269, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 759, name: "PARACHUTE COCONUT OIL (SMALL) ORIGINAL", price: 299, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 760, name: "PARTY PACK TISSUE ROSE PETAL (PINK) RP,250", price: 229, categoryId: "general", categoryName: "General Item & Others" },
      { id: 761, name: "PARTY PACK TISSUE ROSE PETAL (WHITE) RP,275", price:249, categoryId: "general", categoryName: "General Item & Others" },
      { id: 762, name: "PARTY POPPER (MEDIUM)", price: 129, categoryId: "birthday", categoryName: "Birthday", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 763, name: "PARTY POPPER (SMALL)", price: 89, categoryId: "birthday", categoryName: "Birthday", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 764, name: "PASTE CHILD (ABC) RS,180 (MIX)", price: 169, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 765, name: "PASTE CHILD KODOMO (MIX)", price: 199, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 766, name: "PASTE CLOSE UP (IMP) LARGE GREEN", price: 399, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 767, name: "PASTE CLOSE UP (IMP) LARGE RED", price: 399, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 768, name: "PASTE CLOSE UP (IMP) XL BLUE (ICY WHITE)", price: 449, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 769, name: "PASTE CLOSE UP (SMALL) GREEN", price: 199, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 770, name: "PASTE CLOSE UP (SMALL) RED", price: 199, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 771, name: "PASTE COLGATE 100g HERBAL RS,220", price: 205, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 772, name: "PASTE COLGATE 100g SADA RS,230", price: 214, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 773, name: "PASTE COLGATE 125G MAX FRESH (GREEN) RS,325", price: 310, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 774, name: "PASTE COLGATE 125g MAX FRESH (BLUE) RS,325", price:310, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 775, name: "PASTE COLGATE 125G MAX FRESH (RED) RS,325", price: 310, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 776, name: "PASTE COLGATE 150g HERBAL RS,330", price: 309, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 777, name: "PASTE COLGATE 200g HERBAL RS,420", price: 397, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 778, name: "PASTE COLGATE 200g SADA RS,430", price: 405, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 779, name: "PASTE COLGATE 20g HERBAL RS,50", price: 46, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 780, name: "PASTE COLGATE 20g SADA RS,50", price: 46, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 781, name: "PASTE COLGATE 40g SADA RS,75", price: 69, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 782, name: "PASTE COLGATE 45g HERBAL RS,75", price: 69, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 783, name: "PASTE COLGATE 75g HERBAL RS,180", price: 169, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 784, name: "PASTE COLGATE 75g SADA RS,190", price: 179, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 785, name: "PASTE COLGATE 75g MAX FRESH RS,220 (GREEN)", price: 209, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 786, name: "PASTE COLGATE 75g MAX FRESH RS,220 (RED)", price: 209, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 787, name: "PASTE COLGATE 75g MAX FRESH RS,220 (BLUE)", price: 209, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 788, name: "PASTE DOCTOR RS,110", price: 96, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 789, name: "PASTE DOCTOR RS,220", price: 199, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 790, name: "PASTE ENGLISH SMALL RS,140", price: 125, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 791, name: "PASTE FORHANS (LARGE) RS,300", price: 285, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 792, name: "PASTE FORHANS (SMALL) RS,180", price: 169, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 793, name: "PASTE MEDICAM 35GM RS,120", price: 109, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 794, name: "PASTE MEDICAM 65GM RS,250", price: 224, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 795, name: "PASTE MEDICAM 90GM RS,320", price: 289, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 796, name: "PASTE PARODONTAX 50g RS,250", price: 235, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 797, name: "PASTE PARODONTAX 100g RS,400", price: 375, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 798, name: "PASTE SENSODYNE 100g (FLUORIDE) RS,450", price: 429, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 799, name: "PASTE SENSODYNE 100g (ORIGINAL) RS,450", price: 429, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 800, name: "PASTE SENSODYNE 100g (RAPID ACTION) RS,545", price: 519, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 801, name: "PASTE SENSODYNE 30g (COMPLETE PROTECTION +) RS,165", price: 155, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 802, name: "PASTE SENSODYNE 30g (RAPID ACTION) RS,165", price: 154, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 804, name: "PASTE SENSODYNE 70g (FLUORIDE) RS,380", price: 354, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 805, name: "PASTE SENSODYNE 70g (ORIGINAL) RS,380", price: 354, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
      { id: 806, name: "PASTE SENSODYNE 70g (RAPID ACTION) RS,420", price: 399, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 807, name: "PASTE SPARKLE RS,105", price: 99, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 808, name: "PASTE SPARKLE RS,180", price: 170, categoryId: "toothpasteandbrush", categoryName: "Tooth Paste & Brush" },
      { id: 809, name: "PEN (BLUE SIGNATURE) BLACK", price: 17, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 810, name: "PEN (BLUE SIGNATURE) BLUE", price: 17, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 811, name: "PEN DOLLAR SP 10", price: 70, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 812, name: "PEN PIANO (BLACK) GRIPPER 0.8MM", price: 20, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 813, name: "PEN PIANO (BLUE) GRIPPER 0.8MM", price: 20, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 814, name: "PEN PIANO (RED) GRIPPER 0.8MM", price: 20, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 815, name: "PEN PIANO OLD YELLOW", price: 17, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 816, name: "PENCIL GOLDFISH", price: 19, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
      { id: 817, name: "PENCIL MY DOLLAR", price: 19, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 818, name: "PENCIL ORO", price: 19, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 819, name: "PERFUME ALISHA (GOLD)", price: 1590, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 820, name: "PERFUME ALISHA (NAVY)", price: 1590, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 821, name: "PERFUME ALISHA (ROSE)", price: 1590, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 822, name: "PERFUME ASEEL", price: 1790, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 823, name: "PERFUME DELYCIA (MEDIUM) BEAUTY RS,650", price: 619, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 824, name: "PERFUME DELYCIA (MEDIUM) CHECK RS,650", price: 619, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 825, name: "PERFUME DELYCIA (SMALL) BEAUTY RS,350", price: 325, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "P" },
      { id: 826, name: "PERFUME DELYCIA (SMALL) CHECK RS,350", price: 325, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 827, name: "PERFUME DELYCIA (SMALL) FEELING RS,350", price: 325, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 828, name: "PERFUME DO IT", price: 1790, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 829, name: "PERFUME EVERY ONE", price: 1690, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 830, name: "PERFUME FOR EVER", price: 790, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 831, name: "PERFUME GAMBIT", price: 790, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 832, name: "PERFUME HAVOC (DUBAI) GOLDEN", price: 2140, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 833, name: "PERFUME HAVOC (DUBAI) SILVER", price: 2140, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 835, name: "PERFUME MEDORA (MEDIUM) BLUE RS,650", price: 619, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 836, name: "PERFUME MEDORA (MEDIUM) GREEN RS,650", price: 619, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 837, name: "PERFUME MEDORA (SMALL) BLUE RS,350", price: 325, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 838, name: "PERFUME MEDORA (SMALL) GREEN RS,350", price: 325, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "P" },
      { id: 839, name: "PERFUME MEDORA (SMALL) RED RS,350", price: 325, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 840, name: "PERFUME MEDORA (MEDIUM) RED RS,650", price: 325, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 841, name: "PERFUME MUTUAL LOVE (GOLD)", price: 390, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 842, name: "PERFUME MUTUAL LOVE (PINK)", price: 390, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 843, name: "PERFUME MUTUAL LOVE (RED)", price: 390, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
      { id: 844, name: "PERFUME ONE MAN SHOW", price: 2340, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "P" },
      { id: 845, name: "PERFUME PENCIL (MEN + W,M)", price: 140, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 846, name: "PERFUME RASSASI BLUE LADY", price: 2440, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 847, name: "PERFUME RASSASI ROMANCE (WOMAN)", price: 2480, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 848, name: "PERFUME RASSASI SECRET", price: 2530, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 849, name: "PERFUME ROYAL MARRIAGE", price: 2480, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 850, name: "PERFUME SHALIS MEN (LARGE)", price: 3650, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 851, name: "PERFUME SHALIS MEN (SMALL)", price: 2690, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 852, name: "PERFUME SHALIS WOMEN (LARGE)", price: 3650, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 853, name: "PERFUME SHALIS WOMEN (SMALL)", price: 2690, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 854, name: "POWDER BERG (LARGE) RS,380", price: 349, categoryId: "powders", categoryName: "Powders" },
      { id: 855, name: "POWDER BERG (SMALL) RS,220", price: 180, categoryId: "powders", categoryName: "Powders" },
      { id: 856, name: "POWDER BLACK BEAUTY (LARGE) RS,450", price: 410, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 857, name: "POWDER BLACK BEAUTY (SMALL) RP,220", price: 195, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
      { id: 858, name: "POWDER BLACK CAT (LARGE) RS,480", price: 430, categoryId: "powders", categoryName: "Powders" },
      { id: 859, name: "POWDER BLACK CAT (SMALL) RS,250", price: 210, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 861, name: "POWDER COOL COOL RS,210", price: 170, categoryId: "powders", categoryName: "Powders" },
      { id: 862, name: "POWDER DENTONIC BOX 100GM (MEDIUM) RS,75", price: 0, categoryId: "powders", categoryName: "Powders" },
      { id: 863, name: "POWDER DENTONIC BOX 200GM (LARGE) RS,130", price: 0, categoryId: "powders", categoryName: "Powders" },
      { id: 864, name: "POWDER EDEN ROCK (LARGE) RS,310", price: 260, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 865, name: "POWDER EDEN ROCK (SMALL) RS,210", price: 180, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 866, name: "POWDER ENCHANTEUR 125g (PURPLE)", price: 479, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 867, name: "POWDER ENCHANTEUR 125g (PINK)", price: 479, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 868, name: "POWDER ENCHANTEUR 125g (ROSE)", price: 479, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 869, name: "POWDER ENCHANTEUR 125g (YELLOW)", price: 479, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
      { id: 870, name: "POWDER ENGLISH PRICKLY HEAT LARGE", price: 390, categoryId: "powders", categoryName: "Powders" },
      { id: 871, name: "POWDER ENGLISH PRICKLY HEAT SMALL", price: 239, categoryId: "powders", categoryName: "Powders" },
      { id: 872, name: "POWDER MEDORA (LARGE) (JOY) RS,480", price: 440, categoryId: "powders", categoryName: "Powders" },
      { id: 873, name: "POWDER MEDORA (SMALL) (JOY) RS,230", price: 210, categoryId: "powders", categoryName: "Powders" },
      { id: 874, name: "POWDER MEDORA (SMALL) (MIX) RS,230", price: 210, categoryId: "powders", categoryName: "Powders" },
      { id: 875, name: "POWDER MOTHER CARE GO-RASH 150g SMALL RS,400", price: 360, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 876, name: "POWDER MOTHER CARE GO-RASH 250g LARGE RS,550", price: 499, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 877, name: "POWDER TIBET (LARGE) RS,580", price: 540, categoryId: "powders", categoryName: "Powders" },
      { id: 878, name: "POWDER TIBET (SMALL) RS,190", price: 179, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 881, name:  "RAZOR DARCO", price: 199, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 882, name: "RAZOR FEMINA PINK", price: 40, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 883, name: "RAZOR TREET HYGIENE", price: 45, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "R" },
      { id: 884, name: "RAZOR TRIM", price: 59, categoryId: "shaving", categoryName: "Shaving & Razers & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "R" },
      { id: 904, name: "REGISTER (ALL TYPES)", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 905, name: "RACKET (SET) (EXCELLENT QUALITY)", price: 2250, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 906, name: "RACKET (SET) (NORMAL QUALITY)", price: 999, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 907, name: "RACKET (SET) (MEDIUM QUALITY)", price: 1450, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 908, name: "ROLL ON FA (AQUA)", price: 449, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 909, name: "ROLL ON ENCHANTEUR (MIX) WOMEN", price: 499, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 910, name: "ROLL ON FA (GREEN)", price: 449, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "R" },
      { id: 911, name: "ROLL ON FA (PINK)", price: 449, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 912, name: "ROLL ON FA (MYSTIC MOMENT)", price: 449, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "R" },
      { id: 913, name: "ROLL ON FA (SPORT)", price: 449, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "R" },
      { id: 914, name: "ROLL ON NIVEA (MEN)", price: 499, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 915, name: "ROLL ON NIVEA (WOMEN)", price: 499, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "R" },
      { id: 917, name: "ROLL ON YARDLEY MIX", price: 499, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 918, name: "ROOM SPRAY  DO IT", price: 239, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 919, name: "ROOM SPRAY (FRESH FRAGRANCE) MIX", price: 269, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 920, name: "ROOM SPRAY (IMP) DARHAM", price: 650, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "R" },
      { id: 921, name: "ROOM SPRAY (HOUSE CARE) MIX", price: 279, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "R" },
      { id: 922, name: "ROOM SPRAY (FREY) MIX", price: 299, categoryId: "general", categoryName: "General Item & Others" },
      { id: 923, name: "ROOM SPRAY NEW (GOOD MORNING) MIX", price: 239, categoryId: "fragnances", categoryName: "Fragnances" },
      { id: 926, name: "ROSE PETAL TISSUE ROLL MAXOB", price: 119, categoryId: "general", categoryName: "General Item & Others" },
      { id: 927, name: "SABALON SPRAY (PK) LARGE", price: 419, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 928, name: "SABALON SPRAY (PK) SMALL", price: 299, categoryId: "fragnances", categoryName: "Fragnances", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 929, name: "SAFETY BOX UNIVERSAL RS,10", price: 10, categoryId: "shaving", categoryName: "Shaving & Razers & Blades" },
      { id: 930, name: "SAFETY PIN (LARGE)", price: 30, categoryId: "general", categoryName: "General Item & Others" },
      { id: 931, name: "SAFETY PIN (MEDIUM)", price: 20, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 932, name: "SAMAD BOND BOX (SMALL)", price: 130, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 933, name: "SAVOLI OIL 100ml", price: 590, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 934, name: "SCALE ORO LARGE", price: 59, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 935, name: "SCALE ORO SMALL", price: 35, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 936, name: "SCISSOR STEEL LARGE", price: 439, categoryId: "general", categoryName: "General Item & Others" },
      { id: 937, name: "SCISSOR STEEL MEDIUM", price: 329, categoryId: "general", categoryName: "General Item & Others" },
      { id: 938, name: "SCISSOR STEEL MINI", price: 129, categoryId: "general", categoryName: "General Item & Others" },
      { id: 939, name: "SCISSOR STEEL SMALL", price: 109, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 940, name: "SERUM UJOOBA", price: 89, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 941, name: "SERUM BIO COSS", price: 89, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 942, name: "SERUM DERMA PLUS", price: 89, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 944, name: "SERUM FAIZA (LARGE)", price: 109, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 945, name: "SERUM GOLDEN PEARL (GOLDEN)", price: 105, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 946, name: "SERUM JHALAK", price: 89, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 947, name: "SERUM SANDAL", price: 89, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 948, name: "SET WET GEL (MIX)", price: 419, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 949, name: "SHAMPOO BIO AMLA FARVAL ORIGINAL RS,700", price: 599, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 950, name: "SHAMPOO BIO AMLA FARVEL ORIGINAL RS,340", price: 295, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 951, name: "SHAMPOO BIO AMLA FARVEL ORIGINAL RS,500", price: 430, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 952, name: "SHAMPOO BIO AMLA FARVEL ORIGINAL RS,180", price: 145, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 953, name: "SHAMPOO CLEAR 200ml  (MEN) BLUE RS,499", price: 479, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 955, name: "SHAMPOO CLEAR 400ml (MEN) BLUE RS,830", price: 789, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 958, name: "SHAMPOO DOVE 175ml (GOLDEN) DAILY MOISTURE RS,520", price: 495, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 959, name: "SHAMPOO DOVE 175ML (HAIR FALL) RS,520", price: 495, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 960, name: "SHAMPOO DOVE 175ml (INTENSIVE REPAIR) RS,520", price: 495, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 961, name: "SHAMPOO DOVE 175ml (LIGHT BLUE) RS,520", price: 495, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 962, name: "SHAMPOO DOVE 400ml (INTENSIVE REPAIR) RS,940", price: 495, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 964, name: "SHAMPOO ENGLISH ANTI LICE (LARGE) RS,370", price: 350, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 965, name: "SHAMPOO ENGLISH ANTI LICE (MEDIUM) RS,240", price: 225, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 966, name: "SHAMPOO ENGLISH ANTI LICE (SMALL) RS,170", price: 159, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 971, name: "SHAMPOO LIFEBUOY 100ml (GREEN) RS,200", price: 189, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 972, name: "SHAMPOO LIFEBUOY 100ml (ONION) RP,200", price: 189, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 973, name: "SHAMPOO LIFEBUOY 200ml (GREEN) RS,320", price: 299, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 974, name: "SHAMPOO LIFEBUOY 200ml (ONION) RS,320", price: 299, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 975, name: "SHAMPOO LIFEBUOY 200ml (YELLOW) RS,320", price: 299, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 976, name: "SHAMPOO LIFEBUOY 200ml (RETHA AMLA) RS,320", price: 299, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 977, name: "SHAMPOO LIFEBUOY 400ml (GREEN) RS,620", price: 589, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 978, name: "SHAMPOO LOREAL LARGE (HYALURON MOISTURE) RS,930", price: 849,categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 979, name: "SHAMPOO LOREAL LARGE (HYALURON PURE) RS,930", price: 849,categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 980, name: "SHAMPOO LOREAL LARGE (GLYCOLIC EXTRA GLOSS) RS,1050" ,price: 949,categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 981, name: "SHAMPOO LOREAL LARGE (TOTAL REPAIR 5) RS,930", price: 849, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 982, name: "SHAMPOO LOREAL LARGE (EXTRA-ORDINARY OIL) RP,930" , price: 849, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 983, name: "SHAMPOO LOREAL LARGE (COLOR VIBRANCY) RS,930" , price: 849, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 984, name: "SHAMPOO LOREAL LARGE (DREAM LONG) RS,930", price: 849, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 985, name: "SHAMPOO LOREAL LARGE (FALL RESIST 3D) RS,930", price: 849,categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 986, name: "SHAMPOO LOREAL MEDIUM (HYALURON MOISTURE) RS,600", price: 559, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 987, name: "SHAMPOO LOREAL MEDIUM (HYALURON PURE) RS,530", price: 489,categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 988, name: "SHAMPOO LOREAL MEDIUM (GLYCOLIC EXTRA GLOSS) RS,530", price: 489, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 989, name: "SHAMPOO LOREAL MEDIUM (TOTAL REPAIR 5) RS,530", price: 489,categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 990, name: "SHAMPOO LOREAL MEDIUM (EXTRA-ORDINARY OIL) RS,530", price: 489, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 991, name: "SHAMPOO LOREAL MEDIUM (COLOR VIBRANCY) RS,530", price: 489, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 992, name: "SHAMPOO LOREAL MEDIUM (DREAM LONG) RS,530", price: 489, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 993, name: "SHAMPOO LOREAL MEDIUM (FALL RESIST 3D) RS,530", price: 489,categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 994, name: "SHAMPOO MECLAY MEDIUM (PINK)", price: 369, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 995, name: "SHAMPOO MECLAY MEDIUM (PURPLE)", price: 369, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 996, name: "SHAMPOO MECLAY MEDIUM (DARK BLUE)", price: 369, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 997, name: "SHAMPOO MECLAY MEDIUM (GREEN)", price: 369, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 998, name: "SHAMPOO MECLAY MEDIUM (BLACK)", price: 369, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 999, name: "SHAMPOO MECLAY MEDIUM (RED)", price: 369, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 1000, name: "SHAMPOO MECLAY MEDIUM (ORANGE)", price: 369, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1001, name: "SHAMPOO MECLAY MEDIUM (GOLDEN) ", price: 369, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 1002, name: "SHAMPOO MECLAY MEDIUM (WHITE)", price: 369, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1003, name: "SHAMPOO MECLAY LARGE (PINK)", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 1004, name: "SHAMPOO MECLAY LARGE (PURPLE)", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1005, name: "SHAMPOO MECLAY LARGE (DARK BLUE)", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1006, name: "SHAMPOO MECLAY LARGE (GREEN)", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1007, name: "SHAMPOO MECLAY LARGE (BLACK)", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1008, name: "SHAMPOO MECLAY LARGE (RED)", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 1009, name: "SHAMPOO MECLAY LARGE (ORANGE)", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1010, name: "SHAMPOO MECLAY LARGE (GOLDEN)", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1011, name: "SHAMPOO MECLAY LARGE (WHITE)", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1012, name: "SHAMPOO PALMOLIVE (LARGE) (GREEN) HEALTHY & SMOOTH RS,700", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1013, name: "SHAMPOO PALMOLIVE (LARGE) (PINK) INTENSIVE MOISTURE RS,700", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1014, name: "SHAMPOO PALMOLIVE (LARGE) (WHITE) BRILLIANT SHINE RS,700", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1015, name: "SHAMPOO PALMOLIVE (MEDIUM) (WHITE) BRILLIANT SHINE RS,330", price: 379, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1016, name: "SHAMPOO PALMOLIVE (MEDIUM) (GREEN) HEALTHY & SMOOTH RS,330", price: 379, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1017, name: "SHAMPOO PALMOLIVE (MEDIUM) (PINK) INTENSIVE MOISTURE RS,330", price: 379, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1034, name: "SHAMPOO REVLON COLOUR SACHET 30#", price: 70, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 1035, name: "SHAMPOO SUNSILK (IMP) LARGE (BLACK) BLACK SHINE", price: 889, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1036, name: "SHAMPOO SUNSILK (IMP) LARGE (BLUE) ANTI DANDRUFF", price: 889, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1037, name: "SHAMPOO SUNSILK (IMP) LARGE (GOLDEN) H,F SOLUTION", price: 889, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1038, name: "SHAMPOO SUNSILK (IMP) MEDIUM (GREEN)", price: 439, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1040, name: "SHAMPOO SUNSILK (IMP) MEDIUM (BLACK)", price: 439, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1041, name: "SHAMPOO SUNSILK 100ml (BLACK) BLACK SHINE RS,190", price: 179, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 1042, name: "SHAMPOO SUNSILK 200ml (BLACK) BLACK SHINE RS,499", price: 479, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 1043, name: "SHAMPOO SUNSILK 200ml (GOLDEN) H,F SOLUTION RS,499", price: 479, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1044, name: "SHAMPOO SUNSILK 200ml (PINK) THICK & LONG RS,449", price: 479, categoryId: "shampoo", categoryName: "Shampoo & Conditioners", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 1045, name: "SHAMPOO SUNSILK 400ml (PINK) THICK & LONG RS,799", price: 769, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1046, name: "SHAMPOO SUNSILK 400ml (GOLDEN) SOFT & SMOOTH", price: 769, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1047, name: "SHAMPOO TRESEMME (IMP) 170ml (BLACK)", price: 520, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1048, name: "SHAMPOO TRESEMME (IMP) 170ml (GREEN)", price: 520, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1049, name: "SHAMPOO TRESEMME (IMP) 170ml (RED)", price: 520, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1051, name: "SHAMPOO TRESEMME 400ml (GREEN)", price: 885, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1052, name: "SHAMPOO TRESEMME 400ml (BLACK)", price: 885, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1053, name: "SHAMPOO TRESEMME 400ml (RED)", price: 885, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1054, name: "SHAMPOO VATIKA DUBAI LARGE (BLACK) RP,720", price: 659, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1055, name: "SHAMPOO VATIKA DUBAI LARGE (OLIVE) RS,720", price: 659, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1056, name: "SHAMPOO VATIKA DUBAI LARGE (COCO,N) BLUE RS,720", price: 659, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1057, name: "SHAMPOO VATIKA DUBAI LARGE (CACTUS) RS,720", price: 659, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1058, name: "SHAMPOO VATIKA DUBAI MEDIUM (ALMOND & HONEY) RS,435", price: 399, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1059, name: "SHAMPOO VATIKA DUBAI MEDIUM (OLIVE) RS,435", price: 399, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1060, name: "SHAMPOO VATIKA DUBAI MEDIUM (CACTUS) RS,435", price: 399, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1061, name: "SHAMPOO VATIKA DUBAI MEDIUM (BLACK) RS,435", price: 399, categoryId: "shampoo", categoryName: "Shampoo & Conditioners" },
      { id: 1062, name: "SHARPENER ORO RS,10", price: 9, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1063, name: "SHUTTLECOCK (PAR WALI) GOOD QUALITY", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1064, name: "SHUTTLECOCK (PAR WALI) EXCELLENT QUALITY", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1065, name: "SHUTTLECOCK (PLASTIC) EXCELLENT QUALITY", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1066, name: "SHUTTLECOCK (PLASTIC) GOOD QUALITY", price: 85, categoryId: "sports", categoryName: "Sports & Toys", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 1067, name: "SHIELD CHOOSNI (3 MONTH)", price: 90, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 1068, name: "SHIELD CHOOSNI (6 MONTH)", price: 90, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 1075, name: "SHIELD NIPPLE BOX", price: 80, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
      { id: 1076, name: "SOAP CAPRI (FAMILY PACK) 135g (YELLOW)", price: 130, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1081, name: "SOAP CAPRI (3 IN 1) YELLOW RS,390", price: 350, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1083, name: "SOAP DETTOL JUMBO COMPANY RS,150 (COOL)", price: 139, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1084, name: "SOAP DETTOL JUMBO COMPANY RS,150 (GREEN)", price: 139, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1086, name: "SOAP DETTOL MEDIUM COMPANY (COOL) RS,140", price: 129 ,categoryId: "soaps", categoryName: "Soaps" },
      { id: 1087, name: "SOAP DETTOL SMALL COMPANY (COOL)", price: 129, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1088, name: "SOAP DOVE LARGE WHITE (IMP)", price: 449, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1089, name: "SOAP DOVE LARGE PINK (IMP)", price: 449, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
      { id: 1090, name: "SOAP DOVE SMALL WHITE (IMP)", price: 0, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 1091, name: "SOAP DOVE SMALL PINK (IMP)", price: 0, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 1092, name: "SOAP FAIZA (NEEM)", price: 110, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1093, name: "SOAP FAIZA (PP)", price: 110, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1094, name: "SOAP GOLDEN PEARL (BLUE)", price: 125, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1095, name: "SOAP GOLDEN PEARL (PINK)", price: 125, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 1096, name: "SOAP GOLDEN PEARL (YELLOW)", price: 125, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 1097, name: "SOAP IMPERIAL 175gm LARGE", price: 390, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1098, name: "SOAP IMPERIAL LEATHER SMALL", price: 239, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 1099, name: "SOAP LIFEBUOY (LARGE) GREEN RS,125", price: 119, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1100, name: "SOAP LIFEBUOY (MEDIUM) (BLUE) RS,95", price: 90 ,categoryId: "soaps", categoryName: "Soaps" },
      { id: 1101, name: "SOAP LIFEBUOY (XL) BLUE RS,125", price: 119, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1102, name: "SOAP LIFEBUOY (XL) GREEN RS,125", price: 119, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1103, name: "SOAP PALMOLIVE (LARGE) RS,150 BLACK", price: 139 ,categoryId: "soaps", categoryName: "Soaps" },
      { id: 1104, name: "SOAP PALMOLIVE (LARGE) RS,150 ORANGE", price: 139, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1105, name: "SOAP PALMOLIVE (LARGE) RS,150 YELLOW", price: 139, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1109, name: "SOAP PEARS (BLUE)", price: 399, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1110, name: "SOAP PEARS (GREEN)", price: 399, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 1111, name: "SOAP PEARS (ORANGE)", price: 399, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1112, name: "SOAP SKIN WHITE (BLUE) RS,150", price: 129, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 1113, name: "SOAP SKIN WHITE (GREEN) RS,150", price: 129, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1114, name: "SOAP SKIN WHITE (PINK) RS,150", price: 129, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 1115, name: "SOAP TIBET (LARGE FAMILY SIZE) RS,109", price: 104, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 1116, name: "SOAP TIBET (MEDIUM BATH SIZE) RS,89", price: 85, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 1117, name: "SOAP TIBET (SMALL STANDARD SIZE) RS,70", price: 66, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1118, name: "SOFT TOUCH WONDER WAX LARGE GREEN", price: 249, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 1119, name: "SOFT TOUCH WONDER WAX LARGE LEMON", price: 249, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1120, name: "SOFT TOUCH WONDER WAX SMALL GREEN", price: 209, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1121, name: "SOFT TOUCH WONDER WAX SMALL LEMON", price: 209, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1122, name: "STUD SPRAY 10000", price: 1350, categoryId: "condemn", categoryName: "Condoms" },
      { id: 1130, name: "SUNBLOCK RIVAJ (LARGE) RP,630", price: 579, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 1131, name: "SUNBLOCK RIVAJ SPF 60 (SMALL) RP,300", price: 260, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1132, name: "TOY AUTO CAR", price: 50, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1133, name: "TOY AUTO CAR METAL", price: 379,categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1134, name: "TOY BALL FOAM", price: 60, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1135, name: "TOY BARREL O SLIME (MELON) KHARBOZA", price: 40, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1136, name: "TOY BARREL O SLIME JAR LARGE 200g", price: 99, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1137, name: "TOY BLOCKS GAME", price: 240,categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1138, name: "TOY BUBBLE CARTOON FACE (EX QUALITY)", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1139, name: "TOY BUBBLE CARTOON FACE (GOOD QUALITY)", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1140, name: "TOY BUBBLE FEEDER", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1141, name: "TOY BUBBLE FEEDER EX QUALITY", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1142, name: "TOY BUBBLE SURAHI WALA (EX LONG)", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1143, name: "TOY BUBBLE SURAHI WALA (EX QUALITY)", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1144, name: "TOY BUBBLE WITH FAN", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1145, name: "TOY CAR JUMPING LARGE PIECE 18 (DORAEMON)", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1146, name: "TOY CAR JUMPING LARGE PIECE 18", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1147, name: "TOY CAR JUMPING MEDIUM  (JEEP ) EX QUALITY", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1148, name: "TOY CHORDI GAME", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1149, name: "TOY CLAY LARGE", price: 85, categoryId: "sports", categoryName: "Sports & Toys", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "T" },
      { id: 1150, name: "TOY LASER LIGHT GUN", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1151, name: "TOY LIGHTING BALL", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1152, name: "TOY POP UP PATAKA (YELLOW)", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1153, name: "TOY TORCH LIGHT (SMALL) (#H 299)", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1154, name: "TOY WATER GUN", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1155, name: "TOY YOYO DORI LIGHT WALA (GOOD QUALITY)", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1156, name: "TAPE DOUBLE 2 INCH", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1157, name: "TAPE DOUBLE SIDED (1 INCH)", price: 65, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "T" },
      { id: 1158, name: "TAPE DOUBLE SIDED (1 INCH)", price: 63, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "T" },
      { id: 1159, name: "TAPE DOUBLE SIDED (1 INCH) TRANSPARENT", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1160, name: "TAPE KAGHAZ (0.5 INCH) HALF INCH 12 PIECES", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1161, name: "TAPE KAGHAZ 1 INCH", price: 65, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "T" },
      { id: 1162, name: "TAPE KAGHAZ 2 INCH", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1163, name: "TAPE OSAKA (BLACK)", price: 45, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "T" },
      { id: 1164, name: "TAPE OSAKA (BLACK) FULL LENGTH", price: 59, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1165, name: "TAPE OSAKA (RED)", price: 45, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "T" },
      { id: 1166, name: "TAPE OSAKA (RED) FULL LENGTH", price:59, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1167, name: "TAPE OSAKA (WHITE)", price: 45, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "T" },
      { id: 1168, name: "TAPE OSAKA (WHITE) FULL LENGTH", price: 59, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1169, name: "TAPE PACKING BROWN (2 INCH)", price: 95, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "T" },
      { id: 1170, name: "TAPE PACKING BROWN (2 INCH) 45 METER", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1171, name: "TAPE PACKING BROWN (2 INCH) 65 METER", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1172, name: "TAPE PACKING BROWN (2 INCH) SHORT LENGTH (SMALL)", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1173, name: "TAPE TRANSPARENT (0.5 INCH) EX QUALITY", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1174, name: "TAPE TRANSPARENT (1 INCH)", price: 55, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "T" },
      { id: 1175, name: "TAPE TRANSPARENT (1 INCH) FULL LENGTH", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1176, name: "TAPE TRANSPARENT (2 INCH)", price: 95, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "T" },
      { id: 1177, name: "TAPE TRANSPARENT (2 INCH) (MOTI)", price: 0, categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1178, name: "TAPE TRANSPARENT RS,10", price: 85, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "T" },
      { id: 1179, name: "TASH REGAL", price:180,categoryId: "sports", categoryName: "Sports & Toys", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "T" },
      { id: 1180, name: "TIGER INSECT SPRAY 300ML (SMALL)", price: 0, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 1181, name: "TIGER INSECT SPRAY 400ML (MEDIUM)", price: 0, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 1182, name: "TIGER INSECT SPRAY 600ML (LARGE)", price: 0, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 1183, name: "TOOTH PICK DENTAL FLOSS", price: 59, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "T" },
      { id: 1184, name: "TOOTH PICK LARGE", price: 89, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "T" },
      { id: 1185, name: "TOYS MIX", price: 0, categoryId: "sports", categoryName: "Sports & Toys" },
      { id: 1186, name: "TRUST PAD LARGE (ORANGE) R,P 190", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1187, name: "TRUST PAD LARGE (PURPLE) RS,340", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1188, name: "TRUST PAD LARGE (PINK) RS,220", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1189, name: "TRUST PAD LARGE (YELLOW) RS,290", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1190, name: "TUSAR GENTS", price: 80, categoryId: "general", categoryName: "General Item & Others" },
      { id: 1191, name: "TUSAR LADIES", price: 80, categoryId: "general", categoryName: "General Item & Others" },
      { id: 1192, name: "TUSBHI (LED)", price: 135, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "T" },
      { id: 1193, name: "TUSBHI (LED) GREEN", price:135, categoryId: "others", categoryName: "Others" },
      { id: 1194, name: "TUSBHI (LED) PATA", price: 115,categoryId: "general", categoryName: "General Item & Others" },
      { id: 1195, name: "TUSBHI (SADA)", price: 59, categoryId: "general", categoryName: "General Item & Others", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "T" },
      { id: 1196, name: "UHU PATA", price: 49, categoryId: "stationary", categoryName: "Stationary & Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "U" },
      { id: 1197, name: "UHU TUBE (# 11)", price: 110,categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1198, name: "UHU TUBE (# 12)", price: 165,categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1199, name: "UHU TUBE (# 13)", price: 275,categoryId: "stationary", categoryName: "Stationary & Tapes" },
      { id: 1200, name: "UNDERWEAR LADIES  BLACK & SKIN (LARGE) GOOD QUALITY (# 520)", price: 200,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1201, name: "UNDERWEAR LADIES  BLACK & SKIN (MEDIUM) GOOD QUALITY (# 320)", price: 200,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1202, name: "UNDERWEAR LADIES  BLACK & SKIN (SMALL) GOOD QUALITY (# 120)", price: 200,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1203, name: "UNDERWEAR LADIES  BLACK & SKIN (X,L) GOOD QUALITY (# 620)", price: 200,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1204, name: "VASELINE HAIR TONIC 100ml (NON ORIGINAL)", price: 199, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "V" },
      { id: 1205, name: "VASELINE HAIR TONIC 100ml (ORIGINAL)", price: 499,categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 1206, name: "VASELINE HAIR TONIC 200ml (NON ORIGINAL)", price: 299,categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 1207, name: "VASELINE HAIR TONIC 200ml (ORIGINAL)", price: 899,categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 1208, name: "VASELINE PETROLEUM (IMP) 250ML S,A (MIX)", price: 899,categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 1209, name: "VASELINE PETROLEUM (IMP) 100ml S,A (MIX)", price: 399, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
      { id: 1210, name: "VASELINE PETROLEUM (IMP) 50ml", price: 259,categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 1211, name: "VASELINE PETROLEUM (IMP) 50ml S,A (BLUE,ORIGINAL)", price: 249, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "V" },
      { id: 1212, name: "VASELINE PETROLEUM (IMP) 50ml S,A (GREEN,ALOE FRESH)", price: 249, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "V" },
      { id: 1213, name: "VASELINE PETROLEUM (IMP) 50ml S,A (MIX)", price: 249, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "V" },
      { id: 1214, name: "VASELINE PETROLEUM (IMP) 50ml S,A (PINK,BABY)", price: 249, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "V" },
      { id: 1215, name: "VASELINE PETROLEUM (IMP) 50ml S,A (VITAMIN E)", price: 249, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "V" },
      { id: 1216, name: "VASELINE TIBET RS,130", price: 119, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
      { id: 1217, name: "VASELINE THERAPY PINK", price: 0, categoryId: "creams", categoryName: "Creams & Lotions" },
      { id: 1218, name: "VATIKA HAIR OIL 100ml (ALMOND) COMPANY RS,370", price:339, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 1219, name: "VATIKA HAIR OIL 100ml (CACTUS) COMPANY RP,350", price: 319,categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 1220, name: "VATIKA HAIR OIL 100ml (Coconut)", price: 319, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
      { id: 1221, name: "VATIKA HAIR OIL 100ML (GARLIC) COMPANY RP,350", price: 319,categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 1222, name: "VATIKA HAIR OIL 100ml (OLIVE)", price: 319, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "V" },
      { id: 1223, name: "VATIKA HAIR OIL 200ml (ALMOND) RS,640", price:599, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 1224, name: "VATIKA HAIR OIL 200ml (CACTUS)", price: 599, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "V" },
      { id: 1225, name: "VATIKA HAIR OIL 200ml (Coconut)", price: 599,categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 1226, name: "VATIKA HAIR OIL 200ml (GARLIC)", price: 599,categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 1227, name: "VATIKA HAIR OIL 200ml (OLIVE)", price: 599, categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "V" },
      { id: 1228, name: "VATIKA HAIR OIL 200ml (ONION)", price: 599,categoryId: "haircolour", categoryName: "Hair Colour & Care & Oil" },
      { id: 1229, name: "VEET JAR LARGE (BLUE) RS,595", price: 559,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1230, name: "VEET JAR LARGE (GREEN) RS,595", price:559, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1231, name: "VEET JAR LARGE (MIX) RS,595", price: 559, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "V" },
      { id: 1232, name: "VEET JAR LARGE (PINK) RS,595", price: 559,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1233, name: "VEET JAR SMALL (GREEN) RS,300", price:269, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1234, name: "VEET JAR SMALL (PINK) RS,300", price:269, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1235, name: "VEET JAR SMALL 40G (MIX) RS,300", price: 269, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "V" },
      { id: 1236, name: "VEET STRIPS (BLUE)", price: 349,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1237, name: "VEET STRIPS (GREEN)", price: 349,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1238, name: "VEET STRIPS (PINK)", price: 349,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1239, name: "VEET TUBE LARGE (BLUE) FULL SIZE", price: 799,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1240, name: "VEET TUBE LARGE (IMP) GREEN", price: 699,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1241, name: "VEET TUBE MEDIUM (BLUE) RS,495", price: 459,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1242, name: "VEET TUBE MEDIUM (GREEN) RS,495", price: 459,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1243, name: "VEET TUBE MEDIUM 50G (MIX)", price: 459, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "V" },
      { id: 1244, name: "VEET TUBE SMALL 25G (MIX) RS,250", price: 229, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
      { id: 1245, name: "VENEEZIA WAX (JAR)", price: 499, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1246, name: "VENEEZIA WAX (LARGE) RS,280", price: 249, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "V" },
      { id: 1247, name: "VENEEZIA WAX (SMALL) RP,220", price: 195, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "V" },
      { id: 1248, name: "VENEEZIA WAX PARLOR SIZE", price:599, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1249, name: "VITAMIN (E) CAPSULES (FACIAL ESSENCE)", price: 5, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
      { id: 1250, name: "VITAMIN CAPSULE LARGE WHITE", price: 8, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "V" },
      { id: 1251, name: "WASH ROOM TIKI (GOOD QUALITY) FRESH", price: 150, categoryId: "general", categoryName: "General Item & Others" },
      { id: 1252, name: "WASH ROOM TIKI (SASTI)", price: 70, categoryId: "general", categoryName: "General Item & Others" },
      { id: 1253, name: "WAX PATI", price: 80, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1254, name: "WAX PATI BUKRAM", price: 90, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "W" },
      { id: 1255, name: "WAX PATI BUKRAM", price: 90, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "W" },
      { id: 1256, name: "WHITE ROSE H,R JAR (LARGE) RS,280", price: 239, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1257, name: "WHITE ROSE H,R JAR (MEDIUM) RS,220", price: 199, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1258, name: "WHITE ROSE H,R JAR (SMALL) RS,190", price: 169, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1259, name: "WIPES CHINA BABY", price: 99, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 1260, name: "WIPES JEEP CAMERA", price: 169, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 1261, name: "WIPES NEXTON", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 1262, name: "WIPES PAMPER (NON ORIGINAL)", price: 249, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "W" },
      { id: 1263, name: "WIPES SOFT CREME (MIX)", price: 129, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "W" },
      { id: 1264, name: "WIPES SOFT-CREAM (BLUE)", price: 129, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 1265, name: "WIPES SOFT-CREAM (WHITE)", price: 129, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 1266, name: "ZERO MOSQUITO SACHET BOX RS,10", price: 8, categoryId: "mosquito", categoryName: "Anti-Mosquito", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "Z" },
    ];


    var PAGE_SIZE = 10;
    const RECENT_LIMIT = 15;
    const BRAND_STOP_WORDS = new Set([
      "SOAP","SOAPS","SHAMPOO","CONDITIONER","CREAM","LOTION","POWDER","SPRAY","BODY","FACE","WASH","TOOTH","PASTE","BRUSH","RAZOR","BLADE","OIL","HAIR","COLOUR","COLOR","BALL","PEN","TOY","TAPE","CELL","LOCK","CANDLE","PAD","WIPES","PERFUME","PERFUMES","DEO","DEODORANT","TALCUM","ROOM","FRESHNER","FRESHENER","ROLL","ON","AIR","LARGE","MEDIUM","SMALL","SACHET","PACK","PCS","PIECE","SIZE","FULL","HALF","MIX","ALL","GOOD","QUALITY","ORIGINAL","NON","IMP","PK","RS","RP","ML","G","GM","KG","INCH","BLACK","WHITE","BLUE","GREEN","RED","PINK","YELLOW","GOLDEN","BROWN","ORANGE","PURPLE","DARK","LIGHT"
    ]);
    const BRAND_PHRASES = [
      "BIO AMLA","BLACK ROSE","AL RASHIEED","JUST FOR MEN","ONE MAN SHOW","WHITE ROSE","SOFT CREME","SOFT CREAM","SKIN WHITE","CHI CHI","7 HERBAL","BODY SHOP"
    ];

    function getProductBrand(name) {
      const clean = String(name || "")
        .toUpperCase()
        .replace(/[#(),.&/+_-]/g, " ")
        .replace(/\b\d+\s*(ML|G|GM|KG|PCS|PC|INCH|METER)\b/g, " ")
        .replace(/\b(RS|RP)\s*\d+\b/g, " ")
        .replace(/\s+/g, " ")
        .trim();
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
      return Array.from(counts.entries())
        .filter(([, count]) => count >= 2)
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, 18)
        .map(([name, count]) => ({ name, count }));
    }

function AboutUsModal({ isOpen, onClose, language }) {
  if (!isOpen) return null;
  const isUrdu = language === 'ur';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-scale-in relative"
        style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header Banner */}
        <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-black text-white p-6 pb-8 text-center">
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold w-9 h-9 flex items-center justify-center rounded-full bg-white/10 transition-colors cursor-pointer"
          >
            ×
          </button>
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white p-2 shadow-lg flex items-center justify-center">
            <img 
              src="images/sahil-traders-logo.png" 
              alt="Sahil Traders Logo" 
              loading="lazy" 
              decoding="async" 
              className="w-full h-full object-contain" 
            />
          </div>
          <h2 className="text-2xl font-black tracking-wider uppercase text-amber-400 font-poppins">Sahil Traders</h2>
          <p className="text-xs text-gray-300 font-medium mt-1 tracking-widest uppercase">
            {isUrdu ? 'کراچی کا قابلِ اعتماد ہول سیل و پرچون اسٹور — قائم شدہ 2021' : 'Trusted Wholesale & Retail Store — Est. 2021, Karachi'}
          </p>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1 text-gray-800 text-sm leading-relaxed">
          {/* Top Price Fluctuation Disclaimer */}
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-950 space-y-1">
            <div className="flex items-center gap-2 font-black text-xs text-red-900 uppercase tracking-wide">
              ⚠️ {isUrdu ? 'قیمتوں اور اسٹاک سے متعلق ضروری اعلان' : 'Important Notice — Please Read!'}
            </div>
            <p className={isUrdu ? 'font-urdu text-right text-xs leading-loose text-red-950 font-bold' : 'text-xs text-red-950 leading-relaxed font-semibold'}>
              {isUrdu
                ? 'ہمارے پاس ہزاروں قسم کی چیزیں ہیں — اس وجہ سے کچھ چیزوں کا ریٹ مارکیٹ کے حساب سے کم یا زیادہ ہو سکتا ہے۔ لیکن ہم آپ سے وعدہ کرتے ہیں کہ ہمارا ریٹ ہمیشہ سب سے سستا ہوگا!'
                : 'We have thousands of different items — so some prices may go slightly up or down depending on the market. But we promise you: our prices will always be the cheapest you can find anywhere!'}
            </p>
          </div>

          {/* Story Card */}
          <div className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-4 text-amber-950 shadow-sm">
            <div className="flex items-center gap-2 font-bold text-base mb-2 text-amber-900">
              <span className="text-xl">🏬</span>
              <span>{isUrdu ? 'ہماری کہانی (Our Story)' : 'Our Story Since 2021'}</span>
            </div>
            <p className={isUrdu ? 'font-urdu text-right text-sm leading-loose' : 'text-xs sm:text-sm text-gray-700 leading-normal'}>
              {isUrdu 
                ? 'ساحل ٹریڈرز کا آغاز 2021 میں کراچی سے ایک قابلِ اعتماد خاندانی ہول سیل بزنس کے طور پر ہوا۔ ہمارا مقصد تمام گاہکوں کو 4,000+ مصنوعات باضابطہ برانڈز سے براہِ راست ہول سیل قیمتوں پر فراہم کرنا ہے، چاہے وہ 1 آئٹم ہی کیوں نہ خرید رہے ہوں۔' 
                : 'Established in 2021 in Karachi, Sahil Traders started as a trusted family wholesale business. Our mission is simple: bringing direct wholesale prices to retail customers across Pakistan on 4,000+ daily essentials and branded products.'}
            </p>
          </div>

          {/* Guaranteed Lowest Price Highlight Card (سب سے منفرد بات - شرطیہ سب سے کم قیمت) */}
          <div className="relative overflow-hidden bg-gradient-to-br from-amber-500 via-orange-500 to-amber-600 text-white rounded-2xl p-4 shadow-lg border-2 border-amber-300">
            <div className="absolute top-2 right-2 bg-yellow-300 text-amber-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              🔥 {isUrdu ? 'سب سے منفرد بات — شرطیہ' : 'Guaranteed Lowest Rates'}
            </div>
            <div className="flex items-center gap-2.5 mb-2 font-black text-base pr-20">
              <span className="text-2xl">⚡</span>
              <span className="tracking-wide">{isUrdu ? 'پاکستان کے بڑے سے بڑے سپر مارٹ سے سستا!' : 'Lower Rates Than Any Supermart'}</span>
            </div>
            <p className={isUrdu ? 'font-urdu text-right text-xs sm:text-sm font-semibold leading-relaxed text-amber-50' : 'text-xs sm:text-sm font-medium leading-relaxed text-amber-50'}>
              {isUrdu
                ? 'ہمارے 90% سے زائد پروڈکٹس کے ریٹس پاکستان کے بڑے سے بڑے سپر مارٹ سے بھی کم ہوتے ہیں — شرطیہ! یہی ہماری سب سے بڑی خصوصیت اور منفرد بات ہے جس کی وجہ سے ہم نے یہ کام شروع کیا۔ اتنی زیادہ ورائٹی اور اتنی کم قیمت آپ کو اور کہیں نہیں ملے گی!'
                : 'Over 90% of our product prices are strictly lower than any big supermart across Pakistan — Guaranteed! This unique commitment to direct wholesale pricing and huge variety is the core reason why we started Sahil Traders.'}
            </p>
          </div>

          {/* Leadership & Co-Founders Card */}
          <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-black border border-gray-800 rounded-2xl p-4 text-white shadow-md space-y-3">
            <div className="flex items-center gap-2 font-black text-sm text-amber-400 uppercase tracking-wider border-b border-gray-800 pb-2">
              <span>🤝</span>
              <span>{isUrdu ? 'قیادت اور پارٹنرشپ (Leadership & Partnership)' : 'Leadership & Partnership'}</span>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {/* Shop Owner Card (Muhammad Zubair Moin) */}
              <div className="bg-white/10 border border-white/10 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-amber-400 text-gray-950 font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                  🏬
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase text-amber-300 tracking-wider">
                    {isUrdu ? 'دکان کے مالکان (بڑے بھائی)' : 'Shop Owner (Elder Brother)'}
                  </div>
                  <div className="font-black text-sm text-white">
                    Muhammad Zubair Moin
                  </div>
                  <div className="text-[11px] text-gray-300 font-medium">
                    {isUrdu ? 'آنر BS Mart' : 'Owner — BS Mart'}
                  </div>
                </div>
              </div>

              {/* Website Creator & Co-Founder Card (Muhammad Sahil Saleem) */}
              <div className="bg-white/10 border border-white/10 rounded-xl p-3 flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-lg bg-yellow-400 text-gray-950 font-black text-lg flex items-center justify-center shrink-0 shadow-sm">
                  👨‍💻
                </div>
                <div>
                  <div className="text-[10px] font-extrabold uppercase text-yellow-300 tracking-wider">
                    {isUrdu ? 'ویب سائٹ میکر اور پارٹنر' : 'Website Creator & Partner'}
                  </div>
                  <div className="font-black text-sm text-white">
                    Muhammad Sahil Saleem
                  </div>
                  <div className="text-[11px] text-gray-300 font-medium">
                    {isUrdu ? 'بانی و ڈیولپر' : 'Founder & Developer'}
                  </div>
                </div>
              </div>
            </div>

            <p className={isUrdu ? 'font-urdu text-right text-xs text-amber-200/90 pt-1 leading-relaxed' : 'text-xs text-amber-200/90 pt-1 leading-relaxed'}>
              {isUrdu 
                ? '💡 یہ تمام تر سیٹ اپ اور بزنس محمد زبیر معین (مالک BS Mart) اور محمد ساحل سلیم دونوں بھائی مل کر مشترکہ طور پر چلا رہے ہیں۔'
                : '💡 This complete business setup is jointly managed by both brothers, Muhammad Zubair Moin (Owner, BS Mart) & Muhammad Sahil Saleem.'}
            </p>
          </div>

          {/* Physical Shop Info Card (BS Mart) */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-2xl p-4 text-emerald-950 space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
                <span className="text-lg">🏬</span>
                <span>{isUrdu ? 'ہماری فزیکل دکان (BS Mart)' : 'Visit Our Physical Shop (BS Mart)'}</span>
              </div>
              <span className="bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                {isUrdu ? 'BS مارٹ' : 'BS Mart'}
              </span>
            </div>
            <p className={isUrdu ? 'font-urdu text-right text-xs sm:text-sm text-emerald-900 leading-relaxed font-semibold' : 'text-xs sm:text-sm text-emerald-900 leading-relaxed font-semibold'}>
              {isUrdu 
                ? 'ہے۔ ویب سائٹ پر موجود تقریباً تمام تر مصنوعات آپ کو ہماری دکان (BS Mart) پر بھی مل جائیں گی۔ (نوٹ: شارٹیج یا زیادہ ڈیمانڈ کی صورت میں شاید کچھ پروڈکٹس عارضی طور پر دکان پر اسٹاک میں نہ ہوں، لیکن ہم مسلسل ری اسٹاک کرتے ہیں!)' 
                : 'Visit our physical shop BS Mart! Almost all items listed on this website are available in person at our store. (Note: Due to high demand or market shortage, certain items may temporarily be out of stock, but we restock continuously!)'}
            </p>
          </div>

          {/* 4 Highlights Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 border border-gray-200/70 p-3 rounded-2xl text-center flex flex-col items-center">
              <div className="text-2xl mb-1">📦</div>
              <div className="font-black text-gray-900 text-sm">4,000+</div>
              <div className="text-[11px] text-gray-600 font-medium mt-0.5">{isUrdu ? 'مصنوعات کی ورائٹی' : 'Total Products'}</div>
            </div>
            <div className="bg-gray-50 border border-gray-200/70 p-3 rounded-2xl text-center flex flex-col items-center">
              <div className="text-2xl mb-1">🏷️</div>
              <div className="font-black text-gray-900 text-sm">{isUrdu ? 'ہول سیل ریٹس' : 'Wholesale Rates'}</div>
              <div className="text-[11px] text-gray-600 font-medium mt-0.5">{isUrdu ? 'عام گاہکوں کے لیے' : 'For Everyone'}</div>
            </div>
            <div className="bg-gray-50 border border-gray-200/70 p-3 rounded-2xl text-center flex flex-col items-center">
              <div className="text-2xl mb-1">💯</div>
              <div className="font-black text-gray-900 text-sm">100% Original</div>
              <div className="text-[11px] text-gray-600 font-medium mt-0.5">{isUrdu ? 'اصلی برانڈز' : 'Genuine Brands'}</div>
            </div>
            <div className="bg-gray-50 border border-gray-200/70 p-3 rounded-2xl text-center flex flex-col items-center">
              <div className="text-2xl mb-1">🚚</div>
              <div className="font-black text-gray-900 text-sm">{isUrdu ? 'فاسٹ ڈیلیوری' : 'Fast Delivery'}</div>
              <div className="text-[11px] text-gray-600 font-medium mt-0.5">{isUrdu ? 'پورے پاکستان میں' : 'Across Pakistan'}</div>
            </div>
          </div>

          {/* Business Hours Card */}
          <div className="bg-purple-50/70 border border-purple-200/80 rounded-2xl p-4 text-purple-950 space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-purple-900">
              <span className="text-lg">⏰</span>
              <span>{isUrdu ? 'اوقاتِ کار (Business Hours)' : 'Store Business Hours'}</span>
            </div>
            <div className="bg-white/90 border border-purple-100 rounded-xl p-3 text-xs flex justify-between items-center shadow-xs">
              <div>
                <div className="font-bold text-gray-900">{isUrdu ? 'پیر تا ہفتہ (Monday to Saturday):' : 'Monday to Saturday:'}</div>
                <div className="text-purple-700 font-extrabold text-sm mt-0.5">{isUrdu ? 'صبح 10:00 بجے سے رات 8:00 بجے تک' : '10:00 AM – 8:00 PM'}</div>
              </div>
              <span className="bg-green-100 text-green-800 text-[10px] font-bold px-2.5 py-1 rounded-full border border-green-200 uppercase">
                {isUrdu ? 'کھلا ہے' : 'Open'}
              </span>
            </div>
          </div>

          {/* Features List */}
          <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4 text-emerald-950 text-xs space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm text-emerald-900">
              <span>✨</span>
              <span>{isUrdu ? 'ہماری خصوصیات (Why Choose Us)' : 'Why Customers Trust Us'}</span>
            </div>
            <ul className="space-y-1.5 list-disc list-inside text-emerald-900">
              <li>{isUrdu ? '2021 سے خاندانی اعتماد کے ساتھ خدمت' : 'Family business serving with trust since 2021'}</li>
              <li>{isUrdu ? 'Rs. 2,000 سے زائد پر مفت شپنگ (Free Delivery)' : 'Free delivery on orders above Rs. 2,000'}</li>
              <li>{isUrdu ? 'اسی دن تبدیلی اور واپسی کی سہولت (Same-day Return)' : 'Same-day return & exchange policy'}</li>
              <li>{isUrdu ? 'براہِ راست واٹس ایپ پر فوری سپورٹ' : 'Direct WhatsApp customer support'}</li>
            </ul>
          </div>

          {/* Google Maps Exact Plus Code Location Card */}
          <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 font-bold text-sm text-blue-950">
                <span className="text-lg">📍</span>
                <span>{isUrdu ? 'دکان کا مکمل پتہ اور نقشہ' : 'Store Address & Exact Location'}</span>
              </div>
              <a 
                href="https://www.google.com/maps/search/?api=1&query=R4C4%2BRV6%2C+Safaid+White+Masjid+Rd%2C+Allah+Wala+Town+Sector+H+Korangi%2C+Karachi%2C+Pakistan" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-[11px] font-bold text-blue-700 hover:text-blue-900 underline flex items-center gap-1 text-decoration-none"
              >
                {isUrdu ? 'نقشہ کھولیں ↗' : 'Open Map ↗'}
              </a>
            </div>

            <div className="bg-white/90 border border-blue-100 rounded-xl p-3 text-xs text-gray-800 font-medium leading-relaxed flex items-start gap-2 shadow-xs">
              <span className="text-blue-600 font-bold shrink-0 mt-0.5 text-sm">🏬</span>
              <div>
                <div className="font-bold text-gray-900">Sahil Traders (Wholesale & Retail)</div>
                <div className="text-gray-600 mt-0.5">
                  {isUrdu ? 'R4C4+RV6، سفید مسجد روڈ، اللہ والا ٹاؤن سیکٹر ایچ، کورنگی، کراچی، پاکستان' : 'R4C4+RV6, Safaid White Masjid Rd, Allah Wala Town Sector H Korangi, Karachi, Pakistan'}
                </div>
              </div>
            </div>

            <div className="w-full h-48 sm:h-52 rounded-xl overflow-hidden border border-blue-200 shadow-inner relative bg-gray-100">
              <iframe
                title="Sahil Traders Google Map Location"
                src="https://maps.google.com/maps?q=R4C4%2BRV6%2C+Safaid+White+Masjid+Rd%2C+Allah+Wala+Town+Sector+H+Korangi%2C+Karachi%2C+Pakistan&t=&z=17&ie=UTF8&iwloc=&output=embed"
                className="w-full h-full border-0"
                loading="lazy"
                allowFullScreen={true}
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between gap-3">
          <a
            href={`https://wa.me/${(window.STORE_CONFIG && window.STORE_CONFIG.whatsappNumber) || '923368945775'}?text=${encodeURIComponent(isUrdu ? 'سلام! میں ساحل ٹریڈرز کے بارے میں معلومات حاصل کرنا چاہتا ہوں۔' : 'Hi Sahil Traders! I have an inquiry about your store.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 py-3 px-4 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold text-xs tracking-wider uppercase text-center transition-colors flex items-center justify-center gap-2 text-decoration-none"
          >
            <span>💬</span>
            <span>{isUrdu ? 'واٹس ایپ پر رابطہ کریں' : 'Chat on WhatsApp'}</span>
          </a>
          <button
            onClick={onClose}
            className="py-3 px-5 rounded-xl bg-gray-900 hover:bg-black text-white font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
          >
            {isUrdu ? 'بند کریں' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

function WelcomeDisclaimerModal({ isOpen, onClose, onOpenAbout, language }) {
  if (!isOpen) return null;
  const isUrdu = language === 'ur';

  return (
    <div 
      className="fixed inset-0 z-[99] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border-2 border-amber-400 animate-scale-in relative p-6 text-center"
        onClick={e => e.stopPropagation()}
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-white flex items-center justify-center text-3xl shadow-lg">
          👋
        </div>

        <h3 className="text-xl font-black text-gray-900 tracking-wide">
          {isUrdu ? 'السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللهِ وَبَرَكَاتُهُ' : 'Assalam U alaikum!'}
        </h3>
        <h4 className="text-lg font-extrabold text-amber-600 mt-1 font-poppins">
          {isUrdu ? 'ساحل ٹریڈرز میں خوش آمدید' : 'Welcome to Sahil Traders'}
        </h4>

        <div className="my-5 p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-950">
          <div className="flex items-center justify-center gap-1.5 font-bold text-sm text-amber-900 mb-1.5">
            📢 {isUrdu ? 'ضروری گزارش / اعلان' : 'Important Notice'}
          </div>
          <p className={isUrdu ? 'font-urdu text-right text-xs leading-loose' : 'text-xs text-gray-700 leading-normal text-left'}>
            {isUrdu 
              ? 'ہماری آپ سے گزارش ہے کہ ایک بار ہمارا "About Us (ہماری معلومات)" سیکشن لازمی پڑھ لیں، تاکہ آپ کو تمام ضروری اور اہم معلومات مل سکیں اور خریداری میں کوئی مسئلہ پیش نہ آئے۔'
              : 'We kindly request you to please read our "About Us" section at least once so you get all the essential information and shop with complete clarity.'}
          </p>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => {
              onOpenAbout();
              onClose();
            }}
            className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs tracking-wider uppercase transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
          >
            📖 {isUrdu ? 'ہماری معلومات پڑھیں (Read About Us)' : 'Read About Us'}
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-2.5 px-5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs tracking-wider uppercase transition-all cursor-pointer"
          >
            {isUrdu ? 'ٹھیک ہے، آگے بڑھیں' : 'Understood, Continue'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductDetailModal({ product, open, onClose, onAddToCart, products, langData, language, onSelectProduct }) {
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

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-200 animate-scale-in relative flex flex-col"
        style={{ maxHeight: '90vh' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/80">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black tracking-widest uppercase text-gray-500 font-poppins">
              {isUrdu ? 'پروڈکٹ کی مکمل تفصیلات' : 'Product Details & Info'}
            </span>
            <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-amber-200">
              {isUrdu ? 'بہترین ہول سیل ریٹ' : 'Wholesale Rate'}
            </span>
          </div>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-200 hover:bg-black hover:text-white text-gray-700 font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Main Product Info Card */}
          <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start bg-gradient-to-br from-gray-50 to-amber-50/30 p-4 rounded-2xl border border-gray-200 shadow-xs">
            {/* Image */}
            <div className="w-36 h-36 sm:w-40 sm:h-40 shrink-0 bg-white rounded-2xl p-2.5 border border-gray-200 flex items-center justify-center shadow-sm relative group">
              {hasFile ? (
                <img 
                  src={imageSrc} 
                  alt={product.name} 
                  loading="lazy" 
                  decoding="async" 
                  className="w-full h-full object-contain" 
                />
              ) : (
                <div className={`w-full h-full rounded-xl bg-gradient-to-br ${product.gradient || 'from-amber-400 to-amber-600'} flex items-center justify-center text-white text-4xl font-black`}>
                  {product.initial || 'P'}
                </div>
              )}
              <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                Original
              </span>
            </div>

            {/* Details */}
            <div className="flex-1 space-y-2.5 text-center sm:text-left">
              <div className="flex flex-wrap gap-1.5 justify-center sm:justify-start items-center">
                <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200 uppercase">
                  {isUrdu ? '✓ اسٹاک میں دستیاب' : '✓ In Stock'}
                </span>
                {product.categoryName && (
                  <span className="bg-gray-200 text-gray-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                    {product.categoryName}
                  </span>
                )}
              </div>

              <h3 className="text-base font-black text-gray-900 leading-snug">
                {getProductDisplayName(product, language)}
              </h3>

              <div className="flex items-baseline justify-center sm:justify-start gap-2">
                <span className="text-2xl font-black text-black">
                  Rs. {product.price.toLocaleString()}
                </span>
                <span className="text-xs text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                  {isUrdu ? 'سپر مارکیٹ سے سستا' : 'Cheaper than Supermarts'}
                </span>
              </div>

              {/* Quantity Selector */}
              <div className="pt-1 flex items-center justify-center sm:justify-start gap-3">
                <span className="text-xs font-bold text-gray-700">
                  {isUrdu ? 'تعداد (Quantity):' : 'Quantity:'}
                </span>
                <div className="flex items-center border border-gray-300 rounded-xl overflow-hidden bg-white shadow-2xs">
                  <button 
                    onClick={() => setModalQty(q => Math.max(1, q - 1))}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-sm flex items-center justify-center cursor-pointer transition-colors"
                  >
                    -
                  </button>
                  <span className="w-10 text-center font-black text-sm text-black">
                    {modalQty}
                  </span>
                  <button 
                    onClick={() => setModalQty(q => q + 1)}
                    className="w-8 h-8 bg-gray-100 hover:bg-gray-200 text-gray-800 font-black text-sm flex items-center justify-center cursor-pointer transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => { 
                    for(let i=0; i<modalQty; i++) onAddToCart(product); 
                    onClose(); 
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-black hover:bg-gray-800 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>🛒</span>
                  <span>{translate(langData, "addToCart")}</span>
                </button>
                
                <button
                  onClick={handleDirectWhatsAppOrder}
                  className="w-full py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs tracking-wider uppercase transition-colors shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>💬</span>
                  <span>{isUrdu ? 'واٹس ایپ پر آرڈر کریں' : 'Buy on WhatsApp'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Highlights & Guarantees */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex items-center gap-2">
              <span className="text-lg">💯</span>
              <div>
                <div className="font-bold text-gray-900">{isUrdu ? '100% اصلی آئٹم' : '100% Original'}</div>
                <div className="text-[10px] text-gray-500">{isUrdu ? 'گارنٹی شدہ معیار' : 'Guaranteed Quality'}</div>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex items-center gap-2">
              <span className="text-lg">🚚</span>
              <div>
                <div className="font-bold text-gray-900">{isUrdu ? 'ہوم ڈیلیوری' : 'Home Delivery'}</div>
                <div className="text-[10px] text-gray-500">{isUrdu ? 'Rs. 2000+ پر مفت' : 'Free on Rs 2000+'}</div>
              </div>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-2.5 flex items-center gap-2">
              <span className="text-lg">🏬</span>
              <div>
                <div className="font-bold text-gray-900">{isUrdu ? 'دکان سے پک اپ' : 'Store Pickup'}</div>
                <div className="text-[10px] text-gray-500">{isUrdu ? 'BS Mart دکان سے لیں' : 'BS Mart Shop Karachi'}</div>
              </div>
            </div>
          </div>


          {/* Related Products Section ("Ye Bhi Dekhein / یہ بھی دیکھیں") */}
          {relatedProducts.length > 0 && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 font-black text-sm text-gray-900 uppercase tracking-wider">
                  <span className="text-amber-500 text-base">✨</span>
                  <span>{isUrdu ? 'یہ بھی دیکھیں (Related Products)' : 'You May Also Like'}</span>
                </div>
                <span className="text-[11px] text-gray-400 font-medium">
                  {relatedProducts.length} {isUrdu ? 'مصنوعات' : 'items'}
                </span>
              </div>

              {/* Related Products Mini Horizontal Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {relatedProducts.map(rel => {
                  const relHasFile = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[rel.id];
                  const relImgSrc = relHasFile ? `images/${rel.id}.${window.PRODUCT_IMAGE_MAP[rel.id]}` : null;
                  return (
                    <div 
                      key={rel.id}
                      onClick={() => onSelectProduct && onSelectProduct(rel)}
                      className="bg-white border border-gray-200 hover:border-gray-900 rounded-2xl p-2.5 flex flex-col justify-between transition-all cursor-pointer group shadow-xs hover:shadow-md"
                    >
                      <div className="h-20 w-full bg-gray-50 rounded-xl p-1 mb-2 flex items-center justify-center overflow-hidden">
                        {relHasFile ? (
                          <img 
                            src={relImgSrc} 
                            alt={rel.name} 
                            loading="lazy" 
                            decoding="async" 
                            className="w-full h-full object-contain group-hover:scale-105 transition-transform" 
                          />
                        ) : (
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${rel.gradient || 'from-gray-400 to-gray-600'} flex items-center justify-center text-white text-xs font-bold`}>
                            {rel.initial || 'P'}
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] font-bold text-gray-800 line-clamp-2 leading-tight mb-1 group-hover:text-black">
                        {getProductDisplayName(rel, language)}
                      </p>
                      <div className="flex items-center justify-between gap-1 mt-auto pt-1 border-t border-gray-100">
                        <span className="text-xs font-extrabold text-black">
                          Rs.{rel.price}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(rel);
                          }}
                          className="w-6 h-6 rounded-lg bg-gray-900 hover:bg-black text-white font-bold text-xs flex items-center justify-center transition-colors cursor-pointer"
                          title="Quick Add to Cart"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-100 bg-gray-50 text-center">
          <button 
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold text-xs tracking-wider uppercase transition-colors cursor-pointer"
          >
            {isUrdu ? 'بند کریں' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SahilTraders() {

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
        const getSnapshot = (state) => ({
          checkoutOpen: !!state.checkoutOpen,
          cartOpen: !!state.cartOpen,
          selectedCategory: state.selectedCategory || null,
          selectedBrand: state.selectedBrand || "all",
          filterMenuOpen: !!state.filterMenuOpen,
          searchTerm: state.searchTerm || "",
          activeCategory: state.activeCategory || "all"
        });

        const keyOf = (snapshot) => JSON.stringify(snapshot);

        const pushCurrentAppState = (replace, force) => {
          if (allowRealBackRef.current) return;
          try {
            const snapshot = getSnapshot(backStateRef.current || {});
            const key = keyOf(snapshot);
            if (!force && !replace && key === lastHistoryKeyRef.current) return;
            const entry = { page: 'sahil-app-state', sahilApp: true, snapshot };
            if (replace) window.history.replaceState(entry, '', window.location.href);
            else {
              window.history.pushState(entry, '', window.location.href);
              appHistoryDepthRef.current += 1;
            }
            lastHistoryKeyRef.current = key;
          } catch(e) {}
        };
        restoreBackGuardRef.current = (replace, force) => pushCurrentAppState(!!replace, !!force);

        const exitStore = () => {
          allowRealBackRef.current = true;
          setExitModalOpen(false);
          const steps = Math.max(2, appHistoryDepthRef.current + 1);
          try {
            window.history.go(-steps);
          } catch(e) {}
          setTimeout(() => {
            try { window.location.replace('about:blank'); } catch(e) {}
          }, 900);
        };
        window.sahilExitStore = exitStore;

        const restoreSnapshot = (snapshot) => {
          restoringHistoryRef.current = true;
          setExitModalOpen(false);
          setCheckoutOpen(!!snapshot.checkoutOpen);
          setCartOpen(!!snapshot.cartOpen);
          setSearchTerm(snapshot.searchTerm || "");
          setSelectedCategory(snapshot.selectedCategory || null);
          setSelectedBrand(snapshot.selectedBrand || "all");
          setFilterMenuOpen(!!snapshot.filterMenuOpen);
          setActiveCategory(snapshot.activeCategory || "all");
          setTimeout(() => { restoringHistoryRef.current = false; }, 0);
        };

        try {
          window.history.replaceState({ page: 'sahil-back-base' }, '', window.location.href);
          pushCurrentAppState(false);
          appHistoryReadyRef.current = true;
        } catch(e) {}

        const handlePopState = (event) => {
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
            return prev.map(i => i.product.id === product.id ? { ...i, qty: i.qty + 1 } : i);
          }
          return [...prev, { product, qty: 1 }];
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
        const keyframes = [
          { transform: 'translate3d(0,0,0) scale(1) rotate(0deg)', opacity: 1, offset: 0 },
          { transform: `translate3d(${rightExitX}px, ${downSweepY * 0.18}px, 0) scale(1.05) rotate(20deg)`, opacity: 1, offset: 0.12 },
          { transform: `translate3d(${leftSweepX}px, ${downSweepY}px, 0) scale(1) rotate(-95deg)`, opacity: 1, offset: 0.3 },
          { transform: `translate3d(${leftOfCartX}px, ${overCartY}px, 0) scale(0.82) rotate(230deg)`, opacity: 1, offset: 0.54 },
          { transform: `translate3d(${rightOfCartX}px, ${dy - 24}px, 0) scale(0.62) rotate(470deg)`, opacity: 0.96, offset: 0.72 },
          { transform: `translate3d(${dx - 28}px, ${underCartY}px, 0) scale(0.42) rotate(690deg)`, opacity: 0.9, offset: 0.86 },
          { transform: `translate3d(${dx + 10}px, ${dy - 10}px, 0) scale(0.24) rotate(820deg)`, opacity: 0.7, offset: 0.95 },
          { transform: `translate3d(${dx}px, ${dy}px, 0) scale(0.12) rotate(900deg)`, opacity: 0, offset: 1 }
        ];
        const timing = { duration: 2900, easing: 'cubic-bezier(.18,.72,.2,1)', fill: 'forwards' };
        const finish = () => {
          flyer.remove();
          if (cartBtn.animate) {
            cartBtn.animate([
              { transform: 'scale(1)' },
              { transform: 'scale(1.12)' },
              { transform: 'scale(1)' }
            ], { duration: 340, easing: 'ease-out' });
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
          const updated = prev.map(i =>
            i.product.id === productId ? { ...i, qty: Math.max(0, i.qty + delta) } : i
          ).filter(i => i.qty > 0);
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
        window.scrollTo({ top: 180, behavior: 'smooth' });
      }
      // Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬

      const langData = useMemo(() => {
        return window.TRANSLATIONS?.[language] || window.TRANSLATIONS?.en || {};
      }, [language]);

      // Memoized 18 random floating product silhouettes (raw line-art vector outlines)
      const floatingSilhouettes = useMemo(() => {
        const types = [ShampooIcon, SoapIcon, FaceWashIcon, CreamIcon, RazorIcon, PerfumeIcon];
        return Array.from({ length: 18 }).map((_, idx) => {
          const Icon = types[idx % types.length];
          const left = Math.random() * 90 + 5; // 5% to 95%
          const top = Math.random() * 90 + 5;  // 5% to 95%
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
            animType,
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
            const aHasImg = (window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[a.id]) || a.hasImage ? 1 : 0;
            const bHasImg = (window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[b.id]) || b.hasImage ? 1 : 0;
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
        return products.filter((p) => p.name.toLowerCase().includes(term)).slice(0, 6);
      }, [products, searchTerm]);

      function recordSearch(product) {
        if (!product) return;
        setRecentSearches((prev) => {
          const withoutDup = prev.filter((p) => p.id !== product.id);
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
      const selectedCategoryName = selectedCategory
        ? (langData.categories?.[selectedCategory] || CATEGORIES.find(c => c.id === selectedCategory)?.name || selectedCategory)
        : null;

      return (
        <div className="min-h-screen relative text-gray-900 overflow-x-hidden" style={{ fontFamily: language === 'ur' ? "'Noto Sans Urdu', 'Inter', sans-serif" : "'Inter', system-ui, sans-serif" }}>

          {/* Splash Screen */}
          {showSplash && (
            <div className={`fixed inset-0 z-50 bg-[#020205] flex flex-col items-center justify-center transition-all duration-1000 ${fadeSplash ? "opacity-0 scale-105 pointer-events-none" : "opacity-100"}`}>
              {/* Premium Grid Background */}
              <div className="absolute inset-0 splash-grid opacity-40 pointer-events-none" />

              {/* Luxury Silhouette Floating Vectors (no text labels, raw golden outlines) */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
                {floatingSilhouettes.map((item) => {
                  return (
                    <div
                      key={item.id}
                      className="absolute transform-gpu text-black"
                      style={{
                        left: `${item.left}%`,
                        top: `${item.top}%`,
                        opacity: item.opacity,
                        transform: `scale(${item.scale})`,
                        animation: `float-drift-${item.animType} ${item.duration}s ease-in-out infinite`,
                        animationDelay: `${item.delay}s`,
                      }}
                    >
                      <item.Icon className="w-16 h-16 sm:w-20 sm:h-20" />
                    </div>
                  );
                })}
              </div>

              {/* Central Gold Laser Opening Line */}
              <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent w-0 opacity-0 laser-line z-20" />

              {/* Portal Glow Split */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[350px] sm:h-[350px] rounded-full bg-gradient-to-br from-amber-500/20 to-transparent blur-[50px] portal-glow pointer-events-none" />

              {/* Skip Intro Button */}
              <button
                onClick={() => {
                  setFadeSplash(true);
                  setTimeout(() => setShowSplash(false), 500);
                }}
                className="absolute bottom-6 right-6 z-[60] bg-black/60 hover:bg-black/90 border border-gray-200 px-4 py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-widest text-gray-700 hover:text-black hover:border-gray-200 transition-all cursor-pointer pointer-events-auto flex items-center gap-1.5 shadow-lg backdrop-blur-sm"
              >
                {translate(langData, "skipIntro")}
                <svg className="w-3.5 h-3.5 text-gray-700" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 5l7 7-7 7M5 5l7 7-7 7"></path>
                </svg>
              </button>

              <div className="relative flex flex-col items-center gap-7 max-w-sm px-4 z-10">
                {/* Brand logo */}
                <div className="relative flex items-center justify-center w-40 h-32 sm:w-48 sm:h-40 group logo-emerge">
                  <img
                    src="images/sahil-traders-logo.png"
                    alt="Sahil Traders"
                    className="w-full h-full object-contain drop-shadow-xl"
                  />
                </div>

                {/* Brand Name Text with Cinematic Shimmer Sweep */}
                <div className="text-center text-carve">
                  <h1
                    className="text-4xl sm:text-5xl font-black tracking-[0.2em] uppercase gold-shimmer"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Sahil Traders
                  </h1>
                </div>

                {/* Progress Loader bar */}
                <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden mt-3 relative text-carve">
                  <div className="h-full bg-gradient-to-r from-amber-500 to-amber-300 rounded-full gold-progress-bar" />
                </div>
                <div className="text-[10px] text-gray-700 font-semibold tracking-widest uppercase mt-1.5 animate-pulse">
                  Pre-caching Store Catalog & Images...
                </div>
              </div>
            </div>
          )}
          {/* Background — Pure Clean White */}
          <div className="fixed inset-0 -z-10 bg-white" />

          {/* Top Store Timing & Info Bar */}
          <div className="bg-gray-900 text-white text-[11px] font-medium py-1.5 px-4 shadow-inner border-b border-gray-800">
            <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 flex-wrap text-gray-200">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold">⏰ {language === 'ur' ? 'اوقاتِ کار:' : 'Store Timings:'}</span>
                <span className="font-semibold text-white">{language === 'ur' ? 'صبح 10:00 بجے سے رات 8:00 بجے تک (پیر تا ہفتہ)' : '10:00 AM – 8:00 PM (Mon – Sat)'}</span>
              </div>
              <div className="hidden sm:flex items-center gap-3 text-[10px] text-gray-400">
                <span>🚚 {language === 'ur' ? 'مفت ڈیلیوری Rs. 2,000 سے زائد پر' : 'Free Shipping on Rs. 2,000+'}</span>
                <span>•</span>
                <span>💬 {language === 'ur' ? 'واٹس ایپ آرڈرز جاری' : 'WhatsApp Orders Active'}</span>
              </div>
            </div>
          </div>

          {/* Header — Clean Minimalist White */}
          <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
            <div className="max-w-6xl mx-auto px-4 py-3 mobile-header-row">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src="images/sahil-traders-logo.png"
                    alt="Sahil Traders"
                    className="w-12 h-12 sm:w-14 sm:h-14 object-contain shrink-0"
                  />
                  <div>
                    <h1
                      className="mobile-logo-title text-lg sm:text-xl font-black leading-tight tracking-widest uppercase"
                      style={{ fontFamily: "'Poppins', sans-serif", color: '#000000' }}
                    >
                      Sahil Traders
                    </h1>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  {/* Translator Dropdown */}
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="border rounded-xl px-2.5 py-2 text-xs font-semibold transition-all cursor-pointer language-select-mobile"
                    style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.12)', color: '#111111' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor='rgba(0,0,0,0.12)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor='rgba(0,0,0,0.12)'}
                  >
                    <option value="en" style={{background:'#ffffff', color:'#1a1a2e'}}>English</option>
                    <option value="ur" style={{background:'#ffffff', color:'#1a1a2e'}}>&#x627;&#x631;&#x62F;&#x648;</option>
                  </select>

                  {/* About Us Button */}
                  <button
                    onClick={() => setAboutOpen(true)}
                    className="flex items-center gap-1.5 border px-2.5 py-2 rounded-xl text-xs font-semibold transition-all hover:bg-gray-50 cursor-pointer"
                    style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.12)', color: '#111111' }}
                  >
                    <span className="text-sm">🏬</span>
                    <span className="hidden sm:inline">{language === 'ur' ? 'ہمارے بارے میں' : 'About Us'}</span>
                  </button>

                  {/* Cart Button */}
                  <button
                    id="cart-btn"
                    onClick={() => setCartOpen(true)}
                    className="relative flex items-center gap-2 border px-3 py-2 rounded-xl text-sm font-semibold transition-all cart-btn-mobile"
                    style={{ background: '#ffffff', borderColor: cartCount > 0 ? '#000000' : 'rgba(0,0,0,0.12)', color: '#111111' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor=cartCount > 0 ? '#000000' : 'rgba(0,0,0,0.18)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor=cartCount > 0 ? '#000000' : 'rgba(0,0,0,0.12)'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    </svg>
                    <span className="hidden sm:inline">Cart</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 min-w-[20px] h-5 px-1 rounded-full text-[11px] font-black flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#000000,#000000)', color: '#ffffff' }}>
                        {cartCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>

              {/* Search — Gold Glow */}
              <div className="mt-3 relative search-wrapper-mobile" ref={searchBoxRef}>
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-700" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setSuggestOpen(true);
                    }}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={translate(langData, "searchPlaceholder")}
                    className="w-full border rounded-xl pl-10 pr-9 py-2.5 text-sm transition-all focus:outline-none"
                    style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.12)', color: '#1a1a2e', caretColor: '#000000' }}
                    onFocus={e => { setSuggestOpen(true); e.target.style.borderColor='rgba(0,0,0,0.12)'; e.target.style.boxShadow='0 0 0 3px rgba(0,0,0,0.12)'; }}
                    onBlur={e => { e.target.style.borderColor='rgba(0,0,0,0.12)'; e.target.style.boxShadow='none'; }}
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-700 hover:text-black transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {suggestOpen && searchTerm && (
                  <div className="absolute mt-2 w-full backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-40 border" style={{ background: '#ffffff', borderColor: 'rgba(0,0,0,0.12)' }}>
                    {suggestions.length > 0 ? (
                      suggestions.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => handleSuggestionClick(s)}
                          className="w-full flex items-center justify-between text-left px-4 py-2.5 text-sm border-b transition-colors"
                          style={{ borderColor: '#e5e7eb', color: '#111111' }}
                          onMouseEnter={e => e.currentTarget.style.background='#f3f4f6'}
                          onMouseLeave={e => e.currentTarget.style.background='transparent'}
                        >
                          <span style={{ color: '#111111', fontWeight: 600 }}>{getProductDisplayName(s, language)}</span>
                          <span className="font-bold whitespace-nowrap ml-3" style={{ color: '#000000' }}>{translate(langData, 'priceLabel', { amount: s.price.toLocaleString() })}</span>
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-3 text-sm" style={{ color: '#777777' }}>{translate(langData, "noMatch")}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Body */}
          <main className="max-w-6xl mx-auto px-4 py-6 main-content-area">
            {showCategoryHome ? (
              <CategoryHome
                products={products}
                onSelectCategory={setSelectedCategory}
                langData={langData}
                language={language}
              />
            ) : (
              <>
                {/* Back button + Right-aligned Category Title Banner */}
                <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                  {(selectedCategory || isSearching || activeCategory !== "all") && (
                    <button
                      onClick={handleGoBack}
                      className="flex items-center gap-1.5 border px-3 py-1.5 rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-sm cursor-pointer shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, rgba(0,0,0,0.12), rgba(255,255,255,0.95))',
                        borderColor: 'rgba(0,0,0,0.12)',
                        color: '#111111'
                      }}
                    >
                      <svg className="w-3.5 h-3.5 text-black" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" /></svg>
                      <span>{translate(langData, "backBtn") || "BACK"}</span>
                    </button>
                  )}
                  <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: 8, marginLeft: 'auto' }}>
                    <h2 style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#111111', fontFamily: "'Poppins', sans-serif" }}>
                      {isSearching ? `Search: "${searchTerm}"` : selectedCategoryName}
                    </h2>
                    <span style={{ fontSize: 10, fontWeight: 800, color: '#111111', background: 'rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 12, padding: '1px 8px', whiteSpace: 'nowrap' }}>
                      {filtered.length} {translate(langData, "itemsLabel")}
                    </span>
                  </div>
                </div>

                {/* Controls Bar: Filter & Sort */}
                <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, flexWrap: 'wrap' }}>
                  {/* Sorting Control */}
                  <div className="flex items-center gap-1.5 bg-white border border-gray-900 rounded-full px-3 py-1.5 shadow-sm">
                    <svg className="w-3.5 h-3.5 text-gray-900 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5L7.5 3m0 0L12 7.5M7.5 3v13.5m13.5-6L16.5 21m0 0L12 16.5m4.5 4.5V7.5" />
                    </svg>
                    <span className="text-[11px] font-black uppercase text-gray-900 hidden sm:inline tracking-wider">
                      {language === 'ur' ? 'ترتیب:' : 'Sort:'}
                    </span>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="bg-transparent text-xs font-bold text-gray-900 cursor-pointer outline-none border-none py-0.5 pr-1"
                    >
                      <option value="default">{language === 'ur' ? 'عام ترتیب (Default)' : 'Default Order'}</option>
                      <option value="price_asc">{language === 'ur' ? 'قیمت: کم سے زیادہ (Low to High)' : 'Price: Low to High'}</option>
                      <option value="price_desc">{language === 'ur' ? 'قیمت: زیادہ سے کم (High to Low)' : 'Price: High to Low'}</option>
                      <option value="popularity">{language === 'ur' ? 'مقبول ترین (Popularity)' : 'Popularity / Featured'}</option>
                      <option value="name_asc">{language === 'ur' ? 'نام: A سے Z (Name: A-Z)' : 'Name: A to Z'}</option>
                    </select>
                  </div>

                  {brandFilters.length > 1 && (
                    <div style={{ position: 'relative' }}>
                      <button
                        onClick={() => setFilterMenuOpen(v => !v)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: 8, border: '1px solid #111111', background: '#ffffff', color: '#111111', borderRadius: 999, padding: '9px 14px', fontSize: 12, fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', boxShadow: '0 5px 16px rgba(0,0,0,0.08)' }}
                      >
                        <svg style={{ width: 15, height: 15 }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M3 5h18M6 12h10M10 19h4" /></svg>
                        Filter
                        <span style={{ fontSize: 10, color: '#666666', letterSpacing: 0, textTransform: 'none' }}>{selectedBrand === "all" ? 'All' : selectedBrand}</span>
                      </button>
                    {filterMenuOpen && (
                      <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 8px)', zIndex: 25, width: 'min(92vw, 360px)', background: '#ffffff', border: '1px solid #d1d5db', borderRadius: 16, padding: 12, boxShadow: '0 18px 45px rgba(0,0,0,0.16)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                          <div style={{ fontSize: 11, fontWeight: 900, color: '#111111', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Poppins', sans-serif" }}>Brand Filter</div>
                          <div style={{ fontSize: 10, fontWeight: 800, color: '#666666', whiteSpace: 'nowrap' }}>{selectedBrand === "all" ? baseFiltered.length : filtered.length} items</div>
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', maxHeight: 260, overflowY: 'auto' }}>
                      <button
                        onClick={() => { setSelectedBrand("all"); setFilterMenuOpen(false); }}
                        style={{
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
                        }}
                      >
                        All Brands <span style={{ opacity: 0.72 }}>({baseFiltered.length})</span>
                      </button>
                      {brandFilters.map((brand) => (
                        <button
                          key={brand.name}
                          onClick={() => { setSelectedBrand(brand.name); setFilterMenuOpen(false); }}
                          style={{
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
                          }}
                        >
                          {brand.name} <span style={{ opacity: 0.72 }}>({brand.count})</span>
                        </button>
                      ))}
                        </div>
                      </div>
                    )}
                    </div>
                  )}
                </div>

                {filtered.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
                    <ShoppingBag className="w-12 h-12 mx-auto mb-3 text-gray-700" />
                    <p className="text-base font-bold text-black mb-2">No items found matching "{searchTerm}"</p>
                    <p className="text-xs text-gray-700 mb-6">Try searching with a different item name or go back to main categories.</p>
                    <button
                      onClick={handleGoBack}
                      className="inline-flex items-center gap-2 border px-6 py-3 rounded-xl text-xs font-black tracking-wider uppercase transition-all shadow-md hover:scale-105 active:scale-95 cursor-pointer"
                      style={{ background: 'linear-gradient(135deg, #000000, #f59e0b)', color: '#ffffff' }}
                    >
                      ← Back to Main Categories
                    </button>
                  </div>
                ) : (
                  <div className="product-grid">
                    {sortedProducts.slice(0, visibleCount).map((p) => (
                      <ProductCard key={p.id} product={p} langData={langData} language={language} cartQty={cart.find(i => i.product.id === p.id)?.qty || 0} onAddToCart={addToCart} onFlyToCart={flyProductToCart} onSelectProduct={selectProductWithHash} />
                    ))}
                  </div>
                )}
              </>
            )}
          </main>

              <footer className="border-t mt-10 py-8 text-center" style={{ borderColor: 'rgba(0,0,0,0.12)' }}>
                <div className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-gray-800 border border-gray-200 rounded-full px-4 py-1.5 bg-gray-50 shadow-xs">
                  <span className="text-amber-600">⏰</span>
                  <span>{language === 'ur' ? 'اوقاتِ کار: صبح 10:00 بجے سے رات 8:00 بجے تک (پیر تا ہفتہ)' : 'Timings: 10:00 AM – 8:00 PM (Mon – Sat)'}</span>
                </div>
                <div>
                  <button
                    onClick={() => setAboutOpen(true)}
                    className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-gray-700 hover:text-black border border-gray-300 rounded-full px-4 py-1.5 transition-colors cursor-pointer bg-white"
                  >
                    <span>🏬</span>
                    <span>{language === 'ur' ? 'ہمارے بارے میں (About Sahil Traders)' : 'About Sahil Traders'}</span>
                  </button>
                </div>
                <p className="text-xs tracking-[0.3em] uppercase" style={{ color: 'rgba(0,0,0,0.12)' }}>{translate(langData, "footer")}</p>
              </footer>

              {cartNotice && (
                <div className="fixed inset-x-0 top-1/2 z-[95] flex justify-center px-4 pointer-events-none" style={{ transform: 'translateY(-50%)' }}>
                  <div style={{ background: '#ffffff', border: '1px solid rgba(22,163,74,0.28)', borderRadius: 18, padding: '13px 18px', boxShadow: '0 18px 45px rgba(0,0,0,0.18)', display: 'flex', alignItems: 'center', gap: 12, minWidth: 220 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 999, background: '#16a34a', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 900, color: '#111111', letterSpacing: '0.08em', textTransform: 'uppercase', fontFamily: "'Poppins',sans-serif" }}>
                      {translate(langData, "added")}
                    </span>
                  </div>
                </div>
              )}

              {/* Product Detail Modal */}
              <ProductDetailModal
                product={selectedProduct}
                open={!!selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onAddToCart={addToCart}
                products={products}
                langData={langData}
                language={language}
                onSelectProduct={selectProductWithHash}
              />

              {/* About Us Modal */}
              <AboutUsModal
                isOpen={aboutOpen}
                onClose={() => setAboutOpen(false)}
                language={language}
              />

              {/* Welcome Disclaimer Modal — shown once per session after splash */}
              {!showSplash && (
                <WelcomeDisclaimerModal
                  isOpen={welcomeOpen}
                  onClose={() => {
                    setWelcomeOpen(false);
                    try { sessionStorage.setItem("sahil_traders_welcome_seen", "1"); } catch(e) {}
                  }}
                  onOpenAbout={() => setAboutOpen(true)}
                  language={language}
                />
              )}

              {/* Cart Drawer */}
              <CartDrawer
                open={cartOpen}
                cart={cart}
                cartTotal={cartTotal}
                langData={langData}
                onClose={() => setCartOpen(false)}
                onUpdateQty={updateQty}
                onRemove={removeFromCart}
                onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
                onSelectProduct={handleSelectProductFromCart}
              />

              {/* Checkout Modal */}
              {checkoutOpen && (
                <CheckoutModal
                  cart={cart}
                  cartTotal={cartTotal}
                  langData={langData}
                  onClose={() => setCheckoutOpen(false)}
                  onBack={() => { setCheckoutOpen(false); setCartOpen(true); }}
                  onOrderPlaced={() => { clearCart(); setCheckoutOpen(false); }}
                />
              )}

              {/* Exit Confirmation Modal */}
              {exitModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
                  <div className="bg-white border border-gray-200 rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl space-y-4">
                    <div className="w-14 h-14 bg-gray-100 border border-gray-200 rounded-full flex items-center justify-center mx-auto">
                      <svg className="w-7 h-7 text-black" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-base font-extrabold text-black uppercase tracking-wider">
                        {language === 'ur' ? 'ویب سائٹ سے باہر جانا چاہتے ہیں؟' : 'Exit Sahil Traders?'}
                      </h3>
                      <p className="text-xs text-gray-700 mt-1.5 leading-relaxed">
                        {language === 'ur' ? 'کیا آپ واقعی Sahil Traders بند کرنا چاہتے ہیں؟' : 'Are you sure you want to leave the store?'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          setExitModalOpen(false);
                          setTimeout(() => restoreBackGuardRef.current(), 50);
                        }}
                        className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-gray-100 text-black text-xs font-bold uppercase tracking-wider hover:bg-gray-100 transition-all cursor-pointer"
                      >
                        {language === 'ur' ? 'نہیں، واپس رہیں' : 'No, Stay'}
                      </button>
                      <button
                        onClick={() => {
                          if (window.sahilExitStore) window.sahilExitStore();
                        }}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-xs font-extrabold uppercase tracking-wider hover:brightness-110 transition-all shadow-md cursor-pointer"
                      >
                        {language === 'ur' ? 'ہاں، باہر جائیں' : 'Yes, Exit'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
        </div>
      );
    }



    // Ã¢â€â‚¬Ã¢â€â‚¬ CATEGORY META (icons + gradients per category) Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    // To add a category image: set the `image` field to a URL or relative file path.
    // Example: image: 'images/soaps.jpg'  or  image: 'https://...'  Ã¢â‚¬â€ leave as '' to use default gradient+icon.
    const CATEGORY_META = {
      soaps:        { image: '', gradient: 'linear-gradient(135deg,#667eea,#764ba2)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="3"/><circle cx="7" cy="12" r="1"/><circle cx="10.5" cy="9.5" r="1.5"/><circle cx="14.5" cy="14" r="1"/><circle cx="17" cy="11" r="2"/></svg>) },
      shampoo:      { image: '', gradient: 'linear-gradient(135deg,#f093fb,#f5576c)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M7 21a2 2 0 002 2h6a2 2 0 002-2V10a2 2 0 00-2-2H9a2 2 0 00-2 2v11z"/><path d="M12 2v6"/><path d="M9 5h6"/><path d="M10 13h4"/><path d="M10 17h4"/></svg>) },
      perfumes:     { image: '', gradient: 'linear-gradient(135deg,#f7971e,#ffd200)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2"/><rect x="10" y="7" width="4" height="3"/><path d="M12 3v4"/><path d="M9 3h6"/></svg>) },
      bodyspray:    { image: '', gradient: 'linear-gradient(135deg,#30cfd0,#330867)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="8" y="4" width="8" height="16" rx="2"/><path d="M10 2h4"/><path d="M12 8v4"/><circle cx="12" cy="15" r="1"/></svg>) },
      creams:       { image: '', gradient: 'linear-gradient(135deg,#fa709a,#fee140)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M5 9h14v9a3 3 0 01-3 3H8a3 3 0 01-3-3V9z"/><rect x="4" y="5" width="16" height="4" rx="1"/><path d="M5 14c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 4 2"/></svg>) },
      bleachfacial: { image: '', gradient: 'linear-gradient(135deg,#e0c3fc,#8ec5fc)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>) },
      stationary:   { image: '', gradient: 'linear-gradient(135deg,#4facfe,#00f2fe)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>) },
      sports:       { image: '', gradient: 'linear-gradient(135deg,#f6d365,#fda085)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/><path d="M2 12h20"/></svg>) },
      toys:         { image: '', gradient: 'linear-gradient(135deg,#fd79a8,#e84393)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2l2 7h7l-5.5 4 2 7L12 16l-5.5 4 2-7L3 9h7z"/></svg>) },
      birthday:     { image: '', gradient: 'linear-gradient(135deg,#ff9a9e,#fecfef)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 1v3M10 2h4"/></svg>) },
      powders:      { image: '', gradient: 'linear-gradient(135deg,#ffecd2,#fcb69f)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M3 6h18l-1.5 14H4.5L3 6z"/><path d="M3 6l2-3h14l2 3"/><path d="M8 11c0 2 8 2 8 0"/></svg>) },
      tapes:        { image: '', gradient: 'linear-gradient(135deg,#a1c4fd,#c2e9fb)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="4"/><line x1="12" y1="3" x2="12" y2="8"/></svg>) },
      shaving:      { image: '', gradient: 'linear-gradient(135deg,#373b44,#4286f4)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 8v13"/><rect x="6" y="3" width="12" height="5" rx="1.5"/><line x1="8" y1="5" x2="16" y2="5"/><line x1="11" y1="12" x2="13" y2="12"/><line x1="11" y1="15" x2="13" y2="15"/><line x1="11" y1="18" x2="13" y2="18"/></svg>) },
      haircolour:   { image: '', gradient: 'linear-gradient(135deg,#a18cd1,#fbc2eb)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 3c-1.5 3-5 5-5 9a5 5 0 0010 0c0-4-3.5-6-5-9z"/><path d="M12 17v4"/><path d="M10 21h4"/></svg>) },
      haircare:     { image: '', gradient: 'linear-gradient(135deg,#c471ed,#12c2e9)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 3c-1.5 3-5 5-5 9a5 5 0 0010 0c0-4-3.5-6-5-9z"/><path d="M8 10c1 2 5 2 6 0"/></svg>) },
      condemn:      { image: '', gradient: 'linear-gradient(135deg,#e96c6c,#c0392b)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M12 2C8 2 5 5 5 9v6l7 7 7-7V9c0-4-3-7-7-7z"/></svg>) },
      lock:         { image: '', gradient: 'linear-gradient(135deg,#636e72,#2d3436)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>) },
      general:      { image: '', gradient: 'linear-gradient(135deg,#000000,#9b7a00)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="3" y="3" width="8" height="8" rx="1"/><rect x="13" y="3" width="8" height="8" rx="1"/><rect x="3" y="13" width="8" height="8" rx="1"/><rect x="13" y="13" width="8" height="8" rx="1"/></svg>) },
      bodylotion:   { image: '', gradient: 'linear-gradient(135deg,#fa709a,#fee140)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M5 9h14v9a3 3 0 01-3 3H8a3 3 0 01-3-3V9z"/><rect x="4" y="5" width="16" height="4" rx="1"/><path d="M5 14c2.5 0 2.5 2 5 2s2.5-2 5-2 2.5 2 4 2"/></svg>) },
      babycare:     { image: '', gradient: 'linear-gradient(135deg,#ffecd2,#fcb69f)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M6 20v-2a6 6 0 0112 0v2"/></svg>) },
      blades:       { image: '', gradient: 'linear-gradient(135deg,#b8c6db,#f5f7fa)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M18 3L6 21"/><path d="M6 3l12 18"/><rect x="4" y="9" width="16" height="6" rx="1"/></svg>) },
      cells:        { image: '', gradient: 'linear-gradient(135deg,#56ab2f,#a8e063)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><rect x="7" y="4" width="10" height="16" rx="2"/><path d="M10 2h4"/><path d="M12 9v4"/></svg>) },
      mosquito:     { image: '', gradient: 'linear-gradient(135deg,#11998e,#38ef7d)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/><path d="M5 5l3 3M16 16l3 3M5 19l3-3M16 8l3-3"/></svg>) },
      personalcare: { image: '', gradient: 'linear-gradient(135deg,#ee9ca7,#ffdde1)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>) },
      others:       { image: '', gradient: 'linear-gradient(135deg,#8e9eab,#eef2f3)', icon: (<svg style={{width:40,height:40,color:'white'}} fill="none" stroke="currentColor" strokeWidth="1.8" viewBox="0 0 24 24"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>) },
    };

    // ————— CATEGORY HOME ————————————————————————————————————————————————————————————————————————————
    function CategoryHome({ products, onSelectCategory, langData }) {
      return (
        <div>
          <div style={{ marginBottom: 14, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,0,0,0.12)', paddingBottom: 8 }}>
            <h2 style={{ fontSize: 14, fontWeight: 900, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#000000', fontFamily: "'Poppins', sans-serif" }}>
              {translate(langData, "categoriesLabel")}
            </h2>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#333333', background: 'rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 12, padding: '2px 8px', whiteSpace: 'nowrap' }}>
              {CATEGORIES.length} Categories &middot; {products.length.toLocaleString()}+ Items
            </span>
          </div>
          <div className="cat-home-grid">
            {CATEGORIES.map(cat => {
              const catProducts = products.filter(p => p.categoryId === cat.id);
              const count = catProducts.length;
              const meta = CATEGORY_META[cat.id] || { gradient: 'linear-gradient(135deg,#000000,#9b7a00)', icon: null };

              // Find all items in this category that have images
              const imageProducts = catProducts.filter(p => (window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[p.id]) || p.hasImage);

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
              const animSpeed = (marqueeItems.length * 4.2) + 's';

              return (
                <div
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className="cat-card-container group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300"
                  style={{
                    background: '#ffffff',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = '#000000';
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
                  }}
                >
                  {/* Top Image Reel Area */}
                  <div className="cat-img-reel-area" style={{ height: 180, width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', background: '#ffffff' }}>

                    {/* Top Right Item Count Badge */}
                    <div className="cat-count-badge" style={{ position: 'absolute', top: 10, right: 10, zIndex: 20, padding: '3px 10px', borderRadius: 999, fontSize: 10, fontWeight: 800, letterSpacing: '0.06em', background: '#f3f4f6', border: '1px solid #e5e7eb', color: '#111111' }}>
                      {count} {translate(langData, "itemsLabel")}
                    </div>

                    {imageProducts.length > 0 ? (
                      <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
                        {/* Side Fade Shading for Glassy Framing */}
                        <div style={{ position: 'absolute', top: 0, bottom: 0, left: 0, width: 28, zIndex: 10, pointerEvents: 'none', background: 'linear-gradient(to right, #ffffff, transparent)' }} />
                        <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: 28, zIndex: 10, pointerEvents: 'none', background: 'linear-gradient(to left, #ffffff, transparent)' }} />

                        {/* Infinite Sliding Track */}
                        <div className="cat-marquee-track" style={{ animation: `catSlideTrack ${animSpeed} linear infinite` }}>
                          {doubleItems.map((item, idx) => {
                            const ext = window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[item.id];
                            return (
                              <div key={idx} className="cat-img-box">
                                {ext && (
                                  <img
                                    src={`images/${item.id}.${ext}`}
                                    alt=""
                                    loading="lazy"
                                    onError={(e) => { e.target.style.display = 'none'; }}
                                  />
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <div style={{ opacity: 0.95, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                        <div style={{ width: 52, height: 52, borderRadius: 16, background: meta.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 8px 25px rgba(0,0,0,0.5)' }}>
                          {meta.icon || '🛍️'}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info Footer */}
                  <div style={{ padding: '14px 16px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,0,0,0.12)' }}>
                    <div>
                      <h3 className="cat-card-title" style={{
                        fontSize: '13px',
                        fontWeight: 800,
                        fontFamily: "'Poppins', sans-serif",
                        letterSpacing: '0.02em',
                        color: '#1a1a2e',
                        lineHeight: 1.3,
                        marginBottom: 3
                      }}>
                        {langData.categories?.[cat.id] || cat.name}
                      </h3>
                      <p className="cat-card-subtitle" style={{ fontSize: 12, color: '#555555', fontWeight: 600, letterSpacing: '0.03em', display: 'flex', alignItems: 'center', gap: 4 }}>
                        Explore Catalog &rarr;
                      </p>
                    </div>

                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center text-black group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300">
                      <svg className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    function CategoryDropdown({ activeCategory, setActiveCategory, setCatMenuOpen, fullWidth, langData }) {
      return (
        <div
          className={`absolute mt-2 ${fullWidth ? "w-full" : "w-64 right-0"} backdrop-blur-xl rounded-xl shadow-2xl overflow-hidden z-40 max-h-80 overflow-y-auto border`}
          style={{ background: 'rgba(9,9,13,0.97)', borderColor: 'rgba(0,0,0,0.12)' }}
        >
          <button
            onClick={() => {
              setActiveCategory("all");
              setCatMenuOpen(false);
            }}
            className="w-full text-left px-4 py-2.5 text-sm font-semibold border-b transition-colors"
            style={{
              borderColor: 'rgba(0,0,0,0.12)',
              color: activeCategory === "all" ? '#111111' : '#1a1a2e',
              background: activeCategory === "all" ? 'rgba(0,0,0,0.12)' : 'transparent'
            }}
            onMouseEnter={e => { if (activeCategory !== 'all') e.currentTarget.style.background='rgba(0,0,0,0.12)'; }}
            onMouseLeave={e => { if (activeCategory !== 'all') e.currentTarget.style.background='transparent'; }}
          >
            {translate(langData, "allCategories")}
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => {
                setActiveCategory(c.id);
                setCatMenuOpen(false);
              }}
              className="w-full text-left px-4 py-2.5 text-sm border-b last:border-0 transition-colors"
              style={{
                borderColor: 'rgba(0,0,0,0.12)',
                color: activeCategory === c.id ? '#111111' : '#1a1a2e',
                background: activeCategory === c.id ? 'rgba(0,0,0,0.12)' : 'transparent',
                fontWeight: activeCategory === c.id ? '600' : '400'
              }}
              onMouseEnter={e => { if (activeCategory !== c.id) e.currentTarget.style.background='rgba(0,0,0,0.12)'; }}
              onMouseLeave={e => { if (activeCategory !== c.id) e.currentTarget.style.background='transparent'; }}
            >
              {langData.categories?.[c.id] || c.name}
            </button>
          ))}
        </div>
      );
    }

    function ProductCard({ product, langData, language, cartQty = 0, onAddToCart, onFlyToCart, onSelectProduct }) {
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

      return (
        <div
          onClick={() => onSelectProduct && onSelectProduct(product)}
          className="product-card rounded-2xl overflow-hidden flex flex-col transition-all duration-300 group cursor-pointer"
          style={{ background: '#ffffff', border: '1px solid #e5e7eb', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='#000000'; e.currentTarget.style.boxShadow='0 8px 20px rgba(0,0,0,0.08)'; e.currentTarget.style.transform='translateY(-3px)'; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='#e5e7eb'; e.currentTarget.style.boxShadow='0 2px 8px rgba(0,0,0,0.04)'; e.currentTarget.style.transform='translateY(0)'; }}
        >
          {/* Product Image Container */}
          <div className="product-img-area h-44 sm:h-48 w-full flex items-center justify-center p-2.5 relative overflow-visible" style={{ background: 'transparent' }}>
            {!imgErr ? (
              <img
                src={imageSrc}
                onError={handleImgError}
                loading="lazy"
                decoding="async"
                className="product-card-main-img w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                style={{ filter: 'none' }}
              />
            ) : product.hasImage ? (
              <div className={`w-28 h-28 sm:w-32 sm:h-32 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center shrink-0 shadow-lg`}>
                <span className="text-white text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {product.initial}
                </span>
              </div>
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl flex flex-col items-center justify-center gap-1 shrink-0" style={{ background: 'rgba(0,0,0,0.12)' }}>
                <ImageOff className="w-7 h-7 sm:w-8 sm:h-8" style={{ color: 'rgba(0,0,0,0.12)' }} />
                <span className="text-[9px] font-medium" style={{ color: 'rgba(0,0,0,0.12)' }}>{translate(langData, "noPhoto")}</span>
              </div>
            )}
          </div>

          {/* Gold Divider */}
          <div className="h-px mx-3" style={{ background: 'transparent' }} />

          {/* Balanced Compact Text & Action Details */}
          <div className="product-card-body p-3.5 pt-2.5 flex flex-col gap-1.5 flex-1 bg-white">
            <p className="product-name-text text-xs sm:text-sm font-bold leading-snug line-clamp-2 tracking-tight" style={{ color: '#1a1a2e' }}>
              {getProductDisplayName(product, language)}
            </p>
            <p className="product-price-text font-extrabold text-sm sm:text-base" style={{ color: '#000000' }}>
              {translate(langData, 'priceLabel', { amount: product.price.toLocaleString() })}
            </p>
            <button
              onClick={handleAdd}
              className="product-add-btn mt-auto w-full py-2 rounded-xl text-[11px] font-bold tracking-widest uppercase transition-all flex items-center justify-center gap-2"
              style={{
                background: isAdded ? '#16a34a' : '#111111',
                border: `1px solid ${isAdded ? '#15803d' : '#111111'}`,
                color: '#ffffff',
                boxShadow: isAdded ? '0 8px 18px rgba(22,163,74,0.24)' : '0 6px 14px rgba(0,0,0,0.16)',
                transform: 'translateY(0)'
              }}
              onMouseEnter={e => { if (!isAdded) { e.currentTarget.style.background='#1f2937'; e.currentTarget.style.borderColor='#1f2937'; e.currentTarget.style.transform='translateY(-1px)'; }}}
              onMouseLeave={e => { if (!isAdded) { e.currentTarget.style.background='#111111'; e.currentTarget.style.borderColor='#111111'; e.currentTarget.style.transform='translateY(0)'; }}}
            >
              {isAdded ? (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                  {translate(langData, "added")}
                </>
              ) : (
                <>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                  {translate(langData, "addToCart")}
                </>
              )}
            </button>
          </div>
        </div>
      );
    }


    // Ã¢â€â‚¬Ã¢â€â‚¬ CART DRAWER Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    function CartDrawer({ open, cart, cartTotal, langData, onClose, onUpdateQty, onRemove, onCheckout, onSelectProduct }) {
      const [deleteConfirm, setDeleteConfirm] = React.useState(null);

      useEffect(() => {
        if (open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = '';
        return () => { document.body.style.overflow = ''; };
      }, [open]);

      function handleMinusClick(productId, qty) {
        if (qty === 1) {
          setDeleteConfirm(productId);
        } else {
          onUpdateQty(productId, -1);
        }
      }

      function confirmDelete() {
        if (deleteConfirm) { onRemove(deleteConfirm); setDeleteConfirm(null); }
      }

      return (
        <>
          {/* Backdrop */}
          <div
            onClick={onClose}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              background: 'rgba(0,0,0,0.7)',
              backdropFilter: 'blur(4px)',
              opacity: open ? 1 : 0,
              pointerEvents: open ? 'auto' : 'none',
              transition: 'opacity 0.3s'
            }}
          />
          {/* Drawer */}
          <div
            style={{
              position: 'fixed', top: 0, right: 0, bottom: 0,
              width: '100%', maxWidth: '420px',
              zIndex: 51,
              background: '#ffffff',
              borderLeft: '1px solid rgba(0,0,0,0.12)',
              boxShadow: '-8px 0 60px rgba(0,0,0,0.8)',
              transform: open ? 'translateX(0)' : 'translateX(100%)',
              transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
              display: 'flex', flexDirection: 'column'
            }}
          >
            {/* Header */}
            <div style={{ padding: '20px', borderBottom: '1px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <svg style={{ width: 22, height: 22, color: '#000000' }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                </svg>
                <span style={{ fontSize: 16, fontWeight: 800, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#000000', fontFamily: "'Poppins',sans-serif" }}>{translate(langData, "cartTitle")}</span>
                {cart.length > 0 && (
                  <span style={{ background: 'rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 20, padding: '1px 10px', fontSize: 11, fontWeight: 700, color: '#000000' }}>
                    {cart.reduce((s,i)=>s+i.qty,0)} {translate(langData, "itemsLabel")}
                  </span>
                )}
              </div>
              <button onClick={onClose} style={{ background: '#f3f4f6', border: '1px solid rgba(0,0,0,0.28)', borderRadius: 10, padding: '6px', color: '#111111', cursor: 'pointer', display: 'flex', alignItems: 'center', boxShadow: '0 1px 2px rgba(0,0,0,0.12)' }}
                onMouseEnter={e=>e.currentTarget.style.color='#000000'}
                onMouseLeave={e=>e.currentTarget.style.color='#111111'}
              >
                <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            {/* Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
              {cart.length > 0 && (
                <div style={{ marginBottom: 14, padding: '12px 14px', borderRadius: 14, background: cartTotal >= 2000 ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)' : 'linear-gradient(135deg, #fffbe6 0%, #fef3c7 100%)', border: cartTotal >= 2000 ? '1px solid #bbf7d0' : '1px solid #fde68a' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, fontWeight: 800, color: cartTotal >= 2000 ? '#166534' : '#92400e' }}>
                    <span style={{ fontSize: 16 }}>🚚</span>
                    <span>{cartTotal >= 2000 ? '🎉 Mubarak! Free Delivery Unlocked!' : `Free Delivery on Rs 2,000+ (Rs ${ (2000 - cartTotal).toLocaleString() } remaining)`}</span>
                  </div>
                  <div style={{ marginTop: 8, height: 6, width: '100%', background: 'rgba(0,0,0,0.08)', borderRadius: 10, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${Math.min(100, (cartTotal / 2000) * 100)}%`, background: cartTotal >= 2000 ? '#22c55e' : '#f59e0b', borderRadius: 10, transition: 'width 0.4s ease' }} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: '#555', marginTop: 4 }}>
                    <span>🏠 Home Delivery Available</span>
                    <span>🏬 BS Mart Pickup Free</span>
                  </div>
                </div>
              )}

              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', paddingTop: 80, color: '#777777' }}>
                  <svg style={{ width: 60, height: 60, margin: '0 auto 16px', color: 'rgba(0,0,0,0.12)' }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                  </svg>
                  <p style={{ fontSize: 14, fontWeight: 600 }}>{translate(langData, "cartEmpty")}</p>
                  <p style={{ fontSize: 12, marginTop: 6, color: '#888888' }}>{translate(langData, "noProducts")}</p>
                  <button onClick={onClose} style={{ marginTop: 20, background: 'rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 12, padding: '10px 24px', color: '#000000', fontSize: 13, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{translate(langData, "continueShopping")}</button>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {cart.map(({ product, qty }) => (
                    <div key={product.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', background: 'rgba(0,0,0,0.12)', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 14 }}>
                      {/* Product Thumbnail - Clickable */}
                      <div
                        onClick={() => onSelectProduct && onSelectProduct(product)}
                        style={{ cursor: 'pointer' }}
                        className="shrink-0 transition-transform active:scale-95"
                        title="Click to view product details"
                      >
                        {(window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id]) ? (
                          <img
                            src={`images/${product.id}.${(window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id]) || "png"}`}
                            onError={(e) => { e.target.onerror = null; }}
                            alt={product.name}
                            className="w-12 h-12 rounded-xl object-contain bg-black/40 p-1 border border-gray-200 hover:border-gray-300 transition-colors"
                          />
                        ) : (
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center`}>
                            <span style={{ color: '#1a1a2e', fontWeight: 800, fontSize: 16, fontFamily: "'Poppins',sans-serif" }}>{product.initial}</span>
                          </div>
                        )}
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p
                          onClick={() => onSelectProduct && onSelectProduct(product)}
                          style={{ cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1a1a2e', lineHeight: 1.3, marginBottom: 4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}
                          className="hover:text-black hover:underline transition-colors"
                          title="Click to view product details"
                        >
                          {toTitleCase(product.name)}
                        </p>
                        <p style={{ fontSize: 12, color: '#000000', fontWeight: 700 }}>{translate(langData, "priceLabel", { amount: product.price.toLocaleString() })} &times; {qty}</p>
                        <p style={{ display: 'inline-block', fontSize: 11, color: '#111111', background: '#ffffff', border: '1px solid rgba(0,0,0,0.18)', borderRadius: 8, padding: '2px 7px', fontWeight: 800, marginTop: 4 }}>= {translate(langData, "priceLabel", { amount: (product.price * qty).toLocaleString() })}</p>
                      </div>

                      {/* Smart Qty Controls */}
                      <div style={{ flexShrink: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: 'rgba(0,0,0,0.12)', borderRadius: 10, padding: '4px 6px', border: '1px solid rgba(0,0,0,0.12)' }}>
                          {/* Left: Trash if qty=1, Minus if qty>1 */}
                          {qty === 1 ? (
                            <button
                              onClick={() => handleMinusClick(product.id, qty)}
                              title="Remove item"
                              style={{ width: 28, height: 28, border: 'none', background: 'rgba(239,68,68,0.12)', color: 'rgba(239,68,68,0.9)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, transition: 'all 0.2s' }}
                              onMouseEnter={e => { e.currentTarget.style.background='rgba(239,68,68,0.25)'; e.currentTarget.style.color='#ef4444'; }}
                              onMouseLeave={e => { e.currentTarget.style.background='rgba(239,68,68,0.12)'; e.currentTarget.style.color='rgba(239,68,68,0.9)'; }}
                            >
                              <svg width="13" height="13" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMinusClick(product.id, qty)}
                              style={{ width: 28, height: 28, border: 'none', background: 'none', color: '#000000', fontSize: 20, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, transition: 'background 0.2s' }}
                              onMouseEnter={e => e.currentTarget.style.background='rgba(0,0,0,0.12)'}
                              onMouseLeave={e => e.currentTarget.style.background='none'}
                            >−</button>
                          )}
                          <span style={{ minWidth: 24, textAlign: 'center', fontSize: 14, fontWeight: 700, color: '#1a1a2e' }}>{qty}</span>
                          {/* Right: always Plus */}
                          <button
                            onClick={() => onUpdateQty(product.id, 1)}
                            style={{ width: 28, height: 28, border: 'none', background: 'none', color: '#000000', fontSize: 20, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 8, transition: 'background 0.2s' }}
                            onMouseEnter={e => e.currentTarget.style.background='rgba(0,0,0,0.12)'}
                            onMouseLeave={e => e.currentTarget.style.background='none'}
                          >+</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div
              onClick={() => setDeleteConfirm(null)}
              style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}
            >
              <div
                onClick={e => e.stopPropagation()}
                style={{ background: '#fff', borderRadius: 16, padding: '32px 24px 24px', maxWidth: 320, width: '100%', boxShadow: '0 24px 64px rgba(0,0,0,0.55)', textAlign: 'center', position: 'relative' }}
              >
                <button onClick={() => setDeleteConfirm(null)} style={{ position: 'absolute', top: 12, right: 14, background: 'none', border: 'none', fontSize: 18, color: '#aaa', cursor: 'pointer' }}>✕</button>
                <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <svg width="26" height="26" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: '#111', marginBottom: 8 }}>Are you sure to delete this item?</p>
                <p style={{ fontSize: 12, color: '#888', marginBottom: 24 }}>This item will be removed from your cart.</p>
                <div style={{ display: 'flex', gap: 10 }}>
                  <button
                    onClick={() => setDeleteConfirm(null)}
                    style={{ flex: 1, padding: '12px', border: '1.5px solid #ddd', borderRadius: 10, background: '#fff', color: '#444', fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#f5f5f5'}
                    onMouseLeave={e => e.currentTarget.style.background='#fff'}
                  >Cancel</button>
                  <button
                    onClick={confirmDelete}
                    style={{ flex: 1, padding: '12px', border: 'none', borderRadius: 10, background: '#1a1a2e', color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background='#2d2d50'}
                    onMouseLeave={e => e.currentTarget.style.background='#1a1a2e'}
                  >Delete</button>
                </div>
              </div>
            </div>
          )}            {/* Footer */}
            {cart.length > 0 && (
              <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(0,0,0,0.12)', flexShrink: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14, padding: '13px 14px', background: 'linear-gradient(135deg,#f8fafc 0%,#ffffff 100%)', border: '1px solid rgba(0,0,0,0.16)', borderRadius: 14, boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}>
                  <span style={{ fontSize: 13, color: '#111111', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{translate(langData, "totalBill")}</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: '#ffffff', background: '#000000', borderRadius: 12, padding: '5px 12px', fontFamily: "'Poppins',sans-serif", boxShadow: '0 4px 12px rgba(0,0,0,0.18)' }}>{translate(langData, "priceLabel", { amount: cartTotal.toLocaleString() })}</span>
                </div>
                <button
                  onClick={onCheckout}
                  style={{
                    width: '100%', padding: '14px', borderRadius: 14, border: 'none',
                    background: 'linear-gradient(135deg,#000000 0%,#000000 100%)',
                    color: '#ffffff', fontSize: 14, fontWeight: 800,
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    cursor: 'pointer', boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={e=>{e.currentTarget.style.filter='brightness(1.1)';e.currentTarget.style.boxShadow='0 6px 28px rgba(0,0,0,0.12)';}}
                  onMouseLeave={e=>{e.currentTarget.style.filter='none';e.currentTarget.style.boxShadow='0 4px 20px rgba(0,0,0,0.12)';} }
                >
                  <svg style={{ width: 18, height: 18 }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
                  {translate(langData, "proceedOrder")}
                </button>
              </div>
            )}
          </div>
        </>
      );
    }

    // Ã¢â€â‚¬Ã¢â€â‚¬ CHECKOUT MODAL Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬Ã¢â€â‚¬
    function CheckoutModal({ cart, cartTotal, langData, onClose, onBack, onOrderPlaced }) {
      const [name, setName] = useState("");
      const [phone, setPhone] = useState("");
      const [address, setAddress] = useState("");
      const [deliveryMethod, setDeliveryMethod] = useState("home");
      const [errors, setErrors] = useState({});
      const [placing, setPlacing] = useState(false);
      const [success, setSuccess] = useState(false);

      useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = ''; };
      }, []);

      const deliveryFee = deliveryMethod === 'pickup' ? 0 : (cartTotal >= 2000 ? 0 : 150);
      const grandTotal = cartTotal + deliveryFee;

      function validate() {
        const e = {};
        if (!name.trim()) e.name = translate(langData, "validationName") || 'Name is required';
        if (!phone.trim()) e.phone = translate(langData, "validationPhone") || 'Phone number is required';
        else if (!/^[0-9]{10,11}$/.test(phone.replace(/\s/g,''))) e.phone = translate(langData, "validationPhone") || 'Enter valid 10-11 digit number';
        if (deliveryMethod === 'home' && !address.trim()) e.address = translate(langData, "validationAddress") || 'Address is required';
        return e;
      }

      function handleOrder() {
        const e = validate();
        if (Object.keys(e).length > 0) { setErrors(e); return; }
        setPlacing(true);

        // Build WhatsApp message
        const itemLines = cart.map(({ product, qty }) =>
          `Ã¢â‚¬Â¢ ${product.name}\n  Qty: ${qty}  |  Rate: Rs ${product.price.toLocaleString()}  |  Total: Rs ${(product.price*qty).toLocaleString()}`
        ).join('\n\n');

        const msg = [
          'Ã°Å¸â€ºâ€™ *NEW ORDER Ã¢â‚¬â€ Sahil Traders*',
          'Ã¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€Â',
          '',
          '*Ã°Å¸â€œÂ¦ ORDER DETAILS:*',
          itemLines,
          '',
          'Ã¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€Â',
          `*Ã°Å¸â€™Â° TOTAL BILL: Rs ${cartTotal.toLocaleString()}*`,
          'Ã¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€Â',
          '',
          '*👤 CUSTOMER INFO:*',
          `• Name: ${name.trim()}`,
          `• Phone: ${phone.trim()}`,
          deliveryMethod === 'home' ? `• Address: ${address.trim()}` : `• Pickup Location: BS Mart Shop (Muhammad Zubair Moin & Sahil Saleem)`,
          '',
          'Ã¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€ÂÃ¢â€Â',
          `Ã°Å¸â€œâ€¦ Date: ${new Date().toLocaleDateString('en-PK', { day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' })}`
        ].join('\n');

        const waUrl = `https://wa.me/923368945775?text=${encodeURIComponent(msg)}`;

        // Open WhatsApp immediately on user action to avoid browser popup blocker freeze
        window.open(waUrl, '_blank');

        setPlacing(false);
        setSuccess(true);
        setTimeout(() => {
          onOrderPlaced();
        }, 1500);
      }

      const inputStyle = (hasErr) => ({
        width: '100%', boxSizing: 'border-box',
        padding: '13px 15px', borderRadius: 12,
        border: `1px solid ${hasErr ? 'rgba(239,68,68,0.65)' : 'rgba(0,0,0,0.18)'}`,
        background: '#ffffff',
        color: '#111827', fontSize: 14,
        outline: 'none', caretColor: '#000000',
        boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.04)',
        transition: 'border-color 0.2s, box-shadow 0.2s, background 0.2s'
      });

      return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
          <div style={{ width: '100%', maxWidth: 500, background: '#ffffff', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 24, boxShadow: '0 24px 80px rgba(0,0,0,0.9)', maxHeight: '90vh', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>

            {success ? (
              <div style={{ padding: 48, textAlign: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'rgba(34,197,94,0.15)', border: '2px solid rgba(34,197,94,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                  <svg style={{ width: 36, height: 36, color: '#4ade80' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" /></svg>
                </div>
                <h3 style={{ fontSize: 22, fontWeight: 800, color: '#000000', fontFamily: "'Poppins',sans-serif", marginBottom: 10 }}>{translate(langData, "orderPlacedSuccess")}</h3>
                <p style={{ fontSize: 14, color: '#555555', lineHeight: 1.6 }}>{translate(langData, "successNotice")}</p>
              </div>
            ) : (
              <>
                {/* Modal Header */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid rgba(0,0,0,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <button onClick={onBack} style={{ background: '#f3f4f6', border: '1px solid rgba(0,0,0,0.28)', borderRadius: 10, padding: '6px 10px', color: '#111111', cursor: 'pointer', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4, boxShadow: '0 1px 2px rgba(0,0,0,0.12)' }}>
                      <svg style={{ width: 14, height: 14 }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg>
                      {translate(langData, "backBtn")}
                    </button>
                    <span style={{ fontSize: 16, fontWeight: 800, color: '#000000', letterSpacing: '0.12em', textTransform: 'uppercase', fontFamily: "'Poppins',sans-serif" }}>{translate(langData, "checkoutTitle")}</span>
                  </div>
                  <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', display: 'flex' }}
                    onMouseEnter={e=>e.currentTarget.style.color='white'}
                    onMouseLeave={e=>e.currentTarget.style.color='rgba(255,255,255,0.4)'}
                  >
                    <svg style={{ width: 20, height: 20 }} fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
                  {/* Order Summary */}
                  <div style={{ background: '#f8f9fa', border: '1px solid rgba(0,0,0,0.12)', borderRadius: 16, padding: '14px 16px' }}>
                    <p style={{ fontSize: 11, fontWeight: 900, color: '#111111', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 12 }}>{translate(langData, "orderSummary")}</p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 180, overflowY: 'auto' }}>
                      {cart.map(({ product, qty }) => (
                        <div key={product.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                            {(window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id]) ? (
                              <img
                                src={`images/${product.id}.${(window.PRODUCT_IMAGE_MAP && window.PRODUCT_IMAGE_MAP[product.id]) || "png"}`}
                                onError={(e) => { e.target.onerror = null; }}
                                alt={product.name}
                                className="w-7 h-7 rounded-lg object-contain bg-black/40 p-0.5 shrink-0 border border-gray-200"
                              />
                            ) : (
                              <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${product.gradient} flex items-center justify-center shrink-0`}>
                                <span style={{ color: '#1a1a2e', fontSize: 10, fontWeight: 800 }}>{product.initial}</span>
                              </div>
                            )}
                            <span style={{ fontSize: 12, color: '#1a1a2e', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{toTitleCase(product.name)}</span>
                          </div>
                          <span style={{ fontSize: 12, color: '#000000', fontWeight: 700, whiteSpace: 'nowrap', flexShrink: 0 }}>&times; {qty} = {translate(langData, "priceLabel", { amount: (product.price*qty).toLocaleString() })}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 14, padding: '12px 14px', border: '1px solid rgba(0,0,0,0.16)', borderRadius: 14, background: 'linear-gradient(135deg,#ffffff 0%,#f8fafc 100%)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 6px 18px rgba(0,0,0,0.08)' }}>
                      <span style={{ fontSize: 13, color: '#111111', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.12em' }}>{translate(langData, "totalBill")}</span>
                      <span style={{ fontSize: 20, fontWeight: 900, color: '#ffffff', background: '#000000', borderRadius: 12, padding: '5px 12px', fontFamily: "'Poppins',sans-serif", boxShadow: '0 4px 12px rgba(0,0,0,0.18)' }}>{translate(langData, "priceLabel", { amount: cartTotal.toLocaleString() })}</span>
                    </div>
                  </div>

                  {/* Delivery Option Selection */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <p style={{ fontSize: 11, fontWeight: 900, color: '#111111', letterSpacing: '0.2em', textTransform: 'uppercase' }}>Delivery Option</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                      <div 
                        onClick={() => setDeliveryMethod('home')}
                        style={{
                          padding: '12px', borderRadius: 14, border: deliveryMethod === 'home' ? '2px solid #000' : '1px solid #e5e7eb',
                          background: deliveryMethod === 'home' ? '#f9fafb' : '#fff', cursor: 'pointer', textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: 18 }}>🚚</div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#111', marginTop: 4 }}>Home Delivery</div>
                        <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>{cartTotal >= 2000 ? 'FREE' : 'Rs 150'}</div>
                      </div>

                      <div 
                        onClick={() => setDeliveryMethod('pickup')}
                        style={{
                          padding: '12px', borderRadius: 14, border: deliveryMethod === 'pickup' ? '2px solid #000' : '1px solid #e5e7eb',
                          background: deliveryMethod === 'pickup' ? '#f9fafb' : '#fff', cursor: 'pointer', textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: 18 }}>🏬</div>
                        <div style={{ fontSize: 12, fontWeight: 800, color: '#111', marginTop: 4 }}>Store Pickup</div>
                        <div style={{ fontSize: 10, color: '#16a34a', fontWeight: 700, marginTop: 2 }}>BS Mart (FREE)</div>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <p style={{ fontSize: 11, fontWeight: 900, color: '#111111', letterSpacing: '0.2em', textTransform: 'uppercase' }}>{translate(langData, "yourDetails")}</p>

                    <div>
                      <label style={{ fontSize: 12, color: '#444444', fontWeight: 600, display: 'block', marginBottom: 6 }}>{translate(langData, "fullName")}</label>
                      <input
                        type="text" placeholder={translate(langData, "fullNamePlaceholder")}
                        value={name} onChange={e=>{setName(e.target.value);if(errors.name)setErrors(p=>({...p,name:''}))}}
                        style={inputStyle(errors.name)}
                        onFocus={e=>{e.target.style.borderColor='rgba(0,0,0,0.42)';e.target.style.boxShadow='0 0 0 3px rgba(0,0,0,0.08), inset 0 1px 2px rgba(0,0,0,0.04)';}}
                        onBlur={e=>{e.target.style.borderColor=errors.name?'rgba(239,68,68,0.65)':'rgba(0,0,0,0.18)';e.target.style.boxShadow='inset 0 1px 2px rgba(0,0,0,0.04)';}}
                      />
                      {errors.name && <p style={{ color: 'rgba(239,68,68,0.9)', fontSize: 11, marginTop: 4, fontWeight: 600 }}>{errors.name}</p>}
                    </div>

                    <div>
                      <label style={{ fontSize: 12, color: '#444444', fontWeight: 600, display: 'block', marginBottom: 6 }}>{translate(langData, "mobileNumber")}</label>
                      <input
                        type="tel" placeholder="03xxxxxxxxx"
                        value={phone} onChange={e=>{setPhone(e.target.value);if(errors.phone)setErrors(p=>({...p,phone:''}))}}
                        style={inputStyle(errors.phone)}
                        onFocus={e=>{e.target.style.borderColor='rgba(0,0,0,0.42)';e.target.style.boxShadow='0 0 0 3px rgba(0,0,0,0.08), inset 0 1px 2px rgba(0,0,0,0.04)';}}
                        onBlur={e=>{e.target.style.borderColor=errors.phone?'rgba(239,68,68,0.65)':'rgba(0,0,0,0.18)';e.target.style.boxShadow='inset 0 1px 2px rgba(0,0,0,0.04)';}}
                      />
                      {errors.phone && <p style={{ color: 'rgba(239,68,68,0.9)', fontSize: 11, marginTop: 4, fontWeight: 600 }}>{errors.phone}</p>}
                    </div>

                    <div>
                      <label style={{ fontSize: 12, color: '#444444', fontWeight: 600, display: 'block', marginBottom: 6 }}>{translate(langData, "deliveryAddress")}</label>
                      <textarea
                        placeholder={translate(langData, "addressPlaceholder")}
                        value={address} onChange={e=>{setAddress(e.target.value);if(errors.address)setErrors(p=>({...p,address:''}))}}
                        rows={3}
                        style={{ ...inputStyle(errors.address), resize: 'none', fontFamily: 'inherit' }}
                        onFocus={e=>{e.target.style.borderColor='rgba(0,0,0,0.42)';e.target.style.boxShadow='0 0 0 3px rgba(0,0,0,0.08), inset 0 1px 2px rgba(0,0,0,0.04)';}}
                        onBlur={e=>{e.target.style.borderColor=errors.address?'rgba(239,68,68,0.65)':'rgba(0,0,0,0.18)';e.target.style.boxShadow='inset 0 1px 2px rgba(0,0,0,0.04)';}}
                      />
                      {errors.address && <p style={{ color: 'rgba(239,68,68,0.9)', fontSize: 11, marginTop: 4, fontWeight: 600 }}>{errors.address}</p>}
                    </div>
                  </div>

                  {/* WhatsApp note */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, background: 'rgba(37,211,102,0.06)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: 12, padding: '12px 14px' }}>
                    <svg style={{ width: 18, height: 18, color: '#25d366', flexShrink: 0, marginTop: 1 }} viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    <p style={{ fontSize: 12, color: '#444444', lineHeight: 1.5 }}>{translate(langData, "whatsappNotice")}</p>
                  </div>

                  {/* Submit */}
                  <button
                    onClick={handleOrder}
                    disabled={placing}
                    style={{
                      width: '100%', padding: '15px', borderRadius: 14, border: 'none',
                      background: placing ? 'rgba(0,0,0,0.12)' : 'linear-gradient(135deg,#25d366 0%,#128C7E 100%)',
                      color: '#1a1a2e', fontSize: 15, fontWeight: 800,
                      letterSpacing: '0.12em', textTransform: 'uppercase',
                      cursor: placing ? 'not-allowed' : 'pointer',
                      boxShadow: '0 4px 20px rgba(37,211,102,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                      transition: 'all 0.2s', marginBottom: 4
                    }}
                    onMouseEnter={e=>{if(!placing){e.currentTarget.style.filter='brightness(1.08)';e.currentTarget.style.boxShadow='0 6px 28px rgba(37,211,102,0.45)';}}}
                    onMouseLeave={e=>{e.currentTarget.style.filter='none';e.currentTarget.style.boxShadow='0 4px 20px rgba(37,211,102,0.3)';}}
                  >
                    {placing ? (
                      <>
                        <svg style={{ width: 18, height: 18, animation: 'spin 1s linear infinite' }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" /></svg>
                        {translate(langData, "placingOrder")}
                      </>
                    ) : (
                      <>
                        <svg style={{ width: 20, height: 20 }} viewBox="0 0 24 24" fill="currentColor">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        {translate(langData, "placeOrderBtn")}
                      </>
                    )}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      );
    }



