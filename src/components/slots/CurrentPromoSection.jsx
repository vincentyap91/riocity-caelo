import React from 'react';
import {
    BROWSE_SUMMARY_CARD_COMPACT_CLASS,
    BROWSE_SUMMARY_CARD_SHELL_CLASS,
} from '../WalletRebateSummaryBar';
import { formatPromoAmount } from '../../utils/promoProgress';
import PromoProgress from './PromoProgress';

const VARIANT_CONFIG = {
    browse: {
        section: 'slot-current-promo soft-blue-panel rounded-[var(--radius-panel)] p-2.5 md:p-3',
        eyebrow: 'font-bold uppercase tracking-wide text-[var(--color-text-muted)]',
        name: 'font-bold normal-case text-[var(--color-brand-primary)]',
        headerText: 'flex min-w-0 flex-col gap-0.5 text-xs leading-snug text-[var(--color-text-muted)] md:flex-row md:flex-wrap md:items-baseline md:gap-0 sm:text-sm',
        innerCard: `${BROWSE_SUMMARY_CARD_SHELL_CLASS} ${BROWSE_SUMMARY_CARD_COMPACT_CLASS} slot-current-promo__card`,
        progressVariant: 'browse',
    },
    profile: {
        section:
            'profile-current-promo surface-card w-full rounded-2xl p-4 sm:p-6 md:p-8',
        eyebrow: 'profile-current-promo__eyebrow font-bold uppercase tracking-wide',
        name: 'profile-current-promo__name font-bold normal-case',
        headerText: 'flex min-w-0 flex-col gap-0.5 text-xs leading-snug md:flex-row md:flex-wrap md:items-baseline md:gap-0 sm:text-sm',
        innerCard: `profile-current-promo__card rounded-xl border p-3 sm:p-4 ${BROWSE_SUMMARY_CARD_COMPACT_CLASS}`,
        progressVariant: 'profile',
    },
};

/**
 * Active promotion summary — slots browse panel and profile dashboard.
 */
export default function CurrentPromoSection({
    promo,
    progressPercent,
    onEndPromo,
    variant = 'browse',
    className = '',
}) {
    if (!promo) return null;

    const styles = VARIANT_CONFIG[variant] ?? VARIANT_CONFIG.browse;
    const completedLabel = formatPromoAmount(promo.rolloverCompleted);
    const targetLabel = formatPromoAmount(promo.rolloverTarget);

    const endPromoButton = onEndPromo ? (
        <button
            type="button"
            onClick={onEndPromo}
            className="btn-theme-cta-soft inline-flex h-9 shrink-0 items-center justify-center rounded-[var(--radius-control)] px-3 text-xs font-bold transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-brand-primary)] sm:px-4 sm:text-sm"
        >
            End Promo
        </button>
    ) : null;

    return (
        <section aria-label="Current promotion" className={`${styles.section} ${className}`.trim()}>
            <div className="flex flex-col gap-0.5 md:gap-2">
                <div className="flex items-center justify-between gap-2 md:hidden">
                    <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                        <span className={styles.eyebrow}>Current Promo</span>
                        <p className={`${styles.name} text-xs leading-snug sm:text-sm`}>{promo.name}</p>
                    </div>
                    {endPromoButton ? <div className="flex shrink-0 items-center self-center">{endPromoButton}</div> : null}
                </div>

                <div className="hidden md:flex md:w-full md:flex-row md:flex-wrap md:items-center md:justify-between md:gap-2">
                    <p className={styles.headerText}>
                        <span className={styles.eyebrow}>Current Promo</span>
                        <span
                            className="mx-1.5 font-normal text-[var(--color-text-soft)]"
                            aria-hidden
                        >
                            ·
                        </span>
                        <span className={styles.name}>{promo.name}</span>
                    </p>
                    {endPromoButton ? <div className="shrink-0">{endPromoButton}</div> : null}
                </div>
            </div>

            <article className={`${styles.innerCard} mt-2 flex flex-col justify-center md:mt-3`}>
                <PromoProgress
                    percent={progressPercent}
                    completedLabel={completedLabel}
                    targetLabel={targetLabel}
                    variant={styles.progressVariant}
                />
            </article>
        </section>
    );
}
