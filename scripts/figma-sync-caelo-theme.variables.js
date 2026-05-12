/* Runs in Figma via use_figma (Plugin API). Syncs tokens from src/styles/theme.css :root */

/* ASCII name avoids Windows / JSON encoding issues with middle dot in · */
const COLL_NAME = "Caelo / theme.css";

function hexToRgba(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
  const n = parseInt(hex, 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255, a: 1 };
}

function parseModernRgb(input) {
  const m = String(input).match(
    /^rgba?\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+))?\s*\)$/i,
  );
  if (!m) throw new Error("Bad color: " + input);
  return {
    r: Number(m[1]) / 255,
    g: Number(m[2]) / 255,
    b: Number(m[3]) / 255,
    a: m[4] === undefined ? 1 : Number(m[4]),
  };
}

function parseColor(raw) {
  const s = String(raw).trim();
  if (s.startsWith("#")) return hexToRgba(s);
  if (s.startsWith("rgb")) return parseModernRgb(s);
  throw new Error("Unsupported color literal: " + raw);
}

function cssVar(figName) {
  return "var(--" + figName + ")";
}

const SC_ALL = ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR"];

const LEGACY_NAME = "Caelo · theme.css";
let coll = (await figma.variables.getLocalVariableCollectionsAsync()).find(
  (c) => c.name === COLL_NAME || c.name === LEGACY_NAME,
);
if (!coll) {
  coll = figma.variables.createVariableCollection(COLL_NAME);
  coll.renameMode(coll.modes[0].modeId, "Default");
} else if (coll.name !== COLL_NAME) {
  coll.name = COLL_NAME;
}
const modeId = coll.modes[0].modeId;

const existing = (await figma.variables.getLocalVariablesAsync()).filter(
  (v) => v.variableCollectionId === coll.id,
);
const exist = new Set(existing.map((v) => v.name));
let createdColors = 0;
let createdFloats = 0;
let createdStrings = 0;

function mkColor(figName, literal, scopes) {
  if (exist.has(figName)) return;
  const v = figma.variables.createVariable(figName, coll, "COLOR");
  v.scopes = scopes;
  v.setVariableCodeSyntax("WEB", cssVar(figName));
  v.setValueForMode(modeId, parseColor(literal));
  exist.add(figName);
  createdColors += 1;
}

function mkFloat(figName, value, scopes) {
  if (exist.has(figName)) return;
  const v = figma.variables.createVariable(figName, coll, "FLOAT");
  v.scopes = scopes;
  v.setVariableCodeSyntax("WEB", cssVar(figName));
  v.setValueForMode(modeId, value);
  exist.add(figName);
  createdFloats += 1;
}

function mkString(figName, value, scopes) {
  if (exist.has(figName)) return;
  const v = figma.variables.createVariable(figName, coll, "STRING");
  v.scopes = scopes;
  v.setVariableCodeSyntax("WEB", cssVar(figName));
  v.setValueForMode(modeId, String(value));
  exist.add(figName);
  createdStrings += 1;
}

const HEX_ROWS = `
color-brand-primary|#123B94
color-brand-secondary|#0d2a6a
color-brand-deep|#01206C
color-brand-soft|#E5F6FF
color-brand-soft-border|#CCEEFF
color-brand-line|#7AD0F5
color-page-home|#e6f4fd
color-page-register|#edf4ff
color-page-account|#eaf1fb
color-page-default|#f2f4f8
color-surface-base|#ffffff
color-surface-muted|#f8fafc
color-surface-subtle|#f8fbff
color-surface-panel|#f0f9ff
color-text-strong|#0f172a
color-text-main|#334155
color-text-subtle|#475569
color-text-muted|#64748b
color-text-soft|#94a3b8
color-text-brand|#123B94
color-text-brand-soft|#004C80
color-border-default|#e2e8f0
color-border-accent|#dbeafe
color-border-brand|#cfe0f9
color-border-brand-soft|#CCEEFF
color-border-live|#d5deef
color-accent-50|#eff6ff
color-accent-100|#dbeafe
color-accent-200|#bfdbfe
color-accent-300|#93c5fd
color-accent-400|#60a5fa
color-accent-500|#3b82f6
color-accent-600|#2563eb
color-accent-700|#1d4ed8
color-nav-top|#123B94
color-nav-main|#123B94
color-nav-text-soft|#d3eaff
color-nav-text-accent|#8ad4ff
color-nav-gold|#ffd84d
color-nav-gold-soft|#ffe27d
color-nav-blue-icon|#1f83ff
color-nav-blue-icon-hover|#5cc4ff
color-nav-badge|#2c66c3
color-success-main|#39B54A
color-success-hover|#2e9e3c
color-danger-main|#ff5b2e
color-hot-main|#ff4d00
color-cta-start|#ffcf4a
color-cta-end|#ffb22d
color-cta-strong-start|#ffcc33
color-cta-strong-end|#f29a00
color-cta-auth-start|#ffb255
color-cta-auth-end|#ff8e24
color-cta-border|#f0bb3d
color-cta-focus|#ffd166
color-cta-text|#0c4a8e
gradient-soft-panel-start|#ffffff
gradient-soft-panel-end|#f8fbff
gradient-blue-panel-start|#f8fbff
gradient-blue-panel-end|#eff6ff
gradient-account-shell-start|#f8fafc
gradient-account-shell-mid|#f0f9ff
gradient-account-shell-end|#ffffff
gradient-live-page-start|#eaf0ff
gradient-live-page-mid|#f6f9ff
gradient-live-page-end|#ecf1f9
gradient-register-page-start|#e8f4ff
gradient-register-page-mid|#f3f7ff
gradient-register-page-end|#ecf3ff
gradient-register-panel-mid|#d9ecff
gradient-register-panel-end|#c9e5ff
gradient-footer-start|#123B94
gradient-footer-end|#123B94
color-universal-modal-header-bg|#e8eef6
color-prime-light|#123B94
color-prime-dark|#0d2a6a
`
  .trim()
  .split(/\n/)
  .filter(Boolean);

const RGB_ROWS = `
color-surface-base-80|rgb(255 255 255 / 0.8)
color-surface-base-85|rgb(255 255 255 / 0.85)
color-surface-muted-soft|rgb(248 250 252 / 0.8)
color-nav-border|rgb(106 200 255 / 0.18)
color-nav-border-soft|rgb(106 200 255 / 0.12)
color-nav-tile-border|rgb(87 181 255 / 0.1)
color-nav-tile-border-hover|rgb(102 203 255 / 0.3)
color-nav-overlay|rgb(2 11 31 / 0.75)
`
  .trim()
  .split(/\n/)
  .filter(Boolean);

for (const row of HEX_ROWS) {
  const [n, hex] = row.split("|");
  mkColor(n, hex, SC_ALL);
}
for (const row of RGB_ROWS) {
  const [n, rgb] = row.split("|");
  mkColor(n, rgb, SC_ALL);
}

mkFloat("radius-control-xs", 9, ["CORNER_RADIUS"]);
mkFloat("radius-control-sm", 10, ["CORNER_RADIUS"]);
mkFloat("radius-control", 12, ["CORNER_RADIUS"]);
mkFloat("radius-xl", 15, ["CORNER_RADIUS"]);
mkFloat("radius-hero-banner", 16, ["CORNER_RADIUS"]);
mkFloat("radius-card-sm", 14, ["CORNER_RADIUS"]);
mkFloat("radius-card", 18, ["CORNER_RADIUS"]);
mkFloat("radius-panel", 20, ["CORNER_RADIUS"]);
mkFloat("radius-panel-lg", 22, ["CORNER_RADIUS"]);
mkFloat("radius-panel-xl", 24, ["CORNER_RADIUS"]);
mkFloat("radius-shell", 28, ["CORNER_RADIUS"]);
mkFloat("radius-hero", 30, ["CORNER_RADIUS"]);
mkFloat("radius-universal-modal", 14, ["CORNER_RADIUS"]);

mkFloat("layout-page-max", 1200, ["WIDTH_HEIGHT"]);
mkFloat("space-page-x", 16, ["GAP", "WIDTH_HEIGHT"]);
mkFloat("space-page-x-md", 32, ["GAP", "WIDTH_HEIGHT"]);
mkFloat("text-page-title", 24, ["FONT_SIZE"]);
mkFloat("text-page-title-md", 30, ["FONT_SIZE"]);
/* CSS uses -0.025em (~-0.4px at 16px root); Figma LETTER_SPACING is numeric px */
mkFloat("tracking-page-title", -0.4, ["LETTER_SPACING"]);

mkFloat("nav-side-promo-icon-size", 18, ["FONT_SIZE", "WIDTH_HEIGHT"]);

mkString(
  "font-family-primary",
  'Poppins, sans-serif',
  ["FONT_FAMILY"],
);
mkString(
  "font-family-sans",
  'Poppins, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',
  ["FONT_FAMILY"],
);
mkString(
  "font-family-multilingual",
  'Poppins, "Noto Sans SC", "Noto Sans TC", "Noto Sans Thai", "Noto Sans KR", "Noto Sans Devanagari", "Noto Sans Myanmar", "Noto Sans JP", "Segoe UI", "Microsoft YaHei UI", "Microsoft JhengHei UI", "Malgun Gothic", "Yu Gothic UI", "Leelawadee UI", "Nirmala UI", "Myanmar Text", sans-serif',
  ["FONT_FAMILY"],
);

mkString(
  "gradient-cta",
  "linear-gradient(180deg, var(--color-cta-start) 0%, var(--color-cta-end) 100%)",
  ["TEXT_CONTENT"],
);

const SHADOWS = {
  shadowSubtle: "0 1px 2px rgba(15, 23, 42, 0.04)",
  shadowInput: "0 1px 2px rgba(15, 23, 42, 0.03)",
  shadowCardSoft: "0 8px 24px rgba(15, 23, 42, 0.06)",
  shadowCardRaised: "0 10px 30px rgba(15, 23, 42, 0.08)",
  shadowCardHover: "0 12px 32px rgba(15, 23, 42, 0.1)",
  shadowSidebar: "0 24px 48px rgba(15, 23, 42, 0.14)",
  shadowAccent: "0 8px 24px rgba(37, 99, 235, 0.08)",
  shadowAccentAvatar: "0 8px 20px rgba(37, 99, 235, 0.12)",
  shadowBrandSoft: "0 2px 8px rgba(0, 174, 239, 0.08)",
  shadowBrandCard: "0 5px 15px rgba(0, 174, 239, 0.15)",
  shadowBrandCardStrong: "0 5px 15px rgba(0, 174, 239, 0.2)",
  shadowCta: "0 10px 20px rgba(242, 154, 0, 0.34)",
  shadowCtaSoft: "0 6px 12px rgba(255, 174, 39, 0.22)",
  shadowCtaAuth: "0 10px 16px rgba(255, 142, 36, 0.2)",
  shadowLiveCard: "0 8px 18px rgba(4, 16, 44, 0.09)",
  shadowLiveBanner: "0 14px 34px rgba(16, 32, 72, 0.16)",
  shadowLiveProvider: "0 8px 16px rgba(18, 34, 66, 0.08)",
  shadowLiveProviderHover: "0 14px 24px rgba(14, 35, 79, 0.18)",
  shadowHot: "0 4px 8px rgba(255, 77, 0, 0.35)",
  shadowNavTop: "0 8px 16px rgba(0, 73, 156, 0.2)",
  shadowNavDropdown: "0 20px 44px rgba(0, 16, 56, 0.4)",
  shadowNavPill: "0 8px 16px rgba(1, 22, 63, 0.25)",
  shadowNavTileHover: "0 14px 24px rgba(3, 22, 58, 0.34)",
  shadowSuccess: "0 0 8px rgba(57, 181, 74, 0.6)",
  shadowScan: "0 0 8px #00a8e8",
  shadowModal: "0 24px 50px rgba(10, 42, 97, 0.22)",
  shadowRegisterCard: "0 18px 35px rgba(10, 42, 97, 0.14)",
};

const SHADOW_NAME = {
  shadowSubtle: "shadow-subtle",
  shadowInput: "shadow-input",
  shadowCardSoft: "shadow-card-soft",
  shadowCardRaised: "shadow-card-raised",
  shadowCardHover: "shadow-card-hover",
  shadowSidebar: "shadow-sidebar",
  shadowAccent: "shadow-accent",
  shadowAccentAvatar: "shadow-accent-avatar",
  shadowBrandSoft: "shadow-brand-soft",
  shadowBrandCard: "shadow-brand-card",
  shadowBrandCardStrong: "shadow-brand-card-strong",
  shadowCta: "shadow-cta",
  shadowCtaSoft: "shadow-cta-soft",
  shadowCtaAuth: "shadow-cta-auth",
  shadowLiveCard: "shadow-live-card",
  shadowLiveBanner: "shadow-live-banner",
  shadowLiveProvider: "shadow-live-provider",
  shadowLiveProviderHover: "shadow-live-provider-hover",
  shadowHot: "shadow-hot",
  shadowNavTop: "shadow-nav-top",
  shadowNavDropdown: "shadow-nav-dropdown",
  shadowNavPill: "shadow-nav-pill",
  shadowNavTileHover: "shadow-nav-tile-hover",
  shadowSuccess: "shadow-success",
  shadowScan: "shadow-scan",
  shadowModal: "shadow-modal",
  shadowRegisterCard: "shadow-register-card",
};

const SC_STRING_DOC = ["TEXT_CONTENT"];

for (const k of Object.keys(SHADOWS)) {
  mkString(SHADOW_NAME[k], SHADOWS[k], SC_STRING_DOC);
}

mkString(
  "inset-highlight-soft",
  "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
  SC_STRING_DOC,
);
mkString(
  "inset-highlight-strong",
  "inset 0 1px 0 rgba(255, 255, 255, 0.2)",
  SC_STRING_DOC,
);
mkString("inset-panel", "inset 0 1px 2px rgba(31, 93, 168, 0.08)", SC_STRING_DOC);
mkString(
  "inset-white-glow",
  "inset 0 1px 0 rgba(255, 255, 255, 0.9)",
  SC_STRING_DOC,
);

mkString("animate-scan", "scan 1.5s linear infinite", SC_STRING_DOC);
mkString("animate-float", "float 5s ease-in-out infinite", SC_STRING_DOC);
mkString("animate-marquee", "marquee 11s linear infinite", SC_STRING_DOC);
mkString(
  "animate-home-big-wins-reveal",
  "home-big-wins-reveal 0.45s ease-out both",
  SC_STRING_DOC,
);

return {
  status: "ok",
  step: "literals",
  collectionId: coll.id,
  modeId,
  counts: {
    colors: createdColors,
    floats: createdFloats,
    strings: createdStrings,
    totalApprox: createdColors + createdFloats + createdStrings + existing.length,
  },
};
