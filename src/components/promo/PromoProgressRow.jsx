import React from 'react';
import { BROWSE_SUMMARY_LABEL_COMPACT_CLASS } from '../WalletRebateSummaryBar';
import ProgressBar from '../ui/ProgressBar';

/**
 * Single promo metric row — browse: inline label+values; balance dropdown: screenshot layout.
 */
export default function PromoProgressRow({
    label,
    completedLabel,
    targetLabel,
    percent,
    variant = 'browse',
    layout = 'inline',
    className = '',
}) {
    const safePercent = Math.max(0, Math.min(100, Number(percent) || 0));
    const roundedPercent = Math.round(safePercent);
    const isBalance = variant === 'balance';
    const isProfile = variant === 'profile';
    const isDropdown = isBalance && layout === 'split';

    if (isDropdown) {
        return (
            <div className={className}>
                <div className="flex min-w-0 items-center justify-between gap-2">
                    <p className="flex min-w-0 flex-1 items-baseline gap-1.5 truncate text-xs leading-snug">
                        <span className="shrink-0 font-medium balance-modal-text-primary">{label}</span>
                        <span className="truncate font-semibold tabular-nums balance-modal-text-secondary">
                            {completedLabel}
                            <span className="balance-modal-text-primary/40 font-medium">/</span>
                            {targetLabel}
                        </span>
                    </p>
                    <span className="shrink-0 text-xs font-semibold tabular-nums balance-modal-text-primary">
                        {roundedPercent}%
                    </span>
                </div>
                <ProgressBar
                    percent={safePercent}
                    variant="dark"
                    className="balance-modal-promo__bar mt-1.5 h-1.5"
                />
            </div>
        );
    }

    const labelClass = isBalance
        ? 'text-xs font-bold balance-modal-text-primary'
        : isProfile
          ? 'font-semibold leading-tight text-[var(--base-ink)] text-xs sm:text-sm'
          : BROWSE_SUMMARY_LABEL_COMPACT_CLASS;

    const valueClass = isBalance
        ? 'font-bold tabular-nums balance-modal-text-secondary'
        : isProfile
          ? 'font-bold tabular-nums text-[var(--base-ink)]'
          : 'font-bold tabular-nums text-[var(--color-brand-deep)]';

    const percentClass = isBalance
        ? 'shrink-0 text-xs font-bold tabular-nums balance-modal-text-primary'
        : isProfile
          ? 'shrink-0 text-xs font-bold tabular-nums text-[var(--base-ink)] sm:text-sm'
          : 'shrink-0 text-xs font-bold tabular-nums text-[var(--color-text-strong)] sm:text-sm';

    const separatorClass = isBalance
        ? 'font-semibold balance-modal-text-primary/50'
        : isProfile
          ? 'font-semibold text-[var(--color-text-muted)]'
          : 'font-semibold text-[var(--color-text-muted)]';

    return (
        <div className={className}>
            <div className="flex items-center justify-between gap-2">
                <p
                    className={`flex min-w-0 items-baseline gap-1.5 truncate text-xs leading-snug ${isBalance ? '' : 'sm:gap-2 sm:text-sm'}`}
                >
                    <span className={labelClass}>{label}</span>
                    <span className={valueClass}>
                        {completedLabel}
                        <span className={separatorClass}>/</span>
                        {targetLabel}
                    </span>
                </p>
                <span className={percentClass}>{roundedPercent}%</span>
            </div>
            <ProgressBar
                percent={safePercent}
                variant={isBalance ? 'dark' : 'default'}
                className="mt-1.5 h-1.5 sm:h-2"
            />
        </div>
    );
}
