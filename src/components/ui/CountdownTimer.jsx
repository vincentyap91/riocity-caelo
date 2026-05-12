import React, { useEffect, useState } from 'react';

/**
 * Calculates the time remaining until a given endDate.
 * Returns an object with days, hours, mins, secs and an expired flag.
 */
function getTimeRemaining(endDate) {
    const now = Date.now();
    const end = new Date(endDate).getTime();
    const diff = end - now;

    if (diff <= 0) {
        return { days: 0, hours: 0, mins: 0, secs: 0, expired: true };
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;

    return { days, hours, mins, secs, expired: false };
}

function pad(n) {
    return String(n).padStart(2, '0');
}

/* ─── Inline styles shared across renders ─────────────────────────────────── */

/** Gold-to-yellow gradient matching the CTA button */
const GOLD_GRADIENT =
    'linear-gradient(180deg, var(--color-cta-start) 0%, var(--color-cta-strong-end) 100%)';

/** Thin vertical rule between time units */
const DIVIDER = (
    <span
        aria-hidden="true"
        style={{
            display: 'block',
            width: '1px',
            alignSelf: 'stretch',
            background: 'rgba(0,0,0,0.10)',
            borderRadius: '1px',
            flexShrink: 0,
            margin: '2px 0',
        }}
    />
);

/**
 * CountdownTimer
 *
 * @param {string|Date} endDate      - The promotion end date/time.
 * @param {'card'|'modal'} size      - Typography scale ('card' = compact, 'modal' = larger).
 */
export default function CountdownTimer({ endDate, size = 'card', align = 'center' }) {
    const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(endDate));

    useEffect(() => {
        if (timeLeft.expired) return undefined;

        const interval = setInterval(() => {
            setTimeLeft(getTimeRemaining(endDate));
        }, 1000);

        return () => clearInterval(interval);
    }, [endDate, timeLeft.expired]);

    const isModal = size === 'modal';

    const units = [
        { value: pad(timeLeft.days), label: 'Days', isSec: false },
        { value: pad(timeLeft.hours), label: 'Hours', isSec: false },
        { value: pad(timeLeft.mins), label: 'Mins', isSec: false },
        { value: pad(timeLeft.secs), label: 'Sec', isSec: true },
    ];

    /* ── Sizing scales ─────────────────────────────────────────────────────── */
    const numSize = isModal ? '1.125rem' : '1rem';
    const labelSize = isModal ? '0.5625rem' : '0.5rem';
    const headerSize = isModal ? '0.6875rem' : '0.625rem';
    const unitGap = isModal ? '6px' : '4px';
    const cellPx = isModal ? '6px' : '4px';

    return (
        <div
            style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: align === 'right' ? 'flex-end' : align === 'left' ? 'flex-start' : 'center',
                gap: isModal ? '3px' : '6px',
                fontFamily: 'var(--font-family-primary)',
            }}
            aria-label={timeLeft.expired ? 'Promotion has ended' : 'Remaining time'}
            role="timer"
        >
            {/* ── Header ───────────────────────────────────────────────────── */}
            <span
                style={{
                    fontSize: headerSize,
                    fontWeight: 700,
                    color: 'var(--color-text-subtle)',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    lineHeight: 1.2,
                    textAlign: align,
                }}
            >
                Remaining Time
            </span>

            {timeLeft.expired ? (
                /* ── Expired state ───────────────────────────────────────── */
                <span
                    style={{
                        fontSize: headerSize,
                        fontWeight: 700,
                        color: 'var(--color-text-muted)',
                        letterSpacing: '0.03em',
                        textAlign: 'center',
                    }}
                >
                    Promotion Ended
                </span>
            ) : (
                /* ── Live countdown ──────────────────────────────────────── */
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'stretch',
                        gap: unitGap,
                        background: 'linear-gradient(135deg, rgba(255,255,255,0.72) 0%, rgba(255,248,230,0.55) 100%)',
                        border: '1px solid rgba(255,200,60,0.5)',
                        borderRadius: '10px',
                        padding: isModal ? '5px 12px' : '4px 10px',
                    }}
                >
                    {units.map(({ value, label, isSec }, idx) => (
                        <React.Fragment key={label}>
                            {/* Divider before every unit except the first */}
                            {idx > 0 && DIVIDER}

                            {/* ── Single time cell ─────────────────────── */}
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '2px',
                                    paddingLeft: cellPx,
                                    paddingRight: cellPx,
                                }}
                            >
                                {/* Number with gold gradient */}
                                <span
                                    className={isSec ? 'countdown-sec-pulse' : undefined}
                                    aria-label={`${value} ${label}`}
                                    style={{
                                        fontSize: numSize,
                                        fontWeight: 900,
                                        lineHeight: 1,
                                        letterSpacing: '-0.03em',
                                        fontVariantNumeric: 'tabular-nums',
                                        /* Gold gradient via background-clip trick */
                                        background: GOLD_GRADIENT,
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        backgroundClip: 'text',
                                        /* Fallback for browsers without background-clip */
                                        color: 'var(--color-cta-strong-end)',
                                        /* Ensure the gradient wrapper is inline-block */
                                        display: 'inline-block',
                                        filter: 'drop-shadow(0 1px 2px rgba(242,154,0,0.30))',
                                    }}
                                >
                                    {value}
                                </span>

                                {/* Unit label */}
                                <span
                                    style={{
                                        fontSize: labelSize,
                                        fontWeight: 700,
                                        color: 'var(--color-text-subtle)',
                                        letterSpacing: '0.04em',
                                        textTransform: 'uppercase',
                                    }}
                                >
                                    {label}
                                </span>
                            </div>
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
}
