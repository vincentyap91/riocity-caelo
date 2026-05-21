import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

const RTP_HIGH_THRESHOLD = 96.5;

export default function RtpLabel({ value, className = '', variant = 'pill', compact = false }) {
    if (typeof value !== 'number') {
        return null;
    }

    const highRtp = value >= RTP_HIGH_THRESHOLD;
    const TrendIcon = highRtp ? TrendingUp : TrendingDown;
    const trendClass = highRtp ? 'text-[var(--color-success-main)]' : 'text-[var(--color-danger-main)]';

    if (variant === 'footer') {
        return (
            <span
                className={`inline-flex items-center justify-center gap-1 text-xs font-medium leading-tight text-white/90 ${className}`.trim()}
            >
                <span className="font-normal text-white/75">RTP:</span>
                <span className="text-white">{value.toFixed(2)}%</span>
                <TrendIcon
                    size={compact ? 12 : 13}
                    strokeWidth={2.5}
                    className={trendClass}
                    aria-hidden
                />
            </span>
        );
    }

    return (
        <span
            className={`inline-flex items-center gap-1 rounded-full border border-[var(--color-border-accent)] bg-[var(--color-accent-50)] px-2.5 py-1 text-[11px] font-bold leading-none text-[var(--color-accent-700)] ${className}`.trim()}
        >
            RTP {value.toFixed(2)}%
            <TrendIcon size={13} strokeWidth={2.5} className={trendClass} aria-hidden />
        </span>
    );
}
