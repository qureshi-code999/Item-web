import React, { useState, useMemo, useEffect, useRef } from "react";
import { Search, ChevronDown, ShoppingBag, ImageOff, X, Store, Clock } from "lucide-react";

// ---------------------------------------------------------------------------
// PRODUCT LIST
// Just a plain array â€” add new products here whenever you want by copying
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
    { id: "soaps",        name: "Soaps" },
      { id: "shampoo",      name: "Shampoo & Conditioner" },
      { id: "perfumes",     name: "Perfumes" },
      { id: "bodyspray",    name: "Body Spray" },
      { id: "creams",       name: "Creams" },
      { id: "bleachfacial", name: "Bleach & Facial" },
      { id: "stationary",   name: "Stationary" },
      { id: "sports",       name: "Sports" },
      { id: "toys",         name: "Toys" },
      { id: "birthday",     name: "Birthday" },
      { id: "powders",      name: "Powders" },
      { id: "tapes",        name: "Tapes" },
      { id: "shaving",      name: "Shaving" },
      { id: "haircolour",   name: "Hair Colour" },
      { id: "haircare",     name: "Hair Care & Oil" },
      { id: "condemn",      name: "Condemn" },
      { id: "lock",         name: "Lock" },
      { id: "general",      name: "General Items" },
      { id: "bodylotion",   name: "Body Lotions" },
      { id: "babycare",     name: "Baby Care" },
      { id: "blades",       name: "Blades & Razers" },
      { id: "cells",        name: "Cells" },
      { id: "mosquito",     name: "Anti-Mosquito" },
      { id: "personalcare", name: "Personal Care" },
      { id: "others",       name: "Others" },
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
      
      { id: 1, name: "7 HERBAL OIL 100ML RS,250", price: 220, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 2, name: "7 HERBAL OIL 200ML RP,400", price: 350, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 3, name: "7 HERBAL OIL 50ML RS,170", price: 155, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 4, name: "ACNO CLEAR FACE WASH GOLDEN PEARL", price: 230, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "A" },
      { id: 5, name: "AL RASHIEED OIL 100ML SASSO", price: 480, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 6, name: "ALOE VERA JELL TUBE (LARGE)", price: 170, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "A" },
      { id: 7, name: "ALOE VERA JELL TUBE 160ml (MEDIUM) 160ML", price: 130, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "A" },
      { id: 8, name: "ALOE VERA JELL TUBE (SMALL) 80ML", price: 90, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "A" },
      { id: 9, name: "ALWAYS PAD MAXI", price: 480, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "A" },
      { id: 10, name: "ASSIGNMENT SHEET (NARROW)", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 11, name: "ASSIGNMENT SHEET (URDU)", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 12, name: "ATTER 15 ML MIX", price: 360, categoryId: "perfumes", categoryName: "Perfumes" },
      { id: 13, name: "ATTER 25ML", price: 480, categoryId: "perfumes", categoryName: "Perfumes" },
      { id: 14, name: "SNOW FALL SPRAY (LARGE)", price: 180, categoryId: "birthday", categoryName: "Birthday" },
      { id: 15, name: "SNOW FALL SPRAY SMALL", price: 120, categoryId: "birthday", categoryName: "Birthday" },
      { id: 16, name: "SNOW FALL SPRAY SMALL  (KIWI)", price: 140, categoryId: "birthday", categoryName: "Birthday" },
      { id: 17, name: "BAJAJ ALMOND OIL 100ml", price: 950, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 18, name: "BALL ADIDAS", price: 100, categoryId: "sports", categoryName: "Sports" },
      { id: 19, name: "BALL BATA", price: 50, categoryId: "sports", categoryName: "Sports" },
      { id: 20, name: "BALL CA (MEDIUM QUALITY) G A", price: 110, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "B" },
      { id: 21, name: "BALL CA GOOD QUALITY (NON ORIJNAL)", price: 120, categoryId: "sports", categoryName: "Sports" },
      { id: 22, name: "BALL CA GOOD QUALITY MILAT SPORTS", price: 250, categoryId: "sports", categoryName: "Sports" },
      { id: 23, name: "BALL FINE (ORIGNAL)", price: 170, categoryId: "sports", categoryName: "Sports", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "B" },
      { id: 24, name: "BALL FINE (SADA)", price: 110, categoryId: "sports", categoryName: "Sports" },
      { id: 25, name: "BALL FINE (SHORT)", price: 0, categoryId: "sports", categoryName: "Sports" },
      { id: 26, name: "BALL PEN MAX (BLACK)", price: 30, categoryId: "stationary", categoryName: "Stationary" },
      { id: 27, name: "BALL PEN MAX (BLUE)", price: 30, categoryId: "stationary", categoryName: "Stationary" },
      { id: 28, name: "BALL PEN MAX (RED)", price: 0, categoryId: "stationary", categoryName: "Stationary" },               
      { id: 29, name: "BALL PEN PEN (SKY) BLACK", price: 15, categoryId: "stationary", categoryName: "Stationary" },
      { id: 30, name: "BALL PEN PEN (SKY) BLUE", price: 15, categoryId: "stationary", categoryName: "Stationary" },
      { id: 31, name: "BALL PEN PEN (SKY) RED", price: 15, categoryId: "stationary", categoryName: "Stationary" },
      { id: 32, name: "BALL PEN PIANO YELLOW BLUE CAP (OLD) (BLUE)", price: 15, categoryId: "stationary", categoryName: "Stationary" },
      { id: 33, name: "BALL PEN PICASSO BLUE", price: 18, categoryId: "stationary", categoryName: "Stationary" },
      { id: 34, name: "BALL PEN PICASSO RED", price: 18, categoryId: "stationary", categoryName: "Stationary" },
      { id: 35, name: "BALL POINT PEN (BLACK) DOLLER", price: 18, categoryId: "stationary", categoryName: "Stationary" },
      { id: 36, name: "BALL POINT PEN (BLUE) DOLLER", price: 18, categoryId: "stationary", categoryName: "Stationary" },
      { id: 37, name: "BALL POINT PEN SIGNATURE (BLACK)", price: 18, categoryId: "stationary", categoryName: "Stationary" },
      { id: 38, name: "BALL POINT PEN SIGNATURE (BLUE)", price: 18, categoryId: "stationary", categoryName: "Stationary" },
      { id: 39, name: "BALL W Z", price: 0, categoryId: "sports", categoryName: "Sports" },
      { id: 40, name: "BALL Z S", price: 0, categoryId: "sports", categoryName: "Sports" },
      { id: 41, name: "BALLOON LARGE (SMILE)", price: 4, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "B" },
      { id: 42, name: "BALOON DIL", price: 6, categoryId: "birthday", categoryName: "Birthday" },
      { id: 43, name: "BALOON LARGE MIX", price: 4, categoryId: "birthday", categoryName: "Birthday" },
      { id: 44, name: "BALOON PATA MIX", price: 4, categoryId: "birthday", categoryName: "Birthday" },
      { id: 45, name: "BALOON X,L (MIX)", price: 8, categoryId: "birthday", categoryName: "Birthday" },
      { id: 46, name: "BANYAN (# 38)", price: 165, categoryId: "others", categoryName: "Others" },
      { id: 47, name: "BANYAN (# 40)", price: 175, categoryId: "others", categoryName: "Others" },
      { id: 48, name: "BANYAN (# 42)", price: 185, categoryId: "others", categoryName: "Others" },
      { id: 49, name: "BANYAN (# 44)" ,price: 195, categoryId: "others", categoryName: "Others" },
      { id: 50, name: "BANYAN CHILD  30# GOOD QUALITY", price: 80, categoryId: "others", categoryName: "Others" },
      { id: 51, name: "BIO AMLA HAIR OIL 100ml RS,280", price: 190, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
      { id: 52, name: "BIO AMLA HAIR OIL 200ml FARVAL ORIJNAL RS,475", price: 380, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 53, name: "BIO AMLA HAIR OIL 50ml FARVAL ORIJNAL RS,160", price: 140, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 54, name: "BIRTHDAY CANDAL # 1 NUMBER", price: 50, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "B" },
      { id: 55, name: "BIRTHDAY CANDAL # 2 NUMBER", price: 50, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "B" },
      { id: 56, name: "BIRTHDAY CANDAL # 3 NUMBER", price: 50, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "B" },
      { id: 57, name: "BIRTHDAY CANDAL # 4 NUMBER", price: 50, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
      { id: 58, name: "BIRTHDAY CANDAL # 5 NUMBER", price: 50, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "B" },
      { id: 59, name: "BLACK COBRA SPRAY 300ML", price: 420, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "B" },
      { id: 60, name: "BLACK MASK SASHEY 24 PECE", price: 35, categoryId: "creams", categoryName: "Creams" },
      { id: 61, name: "BLADE 7 O CLOCK GREEN", price: 80, categoryId: "blades", categoryName: "Blades & Razers", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "B" },
      { id: 62, name: "BLADE TREET (BLACK)", price: 70, categoryId: "blades", categoryName: "Blades & Razers", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "B" },
      { id: 63, name: "BLADE TREET (CLASSIC)", price: 90, categoryId: "blades", categoryName: "Blades & Razers" },
      { id: 64, name: "BLADE TREET (PLATINUM)", price: 90, categoryId: "blades", categoryName: "Blades & Razers" },
      { id: 65, name: "BODY RAZER TINKLE (DABAL PACK SAFTIY)", price: 190, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
      { id: 66, name: "BODY RAZER TWINKLE LADIES (EYEBROW)", price: 80, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "B" },
      { id: 67, name: "BODY SPRAY (INDO) MIX", price: 240, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "B" },
      { id: 68, name: "BODY SPRAY AXE (CHOCLATE)", price: 690, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "B" },
      { id: 69, name: "BODY SPRAY AXE (MIX)", price: 690, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "B" },
      { id: 70, name: "BODY SPRAY BOLD (MIX) OLD SLIM", price: 690, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "B" },
      { id: 71, name: "BODY SPRAY BRUT (GREEN)", price: 790, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 72, name: "BODY SPRAY CHI CHI (BLUE) FOR MEN", price: 690, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 73, name: "BODY SPRAY CHI CHI (CRAZY GIRL)", price: 690, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 74, name: "BODY SPRAY CHI CHI (NICE FELING) FOR MEN (BLACK)", price: 690, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 75, name: "BODY SPRAY CHI CHI (PINK) WOMEN", price: 690, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "B" },
      { id: 76, name: "BODY SPRAY CHI CHI (SOLID)", price: 690, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "B" },
      { id: 77, name: "BODY SPRAY DUNHIL DESIRE (BLACK)", price: 640, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 78, name: "BODY SPRAY DUNHIL DESIRE (BLUE) ORIJNAL LOCK", price: 640, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 79, name: "BODY SPRAY DUNHIL DESIRE (RED) ORIJNAL LOCK", price: 0, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 80, name: "BODY SPRAY EVERY ONE", price: 590, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
      { id: 81, name: "BODY SPRAY EVERY ONE", price: 590, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "B" },
      { id: 82, name: "BODY SPRAY FERRORI (MIX)", price: 390, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 83, name: "BODY SPRAY FOGG (BLACK) MARCO (PK)", price: 890, categoryId: "bodyspray", categoryName: "Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "B" },
      { id: 84, name: "BODY SPRAY FOGG (DARK BLUE) ROYAL", price: 890, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 85, name: "BODY SPRAY FOGG (GREEN) VICTOR", price: 890, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 86, name: "BODY SPRAY FOGG (LIGHT,BLUE) IMPERIAL", price: 890, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 87, name: "BODY SPRAY FOGG (LIGHT,GREEN) MAJSTIC", price: 890, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 88, name: "BODY SPRAY FOGG (MEHROON) MONARCH", price: 890, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
      { id: 89, name: "BODY SPRAY FOGG (PARPAL) PARADISE", price: 890, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 90, name: "BODY SPRAY FOGG (RED) NAPOLEON", price: 890, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 91, name: "BODY SPRAY FOGG MASTER (WHITE) OAK", price: 890, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 92, name: "BODY SPRAY FOGG SMALL (MINI)", price: 190, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "B" },
      { id: 93, name: "BODY SPRAY HAVOC GERMANY (GOLD)", price: 980, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 94, name: "BODY SPRAY HAVOC GERMANY (SILVER)", price: 980, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "B" },
      { id: 95, name: "BODY SPRAY J. (OUD)", price:740, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 96, name: "BODY SPRAY J. (ZARAR)", price: 0, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 97, name: "BODY SPRAY JANAN", price: 740, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 98, name: "BODY SPRAY LUMANI", price: 830, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 99, name: "BODY SPRAY LUMANI DO IT", price: 830, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 100, name: "BODY SPRAY MARKHOR (MIX) RP,625", price: 690, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 101, name: "BODY SPRAY MARQUIS (MEHROON)", price: 690, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 102, name: "BODY SPRAY ONE MAN SHOW (BLACK)", price: 790, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 103, name: "BODY SPRAY ONE MEN SHOE", price: 790, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 104, name: "BODY SPRAY ONE MEN SHOE 2 EACH", price: 790, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 105, name: "BODY SPRAY PURE BLACK", price: 590, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "B" },
      { id: 106, name: "BODY SPRAY RASSASI BLUE LADY", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 107, name: "BODY SPRAY RASSASI BLUE MEN", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 108, name: "BODY SPRAY RASSASI CHASTITY BLACK", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 109, name: "BODY SPRAY RASSASI CHASTITY GOLDEN", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 110, name: "BODY SPRAY RASSASI EMOTION (MEN)", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 111, name: "BODY SPRAY RASSASI EMOTION (WOMEN)", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 112, name: "BODY SPRAY RASSASI FEALING", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 113, name: "BODY SPRAY RASSASI HOPE (MEN)", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 114, name: "BODY SPRAY RASSASI HOPE (WOMEN)", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 115, name: "BODY SPRAY RASSASI RELATION (GOLDEN)", price: 0, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 116, name: "BODY SPRAY RASSASI RELATION (WOMEN)", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 117, name: "BODY SPRAY RASSASI ROMANCE (MEN)", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 118, name: "BODY SPRAY RASSASI ROMANCE (WOMEN)", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 119, name: "BODY SPRAY RASSASI ROYAL BLACK", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 120, name: "BODY SPRAY RASSASI ROYAL BLUE", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 121, name: "BODY SPRAY RASSASI ROYAL PINK (W,M)", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 122, name: "BODY SPRAY RASSASI SECRET", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 123, name: "BODY SPRAY RASSASI TWINKILE", price: 0, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 124, name: "BODY SPRAY SHALIS (MEN)", price: 890, categoryId: "bodyspray", categoryName: "Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "B" },
      { id: 125, name: "BODY SPRAY SHALIS (WOMEN)", price: 890, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 126, name: "BODY SPRAY SHE (ANGLE)", price: 490, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "B" },
      { id: 127, name: "BODY SPRAY SHE (MIX)", price: 490, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
      { id: 128, name: "BODY SPRAY SHE (RED)", price: 490, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "B" },
      { id: 129, name: "BODY SPRAY UDV (LARGE) (SILVER)", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 130, name: "BODY SPRAY UDV (LARGE) BLACK (SILVER)", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 131, name: "BODY SPRAY UDV (LARGE) FOR MEN (SLATY)", price: 880, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 132, name: "BODY SPRAY YARDLEY (MIX)", price: 0, categoryId: "bodyspray", categoryName: "Body Spray" },
      { id: 133, name: "BRUSH CHILD CHOFN (CAR)", price: 110, categoryId: "general", categoryName: "General Items" },
      { id: 134, name: "BRUSH COBOR", price: 60, categoryId: "general", categoryName: "General Items" },
      { id: 135, name: "BRUSH COLGATE (WITH CAP) IMP", price: 120, categoryId: "general", categoryName: "General Items" },
      { id: 136, name: "BRUSH HAIR (CHAMCHA)", price: 175, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "B" },
      { id: 137, name: "BRUSH HAIR (THAPA) GOOD QUALITY", price: 195, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "B" },
      { id: 138, name: "BRUSH ORAL-B", price: 150, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "B" },
      { id: 139, name: "BRUSH ORAL-B (WITH CAP)", price: 150, categoryId: "general", categoryName: "General Items" },
      { id: 140, name: "BRUSH SENSODYNE (STAND+CAP) SOFT", price: 170, categoryId: "general", categoryName: "General Items" },
      { id: 141, name: "BRUSH SHAVING (GOOD QUILTY)", price: 190, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "B" },
      { id: 142, name: "BRUSH SUREE PLASTIK PAKING SINGAL (NAYLON TAR) BLACK", price: 120, categoryId: "general", categoryName: "General Items" },
      { id: 143, name: "BRUSH SUREE PLASTIK PAKING SINGAL (NAYLON TAR) WHITE", price: 120, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "B" },
      { id: 144, name: "BRUSH TYR HANDEL", price: 70, categoryId: "general", categoryName: "General Items" },
      { id: 145, name: "BRUSH TYR SADA", price: 70, categoryId: "general", categoryName: "General Items" },
      { id: 146, name: "BRYLCREEM (LARGE) (MIX)", price: 0, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 147, name: "BRYLCREEM (MEDIUM) (MIX)", price: 580, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 148, name: "BUTERFLEY PAID ALWAYS DARK BLUE RS,480", price: 430, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 149, name: "BUTERFLEY PAID ALWAYS LONG RP,340", price: 310, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 150, name: "BUTERFLEY PAID ALWAYS RS,120 PINK", price: 310, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 151, name: "BUTERFLEY PAID ALWAYS ULTRA (EXTRA LONG) RP,230", price: 210, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 152, name: "BUTERFLEY PAID ALWAYS ULTRA (LONG) RP,230", price: 210, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 153, name: "BUTERFLEY PAID MAXI THICK (EXTRA LONG 8PCS) RP,340", price: 310, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 154, name: "BUTERFLEY PAID MAXI THICK (LONG 9PCS) RP,340", price: 310, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "B" },
      { id: 155, name: "CELL CAMELION LONGER LASTING AA (40 PCS) BOX", price: 50, categoryId: "cells", categoryName: "Cells" },
      { id: 156, name: "CELL DUBLE CHARGER AA", price: 30, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 157, name: "CELL DUBLE CHARGER AAA", price: 30, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 158, name: "CELL POWER PLUS AA", price: 30, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 159, name: "CELL TOSHIBA AA (BLACK)", price: 35, categoryId: "cells", categoryName: "Cells" },
      { id: 160, name: "CELL TOSHIBA AA (H,D PK)", price: 35, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 161, name: "CELL TOSHIBA AA (L,RED) PINK NO PK", price: 35, categoryId: "cells", categoryName: "Cells" },
      { id: 162, name: "CELL TOSHIBA AAA (BLACK)", price: 35, categoryId: "cells", categoryName: "Cells" },
      { id: 163, name: "CELL TOSHIBA AAA (H,D PK)", price: 35, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 164, name: "CELL TOSHIBA AAA (H,D PK)", price: 35, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 165, name: "CELL TOSHIBA SIZE (D)", price: 140, categoryId: "cells", categoryName: "Cells" },
      { id: 166, name: "CHAP IT JAR 5DAZ (ORIGNAL)", price: 40, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 167, name: "CHEERY POLISH (BLACK) LARGE RS,650", price: 590, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 168, name: "CHEERY POLISH (BLACK) SMALL RS,325", price: 300, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 169, name: "CHEERY POLISH (BRWON) LARGE RS,650", price: 590, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 170, name: "CHEERY POLISH (BRWON) SMALL RS,325", price: 300, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 171, name: "COBRA INSIST KILLER SPRAY 300ml", price: 0, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 172, name: "COBRA INSIST KILLER SPRAY 400ml", price: 0, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 173, name: "COBRA INSIST KILLER SPRAY 500ml", price: 0, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 174, name: "COBRA INSIST KILLER SPRAY 600ml", price: 0, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 175, name: "COFFE SASHAY (60 PCS)", price: 40, categoryId: "others", categoryName: "Others", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 176, name: "COLOUR BIGEN (# 57) (DARK BROWN) RS,230", price: 0, categoryId: "haircolour", categoryName: "Hair Colour" },
      { id: 177, name: "COLOUR BLACK ROSE # 41", price: 190, categoryId: "haircolour", categoryName: "Hair Colour" },
      { id: 178, name: "COLOUR BLACK ROSE 45 # RS,220", price: 190, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 179, name: "COLOUR BREMOD (8.0 )", price: 0, categoryId: "haircolour", categoryName: "Hair Colour" },
      { id: 180, name: "COLOUR GARNIER (# 3, DARK BROWN) RS,1099", price: 980, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 181, name: "COLOUR GARNIER (# 4, BROWN) RS,999", price: 890, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 182, name: "COLOUR GARNIER (#3,DARK BROWN) RS,1099", price: 980, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 183, name: "COLOUR GARNIER (MIX) RS,999", price: 89, categoryId: "haircolour", categoryName: "Hair Colour" },
      { id: 184, name: "COLOUR GARNIER SASHAY (1# BLACK) RS,199", price: 185, categoryId: "haircolour", categoryName: "Hair Colour", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 185, name: "COLOUR GARNIER SASHAY (3# DARK BROWN) RS,199", price: 185, categoryId: "haircolour", categoryName: "Hair Colour", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 186, name: "COLOUR GARNIER SASHAY (4# BROWN) RS,199", price: 185, categoryId: "haircolour", categoryName: "Hair Colour", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 187, name: "COLOUR GODREJ SASHAY (DRK,BROWN)", price: 70, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 188, name: "COLOUR GODREJ SASHAY (NTRL BRN)", price: 70, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 189, name: "COLOUR HELLO HAIR (# 03 DARK BROWN)", price: 250, categoryId: "haircolour", categoryName: "Hair Colour", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 190, name: "COLOUR JUST FOR MEN ( BLACK BROWN ) HAIR", price: 1750, categoryId: "haircolour", categoryName: "Hair Colour" },
      { id: 191, name: "COLOUR JUST FOR MEN (BLACK) BREED", price: 1750, categoryId: "haircolour", categoryName: "Hair Colour" },
      { id: 192, name: "COLOUR KALA KOLA HAIR # 41 LARGE (M,BROWN)", price: 190, categoryId: "haircolour", categoryName: "Hair Colour" },
      { id: 193, name: "COLOUR MARKER  (DOLLAR)", price: 100, categoryId: "stationary", categoryName: "Stationary" },
      { id: 194, name: "COLOUR OLIVIA (# 1 BLACK) RS,300", price: 260, categoryId: "haircolour", categoryName: "Hair Colour", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 195, name: "COLOUR OLIVIA (# 10 BLUE/BLACK) RS,300", price: 260, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 196, name: "COLOUR OLIVIA (# 11 COPPER BROWN) RS,300", price: 260, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 197, name: "COLOUR OLIVIA (# 12 GLODEN BLONDE) RS,300", price: 260, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 198, name: "COLOUR OLIVIA (# 14) RS,300", price: 260, categoryId: "haircolour", categoryName: "Hair Colour" },
      { id: 199, name: "COLOUR OLIVIA (# 2 DARK BROWN) RS,300", price: 260, categoryId: "haircolour", categoryName: "Hair Colour", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 200, name: "COLOUR OLIVIA (# 3 MEDIUM BROWN) RS,300", price: 260, categoryId: "haircolour", categoryName: "Hair Colour", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 201, name: "COLOUR OLIVIA (# 4 LIGHT BROWN) RS,300", price: 260, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 202, name: "COLOUR OLIVIA (# 5 HAZELBLONDE) RS,300", price: 260, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 203, name: "COLOUR OLIVIA (# 6 ASH BLONDE) RS,300", price: 260, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 204, name: "COLOUR OLIVIA (# 7 MOCCA) RS,300", price: 260, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 205, name: "COLOUR OLIVIA (# 8 BURGUNDY) RS,300", price: 260, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 206, name: "COLOUR OLIVIA (# 9 MAHOGANY) RS,300", price: 260, categoryId: "haircolour", categoryName: "Hair Colour", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 207, name: "COLOUR POLY (# 43) RS,320", price: 290, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 208, name: "COLOUR PRIMA HAIR (# 43 BROWN) RS,80", price: 60, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 209, name: "COLOUR PRIMA HAIR (# 45 BLACK) RS,80", price: 60, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 210, name: "COLOUR REVLON FASHION (27) LARGE", price: 790, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 211, name: "COLOUR REVLON FASHION (37) Dark Golden Brown (LARGE)", price: 790, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 212, name: "COLOUR REVLON FASHION (43) Medium Golden Brown (LARGE)", price: 790, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 213, name: "COLOUR REVLON FASHION (53) Light Auburn (LARGE)", price: 790, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 214, name: "COLOUR REVLON FASHION (57) Lightest Golden Brown (LARGE)", price: 790, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 215, name: "COLOUR REVLON FASHON (11) (LARGE)", price: 790, categoryId: "haircolour", categoryName: "Hair Colour" },
      { id: 216, name: "COLOUR REVLON REGULAR (10) BLACK (LARGE)", price: 790, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 217, name: "COLOUR REVLON REGULAR (20) Brown Black (LARGE)", price: 790, categoryId: "haircolour", categoryName: "Hair Colour", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 218, name: "COLOUR REVLON REGULAR (30) Dark Brown (LARGE)", price: 790, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 219, name: "COLOUR REVLON REGULAR (51) Light Brown (LARGE)", price: 790, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 220, name: "COLOUR SAMSOLE ( # 13) LARGE RS,300", price: 260, categoryId: "haircolour", categoryName: "Hair Colour" },
      { id: 221, name: "COLOUR SAMSOLE (# 43 D-BR) LARGE (SADA) RS,300", price: 260, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 222, name: "COLOUR SAMSOLE (# 43) SMALL RS,160", price: 145, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 223, name: "COLOUR SAMSOLE (# 45 BK) LARGE (SADA) RS,300", price: 260, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 224, name: "COLOUR SAMSOLE (# 45) SMALL RS,160", price: 145, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 225, name: "COLOUR WAJEE TUBE ( # 43 DARK BROWN) RS,70", price: 0, categoryId: "haircolour", categoryName: "Hair Colour" },
      { id: 226, name: "COLOUR WAJEE TUBE ( # 45 BLACK) RS,70", price: 0, categoryId: "haircolour", categoryName: "Hair Colour" },
      { id: 227, name: "COMBS ANTILICE HANDAL LARGE", price: 80, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 228, name: "COMBS ANTILICE HANDAL MEDIUM", price: 80, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 229, name: "COMBS CRISTAL", price: 25, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 230, name: "COMBS JADEED", price: 25, categoryId: "others", categoryName: "Others" },
      { id: 231, name: "COMBS NEELAM", price: 20, categoryId: "others", categoryName: "Others" },
      { id: 232, name: "COMBS POCKET (BEAUTY)", price: 10, categoryId: "others", categoryName: "Others" },
      { id: 233, name: "COMBS SAIRA", price: 10, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 234, name: "CONDAM DO (RED)", price: 190, categoryId: "condemn", categoryName: "Condemn" },
      { id: 235, name: "CONDAM DO BLACK", price: 190, categoryId: "condemn", categoryName: "Condemn" },
      { id: 236, name: "CONDAM DUERAX 12 PCS (1 DIBI)", price: 0, categoryId: "condemn", categoryName: "Condemn" },
      { id: 237, name: "CONDAM HAPPY LIFE (3 IN 1)", price: 70, categoryId: "condemn", categoryName: "Condemn" },
      { id: 238, name: "CONDAM JOSH (BLUE) DELAY", price: 100, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 239, name: "CONDAM KLIMAX (EXTASY) (BLACK & ORANGE) ORIJNAL IMP", price: 190, categoryId: "condemn", categoryName: "Condemn" },
      { id: 240, name: "CONDAM NIGHT RIDER", price: 30, categoryId: "condemn", categoryName: "Condemn" },
      { id: 241, name: "CONDAM ROUGH RIDER MIX", price: 150, categoryId: "condemn", categoryName: "Condemn" },
      { id: 242, name: "CONDAM SATHI (MANTHOL)", price: 90, categoryId: "condemn", categoryName: "Condemn" },
      { id: 243, name: "CONDAM SATHI (RED)", price: 80, categoryId: "condemn", categoryName: "Condemn" },
      { id: 244, name: "CONDAM SATHI BOX RS,90", price: 80, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 245, name: "CONDAM TOUCH (BLUE) 6 PACK 3IN 1", price: 160, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 246, name: "CONDAM TOUCH (GREEN) 3IN 1", price: 90, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 247, name: "CONDAM TOUCH (RED)", price: 100, categoryId: "condemn", categoryName: "Condemn" },
      { id: 248, name: "CONDITIONER DOVE (COMPENY) MIX  RS,540", price: 510, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 249, name: "CONDITIONER LOREAL (BLACK) RS,550", price: 510, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 250, name: "CONDITIONER LOREAL (DREAM LONG) RS,550", price: 510, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 251, name: "CONDITIONER LOREAL (GOLDEN) RS,550", price: 510, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 252, name: "CONDITIONER LOREAL (HYALURON MOISTURE) BLUE RS,620", price: 570, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 253, name: "CONDITIONER LOREAL (PP) RS,540", price: 510, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 254, name: "CONDITIONER LOREAL (RED) RS,550", price: 510, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 255, name: "CONDITIONER LOREAL (WHITE) RS,540", price: 510, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 256, name: "CONDITIONER MECLAY (BLACK)", price: 370, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 257, name: "CONDITIONER MECLAY (GOLDEN)", price: 370, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 258, name: "CONDITIONER MECLAY (ORANGE)", price: 370, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 259, name: "CONDITIONER MECLAY (PINK)", price: 370, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 260, name: "CONDITIONER MECLAY (PINK)", price: 370, categoryId: "shampoo", categoryName: "Shampoo & Conditioner", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 261, name: "CONDITIONER MECLAY (PP)", price: 370, categoryId: "shampoo", categoryName: "Shampoo & Conditioner", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 262, name: "CONDITIONER MECLAY (RED)", price: 370, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 263, name: "CONDITIONER MECLAY (WHITE)", price: 370, categoryId: "shampoo", categoryName: "Shampoo & Conditioner", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 264, name: "CONDITIONER PANTENE COMPANY MIX RS,450", price: 430, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 265, name: "CONDITIONER SUNSILK (COMPANY) MIX RS,530", price: 490, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 266, name: "CONDITIONER TRESEMME (IMP) 175ml RED", price: 500, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 267, name: "CONDITIONER TRESEMME 400ml (MIX)", price: 840, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 268, name: "CONDITIONER TRESEMME 400ml (RED)", price: 840, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 269, name: "COTTON BUD DIBI SMALL (WOOD)", price: 80, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 270, name: "COTTON BURD (PAKIT) PLASTIC", price: 30, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 271, name: "COTTON BURD (PAKIT) WOOD", price: 30, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 272, name: "COTTON BURD (PKT) WOOD (100 PECE) BLUE TOP TIP", price: 90, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 273, name: "COTTON BURD DIBI SMALL (PLASTIK) 100PEC BLUE TOP TIP", price: 120, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 274, name: "COTTON BURD DIBI SMALL (WOOD) 100PEC BLUE TOP TIP", price: 120, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 275, name: "COTTON BURD DIBI SMALL (WOOD) HEART WALI", price: 90, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 276, name: "CREAM 3D BLECH (BOX) SASHY RP.30", price: 25, categoryId: "bodylotion", categoryName: "Body Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 277, name: "CREAM ACTION C RP,400", price: 340, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 278, name: "CREAM AJOOBA", price: 340, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 279, name: "CREAM ARCHI PERL THAILAND", price: 130, categoryId: "bodylotion", categoryName: "Body Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 280, name: "CREAM ARENA (HAND & FOOT) RS,360", price: 295, categoryId: "creams", categoryName: "Creams" },
      { id: 281, name: "CREAM ARINA GOLD", price: 295, categoryId: "creams", categoryName: "Creams" },
      { id: 282, name: "CREAM ARINA GOLD (MEN) RP,350", price: 295, categoryId: "creams", categoryName: "Creams" },
      { id: 283, name: "CREAM ARINA GOLD RS,350", price: 295, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 284, name: "CREAM B N B BEAUTY", price: 590, categoryId: "creams", categoryName: "Creams" },
      { id: 285, name: "CREAM BAREERA GOLD RS,375", price: 295, categoryId: "creams", categoryName: "Creams" },
      { id: 286, name: "CREAM BIO COS RP,375", price: 295, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 287, name: "CREAM BLASSO BLEACH (BOX) RS,40", price: 35, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 288, name: "CREAM BLASSO BLEACH 25g", price: 80, categoryId: "creams", categoryName: "Creams" },
      { id: 289, name: "CREAM CARE BLEACH (BOX) ALEO VERA (ORUNAL) RS,40", price: 35, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 290, name: "CREAM CRISMA HAND & FOOT", price: 395, categoryId: "creams", categoryName: "Creams" },
      { id: 291, name: "CREAM DEEP HEAT 70G TUBE", price: 790, categoryId: "creams", categoryName: "Creams" },
      { id: 292, name: "CREAM DUE WHITENING RS,350", price: 295, categoryId: "creams", categoryName: "Creams" },
      { id: 293, name: "CREAM EU JAR (LARGE) RS,330", price: 300, categoryId: "creams", categoryName: "Creams" },
      { id: 294, name: "CREAM EU JAR (LARGE) RS,350", price: 320, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 295, name: "CREAM EU JAR (MEDIUM) RS,220", price: 200, categoryId: "creams", categoryName: "Creams" },
      { id: 296, name: "CREAM EU TUBE (LARGE) RS,250", price: 220, categoryId: "creams", categoryName: "Creams" },
      { id: 297, name: "CREAM EU TUBE (SMALL) RS,160", price: 145, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 298, name: "CREAM EU TUBE 75g (MEDIUM) RS,320", price: 290, categoryId: "creams", categoryName: "Creams" },
      { id: 299, name: "CREAM FACE FRESH (LARGE) RS,360", price: 295, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 300, name: "CREAM FACE FRESH CLEANSER (LARGE)", price: 360, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 301, name: "CREAM FACE FRESH GOLD (LARGE) RS,360", price: 295, categoryId: "creams", categoryName: "Creams" },
      { id: 302, name: "CREAM FAIR & HANDSOME (LARGE)", price: 390, categoryId: "creams", categoryName: "Creams" },
      { id: 303, name: "CREAM FAIR & HANDSOME (SMALL)", price: 280, categoryId: "creams", categoryName: "Creams" },
      { id: 304, name: "CREAM FAIR MENZ (LARGE) RS,250", price: 230, categoryId: "creams", categoryName: "Creams" },
      { id: 305, name: "CREAM FAIZA BEAUTY SMALL (223190) RS,375", price: 320, categoryId: "creams", categoryName: "Creams" },
      { id: 306, name: "CREAM GLUPATONE", price: 350, categoryId: "creams", categoryName: "Creams" },
      { id: 307, name: "CREAM GLUTA WHITE", price: 390, categoryId: "bodylotion", categoryName: "Body Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 308, name: "CREAM GLUTA WHITE (LARGE)", price:1500, categoryId: "creams", categoryName: "Creams" },
      { id: 309, name: "CREAM GOLDEN PEARL NEW RS,360", price: 290, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 310, name: "CREAM GOLDEN PEARL NEW RS,360", price: 290, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 311, name: "CREAM GORI RS,499", price: 420, categoryId: "creams", categoryName: "Creams" },
      { id: 312, name: "CREAM JHALAK RS,360", price: 295, categoryId: "creams", categoryName: "Creams" },
      { id: 313, name: "CREAM JHALAK RS,360", price: 295, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 314, name: "CREAM M BETNOVATE RP,180.62", price: 175, categoryId: "creams", categoryName: "Creams" },
      { id: 315, name: "CREAM M DERMO VATE RP,199.06", price: 194, categoryId: "creams", categoryName: "Creams" },
      { id: 316, name: "CREAM M ITCH GUARD 25g", price: 150, categoryId: "creams", categoryName: "Creams" },
      { id: 317, name: "CREAM M MOOV 25g", price: 120, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 318, name: "CREAM NEW GOLDEN STAR RP,400", price: 330, categoryId: "creams", categoryName: "Creams" },
      { id: 319, name: "CREAM NIVIA (BLUE) 60ml", price: 470, categoryId: "creams", categoryName: "Creams" },
      { id: 320, name: "CREAM NIVIA SOFT 100ml", price: 690, categoryId: "creams", categoryName: "Creams" },
      { id: 321, name: "CREAM NIVIA SOFT 50ml", price: 380, categoryId: "bodylotion", categoryName: "Body Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "C" },
      { id: 322, name: "CREAM NO MARKS RS,350", price: 320, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 323, name: "CREAM OLIVIA BLEACH HARBAL RS,70", price: 65, categoryId: "creams", categoryName: "Creams" },
      { id: 324, name: "CREAM OLIVIA BLEACH RS,60", price: 55, categoryId: "creams", categoryName: "Creams" },
      { id: 325, name: "CREAM PARLEY BEAUTY BLACK RS 350", price: 295, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 326, name: "CREAM PARLEY BLEACH SASHAY BLACK RS,70", price: 60, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "C" },
      { id: 327, name: "CREAM PARLEY URGENT FICIAL SASHAY", price: 60, categoryId: "creams", categoryName: "Creams" },
      { id: 328, name: "CREAM PEACH BLEACH (BOX) RS,40", price: 35, categoryId: "bodylotion", categoryName: "Body Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 329, name: "CREAM PONDS BB (MEDIUM) 18g", price: 840, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "C" },
      { id: 330, name: "CREAM PONDS BB (SMALL) 9g", price: 490, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 331, name: "CREAM PONDS JAR LARGE COMPANY RS,450", price: 430, categoryId: "creams", categoryName: "Creams" },
      { id: 332, name: "CREAM ROOP SINGHAR", price: 340, categoryId: "creams", categoryName: "Creams" },
      { id: 333, name: "CREAM S KELLY PEARL", price: 130, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 334, name: "CREAM S MENA FACIAL", price: 130, categoryId: "creams", categoryName: "Creams" },
      { id: 335, name: "CREAM S YOKO WHITENING", price: 130, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "C" },
      { id: 336, name: "CREAM SANDAL RP,360", price: 295, categoryId: "creams", categoryName: "Creams" },
      { id: 337, name: "CREAM SEVEN HERBAL UBTAN RS,170", price: 160, categoryId: "creams", categoryName: "Creams" },
      { id: 338, name: "CREAM SEVEN HERBAL UBTAN RS,260", price: 240, categoryId: "creams", categoryName: "Creams" },
      { id: 339, name: "CREAM SHAVING ADMIRAL", price: 200, categoryId: "creams", categoryName: "Creams" },
      { id: 340, name: "CREAM SHAVING DIPLOMAT RS,200", price: 190, categoryId: "creams", categoryName: "Creams" },
      { id: 341, name: "CREAM SHAVING JOLLY", price: 180, categoryId: "creams", categoryName: "Creams" },
      { id: 342, name: "CREAM SHAVING TOUCH ME RS,230", price: 210, categoryId: "creams", categoryName: "Creams" },
      { id: 343, name: "CREAM SHEESHA BEAUTY CREAM RP,360", price: 295, categoryId: "creams", categoryName: "Creams" },
      { id: 344, name: "CREAM SIA GOLD RP,360", price: 295, categoryId: "creams", categoryName: "Creams" },
      { id: 345, name: "CREAM STILLMANS (SMALL) (GREEN) RP,270", price: 250, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "C" },
      { id: 346, name: "CREAM STILLMANS (SMALL) (RED) FRECKLE RP,270", price: 250, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "C" },
      { id: 347, name: "CREAM SUDO 125GM", price: 1550, categoryId: "creams", categoryName: "Creams" },
      { id: 348, name: "CREAM SUDO 60GM", price: 1150, categoryId: "creams", categoryName: "Creams" },
      { id: 349, name: "CREAM TIBET COLD (LARGE) RS,250", price: 235, categoryId: "creams", categoryName: "Creams" },
      { id: 350, name: "CREAM TIBET COLD (SMALL) RS,180", price: 170, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "C" },
      { id: 351, name: "CREAM TIBET SNOW RS,230", price: 220, categoryId: "bodylotion", categoryName: "Body Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "C" },
      { id: 352, name: "CREAM WHITE GOLD (BLACK) RS,400", price: 290, categoryId: "creams", categoryName: "Creams" },
      { id: 353, name: "CREAM WHITE GOLD (ORANGE) RS,400", price: 290, categoryId: "creams", categoryName: "Creams" },
      { id: 354, name: "CREAM WHITE GOLD (PAPIYA) RS,300", price: 290, categoryId: "creams", categoryName: "Creams" },
      { id: 355, name: "DABUR AMLA HAIR OIL (DUBAI) 100ml RS,360", price: 330, categoryId: "haircare", categoryName: "Hair Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "D" },
      { id: 356, name: "DABUR AMLA HAIR OIL (DUBAI) 300ML RS,880", price: 795, categoryId: "haircare", categoryName: "Hair Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "D" },
      { id: 357, name: "DABUR AMLA HAIR OIL (DUBAI) 50ml RS,180", price: 170, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "D" },
      { id: 358, name: "DABUR RED PASTE (LARGE)", price: 430, categoryId: "creams", categoryName: "Creams" },
      { id: 359, name: "DABUR RED PASTE (SMALL) RP,250", price: 235, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "D" },
      { id: 360, name: "DENTONIC POWDER BOX (MEDIUM)", price: 75, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "D" },
      { id: 361, name: "DERMI COOL POWDER", price: 190, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "D" },
      { id: 362, name: "DETTOL PANI 50ML (SMALL) RP,250 (NON ORUNAL)", price: 220, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "D" },
      { id: 363, name: "DOLLAR GEL PEN (BLACK)", price: 40, categoryId: "stationary", categoryName: "Stationary" },
      { id: 364, name: "DOLLAR GEL PEN (BLUE)", price: 40, categoryId: "stationary", categoryName: "Stationary" },
      { id: 365, name: "DOLLAR GEL PEN (GREEN)", price: 40, categoryId: "stationary", categoryName: "Stationary" },
      { id: 366, name: "DOLLAR GEL PEN (RED)", price: 40, categoryId: "stationary", categoryName: "Stationary" },
      { id: 367, name: "DOLLAR PEN (CLIPPER) BLACK", price: 18, categoryId: "stationary", categoryName: "Stationary" },
      { id: 368, name: "DOLLAR PEN (CLIPPER) BLUE", price: 18, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "D" },
      { id: 369, name: "DOLLAR PEN (CLIPPER) BLUE (BP.1", price: 18, categoryId: "stationary", categoryName: "Stationary" },
      { id: 370, name: "DOLLAR PEN (CLIPPER) RED", price: 18, categoryId: "stationary", categoryName: "Stationary" },
      { id: 371, name: "DOLLAR POINTER (BLACK)", price: 30, categoryId: "stationary", categoryName: "Stationary" },
      { id: 372, name: "DOLLAR POINTER (BLUE)", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 373, name: "DOOZ SPRAY 14000", price: 1150, categoryId: "condemn", categoryName: "Condemn" },
      { id: 374, name: "DOOZ TESTER SMALL", price: 50, categoryId: "condemn", categoryName: "Condemn" },
      { id: 375, name: "DORCO RAZOR", price: 190, categoryId: "blades", categoryName: "Blades & Razers", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "D" },
      { id: 376, name: "DUERAX SPRAY", price: 250, categoryId: "condemn", categoryName: "Condemn" },
      { id: 377, name: "DUREX LUBE LARGE", price: 1050, categoryId: "condemn", categoryName: "Condemn" },
      { id: 378, name: "DUREX LUBE SMALL", price: 890, categoryId: "condemn", categoryName: "Condemn" },
      { id: 379, name: "ELFY JIMSA BOTTEL 20GM", price: 140, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "E" },
      { id: 380, name: "ELFY JIMSA BOX", price: 25, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "E" },
      { id: 381, name: "EMAMI 7 OILS IN ONE 100ML", price: 430, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 382, name: "EMAMI 7 OILS IN ONE 200ML", price: 730, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 383, name: "EMERGENCY LIGHT (LARGE)", price: 1200, categoryId: "others", categoryName: "Others" },
      { id: 384, name: "EMERGENCY LIGHT (MEDIUM)", price: 850, categoryId: "others", categoryName: "Others" },
      { id: 385, name: "EMERJANCY LIGHT (SMALL)", price: 650, categoryId: "others", categoryName: "Others" },
      { id: 386, name: "ENGLISH PRICKLY HEAT CREAM LARGE RS,270", price: 240, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "E" },
      { id: 387, name: "ERASER ORO", price: 7, categoryId: "stationary", categoryName: "Stationary" },
      { id: 388, name: "ERSER (RUBBER) PECE,72  JAR", price: 7, categoryId: "stationary", categoryName: "Stationary" },
      { id: 389, name: "EXTENSION LEAD (# 235)", price: 395, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "E" },
      { id: 390, name: "EXTENSION LEAD (# 809)", price: 325, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "E" },
      { id: 391, name: "EXTENSION LEAD (339) USB", price: 595, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "E" },
      { id: 392, name: "EXTENSION LEAD (LARGE) GOOD QUALITY", price: 650, categoryId: "others", categoryName: "Others" },
      { id: 393, name: "EXTENSION LEAD BUTTON WALI (ON/OFF)", price: 545, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "E" },
      { id: 394, name: "EXTENSION LEAD MEDIUM (EX QULAITY)", price: 750, categoryId: "others", categoryName: "Others" },
      { id: 395, name: "EXTENSION LEAD SMALL", price: 250, categoryId: "others", categoryName: "Others" },
      { id: 396, name: "EYE LINER MASKARA", price: 140, categoryId: "bleachfacial", categoryName: "Bleach & Facial" },
      { id: 397, name: "F & L BB CREAM 18g (MEDIUM) IMP", price: 590, categoryId: "creams", categoryName: "Creams" },
      { id: 398, name: "F & L BB CREAM 9g (SMALL) IMP", price: 350, categoryId: "creams", categoryName: "Creams" },
      { id: 399, name: "F & L M,V FACE WASH (SMALL) COMPANY RS.199", price: 190, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "F" },
      { id: 400, name: "F & L M,V JAR", price: 395, categoryId: "bodylotion", categoryName: "Body Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 401, name: "F & L M,V SASHAY RS,10", price: 9, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "F" },
      { id: 402, name: "F & L M,V SASHAY RS,50", price: 47, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "F" },
      { id: 403, name: "F & L M,V TUBE (SMALL) GLOW RS,170", price: 160, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
      { id: 404, name: "F & LM V FACE WASH (SMALL) COMPANY RS,199", price: 190, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 405, name: "F & LM V JAR", price: 370, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "F" },
      { id: 406, name: "F & LM V TUBE (SMALL) GLOW RS,170", price: 160, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 407, name: "FACE WASH ACNI-PLUS", price: 490, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
      { id: 408, name: "FACE WASH APRI COT SCRUB  ( X,L) 170g", price: 250, categoryId: "others", categoryName: "Others" },
      { id: 409, name: "FACE WASH APRI COT SCRUB  (LARGE) 110g", price: 190, categoryId: "others", categoryName: "Others" },
      { id: 410, name: "FACE WASH APRI COT SCRUB  (MEDIUM) 62g", price: 140, categoryId: "others", categoryName: "Others" },
      { id: 411, name: "FACE WASH B N B BRIGHTENING RICE", price: 640, categoryId: "others", categoryName: "Others" },
      { id: 412, name: "FACE WASH B N B CLEANSER", price: 640, categoryId: "others", categoryName: "Others" },
      { id: 413, name: "FACE WASH B N B RICE", price: 590, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "F" },
      { id: 414, name: "FACE WASH CLEAN & CLEAR (SMALL)", price: 320, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 415, name: "FACE WASH DOVE (LARGE) (BLUE)", price: 590, categoryId: "others", categoryName: "Others" },
      { id: 416, name: "FACE WASH DOVE (LARGE) (GREEN)", price: 590, categoryId: "others", categoryName: "Others" },
      { id: 417, name: "FACE WASH DOVE (LARGE) (PINK)", price: 0, categoryId: "others", categoryName: "Others" },
      { id: 418, name: "FACE WASH FAIR MENZ (MIX) RP,210", price: 195, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
      { id: 419, name: "FACE WASH GARNIER ( LARGE)  ACNO FIGHT RP,949", price: 835, categoryId: "others", categoryName: "Others" },
      { id: 420, name: "FACE WASH GARNIER (LARGE)  OIL CLEAR RS,949", price: 835, categoryId: "others", categoryName: "Others" },
      { id: 421, name: "FACE WASH GARNIER (LARGE)  POWER WHITE RS,949", price: 835, categoryId: "others", categoryName: "Others" },
      { id: 422, name: "FACE WASH GARNIER (LARGE) SAKURE WHITE", price: 690, categoryId: "others", categoryName: "Others" },
      { id: 423, name: "FACE WASH GARNIER (LARGE) TURBO LIGHT WHITE+OIL CONTROL", price: 890, categoryId: "others", categoryName: "Others" },
      { id: 424, name: "FACE WASH GARNIER (LARGE) WOMEN (NEEM) PURE ACTIVE RS,649", price: 590, categoryId: "others", categoryName: "Others" },
      { id: 425, name: "FACE WASH GARNIER (LARGE) WOMEN (VITAMAN C) RP,619", price: 570, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 426, name: "FACE WASH GARNIER (SMALL)  ACNO FIGHT RS,519", price: 470, categoryId: "others", categoryName: "Others" },
      { id: 427, name: "FACE WASH GARNIER (SMALL) OIL CLEAR RS,519", price: 470, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
      { id: 428, name: "FACE WASH GARNIER (SMALL) POWER WHITE RS,519", price: 470, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 429, name: "FACE WASH GARNIER (SMALL) WOMEN (NEEM) RS,369", price: 340, categoryId: "others", categoryName: "Others" },
      { id: 430, name: "FACE WASH GARNIER (SMALL) WOMEN VITAMAN C RS,369", price: 340, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
      { id: 431, name: "FACE WASH GOLDEN PEARL (ACNE SULOTION)", price: 230, categoryId: "others", categoryName: "Others" },
      { id: 432, name: "FACE WASH GOLDEN PEARL (BLUE) OIL CLEAR", price: 230, categoryId: "others", categoryName: "Others" },
      { id: 433, name: "FACE WASH GOLDEN PEARL (FLAWLESS SKIN)", price: 230, categoryId: "others", categoryName: "Others" },
      { id: 434, name: "FACE WASH GOLDEN PEARL (GLOW & WHITE)", price: 230, categoryId: "others", categoryName: "Others" },
      { id: 435, name: "FACE WASH GOLDEN PEARL (GREEN) HERBAL", price: 230, categoryId: "others", categoryName: "Others" },
      { id: 436, name: "FACE WASH GOLDEN PEARL (GREEN) LARGE HERBAL RS,450", price: 0, categoryId: "others", categoryName: "Others" },
      { id: 437, name: "FACE WASH GOLDEN PEARL (LIGHT & GLOW) SMALL", price: 230, categoryId: "others", categoryName: "Others" },
      { id: 438, name: "FACE WASH GOLDEN PEARL (LIGHT GLOW) LARGE", price: 450, categoryId: "others", categoryName: "Others" },
      { id: 439, name: "FACE WASH GOLDEN PEARL (NEEM) LARGE", price: 450, categoryId: "others", categoryName: "Others" },
      { id: 440, name: "FACE WASH GOLDEN PEARL (SMALL) MEN", price: 230, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
      { id: 441, name: "FACE WASH GOLDEN PEARL (SMALL) MIX", price: 230, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
      { id: 442, name: "FACE WASH GOLDEN PEARL (VITAMN C)", price: 230, categoryId: "others", categoryName: "Others" },
      { id: 443, name: "FACE WASH GOLDEN PEARL (WHITE BEAUTY)", price: 230, categoryId: "others", categoryName: "Others" },
      { id: 444, name: "FACE WASH GOLDEN PEARL DAILY FOAMING", price: 230, categoryId: "others", categoryName: "Others" },
      { id: 445, name: "FACE WASH GOLDEN PEARL DAILY FOAMING (LARGE)", price: 450, categoryId: "others", categoryName: "Others" },
      { id: 446, name: "FACE WASH GOLDEN PEARL LARGE (WHITE BEAUTY ) LARGE", price: 450, categoryId: "others", categoryName: "Others" },
      { id: 447, name: "FACE WASH GOLDEN PEARL MAN (SMALL) POWER", price: 230, categoryId: "others", categoryName: "Others" },
      { id: 448, name: "FACE WASH HIMALIYA (LARGE) NEEM DUBAI RS,510" , price: 460, categoryId: "others", categoryName: "Others" },
      { id: 449, name: "FACE WASH HIMALIYA (SMALL) DUBAI RS,310", price: 280, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 450, name: "FACE WASH JHALAK" , price: 180, categoryId: "others", categoryName: "Others" },
      { id: 451, name: "FACE WASH JUNSUI LARGE (BLACK)", price: 590, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
      { id: 452, name: "FACE WASH JUNSUI LARGE (BLUE)", price: 590, categoryId: "others", categoryName: "Others" },
      { id: 453, name: "FACE WASH JUNSUI LARGE (GREEN) NEEM", price: 590, categoryId: "others", categoryName: "Others" },
      { id: 454, name: "FACE WASH JUNSUI LARGE (ICE COOL)", price: 590, categoryId: "others", categoryName: "Others" },
      { id: 455, name: "FACE WASH JUNSUI LARGE (L,GREEN COOL)", price: 590, categoryId: "others", categoryName: "Others" },
      { id: 456, name: "FACE WASH JUNSUI LARGE (PINK)", price: 590, categoryId: "others", categoryName: "Others" },
      { id: 457, name: "FACE WASH JUNSUI LARGE (RED) PIMPLE FIGHTING", price: 590, categoryId: "others", categoryName: "Others" },
      { id: 458, name: "FACE WASH JUNSUI LARGE ORANGE", price: 0, categoryId: "others", categoryName: "Others" },
      { id: 459, name: "FACE WASH MAC ALEO VERA", price: 390, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
      { id: 460, name: "FACE WASH MAC BLACK CHARCOAL", price: 390, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 461, name: "FACE WASH MAC PINK", price: 390, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "F" },
      { id: 462, name: "FACE WASH MAC ACNE CLEAN", price: 390, categoryId: "others", categoryName: "Others" },
      { id: 463, name: "FACE WASH MAC BLUE", price: 390, categoryId: "others", categoryName: "Others" },
      { id: 464, name: "FACE WASH MAC PINK", price: 390, categoryId: "others", categoryName: "Others" },
      { id: 465, name: "FACE WASH MAC YELLOW", price: 390, categoryId: "others", categoryName: "Others" },
      { id: 466, name: "FACE WASH PARLEY BLACK RS,300", price: 270, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
      { id: 467, name: "FACE WASH PONDS (IMP) ACNE SOLUTION", price: 450, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 468, name: "FACE WASH PONDS (IMP) ACNE SOLUTION (SMALL)", price: 270, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "F" },
      { id: 469, name: "FACE WASH PONDS (IMP) BLACK (P O+PURITY)", price: 450, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 470, name: "FACE WASH PONDS (IMP) BLACK (P O+PURITY) (SMALL)", price: 270, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
      { id: 471, name: "FACE WASH PONDS (IMP) FLAWLESS WHITE", price: 590, categoryId: "others", categoryName: "Others" },
      { id: 472, name: "FACE WASH PONDS (IMP) SUN DULLNESS RE", price: 460, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
      { id: 473, name: "FACE WASH PONDS (IMP) WHITE BEAUTY (PINK)", price: 450, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 474, name: "FACE WASH PONDS (IMP) WHITE BEAUTY (SMALL)", price: 270, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 475, name: "FACE WASH PONDS (LARGE) COMPANY BLACK RP,490", price: 590, categoryId: "others", categoryName: "Others" },
      { id: 476, name: "FACE WASH PONDS (LARGE) COMPANY W,B RP,490", price: 450, categoryId: "others", categoryName: "Others" },
      { id: 477, name: "FACE WASH PONDS (SMALL) BLACK", price: 270, categoryId: "others", categoryName: "Others" },
      { id: 478, name: "FACE WASH PONDS (SMALL) PINK W,B (COMPANY) RS,300", price: 270, categoryId: "others", categoryName: "Others" },
      { id: 479, name: "FACE WASH PONDS MEN IMP ACNE SOLUTION (LARGE)", price: 590, categoryId: "others", categoryName: "Others" },
      { id: 480, name: "FACE WASH PONDS MEN IMP ENERGY CHARGE (SMALL)", price: 590, categoryId: "others", categoryName: "Others" },
      { id: 481, name: "FACE WASH PONDS MEN IMP LIGHTNING OIL CLEAR (LARGE) BLUE", price: 590, categoryId: "others", categoryName: "Others" },
      { id: 482, name: "FACE WASH PONDS MEN IMP POLLUTION OUT (LARGE)", price: 590, categoryId: "others", categoryName: "Others" },
      { id: 483, name: "FACE WASH PONDS MEN IMP POWER CLEAR (LARGE)", price: 590, categoryId: "others", categoryName: "Others" },
      { id: 484, name: "FACE WASH PONDS MEN IMP WHITE BOOST (LARGE)", price: 590, categoryId: "others", categoryName: "Others" },
      { id: 485, name: "FACE WASH RIVAJ LEMON ((LARGE)", price: 450, categoryId: "others", categoryName: "Others" },
      { id: 486, name: "FACE WASH RIVAJ NEEM (LARGE)", price: 450, categoryId: "others", categoryName: "Others" },
      { id: 487, name: "FACE WASH SAEED GHANI VITAMN C", price: 490, categoryId: "others", categoryName: "Others" },
      { id: 488, name: "FACE WASH SYED GHANI CHARCOAL", price: 490, categoryId: "others", categoryName: "Others" },
      { id: 489, name: "FACE WASH SYED GHANI GOAT MILK", price: 490, categoryId: "others", categoryName: "Others" },
      { id: 490, name: "FACE WASH Y,C (LARGE) BAMBOO CHARCOAL", price: 470, categoryId: "others", categoryName: "Others" },
      { id: 491, name: "FACE WASH Y,C (LARGE) BLACK (COW) MILK EXTRACT", price: 470, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
      { id: 492, name: "FACE WASH Y,C (LARGE) COCUMBER", price: 470, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "F" },
      { id: 493, name: "FACE WASH Y,C (LARGE) NEEM GREEN", price: 470, categoryId: "others", categoryName: "Others" },
      { id: 494, name: "FACE WASH Y,C (LARGE) YELLOW LEMON", price: 470, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "F" },
      { id: 495, name: "FACE WASH Y,C (LARGE) YELLOW LEMON", price: 470, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "F" },
      { id: 496, name: "FACE WASH Y,C (SMALL) BLACK (COW) MILK EXTRACT", price: 320, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "F" },
      { id: 497, name: "FACE WASH Y,C (SMALL) COCUMBER", price: 320, categoryId: "others", categoryName: "Others" },
      { id: 498, name: "FACE WASH Y,C (SMALL) GREEN TEA EXTRACT", price: 320, categoryId: "others", categoryName: "Others" },
      { id: 499, name: "FACE WASH Y,C (SMALL) NEEM GREEN", price: 320, categoryId: "others", categoryName: "Others" },
      { id: 500, name: "FACE WASH Y,C (SMALL) YELLOW LEMON", price: 320, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "F" },
      { id: 501, name: "FACE WASH Y,C (SMALL) YELLOW LEMON", price: 320, categoryId: "facewash", categoryName: "Face Wash", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "F" },
      { id: 502, name: "FEEDER (LARGE NIPPLE) LARGE", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 503, name: "FEEDER (LARGE NIPPLE) MEDIUM", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 504, name: "FEEDER GLASS LARGE", price: 680, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 505, name: "FEEDER GLASS MEDIUM", price: 650, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 506, name: "FEEDER GLASS SMALL", price: 580, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 507, name: "FEEDER MINI TREE (LARGE)", price: 490, categoryId: "others", categoryName: "Others" },
      { id: 508, name: "FEEDER MINI TREE (MEDIUM)", price: 470, categoryId: "others", categoryName: "Others" },
      { id: 509, name: "FEEDER MINI TREE (SMALL)", price: 390, categoryId: "others", categoryName: "Others" },
      { id: 510, name: "FEEDER PP (IMP) HANDAL LARGE", price: 320, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "F" },
      { id: 511, name: "FEEDER PP (IMP) HANDAL MEDIUM", price: 295, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "F" },
      { id: 512, name: "FEEDER PURE LOVE COLOR (LARGE)", price: 180, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "F" },
      { id: 513, name: "FORHANS HAIR TONIC 100ML (BLUE) RS,320", price: 310, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "F" },
      { id: 514, name: "FORHANS HAIR TONIC 100ML (RED) RS,320", price: 310, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 515, name: "FORHENS HAIR TONIC 200ml (RED) RP,550", price: 520, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 516, name: "GATS BY GEL (MEDIUM) MIX", price: 490, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 517, name: "GATS BY GEL (MEDIUM) RED HARD", price: 490, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "G" },
      { id: 518, name: "GATS BY GEL (SMALL) MIX", price: 390, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 519, name: "GELLEME FOAM (LARGE) MIX", price: 380, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 520, name: "GILLETTE BLUE 2 PLUS (GREEN)", price: 140, categoryId: "blades", categoryName: "Blades & Razers", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "G" },
      { id: 521, name: "GILLETTE FOAM 200ml (GREEN) MENTHOL MENS", price: 840, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "G" },
      { id: 522, name: "GILLETTE FOAM 200ml (MIX)", price: 840, categoryId: "shaving", categoryName: "Shaving" },
      { id: 523, name: "GILLETTE FOAM 200ml (RED) REGULER", price: 840, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "G" },
      { id: 524, name: "GILLETTE FOAMY (50gm) SMALL (MIX)", price: 445, categoryId: "shaving", categoryName: "Shaving" },
      { id: 525, name: "GILLETTE GEL (LARGE) MIX", price: 940, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "G" },
      { id: 526, name: "GILLETTE GEL (Small) MIX", price: 640, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "G" },
      { id: 527, name: "GLYCERINE", price: 105, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "G" },
      { id: 528, name: "GOLDEN PEARL SKIN POLISHING", price: 160, categoryId: "creams", categoryName: "Creams" },
      { id: 529, name: "GOLDEN PEARL URGENT FACIAL", price: 50, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "G" },
      { id: 530, name: "GOLDEN PEARL URGENT FESHAL (FRUIT)", price: 50, categoryId: "bleachfacial", categoryName: "Bleach & Facial" },
      { id: 531, name: "HAIR COLOUR SPRAY (MIX)", price: 300, categoryId: "haircolour", categoryName: "Hair Colour" },
      { id: 532, name: "HAND WASH DETTOL 250ml (MIX)", price: 190, categoryId: "general", categoryName: "General Items" },
      { id: 533, name: "HAND WASH DETTOL 600ml (MIX)", price: 250, categoryId: "general", categoryName: "General Items" },
      { id: 534, name: "HAPPY BIRTHDAY SPELLING (PINK)", price: 220, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "H" },
      { id: 535, name: "HASHMI SORMA RS,200", price: 190, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "H" },
      { id: 536, name: "HI LIGHTER", price: 70, categoryId: "stationary", categoryName: "Stationary" },
      { id: 537, name: "HUDA BEAUTY BLACK MASK SASHAY", price: 50, categoryId: "bleachfacial", categoryName: "Bleach & Facial" },
      { id: 538, name: "HUSSAIN MANJAN BOX (MEDIUM) RS,80", price: 75, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "H" },
      { id: 539, name: "INK BOTTEL DEER BOX (SMALL) BLACK", price: 50, categoryId: "stationary", categoryName: "Stationary" },
      { id: 540, name: "INK BOTTEL DOLLER BLUE (SMALL)", price: 50, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "I" },
      { id: 541, name: "INK PEN DOLLER", price: 70, categoryId: "stationary", categoryName: "Stationary" },
      { id: 542, name: "INK PEN PIANO CRYSTAL", price: 70, categoryId: "stationary", categoryName: "Stationary" },
      { id: 543, name: "INK REMOVER MARKER (ORO)", price: 40, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "I" },
      { id: 544, name: "INK REMOVER WHITENER", price: 70, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "I" },
      { id: 545, name: "J BABY BATH 200ML NEW PACKING", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 546, name: "J BABY GIFT PACK KIT", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 547, name: "J BABY KIT", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 548, name: "J BABY LINER", price: 50, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 549, name: "J BABY LOTION 100ml (COMPANY)", price: 490, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 550, name: "J BABY LOTION 200ml (IMP)", price: 690, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 551, name: "J BABY OIL 125ml (COMPANY)", price: 650, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "J" },
      { id: 552, name: "J BABY OIL 200ml (IMP)", price: 840, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 553, name: "J BABY OIL 50ml (COMPANY)", price: 320, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "J" },
      { id: 554, name: "J BABY PERFUME COLOGNE", price: 690, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 555, name: "J BABY PETROLIUM 100g (MIX)", price: 490, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 556, name: "J BABY PETROLIUM GELL (BLUE) SMALL", price: 490, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "J" },
      { id: 557, name: "J BABY POWDER 100g (MIX)", price: 590, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 558, name: "J BABY POWDER 200g (MIX)", price: 590, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 559, name: "J BABY SHAMPOO 100ml (COMPANY)", price: 320, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "J" },
      { id: 560, name: "J BABY SHAMPOO 200ml (COMPANY)", price: 590, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "J" },
      { id: 561, name: "J BABY SHAMPOO 300ml (COMPANY)", price: 750, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 562, name: "J BABY SHAMPOO 750ml (COMPANY) (PUMP)", price: 1550, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 563, name: "J BABY SOAP 100g MIX", price: 240, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 564, name: "J BABY SOAP 100g PINK", price: 240, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "J" },
      { id: 565, name: "J BABY SOAP 100g WHITE", price: 240, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "J" },
      { id: 566, name: "J BABY TOP-TO-TOE 100ML", price: 350, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 567, name: "J BABY WIPES CAP WALA (LARGE 84 PECE) GOOD QUALITY", price: 240, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 568, name: "J BABY WIPES WITH CAP 84 PECE (NON ORUNAL)", price: 220, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "J" },
      { id: 569, name: "KALA KOLA HAIR TONIC (LARGE) RS,500", price: 460, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 570, name: "KALA KOLA HAIR TONIC (SMALL) RS,300", price: 270, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 571, name: "KEHKSHAN MAHNDI (BLACK) RS,80", price: 70, categoryId: "others", categoryName: "Others" },
      { id: 572, name: "KEUNE COLOUR  (MIX)", price: 0, categoryId: "haircolour", categoryName: "Hair Colour" },
      { id: 573, name: "KEUNE POWDER", price: 0, categoryId: "haircolour", categoryName: "Hair Colour" },
      { id: 574, name: "KEUNE VOLIUM  (# 20)", price: 0, categoryId: "haircolour", categoryName: "Hair Colour" },
      { id: 575, name: "KEY CHAIN (MIX)", price: 0, categoryId: "others", categoryName: "Others" },
      { id: 576, name: "KING COIL BLAKI (LARGE)", price: 110, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "K" },
      { id: 577, name: "KING COIL GREEN (LARGE)", price: 110, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 578, name: "KING MAAT", price: 7, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 579, name: "KING MACHINE SET", price: 560, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 580, name: "KING MOSPEL", price: 130, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "K" },
      { id: 581, name: "KING RAT BOOK", price: 180, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "K" },
      { id: 582, name: "KING REFILL", price: 240, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 583, name: "KINGTOX SPRAY 300ml (SMALL)", price: 440, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 584, name: "KINGTOX SPRAY 400ml (MEDIUM)", price: 540, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 585, name: "KINGTOX SPRAY 600 (LARGE)", price: 740, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 586, name: "KIWI LIQUID POLISH (NATURAL)", price: 430, categoryId: "general", categoryName: "General Items" },
      { id: 587, name: "KIWI POLISH LIQUID (BLACK) RS,450", price: 430, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "K" },
      { id: 588, name: "KIWI POLISH LIQUID (BROWN) RS,450", price: 430, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "K" },
      { id: 589, name: "KOHE NOOR OIL (CHANBALI) RP,350", price: 335, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "K" },
      { id: 590, name: "KOOKER RUBBER LARGE", price: 130, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "K" },
      { id: 591, name: "KOOKER RUBBER LARGE EX QUALITY", price: 390, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "K" },
      { id: 592, name: "LASTIK BAREEK CHILD", price: 20, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "L" },
      { id: 593, name: "LASTIK CHORDA LADIES ROLL (LARGE)", price: 390, categoryId: "general", categoryName: "General Items" },
      { id: 594, name: "LASTIK CHORDA LADIES ROLL (MEDIUM) 25 YARD", price: 330, categoryId: "general", categoryName: "General Items" },
      { id: 595, name: "LASTIK CHORDA LADIES ROLL (SMALL)", price: 80, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "L" },
      { id: 596, name: "LASTIK CHORDA WHITE (LARGE)", price: 25, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "L" },
      { id: 597, name: "LASTIK DARME YNA WHITE 20 PECE", price: 25, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "L" },
      { id: 598, name: "LASTIK LADIES (WHITE)", price: 25, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "L" },
      { id: 599, name: "LIGHTER (ARCO GARARRI)", price: 30, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "L" },
      { id: 600, name: "LIGHTER (HEATER) 801", price: 0, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "L" },
      { id: 601, name: "LIGHTER (SADA TIK)", price: 0, categoryId: "general", categoryName: "General Items" },
      { id: 602, name: "LIGHTER (SADA TIK) 601", price: 840, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "L" },
      { id: 603, name: "LIGHTER CHOLAH (PUZZO)", price: 0, categoryId: "general", categoryName: "General Items" },
      { id: 604, name: "LIGHTER CHOLAH (RE FIL)", price: 0, categoryId: "general", categoryName: "General Items" },
      { id: 605, name: "LIGHTER CHOLAH FULL STEEL GUN", price: 0, categoryId: "general", categoryName: "General Items" },
      { id: 606, name: "LIGHTER CIGERATE GAS REFILL (RED)", price: 0, categoryId: "general", categoryName: "General Items" },
      { id: 607, name: "LIGHTER ELECTRIC ARC (USB TYPE C)", price: 0, categoryId: "general", categoryName: "General Items" },
      { id: 608, name: "LIP OIL POUCH 12 PCES", price: 40, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "L" },
      { id: 609, name: "LOCK BLACK 20mm", price: 70, categoryId: "lock", categoryName: "Lock" },
      { id: 610, name: "LOCK BLACK 25mm", price: 80, categoryId: "lock", categoryName: "Lock" },
      { id: 611, name: "LOCK BLACK 32mm", price: 140, categoryId: "lock", categoryName: "Lock" },
      { id: 612, name: "LOCK BLACK 38mm", price: 160, categoryId: "lock", categoryName: "Lock" },
      { id: 613, name: "LOCK BLACK 50mm", price: 260, categoryId: "lock", categoryName: "Lock" },
      { id: 614, name: "LOCK BLACK 63mm", price: 340, categoryId: "lock", categoryName: "Lock" },
      { id: 615, name: "LOCK FRONT KEY (LARGE) GOOD QULAITY", price: 680, categoryId: "lock", categoryName: "Lock" },
      { id: 616, name: "LOCK FRONT KEY (MEDIUM)", price: 520, categoryId: "lock", categoryName: "Lock" },
      { id: 617, name: "LOCK SILVER 40mm (WOHU)", price: 360, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "L" },
      { id: 618, name: "LOCK SILVER 50mm (WOHU)", price: 440, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "L" },
      { id: 619, name: "LOCK SILVER 60mm (WOHU)", price: 540, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "L" },
      { id: 620, name: "LOCK SILVER 70mm (WOHU)", price: 580, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "L" },
      { id: 621, name: "LOTION CARE (SMALL) RS,250", price: 230, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "L" },
      { id: 622, name: "LOTION ENCHANTEUR 100ML (SMALL) MIX", price: 460, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 623, name: "LOTION MOTHER CARE 115ML RS,450", price: 0, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 624, name: "LOTION MOTHER CARE 60ML RS,150 (WHITE)", price: 0, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 625, name: "LOTION NEXTON 125ML RP,499", price: 0, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 626, name: "LOTION NEXTON 65ML RP,299", price: 0, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 627, name: "LOTION NIVIA 100ML SMALL (MIX)", price: 509, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 628, name: "LOTION NIVIA 200ML (MIX)", price: 889, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 629, name: "LOTION NIVIA 400ML (MIX)", price: 0, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 630, name: "LOTION OLIVIA 110ml RS,220 (MOSTURIZING)", price: 180, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 631, name: "LOTION OLIVIA 110ml RS,220 (HONEY)", price: 180, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 632, name: "LOTION OLIVIA 220ml RS,310 (MOSTURIZING)", price: 280, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 633, name: "LOTION OLIVIA 220ml RS,310 (HONEY)", price: 280, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 634, name: "LOTION PONDS 100ml HONEY RS,350", price: 330, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 635, name: "LOTION PONDS 100ml RS,350", price: 330, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "L" },
      { id: 636, name: "LOTION PONDS 200ml RP,600", price: 555, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 637, name: "LOTION PONDS 65ml RS,240", price: 229, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 638, name: "LOTION PONDS WHITE BEAUTY 150ml CLEANSING MILK", price: 499, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 639, name: "LOTION SKIN WHITE (MIX) RS,320", price: 280, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 640, name: "LOTION SKIN WHITE HONEY GOAT MILK RS,320", price: 280, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 641, name: "LOTION VASELINE 100ml (IMP) COCA B", price: 339, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "L" },
      { id: 642, name: "LOTION VASELINE 100ml (IMP) GREEN", price: 339, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "L" },
      { id: 643, name: "LOTION VASELINE 100ml (IMP) pink", price: 339, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 644, name: "LOTION VASELINE 100ml (IMP) WHITE", price: 339, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "L" },
      { id: 645, name: "LOTION VASELINE 100ml (IMP) YELLOW", price: 339, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "L" },
      { id: 646, name: "LOTION VASELINE 200ml (IMP) white", price: 699, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 647, name: "LOTION VASELINE 200ml (IMP) COCO", price: 699, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "L" },
      { id: 648, name: "LOTION VASELINE 200ml (IMP) PINK", price: 635, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "L" },
      { id: 649, name: "LOTION VASELINE 200ml (IMP) GREEN", price: 635, categoryId: "bodylotion", categoryName: "Body Lotions" },
      { id: 650, name: "LUBNA,S WONDER WAX (LARGE)", price: 250, categoryId: "bleachfacial", categoryName: "Bleach & Facial" },
      { id: 651, name: "LUBNA,S WONDER WAX (SMALL)", price: 189, categoryId: "bleachfacial", categoryName: "Bleach & Facial" },
      { id: 652, name: "LUDE POLISH (BLACK) ORIJNAL", price: 99, categoryId: "general", categoryName: "General Items" },
      { id: 653, name: "LUDE POLISH (BLACK) ORUNAL", price: 99, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "L" },
      { id: 654, name: "LUDO (CARPET)", price: 449, categoryId: "sports", categoryName: "Sports" },
      { id: 655, name: "LUDO (LARGE) ", price: 199, categoryId: "sports", categoryName: "Sports" },
      { id: 656, name: "LUDO (XL) (GOOD QUALITY)", price: 289, categoryId: "toys", categoryName: "Toys", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "L" },
      { id: 657, name: "LUDO (LARGE) WOOD GOOD QULAITY", price: 489, categoryId: "sports", categoryName: "Sports" },
      { id: 658, name: "LUDO (MEDIUM)", price: 144, categoryId: "sports", categoryName: "Sports" },
      { id: 659, name: "LUDO (MEDIUM) WOOD GOOD QULAITY", price: 429, categoryId: "sports", categoryName: "Sports" },
      { id: 660, name: "LUDO (SMALL)", price: 89, categoryId: "sports", categoryName: "Sports" },
      { id: 661, name: "LUDO (SMALL) WOOD GOOD QULAITY", price: 299, categoryId: "sports", categoryName: "Sports" },
      { id: 662, name: "LUDO DANA CRYSTAL", price: 10, categoryId: "sports", categoryName: "Sports" },
      { id: 663, name: "LUDO DANA MILKY", price: 10, categoryId: "sports", categoryName: "Sports" },
      { id: 664, name: "LUX BODY WASH SOFT TUCH (BLUE) (IMP)", price: 449, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 665, name: "LUX BODY WASH SOFT TUCH (PINK) (IMP)", price: 449, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "L" },
      { id: 666, name: "LUX BODY WASH SOFT TUCH (PURPAL) (IMP)", price: 449, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "L" },
      { id: 667, name: "MAGIC DEPOXI BOX (SMALL)", price: 71, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "M" },
      { id: 668, name: "MARKER 604 (BLACK)", price: 20, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "M" },
      { id: 669, name: "MARKER 604 (BLUE)", price: 20, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "M" },
      { id: 670, name: "MARKER 605 (BLUE)", price: 20, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "M" },
      { id: 671, name: "MARKER 605 (BLACK)", price: 20, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "M" },
      { id: 672, name: "MARKER BOARD INK", price: 89, categoryId: "stationary", categoryName: "Stationary" },
      { id: 673, name: "MARKER BLACK BOARD (BLACK)", price: 69, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "M" },
      { id: 674, name: "MARKER BLACK BOARD (BLUE)", price: 69, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "M" },
      { id: 675, name: "MARKER PERMANENT (BLACK) DEER", price: 69, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "M" },
      { id: 676, name: "MARKER PERMANENT (BLUE) DEER", price: 69, categoryId: "stationary", categoryName: "Stationary" },
      { id: 677, name: "MARKER SADA (BLACK)", price: 15, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "M" },
      { id: 678, name: "MARKER SADA (BLUE)", price: 15, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "M" },
      { id: 679, name: "MARKER SADA DOLLER (BLUE)", price: 21, categoryId: "stationary", categoryName: "Stationary" },
      { id: 680, name: "MEDORA PERFUME (SMALL)", price: 315, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "M" },
      { id: 681, name: "MEHNDI ARAQ", price: 30, categoryId: "others", categoryName: "Others" },
      { id: 682, name: "MEHNDI CONE", price: 40, categoryId: "others", categoryName: "Others" },
      { id: 683, name: "MEHNDI CONE SINGHAR", price: 50, categoryId: "others", categoryName: "Others" },
      { id: 684, name: "ME-O CAT FOOD (FLUFFY)", price: 830, categoryId: "others", categoryName: "Others" },
      { id: 685, name: "METRO +7 AGAER BATTI (LARGE)", price: 120, categoryId: "others", categoryName: "Others" },
      { id: 686, name: "METRO AGHER BATTI (SMALL)", price: 50, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "M" },
      { id: 687, name: "MIRROR DOUBLE SIDED (LARGE)", price: 240, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "M" },
      { id: 688, name: "MIRROR DOUBLE SIDED (MEDIUM)", price: 189, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "M" },
      { id: 689, name: "MIRROR DOUBLE SIDED (SMALL)", price: 129, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "M" },
      { id: 690, name: "MOOV SPRAY", price: 849, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "M" },
      { id: 691, name: "MORTIEN COIL LARGE", price: 0, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 692, name: "MORTIEN MACHINE RP,560", price: 0, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 693, name: "MORTIEN RE FILL (30 NIGHT)", price: 239, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 694, name: "MORTIEN RE FILL (60 NIGHT)", price: 439, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 695, name: "MORTIEN SPRAY 300ml", price: 529, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "M" },
      { id: 696, name: "MORTIEN SPRAY 375ML", price: 699, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 697, name: "MORTIEN SPRAY 600ML LARGE", price: 899, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 698, name: "MOSPEL RS,350", price: 319, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "M" },
      { id: 699, name: "MOTHER CARE OIL (MEDIUM) RP,345", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 700, name: "MOTHER CARE OIL 125ML RP,480", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 701, name: "MOTHER CARE OIL 65ML", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 702, name: "MOUTH WASH COLGATE 250ML (IMP) MIX", price: 489, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 703, name: "MOUTH WASH LISTRIN (MIX)", price: 489, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 704, name: "MOUTH WASH OREL-B", price: 489, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 705, name: "MOUTH WASH SENSODYNE (MIX)", price: 539, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 706, name: "MULTANI MUTTI JAR", price: 80, categoryId: "bleachfacial", categoryName: "Bleach & Facial" },
      { id: 707, name: "MULTANI MUTTI PCS 24", price: 20, categoryId: "bleachfacial", categoryName: "Bleach & Facial" },
      { id: 708, name: "MUNDIAL OLIVE OIL 175ML", price: 579, categoryId: "others", categoryName: "Others" },
      { id: 709, name: "NAIL CUTTER 555 (LARGE)", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 710, name: "NAIL CUTTER AKAI (JAPANI ORIGNAL) (LARGE) JAPANI", price: 799, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 711, name: "NAIL CUTTER AKAI (JAPANI ORIGNAL) (MEDIUM) JAPANI", price: 749, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 712, name: "NAIL CUTTER MINI", price: 60, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 713, name: "NAIL CUTTER V9", price: 130, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "N" },
      { id: 714, name: "NAIL REMOVER", price: 70, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 715, name: "NAIR HAIR REMOVAL SPRAY (MIX)", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 716, name: "NALKI (BLACK)", price: 15, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "N" },
      { id: 717, name: "NALKI (WHITE)", price: 15, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "N" },
      { id: 718, name: "NEXTON BABY COLONGE BLUE", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 719, name: "NEXTON BABY KIT MEDIUM", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 720, name: "NEXTON BABY KIT SMALL", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 721, name: "NEXTON BABY LOTION 125ML RP,525", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 722, name: "NEXTON BABY LOTION 250ML", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 723, name: "NEXTON BABY LOTION 65ML RP,315", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 724, name: "NEXTON BABY POWDER 100g RP,275", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 725, name: "NEXTON BABY POWDER 200g RP,430", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
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
      { id: 736, name: "NITRO HAIR WAX", price:420, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 737, name: "NOVA GOLD HAIR SPRAY (LARGE)", price: 595, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 738, name: "NOVA GOLD HAIR SPRAY (SMALL) (COPY)", price: 375, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "N" },
      { id: 739, name: "PAPER COPY ENGLISH RS,100", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 740, name: "PAPER COPY ENGLISH RS,150", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 741, name: "PAPER COPY ENGLISH RS,200", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 742, name: "PAPER COPY ENGLISH RS,300", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 743, name: "PAPER COPY MATH RS,100", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 744, name: "PAPER COPY MATH RS,150", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 745, name: "PAPER COPY MATH RS,200", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 746, name: "PAPER COPY NARROW RS,100", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 747, name: "PAPER COPY NARROW RS,150", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 748, name: "PAPER COPY NARROW RS,200", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 749, name: "PAPER COPY NARROW RS,300", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 750, name: "PAPER COPY URDU RS,100", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 751, name: "PAPER COPY URDU RS,150", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 752, name: "PAPER COPY URDU RS,200", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 753, name: "PAPER COPY URDU RS,300", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 754, name: "PARACHUTE COCONUT OIL (LARGE) ORIGINAL", price: 989, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 755, name: "PARACHUTE COCONUT OIL (LARGE) HEMANI", price: 889, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 756, name: "PARACHUTE COCONUT OIL (MEDIUM) HEMANI", price: 489, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 757, name: "PARACHUTE COCONUT OIL (MEDIUM) ORIGINAL", price: 589, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 758, name: "PARACHUTE COCONUT OIL (SMALL) HEMANI", price: 269, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 759, name: "PARACHUTE COCONUT OIL (SMALL) ORIJNAL", price: 299, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 760, name: "PARTY PACK TISSUE ROSS PETAL (PINK) RP,250", price: 229, categoryId: "general", categoryName: "General Items" },
      { id: 761, name: "PARTY PACK TISSUE ROSS PETAL (WHITE) RP,275", price:249, categoryId: "general", categoryName: "General Items" },
      { id: 762, name: "PARTY POPPER (MEDIUM)", price: 129, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 763, name: "PARTY POPPER (SMALL)", price: 89, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 764, name: "PASTE CHILD (MIX) RS,180", price: 169, categoryId: "others", categoryName: "Others" },
      { id: 765, name: "PASTE CHILD KODOMO (MIX)", price: 199, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 766, name: "PASTE CLOSE UP (IMP) LARGE GREEN", price: 409, categoryId: "others", categoryName: "Others" },
      { id: 767, name: "PASTE CLOSE UP (IMP) LARGE RED", price: 409, categoryId: "others", categoryName: "Others" },
      { id: 768, name: "PASTE CLOSE UP (IMP) XL BLUE (ICY WHITE)", price: 449, categoryId: "others", categoryName: "Others" },
      { id: 769, name: "PASTE CLOSE UP (SMALL) GREEN", price: 199, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 770, name: "PASTE CLOSE UP (SMALL) GREEN", price: 199, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 771, name: "PASTE COLGATE 100g HERBAL RS,220", price: 205, categoryId: "others", categoryName: "Others" },
      { id: 772, name: "PASTE COLGATE 100g SADA RS,230", price: 214, categoryId: "others", categoryName: "Others" },
      { id: 773, name: "PASTE COLGATE 125g MAX FRESH (GREEN) RS,325", price: 310, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 774, name: "PASTE COLGATE 125g MAX FRESH (BLUE) RS,325", price:310, categoryId: "others", categoryName: "Others" },
      { id: 775, name: "PASTE COLGATE 125g MAX FRESH (RED) RS,325", price: 310, categoryId: "personalcare", categoryName: "Personal Care", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 776, name: "PASTE COLGATE 150g HERBAL RS,330", price: 309, categoryId: "others", categoryName: "Others" },
      { id: 777, name: "PASTE COLGATE 200g HERBAL RS,420", price: 397, categoryId: "others", categoryName: "Others" },
      { id: 778, name: "PASTE COLGATE 200g SADA RS,430", price: 405, categoryId: "others", categoryName: "Others" },
      { id: 779, name: "PASTE COLGATE 20g HERBAL RS,50", price: 46, categoryId: "others", categoryName: "Others" },
      { id: 780, name: "PASTE COLGATE 20g SADA RS,50", price: 46, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 781, name: "PASTE COLGATE 40g SADA RS,75", price: 69, categoryId: "others", categoryName: "Others" },
      { id: 782, name: "PASTE COLGATE 45g HERBAL RS,75", price: 69, categoryId: "others", categoryName: "Others" },
      { id: 783, name: "PASTE COLGATE 75g HERBAL RS,180", price: 169, categoryId: "others", categoryName: "Others" },
      { id: 784, name: "PASTE COLGATE 75g SADA RS,190", price: 179, categoryId: "others", categoryName: "Others" },
      { id: 785, name: "PASTE COLGATE 75g MAX FRESH RS,220 (GREEN)", price: 209, categoryId: "others", categoryName: "Others" },
      { id: 786, name: "PASTE COLGATE 75g MAX FRESH RS,220 (RED)", price: 209, categoryId: "others", categoryName: "Others" },
      { id: 787, name: "PASTE COLGATE 75g MAX FRESH RS,220 (BLUE)", price: 209, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 788, name: "PASTE DOCTOR RS,110", price: 96, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 789, name: "PASTE DOCTOR RS,220", price: 199, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 790, name: "PASTE ENGLISH SMALL RS,140", price: 125, categoryId: "others", categoryName: "Others" },
      { id: 791, name: "PASTE FORHENS (LARGE) RS,300", price: 285, categoryId: "others", categoryName: "Others" },
      { id: 792, name: "PASTE FORHENS (SMALL) RS,180", price: 169, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 793, name: "PASTE MEDICAM 35GM RS,120", price: 109, categoryId: "others", categoryName: "Others" },
      { id: 794, name: "PASTE MEDICAM 65GM RS,250", price: 224, categoryId: "others", categoryName: "Others" },
      { id: 795, name: "PASTE MEDICAM 90GM RS,320", price: 289, categoryId: "others", categoryName: "Others" },
      { id: 796, name: "PASTE PARODONTAX 50g RS,250", price: 235, categoryId: "others", categoryName: "Others" },
      { id: 797, name: "PASTE PARODONTAX 100g RS,400", price: 375, categoryId: "others", categoryName: "Others" },
      { id: 798, name: "PASTE SENSODYNE 100g (FLUORIDE) RS,450", price: 429, categoryId: "others", categoryName: "Others" },
      { id: 799, name: "PASTE SENSODYNE 100g (ORIGINAL) RS,450", price: 429, categoryId: "others", categoryName: "Others" },
      { id: 800, name: "PASTE SENSODYNE 100g (RAPID ACTION) RS,545", price: 519, categoryId: "others", categoryName: "Others" },
      { id: 801, name: "PASTE SENSODYNE 30g (COMPLETE PROTECTION +) RS,165", price: 155, categoryId: "others", categoryName: "Others" },
      { id: 802, name: "PASTE SENSODYNE 30g (RAPID ACTION) RS,165", price: 154, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 803, name: "PASTE SENSODYNE 30g (RAPID ACTION) RS,165", price: 154, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 804, name: "PASTE SENSODYNE 70g (FLUORIDE) RS,380", price: 354, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 805, name: "PASTE SENSODYNE 70g (ORIGINAL) RS,380", price: 354, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
      { id: 806, name: "PASTE SENSODYNE 70g (RAPID ACTION) RS,420", price: 399, categoryId: "toothpaste", categoryName: "Toothpaste", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 807, name: "PASTE SPARKLE RS,105", price: 99, categoryId: "others", categoryName: "Others" },
      { id: 808, name: "PASTE SPARKLE RS,180", price: 170, categoryId: "others", categoryName: "Others" },
      { id: 809, name: "PEN (BLUE SIGNATURE) BLACK", price: 17, categoryId: "stationary", categoryName: "Stationary" },
      { id: 810, name: "PEN (BLUE SIGNATURE) BLUE", price: 17, categoryId: "stationary", categoryName: "Stationary" },
      { id: 811, name: "PEN DOLLAR S P 10", price: 70, categoryId: "stationary", categoryName: "Stationary" },
      { id: 812, name: "PEN PIANO (BLACK) GRIPER 0.8MM", price: 20, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 813, name: "PEN PIANO (BLUE) GRIPER 0.8MM", price: 20, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 814, name: "PEN PIANO (BLUE) GRIPER 0.8MM", price: 20, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 815, name: "PEN PIANO OLD YELLOW", price: 17, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 816, name: "PENCIL GOLDFISH ", price: 19, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
      { id: 817, name: "PENCIL MY DOLLAR", price: 19, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 818, name: "PENCIL ORO ", price: 19, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 819, name: "PERFUME ALISHA (GOLD)", price: 1590, categoryId: "perfumes", categoryName: "Perfumes" },
      { id: 820, name: "PERFUME ALISHA (NAVY)", price: 1590, categoryId: "perfumes", categoryName: "Perfumes" },
      { id: 821, name: "PERFUME ALISHA (ROSE)", price: 1590, categoryId: "perfumes", categoryName: "Perfumes" },
      { id: 822, name: "PERFUME ASEEL", price: 1790, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 823, name: "PERFUME DELYCIA (MEDIUM) BEUETY RS,650", price: 619, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 824, name: "PERFUME DELYCIA (MEDIUM) CHECK RS,650", price: 619, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 825, name: "PERFUME DELYCIA (SMALL) BEAUTY RS,350", price: 325, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "P" },
      { id: 826, name: "PERFUME DELYCIA (SMALL) CHECK RS,350", price: 325, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 827, name: "PERFUME DELYCIA (SMALL) CHECK RS,350", price: 325, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 828, name: "PERFUME DO IT (ORIJNAL)", price: 1790, categoryId: "perfumes", categoryName: "Perfumes" },
      { id: 829, name: "PERFUME EVERY ONE", price: 1690, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 830, name: "PERFUME FOR EVER", price: 790, categoryId: "perfumes", categoryName: "Perfumes" },
      { id: 831, name: "PERFUME GAMBIT", price: 790, categoryId: "perfumes", categoryName: "Perfumes" },
      { id: 832, name: "PERFUME HAVOC (DUBAI) GOLDEN", price: 2140, categoryId: "perfumes", categoryName: "Perfumes" },
      { id: 833, name: "PERFUME HAVOC (DUBAI) SILVER", price: 2140, categoryId: "perfumes", categoryName: "Perfumes" },
      { id: 834, name: "PERFUME MARCO POLO (MIX)", price: 590, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 835, name: "PERFUME MEDORA (MEDIUM) BLUE RS,650", price: 619, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 836, name: "PERFUME MEDORA (MEDIUM) GREEN RS,650", price: 619, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 837, name: "PERFUME MEDORA (SMALL) BLUE RS,350", price: 325, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 838, name: "PERFUME MEDORA (SMALL) GREEN RS,350", price: 325, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "P" },
      { id: 839, name: "PERFUME MEDORA (SMALL) RED RS,350", price: 325, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "P" },
      { id: 840, name: "PERFUME MEDORA (SMALL) SHEDOW RS,350", price: 325, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 841, name: "PERFUME MUTUAL LOVE (GOLD)", price: 390, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 842, name: "PERFUME MUTUAL LOVE (PINK)", price: 390, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 843, name: "PERFUME MUTUAL LOVE (RED)", price: 390, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
      { id: 844, name: "PERFUME ONE MAN SHOW ORIGNAL", price: 2340, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "P" },
      { id: 845, name: "PERFUME PENCIL (MEN + W,M) J", price: 140, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 846, name: "PERFUME RASSASI BLUE LADY", price: 2440, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 847, name: "PERFUME RASSASI ROMANCE (WOMAN)", price: 2480, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 848, name: "PERFUME RASSASI SECRET", price: 2530, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 849, name: "PERFUME ROYAL MARRIAGE (MIX)", price: 2480, categoryId: "perfumes", categoryName: "Perfumes" },
      { id: 850, name: "PERFUME SHALIS MEN (LARGE)", price: 3650, categoryId: "perfumes", categoryName: "Perfumes" },
      { id: 851, name: "PERFUME SHALIS MEN (SMALL)", price: 2690, categoryId: "perfumes", categoryName: "Perfumes" },
      { id: 852, name: "PERFUME SHALIS WOMEN (LARGE)", price: 3650, categoryId: "perfumes", categoryName: "Perfumes" },
      { id: 853, name: "PERFUME SHALIS WOMEN (SMALL)", price: 2690, categoryId: "perfumes", categoryName: "Perfumes" },
      { id: 854, name: "POWDER BERG (LARGE) RS,380", price: 290, categoryId: "powders", categoryName: "Powders" },
      { id: 855, name: "POWDER BERG (SMALL) RS,220", price: 180, categoryId: "powders", categoryName: "Powders" },
      { id: 856, name: "POWDER BLACK BEAUTY (LARGE) RS,450", price: 410, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 857, name: "POWDER BLACK BEAUTY (SMALL) RP,220", price: 195, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
      { id: 858, name: "POWDER BLACK CAT (LARGE) RS,480", price: 430, categoryId: "powders", categoryName: "Powders" },
      { id: 859, name: "POWDER BLACK CAT (SMALL) RS,250", price: 210, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "P" },
      { id: 860, name: "POWDER BLUE LADY (LARGE)  DOIT", price: 260, categoryId: "powders", categoryName: "Powders" },
      { id: 861, name: "POWDER COOL COOL RS,210", price: 170, categoryId: "powders", categoryName: "Powders" },
      { id: 862, name: "POWDER DENTONIC BOX 100GM (MEDIUM) RS,75", price: 0, categoryId: "powders", categoryName: "Powders" },
      { id: 863, name: "POWDER DENTONIC BOX 200GM (LARGE) RS,130", price: 0, categoryId: "powders", categoryName: "Powders" },
      { id: 864, name: "POWDER EDEN ROCK (LARGE) RS,310", price: 228, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 865, name: "POWDER EDEN ROCK (SMALL) RS,210", price: 149, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 866, name: "POWDER ENCHANTEUR 125g (PERPAL) M", price: 479, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "P" },
      { id: 867, name: "POWDER ENCHANTEUR 125g (PINK) M", price: 479, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 868, name: "POWDER ENCHANTEUR 125g (ROSE) M", price: 479, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 869, name: "POWDER ENCHANTEUR 125g (YELLOW) M", price: 479, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "P" },
      { id: 870, name: "POWDER ENGLISH PRICKLY HEAT LARGE", price: 390, categoryId: "powders", categoryName: "Powders" },
      { id: 871, name: "POWDER ENGLISH PRICKLY HEAT SMALL", price: 239, categoryId: "powders", categoryName: "Powders" },
      { id: 872, name: "POWDER MEDORA (LARGE) (JOY) RS,480", price: 440, categoryId: "powders", categoryName: "Powders" },
      { id: 873, name: "POWDER MEDORA (SMALL) (JOY) RS,230", price: 210, categoryId: "powders", categoryName: "Powders" },
      { id: 874, name: "POWDER MEDORA (SMALL) (MIX) RS,230", price: 210, categoryId: "powders", categoryName: "Powders" },
      { id: 875, name: "POWDER MOTHER CARE GO-RASH 150g SMALL RS,400", price: 360, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "P" },
      { id: 876, name: "POWDER MOTHER CARE GO-RASH 250g LARGE RS,550", price: 499, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "P" },
      { id: 877, name: "POWDER TIBET (LARGE) RS,580", price: 540, categoryId: "powders", categoryName: "Powders" },
      { id: 878, name: "POWDER TIBET (SMALL) RS,190", price: 179, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "P" },
      { id: 879, name: "QANCHI MEDIUM", price: 179, categoryId: "general", categoryName: "General Items" },
      { id: 880, name: "QANCHI SMALL", price: 119, categoryId: "general", categoryName: "General Items" },
     { id: 881, name: "RAZER DARCO", price: 199, categoryId: "blades", categoryName: "Blades & Razers" },
      { id: 882, name: "RAZER FEMINA PINK", price: 40, categoryId: "blades", categoryName: "Blades & Razers" },
      { id: 883, name: "RAZER TREET HYGIENE", price: 45, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "R" },
      { id: 884, name: "RAZER TRIM", price: 59, categoryId: "shaving", categoryName: "Shaving & Blades", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "R" },
      { id: 885, name: "REGISTER (ENGLISH) RS,100", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 886, name: "REGISTER (ENGLISH) RS,150", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 887, name: "REGISTER (ENGLISH) RS,200", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 888, name: "REGISTER (ENGLISH) RS,300", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 889, name: "REGISTER (NARROW) RS 200", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 890, name: "REGISTER (NARROW) RS,150", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 891, name: "REGISTER (NARROW)RS 300", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 892, name: "REGISTER (NARROW)RS 400", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 893, name: "REGISTER (URDU) RS 100", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 894, name: "REGISTER (URDU) RS,150", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 895, name: "REGISTER (URDU) RS,200", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 896, name: "REGISTER (URDU) RS,300", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 897, name: "REGISTER (URDU) RS,400", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 898, name: "REGISTER (URDU+MATH+NARROW) RS,100", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 899, name: "REGISTER (URDU+MATH+NARROW) RS,150", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 900, name: "REGISTER (URDU+MATH+NARROW) RS,200", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 901, name: "REGISTER (URDU+MATH+NARROW) RS,300", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 902, name: "REGISTER MATH RS 100", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 903, name: "REGISTER MATH RS 200", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 904, name: "REGISTER MATH RS,150", price: 0, categoryId: "stationary", categoryName: "Stationary" },
      { id: 905, name: "ROCKET (SET) FOR PLAYING (EXECLENT QUALITY)", price: 1450, categoryId: "sports", categoryName: "Sports" },
      { id: 906, name: "ROCKET (SET) FOR PLAYING (GOOD QUALITY)", price: 950, categoryId: "sports", categoryName: "Sports" },
      { id: 907, name: "ROCKET (SET) FOR PLAYING (MEDIUM QUALITY)", price: 750, categoryId: "sports", categoryName: "Sports" },
      { id: 908, name: "ROLL ON ENCHENTER (MIX) MAN", price: 459, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 909, name: "ROLL ON ENCHENTER (MIX) WOMEN", price: 459, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 910, name: "ROLL ON FA (GREEN)", price: 429, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "R" },
      { id: 911, name: "ROLL ON FA (MIX)", price: 429, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 912, name: "ROLL ON FA (MYSTIC MOMENT)", price: 429, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "R" },
      { id: 913, name: "ROLL ON FA (PINK) TARANCEPERNT", price: 429, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "R" },
      { id: 914, name: "ROLL ON NIVIA (MIX)", price: 499, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 915, name: "ROLL ON NIVIA (WOMEN)", price: 499, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "R" },
      { id: 916, name: "ROLL ON NIVIA (WOMEN)", price: 499, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "R" },
      { id: 917, name: "ROLL ON YARDLEY MIX", price: 499, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 918, name: "ROOM SPRAY  DO IT", price: 239, categoryId: "general", categoryName: "General Items" },
      { id: 919, name: "ROOM SPRAY (FRESH FARGNANCE) MIX", price: 269, categoryId: "general", categoryName: "General Items" },
      { id: 920, name: "ROOM SPRAY (IMP) DARHAM", price: 239, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "R" },
      { id: 921, name: "ROOM SPRAY (IMP) MIX", price: 239, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "R" },
      { id: 922, name: "ROOM SPRAY FREY (MIX)", price: 279, categoryId: "general", categoryName: "General Items" },
      { id: 923, name: "ROOM SPRAY NEW ( T ) MIX", price: 239, categoryId: "general", categoryName: "General Items" },
      { id: 924, name: "ROOM SPRAY NEW ( T ) MIX (1 EACH)", price: 239, categoryId: "deo", categoryName: "Deodorants & Talcum", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "R" },
      { id: 925, name: "ROOM SPRAY TOPIC (MIX)", price: 239, categoryId: "general", categoryName: "General Items" },
      { id: 926, name: "ROSS PETAL TISSUE ROLL MAXOB", price: 119, categoryId: "general", categoryName: "General Items" },
      { id: 927, name: "SABALON SPRAY (PK)", price: 419, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 928, name: "SABALON SPRAY (SMALL)", price: 299, categoryId: "perfume", categoryName: "Perfumes & Body Spray", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 929, name: "SAFETY BOX UNIVERSAL RS,10", price: 10, categoryId: "blades", categoryName: "Blades & Razers" },
      { id: 930, name: "SAFETY PIN (LARGE)", price: 30, categoryId: "blades", categoryName: "Blades & Razers" },
      { id: 931, name: "SAFETY PIN (MEDIUM)", price: 20, categoryId: "blades", categoryName: "Blades & Razers" },
      { id: 932, name: "SAMAD BOND BOX (SMALL)", price: 130, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 933, name: "SAVOLI OIL 100ml", price: 590, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 934, name: "SCALE ORO LARGE", price: 59, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 935, name: "SCALE ORO SMALL", price: 35, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 936, name: "SCISSOR STEEL LARGE", price: 439, categoryId: "general", categoryName: "General Items" },
      { id: 937, name: "SCISSOR STEEL MEDIUM", price: 329, categoryId: "general", categoryName: "General Items" },
      { id: 938, name: "SCISSOR STEEL MINI", price: 129, categoryId: "general", categoryName: "General Items" },
      { id: 939, name: "SCISSOR STEEL SMALL", price: 109, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 940, name: "SERUM AJOOBA", price: 89, categoryId: "creams", categoryName: "Creams" },
      { id: 941, name: "SERUM BIO COSS", price: 89, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 942, name: "SERUM DERMA PLUS", price: 89, categoryId: "creams", categoryName: "Creams" },
      { id: 943, name: "SERUM FACE LARGE", price: 99, categoryId: "creams", categoryName: "Creams" },
      { id: 944, name: "SERUM FAIZA (LARGE)", price: 109, categoryId: "creams", categoryName: "Creams" },
      { id: 945, name: "SERUM GOLDEN PEARL (GOLDEN)", price: 105, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 946, name: "SERUM JHALAK", price: 89, categoryId: "creams", categoryName: "Creams" },
      { id: 947, name: "SERUM SANADAL", price: 89, categoryId: "creams", categoryName: "Creams" },
      { id: 948, name: "SET WET GEL (MIX)", price: 419, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 949, name: "SHAMPOO BIO AMLA FARVAL ORIJNAL RS,700", price: 590, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 950, name: "SHAMPOO BIO AMLA FARVEL ORIJNAL RS,340", price: 295, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 951, name: "SHAMPOO BIO AMLA FARVEL ORIJNAL RS,500", price: 430, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 952, name: "SHAMPOO BIO AMLA FARVEL ORUNAL RS,180", price: 145, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 953, name: "SHAMPOO CLEAR 200ml  (MEN) BLUE RS,499", price: 479, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 954, name: "SHAMPOO CLEAR 200ml (WOMEN) WHITE RS,499", price: 479, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 955, name: "SHAMPOO CLEAR 400ml (MEN) BLUE RS,830", price: 789, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 956, name: "SHAMPOO CLEAR 400ml (WOMEN) WHITE RS,830", price: 789, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 957, name: "SHAMPOO COLOUR LICHEN SASHAY (BROWN)", price: 70, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 958, name: "SHAMPOO DOVE 175ml (GOLDAN) DAILY MOSTURE RS,520", price: 495, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 959, name: "SHAMPOO DOVE 175ML (HAIR FALL) RS,520", price: 495, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 960, name: "SHAMPOO DOVE 175ml (INTENSIVE REPEIR) RS,520", price: 495, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 961, name: "SHAMPOO DOVE 175ml (L, BLUE) RS,520", price: 495, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 962, name: "SHAMPOO DOVE 175ml (MIX) RS,520", price: 495, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 963, name: "SHAMPOO DOVE 400ml (MIX) RS,940", price: 879, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
      { id: 964, name: "SHAMPOO ENGLISH ANTI LICE (LARGE) RS,370", price: 350, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 965, name: "SHAMPOO ENGLISH ANTI LICE (MEDIUM) RS,240", price: 225, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 966, name: "SHAMPOO ENGLISH ANTI LICE (SMALL) RS,170", price: 159, categoryId: "shampoo", categoryName: "Shampoo & Conditioner", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 967, name: "SHAMPOO H & S 200ml (MIX) RS,470", price: 449, categoryId: "shampoo", categoryName: "Shampoo & Conditioner", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 968, name: "SHAMPOO H & S 200ml (ORANG) RS,470", price: 449, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 969, name: "SHAMPOO H & S 200ml CLASSIC CLEAN (BLUE) RS,470", price: 449, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
      { id: 970, name: "SHAMPOO H & S 400ml (MIX) RS,800", price: 779, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 971, name: "SHAMPOO LIFE BOY 100ml (GREEN) RS,200", price: 189, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 972, name: "SHAMPOO LIFE BOY 100ml (ONION) RP,200", price: 189, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 973, name: "SHAMPOO LIFE BOY 200ml (GREEN) RS,320", price: 299, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 974, name: "SHAMPOO LIFE BOY 200ml (YELLOW) RS,320", price: 299, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 975, name: "SHAMPOO LIFE BOY 400ml (GREEN) RS,620", price: 589, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 976, name: "SHAMPOO LIFE BOY 400ml (GREEN) RS,620", price: 589, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 977, name: "SHAMPOO LIFE BOY 400ml (YELLOW) RS,620", price: 589, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 978, name: "SHAMPOO LOREAL LARGE (DREAM LONG) RESTORING RS930", price: 849,categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 979, name: "SHAMPOO LOREAL LARGE (GOLDEN) 6 OIL NOURISH.RS,930", price: 849,categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 980, name: "SHAMPOO LOREAL LARGE (HYALURON MOISTURE) RS1050price: 949",categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 981, name: "SHAMPOO LOREAL LARGE (PP) KERATIN STRAIT 72 H RS,930 price: 849", categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 982, name: "SHAMPOO LOREAL LARGE (RED) COLOUR PROTECT RP,930 price: 849", categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 983, name: "SHAMPOO LOREAL LARGE (WHITE) TOTAL REPAIR RS,930 price: 849", categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 984, name: "SHAMPOO LOREAL MEDIUM (DREAM LONG) RESTORING RS,530", price:489,categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 985, name: "SHAMPOO LOREAL MEDIUM (GOLDEN) 6 OIL NOURISH RS,530", price: 489,categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 986, name: "SHAMPOO LOREAL MEDIUM (HYALURON MOISTURE) RS,600", price: 559, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 987, name: "SHAMPOO LOREAL MEDIUM (PP) KER STRAIGHT 72 H RS,530", price: 489,categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 988, name: "SHAMPOO LOREAL MEDIUM (RED) COLOUR PROTECT RS,530", price: 489, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 989, name: "SHAMPOO LOREAL MEDIUM (WHITE) TOTAL REPAIR RS,530", price: 489,categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 990, name: "SHAMPOO MECLAY (MEDIUM) (PP)", price: 360, categoryId: "shampoo", categoryName: "Shampoo & Conditioner", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 991, name: "SHAMPOO MECLAY (MEDIUM) BLACK", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 992, name: "SHAMPOO MECLAY (MEDIUM) BLUE", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 993, name: "SHAMPOO MECLAY (MEDIUM) GOLDEN", price: 360,categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 994, name: "SHAMPOO MECLAY (MEDIUM) GREEN", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 995, name: "SHAMPOO MECLAY (MEDIUM) ORANGE", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 996, name: "SHAMPOO MECLAY (MEDIUM) PINK", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 997, name: "SHAMPOO MECLAY (MEDIUM) PP", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 998, name: "SHAMPOO MECLAY (MEDIUM) RED COLOUR PROTECT", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 999, name: "SHAMPOO MECLAY (MEDIUM) WHITE", price: 360, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 1000, name: "SHAMPOO MECLAY (MEDIUM) YELLOW", price: 360, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1001, name: "SHAMPOO MECLAY LARGE (GOLDEN)", price: 660, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 1002, name: "SHAMPOO MECLAY LARGE (GREEN)", price: 660, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1003, name: "SHAMPOO MECLAY LARGE (PINK)", price: 660, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 1004, name: "SHAMPOO MECLAY LARGE BLACK", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1005, name: "SHAMPOO MECLAY LARGE BLUE", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1006, name: "SHAMPOO MECLAY LARGE GOLDEN", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1007, name: "SHAMPOO MECLAY LARGE PINK", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1008, name: "SHAMPOO MECLAY LARGE PP", price: 660, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 1009, name: "SHAMPOO MECLAY LARGE RED", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1010, name: "SHAMPOO MECLAY LARGE WHITE", price: 660, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1011, name: "SHAMPOO MECLAY LARGE YELLOW", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1012, name: "SHAMPOO PALMOLIVE (LARGE) (GREEN) HEALTHY & SMOOTH RS,700", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1013, name: "SHAMPOO PALMOLIVE (LARGE) (PINK) INTENSIVE MOISTURE RS,700", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1014, name: "SHAMPOO PALMOLIVE (LARGE) (WHITE) BRILLIANT SHINE", price: 660, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1015, name: "SHAMPOO PALMOLIVE (MEDIUM) (BLACK) HEALTH & SHINE RS,330", price: 379, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1016, name: "SHAMPOO PALMOLIVE (MEDIUM) (BLUE) ANTI-DANDRUFF RS,330", price: 379, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1017, name: "SHAMPOO PALMOLIVE (MEDIUM) (PINK) INTENSIVE MOISTURE RS,400", price: 379, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1018, name: "SHAMPOO PALMOLIVE (MEDIUM) GREEN RS,400", price: 379, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 1019, name: "SHAMPOO PALMOLIVE (MEDIUM) PINK RS,400", price: 379, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
      { id: 1020, name: "SHAMPOO PALMOLIVE RS,180 (PINK)", price: 169, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 1021, name: "SHAMPOO PAMOLIVE RS,180 (GREEN)", price: 169, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 1022, name: "SHAMPOO PANTENE 100ml (MIX) RP,190", price: 179, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 1023, name: "SHAMPOO PANTENE 200ml (BLACK) DEEP BLACK RS,450", price: 439, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1024, name: "SHAMPOO PANTENE 200ml (BLUE) ANTI DANDRUFFRS RS,450", price: 439, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1025, name: "SHAMPOO PANTENE 200ml (GOLDEN) ANTI HAIR FALL RS,450", price: 439, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1026, name: "SHAMPOO PANTENE 200ml (GREEN) SMOOTH & SILKY RS,450", price: 439, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 1027, name: "SHAMPOO PANTENE 200ml (MIX) RS,450", price: 439, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
      { id: 1028, name: "SHAMPOO PANTENE 400ml (BLACK) DEEP BLACK.RS.750", price: 729, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1029, name: "SHAMPOO PANTENE 400ml (BLUE) ANTI DANDRUFF RS,750", price: 729, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1030, name: "SHAMPOO PANTENE 400ml (GOLDEN) ANTI HAIR FALL RP,750", price: 729, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1031, name: "SHAMPOO PANTENE 400ml (GREEN) RS,750", price: 729, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1032, name: "SHAMPOO PANTENE 400ml (GREEN) SMOOTH & SILKY RS,750", price: 729, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 1033, name: "SHAMPOO PANTENE 400ml (MIX) RS,750", price: 729, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1034, name: "SHAMPOO REVLON COLOUR SASHY 30#", price: 70, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 1035, name: "SHAMPOO SUNSILK (IMP) LARGE (BLACK) BLACK SHINE", price: 889, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1036, name: "SHAMPOO SUNSILK (IMP) LARGE (BLUE) ANTI DANDRUFF", price: 889, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1037, name: "SHAMPOO SUNSILK (IMP) LARGE (GOLDEN) H,F SOLUTION", price: 889, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1038, name: "SHAMPOO SUNSILK (IMP) MEDIUM (GREEN)", price: 439, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1039, name: "SHAMPOO SUNSILK (IMP) MEDIUM (GREEN) LILLY TEA & WHITE FRESHNESS", price: 439, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1040, name: "SHAMPOO SUNSILK (IMP) MEDIUM (MIX)", price: 439, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1041, name: "SHAMPOO SUNSILK 100ml (BLACK) BLACK SHINE RS,190", price: 179, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 1042, name: "SHAMPOO SUNSILK 200ml (BLACK) BLACK SHINE RS,499", price: 479, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 1043, name: "SHAMPOO SUNSILK 200ml (GOLDEN) H,F SOLUTION RS,399", price: 379, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1044, name: "SHAMPOO SUNSILK 200ml (PINK) THICK & LONG RS,449", price: 479, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 1045, name: "SHAMPOO SUNSILK 400ml (PINK) THICK & LONG RS,799", price: 769, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1046, name: "SHAMPOO SUNSILK 400ml (YELLOW) SOFT & SMOOTH", price: 769, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1047, name: "SHAMPOO TRESEMME (IMP) 170ml (BLACK)", price: 520, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1048, name: "SHAMPOO TRESEMME (IMP) 170ml (GREEN)", price: 520, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1049, name: "SHAMPOO TRESEMME (IMP) 170ml (RED)", price: 520, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1050, name: "SHAMPOO TRESEMME 170ml RS,570 (RED)", price: 520, categoryId: "shampoo", categoryName: "Shampoo", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
      { id: 1051, name: "SHAMPOO TRESEMME 400ml (BK ) RR,930", price: 885, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1052, name: "SHAMPOO TRESEMME 400ml (BLACK)", price: 885, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1053, name: "SHAMPOO TRESEMME 400ml (BLUE)", price: 885, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1054, name: "SHAMPOO VATIKA DUBAI LARGE (BLACK) RP,720", price: 659, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1055, name: "SHAMPOO VATIKA DUBAI LARGE (BLACK) RS,720", price: 659, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1056, name: "SHAMPOO VATIKA DUBAI LARGE (COCO,N) BLUE RS,720", price: 659, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1057, name: "SHAMPOO VATIKA DUBAI LARGE (D,GREEN) RS,720", price: 659, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1058, name: "SHAMPOO VATIKA DUBAI MEDIUM (ALMOND & HONEY) (ORANGE) RS,435", price: 399, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1059, name: "SHAMPOO VATIKA DUBAI MEDIUM (ALMOND) RS,435", price: 399, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1060, name: "SHAMPOO VATIKA DUBAI MEDIUM (BLACK OLIVE SHINE) RS,435", price: 399, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1061, name: "SHAMPOO VATIKA DUBAI MEDIUM (BLACK) RS,435", price: 399, categoryId: "shampoo", categoryName: "Shampoo & Conditioner" },
      { id: 1062, name: "SHARPNER ORO JAR 50 PECE RS,10", price: 9, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1063, name: "SHATAL COCK (PAR WALI) GOOD QUALITY", price: 0, categoryId: "sports", categoryName: "Sports" },
      { id: 1064, name: "SHATAL COCK (PAR WALI) NORMAL QUALITY", price: 0, categoryId: "sports", categoryName: "Sports" },
      { id: 1065, name: "SHATAL COCK (PLASTIK) EXILANT QUALITY", price: 0, categoryId: "sports", categoryName: "Sports" },
      { id: 1066, name: "SHATAL COCK (PLASTIK) GOOD QUALITY WHITE", price: 85, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 1067, name: "SHEILD CHOOSNI (3 MONTH)", price: 90, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 1068, name: "SHEILD CHOOSNI (6 MONTH)", price: 90, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 1069, name: "SHIELD FEEDER COLOUR (LARGE) COLOUR NEW", price: 0, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 1070, name: "SHIELD FEEDER COLOUR (LARGE) RS,200", price: 179, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 1071, name: "SHIELD FEEDER COLOUR (MEDIUM) BLUE RS,190", price: 169, categoryId: "babycare", categoryName: "Baby Care" },
      { id: 1072, name: "SHIELD FEEDER COLOUR (MEDIUM) RS,190", price: 169, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 1073, name: "SHIELD FEEDER HANDLE (LARGE) RS,200", price: 179, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 1074, name: "SHIELD FEEDER HANDLE (MEDIUM) RS,190", price: 169, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1075, name: "SHIELD NIPPLE BOX", price: 80, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
      { id: 1076, name: "SOAP CAPRI (FAMILY PACK) 135g (ALOE NURTURE EXTRACTS)", price: 130, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1077, name: "SOAP CAPRI (FAMILY PACK) 135g (MIX)", price: 130, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1078, name: "SOAP CAPRI (FAMILY PACK) 135g (NOURISHING PEACH)", price: 130, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1079, name: "SOAP CAPRI (FAMILY PACK) 135g (PURIFYING GREEN TEA)", price: 130, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1080, name: "SOAP CAPRI (FAMILY PACK) 135g (ROSS, RED)", price: 130, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1081, name: "SOAP CAPRI (LARGE) MIX RS,140", price: 130, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1082, name: "SOAP CAPRI (LARGE) WHITE RS,140 MOSTURISING", price: 130, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1083, name: "SOAP DETTOL JAMBO COMPANY RS,150 (COOL)", price: 139, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1084, name: "SOAP DETTOL JAMBO COMPANY RS,150 GREEN", price: 139, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1085, name: "SOAP DETTOL JAMBO COMPANY RS,150 MIX", price: 139, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 1086, name: "SOAP DETTOL MEDIUM COMPANY (COOL) RS,140", price: 129 ,categoryId: "soaps", categoryName: "Soaps" },
      { id: 1087, name: "SOAP DETTOL SMALL COMPANY (COOL)", price: 129, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1088, name: "SOAP DOVE LARGE BLUE (IMP)", price: 395, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1089, name: "SOAP DOVE LARGE PINK (IMP)", price: 395, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "S" },
      { id: 1090, name: "SOAP DOVE LARGE WHITE (IMP)", price: 388, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 1091, name: "SOAP DOVE LARGE WHITE (IMP)", price: 395, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 1092, name: "SOAP FAIZA (NEEM)", price: 110, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1093, name: "SOAP FAIZA (PP)", price: 110, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1094, name: "SOAP GOLDEN PEARL (BLUE)", price: 125, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1095, name: "SOAP GOLDEN PEARL (PINK)", price: 125, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 1096, name: "SOAP GOLDEN PEARL (YELLOW)", price: 125, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 1097, name: "SOAP IMPERIAL 175gm LARGE", price: 390, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1098, name: "SOAP IMPERIAL LEATHER", price: 239, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 1099, name: "SOAP LIFE BOY (LARGE) GREEN RS,125", price: 119, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1100, name: "SOAP LIFE BOY (MEDIUM) (BLUE) RS,95", price: 90 ,categoryId: "soaps", categoryName: "Soaps" },
      { id: 1101, name: "SOAP LIFE BOY (XL) BLUE RS,125", price: 119, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1102, name: "SOAP LIFE BOY (XL) GREEN RS,125", price: 119, categoryId: "soaps", categoryName: "Soaps" }, 
      { id: 1103, name: "SOAP PALMOLIVE (LARGE) RS,150 BLACK", price: 139 ,categoryId: "soaps", categoryName: "Soaps" },
      { id: 1104, name: "SOAP PALMOLIVE (LARGE) RS,150 ORANGE", price: 139, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1105, name: "SOAP PALMOLIVE (LARGE) RS,150 PP", price: 139, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1106, name: "SOAP PALMOLIVE (LARGE) RS,150 (MIX)", price: 139, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 1107, name: "SOAP PALMOLIVE (LARGE) RS,150 (MIX)", price: 139, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "S" },
      { id: 1108, name: "SOAP PALMOLIVE (LARGE) WHITE RS,150", price: 139, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1109, name: "SOAP PEARS (BLUE)", price: 430, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1110, name: "SOAP PEARS (GREEN)", price: 430, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 1111, name: "SOAP PEARS (ORANGE)", price: 430, categoryId: "soaps", categoryName: "Soaps" },
      { id: 1112, name: "SOAP SKIN WHITE (BLUE) RS,150", price: 135, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "S" },
      { id: 1113, name: "SOAP SKIN WHITE (MIX) RS,150", price: 135, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1114, name: "SOAP SKIN WHITE (PINK) RS,150", price: 135, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "S" },
      { id: 1115, name: "SOAP TIBET (LARGE FAMILY SIZE) RS,109", price: 104, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "S" },
      { id: 1116, name: "SOAP TIBET (MEDIUM BATH SIZE) RS,89", price: 85, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 1117, name: "SOAP TIBET (SMALL STANDARD SIZE) RS,70", price: 66, categoryId: "soaps", categoryName: "Soaps", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1118, name: "SOFT TOUCH WONDER WAX LARGE GREEN", price: 249, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "S" },
      { id: 1119, name: "SOFT TOUCH WONDER WAX LARGE LEMON", price: 249, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1120, name: "SOFT TOUCH WONDER WAX SMALL GREEN", price: 209, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1121, name: "SOFT TOUCH WONDER WAX SMALL LEMON", price: 209, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1122, name: "STUD SPRAY  SILVER", price: 1150, categoryId: "condemn", categoryName: "Condemn" },
      { id: 1123, name: "SUI MECHIN (#1)", price: 0, categoryId: "general", categoryName: "General Items" },
      { id: 1124, name: "SUI MECHIN (#16)", price: 0, categoryId: "general", categoryName: "General Items" },
      { id: 1125, name: "SUI MECHIN (#19)", price: 0, categoryId: "general", categoryName: "General Items" },
      { id: 1126, name: "SUI MECHIN (MIX)", price: 0, categoryId: "general", categoryName: "General Items" },
      { id: 1127, name: "SUI RAZAI", price: 0, categoryId: "general", categoryName: "General Items" },
      { id: 1128, name: "SUI SMALL", price: 0, categoryId: "general", categoryName: "General Items" },
      { id: 1129, name: "SUI TARPAI (PATA)", price: 0, categoryId: "general", categoryName: "General Items" },
      { id: 1130, name: "SUNBLOCK RIVAJ (LARGE) RP,630", price: 579, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "S" },
      { id: 1131, name: "SUNBLOCK RIVAJ SPF 60 (SMALL) RP,300", price: 260, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "S" },
      { id: 1132, name: "T AUTO CAR", price: 40, categoryId: "toys", categoryName: "Toys" },
      { id: 1133, name: "T AUTO CAR METAL", price: 379,categoryId: "toys", categoryName: "Toys" },
      { id: 1134, name: "T BALL FOAM", price: 60, categoryId: "toys", categoryName: "Toys" },
      { id: 1135, name: "T BARREL O SLIME (MELON) KHARBOZA", price: 40, categoryId: "toys", categoryName: "Toys" },
      { id: 1136, name: "T BARREL O SLIME JAR LARGE 200g", price: 99, categoryId: "toys", categoryName: "Toys" },
      { id: 1137, name: "T BLOCKS GAME", price: 240,categoryId: "toys", categoryName: "Toys" },
      { id: 1138, name: "T BUBBLE CARTOON FACE (EX QUALITY)", price: 0, categoryId: "toys", categoryName: "Toys" },
      { id: 1139, name: "T BUBBLE CARTOON FACE (GOOD QUALITY)", price: 0, categoryId: "toys", categoryName: "Toys" },
      { id: 1140, name: "T BUBBLE FEEDER", price: 0, categoryId: "toys", categoryName: "Toys" },
      { id: 1141, name: "T BUBBLE FEEDER EX QUALITY", price: 0, categoryId: "toys", categoryName: "Toys" },
      { id: 1142, name: "T BUBBLE SURAHI WALA (EX LONG)", price: 0, categoryId: "toys", categoryName: "Toys" },
      { id: 1143, name: "T BUBBLE SURAHI WALA (EX QUALITY)", price: 0, categoryId: "toys", categoryName: "Toys" },
      { id: 1144, name: "T BUBBLE WITH FAN", price: 0, categoryId: "toys", categoryName: "Toys" },
      { id: 1145, name: "T CAR JAMPING LARGE PECE 18 (DOREMON)", price: 0, categoryId: "toys", categoryName: "Toys" },
      { id: 1146, name: "T CAR JAMPING LARGE PIECE 18", price: 0, categoryId: "toys", categoryName: "Toys" },
      { id: 1147, name: "T CAR JAMPING MEDIUM  (JEEP ) EX QUALITY", price: 0, categoryId: "toys", categoryName: "Toys" },
      { id: 1148, name: "T CHORDI GAME", price: 0, categoryId: "toys", categoryName: "Toys" },
      { id: 1149, name: "T CLAY LARGE", price: 85, categoryId: "stationary", categoryName: "Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "T" },
      { id: 1150, name: "T LESAR LIGHT GUN", price: 0, categoryId: "toys", categoryName: "Toys" },
      { id: 1151, name: "T LIGHTING BALL", price: 0, categoryId: "toys", categoryName: "Toys" },
      { id: 1152, name: "T POP UP PATAKA (YELLOW)", price: 0, categoryId: "toys", categoryName: "Toys" },
      { id: 1153, name: "T TORCH LIGHT (SMALL) (#H 299)", price: 0, categoryId: "toys", categoryName: "Toys" },
      { id: 1154, name: "T WATER GUN", price: 0, categoryId: "toys", categoryName: "Toys" },
      { id: 1155, name: "T YOYO DORI LIGHT WALA (GOOD QUALITY)", price: 0, categoryId: "toys", categoryName: "Toys" },
      { id: 1156, name: "TAPE DOUBLE 2 INCH", price: 0, categoryId: "tapes", categoryName: "Tapes" },
      { id: 1157, name: "TAPE DOUBLE SIDED (1 INCH)", price: 65, categoryId: "tapes", categoryName: "Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "T" },
      { id: 1158, name: "TAPE DOUBLE SIDED (1 INCH)", price: 63, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "T" },
      { id: 1159, name: "TAPE DOUBLE SIDED (1 INCH) TRANSPARNT", price: 0, categoryId: "tapes", categoryName: "Tapes" },
      { id: 1160, name: "TAPE KAGHAZ (0.5 INCH) HAF INCH 12PEC", price: 0, categoryId: "tapes", categoryName: "Tapes" },
      { id: 1161, name: "TAPE KAGHAZ 1 INCH", price: 65, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "T" },
      { id: 1162, name: "TAPE KAGHAZ 2 INCH", price: 0, categoryId: "tapes", categoryName: "Tapes" },
      { id: 1163, name: "TAPE OSAKA (BLACK)", price: 45, categoryId: "tapes", categoryName: "Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "T" },
      { id: 1164, name: "TAPE OSAKA (BLACK) FULL LENGTH", price: 59, categoryId: "tapes", categoryName: "Tapes" },
      { id: 1165, name: "TAPE OSAKA (RED)", price: 45, categoryId: "tapes", categoryName: "Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "T" },
      { id: 1166, name: "TAPE OSAKA (RED) FULL LENGTH", price:59, categoryId: "tapes", categoryName: "Tapes" },
      { id: 1167, name: "TAPE OSAKA (WHITE)", price: 45, categoryId: "tapes", categoryName: "Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "T" },
      { id: 1168, name: "TAPE OSAKA (WHITE) FULL LENGTH", price: 59, categoryId: "tapes", categoryName: "Tapes" },
      { id: 1169, name: "TAPE PACKING BROWN (2 INCH)", price: 95, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "T" },
      { id: 1170, name: "TAPE PACKING BROWN (2 INCH) 45 METER", price: 0, categoryId: "tapes", categoryName: "Tapes" },
      { id: 1171, name: "TAPE PACKING BROWN (2 INCH) 65 METER", price: 0, categoryId: "tapes", categoryName: "Tapes" },
      { id: 1172, name: "TAPE PACKING BROWN (2 INCH) SHORT LANTH (SMALL)", price: 0, categoryId: "tapes", categoryName: "Tapes" },
      { id: 1173, name: "TAPE TRANSPARENT (0.5 INCH) EX QUALITY", price: 0, categoryId: "tapes", categoryName: "Tapes" },
      { id: 1174, name: "TAPE TRANSPARENT (1 INCH)", price: 55, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "T" },
      { id: 1175, name: "TAPE TRANSPARENT (1 INCH) FULL LANTH", price: 0, categoryId: "tapes", categoryName: "Tapes" },
      { id: 1176, name: "TAPE TRANSPARENT (2 INCH)", price: 95, categoryId: "tapes", categoryName: "Tapes", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "T" },
      { id: 1177, name: "TAPE TRANSPARENT (2 INCH) (MOTI)", price: 0, categoryId: "tapes", categoryName: "Tapes" },
      { id: 1178, name: "TAPE TRANSPARENT RS,10", price: 85, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[2], initial: "T" },
      { id: 1179, name: "TASH REGAL", price:180,categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "T" },
      { id: 1180, name: "TIGER INSECT SPRAY 300ML (SMALL)", price: 0, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 1181, name: "TIGER INSECT SPRAY 400ML (MEDIUM)", price: 0, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 1182, name: "TIGER INSECT SPRAY 600ML (LARGE)", price: 0, categoryId: "mosquito", categoryName: "Anti-Mosquito" },
      { id: 1183, name: "TOOTH PICK DENTAL FLOSS", price: 59, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "T" },
      { id: 1184, name: "TOOTH PICK LARGE", price: 89, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "T" },
      { id: 1185, name: "TOYS MIX", price: 0, categoryId: "toys", categoryName: "Toys" },
      { id: 1186, name: "TRUST PAID LARGE (ORENGE) R,P 190", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1187, name: "TRUST PAID LARGE (PARPAL) RS,340", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1188, name: "TRUST PAID LARGE (PINK) RS,220", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1189, name: "TRUST PAID LARGE (YELLOW) RS,290", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1190, name: "TUSAR JENTS", price: 80, categoryId: "others", categoryName: "Others" },
      { id: 1191, name: "TUSAR LADEIS", price: 80, categoryId: "others", categoryName: "Others" },
      { id: 1192, name: "TUSBHI (LED)", price: 135, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "T" },
      { id: 1193, name: "TUSBHI (LED) GREEN", price:135, categoryId: "others", categoryName: "Others" },
      { id: 1194, name: "TUSBHI (LED) PATA", price: 115,categoryId: "others", categoryName: "Others" },
      { id: 1195, name: "TUSBHI (SADA)", price: 59, categoryId: "general", categoryName: "General", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "T" },
      { id: 1196, name: "UHU PATA", price: 49, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "U" },
      { id: 1197, name: "UHU TUBE (# 11)", price: 110,categoryId: "stationary", categoryName: "Stationary" },
      { id: 1198, name: "UHU TUBE (# 12)", price: 165,categoryId: "stationary", categoryName: "Stationary" },
      { id: 1199, name: "UHU TUBE (# 13)", price: 275,categoryId: "stationary", categoryName: "Stationary" },
      { id: 1200, name: "UNDER WEAR LADIES  BLACK & SKIN (LARGE) GOOD QULITY (# 520)", price: 200,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1201, name: "UNDER WEAR LADIES  BLACK & SKIN (MEDIUM) GOOD QULITY (# 320)", price: 200,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1202, name: "UNDER WEAR LADIES  BLACK & SKIN (SMALL) GOOD QULITY (# 120)", price: 200,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1203, name: "UNDER WEAR LADIES  BLACK & SKIN (X,L) GOOD QULITY (# 620)", price: 200,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1204, name: "VASELINE HAIR TONIC 100ml (NON ORUNAL)", price: 199, categoryId: "haircare", categoryName: "Hair Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "V" },
      { id: 1205, name: "VASELINE HAIR TONIC 100ml (ORIGNAL)", price: 499,categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 1206, name: "VASELINE HAIR TONIC 200ml (NON ORIJNAL)", price: 299,categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 1207, name: "VASELINE HAIR TONIC 200ml (ORIGNAL)", price: 899,categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 1208, name: "VASELINE PETROLIEM (IMP) 250ML S,A (MIX)", price: 899,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1209, name: "VASELINE PETROLIUM (IMP) 100ml S,A (MIX)", price: 399, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
      { id: 1210, name: "VASELINE PETROLIUM (IMP) 50ml", price: 259,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1211, name: "VASELINE PETROLIUM (IMP) 50ml S,A (BLUE,ORIGINAL)", price: 249, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "V" },
      { id: 1212, name: "VASELINE PETROLIUM (IMP) 50ml S,A (GREEN,ALOE FRESH)", price: 249, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "V" },
      { id: 1213, name: "VASELINE PETROLIUM (IMP) 50ml S,A (MIX)", price: 249, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "V" },
      { id: 1214, name: "VASELINE PETROLIUM (IMP) 50ml S,A (PINK,BABY)", price: 249, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "V" },
      { id: 1215, name: "VASELINE PETROLIUM (IMP) 50ml S,A (VITAMIN E)", price: 249, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "V" },
      { id: 1216, name: "VASELINE TIBET RS,130", price: 119, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
      { id: 1217, name: "VASLINE THROPY PINK", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1218, name: "VATIKA HAIR OIL 100ml (ALMOND) COMPANY RS,370", price:339, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 1219, name: "VATIKA HAIR OIL 100ml (CACTUS) COMPANY RP,350", price: 319,categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 1220, name: "VATIKA HAIR OIL 100ml (Coconut)", price: 319, categoryId: "haircare", categoryName: "Hair Care & Oil", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
      { id: 1221, name: "VATIKA HAIR OIL 100ML (GARLIC) COMPANY RP,350", price: 319,categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 1222, name: "VATIKA HAIR OIL 100ml (OLIVE)", price: 319, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "V" },
      { id: 1223, name: "VATIKA HAIR OIL 200ml (ALMOND) RS,640", price:599, categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 1224, name: "VATIKA HAIR OIL 200ml (CACTUS)", price: 599, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "V" },
      { id: 1225, name: "VATIKA HAIR OIL 200ml (Coconut)", price: 599,categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 1226, name: "VATIKA HAIR OIL 200ml (GARLIC)", price: 599,categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 1227, name: "VATIKA HAIR OIL 200ml (OLIVE)", price: 599, categoryId: "hairoil", categoryName: "Hair Oil & Hair Care", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "V" },
      { id: 1228, name: "VATIKA HAIR OIL 200ml (ONION)", price: 599,categoryId: "haircare", categoryName: "Hair Care & Oil" },
      { id: 1229, name: "VEET JAR LARGE (BLUE) RS,595", price: 559,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1230, name: "VEET JAR LARGE (GREEN) RS,595", price:559, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1231, name: "VEET JAR LARGE (MIX) RS,595", price: 559, categoryId: "bodylotion", categoryName: "Body Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "V" },
      { id: 1232, name: "VEET JAR LARGE (PINK) RS,595", price: 559,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1233, name: "VEET JAR SMALL (GREEN) RS,300", price:269, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1234, name: "VEET JAR SMALL (PINK) RS,300", price:269, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1235, name: "VEET JAR SMALL 40g (MIX) RS,300", price: 269, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[6], initial: "V" },
      { id: 1236, name: "VEET STRIPS (BLUE)", price: 349,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1237, name: "VEET STRIPS (GREEN)", price: 349,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1238, name: "VEET STRIPS (PINK)", price: 349,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1239, name: "VEET TUBE LARGE (BLUE) FULL SIZ", price: 799,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1240, name: "VEET TUBE LARGE (IMP) GREEN", price: 699,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1241, name: "VEET TUBE MEDIUM (BLUE) RS,495", price: 459,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1242, name: "VEET TUBE MEDIUM (GREEN) RS,495", price: 459,categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1243, name: "VEET TUBE MEDIUM 50g (MIX)", price: 459, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "V" },
      { id: 1244, name: "VEET TUBE SMALL 25g (MIX) RS,250", price: 229, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
      { id: 1245, name: "VENEEZIA WAX (JAR)", price: 499, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1246, name: "VENEEZIA WAX (LARGE) RS,280", price: 249, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "V" },
      { id: 1247, name: "VENEEZIA WAX (SMALL) RP,220", price: 195, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[5], initial: "V" },
      { id: 1248, name: "VENEEZIA WAX PARLOR SIZE", price:599, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1249, name: "VITAMN (E) CAPSULES (FACIAL ESSENSE)", price: 5, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "V" },
      { id: 1250, name: "VITAMN CAPSOLE LARGE WHITE", price: 8, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "V" },
      { id: 1251, name: "WASH ROOM TIKI (GOOD QUALITY) FRESH", price: 150, categoryId: "others", categoryName: "Others" },
      { id: 1252, name: "WASH ROOM TIKI (SASTI)", price: 70, categoryId: "others", categoryName: "Others" },
      { id: 1253, name: "WAX PATI", price: 80, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1254, name: "WAX PATI BUKRAM", price: 90, categoryId: "creams", categoryName: "Creams & Lotions", hasImage: true, gradient: SWATCH_GRADIENTS[0], initial: "W" },
      { id: 1255, name: "WAX PATI BUKRAM", price: 90, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[1], initial: "W" },
      { id: 1256, name: "WHITE ROSE H,R JAR (LARGE) RS,280", price: 239, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1257, name: "WHITE ROSE H,R JAR (MEDIUM) RS,220", price: 199, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1258, name: "WHITE ROSE H,R JAR (SMALL) RS,190", price: 169, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1259, name: "WIPES CHINA BABY", price: 99, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1260, name: "WIPES JEEP CEMERA", price: 169, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1261, name: "WIPES NEXTON", price: 0, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1262, name: "WIPES PAMPER (NON ORUNAL)", price: 249, categoryId: "babycare", categoryName: "Baby Care", hasImage: true, gradient: SWATCH_GRADIENTS[4], initial: "W" },
      { id: 1263, name: "WIPES SOFT CREME (MIX)", price: 129, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[7], initial: "W" },
      { id: 1264, name: "WIPES SOFT-CREAME (BLUE)", price: 129, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1265, name: "WIPES SOFT-CREAME (WHITE)", price: 129, categoryId: "personalcare", categoryName: "Personal Care" },
      { id: 1266, name: "ZERO MOSKITO SASHAY BOX RS,10", price: 8, categoryId: "general", categoryName: "General Items & Stationary", hasImage: true, gradient: SWATCH_GRADIENTS[3], initial: "Z" },
    
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

            {/* Category button â€” desktop */}
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

          {/* Category button â€” mobile */}
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
        <p className="text-xs text-white/40">Sahil Traders â€” your trusted wholesale & retail store</p>
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
  const [imgErr, setImgErr] = React.useState(false);
  const [imgType, setImgType] = React.useState('jpg'); 

  function handleImgError() {
    if (imgType === 'jpg') {
      setImgType('png');
    } else {
      setImgErr(true);
    }
  }

  const imageSrc = `images/${product.id}.${imgType}`;

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl overflow-hidden border border-white/15 hover:bg-white/15 hover:-translate-y-0.5 transition-all flex flex-col shadow-lg shadow-black/10">
      <div className="h-32 sm:h-36 w-full flex items-center justify-center p-3">
        {!imgErr ? (
          <img 
            src={imageSrc} 
            onError={handleImgError}
            className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0 shadow-lg"
          />
        ) : product.hasImage ? (
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