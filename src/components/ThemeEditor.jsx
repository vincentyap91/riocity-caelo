import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BookMarked, ChevronDown, ChevronRight, Clipboard, Code, Download, Lock, MousePointer, RefreshCw, Replace, RotateCcw, Search, Settings, Sliders, Trash2, Unlock, Upload, X } from 'lucide-react';
import { BASIC_CONTROLS, getAllVariables, deriveLinkedColors } from './theme-editor/ThemeEditorConfig';
import ThemeEditorShowcase from './theme-editor/ThemeEditorShowcase';

// ─── Config ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'caelo-theme-editor-overrides';
const PROFILES_KEY = 'caelo-theme-editor-profiles';
const UNLOCK_KEY = 'developer_mode_active';
const CUSTOM_CSS_KEY = 'caelo-theme-editor-custom-css';
const LIVE_STYLE_ID = 'live-theme-overrides';
const DISCOVERED_KEY = 'caelo-theme-editor-discovered';
const PASSCODE = '1234';

/** Scan document.styleSheets for all CSS variables defined in :root */
function discoverRootVars() {
    const found = {};
    try {
        for (const sheet of document.styleSheets) {
            let rules;
            try { rules = sheet.cssRules || sheet.rules; } catch { continue; }
            for (const rule of rules) {
                if (rule.type !== 1) continue;
                const sel = (rule.selectorText || '').trim();
                if (sel !== ':root' && sel !== 'html') continue;
                for (let i = 0; i < rule.style.length; i++) {
                    const prop = rule.style[i];
                    if (prop.startsWith('--')) {
                        found[prop] = rule.style.getPropertyValue(prop).trim();
                    }
                }
            }
        }
    } catch { /* cross-origin etc */ }
    // Also include inline overrides
    const rootStyle = document.documentElement.style;
    for (let i = 0; i < rootStyle.length; i++) {
        const p = rootStyle[i];
        if (p.startsWith('--')) found[p] = rootStyle.getPropertyValue(p).trim();
    }
    return found;
}

/** Snapshot all current inline :root CSS var overrides */
function snapshotCurrentVars() {
    const style = document.documentElement.style;
    const map = {};
    for (let i = 0; i < style.length; i++) {
        const p = style[i];
        if (p.startsWith('--')) map[p] = style.getPropertyValue(p).trim();
    }
    return map;
}

// Collect all known controls for persistence
const ALL_DEFAULTS = getAllVariables();
const COLOR_CONTROLS = BASIC_CONTROLS;

// Fallback quick-insert variable chips (overridden by discovered vars at runtime)
const FALLBACK_QUICK_VARS = [
    '--color-brand-primary', '--color-brand-secondary', '--color-brand-deep',
    '--color-surface-base', '--color-surface-muted',
    '--color-text-strong', '--color-text-main',
    '--color-cta-start', '--color-cta-end',
    '--color-nav-top', '--color-nav-accent',
    '--color-success-main', '--color-danger-main',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function applyVar(name, value) {
    document.documentElement.style.setProperty(name, value);
}
function applyAll(map) {
    Object.entries(map).forEach(([k, v]) => applyVar(k, v));
}
function parseCssVars(text) {
    const result = {};
    const re = /(--[\w-]+)\s*:\s*([^;]+);/g;
    let m;
    while ((m = re.exec(text)) !== null) result[m[1].trim()] = m[2].trim();
    return result;
}
function buildCssBlock(map) {
    return `:root {\n${Object.entries(map).map(([k, v]) => `  ${k}: ${v};`).join('\n')}\n}`;
}

/** Inject or update a live <style> tag in <head> */
function injectLiveStyle(css) {
    let el = document.getElementById(LIVE_STYLE_ID);
    if (!el) {
        el = document.createElement('style');
        el.id = LIVE_STYLE_ID;
        document.head.appendChild(el);
    }
    el.textContent = css;
}
function removeLiveStyle() {
    document.getElementById(LIVE_STYLE_ID)?.remove();
}

/** Extract raw var() references from a computed style value */
function extractVarNames(el) {
    const inline = el.getAttribute('style') || '';
    const found = new Set();
    const varRe = /var\((--[\w-]+)/g;
    let m;
    while ((m = varRe.exec(inline)) !== null) found.add(m[1]);
    try {
        for (const sheet of document.styleSheets) {
            let rules;
            try { rules = sheet.cssRules; } catch { continue; }
            for (const rule of rules) {
                if (rule.type !== 1) continue;
                if (!el.matches(rule.selectorText)) continue;
                const text = rule.style.cssText;
                let v;
                const re2 = /var\((--[\w-]+)/g;
                while ((v = re2.exec(text)) !== null) found.add(v[1]);
            }
        }
    } catch { /* ignore */ }
    return [...found];
}

/** Normalize any CSS color (hex, rgb, rgba, named) to canonical "rgba(r,g,b,a)" string */
function normalizeColor(raw) {
    if (!raw || raw === 'transparent' || raw === 'rgba(0, 0, 0, 0)') return null;
    // Use a temporary element to resolve any color to rgb/rgba
    const tmp = document.createElement('div');
    tmp.style.color = raw;
    document.body.appendChild(tmp);
    const computed = getComputedStyle(tmp).color;
    tmp.remove();
    // Computed is always "rgb(r, g, b)" or "rgba(r, g, b, a)"
    const m = computed.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?\)/);
    if (!m) return null;
    const r = parseInt(m[1]), g = parseInt(m[2]), b = parseInt(m[3]), a = m[4] !== undefined ? parseFloat(m[4]) : 1;
    return `rgba(${r},${g},${b},${a})`;
}

/** Generate a unique CSS selector for an element */
function generateSelector(el) {
    if (el.id) return `#${CSS.escape(el.id)}`;
    const parts = [];
    let cur = el;
    while (cur && cur !== document.documentElement) {
        let segment = cur.tagName.toLowerCase();
        if (cur.id) { parts.unshift(`#${CSS.escape(cur.id)}`); break; }
        if (cur.className && typeof cur.className === 'string') {
            const cls = cur.className.trim().split(/\s+/).filter(c => !c.startsWith('te-')).slice(0, 2);
            if (cls.length) segment += '.' + cls.map(c => CSS.escape(c)).join('.');
        }
        const parent = cur.parentElement;
        if (parent) {
            const siblings = [...parent.children].filter(c => c.tagName === cur.tagName);
            if (siblings.length > 1) {
                const idx = siblings.indexOf(cur) + 1;
                segment += `:nth-of-type(${idx})`;
            }
        }
        parts.unshift(segment);
        cur = cur.parentElement;
    }
    return parts.join(' > ');
}

/** Check if a color value is a hardcoded literal (not from a CSS variable) */
function isHardcodedColor(value) {
    if (!value) return false;
    const v = value.trim();
    return (/^#[0-9a-fA-F]{3,8}$/.test(v) || /^rgba?\(/.test(v) || /^hsla?\(/.test(v));
}

function shouldRender() {
    if (typeof window === 'undefined') return false;
    const isDev = import.meta.env?.DEV === true || import.meta.env?.MODE === 'development';
    const hasFlag = new URLSearchParams(window.location.search).get('dev') === 'true';
    const isLiveUrl = window.location.hostname === 'riocity-v2.vercel.app';
    return isDev || hasFlag || isLiveUrl;
}

// ─── Persistent Selection Styles ──────────────────────────────────────────────

const SELECTION_STYLE_ID = 'theme-editor-selection-style';

function ensureSelectionStylesheet() {
    if (document.getElementById(SELECTION_STYLE_ID)) return;
    const style = document.createElement('style');
    style.id = SELECTION_STYLE_ID;
    style.textContent = `
@keyframes te-pulse {
  0%, 100% { outline-color: #10b981; }
  50% { outline-color: #34d399; }
}
.te-selected-el {
  outline: 3px solid #10b981 !important;
  outline-offset: 2px !important;
  animation: te-pulse 2s ease-in-out infinite !important;
}
`;
    document.head.appendChild(style);
}

function createFloatingLabel(text) {
    const label = document.createElement('div');
    label.className = 'te-selected-label';
    Object.assign(label.style, {
        position: 'absolute',
        zIndex: '2147483646',
        pointerEvents: 'none',
        background: '#10b981',
        color: '#fff',
        fontSize: '10px',
        fontWeight: '700',
        padding: '1px 7px',
        borderRadius: '5px',
        fontFamily: 'monospace',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        whiteSpace: 'nowrap',
        transform: 'translateY(-100%) translateY(-6px)',
    });
    label.textContent = text;
    return label;
}

function positionFloatingLabel(label, el) {
    const rect = el.getBoundingClientRect();
    label.style.left = `${rect.left + window.scrollX}px`;
    label.style.top = `${rect.top + window.scrollY}px`;
}

// ─── Tooltip ─────────────────────────────────────────────────────────────────

function CursorTooltip({ label, x, y }) {
    return (
        <div
            style={{
                position: 'fixed',
                left: x + 14,
                top: y + 14,
                zIndex: 2147483647,
                pointerEvents: 'none',
                background: '#1e40af',
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 6,
                fontFamily: 'monospace',
                boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
                whiteSpace: 'nowrap',
            }}
        >
            {label}
        </div>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function ThemeEditor() {
    if (!shouldRender()) return null;
    return <ThemeEditorInner />;
}

function ThemeEditorInner() {
    const [isUnlocked, setIsUnlocked] = useState(() => sessionStorage.getItem(UNLOCK_KEY) === 'true');
    const [showPasscodeModal, setShowPasscodeModal] = useState(false);
    const [passcodeInput, setPasscodeInput] = useState('');
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('controls');
    const [editorMode, setEditorMode] = useState('basic'); // 'basic' | 'advanced'
    const [customCss, setCustomCss] = useState(() => {
        try { return localStorage.getItem(CUSTOM_CSS_KEY) || ''; } catch { return ''; }
    });
    const advTextareaRef = useRef(null);

    // Schema Manager state
    const [discoveredVars, setDiscoveredVars] = useState(() => {
        try { return JSON.parse(localStorage.getItem(DISCOVERED_KEY) || 'null') || {}; } catch { return {}; }
    });
    const [showImportNames, setShowImportNames] = useState(false);
    const [importNamesText, setImportNamesText] = useState('');
    const [showImportCss, setShowImportCss] = useState(false);
    const [syncFeedback, setSyncFeedback] = useState(null);
    const [panelWidth, setPanelWidth] = useState(340);
    const isResizing = useRef(false);
    const [colors, setColors] = useState(() => {
        const saved = (() => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; } })();
        return COLOR_CONTROLS.reduce((acc, { variable, defaultValue }) => {
            acc[variable] = saved?.[variable] ?? defaultValue;
            return acc;
        }, {});
    });
    const [importText, setImportText] = useState('');
    const [importFeedback, setImportFeedback] = useState(null);
    const [copyFeedback, setCopyFeedback] = useState(false);

    // Inspector state
    const [inspecting, setInspecting] = useState(false);
    const [tooltip, setTooltip] = useState(null); 
    const [selectedVars, setSelectedVars] = useState([]); 
    const [flashPanel, setFlashPanel] = useState(false);
    const hoveredElRef = useRef(null);
    const profileFileRef = useRef(null);
    const selectedElRef = useRef(null);
    const floatingLabelRef = useRef(null);

    // Global Color Refactor state
    const [refactorColor, setRefactorColor] = useState(null); // { raw, normalized, property }
    const [refactorTargetVar, setRefactorTargetVar] = useState('');
    const [refactorMatches, setRefactorMatches] = useState(0);
    const [refactorBusy, setRefactorBusy] = useState(false);

    // ── Inject keyframes stylesheet once
    useEffect(() => { ensureSelectionStylesheet(); }, []);

    // Auto-discover CSS variables on mount
    useEffect(() => {
        const timer = setTimeout(() => {
            const found = discoverRootVars();
            if (Object.keys(found).length > 0) {
                setDiscoveredVars(prev => {
                    const merged = { ...prev, ...found };
                    localStorage.setItem(DISCOVERED_KEY, JSON.stringify(merged));
                    return merged;
                });
            }
        }, 500); // small delay to let stylesheets load
        return () => clearTimeout(timer);
    }, []);

    // ── Clear persistent selection helper
    const clearSelection = useCallback(() => {
        if (selectedElRef.current) {
            selectedElRef.current.classList.remove('te-selected-el');
            selectedElRef.current = null;
        }
        if (floatingLabelRef.current) {
            floatingLabelRef.current.remove();
            floatingLabelRef.current = null;
        }
    }, []);

    // ── Profile state
    const [profiles, setProfiles] = useState(() => {
        try { return JSON.parse(localStorage.getItem(PROFILES_KEY) || '[]'); } catch { return []; }
    });
    const [activeProfileName, setActiveProfileName] = useState(null);

    // Persist profiles
    useEffect(() => {
        localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles));
    }, [profiles]);

    const handleSaveProfile = useCallback(() => {
        const name = window.prompt('Enter a profile name:')?.trim();
        if (!name) return;
        const variables = { ...snapshotCurrentVars() };
        setColors((prev) => {
            Object.assign(variables, prev);
            return prev;
        });
        const css = customCss;
        setProfiles((prev) => {
            const filtered = prev.filter((p) => p.name !== name);
            return [...filtered, { name, variables, customCss: css }];
        });
        setActiveProfileName(name);
    }, [customCss]);

    const handleApplyProfile = useCallback((profile) => {
        clearSelection();
        applyAll(profile.variables);
        setColors((prev) => {
            const next = { ...prev };
            COLOR_CONTROLS.forEach(({ variable }) => {
                if (profile.variables[variable]) next[variable] = profile.variables[variable];
            });
            return next;
        });
        try {
            const ex = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...ex, ...profile.variables }));
        } catch { /* ignore */ }
        // Restore custom CSS from profile
        const css = profile.customCss || '';
        setCustomCss(css);
        injectLiveStyle(css);
        localStorage.setItem(CUSTOM_CSS_KEY, css);
        setActiveProfileName(profile.name);
    }, [clearSelection]);

    const handleDeleteProfile = useCallback((name) => {
        setProfiles((prev) => prev.filter((p) => p.name !== name));
        setActiveProfileName((cur) => cur === name ? null : cur);
    }, []);

    const handleExportProfiles = useCallback(() => {
        const blob = new Blob([JSON.stringify(profiles, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'themes.json';
        a.click();
        URL.revokeObjectURL(url);
    }, [profiles]);

    const handleImportProfilesFile = useCallback((e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const imported = JSON.parse(ev.target.result);
                if (!Array.isArray(imported)) throw new Error('Expected an array of profiles.');
                setProfiles((prev) => {
                    const existingNames = new Set(prev.map((p) => p.name));
                    const merged = [...prev, ...imported.filter((p) => p?.name && !existingNames.has(p.name))];
                    return merged;
                });
            } catch (err) {
                alert(`Import failed: ${err.message}`);
            }
        };
        reader.readAsText(file);
        e.target.value = '';
    }, []);

    // ── Persist / apply colors
    useEffect(() => {
        try {
            const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (saved) applyAll(saved);
        } catch { /* ignore */ }
        // Restore live custom CSS on mount
        if (customCss) injectLiveStyle(customCss);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        applyAll(colors);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
    }, [colors]);

    // ── Live-inject custom CSS whenever it changes
    useEffect(() => {
        injectLiveStyle(customCss);
        localStorage.setItem(CUSTOM_CSS_KEY, customCss);
    }, [customCss]);

    // ── Inspector teardown helper
    const teardownInspector = useCallback(() => {
        if (hoveredElRef.current) {
            hoveredElRef.current.style.outline = '';
            hoveredElRef.current.style.outlineOffset = '';
            hoveredElRef.current = null;
        }
        setTooltip(null);
        clearSelection();
    }, [clearSelection]);

    // ── Inspector event handlers
    const handleMouseMove = useCallback((e) => {
        const panel = document.getElementById('theme-editor-panel');
        if (panel?.contains(e.target)) {
            if (hoveredElRef.current) {
                hoveredElRef.current.style.outline = '';
                hoveredElRef.current = null;
            }
            setTooltip(null);
            return;
        }

        if (hoveredElRef.current && hoveredElRef.current !== e.target) {
            // Don't remove the persistent selection outline from the selected element
            if (hoveredElRef.current !== selectedElRef.current) {
                hoveredElRef.current.style.outline = '';
                hoveredElRef.current.style.outlineOffset = '';
            }
        }
        // Don't apply hover outline on the persistently selected element
        if (e.target === selectedElRef.current) {
            hoveredElRef.current = e.target;
            setTooltip({ label: e.target.tagName, x: e.clientX, y: e.clientY });
            return;
        }
        hoveredElRef.current = e.target;
        e.target.style.outline = '2px solid #3b82f6';
        e.target.style.outlineOffset = '1px';
        setTooltip({ label: e.target.tagName, x: e.clientX, y: e.clientY });
    }, []);

    const handleClick = useCallback((e) => {
        const panel = document.getElementById('theme-editor-panel');
        if (panel?.contains(e.target)) return;
        e.preventDefault();
        e.stopPropagation();

        const el = e.target;

        // ── Clear previous persistent selection
        clearSelection();

        const vars = extractVarNames(el);
        const computed = window.getComputedStyle(el);

        let resolvedVars;
        const resolved = vars.map((v) => ({
            variable: v,
            value: computed.getPropertyValue(v).trim() || getComputedStyle(document.documentElement).getPropertyValue(v).trim(),
        })).filter((r) => r.value);

        if (resolved.length === 0) {
            const fallback = ['background-color', 'color', 'border-color'].map((p) => ({
                variable: p,
                value: computed.getPropertyValue(p),
            })).filter((r) => r.value && r.value !== 'rgba(0, 0, 0, 0)' && r.value !== 'transparent');
            resolvedVars = fallback.length ? fallback : [{ variable: 'No CSS vars found', value: '' }];
        } else {
            resolvedVars = resolved;
        }
        setSelectedVars(resolvedVars);

        // ── Detect hardcoded colors for Global Replace
        const hardcodedColors = ['color', 'background-color', 'border-color'].map(prop => {
            const val = computed.getPropertyValue(prop).trim();
            return { property: prop, raw: val, normalized: normalizeColor(val) };
        }).filter(c => c.normalized && c.raw !== 'rgba(0, 0, 0, 0)' && c.raw !== 'transparent');

        // Only show refactor card if the element doesn't use CSS vars for this color
        const hasVarColor = vars.length > 0;
        if (hardcodedColors.length > 0 && !hasVarColor) {
            setRefactorColor(hardcodedColors[0]);
            setRefactorTargetVar('');
            setRefactorMatches(0);
        } else {
            setRefactorColor(null);
        }

        // ── Apply persistent emerald highlight
        // Remove hover outline first so they don't conflict
        el.style.outline = '';
        el.style.outlineOffset = '';
        el.classList.add('te-selected-el');
        selectedElRef.current = el;

        // ── Create floating label with primary variable name
        const primaryVar = resolvedVars[0]?.variable;
        if (primaryVar && primaryVar !== 'No CSS vars found') {
            const label = createFloatingLabel(primaryVar);
            document.body.appendChild(label);
            positionFloatingLabel(label, el);
            floatingLabelRef.current = label;
        }

        setOpen(true);
        setActiveTab('inspect');
        setFlashPanel(true);
        setTimeout(() => setFlashPanel(false), 600);
    }, [clearSelection]);

    // ── Attach / detach Inspector listeners
    useEffect(() => {
        if (!inspecting) {
            teardownInspector();
            return;
        }
        document.addEventListener('mousemove', handleMouseMove, true);
        document.addEventListener('click', handleClick, true);
        return () => {
            document.removeEventListener('mousemove', handleMouseMove, true);
            document.removeEventListener('click', handleClick, true);
            teardownInspector();
        };
    }, [inspecting, handleMouseMove, handleClick, teardownInspector]);

    useEffect(() => {
        if (!open) { setInspecting(false); setSelectedVars([]); }
    }, [open]);

    const handleColorChange = useCallback((variable, value) => {
        setColors((prev) => ({ ...prev, [variable]: value }));
    }, []);

    // ── Global Color Refactor handler
    const handleGlobalSwap = useCallback(() => {
        if (!refactorColor || !refactorTargetVar) return;
        setRefactorBusy(true);

        const targetNorm = refactorColor.normalized;
        const prop = refactorColor.property;
        const allEls = document.querySelectorAll('*');
        const panel = document.getElementById('theme-editor-panel');
        const matchedSelectors = [];
        const flashEls = [];

        allEls.forEach(el => {
            if (panel?.contains(el)) return;
            const cs = getComputedStyle(el);
            const val = cs.getPropertyValue(prop).trim();
            const norm = normalizeColor(val);
            if (norm === targetNorm) {
                try {
                    const sel = generateSelector(el);
                    matchedSelectors.push(sel);
                    flashEls.push(el);
                } catch { /* skip */ }
            }
        });

        if (matchedSelectors.length === 0) {
            setRefactorMatches(0);
            setRefactorBusy(false);
            return;
        }

        // Deduplicate selectors
        const uniqueSels = [...new Set(matchedSelectors)];

        // Build CSS block
        const cssProp = prop === 'background-color' ? 'background-color' : prop;
        const cssBlock = `\n/* --- Global Color Swaps --- */\n/* Swapped ${refactorColor.raw} → var(${refactorTargetVar}) */\n${uniqueSels.map(s => `${s} { ${cssProp}: var(${refactorTargetVar}) !important; }`).join('\n')}\n`;

        // Append to Advanced CSS editor
        setCustomCss(prev => {
            // Don't duplicate the same swap block
            const marker = `Swapped ${refactorColor.raw} → var(${refactorTargetVar})`;
            if (prev.includes(marker)) return prev;
            return prev + cssBlock;
        });

        setRefactorMatches(uniqueSels.length);

        // Visual feedback: flash matched elements
        flashEls.forEach(el => {
            el.style.transition = 'outline 0.3s, outline-offset 0.3s';
            el.style.outline = '3px solid #10b981';
            el.style.outlineOffset = '2px';
        });
        setTimeout(() => {
            flashEls.forEach(el => {
                el.style.outline = '';
                el.style.outlineOffset = '';
                el.style.transition = '';
            });
            setRefactorBusy(false);
        }, 1500);
    }, [refactorColor, refactorTargetVar]);

    // Smart-linked basic mode handler
    const handleBasicChange = useCallback((variable, value) => {
        handleColorChange(variable, value);
        const linked = deriveLinkedColors(variable, value);
        setColors((prev) => {
            const next = { ...prev, [variable]: value };
            Object.entries(linked).forEach(([k, v]) => {
                next[k] = v; applyVar(k, v);
            });
            return next;
        });
    }, [handleColorChange]);

    // Insert a variable reference at cursor position in the CSS editor
    const insertVarAtCursor = useCallback((varName) => {
        const snippet = `var(${varName})`;
        const ta = advTextareaRef.current;
        if (!ta) { setCustomCss((prev) => prev + snippet); return; }
        const start = ta.selectionStart;
        const end = ta.selectionEnd;
        setCustomCss((prev) => prev.slice(0, start) + snippet + prev.slice(end));
        requestAnimationFrame(() => { ta.selectionStart = ta.selectionEnd = start + snippet.length; ta.focus(); });
    }, []);

    // ── Schema Manager handlers
    const handleSyncSite = useCallback(() => {
        const found = discoverRootVars();
        const count = Object.keys(found).length;
        setDiscoveredVars(prev => {
            const merged = { ...prev, ...found };
            localStorage.setItem(DISCOVERED_KEY, JSON.stringify(merged));
            return merged;
        });
        setSyncFeedback({ type: 'ok', msg: `Synced! Found ${count} variables.` });
        setTimeout(() => setSyncFeedback(null), 3000);
    }, []);

    const handleImportNames = useCallback(() => {
        const lines = importNamesText.split(/[\n,;]+/).map(l => l.trim()).filter(Boolean);
        const newVars = {};
        lines.forEach(line => {
            // Support "--var-name" or "--var-name: value;" or just "var-name"
            const match = line.match(/^-{0,2}([\w-]+)(?:\s*:\s*(.+?))?;?$/);
            if (match) {
                const name = match[1].startsWith('-') ? `--${match[1]}` : `--${match[1]}`;
                const fullName = line.startsWith('--') ? line.replace(/\s*:.*/, '').trim() : name;
                const val = match[2]?.trim() || getComputedStyle(document.documentElement).getPropertyValue(fullName).trim() || '#000000';
                newVars[fullName] = val;
            }
        });
        const count = Object.keys(newVars).length;
        if (count === 0) {
            setSyncFeedback({ type: 'err', msg: 'No valid variable names found.' });
            setTimeout(() => setSyncFeedback(null), 3000);
            return;
        }
        setDiscoveredVars(prev => {
            const merged = { ...prev, ...newVars };
            localStorage.setItem(DISCOVERED_KEY, JSON.stringify(merged));
            return merged;
        });
        // Also add to colors state so they appear in Basic mode
        setColors(prev => {
            const next = { ...prev };
            Object.entries(newVars).forEach(([k, v]) => { if (!next[k]) next[k] = v; });
            return next;
        });
        setImportNamesText('');
        setShowImportNames(false);
        setSyncFeedback({ type: 'ok', msg: `Imported ${count} variable names.` });
        setTimeout(() => setSyncFeedback(null), 3000);
    }, [importNamesText]);

    const handleExportSchema = useCallback((format) => {
        // Gather all vars: discovered + colors + computed
        const allVars = { ...discoveredVars };
        Object.entries(colors).forEach(([k, v]) => { allVars[k] = v; });
        // Resolve any missing values from computed style
        Object.keys(allVars).forEach(k => {
            if (!allVars[k] || allVars[k] === '#000000') {
                const computed = getComputedStyle(document.documentElement).getPropertyValue(k).trim();
                if (computed) allVars[k] = computed;
            }
        });

        let content, filename, mime;
        if (format === 'json') {
            content = JSON.stringify(allVars, null, 2);
            filename = 'theme-schema.json';
            mime = 'application/json';
        } else {
            content = buildCssBlock(allVars);
            filename = 'theme-schema.css';
            mime = 'text/css';
        }
        const blob = new Blob([content], { type: mime });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
        setSyncFeedback({ type: 'ok', msg: `Exported as ${filename}` });
        setTimeout(() => setSyncFeedback(null), 3000);
    }, [discoveredVars, colors]);

    // Resize handlers
    const handleResizeStart = useCallback((e) => {
        e.preventDefault();
        isResizing.current = true;
        const startX = e.clientX;
        const startW = panelWidth;
        const onMove = (ev) => {
            if (!isResizing.current) return;
            setPanelWidth(Math.max(300, Math.min(800, startW + (ev.clientX - startX))));
        };
        const onUp = () => { isResizing.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
    }, [panelWidth]);

    const handleImport = useCallback(() => {
        const parsed = parseCssVars(importText);
        const count = Object.keys(parsed).length;
        if (count === 0) {
            setImportFeedback({ type: 'err', msg: 'No variables found.' });
            return;
        }
        applyAll(parsed);
        setColors((prev) => {
            const next = { ...prev };
            COLOR_CONTROLS.forEach(({ variable }) => { if (parsed[variable]) next[variable] = parsed[variable]; });
            return next;
        });
        try {
            const ex = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
            localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...ex, ...parsed }));
        } catch { /* ignore */ }
        setImportFeedback({ type: 'ok', msg: `Applied ${count} variables.` });
    }, [importText]);

    const handleCopyTheme = useCallback(() => {
        const map = snapshotCurrentVars();
        if (!Object.keys(map).length) {
            COLOR_CONTROLS.forEach(({ variable }) => {
                const v = getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
                if (v) map[variable] = v;
            });
        }
        navigator.clipboard.writeText(buildCssBlock(map)).then(() => {
            setCopyFeedback(true);
            setTimeout(() => setCopyFeedback(false), 2000);
        });
    }, []);

    const handleReset = useCallback(() => {
        const style = document.documentElement.style;
        const toRemove = [];
        for (let i = 0; i < style.length; i++) if (style[i].startsWith('--')) toRemove.push(style[i]);
        toRemove.forEach((p) => document.documentElement.style.removeProperty(p));
        localStorage.removeItem(STORAGE_KEY);
        setColors(COLOR_CONTROLS.reduce((acc, { variable, defaultValue }) => { acc[variable] = defaultValue; return acc; }, {}));
        // Also clear custom CSS
        setCustomCss('');
        removeLiveStyle();
        localStorage.removeItem(CUSTOM_CSS_KEY);
        setImportFeedback({ type: 'ok', msg: 'Reset to defaults.' });
    }, []);

    const handleUnlock = (e) => {
        e.preventDefault();
        if (passcodeInput === PASSCODE) {
            setIsUnlocked(true);
            sessionStorage.setItem(UNLOCK_KEY, 'true');
            setShowPasscodeModal(false);
            setPasscodeInput('');
            setOpen(true);
        } else {
            alert('Incorrect Passcode');
        }
    };

    const handleLock = () => {
        clearSelection();
        setIsUnlocked(false);
        sessionStorage.removeItem(UNLOCK_KEY);
        setOpen(false);
        setInspecting(false);
    };

    // Build dynamic quick-insert list from discovered vars
    const quickInsertVars = Object.keys(discoveredVars).length > 0
        ? Object.keys(discoveredVars).filter(v => v.startsWith('--color-') || v.startsWith('--gradient-')).sort()
        : FALLBACK_QUICK_VARS;

    // Build dynamic Basic mode controls from discovered + hardcoded
    const dynamicBasicControls = React.useMemo(() => {
        const seen = new Set(BASIC_CONTROLS.map(c => c.variable));
        const extras = Object.entries(discoveredVars)
            .filter(([k]) => !seen.has(k) && k.startsWith('--color-'))
            .map(([variable, defaultValue]) => ({
                label: variable.replace(/^--color-/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()),
                variable,
                defaultValue,
            }));
        return [...BASIC_CONTROLS, ...extras];
    }, [discoveredVars]);

    const TABS = [
        { id: 'controls', label: 'Controls' },
        { id: 'showcase', label: 'Showcase' },
        { id: 'profiles', label: 'Profiles' },
        { id: 'data', label: 'Data' },
        { id: 'inspect', label: 'Inspector', hidden: !selectedVars.length },
    ];

    return (
        <>
            {inspecting && tooltip && <CursorTooltip {...tooltip} />}

            {/* Passcode Modal */}
            {showPasscodeModal && (
                <div className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/40 backdrop-blur-sm">
                    <form onSubmit={handleUnlock} className="w-64 rounded-2xl border border-white/40 bg-white/80 p-6 shadow-2xl backdrop-blur-md">
                        <div className="mb-4 flex flex-col items-center gap-2">
                            <Lock className="text-[#123B94]" size={24} />
                            <h3 className="text-sm font-bold text-slate-800">Enter Passcode</h3>
                        </div>
                        <input
                            type="password"
                            autoFocus
                            value={passcodeInput}
                            onChange={(e) => setPasscodeInput(e.target.value)}
                            className="mb-4 w-full rounded-xl border border-slate-200 bg-white/50 px-4 py-2 text-center text-lg tracking-widest outline-none focus:border-[#123B94]"
                            placeholder="••••"
                        />
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setShowPasscodeModal(false)} className="flex-1 rounded-xl py-2 text-xs font-semibold text-slate-500 hover:bg-slate-100 transition">Cancel</button>
                            <button type="submit" className="flex-1 rounded-xl bg-[#123B94] py-2 text-xs font-bold text-white hover:bg-[#0d2a6a] transition">Unlock</button>
                        </div>
                    </form>
                </div>
            )}

            <div
                id="theme-editor-panel"
                style={{ fontFamily: "'Poppins', sans-serif", zIndex: 99999 }}
                className="fixed bottom-4 left-4 flex flex-col items-start gap-2"
            >
                {open && isUnlocked && (
                    <div
                        className={`rounded-2xl border border-white/40 bg-white/85 shadow-2xl backdrop-blur-md transition-all ${flashPanel ? 'ring-4 ring-blue-400/70' : ''}`}
                        style={{ maxHeight: '82vh', display: 'flex', flexDirection: 'column', width: panelWidth, position: 'relative' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between rounded-t-2xl border-b border-slate-100 bg-white/60 px-4 py-2.5">
                            <div className="flex items-center gap-2">
                                <Sliders size={14} className="text-[#123B94]" />
                                <span className="text-sm font-bold text-slate-800">Theme Editor</span>
                                <span className="rounded-full bg-amber-400 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-amber-900">DEV</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() => setInspecting((v) => !v)}
                                    title={inspecting ? 'Disable Inspector' : 'Enable Inspector Mode'}
                                    className={`rounded-lg p-1.5 transition ${inspecting ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-700'}`}
                                >
                                    <MousePointer size={13} />
                                </button>
                                <button type="button" onClick={handleCopyTheme} title="Copy theme CSS"
                                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">
                                    {copyFeedback ? <span className="text-[10px] font-semibold text-emerald-600">Copied!</span> : <Clipboard size={13} />}
                                </button>
                                <button type="button" onClick={handleReset} title="Reset to defaults"
                                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-red-50 hover:text-red-500">
                                    <RotateCcw size={13} />
                                </button>
                                <button type="button" onClick={handleLock} title="Lock Editor"
                                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-amber-50 hover:text-amber-600">
                                    <Lock size={13} />
                                </button>
                                <button type="button" onClick={() => setOpen(false)}
                                    className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600">
                                    <X size={13} />
                                </button>
                            </div>
                        </div>

                        {inspecting && (
                            <div className="flex items-center gap-2 border-b border-blue-100 bg-blue-50 px-4 py-1.5">
                                <span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
                                <span className="text-xs font-semibold text-blue-700">Inspector active</span>
                            </div>
                        )}

                        <div className="flex border-b border-slate-100">
                            {TABS.filter((t) => !t.hidden).map(({ id, label }) => (
                                <button key={id} type="button" onClick={() => setActiveTab(id)}
                                    className={`flex-1 py-2 text-xs font-semibold transition ${activeTab === id ? 'border-b-2 border-[#123B94] text-[#123B94]' : 'text-slate-400 hover:text-slate-600'}`}>
                                    {label}
                                </button>
                            ))}
                        </div>

                        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
                            {activeTab === 'controls' && (
                                <div className="space-y-2">
                                    {/* Mode Toggle */}
                                    <div style={{ display: 'flex', borderRadius: 10, border: '1px solid var(--color-border-default)', overflow: 'hidden', marginBottom: 8 }}>
                                        {['basic', 'advanced'].map(m => (
                                            <button key={m} type="button" onClick={() => setEditorMode(m)}
                                                style={{
                                                    flex: 1, padding: '7px 0', fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer',
                                                    background: editorMode === m ? 'var(--color-brand-primary)' : 'var(--color-surface-muted)',
                                                    color: editorMode === m ? '#fff' : 'var(--color-text-muted)',
                                                    transition: 'all .15s',
                                                }}>{m === 'basic' ? 'Basic' : 'Advanced'}</button>
                                        ))}
                                    </div>

                                    {editorMode === 'basic' && (
                                        <>
                                            <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
                                                {Object.keys(discoveredVars).length > 0
                                                    ? `${dynamicBasicControls.length} variables (auto-discovered + imported)`
                                                    : 'Brand primitives — linked colors auto-update'}
                                            </p>
                                            {dynamicBasicControls.map(({ label, variable, defaultValue }) => (
                                                <ColorRow
                                                    key={variable}
                                                    label={label}
                                                    variable={variable}
                                                    value={colors[variable] || getComputedStyle(document.documentElement).getPropertyValue(variable).trim() || defaultValue}
                                                    onChange={handleBasicChange}
                                                    highlighted={selectedVars.some((s) => s.variable === variable)}
                                                />
                                            ))}
                                        </>
                                    )}

                                    {editorMode === 'advanced' && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {/* Header */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <Code size={12} style={{ color: '#6366f1' }} />
                                                <span style={{ fontSize: 11, fontWeight: 700, color: '#334155' }}>Custom CSS Lab</span>
                                            </div>
                                            {/* Quick-insert variable suggestions (from discovered + imported) */}
                                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, maxHeight: 80, overflowY: 'auto' }}>
                                                {quickInsertVars.map(v => (
                                                    <button
                                                        key={v}
                                                        type="button"
                                                        onClick={() => insertVarAtCursor(v)}
                                                        style={{
                                                            padding: '2px 7px', borderRadius: 6, fontSize: 9, fontWeight: 600,
                                                            fontFamily: 'monospace', cursor: 'pointer', whiteSpace: 'nowrap',
                                                            border: '1px solid #e2e8f0', background: '#f8fafc', color: '#475569',
                                                            transition: 'all .15s',
                                                        }}
                                                        onMouseEnter={e => { e.currentTarget.style.background = '#dbeafe'; e.currentTarget.style.borderColor = '#93c5fd'; }}
                                                        onMouseLeave={e => { e.currentTarget.style.background = '#f8fafc'; e.currentTarget.style.borderColor = '#e2e8f0'; }}
                                                        title={`Insert var(${v})`}
                                                    >
                                                        {v.replace('--color-', '').replace('--gradient-', 'grad-').replace('--', '')}
                                                    </button>
                                                ))}
                                            </div>
                                            {/* CSS code editor */}
                                            <textarea
                                                ref={advTextareaRef}
                                                value={customCss}
                                                onChange={e => setCustomCss(e.target.value)}
                                                placeholder={`:root {\n  --color-brand-primary: #ff0000;\n}\n\n.my-button:hover {\n  background: var(--color-cta-start);\n}`}
                                                spellCheck={false}
                                                style={{
                                                    width: '100%', minHeight: 200, flex: 1,
                                                    padding: '10px 12px', borderRadius: 10,
                                                    border: '1px solid #e2e8f0', fontSize: 11,
                                                    fontFamily: "'Cascadia Code', 'Fira Code', 'JetBrains Mono', 'Consolas', monospace",
                                                    lineHeight: 1.6, color: '#1e293b',
                                                    background: '#fafbff', outline: 'none', resize: 'vertical',
                                                    tabSize: 2,
                                                }}
                                                onFocus={e => { e.currentTarget.style.borderColor = '#6366f1'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(99,102,241,0.1)'; }}
                                                onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.boxShadow = 'none'; }}
                                                onKeyDown={e => {
                                                    // Tab support in textarea
                                                    if (e.key === 'Tab') {
                                                        e.preventDefault();
                                                        const start = e.currentTarget.selectionStart;
                                                        const end = e.currentTarget.selectionEnd;
                                                        setCustomCss(prev => prev.slice(0, start) + '  ' + prev.slice(end));
                                                        requestAnimationFrame(() => { e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + 2; });
                                                    }
                                                }}
                                            />
                                            <p style={{ fontSize: 9, color: '#94a3b8', fontWeight: 500 }}>
                                                CSS is injected live into <code style={{ background: '#f1f5f9', padding: '1px 4px', borderRadius: 3 }}>&lt;style id="live-theme-overrides"&gt;</code>
                                            </p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'showcase' && (
                                <ThemeEditorShowcase />
                            )}

                            {activeTab === 'profiles' && (
                                <div className="space-y-3">
                                    <div className="flex gap-2">
                                        <button type="button" onClick={handleSaveProfile}
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#123B94] py-2 text-xs font-bold text-white transition hover:bg-[#0d2a6a]">
                                            <BookMarked size={12} /> Save Current
                                        </button>
                                        <button type="button" onClick={handleExportProfiles} disabled={!profiles.length}
                                            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50 disabled:opacity-40">
                                            <Download size={12} /> Export
                                        </button>
                                        <button type="button" onClick={() => profileFileRef.current?.click()}
                                            className="flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50">
                                            <Upload size={12} /> Import
                                        </button>
                                        <input ref={profileFileRef} type="file" accept=".json,application/json" onChange={handleImportProfilesFile} className="hidden" />
                                    </div>

                                    {profiles.length === 0 ? (
                                        <div className="rounded-xl border border-dashed border-slate-200 py-8 text-center text-xs text-slate-400">No profiles saved.</div>
                                    ) : (
                                        <div className="space-y-1.5">
                                            {profiles.map((profile) => (
                                                <div key={profile.name} className={`flex items-center gap-2 rounded-xl border px-3 py-2 transition ${activeProfileName === profile.name ? 'border-[#123B94]/40 bg-blue-50' : 'border-slate-100 bg-white/70 hover:border-slate-200 hover:bg-slate-50'}`}>
                                                    <button type="button" onClick={() => handleApplyProfile(profile)} className="flex-1 truncate text-left text-xs font-semibold text-slate-700">{profile.name}</button>
                                                    <button type="button" onClick={() => handleDeleteProfile(profile.name)} className="text-slate-300 hover:text-red-500"><Trash2 size={11} /></button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'data' && (
                                <div className="space-y-3">
                                    {/* ── Sync Section (Top) ── */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
                                        <Settings size={13} style={{ color: '#6366f1' }} />
                                        <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>Variable Schema Manager</span>
                                    </div>

                                    <div style={{
                                        padding: '8px 12px', borderRadius: 10,
                                        background: '#f0f9ff', border: '1px solid #bae6fd',
                                        fontSize: 11, fontWeight: 600, color: '#0369a1',
                                    }}>
                                        {Object.keys(discoveredVars).length} variables discovered on this page
                                    </div>

                                    <button
                                        type="button"
                                        onClick={handleSyncSite}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#123B94] py-2.5 text-xs font-bold text-white transition hover:bg-[#0d2a6a]"
                                    >
                                        <RefreshCw size={12} /> Sync with Site
                                    </button>

                                    {/* ── Import Section (Middle) ── */}
                                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 10 }}>
                                        {/* Accordion: Import Variable Names */}
                                        <button
                                            type="button"
                                            onClick={() => setShowImportNames(v => !v)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                                                padding: '8px 10px', borderRadius: 10, border: '1px solid #e2e8f0',
                                                background: showImportNames ? '#f8fafc' : '#fff', cursor: 'pointer',
                                                fontSize: 11, fontWeight: 700, color: '#334155',
                                                transition: 'all .15s',
                                            }}
                                        >
                                            {showImportNames ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                            <Upload size={11} style={{ color: '#6366f1' }} />
                                            Import Variable Names
                                        </button>
                                        {showImportNames && (
                                            <div style={{ marginTop: 8, paddingLeft: 4 }}>
                                                <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
                                                    Paste variable names (one per line, or comma-separated). Supports <code style={{ background: '#f1f5f9', padding: '1px 3px', borderRadius: 3 }}>--var: value;</code> format.
                                                </p>
                                                <textarea
                                                    value={importNamesText}
                                                    onChange={e => setImportNamesText(e.target.value)}
                                                    placeholder={`--color-brand-primary
--color-brand-secondary: #0d2a6a;
--my-custom-var`}
                                                    rows={4}
                                                    style={{
                                                        width: '100%', padding: '8px 10px', borderRadius: 9,
                                                        border: '1px solid #e2e8f0', fontSize: 11,
                                                        fontFamily: 'monospace', outline: 'none',
                                                        background: '#fafbff', resize: 'vertical',
                                                    }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleImportNames}
                                                    className="mt-2 w-full rounded-xl bg-[#123B94] py-2 text-xs font-bold text-white transition hover:bg-[#0d2a6a]"
                                                >
                                                    Parse & Import
                                                </button>
                                            </div>
                                        )}

                                        {/* Accordion: Import CSS Overrides */}
                                        <button
                                            type="button"
                                            onClick={() => setShowImportCss(v => !v)}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 6, width: '100%',
                                                padding: '8px 10px', borderRadius: 10, border: '1px solid #e2e8f0',
                                                background: showImportCss ? '#f8fafc' : '#fff', cursor: 'pointer',
                                                fontSize: 11, fontWeight: 700, color: '#334155',
                                                marginTop: 6, transition: 'all .15s',
                                            }}
                                        >
                                            {showImportCss ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                            <Code size={11} style={{ color: '#6366f1' }} />
                                            Import CSS Overrides
                                        </button>
                                        {showImportCss && (
                                            <div style={{ marginTop: 8, paddingLeft: 4 }}>
                                                <p style={{ fontSize: 10, color: '#64748b', fontWeight: 600, marginBottom: 4 }}>
                                                    Paste a <code style={{ background: '#f1f5f9', padding: '1px 3px', borderRadius: 3 }}>:root {'{ }'}</code> block or individual CSS variable declarations.
                                                </p>
                                                <textarea
                                                    value={importText}
                                                    onChange={(e) => { setImportText(e.target.value); setImportFeedback(null); }}
                                                    placeholder=":root { --var: val; }"
                                                    rows={5}
                                                    className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-mono text-[11px] text-slate-700 outline-none focus:border-[#123B94]"
                                                />
                                                {importFeedback && <p className="text-xs font-medium text-emerald-700">{importFeedback.msg}</p>}
                                                <button type="button" onClick={handleImport} className="mt-1 w-full rounded-xl bg-[#123B94] py-2 text-xs font-bold text-white hover:bg-[#0d2a6a]">Apply Overrides</button>
                                            </div>
                                        )}
                                    </div>

                                    {/* ── Export Section (Bottom) ── */}
                                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: 10 }}>
                                        <p style={{ fontSize: 10, fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                                            Export
                                        </p>
                                        <div className="flex gap-2" style={{ marginBottom: 6 }}>
                                            <button
                                                type="button"
                                                onClick={() => handleExportSchema('json')}
                                                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                            >
                                                <Download size={11} /> Schema JSON
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleExportSchema('css')}
                                                className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
                                            >
                                                <Download size={11} /> CSS :root
                                            </button>
                                        </div>
                                        <button type="button" onClick={handleCopyTheme}
                                            className="w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 transition hover:bg-slate-50"
                                        >
                                            <Clipboard size={11} className="inline mr-1.5" />
                                            {copyFeedback ? 'Copied!' : 'Copy Current Overrides'}
                                        </button>
                                    </div>

                                    {/* Feedback toast */}
                                    {syncFeedback && (
                                        <p style={{
                                            fontSize: 11, fontWeight: 600, padding: '6px 10px', borderRadius: 8,
                                            background: syncFeedback.type === 'ok' ? '#f0fdf4' : '#fef2f2',
                                            color: syncFeedback.type === 'ok' ? '#15803d' : '#dc2626',
                                            border: `1px solid ${syncFeedback.type === 'ok' ? '#bbf7d0' : '#fecaca'}`,
                                        }}>
                                            {syncFeedback.msg}
                                        </p>
                                    )}
                                </div>
                            )}

                            {activeTab === 'inspect' && (
                                <div className="space-y-2">
                                    {selectedVars.map(({ variable, value }, i) => {
                                        const known = COLOR_CONTROLS.find((c) => c.variable === variable);
                                        const isHex = /^#[0-9a-fA-F]{3,8}$/.test(value);
                                        return (
                                            <div key={i} className={`rounded-xl border px-3 py-2 ${known ? 'border-blue-200 bg-blue-50' : 'border-slate-100 bg-white/70'}`}>
                                                <p className="font-mono text-[10px] font-bold text-slate-500">{variable}</p>
                                                <div className="mt-1 flex items-center gap-2">
                                                    {isHex && <span className="h-5 w-5 rounded-md" style={{ background: value }} />}
                                                    <span className="flex-1 font-mono text-xs text-slate-700 truncate">{value}</span>
                                                    {isHex && <input type="color" value={value} onChange={(e) => { applyVar(variable, e.target.value); if (known) handleColorChange(variable, e.target.value); }} className="h-7 w-9 p-0.5 bg-transparent" />}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* ── Global Color Refactor Card ── */}
                                    {refactorColor && (
                                        <div style={{
                                            marginTop: 8, padding: '10px 12px', borderRadius: 12,
                                            border: '1px solid #fbbf24', background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                                                <Replace size={13} style={{ color: '#d97706' }} />
                                                <span style={{ fontSize: 11, fontWeight: 800, color: '#92400e' }}>Global Color Replace</span>
                                            </div>

                                            {/* Current hardcoded color */}
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                                                <div style={{
                                                    width: 28, height: 28, borderRadius: 6, border: '2px solid #d97706',
                                                    background: refactorColor.raw, flexShrink: 0,
                                                }} />
                                                <div>
                                                    <p style={{ fontSize: 10, fontWeight: 700, color: '#78350f', margin: 0 }}>Hardcoded color detected</p>
                                                    <p style={{ fontSize: 10, fontFamily: 'monospace', color: '#92400e', margin: 0 }}>
                                                        {refactorColor.raw} <span style={{ color: '#b45309', fontWeight: 400 }}>({refactorColor.property})</span>
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Variable selector */}
                                            <label style={{ fontSize: 10, fontWeight: 700, color: '#78350f', display: 'block', marginBottom: 3 }}>
                                                Replace with variable:
                                            </label>
                                            <VisualVariablePicker
                                                variables={Object.keys(discoveredVars).filter(v => v.startsWith('--color-')).sort()}
                                                value={refactorTargetVar}
                                                onChange={setRefactorTargetVar}
                                                inspectedEl={selectedElRef.current}
                                                inspectedProp={refactorColor?.property}
                                            />

                                            {/* Apply button */}
                                            <button
                                                type="button"
                                                disabled={!refactorTargetVar || refactorBusy}
                                                onClick={handleGlobalSwap}
                                                style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                                                    width: '100%', marginTop: 8, padding: '8px 0', borderRadius: 10,
                                                    border: 'none', cursor: refactorTargetVar ? 'pointer' : 'not-allowed',
                                                    background: refactorTargetVar ? '#d97706' : '#e5e7eb', color: '#fff',
                                                    fontSize: 11, fontWeight: 800, transition: 'all .15s',
                                                    opacity: refactorBusy ? 0.6 : 1,
                                                }}
                                            >
                                                <Replace size={12} />
                                                {refactorBusy ? 'Scanning...' : 'Apply Global Swap'}
                                            </button>

                                            {/* Results */}
                                            {refactorMatches > 0 && (
                                                <p style={{
                                                    marginTop: 6, fontSize: 10, fontWeight: 700, color: '#15803d',
                                                    padding: '4px 8px', borderRadius: 6, background: '#f0fdf4',
                                                    border: '1px solid #bbf7d0',
                                                }}>
                                                    ✓ Swapped {refactorMatches} selectors — check Advanced CSS editor
                                                </p>
                                            )}
                                            {refactorMatches === 0 && refactorBusy === false && refactorTargetVar && (
                                                <p style={{
                                                    marginTop: 6, fontSize: 10, fontWeight: 600, color: '#94a3b8',
                                                }}>
                                                    Select a variable and click Apply.
                                                </p>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        {/* Resize handle */}
                        <div
                            onMouseDown={handleResizeStart}
                            style={{
                                position: 'absolute', top: 0, right: -4, width: 8, height: '100%',
                                cursor: 'ew-resize', zIndex: 10,
                            }}
                            title="Drag to resize"
                        >
                            <div style={{
                                position: 'absolute', top: '50%', right: 2, transform: 'translateY(-50%)',
                                width: 3, height: 32, borderRadius: 3,
                                background: '#cbd5e1', opacity: 0.6,
                            }} />
                        </div>
                    </div>
                )}

                {/* FAB */}
                <button
                    type="button"
                    onClick={() => {
                        if (isUnlocked) {
                            setOpen((v) => !v);
                        } else {
                            setShowPasscodeModal(true);
                        }
                    }}
                    title="Toggle Theme Editor"
                    className={`flex h-11 w-11 items-center justify-center rounded-full shadow-xl transition hover:scale-105 active:scale-95 ${inspecting ? 'bg-blue-500 ring-4 ring-blue-300/50' : isUnlocked ? 'bg-[#123B94] hover:bg-[#0d2a6a]' : 'bg-slate-600 hover:bg-slate-700'} text-white`}
                >
                    {isUnlocked ? <Sliders size={18} /> : <Unlock size={18} />}
                </button>
            </div>
        </>
    );
}

function ColorRow({ label, variable, value, onChange, highlighted }) {
    const isHex = /^#[0-9a-fA-F]{6}$/.test(value);
    return (
        <div className={`flex items-center justify-between gap-2 rounded-xl border px-3 py-2 transition ${highlighted ? 'border-blue-300 bg-blue-50 ring-2 ring-blue-400/40' : 'border-slate-100 bg-white/70'}`}>
            <div className="min-w-0">
                <p className="truncate text-xs font-semibold text-slate-700">{label}</p>
                <p className="truncate font-mono text-[9px] text-slate-400">{variable}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
                <input type="color" value={isHex ? value : '#000000'} onChange={(e) => onChange(variable, e.target.value)} className="h-7 w-9 p-0.5 bg-transparent cursor-pointer" />
            </div>
        </div>
    );
}

// ─── Visual Variable Picker ───────────────────────────────────────────────────

function VisualVariablePicker({ variables, value, onChange, inspectedEl, inspectedProp }) {
    const [isOpen, setIsOpen] = useState(false);
    const [search, setSearch] = useState('');
    const containerRef = useRef(null);
    const searchRef = useRef(null);
    const prevColorRef = useRef(null);

    // Close on outside click
    useEffect(() => {
        if (!isOpen) return;
        const handler = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [isOpen]);

    // Focus search when opening
    useEffect(() => {
        if (isOpen) {
            requestAnimationFrame(() => searchRef.current?.focus());
        } else {
            setSearch('');
        }
    }, [isOpen]);

    // Group variables by prefix (e.g., "brand", "accent", "surface")
    const grouped = React.useMemo(() => {
        const filtered = variables.filter(v =>
            !search || v.toLowerCase().includes(search.toLowerCase())
        );
        const groups = {};
        filtered.forEach(v => {
            // Extract group: --color-brand-primary → "brand"
            const parts = v.replace(/^--color-/, '').split('-');
            const group = parts[0] || 'other';
            if (!groups[group]) groups[group] = [];
            groups[group].push(v);
        });
        return groups;
    }, [variables, search]);

    // Save original color for restoring after hover preview
    const saveOriginalColor = useCallback(() => {
        if (inspectedEl && inspectedProp && prevColorRef.current === null) {
            prevColorRef.current = inspectedEl.style.getPropertyValue(inspectedProp) || '';
        }
    }, [inspectedEl, inspectedProp]);

    const restoreOriginalColor = useCallback(() => {
        if (inspectedEl && inspectedProp && prevColorRef.current !== null) {
            if (prevColorRef.current) {
                inspectedEl.style.setProperty(inspectedProp, prevColorRef.current);
            } else {
                inspectedEl.style.removeProperty(inspectedProp);
            }
            prevColorRef.current = null;
        }
    }, [inspectedEl, inspectedProp]);

    const handleHover = useCallback((varName) => {
        if (!inspectedEl || !inspectedProp) return;
        saveOriginalColor();
        inspectedEl.style.setProperty(inspectedProp, `var(${varName})`);
    }, [inspectedEl, inspectedProp, saveOriginalColor]);

    const handleHoverEnd = useCallback(() => {
        restoreOriginalColor();
    }, [restoreOriginalColor]);

    const handleSelect = useCallback((varName) => {
        restoreOriginalColor();
        onChange(varName);
        setIsOpen(false);
    }, [onChange, restoreOriginalColor]);

    // Closed state display
    const selectedLabel = value || null;

    return (
        <div ref={containerRef} style={{ position: 'relative', width: '100%' }}>
            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setIsOpen(v => !v)}
                style={{
                    display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                    padding: '7px 10px', borderRadius: 9,
                    border: '1px solid #e2e8f0', background: '#fff',
                    cursor: 'pointer', transition: 'all .15s',
                    ...(isOpen ? { borderColor: '#3b82f6', boxShadow: '0 0 0 3px rgba(59,130,246,0.1)' } : {}),
                }}
            >
                {selectedLabel ? (
                    <>
                        <span style={{
                            width: 16, height: 16, borderRadius: '50%', flexShrink: 0,
                            border: '1.5px solid #cbd5e1',
                            background: `var(${selectedLabel})`,
                        }} />
                        <span style={{ flex: 1, textAlign: 'left', fontFamily: 'monospace', fontSize: 10, fontWeight: 600, color: '#334155', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {selectedLabel.replace('--color-', '')}
                        </span>
                    </>
                ) : (
                    <span style={{ flex: 1, textAlign: 'left', fontSize: 10, fontWeight: 600, color: '#94a3b8' }}>
                        Select a variable...
                    </span>
                )}
                <ChevronDown size={12} style={{ color: '#94a3b8', flexShrink: 0, transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform .2s' }} />
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div style={{
                    position: 'absolute', left: 0, right: 0, top: 'calc(100% + 4px)',
                    zIndex: 50, borderRadius: 12, overflow: 'hidden',
                    border: '1px solid #e2e8f0', background: '#fff',
                    boxShadow: '0 12px 28px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)',
                    display: 'flex', flexDirection: 'column',
                    maxHeight: 260,
                }}>
                    {/* Search */}
                    <div style={{ padding: '8px 8px 6px', borderBottom: '1px solid #f1f5f9', position: 'sticky', top: 0, background: '#fff', zIndex: 2 }}>
                        <div style={{ position: 'relative' }}>
                            <Search size={11} style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                            <input
                                ref={searchRef}
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search variables..."
                                style={{
                                    width: '100%', padding: '5px 8px 5px 26px', borderRadius: 7,
                                    border: '1px solid #e2e8f0', fontSize: 10, outline: 'none',
                                    fontFamily: 'monospace', background: '#fafbff',
                                }}
                                onFocus={e => { e.currentTarget.style.borderColor = '#3b82f6'; }}
                                onBlur={e => { e.currentTarget.style.borderColor = '#e2e8f0'; }}
                            />
                        </div>
                    </div>

                    {/* Grouped list */}
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {Object.keys(grouped).length === 0 && (
                            <div style={{ padding: '16px 12px', textAlign: 'center', fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>
                                No variables match "{search}"
                            </div>
                        )}
                        {Object.entries(grouped).map(([group, vars]) => (
                            <div key={group}>
                                {/* Sticky group header */}
                                <div style={{
                                    position: 'sticky', top: 0, zIndex: 1,
                                    padding: '4px 10px', fontSize: 9, fontWeight: 800,
                                    color: '#6366f1', textTransform: 'uppercase', letterSpacing: '0.06em',
                                    background: '#f8fafc', borderBottom: '1px solid #f1f5f9',
                                }}>
                                    {group}
                                </div>
                                {vars.map(v => {
                                    const isActive = v === value;
                                    return (
                                        <button
                                            key={v}
                                            type="button"
                                            onClick={() => handleSelect(v)}
                                            onMouseEnter={() => handleHover(v)}
                                            onMouseLeave={handleHoverEnd}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                                                padding: '5px 10px', border: 'none', cursor: 'pointer',
                                                background: isActive ? '#eff6ff' : 'transparent',
                                                transition: 'background .1s',
                                            }}
                                            onMouseOver={e => { if (!isActive) e.currentTarget.style.background = '#f8fafc'; }}
                                            onMouseOut={e => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
                                        >
                                            {/* Color swatch */}
                                            <span style={{
                                                width: 14, height: 14, borderRadius: '50%', flexShrink: 0,
                                                border: '1.5px solid #e2e8f0',
                                                background: `var(${v})`,
                                                boxShadow: isActive ? '0 0 0 2px #3b82f6' : 'none',
                                            }} />
                                            {/* Variable name */}
                                            <span style={{
                                                flex: 1, textAlign: 'left', fontFamily: 'monospace',
                                                fontSize: 10, fontWeight: isActive ? 700 : 500,
                                                color: isActive ? '#1e40af' : '#334155',
                                                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                                            }}>
                                                {v.replace('--color-', '')}
                                            </span>
                                            {isActive && (
                                                <span style={{ fontSize: 10, color: '#3b82f6', fontWeight: 800 }}>✓</span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
