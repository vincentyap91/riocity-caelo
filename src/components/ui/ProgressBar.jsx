import React from 'react';

const VARIANT_STYLES = {
    default: {
        track: 'bg-[var(--color-surface-muted)]',
        fill: 'bg-[linear-gradient(90deg,var(--color-accent-400)_0%,var(--color-accent-600)_100%)]',
    },
    dark: {
        track: 'bg-white/10',
        fill: 'bg-[linear-gradient(90deg,var(--color-cta-start)_0%,var(--color-cta-end)_100%)]',
    },
    'slot-promo': {
        track: 'bg-[var(--color-nav-border-soft)]',
        fill: 'bg-[linear-gradient(90deg,var(--color-accent-400)_0%,var(--color-accent-600)_100%)]',
    },
};

/**
 * Shared horizontal progress bar — use variant for surface context.
 */
export default function ProgressBar({ percent, variant = 'default', className = '' }) {
    const safePercent = Math.max(0, Math.min(100, Number(percent) || 0));
    const styles = VARIANT_STYLES[variant] ?? VARIANT_STYLES.default;

    return (
        <div
            className={`h-2 overflow-hidden rounded-full ${styles.track} ${className}`.trim()}
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(safePercent)}
        >
            <div
                className={`h-full rounded-full transition-[width] duration-500 ${styles.fill}`}
                style={{ width: `${safePercent}%` }}
            />
        </div>
    );
}
