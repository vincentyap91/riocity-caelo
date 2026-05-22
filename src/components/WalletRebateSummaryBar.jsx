import React from 'react';
import { Lock, RefreshCw } from 'lucide-react';

/** Matches ProductBrowseControlPanel: outer panel around WalletRebateSummaryBar (Slots / browse). */
export const WALLET_REBATE_BROWSE_PANEL_CLASS =
    'rounded-[24px] border border-[rgb(223_231_242)] bg-[linear-gradient(180deg,rgba(255,255,255,0.72)_0%,rgba(247,250,255,0.82)_100%)] px-2.5 py-2 shadow-[0_8px_24px_rgba(20,43,87,0.06)] backdrop-blur-sm md:px-4 md:py-4';

/** Shared inner card shell for slots browse summary tiles (wallet, promo, etc.). */
export const BROWSE_SUMMARY_CARD_SHELL_CLASS =
    'surface-card rounded-[var(--radius-panel)] border-[var(--color-border-default)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(250,252,255,0.94)_100%)] shadow-[var(--shadow-subtle)]';

export const BROWSE_SUMMARY_CARD_COMPACT_CLASS =
    'min-h-[56px] px-2.5 py-2.5 sm:min-h-[68px] sm:px-3.5 sm:py-3';

/** Typography aligned with compact denseMobile wallet/rebate tiles. */
export const BROWSE_SUMMARY_LABEL_COMPACT_CLASS =
    'font-semibold tracking-[-0.01em] leading-tight text-[var(--color-text-main)] text-xs sm:text-sm';

export const BROWSE_SUMMARY_VALUE_COMPACT_CLASS =
    'tabular-nums font-bold leading-tight tracking-[-0.03em] text-[var(--color-brand-deep)] text-base sm:text-lg md:text-xl';

function SummaryItem({
    title,
    value,
    icon: Icon,
    valueClassName = 'text-[var(--color-brand-deep)]',
    iconClassName = 'text-[var(--color-text-soft)]',
    emphasis = 'default',
    compact = false,
    denseMobile = false,
}) {
    const isPrimary = emphasis === 'primary';

    const compactLayoutClass = denseMobile
        ? 'min-h-[56px] gap-1.5 px-2.5 py-1.5 sm:min-h-[68px] sm:gap-2 sm:px-3.5 sm:py-2.5'
        : 'min-h-[64px] gap-2 px-3 py-2 sm:min-h-[68px] sm:px-3.5 sm:py-2.5';

    const valueSizeClass = (() => {
        if (!compact) {
            return isPrimary ? 'text-2xl font-bold sm:text-3xl' : 'text-2xl font-bold sm:text-3xl';
        }
        if (denseMobile) {
            return isPrimary
                ? 'text-base font-bold sm:text-lg sm:font-bold md:text-xl'
                : 'text-base font-bold sm:text-lg md:text-xl';
        }
        return isPrimary ? 'text-lg font-bold sm:text-xl' : 'text-lg font-bold sm:text-xl';
    })();

    const iconBtnClass = compact
        ? denseMobile
            ? 'h-7 w-7 sm:h-[30px] sm:w-[30px] md:h-[34px] md:w-[34px]'
            : 'h-[30px] w-[30px] sm:h-[34px] sm:w-[34px]'
        : 'h-9 w-9 sm:h-10 sm:w-10';

    const iconSize = compact ? (denseMobile ? 13 : 14) : 17;

    return (
        <article
            className={`${BROWSE_SUMMARY_CARD_SHELL_CLASS} flex h-full min-w-0 items-center justify-between ${compact ? compactLayoutClass : 'min-h-[86px] gap-3 px-4 py-3 sm:min-h-[92px] sm:px-4.5 sm:py-3.5'
                }`}
        >
            <div className="min-w-0 flex-1">
                <p
                    className={
                        compact && denseMobile
                            ? BROWSE_SUMMARY_LABEL_COMPACT_CLASS
                            : `font-semibold tracking-[-0.01em] text-[var(--color-text-main)] ${compact ? 'text-xs sm:text-sm' : 'text-sm'}`
                    }
                >
                    {title}
                </p>
                <p
                    className={`tabular-nums leading-tight tracking-[-0.03em] sm:leading-none ${valueClassName} ${compact && denseMobile ? BROWSE_SUMMARY_VALUE_COMPACT_CLASS : valueSizeClass}`}
                >
                    {value}
                </p>

            </div>

            <div className="flex shrink-0 items-start">
                <button
                    type="button"
                    aria-label={title}
                    className={`inline-flex items-center justify-center rounded-xl border border-[var(--color-border-default)] bg-[var(--color-surface-muted-soft)] ${iconClassName} ${iconBtnClass}`}
                >
                    <Icon size={iconSize} strokeWidth={2} />
                </button>
            </div>
        </article>
    );
}

export default function WalletRebateSummaryBar({
    wallet = '251.00',
    membershipRebate = '0.00%',
    className = '',
    compact = false,
    bare = false,
    denseMobile = false,
}) {
    const panelPad = compact
        ? denseMobile
            ? 'p-0 sm:p-1.5 md:p-2'
            : 'p-1.5 sm:p-2'
        : 'p-2.5 sm:p-3';

    const gridGap = compact
        ? denseMobile
            ? 'gap-1 sm:gap-1.5 md:gap-2'
            : 'gap-1.5 sm:gap-2'
        : 'gap-2.5 sm:gap-3';

    return (
        <section
            aria-label="Wallet and membership rebate summary"
            className={`${bare
                ? 'rounded-none border-0 bg-transparent p-0 shadow-none'
                : `surface-panel rounded-[calc(var(--radius-shell)-4px)] border-[var(--color-border-default)] bg-[linear-gradient(180deg,rgba(255,255,255,0.76)_0%,rgba(248,251,255,0.82)_100%)] shadow-[var(--shadow-subtle)] ${panelPad}`
                } ${className}`}
        >
            <div
                className={`grid ${denseMobile ? 'grid-cols-2' : 'sm:grid-cols-2'} ${gridGap}`}
            >
                <SummaryItem
                    title="Wallet Balance"
                    value={wallet}
                    icon={RefreshCw}
                    emphasis="primary"
                    compact={compact}
                    denseMobile={denseMobile}
                />
                <SummaryItem
                    title="Membership Rebate"
                    value={membershipRebate}
                    icon={Lock}
                    iconClassName="text-[var(--color-text-soft)]"
                    compact={compact}
                    denseMobile={denseMobile}
                />
            </div>
        </section>
    );
}

