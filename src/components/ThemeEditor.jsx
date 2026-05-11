import React, { useCallback, useEffect, useRef, useState } from 'react';
import { BookMarked, Clipboard, Download, Lock, MousePointer, RotateCcw, Sliders, Trash2, Unlock, Upload, X } from 'lucide-react';

// ─── Config ───────────────────────────────────────────────────────────────────

const STORAGE_KEY = 'caelo-theme-editor-overrides';
const PROFILES_KEY = 'caelo-theme-editor-profiles';
const UNLOCK_KEY = 'developer_mode_active';
const PASSCODE = '1234';

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

const COLOR_CONTROLS = [
    { label: 'Brand Primary', variable: '--color-brand-primary', defaultValue: '#123B94' },
    { label: 'Brand Secondary', variable: '--color-brand-secondary', defaultValue: '#0d2a6a' },
    { label: 'CTA Start', variable: '--color-cta-start', defaultValue: '#ffcf4a' },
    { label: 'CTA End', variable: '--color-cta-end', defaultValue: '#ffb22d' },
    { label: 'Surface Base', variable: '--color-surface-base', defaultValue: '#ffffff' },
    { label: 'Surface Muted', variable: '--color-surface-muted', defaultValue: '#f8fafc' },
    { label: 'Text Strong', variable: '--color-text-strong', defaultValue: '#0f172a' },
    { label: 'Text Main', variable: '--color-text-main', defaultValue: '#334155' },
    { label: 'Nav Top', variable: '--color-nav-top', defaultValue: '#123B94' },
    { label: 'Nav Gold', variable: '--color-nav-gold', defaultValue: '#ffd84d' },
    { label: 'Success', variable: '--color-success-main', defaultValue: '#39B54A' },
    { label: 'Danger', variable: '--color-danger-main', defaultValue: '#ff5b2e' },
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

function shouldRender() {
    if (typeof window === 'undefined') return false;
    const isDev = import.meta.env?.DEV === true || import.meta.env?.MODE === 'development';
    const hasFlag = new URLSearchParams(window.location.search).get('dev') === 'true';
    return isDev || hasFlag;
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

    // ── Inject keyframes stylesheet once
    useEffect(() => { ensureSelectionStylesheet(); }, []);

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
        setProfiles((prev) => {
            const filtered = prev.filter((p) => p.name !== name);
            return [...filtered, { name, variables }];
        });
        setActiveProfileName(name);
    }, []);

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
    }, []);

    useEffect(() => {
        applyAll(colors);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(colors));
    }, [colors]);

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

    const TABS = [
        { id: 'controls', label: 'Controls' },
        { id: 'profiles', label: 'Profiles' },
        { id: 'import', label: 'Import/Export' },
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
                        className={`w-80 rounded-2xl border border-white/40 bg-white/85 shadow-2xl backdrop-blur-md transition-all ${flashPanel ? 'ring-4 ring-blue-400/70' : ''}`}
                        style={{ maxHeight: '82vh', display: 'flex', flexDirection: 'column' }}
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
                                    {COLOR_CONTROLS.map(({ label, variable }) => (
                                        <ColorRow
                                            key={variable}
                                            label={label}
                                            variable={variable}
                                            value={colors[variable]}
                                            onChange={handleColorChange}
                                            highlighted={selectedVars.some((s) => s.variable === variable)}
                                        />
                                    ))}
                                </div>
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

                            {activeTab === 'import' && (
                                <div className="space-y-3">
                                    <textarea
                                        value={importText}
                                        onChange={(e) => { setImportText(e.target.value); setImportFeedback(null); }}
                                        placeholder=":root { --var: val; }"
                                        rows={8}
                                        className="w-full rounded-xl border border-slate-200 bg-white/80 px-3 py-2 font-mono text-[11px] text-slate-700 outline-none focus:border-[#123B94]"
                                    />
                                    {importFeedback && <p className="text-xs font-medium text-emerald-700">{importFeedback.msg}</p>}
                                    <button type="button" onClick={handleImport} className="w-full rounded-xl bg-[#123B94] py-2 text-xs font-bold text-white hover:bg-[#0d2a6a]">Apply</button>
                                    <button type="button" onClick={handleCopyTheme} className="w-full rounded-xl border border-slate-200 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50">
                                        {copyFeedback ? 'Copied!' : 'Copy to Clipboard'}
                                    </button>
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
                                </div>
                            )}
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
