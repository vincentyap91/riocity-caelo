/* use_figma part 2: semantic aliases (--surface-base → --color-surface-base, etc.) */

const COLL_NAME = "Caelo / theme.css";
const SC_ALL = ["FRAME_FILL", "SHAPE_FILL", "TEXT_FILL", "STROKE_COLOR"];

function cssVar(figName) {
  return "var(--" + figName + ")";
}

const LEGACY_NAME = "Caelo · theme.css";
let coll = (await figma.variables.getLocalVariableCollectionsAsync()).find(
  (c) => c.name === COLL_NAME || c.name === LEGACY_NAME,
);
if (!coll) throw new Error("Missing collection — run literals sync first.");

const modeId = coll.modes[0].modeId;
let pool = (await figma.variables.getLocalVariablesAsync()).filter(
  (v) => v.variableCollectionId === coll.id,
);
const exist = new Set(pool.map((v) => v.name));

function pick(name) {
  const v = pool.find((x) => x.name === name);
  if (!v) throw new Error("Missing variable: " + name);
  return v;
}

let aliased = 0;

function aliasColor(figName, targetFigName, scopes) {
  if (exist.has(figName)) return;
  const src = pick(targetFigName);
  const v = figma.variables.createVariable(figName, coll, "COLOR");
  v.scopes = scopes;
  v.setVariableCodeSyntax("WEB", cssVar(figName));
  v.setValueForMode(modeId, { type: "VARIABLE_ALIAS", id: src.id });
  pool.push(v);
  exist.add(figName);
  aliased += 1;
}

function aliasString(figName, targetFigName, scopes) {
  if (exist.has(figName)) return;
  const src = pick(targetFigName);
  const v = figma.variables.createVariable(figName, coll, "STRING");
  v.scopes = scopes;
  v.setVariableCodeSyntax("WEB", cssVar(figName));
  v.setValueForMode(modeId, { type: "VARIABLE_ALIAS", id: src.id });
  pool.push(v);
  exist.add(figName);
  aliased += 1;
}

aliasColor("surface-base", "color-surface-base", ["FRAME_FILL", "SHAPE_FILL"]);
aliasColor("surface-utility-2", "color-brand-primary", SC_ALL);
aliasString("base-font-family", "font-family-primary", ["FONT_FAMILY"]);
aliasString("font-sans", "font-family-sans", ["FONT_FAMILY"]);

aliasColor("color-universal-modal-header-text", "color-brand-deep", ["TEXT_FILL"]);
aliasColor("color-universal-modal-game-body-bg", "color-surface-base", [
  "FRAME_FILL",
  "SHAPE_FILL",
]);
aliasColor("color-universal-modal-card-border", "color-border-brand", [
  "STROKE_COLOR",
]);

return { status: "ok", step: "aliases", collectionId: coll.id, aliasesCreated: aliased };
