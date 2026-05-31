// MyPlanzo multi-tone event-category icons (from the dedicated icon set).
// Each icon is a self-contained 64×64 SVG. We render them via a sized wrapper
// using the verbatim markup — the strings are static and trusted (no user input).

const SVGS: Record<string, string> = {
  Birthday: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="8" y="40" width="48" height="18" rx="5" fill="#00B8FF"/>
      <rect x="8" y="40" width="48" height="5" rx="3" fill="#7FDBFF" opacity="0.4"/>
      <path d="M8 41 Q12 36 16 41 Q20 36 24 41 Q28 36 32 41 Q36 36 40 41 Q44 36 48 41 Q52 36 56 41" stroke="#fff" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <rect x="14" y="27" width="36" height="14" rx="4" fill="#FFD166"/>
      <rect x="14" y="27" width="36" height="5" rx="3" fill="#fff" opacity="0.25"/>
      <path d="M14 28 Q17.5 23 21 28 Q24.5 23 28 28 Q31.5 23 35 28 Q38.5 23 42 28 Q45.5 23 50 28" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none"/>
      <rect x="20" y="17" width="24" height="11" rx="3" fill="#E6A817"/>
      <rect x="20" y="17" width="24" height="4" rx="2" fill="#fff" opacity="0.2"/>
      <rect x="23" y="9" width="4" height="9" rx="2" fill="#fff"/>
      <rect x="30" y="7" width="4" height="11" rx="2" fill="#fff"/>
      <rect x="37" y="9" width="4" height="9" rx="2" fill="#fff"/>
      <rect x="23" y="12" width="4" height="2" rx="1" fill="#00B8FF" opacity="0.5"/>
      <rect x="30" y="10" width="4" height="2" rx="1" fill="#FF6B6B" opacity="0.6"/>
      <rect x="37" y="12" width="4" height="2" rx="1" fill="#00B8FF" opacity="0.5"/>
      <path d="M25 9 Q23 6 25 3 Q27 6 25 9Z" fill="#FF6B6B"/>
      <path d="M32 7 Q30 4 32 1 Q34 4 32 7Z" fill="#FF6B6B"/>
      <path d="M39 9 Q37 6 39 3 Q41 6 39 9Z" fill="#FF6B6B"/>
      <path d="M25 8 Q24.2 6.5 25 5 Q25.8 6.5 25 8Z" fill="#FFD166" opacity="0.9"/>
      <path d="M32 6 Q31.2 4.5 32 3 Q32.8 4.5 32 6Z" fill="#FFD166" opacity="0.9"/>
      <path d="M39 8 Q38.2 6.5 39 5 Q39.8 6.5 39 8Z" fill="#FFD166" opacity="0.9"/>
      <circle cx="20" cy="49" r="2.2" fill="#FFD166" opacity="0.75"/>
      <circle cx="32" cy="49" r="2.2" fill="#fff" opacity="0.6"/>
      <circle cx="44" cy="49" r="2.2" fill="#FFD166" opacity="0.75"/>
      <circle cx="26" cy="34" r="1.5" fill="#fff" opacity="0.4"/>
      <circle cx="38" cy="34" r="1.5" fill="#fff" opacity="0.4"/>
    </svg>`,
  "Baby Shower": `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <path d="M19 23 L11 15 L19 18 L19 12 Q19 10 21 10 L43 10 Q45 10 45 12 L45 18 L53 15 L45 23 L45 53 Q45 55 43 55 L21 55 Q19 55 19 53 Z" fill="#00B8FF"/>
      <path d="M11 15 L19 18 L19 23 L14 20Z" fill="#0077B6"/>
      <path d="M53 15 L45 18 L45 23 L50 20Z" fill="#0077B6"/>
      <rect x="19" y="23" width="26" height="4" rx="2" fill="#7FDBFF" opacity="0.3"/>
      <path d="M19 12 Q23 20 32 20 Q41 20 45 12" stroke="#fff" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <path d="M19 12 Q23 18 32 18 Q41 18 45 12 L43 10 Q39 16 32 16 Q25 16 21 10Z" fill="#9B84E8" opacity="0.45"/>
      <path d="M32 38 Q29 33 26 33 Q22 33 22 37.5 Q22 41 32 48 Q42 41 42 37.5 Q42 33 38 33 Q35 33 32 38Z" fill="#C9B8FF"/>
      <path d="M26 35 Q28 33 30 34" stroke="#fff" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.7"/>
      <circle cx="26" cy="53" r="2.2" fill="#A8EDCA"/>
      <circle cx="32" cy="53" r="2.2" fill="#A8EDCA"/>
      <circle cx="38" cy="53" r="2.2" fill="#A8EDCA"/>
      <circle cx="26" cy="53" r="1" fill="#fff" opacity="0.5"/>
      <circle cx="32" cy="53" r="1" fill="#fff" opacity="0.5"/>
      <circle cx="38" cy="53" r="1" fill="#fff" opacity="0.5"/>
      <path d="M8 30 L9 27 L10 30 L9 33Z" fill="#C9B8FF" opacity="0.8"/>
      <path d="M55 28 L56 25 L57 28 L56 31Z" fill="#A8EDCA" opacity="0.8"/>
      <circle cx="9" cy="42" r="1.2" fill="#7FDBFF" opacity="0.6"/>
    </svg>`,
  Anniversary: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <circle cx="22" cy="37" r="13" fill="#FF8FAB"/>
      <circle cx="22" cy="37" r="8.5" fill="#07070F"/>
      <path d="M11 31 Q12 25 17 22" stroke="#fff" stroke-width="2.5" stroke-linecap="round" opacity="0.7" fill="none"/>
      <circle cx="42" cy="37" r="13" fill="#00B8FF"/>
      <circle cx="42" cy="37" r="8.5" fill="#07070F"/>
      <path d="M31 22 Q36 19 47 22" stroke="#7FDBFF" stroke-width="2.5" stroke-linecap="round" opacity="0.6" fill="none"/>
      <path d="M32 25.5 Q38 29 38 37 Q38 45 32 48.5 Q26 45 26 37 Q26 29 32 25.5Z" fill="#E5537A"/>
      <path d="M32 30.5 Q36 33 36 37 Q36 41 32 43.5 Q28 41 28 37 Q28 33 32 30.5Z" fill="#07070F"/>
      <path d="M32 5 L40 13 L32 23 L24 13Z" fill="#FFD6A5"/>
      <path d="M24 13 L40 13" stroke="#E8A950" stroke-width="1.4" fill="none"/>
      <path d="M32 5 L24 13 L32 23" fill="#fff" opacity="0.3"/>
      <path d="M32 5 L40 13 L32 13" fill="#fff" opacity="0.55"/>
      <line x1="32" y1="3" x2="32" y2="1" stroke="#FFD6A5" stroke-width="2" stroke-linecap="round"/>
      <line x1="29.5" y1="3.5" x2="28" y2="2" stroke="#FFD6A5" stroke-width="1.6" stroke-linecap="round"/>
      <line x1="34.5" y1="3.5" x2="36" y2="2" stroke="#FFD6A5" stroke-width="1.6" stroke-linecap="round"/>
      <line x1="54" y1="14" x2="54" y2="9" stroke="#FF8FAB" stroke-width="2" stroke-linecap="round"/>
      <line x1="51.5" y1="11.5" x2="56.5" y2="11.5" stroke="#FF8FAB" stroke-width="2" stroke-linecap="round"/>
      <circle cx="10" cy="22" r="1.5" fill="#FFD6A5" opacity="0.7"/>
    </svg>`,
  Farewell: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <path d="M25 55 Q13 51 11 38 Q9 27 13 21 L16 12 Q17.5 9 20.5 10 Q23 11 22.5 14.5 L21 19 L23 11 Q24.5 8 27.5 9 Q30 10 29.5 13.5 L28 20 L30 12 Q31.5 9 34.5 10 Q37 11 36.5 14.5 L35 21 L37 14 Q38.5 11 41.5 12.5 Q44 14 43.5 18 L41 28 L45 23 Q47.5 21 49.5 23.5 Q51.5 26 49.5 29.5 L43 40 Q39 47 25 55Z" fill="#FFBA49"/>
      <path d="M11 38 Q13 45 20 50 Q13 47 11 38Z" fill="#FF9770" opacity="0.5"/>
      <path d="M29 9 Q34 8.5 37 10" stroke="#fff" stroke-width="2.2" stroke-linecap="round" opacity="0.6" fill="none"/>
      <path d="M21 19 Q23 21.5 25 19.5" stroke="#fff" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.7"/>
      <path d="M28 20 Q30 22.5 32 21" stroke="#fff" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.7"/>
      <path d="M35 21 Q37 23.5 39 22" stroke="#fff" stroke-width="1.5" stroke-linecap="round" fill="none" opacity="0.7"/>
      <path d="M17 32 Q25 36 37 32" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity="0.35" fill="none"/>
      <path d="M13 42 Q19 48 28 51" stroke="#00B8FF" stroke-width="3" stroke-linecap="round" opacity="0.4" fill="none"/>
      <line x1="54" y1="11" x2="59" y2="9" stroke="#00B8FF" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="56" y1="20" x2="61" y2="20" stroke="#00B8FF" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="54" y1="29" x2="59" y2="31" stroke="#00B8FF" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M6 22 L7.2 18 L8.4 22 L6 22Z" fill="#7FDBFF" opacity="0.8"/>
      <circle cx="7" cy="36" r="1.2" fill="#FF9770" opacity="0.6"/>
    </svg>`,
  "House Party": `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <path d="M10 30 L32 10 L54 30 L54 57 L10 57Z" fill="#00B8FF"/>
      <path d="M10 30 L32 10 L54 30 L48 30 L32 16 L16 30Z" fill="#0077B6"/>
      <path d="M48 30 L54 30 L54 57 L48 57Z" fill="#0077B6" opacity="0.45"/>
      <rect x="25" y="38" width="14" height="19" rx="3" fill="#FFD166"/>
      <rect x="25" y="38" width="14" height="6" rx="2" fill="#E6A817" opacity="0.7"/>
      <circle cx="37" cy="49" r="1.6" fill="#E6A817"/>
      <rect x="13" y="33" width="10" height="9" rx="2" fill="#FFF3B0"/>
      <line x1="18" y1="33" x2="18" y2="42" stroke="#E6A817" stroke-width="1.4"/>
      <line x1="13" y1="37.5" x2="23" y2="37.5" stroke="#E6A817" stroke-width="1.4"/>
      <rect x="41" y="33" width="10" height="9" rx="2" fill="#FFF3B0"/>
      <line x1="46" y1="33" x2="46" y2="42" stroke="#E6A817" stroke-width="1.4"/>
      <line x1="41" y1="37.5" x2="51" y2="37.5" stroke="#E6A817" stroke-width="1.4"/>
      <path d="M14 26 Q32 20 50 26" stroke="#FFD166" stroke-width="1.4" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M17 26 L15 21 L21 21Z" fill="#FFD166"/>
      <path d="M25 23 L23 18 L29 18Z" fill="#fff" opacity="0.85"/>
      <path d="M33 22 L31 17 L37 17Z" fill="#FFD166"/>
      <path d="M41 23 L39 18 L45 18Z" fill="#fff" opacity="0.85"/>
      <rect x="38" y="10" width="8" height="13" rx="2" fill="#0077B6"/>
      <circle cx="40" cy="8" r="2.5" fill="#fff" opacity="0.2"/>
      <circle cx="43" cy="5" r="2" fill="#fff" opacity="0.12"/>
      <rect x="7" y="57" width="50" height="3" rx="1.5" fill="#0077B6" opacity="0.7"/>
    </svg>`,
  Engagement: `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <ellipse cx="32" cy="44" rx="17" ry="10" fill="#00B8FF"/>
      <ellipse cx="32" cy="44" rx="11" ry="6.5" fill="#07070F"/>
      <path d="M16 40 Q18 35 25 33" stroke="#7FDBFF" stroke-width="2.5" stroke-linecap="round" opacity="0.75" fill="none"/>
      <path d="M28 50 Q38 51 46 46" stroke="#0077B6" stroke-width="2" stroke-linecap="round" opacity="0.5" fill="none"/>
      <path d="M23 35 L21 23 L26 28 L32 22 L38 28 L43 23 L41 35" fill="#00B8FF" stroke="#0077B6" stroke-width="1" stroke-linejoin="round"/>
      <line x1="23" y1="35" x2="41" y2="35" stroke="#0077B6" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M32 7 L43 18 L32 31 L21 18Z" fill="#FFD6A5"/>
      <path d="M21 18 L43 18" stroke="#E8A950" stroke-width="1.4" fill="none"/>
      <path d="M32 7 L21 18 L32 18" fill="#fff" opacity="0.45"/>
      <path d="M32 7 L43 18 L32 18" fill="#E8A950" opacity="0.25"/>
      <path d="M32 18 L21 18 L32 31" fill="#E8A950" opacity="0.3"/>
      <path d="M32 18 L43 18 L32 31" fill="#fff" opacity="0.15"/>
      <path d="M28 13 L32 18 L36 13" stroke="#fff" stroke-width="1" stroke-linejoin="round" opacity="0.6" fill="none"/>
      <path d="M32 7 L38 14 L32 14Z" fill="#FFB3C6" opacity="0.4"/>
      <line x1="32" y1="5" x2="32" y2="2" stroke="#FFD6A5" stroke-width="2" stroke-linecap="round"/>
      <line x1="29.5" y1="5.5" x2="27.5" y2="3.5" stroke="#FFD6A5" stroke-width="1.6" stroke-linecap="round"/>
      <line x1="34.5" y1="5.5" x2="36.5" y2="3.5" stroke="#FFD6A5" stroke-width="1.6" stroke-linecap="round"/>
      <line x1="50" y1="13" x2="50" y2="8" stroke="#FFB3C6" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="47.5" y1="10.5" x2="52.5" y2="10.5" stroke="#FFB3C6" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="48.4" y1="9" x2="51.6" y2="12" stroke="#FFB3C6" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
      <line x1="51.6" y1="9" x2="48.4" y2="12" stroke="#FFB3C6" stroke-width="1.2" stroke-linecap="round" opacity="0.5"/>
    </svg>`,
  "Corporate Event": `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <rect x="11" y="22" width="40" height="37" rx="4" fill="#00B8FF"/>
      <rect x="11" y="22" width="40" height="9" rx="4" fill="#023E8A"/>
      <path d="M51 26 L58 19 L58 57 L51 57Z" fill="#0077B6" opacity="0.8"/>
      <path d="M11 22 L18 15 L58 15 L51 22Z" fill="#90E0EF" opacity="0.45"/>
      <rect x="17" y="35" width="9" height="7" rx="1.5" fill="#CAF0F8" opacity="0.85"/>
      <rect x="29" y="35" width="9" height="7" rx="1.5" fill="#CAF0F8" opacity="0.85"/>
      <rect x="41" y="35" width="9" height="7" rx="1.5" fill="#CAF0F8" opacity="0.85"/>
      <rect x="17" y="46" width="9" height="7" rx="1.5" fill="#CAF0F8" opacity="0.85"/>
      <rect x="29" y="46" width="9" height="7" rx="1.5" fill="#CAF0F8" opacity="0.85"/>
      <rect x="41" y="46" width="9" height="7" rx="1.5" fill="#CAF0F8" opacity="0.85"/>
      <rect x="17" y="35" width="9" height="2.5" rx="1" fill="#fff" opacity="0.3"/>
      <rect x="29" y="35" width="9" height="2.5" rx="1" fill="#fff" opacity="0.3"/>
      <rect x="41" y="35" width="9" height="2.5" rx="1" fill="#fff" opacity="0.3"/>
      <rect x="26" y="45" width="10" height="14" rx="2" fill="#023E8A"/>
      <rect x="26" y="45" width="10" height="4" rx="1.5" fill="#90E0EF" opacity="0.4"/>
      <circle cx="34" cy="53" r="1.3" fill="#90E0EF"/>
      <line x1="32" y1="22" x2="32" y2="8" stroke="#CAF0F8" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M32 8 L44 11.5 L32 15Z" fill="#CAF0F8" opacity="0.9"/>
      <rect x="18" y="26" width="12" height="2" rx="1" fill="#CAF0F8" opacity="0.5"/>
      <rect x="18" y="30" width="8" height="1.5" rx="0.75" fill="#CAF0F8" opacity="0.3"/>
      <rect x="7" y="57" width="52" height="3" rx="1.5" fill="#023E8A" opacity="0.6"/>
    </svg>`,
  "Naming Ceremony": `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <circle cx="32" cy="22" r="14" fill="#FFB997"/>
      <path d="M20 27 Q24 34 32 34 Q40 34 44 27 Q40 32 32 32 Q24 32 20 27Z" fill="#0077B6" opacity="0.15"/>
      <path d="M18 18 Q18 7 32 7 Q46 7 46 18 Q42 13 32 13 Q22 13 18 18Z" fill="#06D6A0"/>
      <path d="M18 18 Q22 16 32 16 Q42 16 46 18 Q42 20 32 20 Q22 20 18 18Z" fill="#048A65" opacity="0.5"/>
      <path d="M18 19 Q14 23 12 28" stroke="#06D6A0" stroke-width="3" stroke-linecap="round" fill="none"/>
      <path d="M46 19 Q50 23 52 28" stroke="#06D6A0" stroke-width="3" stroke-linecap="round" fill="none"/>
      <circle cx="27" cy="22" r="2.8" fill="#fff"/>
      <circle cx="37" cy="22" r="2.8" fill="#fff"/>
      <circle cx="27.8" cy="22.8" r="1.4" fill="#00B8FF"/>
      <circle cx="37.8" cy="22.8" r="1.4" fill="#00B8FF"/>
      <circle cx="27.3" cy="22.3" r="0.5" fill="#fff"/>
      <circle cx="37.3" cy="22.3" r="0.5" fill="#fff"/>
      <path d="M27 28 Q32 33 37 28" stroke="#048A65" stroke-width="2" stroke-linecap="round" fill="none"/>
      <ellipse cx="22" cy="26" rx="3.5" ry="2.2" fill="#0077B6" opacity="0.15"/>
      <ellipse cx="42" cy="26" rx="3.5" ry="2.2" fill="#0077B6" opacity="0.15"/>
      <rect x="13" y="40" width="38" height="20" rx="4" fill="#00B8FF"/>
      <rect x="13" y="40" width="38" height="7" rx="4" fill="#048A65" opacity="0.6"/>
      <rect x="18" y="44" width="28" height="2.5" rx="1.25" fill="#fff" opacity="0.9"/>
      <rect x="21" y="50" width="22" height="2" rx="1" fill="#fff" opacity="0.55"/>
      <rect x="24" y="55" width="16" height="1.5" rx="0.75" fill="#fff" opacity="0.35"/>
      <rect x="30" y="36" width="4" height="5" rx="2" fill="#06D6A0"/>
      <path d="M7 28 L8.2 24 L9.4 28 L7 28Z" fill="#06D6A0" opacity="0.75"/>
      <circle cx="57" cy="32" r="1.5" fill="#FFB997" opacity="0.7"/>
    </svg>`,
  "Graduation Party": `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <circle cx="32" cy="47" r="10" fill="#00B8FF"/>
      <path d="M22 53 Q22 60 32 60 Q42 60 42 53" fill="#00B8FF"/>
      <path d="M24 53 Q24 59 32 59 Q40 59 40 53" fill="#0077B6" opacity="0.4"/>
      <path d="M7 27 L32 14 L57 27 L32 40Z" fill="#7B2FBE"/>
      <path d="M7 27 L32 14 L57 27 L32 33Z" fill="#BF8AE8" opacity="0.4"/>
      <path d="M15 29 L32 38 L49 29 L32 27Z" fill="#7B2FBE" opacity="0.7"/>
      <circle cx="32" cy="27" r="3.5" fill="#FFD166"/>
      <circle cx="32" cy="27" r="1.5" fill="#E6A817"/>
      <path d="M32 27 Q42 27 46 31 Q50 35 48 42" stroke="#FFD166" stroke-width="2.2" stroke-linecap="round" fill="none"/>
      <rect x="43" y="41" width="10" height="3" rx="1.5" fill="#FFD166"/>
      <line x1="44.5" y1="44" x2="43.5" y2="51" stroke="#FFD166" stroke-width="1.6" stroke-linecap="round"/>
      <line x1="48" y1="44" x2="48" y2="51" stroke="#FFD166" stroke-width="1.6" stroke-linecap="round"/>
      <line x1="51.5" y1="44" x2="52.5" y2="51" stroke="#FFD166" stroke-width="1.6" stroke-linecap="round"/>
      <rect x="5" y="44" width="20" height="14" rx="3" fill="#7B2FBE"/>
      <rect x="5" y="44" width="20" height="14" rx="3" stroke="#BF8AE8" stroke-width="1.4" fill="none"/>
      <rect x="5" y="44" width="4" height="14" rx="2" fill="#BF8AE8" opacity="0.6"/>
      <rect x="21" y="44" width="4" height="14" rx="2" fill="#BF8AE8" opacity="0.6"/>
      <line x1="10" y1="49" x2="20" y2="49" stroke="#fff" stroke-width="1.4" stroke-linecap="round" opacity="0.8"/>
      <line x1="10" y1="53" x2="20" y2="53" stroke="#fff" stroke-width="1.2" stroke-linecap="round" opacity="0.6"/>
      <line x1="12" y1="57" x2="20" y2="57" stroke="#fff" stroke-width="1" stroke-linecap="round" opacity="0.4"/>
      <line x1="55" y1="17" x2="55" y2="12" stroke="#FFD166" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="52.5" y1="14.5" x2="57.5" y2="14.5" stroke="#FFD166" stroke-width="2.2" stroke-linecap="round"/>
    </svg>`,
  "Festival Celebration": `<svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
      <path d="M5 59 L8 50 L36 16 L44 23 L13 52Z" fill="#FF6B6B"/>
      <path d="M8 50 L36 16 L40 19 L12 52Z" fill="#CC3333" opacity="0.45"/>
      <path d="M5 59 L8 50 L12 52 L9 59Z" fill="#fff" opacity="0.2"/>
      <ellipse cx="40" cy="19.5" rx="5.5" ry="4.5" transform="rotate(-40 40 19.5)" fill="#CC3333"/>
      <circle cx="46" cy="14" r="10" fill="#FFD166" opacity="0.2"/>
      <circle cx="46" cy="14" r="6.5" fill="#FFD166" opacity="0.35"/>
      <circle cx="46" cy="14" r="3.5" fill="#fff"/>
      <circle cx="46" cy="14" r="1.8" fill="#FF6B6B"/>
      <line x1="46" y1="7" x2="46" y2="5" stroke="#FFD166" stroke-width="2" stroke-linecap="round"/>
      <line x1="52" y1="8" x2="53.4" y2="6.6" stroke="#FFD166" stroke-width="2" stroke-linecap="round"/>
      <line x1="53" y1="14" x2="55" y2="14" stroke="#FFD166" stroke-width="2" stroke-linecap="round"/>
      <line x1="52" y1="20" x2="53.4" y2="21.4" stroke="#FFD166" stroke-width="2" stroke-linecap="round"/>
      <line x1="40" y1="7" x2="38.6" y2="5.6" stroke="#FFD166" stroke-width="2" stroke-linecap="round"/>
      <rect x="51" y="5" width="7" height="7" rx="2" fill="#FFD166" opacity="0.9" transform="rotate(20 54 8)"/>
      <rect x="54" y="22" width="6" height="6" rx="1.5" fill="#00B8FF" opacity="0.9" transform="rotate(-18 57 25)"/>
      <path d="M37 5 L41 1 L43 6Z" fill="#C8F564" opacity="0.85"/>
      <circle cx="54" cy="13" r="3.5" fill="#00B8FF" opacity="0.9"/>
      <circle cx="42" cy="4" r="3" fill="#C8F564" opacity="0.8"/>
      <circle cx="59" cy="22" r="2.5" fill="#FF6B6B" opacity="0.8"/>
      <circle cx="58" cy="8" r="1.8" fill="#fff" opacity="0.7"/>
      <path d="M48 6 Q54 2 58 7 Q62 12 58 18" stroke="#C8F564" stroke-width="2.2" stroke-linecap="round" fill="none" opacity="0.8"/>
      <path d="M38 5 Q42 1 45 5 Q48 9 45 14" stroke="#fff" stroke-width="2" stroke-linecap="round" fill="none" opacity="0.7"/>
      <line x1="26" y1="9" x2="26" y2="5" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="24" y1="7" x2="28" y2="7" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
      <line x1="24.6" y1="5.6" x2="27.4" y2="8.4" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity="0.5"/>
      <line x1="27.4" y1="5.6" x2="24.6" y2="8.4" stroke="#fff" stroke-width="1.3" stroke-linecap="round" opacity="0.5"/>
      <path d="M48 32 L52 27 L56 32Z" fill="#FFD166" opacity="0.7"/>
    </svg>`,
};

// Maps the labels used across the app to a canonical icon name above.
const ALIASES: Record<string, keyof typeof SVGS> = {
  birthday: "Birthday",
  "baby shower": "Baby Shower",
  anniversary: "Anniversary",
  farewell: "Farewell",
  "house party": "House Party",
  "house warming": "House Party",
  housewarming: "House Party",
  engagement: "Engagement",
  corporate: "Corporate Event",
  "corporate event": "Corporate Event",
  "naming ceremony": "Naming Ceremony",
  "naming": "Naming Ceremony",
  graduation: "Graduation Party",
  "graduation party": "Graduation Party",
  festival: "Festival Celebration",
  "festival celebration": "Festival Celebration",
  "festival / pooja": "Festival Celebration",
};

function resolveIconName(name: string): keyof typeof SVGS | null {
  const key = name.trim().toLowerCase();
  return ALIASES[key] ?? (name in SVGS ? (name as keyof typeof SVGS) : null);
}

/** True when a dedicated SVG exists for the given event/category label. */
export function hasEventIcon(name: string): boolean {
  return resolveIconName(name) !== null;
}

/**
 * Renders the dedicated multi-tone SVG for an event category. Returns null when
 * no icon matches the name — callers should fall back to their emoji/placeholder.
 */
export function EventIcon({
  name,
  size = 28,
  className,
}: {
  name: string;
  size?: number;
  className?: string;
}) {
  const resolved = resolveIconName(name);
  if (!resolved) return null;
  return (
    <span
      className={className}
      style={{ display: "inline-flex", width: size, height: size, lineHeight: 0 }}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: SVGS[resolved] }}
    />
  );
}
