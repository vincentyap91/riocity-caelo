import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Menu, RefreshCw, ChevronDown, Headset } from 'lucide-react';
import BalanceDetailDropdown from './BalanceDetailDropdown';

import LanguageSwitcher from './LanguageSwitcher';

/** When balance is long, show currency on line 1 and amount on line 2 (same string if no space). */
function getMobileBalanceLayout(balance) {
    const raw = String(balance ?? '').trim();
    const m = raw.match(/^(\S+)\s+(.+)$/);
    if (!m) {
        return { variant: 'single', text: raw };
    }
    const currency = m[1];
    const amount = m[2].trim();
    const long = raw.length > 14 || amount.length > 9;
    if (!long) {
        return { variant: 'single', text: raw };
    }
    return { variant: 'split', currency, amount };
}

export default function MobileSiteHeader({
    authUser,
    language,
    onLanguageChange,
    mobileMenuOpen = false,
    onMenuToggle,
    onNavigateHome,
    onProfileClick,
    onRefreshBalance,
    balanceRefreshing = false,
    onLoginClick,
    onRegisterClick,
    onLiveChatClick,
}) {
    const [balanceDropdownOpen, setBalanceDropdownOpen] = useState(false);
    const containerRef = useRef(null);
    const balanceLayout = useMemo(
        () => (authUser ? getMobileBalanceLayout(authUser.balance) : null),
        [authUser]
    );

    useEffect(() => {
        if (!balanceDropdownOpen) return undefined;

        const handlePointerDown = (event) => {
            if (!containerRef.current?.contains(event.target)) {
                setBalanceDropdownOpen(false);
            }
        };

        window.addEventListener('pointerdown', handlePointerDown);
        return () => window.removeEventListener('pointerdown', handlePointerDown);
    }, [balanceDropdownOpen]);

    return (
        <div className="relative z-[300] flex min-h-[56px] w-full items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 py-1.5 text-slate-900 md:hidden">
            <div className="flex min-w-0 flex-1 items-center gap-2 overflow-hidden">
                <button
                    type="button"
                    onClick={onMenuToggle}
                    className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-900 transition hover:border-slate-400 hover:bg-slate-50"
                    aria-label="Open mobile menu"
                    aria-expanded={mobileMenuOpen}
                >
                    <Menu size={16} />
                </button>
                <button
                    type="button"
                    onClick={onNavigateHome}
                    className="flex shrink-0 items-center py-1"
                >
                    <img
                        src="https://vj9.s3.ap-southeast-1.amazonaws.com/uploads/12W/website_logo/12winkh-Logo-d39.webp"
                        alt="12WIN Logo"
                        className="block h-[32px] w-auto max-w-[100px] object-contain object-left"
                    />
                </button>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-1.5">
                {authUser ? (
                    <>
                        <div
                            ref={containerRef}
                            className="relative inline-flex h-10 min-w-0 max-w-[min(13.75rem,calc(100vw-9.25rem))] shrink items-stretch rounded-xl border border-white/10 bg-[var(--color-brand-primary)] shadow-sm"
                        >
                            <button
                                type="button"
                                onClick={() => setBalanceDropdownOpen(!balanceDropdownOpen)}
                                className={`flex min-w-0 flex-1 touch-manipulation items-center gap-1 rounded-l-xl text-left transition hover:bg-white/[0.06] focus-visible:z-10 focus-visible:outline focus-visible:ring-2 focus-visible:ring-slate-300/70 focus-visible:ring-offset-0 ${balanceLayout?.variant === 'split'
                                        ? 'justify-center py-0.5 pl-2.5 pr-1.5'
                                        : 'h-full py-0 pl-2.5 pr-1.5'
                                    }`}
                                aria-label={`Open balance detail — ${authUser.balance} (${authUser.name})`}
                                title={authUser.name}
                            >
                                {balanceLayout?.variant === 'split' ? (
                                    <span className="flex min-w-0 flex-1 flex-col justify-center gap-px leading-none">
                                        <span className="text-[9px] font-semibold leading-none tracking-wide text-white/90">
                                            {balanceLayout.currency}
                                        </span>
                                        <span className="min-w-0 w-full truncate whitespace-nowrap text-[clamp(10px,2.9vw,12px)] font-extrabold tabular-nums leading-none tracking-tight text-white">
                                            {balanceLayout.amount}
                                        </span>
                                    </span>
                                ) : (
                                    <span className="min-w-0 flex-1 truncate whitespace-nowrap text-[clamp(11px,3.15vw,14px)] font-extrabold tabular-nums leading-none tracking-tight text-white">
                                        {balanceLayout?.text ?? authUser.balance}
                                    </span>
                                )}
                                <ChevronDown
                                    size={13}
                                    className={`shrink-0 text-white/80 transition-transform ${balanceDropdownOpen ? 'rotate-180' : ''}`}
                                />
                            </button>
                            <button
                                type="button"
                                onClick={(event) => {
                                    event.preventDefault();
                                    event.stopPropagation();
                                    onRefreshBalance?.();
                                }}
                                disabled={!onRefreshBalance || balanceRefreshing}
                                className="inline-flex h-full w-10 min-w-10 shrink-0 touch-manipulation items-center justify-center self-stretch rounded-r-xl border-l border-white/15 bg-transparent px-0.5 text-white/90 transition hover:bg-white/[0.08] hover:text-white disabled:pointer-events-none disabled:opacity-40"
                                aria-label="Refresh balance"
                                title="Refresh balance"
                            >
                                <RefreshCw
                                    size={14}
                                    strokeWidth={2.25}
                                    className={`shrink-0 ${balanceRefreshing ? 'animate-spin' : ''}`}
                                    aria-hidden
                                />
                            </button>

                            {balanceDropdownOpen && (
                                <BalanceDetailDropdown
                                    onRefreshBalance={onRefreshBalance}
                                    balanceRefreshing={balanceRefreshing}
                                    className="absolute right-0 top-[calc(100%+8px)] z-[350]"
                                />
                            )}
                        </div>
                        <LanguageSwitcher
                            value={language}
                            onChange={onLanguageChange}
                            buttonClassName="h-10 shrink-0 rounded-xl px-2"
                            tone="light"
                            showShortLabel={false}
                        />

                    </>
                ) : (
                    <>
                        <button
                            type="button"
                            onClick={onLoginClick}
                            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-white px-3 text-xs font-semibold text-slate-900 shadow-sm transition hover:border-slate-400 hover:bg-slate-50"
                        >
                            Login
                        </button>
                        <button
                            type="button"
                            onClick={onRegisterClick}
                            className="inline-flex h-10 shrink-0 items-center justify-center rounded-xl border border-slate-300 bg-[linear-gradient(180deg,#ffcf59_0%,#ffb62d_100%)] px-3 text-xs font-bold text-[#0c3f7e] shadow-[0_4px_12px_rgba(242,154,0,0.18)] transition hover:border-slate-400 hover:brightness-105"
                        >
                            Join
                        </button>
                        <LanguageSwitcher
                            value={language}
                            onChange={onLanguageChange}
                            buttonClassName="h-10 shrink-0 rounded-xl px-2"
                            tone="light"
                            showShortLabel={false}
                        />

                    </>
                )}
            </div>
        </div>
    );
}
