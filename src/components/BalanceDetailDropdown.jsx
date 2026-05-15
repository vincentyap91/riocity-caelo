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
        <div className={`balance-modal-container flex w-[280px] flex-col overflow-hidden p-3 animate-in fade-in slide-in-from-top-2 duration-200 ${className}`}>
            <div className="absolute inset-x-0 top-0 h-16 bg-[radial-gradient(circle_at_top,var(--color-nav-border)_0%,transparent_72%)] pointer-events-none" />
            
            <div className="relative z-10 mb-3 flex items-center justify-between px-1 balance-modal-text-primary">
                <span className="text-sm font-bold tracking-wide">Balance Detail</span>
                <button
                    type="button"
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onRefreshBalance?.();
                    }}
                    disabled={!onRefreshBalance || balanceRefreshing}
                    className="balance-modal-icon-box inline-flex h-6 w-6 items-center justify-center rounded-[7px] border border-[var(--balance-border-color)] shadow-[var(--shadow-nav-pill)] transition hover:brightness-110 disabled:opacity-50"
                >
                    <RefreshCw size={12} className={balanceRefreshing ? 'animate-spin' : ''} />
                </button>
            </div>

            <div className="relative z-10 flex flex-col gap-2">
                <div className="balance-modal-item flex flex-col rounded-[18px] p-2.5">
                    <button
                        type="button"
                        onClick={() => setExpandedMainWallet(!expandedMainWallet)}
                        className="flex w-full items-center justify-between pb-0.5"
                    >
                        <div className="flex items-center gap-2">
                            <div className="balance-modal-icon-box inline-flex h-6 w-6 items-center justify-center rounded-[7px] shadow-[var(--shadow-nav-pill)]">
                                <Info size={12} />
                            </div>
                            <span className="balance-modal-text-primary text-xs font-bold">Main Wallet:</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="balance-modal-text-secondary text-xs font-bold tracking-wide">10.00</span>
                            <ChevronDown size={14} className={`balance-modal-text-primary/60 transition-transform ${expandedMainWallet ? 'rotate-180' : ''}`} />
                        </div>
                    </button>
                    {expandedMainWallet && (
                        <div className="pl-8 pr-[22px] pt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-medium balance-modal-text-primary/70">Royal Slot Gaming :</span>
                                <span className="font-bold tracking-wide balance-modal-text-secondary">10.00</span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="balance-modal-item flex flex-col rounded-[18px] p-2.5">
                    <button
                        type="button"
                        onClick={() => setExpandedGameWallet(!expandedGameWallet)}
                        className="flex w-full items-center justify-between pb-0.5"
                    >
                        <div className="flex items-center gap-2">
                            <div className="balance-modal-icon-box inline-flex h-6 w-6 items-center justify-center rounded-[7px] shadow-[var(--shadow-nav-pill)]">
                                <Info size={12} />
                            </div>
                            <span className="balance-modal-text-primary text-xs font-bold">Game Wallet:</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="balance-modal-text-secondary text-xs font-bold tracking-wide">5.00</span>
                            <ChevronDown size={14} className={`balance-modal-text-primary/60 transition-transform ${expandedGameWallet ? 'rotate-180' : ''}`} />
                        </div>
                    </button>
                    {expandedGameWallet && (
                        <div className="pl-8 pr-[22px] pt-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
                            <div className="flex items-center justify-between text-xs">
                                <span className="font-medium balance-modal-text-primary/70">Pragmatic Play :</span>
                                <span className="font-bold tracking-wide balance-modal-text-secondary">5.00</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
