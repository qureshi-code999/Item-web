import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, ChevronDown, ShoppingBag, ImageOff, X, Store, Clock } from "lucide-react";

// ---------------------------------------------------------------------------
// PRODUCT LIST
// Just a plain array — add new products here whenever you want by copying
// one of the demo entries below and changing the values. Fields:
//   id           -> unique number
//   name         -> product name
//   price        -> number (in Rs)
//   categoryId   -> must match one of the CATEGORIES ids below
//   categoryName -> matching category display name
//   hasImage     -> true if you want a colored placeholder swatch shown,
//                   false to show "No Photo"
//   gradient     -> pick any from SWATCH_GRADIENTS (only used if hasImage)
//   initial      -> the letter shown on the placeholder swatch
// ---------------------------------------------------------------------------

const CATEGORIES = [
  { id: "soaps", name: "Soaps" },
  { id: "shampoo", name: "Shampoo" },
  { id: "facewash", name: "Face Wash" },
  { id: "toothpaste", name: "Toothpaste" },
  { id: "creams", name: "Creams & Lotions" },
  { id: "hairoil", name: "Hair Oil & Hair Care" },
  { id: "deo", name: "Deodorants & Talcum" },
  { id: "perfume", name: "Perfumes & Body Spray" },
  { id: "detergent", name: "Detergents & Cleaning" },
  { id: "babycare", name: "Baby Care" },
  { id: "shaving", name: "Shaving & Blades" },
  { id: "beverages", name: "Food & Beverages" },
  { id: "general", name: "General Items & Stationary" },
];

const SWATCH_GRADIENTS = [
  "from-amber-400 to-orange-500",
  "from-violet-500 to-purple-600",
  "from-emerald-400 to-teal-600",
  "from-rose-400 to-pink-600",
  "from-sky-400 to-blue-600",
  "from-fuchsia-400 to-purple-600",
  "from-teal-400 to-cyan-600",
  "from-indigo-400 to-violet-600",
];
const PRODUCTS = [
  { id: 1, name: "Lifebuoy Total 10 Soap", price: 90, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "L" },
  { id: 2, name: "Sunsilk Black Shine Shampoo", price: 350, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
  { id: 3, name: "Colgate Total Advanced Toothpaste", price: 180, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
  { id: 4, name: "Nivea Soft Moisturizing Cream", price: 420, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: false, gradient: SWATCH_GRADIENTS[3], initial: "N" },
  { id: 5, name: "Surf Excel Detergent Powder", price: 260, categoryId: "detergent", categoryName: "Detergents & Cleaning", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
  { id: 6, name: "BALL FINE (ORIGNAL)", price: 160, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
  { id: 7, name: "BLADE 7 O CLOCK GREEN", price: 1430, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "B" },
  { id: 8, name: "BLADE TREET (BLACK)", price: 1280, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "B" },
  { id: 9, name: "BODY SPRAY FOGG (BLACK) MARCO (PK)", price: 815, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "B" },
  { id: 10, name: "BODY SPRAY SHALIS (MEN)", price: 820, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "B" },
  { id: 11, name: "CELL TOSHIBA SIZE (C)", price: 1980, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
  { id: 12, name: "COFFE SASHAY (60 PCS)", price: 2080, categoryId: "beverages", categoryName: "Food & Beverages", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
  { id: 13, name: "COLOUR GARNIER SASHAY (1# BLACK) RS,199", price: 170, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
  { id: 14, name: "COLOUR GARNIER SASHAY (3# DARK BROWN) RS,199", price: 177, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
  { id: 15, name: "COLOUR GARNIER SASHAY (4# BROWN) RS,199", price: 170, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
  { id: 16, name: "COLOUR HELLO HAIR (# 03 DARK BROWN)", price: 230, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
  { id: 17, name: "COLOUR OLIVIA (# 1 BLACK) RS,300", price: 225, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
  { id: 18, name: "COLOUR OLIVIA (# 2 DARK BROWN) RS,300", price: 235, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
  { id: 19, name: "COLOUR OLIVIA (# 9 MAHOGANY) RS,300", price: 238, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
  { id: 20, name: "COTTON BUD DIBI SMALL (WOOD)", price: 48, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
  { id: 21, name: "CREAM 3D BLECH (BOX) SASHY RP.30", price: 785, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
  { id: 22, name: "CREAM PEACH BLEACH (BOX) RS,40", price: 32, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
  { id: 23, name: "CREAM TIBET SNOW RS,230", price: 210, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
  { id: 24, name: "DABUR AMLA HAIR OIL (DUBAI) 100ml RS,340", price: 285, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "D" },
  { id: 25, name: "DABUR AMLA HAIR OIL (DUBAI) 300ML RS,880", price: 755, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "D" },
  { id: 26, name: "DORCO RAZOR", price: 162, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "D" },
  { id: 27, name: "GILLETTE BLUE 2 PLUS (GREEN)", price: 127, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "G" },
  { id: 28, name: "SUNNY PLAST", price: 310, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
  { id: 29, name: "T CLAY LARGE", price: 85, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "T" },
  { id: 30, name: "TAPE OSAKA (WHITE)", price: 435, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "T" },
  { id: 31, name: "COLOUR OLIVIA (# 3 MEDIUM BROWN) RS,300", price: 235, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
  { id: 32, name: "COLOUR REVLON REGULAR (20) Brown Black (LARGE)", price: 775, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
  { id: 33, name: "CONDITIONER MECLAY (PINK)", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
  { id: 34, name: "CONDITIONER MECLAY (PP)", price: 365, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
  { id: 35, name: "CONDITIONER MECLAY (WHITE)", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
  { id: 36, name: "COTTON BURD (PAKIT) WOOD", price: 490, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
  { id: 37, name: "CREAM ARCHI PERL THAILAND", price: 119, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
  { id: 38, name: "CREAM EU TUBE (SMALL) RS,160", price: 140, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
  { id: 39, name: "CREAM FACE FRESH (LARGE) RS,380", price: 275, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
  { id: 40, name: "CREAM GLUTA WHITE", price: 335, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
  { id: 41, name: "CREAM NIVIA SOFT 50ml", price: 365, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
  { id: 42, name: "CREAM SANDAL RS,380", price: 268, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
  { id: 43, name: "ELFY JIMSA BOX", price: 210, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "E" },
  { id: 44, name: "F & L M,V JAR", price: 378, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
  { id: 45, name: "FACE WASH ACNI-PLUS", price: 445, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
  { id: 46, name: "J BABY PETROLIUM GELL (BLUE) SMALL", price: 415, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "J" },
  { id: 47, name: "LOTION OLIVIA 110ml RS,220", price: 190, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "L" },
  { id: 48, name: "PASTE COLGATE 125g MAX FRESH (RED) RS,325", price: 303, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
  { id: 49, name: "PASTE COLGATE 125g MAX FRESH (GREEN) RS,325", price: 303, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
  { id: 50, name: "PASTE MEDICAM 90GM RS,320", price: 275, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
  { id: 51, name: "SHAMPOO BIO AMLA FARVEL ORUNAL RS,340", price: 275, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
  { id: 52, name: "KING TOX SPRAY 300ml (SMALL)", price: 390, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "K" },
  { id: 53, name: "LUDO (LARGE) (GOOD QUALITY)", price: 145, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "L" },
  { id: 54, name: "PASTE CLOSE UP (SMALL) GREEN", price: 185, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
  { id: 55, name: "PASTE CLOSE UP (SMALL) RED", price: 180, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
  { id: 56, name: "PASTE MEDICAM 65GM RS,250", price: 217, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
  { id: 57, name: "SHAMPOO ENGLISH ANTI LICE (SMALL) RS,170", price: 155, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
  { id: 58, name: "SHAMPOO H & S 200ml (MIX) RS,470", price: 440, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
  { id: 59, name: "SHAMPOO MECLAY (MEDIUM) (PP)", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
  { id: 60, name: "SOAP DOVE LARGE WHITE (IMP)", price: 388, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
  { id: 61, name: "SOAP PALMOLIVE (LARGE) RS,150 (MIX)", price: 139, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
  { id: 62, name: "TAPE DOUBLE SIDED (1 INCH)", price: 65, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "T" },
  { id: 63, name: "TAPE OSAKA (BLACK)", price: 435, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "T" },
  { id: 64, name: "TAPE OSAKA (RED)", price: 435, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "T" },
  { id: 65, name: "TAPE TRANSPARENT (2 INCH)", price: 95, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "T" },
  { id: 66, name: "TUSBHI (LED)", price: 127, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "T" },
  { id: 67, name: "TUSBHI (SADA)", price: 58, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "T" },
  { id: 68, name: "UNDER WEAR LADIES BLACK & SKIN (MEDIUM) GOOD QULITY (# 320)", price: 180, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "U" },
  { id: 69, name: "VASELINE HAIR TONIC 100ml (NON ORUNAL)", price: 175, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "V" },
  { id: 70, name: "VATIKA HAIR OIL 100ml (ALMOND)", price: 310, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "V" },
  { id: 71, name: "VATIKA HAIR OIL 100ml (CACTUS)", price: 310, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "V" },
  { id: 72, name: "VATIKA HAIR OIL 100ml (Coconut)", price: 310, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "V" },
  { id: 73, name: "VEET JAR LARGE (MIX) RS,595", price: 532, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "V" },
  { id: 74, name: "VEET JAR SMALL 40g (MIX) RS,300", price: 258, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
  { id: 75, name: "VITAMN CAPSOLE LARGE WHITE", price: 580, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "V" },
  { id: 76, name: "ROOM SPRAY (IMP) MIX", price: 225, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "R" },
  { id: 77, name: "SHAMPOO LOREAL MEDIUM (DREAM LONG) RESTORING RS,530", price: 469, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
  { id: 78, name: "SHAMPOO LOREAL MEDIUM (HYALURON MOISTURE) RS,600", price: 535, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
  { id: 79, name: "SHAMPOO LOREAL MEDIUM (RED) COLOUR PROTECT RS,530", price: 469, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
  { id: 80, name: "SHAMPOO MECLAY (MEDIUM) ORANGE", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
  { id: 81, name: "SHAMPOO MECLAY (MEDIUM) PINK", price: 365, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
  { id: 82, name: "SHAMPOO MECLAY (MEDIUM) RED COLOUR PROTECT", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
  { id: 83, name: "SHAMPOO MECLAY (MEDIUM) WHITE", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
  { id: 84, name: "SHAMPOO PALMOLIVE (MEDIUM) GREEN RS,400", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
  { id: 85, name: "SHAMPOO TRESEMME 170ml RS,550 (RED)", price: 495, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
  { id: 86, name: "SOAP SKIN WHITE (MIX) RS,150", price: 130, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
  { id: 87, name: "SOAP SKIN WHITE (PINK) RS,150", price: 130, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
  { id: 88, name: "SOFT TOUCH WONDER WAX LARGE GREEN", price: 245, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
  { id: 89, name: "SOFT TOUCH WONDER WAX SMALL LEMON", price: 195, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
  { id: 90, name: "SUNBLOCK RIVAJ (LARGE) RP,630", price: 545, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
  { id: 91, name: "SUNBLOCK RIVAJ SPF 60 (SMALL) RP,300", price: 260, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
  { id: 92, name: "CONDITIONER LOREAL (GOLDEN) RS,550", price: 484, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
  { id: 93, name: "CONDITIONER LOREAL (HYALURON MOISTURE) BLUE RS,620", price: 539, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
  { id: 94, name: "CONDITIONER LOREAL (RED) RS,550", price: 479, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
  { id: 95, name: "CONDITIONER LOREAL (WHITE) RS,540", price: 475, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
  { id: 96, name: "CONDITIONER MECLAY (RED)", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
  { id: 97, name: "CREAM GOLDEN PEARL NEW RS,360", price: 268, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
  { id: 98, name: "CREAM JHALAK RS,360", price: 238, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
  { id: 99, name: "CREAM PARLEY BEAUTY BLACK RS 350", price: 278, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
  { id: 100, name: "CREAM SANDAL RS,360", price: 268, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
  { id: 101, name: "DABUR AMLA HAIR OIL (DUBAI) 50ml RS,180", price: 159, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "D" },
  { id: 102, name: "FACE WASH CLEAN & CLEAR (SMALL)", price: 305, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
  { id: 103, name: "FACE WASH GARNIER (LARGE) WOMEN (VITAMAN C) RP,579", price: 495, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "F" },
  { id: 104, name: "FACE WASH GARNIER (SMALL) OIL CLEAR RS,519", price: 459, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
  { id: 105, name: "FACE WASH GARNIER (SMALL) POWER WHITE RS,519", price: 459, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
  { id: 106, name: "FACE WASH HIMALYA (SMALL) DUBAI RS 310", price: 253, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "F" },
  { id: 107, name: "FACE WASH JUNSUI LARGE (BLACK)", price: 535, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "F" },
  { id: 108, name: "FACE WASH MAC ALEO VERA", price: 370, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
  { id: 109, name: "FACE WASH MAC BLACK CHARCOAL", price: 370, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
  { id: 110, name: "FACE WASH MAC PINK", price: 370, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
  { id: 111, name: "FACE WASH PONDS (IMP) ACNE SOLUTION", price: 415, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "F" },
  { id: 112, name: "FACE WASH PONDS (IMP) BLACK (P O+PURITY)", price: 410, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
  { id: 113, name: "FACE WASH PONDS (IMP) BLACK (P O+PURITY) (SMALL)", price: 265, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
  { id: 114, name: "FACE WASH PONDS (IMP) WHITE BEAUTY (PINK)", price: 410, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "F" },
  { id: 115, name: "FACE WASH PONDS (IMP) WHITE BEAUTY (SMALL)", price: 260, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "F" },
  { id: 116, name: "FACE WASH Y,C (LARGE) BLACK (COW) MILK EXTRACT", price: 395, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
  { id: 117, name: "FACE WASH Y,C (LARGE) YELLOW LEMON", price: 395, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
  { id: 118, name: "FACE WASH Y,C (SMALL) BLACK (COW) MILK EXTRACT", price: 290, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
  { id: 119, name: "FACE WASH Y,C (SMALL) YELLOW LEMON", price: 290, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "F" },
  { id: 120, name: "LIGHTER (HEATER) 801", price: 1080, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "L" },
  { id: 121, name: "LIP OIL POUCH 12 PCES", price: 40, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "L" },
  { id: 122, name: "LOTION PONDS 100ml RS,350", price: 315, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "L" },
  { id: 123, name: "LOTION VASELINE 100ml (IMP) GREEN", price: 315, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "L" },
  { id: 124, name: "MORTIEN SPRAY 300ml", price: 495, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "M" },
  { id: 125, name: "PARACHUTE COCONUT OIL (MEDIUM) HEMANI", price: 445, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
  { id: 126, name: "ALOE VERA JELL TUBE (SMALL) 80ML", price: 80, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "A" },
  { id: 127, name: "BIO AMLA HAIR OIL 100ml RS,280", price: 220, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "B" },
  { id: 128, name: "BIO AMLA HAIR OIL 50ml RP,160", price: 130, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "B" },
  { id: 129, name: "BLACK COBRA SPRAY 300ML", price: 385, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "B" },
  { id: 130, name: "BODY RAZER TWINKLE LADIES (EYEBROW)", price: 86, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "B" },
  { id: 131, name: "BODY SPRAY AXE (MIX)", price: 675, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "B" },
  { id: 132, name: "BODY SPRAY CHI CHI (PINK) WOMEN", price: 635, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "B" },
  { id: 133, name: "BODY SPRAY CHI CHI (SOLID)", price: 635, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "B" },
  { id: 134, name: "BODY SPRAY SHE (ANGLE)", price: 465, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
  { id: 135, name: "BODY SPRAY SHE (RED)", price: 465, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "B" },
  { id: 136, name: "BRUSH SUREE PLASTIK PAKING SINGAL (NAYLON TAR) NEW", price: 80, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "B" },
  { id: 137, name: "COLOUR GARNIER (#3,DARK BROWN) RS,1099", price: 875, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
  { id: 138, name: "COLOUR OLIVIA (# 10 BLUE/BLACK) RS,300", price: 230, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
  { id: 139, name: "COLOUR OLIVIA (# 11 COPPER BROWN) RS,300", price: 230, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
  { id: 140, name: "COLOUR OLIVIA (# 12 GLODEN BLONDE) RS,300", price: 235, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
  { id: 141, name: "CONDAM JOSH (BLUE) DELAY", price: 980, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
  { id: 142, name: "CONDITIONER LOREAL (BLACK) RS,550", price: 484, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
  { id: 143, name: "CONDITIONER LOREAL (DREAM LONG) RS,550", price: 484, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
  { id: 144, name: "PASTE DOCTOR RS,110", price: 93, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
  { id: 145, name: "PASTE SENSODYNE 30g (RAPID ACTION) RS,165", price: 154, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
  { id: 146, name: "PASTE SENSODYNE 70g (RAPID ACTION) RS,420", price: 392, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
  { id: 147, name: "PERFUME DELYCIA (MEDIUM) BEUETY RS,650", price: 570, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "P" },
  { id: 148, name: "PERFUME DELYCIA (MEDIUM) CHECK RS,650", price: 578, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
  { id: 149, name: "PERFUME DELYCIA (SMALL) BEAUTY RS,350", price: 300, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
  { id: 150, name: "PERFUME DELYCIA (SMALL) CHECK RS,350", price: 310, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
  { id: 151, name: "PERFUME MEDORA (MEDIUM) BLUE RS,650", price: 578, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
  { id: 152, name: "PERFUME MEDORA (MEDIUM) GREEN RS,650", price: 578, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
  { id: 153, name: "PERFUME MEDORA (SMALL) BLUE RS,350", price: 310, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
  { id: 154, name: "PERFUME MEDORA (SMALL) GREEN RS,350", price: 310, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
  { id: 155, name: "POWDER BLACK BEAUTY (SMALL) RP,220", price: 190, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "P" },
  { id: 156, name: "POWDER BLACK CAT (SMALL) RS,250", price: 215, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
  { id: 157, name: "POWDER EDEN ROCK (SMALL) RS,199", price: 149, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
  { id: 158, name: "POWDER MEDORA (SMALL) (JOY) RS,230", price: 205, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
  { id: 159, name: "POWDER MEDORA (SMALL) (MIX) RS,230", price: 208, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
  { id: 160, name: "POWDER TIBET (SMALL) RS,190", price: 175, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
  { id: 161, name: "ROLL ON FA (MYSTIC MOMENT)", price: 395, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "R" },
  { id: 162, name: "ROLL ON FA (PINK) TARANCEPERNT", price: 395, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "R" },
  { id: 163, name: "ROLL ON NIVIA (WOMEN)", price: 475, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "R" },
  { id: 164, name: "PERFUME RASSASI BLUE LADY", price: 2140, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
  { id: 165, name: "PERFUME RASSASI SECRET", price: 2130, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
  { id: 166, name: "POWDER BLACK BEAUTY (LARGE) RS,450", price: 385, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
  { id: 167, name: "RAZER TREET HYGIENE", price: 39, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "R" },
  { id: 168, name: "SCISSOR STEEL SMALL", price: 95, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
  { id: 169, name: "STEPLER PIN 24/6 (BOX) DOLLAR 20 DIBI", price: 830, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
  { id: 170, name: "VENEEZIA WAX (SMALL) RP,220", price: 185, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
  { id: 171, name: "CREAM PARLEY BLEACH SASHAY BLACK RS,70", price: 1290, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
  { id: 172, name: "F & L M,V TUBE (SMALL) GLOW RS,170", price: 159, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
  { id: 173, name: "CELL TOSHIBA AAA (H,D PK)", price: 1230, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
  { id: 174, name: "CREAM FACE FRESH CLEANSER (LARGE)", price: 315, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
  { id: 175, name: "F & L M,V FACE WASH (SMALL) COMPANY RS.199", price: 183, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "F" },
  { id: 176, name: "F & L M,V SASHAY RS,50", price: 47, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
  { id: 177, name: "FACE WASH GARNIER (SMALL) WOMEN VITAMAN C RS,349", price: 309, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
  { id: 178, name: "FACE WASH Y,C (LARGE) COCUMBER", price: 425, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "F" },
  { id: 179, name: "MARKER 604 (BLUE)", price: 180, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "M" },
  { id: 180, name: "PASTE COLGATE 20g SADA RS,50", price: 46, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
  { id: 181, name: "PEN PIANO (BLACK) GRIPER 0.8MM", price: 175, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
  { id: 182, name: "PEN PIANO (BLUE) GRIPER 0.8MM", price: 175, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
  { id: 183, name: "SHAMPOO H & S 200ml CLASSIC CLEAN (BLUE) RS,470", price: 440, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
  { id: 184, name: "SHAMPOO LIFE BOY 100ml (GREEN) RS,200", price: 185, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
  { id: 185, name: "CELL TOSHIBA AA (H,D PK)", price: 1230, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
  { id: 186, name: "COLOUR REVLON REGULAR (30) Dark Brown (LARGE)", price: 775, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
  { id: 187, name: "COLOUR REVLON REGULAR (51) Light Brown (LARGE)", price: 775, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
  { id: 188, name: "LIGHTER (SADA TIK) 601", price: 840, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "L" },
  { id: 190, name: "POWDER MOTHER CARE GO-RASH 150g SMALL RS,400", price: 355, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
  { id: 191, name: "ROOM SPRAY NEW ( T ) MIX (1 EACH)", price: 225, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "R" },
  { id: 192, name: "SHAMPOO COLOUR LICHEN SASHAY (BROWN)", price: 670, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
  { id: 193, name: "SHAMPOO MECLAY (MEDIUM) BLUE", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
  { id: 194, name: "SHAMPOO MECLAY (MEDIUM) GREEN", price: 365, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
  { id: 195, name: "CONDAM TOUCH (BLUE) 6 PACK 3IN 1", price: 745, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
  { id: 196, name: "MOOV SPRAY", price: 790, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "M" },
  { id: 197, name: "SHIELD FEEDER COLOUR (LARGE) RS,200", price: 177, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
  { id: 198, name: "SHIELD FEEDER COLOUR (MEDIUM) RS,190", price: 168, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
  { id: 199, name: "VASELINE PETROLIUM (IMP) 50ml S,A (BLUE,ORIGINAL)", price: 225, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "V" },
  { id: 200, name: "VASELINE PETROLIUM (IMP) 50ml S,A (GREEN,ALOE FRESH)", price: 225, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "V" },
  { id: 201, name: "VASELINE PETROLIUM (IMP) 50ml S,A (PINK,BABY)", price: 225, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "V" },
  { id: 202, name: "VASELINE PETROLIUM (IMP) 50ml S,A (VITAMIN E)", price: 225, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
  { id: 203, name: "VATIKA HAIR OIL 100ml (OLIVE)", price: 310, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "V" },
  { id: 204, name: "VATIKA HAIR OIL 200ml (ALMOND)", price: 560, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "V" },
  { id: 205, name: "VATIKA HAIR OIL 200ml (CACTUS)", price: 560, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "V" },
  { id: 206, name: "VATIKA HAIR OIL 200ml (OLIVE)", price: 560, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "V" },
  { id: 207, name: "VENEEZIA WAX (LARGE) RS,280", price: 225, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "V" },
  { id: 208, name: "WAX PATI BUKRAM", price: 85, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "W" },
  { id: 209, name: "PERFUME RASSASI ROMANCE (WOMAN)", price: 2180, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
  { id: 210, name: "VASELINE TIBET RS,130", price: 119, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
  { id: 211, name: "BIO AMLA HAIR OIL 60ml RP,160", price: 130, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "B" },
  { id: 212, name: "BODY RAZER TINKLE (DABAL PACK SAFTIY)", price: 190, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "B" },
  { id: 213, name: "BODY SPRAY EVERY ONE", price: 525, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "B" },
  { id: 214, name: "BODY SPRAY PURE BLACK", price: 525, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
  { id: 215, name: "BRUSH HAIR (CHAMCHA)", price: 175, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "B" },
  { id: 216, name: "BRUSH HAIR (THAPA) GOOD QUALITY", price: 195, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "B" },
  { id: 217, name: "BRUSH ORAL-B", price: 129, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "B" },
  { id: 218, name: "CHAP IT JAR 5DAZ (ORIGNAL)", price: 36, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
  { id: 219, name: "COLOUR GODREJ SASHAY (NTRL BRN)", price: 62, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
  { id: 220, name: "CREAM PONDS BB (MEDIUM) 18g", price: 635, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
  { id: 221, name: "CREAM PONDS BB (SMALL) 9g", price: 410, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
  { id: 222, name: "FACE WASH HIMALIYA (LARGE) DUBAI RS,510", price: 415, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
  { id: 223, name: "FACE WASH HIMALIYA (SMALL) DUBAI RS,310", price: 245, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "F" },
  { id: 224, name: "LOTION CARE (SMALL) RS,250", price: 215, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "L" },
  { id: 225, name: "LOTION VASELINE 100ml (IMP) COCA B", price: 315, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "L" },
  { id: 226, name: "LOTION VASELINE 100ml (IMP) WHITE", price: 315, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "L" },
  { id: 227, name: "LOTION VASELINE 100ml (IMP) YELLOW", price: 315, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "L" },
  { id: 228, name: "NAIL CUTTER SSS ORUNAL (GOOD QUILTY) BLACK", price: 123, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "N" },
  { id: 229, name: "NAIL CUTTER V9", price: 117, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "N" },
  { id: 230, name: "POWDER EDEN ROCK (LARGE) RS,299", price: 227, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
  { id: 231, name: "SABALON SPRAY (PK)", price: 385, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
  { id: 232, name: "SABALON SPRAY (SMALL)", price: 285, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
  { id: 233, name: "SOAP GOLDEN PEARL (BLUE)", price: 115, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
  { id: 234, name: "SOAP GOLDEN PEARL (PINK)", price: 115, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
  { id: 235, name: "SOAP GOLDEN PEARL (YELLOW)", price: 115, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
  { id: 236, name: "TOOTH PICK DENTAL FLOSS", price: 65, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "T" },
  { id: 237, name: "TOOTH PICK LARGE", price: 75, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "T" },
  { id: 238, name: "BODY SPRAY FOGG (MEHROON) MONARCH", price: 795, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
  { id: 239, name: "BODY SPRAY HAVOC GERMANY (SILVER)", price: 915, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "B" },
  { id: 240, name: "COLOUR OLIVIA (# 6 ASH BLONDE) RS,300", price: 235, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
  { id: 241, name: "COLOUR OLIVIA (# 8 BURGUNDY) RS,300", price: 235, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
  { id: 242, name: "COLOUR REVLON FASHION (27) LARGE", price: 745, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
  { id: 243, name: "COLOUR REVLON FASHION (43) Medium Golden Brown (LARGE)", price: 745, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
  { id: 244, name: "COLOUR REVLON REGULAR (10) BLACK (LARGE)", price: 745, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
  { id: 245, name: "PERFUME ASEEL", price: 1730, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
  { id: 246, name: "PERFUME EVERY ONE", price: 1490, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
  { id: 247, name: "PERFUME ONE MAN SHOW ORIGNAL", price: 2140, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
  { id: 248, name: "COLOUR SAMSOLE (# 43) SMALL RS,160", price: 138, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
  { id: 249, name: "BALL CA (MEDIUM QUALITY) G A", price: 90, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "B" },
  { id: 250, name: "KIWI POLISH LIQUID (BLACK) RS,450", price: 405, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "K" },
  { id: 251, name: "KIWI POLISH LIQUID (BROWN) RS,450", price: 405, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "K" },
  { id: 252, name: "PENCIL GOLDFISH (PATA)", price: 205, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
  { id: 253, name: "SAFETY BOX UNIVERSAL RS,10 (KANGI WALI)", price: 110, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
  { id: 254, name: "COLOUR BLACK ROSE 45 # RS,220", price: 175, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
  { id: 255, name: "COLOUR REVLON FASHION (53) Light Auburn (LARGE)", price: 775, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
  { id: 256, name: "COLOUR REVLON FASHION (57) Lightest Golden Brown (LARGE)", price: 775, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
  { id: 257, name: "COLOUR SAMSOLE (# 45) SMALL RS,160", price: 138, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
  { id: 258, name: "CONDAM TOUCH (GREEN) 3IN 1", price: 415, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
  { id: 259, name: "CREAM TIBET COLD (SMALL) RS,180", price: 165, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
  { id: 260, name: "DOLLAR PEN (CLIPPER) BLUE", price: 170, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "D" },
  { id: 261, name: "FACE WASH PONDS (IMP) SUN DULLNESS RE", price: 425, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
  { id: 262, name: "J BABY WIPES WITH CAP 84 PICE (NON ORUNAL)", price: 195, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "J" },
  { id: 263, name: "LOCK GOLD 20mm", price: 67, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "L" },
  { id: 264, name: "MAGIC DEPOXI BOX (SMALL)", price: 575, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "M" },
  { id: 265, name: "MARKER 604 (BLACK)", price: 180, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "M" },
  { id: 266, name: "MARKER 605 (BLUE)", price: 195, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "M" },
  { id: 267, name: "PERFUME MEDORA (MEDIUM) GREEN RS,850", price: 580, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "P" },
  { id: 268, name: "PERFUME MEDORA (SMALL) RED RS,350", price: 310, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
  { id: 269, name: "RAZER DISPOSIPEL NAAI (25 PCS)", price: 890, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "R" },
  { id: 270, name: "SAMAD BOND BOX (SMALL)", price: 1260, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
  { id: 271, name: "SHAMPOO DOVE 175ml (INTENSIVE REPEIR) RS,520", price: 475, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
  { id: 272, name: "SHAMPOO LIFE BOY 100ml (ONION) RP,200", price: 185, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
  { id: 273, name: "SHAMPOO LIFE BOY 100ml (YELLOW) RS,200", price: 185, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
  { id: 274, name: "SHAMPOO LIFE BOY 400ml (GREEN) RS,620", price: 580, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
  { id: 275, name: "SHAMPOO LIFE BOY 400ml (YELLOW) RS,620", price: 580, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
  { id: 276, name: "SHAMPOO MECLAY (MEDIUM) PP", price: 365, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
  { id: 277, name: "SHAMPOO PANTENE 100ml (MIX) RP,190", price: 176, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
  { id: 278, name: "SHAMPOO SUNSILK 100ml (BLACK) BLACK SHINE RS,190", price: 176, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
  { id: 279, name: "SOAP TIBET (LARGE FAMILY SIZE) RS,109", price: 102, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
  { id: 280, name: "SOAP TIBET (SMALL STANDARD SIZE) RS,70", price: 66, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
  { id: 281, name: "TASH REGAL", price: 153, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "T" },
  { id: 282, name: "WIPES SOFT CREME (MIX)", price: 112, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "W" },
  { id: 283, name: "FACE WASH B N B RICE", price: 565, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "F" },
  { id: 284, name: "SHAMPOO H & S 400ml (MIX) RS,800", price: 745, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
  { id: 285, name: "SHAMPOO MECLAY (MEDIUM) BLACK", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
  { id: 286, name: "SHAMPOO PANTENE 200ml (MIX) RS,450", price: 420, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
  { id: 287, name: "SHAMPOO PANTENE 400ml (MIX) RS,750", price: 695, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
  { id: 288, name: "PASTE SENSODYNE 100g (RAPID ACTION) RS,545", price: 507, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
  { id: 289, name: "PASTE SENSODYNE 70g (FLUORIDE) RS,380", price: 354, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
  { id: 290, name: "PASTE SENSODYNE 70g (ORIGINAL) RS,380", price: 354, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
  { id: 291, name: "SHAMPOO ENGLISH ANTI LICE (MEDIUM) RS,240", price: 218, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
  { id: 292, name: "SHAMPOO REVLON COLOUR SASHY 30#", price: 65, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
  { id: 293, name: "SOAP DOVE LARGE PINK (IMP)", price: 395, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
  { id: 294, name: "CELL POWER PLUS AA", price: 660, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
  { id: 295, name: "CREAM BLASSO BLEACH (BOX) RS,40", price: 33, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
  { id: 296, name: "FEEDER PURE LOVE COLOR (LARGE)", price: 165, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
  { id: 297, name: "PASTE COLGATE 75g MAX FRESH RS,220 (BLUE)", price: 204, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
  { id: 298, name: "PASTE COLGATE 75g MAX FRESH RS,220 (GREEN)", price: 204, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
  { id: 299, name: "PASTE COLGATE 75g MAX FRESH RS,220 (RED)", price: 204, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "P" },
  { id: 300, name: "SHAMPOO DOVE 400ml (MIX) RS,870", price: 795, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
  { id: 301, name: "SHAMPOO LIFE BOY 200ml (YELLOW) RS,320", price: 297, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
  { id: 302, name: "SHAMPOO PALMOLIVE (MEDIUM) PINK RS,400", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
  { id: 303, name: "SHAMPOO PALMOLIVE RS,180 (PINK)", price: 165, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
  { id: 304, name: "SHAMPOO PAMOLIVE RS,180 (GREEN)", price: 165, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
  { id: 305, name: "SHAMPOO PANTENE 400ml (GREEN) SMOOTH & SILKY RS,750", price: 689, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
  { id: 306, name: "SHAMPOO SASHAY LIFE BOY GREEN (COMPANY) RS,10", price: 150, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
  { id: 307, name: "SHAMPOO SASHAY PANTENE MIX (COMPANY)", price: 55, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
  { id: 308, name: "SHAMPOO SASHAY SUNSILK BLACK (COMPANY) 48", price: 75, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
  { id: 309, name: "SHATAL COCK (PLASTIK) GOOD QUALITY WHITE", price: 85, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
  { id: 310, name: "BUTERFLEY PAID MAXI THICK (LONG 9PCS) RP,340", price: 295, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
  { id: 311, name: "COLOUR OLIVIA (# 5 HAZELBLONDE) RS,300", price: 235, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
  { id: 312, name: "COLOUR OLIVIA (# 7 MOCCA) RS,300", price: 235, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
  { id: 313, name: "COLOUR SAMSOLE (# 45 BK) LARGE (SADA) RS,300", price: 238, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
  { id: 314, name: "CONDAM SATHI BOX RS,90", price: 435, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
  { id: 315, name: "CREAM CARE BLEACH (BOX) ALEO VERA (ORUNAL) RS,40", price: 33, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
  { id: 316, name: "J BABY OIL 125ml (COMPANY)", price: 595, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "J" },
  { id: 317, name: "J BABY OIL 50ml (COMPANY)", price: 305, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "J" },
  { id: 318, name: "MOSPEL RS,350", price: 310, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "M" },
  { id: 319, name: "MARKER 605 (BLACK)", price: 195, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "M" },
  { id: 320, name: "MARKER SADA (BLACK)", price: 120, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "M" },
  { id: 321, name: "MARKER SADA (BLUE)", price: 120, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "M" },
  { id: 322, name: "TAPE TRANSPARENT RS,10", price: 85, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "T" },
  { id: 323, name: "COLOUR GODREJ SASHAY (DRK,BROWN)", price: 65, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
  { id: 324, name: "RAZER TRIM", price: 56, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "R" },
  { id: 325, name: "SHIELD FEEDER HANDLE (LARGE) RS,200", price: 177, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
  { id: 326, name: "SHIELD FEEDER HANDLE (MEDIUM) RS,190", price: 168, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
  { id: 327, name: "DABUR RED PASTE (SMALL) RP,250", price: 225, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "D" },
  { id: 328, name: "BODY SPRAY FOGG SMALL (MINI)", price: 175, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "B" },
  { id: 329, name: "CREAM ACTION C RP,400", price: 268, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
  { id: 330, name: "CREAM BIO COS RP,375", price: 245, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
  { id: 331, name: "CREAM STILLMANS (SMALL) (GREEN) RP,270", price: 235, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
  { id: 332, name: "CREAM STILLMANS (SMALL) (RED) FRECKLE RP,270", price: 235, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
  { id: 333, name: "FACE WASH FAIR MENZ (MIX) RP,180", price: 155, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
  { id: 334, name: "FACE WASH GOLDEN PEARL (SMALL) MEN", price: 198, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
  { id: 335, name: "PEN PIANO OLD YELLOW", price: 165, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
  { id: 336, name: "SERUM BIO COSS", price: 78, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
  { id: 337, name: "SERUM GOLDEN PEARL (GOLDEN)", price: 103, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
  { id: 338, name: "ENGLISH PRICKLY HEAT CREAM LARGE RS,250", price: 213, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "E" },
  { id: 339, name: "LIGHTER (ARCO GARARRI)", price: 1340, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "L" },
  { id: 340, name: "TAPE KAGHAZ 1 INCH", price: 65, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "T" },
  { id: 341, name: "TAPE TRANSPARENT (1 INCH)", price: 55, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "T" },
  { id: 342, name: "COTTON BURD DIBI SMALL (WOOD) 100PEC BLUE TOP TIP", price: 90, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
  { id: 343, name: "GILLETTE FOAM 200ml (GREEN) MENTHOL MENS", price: 795, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "G" },
  { id: 344, name: "GILLETTE FOAM 200ml (RED) REGULER", price: 795, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "G" },
  { id: 345, name: "KING RAT BOOK", price: 165, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "K" },
  { id: 346, name: "SHAMPOO DOVE 175ml (GOLDAN) DAILY MOSTURE RS,520", price: 475, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
  { id: 347, name: "SHAMPOO DOVE 175ML (HAIR FALL) RS,520", price: 475, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
  { id: 348, name: "SHAMPOO DOVE 175ml (L, BLUE) RS,520", price: 475, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
  { id: 349, name: "SHAMPOO PANTENE 200ml (GREEN) SMOOTH & SILKY RS,450", price: 415, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
  { id: 350, name: "SHAMPOO SUNSILK 200ml (BLACK) BLACK SHINE RS,499", price: 458, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
  { id: 351, name: "SHAMPOO SUNSILK 200ml (GOLDEN) H,F SOLUTION RS,399", price: 368, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
  { id: 352, name: "SHAMPOO SUNSILK 200ml (PINK) THICK & LONG RS,450", price: 415, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
  { id: 353, name: "CREAM ARINA GOLD RS,350", price: 258, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
  { id: 354, name: "CREAM NO MARKS RS,350", price: 295, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
  { id: 355, name: "CREAM PARLEY BEAUTY BLACK RS,350", price: 275, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
  { id: 356, name: "CREAM S KELLY PEARL", price: 117, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
  { id: 357, name: "CREAM S YOKO WHITENING", price: 119, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
  { id: 358, name: "FACE WASH PARLEY BLACK RS,300", price: 255, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
  { id: 359, name: "FEEDER PP (IMP) HANDAL LARGE", price: 290, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "F" },
  { id: 360, name: "FEEDER PP (IMP) HANDAL MEDIUM", price: 275, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
  { id: 361, name: "COLOUR GARNIER (# 3, DARK BROWN) RS,1099", price: 865, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
  { id: 362, name: "COLOUR GARNIER (# 4, BROWN) RS,999", price: 775, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
  { id: 363, name: "J BABY SOAP 100g PINK", price: 235, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "J" },
  { id: 364, name: "J BABY SOAP 100g WHITE", price: 235, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "J" },
  { id: 365, name: "LOTION VASELINE 200ml (IMP) COCO", price: 635, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "L" },
  { id: 366, name: "LOTION VASELINE 200ml (IMP) PINK", price: 635, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "L" },
  { id: 367, name: "LUX BODY WASH SOFT TUCH (PINK) (IMP)", price: 445, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "L" },
  { id: 368, name: "MEDORA NAIL POLISH REMOVER RS,250", price: 230, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "M" },
  { id: 369, name: "PERFUME DELYCIA (MEDIUM) FEALING RS,650", price: 570, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
  { id: 370, name: "POWDER MOTHER CARE GO-RASH 250g LARGE RS,550", price: 455, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
  { id: 371, name: "VASELINE PETROLIUM (IMP) 100ml S,A (MIX)", price: 315, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "V" },
  { id: 372, name: "VASELINE PETROLIUM (IMP) 50ml S,A (MIX)", price: 215, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "V" },
  { id: 373, name: "LOCK GOLD 50mm", price: 243, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "L" },
  { id: 374, name: "CREAM AJOOBA", price: 295, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
  { id: 375, name: "F & L M,V SASHAY RS,10", price: 150, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "F" },
  { id: 376, name: "FACE WASH GARNIER (SMALL) ACNO FIGHT RS,519", price: 459, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
  { id: 377, name: "FACE WASH GOLDEN PEARL (SMALL) MIX", price: 205, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
  { id: 378, name: "FACE WASH PONDS (IMP) ACNE SOLUTION (SMALL)", price: 260, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "F" },
  { id: 379, name: "VEET TUBE SMALL 25g (MIX) RS,250", price: 224, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "V" },
  { id: 380, name: "CREAM FACE FRESH (LARGE) RS,360", price: 273, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
  { id: 381, name: "BODY SPRAY SHE (MIX)", price: 435, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "B" },
  { id: 382, name: "BRUSH SHAVING (GOOD QUILTY)", price: 155, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
  { id: 383, name: "COMBS ANTILICE HANDAL LARGE", price: 75, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
  { id: 384, name: "COMBS ANTILICE HANDAL MEDIUM", price: 70, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
  { id: 385, name: "CREAM M MOOV 25g", price: 95, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
  { id: 386, name: "LOCK SILVER 50mm (WOHU)", price: 395, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "L" },
  { id: 387, name: "LOCK SILVER 60mm (WOHU)", price: 445, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "L" },
  { id: 388, name: "MIRROR DOUBLE SIDED (LARGE)", price: 210, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "M" },
  { id: 389, name: "MIRROR DOUBLE SIDED (MEDIUM)", price: 140, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "M" },
  { id: 390, name: "MIRROR DOUBLE SIDED (SMALL)", price: 105, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "M" },
  { id: 391, name: "OMEGA AFTER SHAVE RP,240", price: 210, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "O" },
  { id: 392, name: "ROLL ON FA (PINK) TARANCPERNT", price: 375, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "R" },
  { id: 393, name: "PARTY POPPER (SMALL)", price: 75, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
  { id: 394, name: "ROLL ON FA (GREEN)", price: 395, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "R" },
  { id: 395, name: "SOAP TIBET (MEDIUM BATH SIZE) RS,89", price: 84, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
  { id: 396, name: "VITAMN (E) CAPSULES (FACIAL ESSENSE)", price: 285, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "V" },
  { id: 397, name: "ALOE VERA JELL TUBE (LARGE)", price: 145, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "A" },
  { id: 398, name: "ALOE VERA JELL TUBE (MEDIUM) 160ML", price: 110, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "A" },
  { id: 399, name: "COLOUR POLY (# 43) RS,320", price: 275, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
  { id: 400, name: "COLOUR PRIMA HAIR (# 43 BROWN) RS,80", price: 58, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
  { id: 401, name: "COLOUR PRIMA HAIR (# 45 BLACK) RS,80", price: 58, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
  { id: 402, name: "COLOUR SAMSOLE (# 43 D-BR) LARGE (SADA) RS,300", price: 238, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
  { id: 403, name: "UHU PATA", price: 435, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "U" },
  { id: 404, name: "CONDITIONER MECLAY (ORANGE)", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
  { id: 405, name: "DETTOL PANI 50ML (SMALL) RP,250 (NON ORUNAL)", price: 165, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "D" },
  { id: 406, name: "PASTE MEDICAM 35GM RS,120", price: 97, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
  { id: 407, name: "SHAMPOO H & S 200ml (ORANG) RS,470", price: 438, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
  { id: 408, name: "GILLETTE GEL (Small) MIX", price: 355, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "G" },
  { id: 409, name: "LOCK SILVER 40mm (WOHU)", price: 625, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "L" },
  { id: 410, name: "LOCK SILVER 70mm (WOHU)", price: 515, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "L" },
  { id: 411, name: "PASTE FORHENS (LARGE) RS,300", price: 275, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "P" },
  { id: 412, name: "PASTE FORHENS (SMALL) RS,180", price: 165, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
  { id: 413, name: "PASTE SENSODYNE 100g (COMPLETE PROTECTION +) RP,600", price: 558, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
  { id: 414, name: "SHAMPOO MECLAY LARGE (GREEN)", price: 635, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
  { id: 415, name: "SHAMPOO MECLAY LARGE (GOLDEN)", price: 635, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
  { id: 416, name: "SHAMPOO MECLAY LARGE (PINK)", price: 635, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
  { id: 417, name: "SHAMPOO MECLAY LARGE PP", price: 635, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
  { id: 418, name: "SHAMPOO MECLAY LARGE WHITE", price: 635, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
  { id: 419, name: "PASTE COLGATE 40g SADA RS,75", price: 68, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "P" },
  { id: 420, name: "CONDITIONER MECLAY (GOLDEN)", price: 365, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
  { id: 421, name: "BIRTHDAY CANDAL # 1 NUMBER", price: 55, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "B" },
  { id: 422, name: "BIRTHDAY CANDAL # 2 NUMBER", price: 55, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
  { id: 423, name: "BIRTHDAY CANDAL # 3 NUMBER", price: 55, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "B" },
  { id: 424, name: "BIRTHDAY CANDAL # 4 NUMBER", price: 55, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "B" },
  { id: 425, name: "BIRTHDAY CANDAL # 5 NUMBER", price: 55, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "B" },
  { id: 426, name: "BODY SPRAY AXE (CHOCLATE)", price: 675, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "B" },
  { id: 427, name: "BODY SPRAY BOLD (MIX) OLD SLIM", price: 685, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "B" },
  { id: 428, name: "BODY SPRAY (INDO) MIX", price: 225, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "B" },
  { id: 429, name: "COLOUR REVLON FASHION (37) Dark Golden Brown (LARGE)", price: 775, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
];

const PAGE_SIZE = 10;
const RECENT_LIMIT = 15;

export default function SahilTraders() {
  const products = PRODUCTS;

  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [catMenuOpen, setCatMenuOpen] = useState(false);
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [recentSearches, setRecentSearches] = useState([]); // in-memory only, resets on reload
  const searchBoxRef = useRef(null);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchTerm, activeCategory]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (searchBoxRef.current && !searchBoxRef.current.contains(e.target)) {
        setSuggestOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filtered = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = activeCategory === "all" || p.categoryId === activeCategory;
      const matchesSearch = term === "" || p.name.toLowerCase().includes(term);
      return matchesCategory && matchesSearch;
    });
  }, [products, activeCategory, searchTerm]);

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

  const visibleProducts = filtered.slice(0, visibleCount);
  const activeCategoryName =
    activeCategory === "all" ? "All Categories" : CATEGORIES.find((c) => c.id === activeCategory)?.name;
  const showRecent = searchTerm.trim() === "" && activeCategory === "all" && recentSearches.length > 0;

  return (
    <div className="min-h-screen relative text-white overflow-x-hidden" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@600;700;800&display=swap');`}</style>

      {/* Background */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900" />
      <div className="fixed -top-24 -left-24 w-72 h-72 sm:w-96 sm:h-96 bg-violet-600/25 rounded-full blur-3xl -z-10 animate-float-1" />
      <div className="fixed top-1/3 -right-24 w-72 h-72 sm:w-96 sm:h-96 bg-amber-500/15 rounded-full blur-3xl -z-10 animate-float-2" />
      <div className="fixed bottom-0 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-indigo-500/15 rounded-full blur-3xl -z-10 animate-float-1" />

      {/* Header */}
      <header className="sticky top-0 z-30 bg-slate-900/75 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/35">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl p-2 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <Store className="w-5 h-5 text-slate-900" />
              </div>
              <div>
                <h1
                  className="text-white text-lg sm:text-xl font-bold leading-tight tracking-tight"
                  style={{ fontFamily: "'Poppins', sans-serif" }}
                >
                  Sahil Traders
                </h1>
                <p className="text-amber-300/90 text-[11px] sm:text-xs font-medium tracking-wide">
                  {products.length}+ products in stock
                </p>
              </div>
            </div>

            {/* Category button — desktop */}
            <div className="hidden sm:block relative">
              <button
                onClick={() => setCatMenuOpen((o) => !o)}
                className="flex items-center gap-1.5 bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-black/10 hover:border-amber-400/30"
              >
                {activeCategoryName}
                <ChevronDown className={`w-4 h-4 transition-transform ${catMenuOpen ? "rotate-180" : ""}`} />
              </button>
              {catMenuOpen && (
                <CategoryDropdown
                  activeCategory={activeCategory}
                  setActiveCategory={setActiveCategory}
                  setCatMenuOpen={setCatMenuOpen}
                />
              )}
            </div>
          </div>

          {/* Search */}
          <div className="mt-3 relative" ref={searchBoxRef}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setSuggestOpen(true);
                }}
                onFocus={() => setSuggestOpen(true)}
                onKeyDown={handleSearchKeyDown}
                placeholder="Search products..."
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl pl-9 pr-9 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400/40 focus:bg-slate-900/40 transition-all"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {suggestOpen && searchTerm && (
              <div className="absolute mt-2 w-full bg-slate-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/15 overflow-hidden z-40">
                {suggestions.length > 0 ? (
                  suggestions.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSuggestionClick(s)}
                      className="w-full flex items-center justify-between text-left px-4 py-2.5 hover:bg-white/10 text-sm border-b border-white/10 last:border-0 transition-colors"
                    >
                      <span className="text-white/90">{s.name}</span>
                      <span className="text-amber-400 font-semibold whitespace-nowrap ml-3">Rs {s.price.toLocaleString()}</span>
                    </button>
                  ))
                ) : (
                  <p className="px-4 py-3 text-sm text-white/40">No matching products</p>
                )}
              </div>
            )}
          </div>

          {/* Category button — mobile */}
          <div className="sm:hidden mt-2 relative">
            <button
              onClick={() => setCatMenuOpen((o) => !o)}
              className="w-full flex items-center justify-between bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md text-white px-4 py-2.5 rounded-xl text-sm font-medium transition-all shadow-md shadow-black/10 hover:border-amber-400/30"
            >
              {activeCategoryName}
              <ChevronDown className={`w-4 h-4 transition-transform ${catMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {catMenuOpen && (
              <CategoryDropdown
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                setCatMenuOpen={setCatMenuOpen}
                fullWidth
              />
            )}
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="max-w-6xl mx-auto px-4 py-5">
        {showRecent && (
          <section className="mb-7">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-4 h-4 text-amber-300" />
              <h2 className="text-sm font-semibold text-white/80">Recently Searched</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0" style={{ scrollbarWidth: "thin" }}>
              {recentSearches.map((p) => (
                <button
                  key={`recent-${p.id}`}
                  onClick={() => recordSearch(p)}
                  className="shrink-0 w-32 sm:w-36 bg-white/10 backdrop-blur-md border border-white/15 rounded-xl overflow-hidden hover:bg-white/15 transition-colors text-left"
                >
                  <div className="h-24 w-full flex items-center justify-center p-2">
                    {p.hasImage ? (
                      <div className={`w-16 h-16 rounded-lg bg-gradient-to-br ${p.gradient} flex items-center justify-center shrink-0`}>
                        <span className="text-white text-sm font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
                          {p.initial}
                        </span>
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                        <ImageOff className="w-4 h-4 text-white/25" />
                      </div>
                    )}
                  </div>
                  <div className="p-2 pt-0">
                    <p className="text-sm text-white font-semibold leading-snug line-clamp-2">{p.name}</p>
                    <p className="text-amber-400 font-bold text-sm mt-1">Rs {p.price.toLocaleString()}</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white/70">
            {filtered.length.toLocaleString()} product{filtered.length !== 1 ? "s" : ""} found
          </h2>
        </div>

        {visibleProducts.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingBag className="w-10 h-10 text-white/20 mx-auto mb-3" />
            <p className="text-white/50 text-sm">No products match your search.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {visibleProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>

            {visibleCount < filtered.length && (
              <div className="flex justify-center mt-7">
                <button
                  onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                  className="bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-slate-900 font-semibold px-8 py-2.5 rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all"
                >
                  See More
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <footer className="border-t border-white/10 mt-8 py-6 text-center">
        <p className="text-xs text-white/40">Sahil Traders — your trusted wholesale & retail store</p>
      </footer>
    </div>
  );
}

function CategoryDropdown({ activeCategory, setActiveCategory, setCatMenuOpen, fullWidth }) {
  return (
    <div
      className={`absolute mt-2 ${fullWidth ? "w-full" : "w-64 right-0"} bg-slate-900/90 backdrop-blur-xl rounded-xl shadow-2xl border border-white/15 overflow-hidden z-40 max-h-80 overflow-y-auto`}
    >
      <button
        onClick={() => {
          setActiveCategory("all");
          setCatMenuOpen(false);
        }}
        className={`w-full text-left px-4 py-2.5 text-sm font-medium border-b border-white/10 hover:bg-white/10 transition-colors ${
          activeCategory === "all" ? "text-amber-400 bg-white/5" : "text-white/85"
        }`}
      >
        All Categories
      </button>
      {CATEGORIES.map((c) => (
        <button
          key={c.id}
          onClick={() => {
            setActiveCategory(c.id);
            setCatMenuOpen(false);
          }}
          className={`w-full text-left px-4 py-2.5 text-sm border-b border-white/10 last:border-0 hover:bg-white/10 transition-colors ${
            activeCategory === c.id ? "text-amber-400 bg-white/5 font-medium" : "text-white/85"
          }`}
        >
          {c.name}
        </button>
      ))}
    </div>
  );
}

function ProductCard({ product }) {
  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/15 hover:bg-white/15 hover:-translate-y-0.5 transition-all flex flex-col shadow-lg shadow-black/10">
      <div className="h-32 sm:h-36 w-full flex items-center justify-center p-3">
        {product.hasImage ? (
          <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center shrink-0`}>
            <span className="text-white text-3xl sm:text-4xl font-bold" style={{ fontFamily: "'Poppins', sans-serif" }}>
              {product.initial}
            </span>
          </div>
        ) : (
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl bg-white/5 flex flex-col items-center justify-center gap-0.5 shrink-0">
            <ImageOff className="w-7 h-7 sm:w-8 sm:h-8 text-white/25" />
            <span className="text-[9px] text-white/30 font-medium">No Photo</span>
          </div>
        )}
      </div>
      <div className="p-3 pt-1 flex flex-col gap-1.5 flex-1">
        <p className="text-base sm:text-lg text-white font-semibold leading-snug line-clamp-2">{product.name}</p>
        <p className="text-amber-400 font-bold text-lg sm:text-xl mt-auto">Rs {product.price.toLocaleString()}</p>
      </div>
    </div>
  );
}