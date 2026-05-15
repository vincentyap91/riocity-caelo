import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FLAG_CDN = 'https://flagcdn.com/w40';
const LANGUAGES = [
    { code: 'en-us', label: 'English', flagCode: 'gb', short: 'EN' },
    { code: 'zh-cn', label: '简体中文', flagCode: 'cn', short: 'CN' },
    { code: 'zh-tw', label: '繁體中文', flagCode: 'tw', short: 'TW' },
    { code: 'th-th', label: 'ไทย', flagCode: 'th', short: 'TH' },
    { code: 'ko-kr', label: '한국어', flagCode: 'kr', short: 'KR' },
    { code: 'vi-vn', label: 'Tiếng Việt', flagCode: 'vn', short: 'VN' },
    { code: 'id-id', label: 'Indonesia', flagCode: 'id', short: 'ID' },
    { code: 'hi-in', label: 'हिन्दी', flagCode: 'in', short: 'IN' },
    { code: 'km-kh', label: 'Khmer', flagCode: 'kh', short: 'KH' },
    { code: 'my-mm', label: 'မြန်မာ', flagCode: 'mm', short: 'MM' },
    { code: 'ja-jp', label: '日本語', flagCode: 'jp', short: 'JP' },
];

export default function LanguageSwitcher({
    value = 'en-us',
    onChange,
    buttonClassName = 'h-7 rounded-[12px] px-3 py-1.5',
    tone = 'dark',
    showShortLabel = true,
}) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);
    const current = LANGUAGES.find((l) => l.code === value) ?? LANGUAGES[0];
    const isLightTone = tone === 'light';

    useEffect(() => {
        if (!open) return undefined;
        const handlePointerDown = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };
        window.addEventListener('pointerdown', handlePointerDown);
        return () => window.removeEventListener('pointerdown', handlePointerDown);
    }, [open]);

    return (
        <div ref={ref} className="relative isolate z-[999]">
            <button
                type="button"
                onClick={() => setOpen((o) => !o)}
                className={`flex items-center ${showShortLabel ? 'gap-1.5' : 'gap-1'} transition-all ${buttonClassName} ${
                    isLightTone
                        ? 'border border-slate-300 bg-white text-slate-900 shadow-[0_6px_14px_rgba(15,23,42,0.08)] hover:border-slate-400 hover:bg-slate-50'
                        : 'border border-white/25 bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.08)_100%)] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.14),0_8px_14px_rgba(0,0,0,0.12)] hover:border-white/40 hover:bg-[linear-gradient(180deg,rgba(255,255,255,0.18)_0%,rgba(255,255,255,0.1)_100%)]'
                }`}
                aria-haspopup="listbox"
                aria-expanded={open}
                aria-label={`Language: ${current.label}`}
            >
                <img
                    src={`${FLAG_CDN}/${current.flagCode}.png`}
                    alt=""
                    className="h-4 w-6 shrink-0 rounded-sm object-cover"
                />
                {showShortLabel ? <span className="text-xs font-bold">{current.short}</span> : null}
                <ChevronDown
                    size={12}
                    className={`transition-transform ${isLightTone ? 'text-slate-500' : 'text-white/75'} ${open ? 'rotate-180' : ''}`}
                />
            </button>

            {open && (
                <div
                    className={`absolute right-0 top-full z-[450] mt-2 w-[240px] max-w-[calc(100vw-1rem)] overflow-hidden rounded-[18px] py-1 shadow-[0_20px_44px_rgba(0,16,56,0.45)] backdrop-blur-xl ${
                        isLightTone
                            ? 'border border-slate-200 bg-white'
                            : 'border border-[var(--color-nav-border)] bg-[linear-gradient(180deg,#12458a_0%,#0e3570_42%,#0a2a56_74%,#081f41_100%)]'
                    }`}
                    role="listbox"
                >
                    <div
                        className={`pointer-events-none absolute inset-x-0 top-0 h-12 ${
                            isLightTone
                                ? 'bg-[linear-gradient(180deg,rgba(15,23,42,0.04)_0%,rgba(15,23,42,0.01)_38%,transparent_100%)]'
                                : 'bg-[linear-gradient(180deg,rgba(255,255,255,0.14)_0%,rgba(255,255,255,0.04)_38%,transparent_100%)]'
                        }`}
                    />
                    <div
                        className={`pointer-events-none absolute inset-x-0 bottom-0 h-14 ${
                            isLightTone
                                ? 'bg-[radial-gradient(circle_at_bottom,rgba(59,130,246,0.08)_0%,transparent_74%)]'
                                : 'bg-[radial-gradient(circle_at_bottom,rgba(0,174,239,0.14)_0%,transparent_74%)]'
                        }`}
                    />
                    {LANGUAGES.map((lang) => {
                        const isActive = value === lang.code;
                        return (
                            <button
                                key={lang.code}
                                type="button"
                                role="option"
                                aria-selected={isActive}
                                onClick={() => {
                                    onChange?.(lang.code);
                                    setOpen(false);
                                }}
                                className={`group relative flex w-full items-center gap-3 px-3.5 py-3 text-left text-sm font-semibold tracking-[0.01em] transition-colors duration-200 ${
                                    isLightTone
                                        ? `text-slate-900 ${
                                            isActive
                                                ? 'bg-slate-100 shadow-[inset_0_1px_0_rgba(15,23,42,0.04)]'
                                                : 'hover:bg-slate-50'
                                        }`
                                        : `text-white ${
                                            isActive
                                                ? 'bg-[linear-gradient(90deg,rgba(255,216,77,0.22)_0%,rgba(0,174,239,0.18)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]'
                                                : 'hover:bg-white/[0.06]'
                                        }`
                                }`}
                            >
                                <img
                                    src={`${FLAG_CDN}/${lang.flagCode}.png`}
                                    alt=""
                                    className="h-5 w-7 shrink-0 rounded-[4px] object-cover ring-1 ring-white/10"
                                />
                                <span className="font-multilingual min-w-0 flex-1 truncate">{lang.label}</span>
                                <span
                                    className={`ml-auto inline-flex h-2.5 w-2.5 shrink-0 rounded-full transition-opacity ${
                                        isActive
                                            ? isLightTone
                                                ? 'bg-[var(--color-brand-primary)] shadow-[0_0_0_4px_rgba(37,99,235,0.12)]'
                                                : 'bg-[var(--color-nav-accent)] shadow-[0_0_0_4px_rgba(255,216,77,0.18)]'
                                            : isLightTone
                                                ? 'bg-slate-400/0 opacity-0 group-hover:bg-slate-400/30 group-hover:opacity-100'
                                                : 'bg-white/0 opacity-0 group-hover:bg-white/30 group-hover:opacity-100'
                                    }`}
                                    aria-hidden="true"
                                />
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

