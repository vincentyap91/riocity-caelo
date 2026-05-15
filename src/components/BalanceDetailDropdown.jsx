import React, { useState } from 'react';
import { RefreshCw, Info, ChevronDown } from 'lucide-react';

export default function BalanceDetailDropdown({ 
    onRefreshBalance, 
    balanceRefreshing, 
    className = "" 
}) {
    const [expandedMainWallet, setExpandedMainWallet] = useState(true);
    const [expandedGameWallet, setExpandedGameWallet] = useState(true);

    return (
        <div className={`dark-nav-shell flex w-[280px] flex-col overflow-hidden rounded-[24px] p-3 text-white animate-in fade-in slide-in-from-top-2 duration-200 ${className}`}>
            <div className="absolute inset-x-0 top-0 h-16 bg-[radial-gradient(circle_at_top,#29bbff55_0%,transparent_72%)] pointer-events-none" />
            
            <div className="relative z-10 mb-3 flex items-center justify-between px-1 text-white">
                <span className="text-sm font-bold tracking-wide">Balance Detail</span>
                <button
                    type="button"
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onRefreshBalance?.();
                    }}
                    disabled={!onRefreshBalance || balanceRefreshing}
                    className="inline-flex h-6 w-6 items-center justify-center rounded-[7px] border border-white/10 bg-[linear-gradient(180deg,#2a87d6_0%,#1b58ae_100%)] shadow-[var(--shadow-nav-pill)] transition hover:brightness-110 disabled:opacity-50"
                >
                    <RefreshCw size={12} className={`text-white/90 ${balanceRefreshing ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="relative z-10 flex flex-col gap-2">
                <div className="dark-nav-panel flex flex-col rounded-[18px] p-2.5">
                    <button
                        type="button"
                        onClick={() => setExpandedMainWallet(!expandedMainWallet)}
                        className="flex w-full items-center justify-between pb-0.5"
                    >
                        <div className="flex items-center gap-2">
                            <div className="inline-flex h-6 w-6 items-center justify-center rounded-[7px] bg-[linear-gradient(180deg,#2a87d6_0%,#1b58ae_100%)] text-[var(--color-nav-gold)] shadow-[var(--shadow-nav-pill)]">
                                <Info size={12} />
                            </div>
                            <span className="text-xs font-bold text-white">Main Wallet:</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold tracking-wide text-[var(--color-nav-gold)]">10.00</span>
                            <ChevronDown size={14} className={`text-white/60 transition-transform ${expandedMainWallet ? 'rotate-180' : ''}`} />
                        </div>
                    </button>
                    {expandedMainWallet && (
                        <div className="pl-8 pr-[22px] pt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-medium text-[var(--color-nav-text-soft)]">Royal Slot Gaming :</span>
                                <span className="font-bold tracking-wide text-[var(--color-nav-gold)]">10.00</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="dark-nav-panel flex flex-col rounded-[18px] p-2.5">
                    <button
                        type="button"
                        onClick={() => setExpandedGameWallet(!expandedGameWallet)}
                        className="flex w-full items-center justify-between pb-0.5"
                    >
                        <div className="flex items-center gap-2">
                            <div className="inline-flex h-6 w-6 items-center justify-center rounded-[7px] bg-[linear-gradient(180deg,#2a87d6_0%,#1b58ae_100%)] text-[var(--color-nav-gold)] shadow-[var(--shadow-nav-pill)]">
                                <Info size={12} />
                            </div>
                            <span className="text-xs font-bold text-white">Game Wallet:</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-bold tracking-wide text-[var(--color-nav-gold)]">5.00</span>
                            <ChevronDown size={14} className={`text-white/60 transition-transform ${expandedGameWallet ? 'rotate-180' : ''}`} />
                        </div>
                    </button>
                    {expandedGameWallet && (
                        <div className="pl-8 pr-[22px] pt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-medium text-[var(--color-nav-text-soft)]">Pragmatic Play :</span>
                                <span className="font-bold tracking-wide text-[var(--color-nav-gold)]">5.00</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
