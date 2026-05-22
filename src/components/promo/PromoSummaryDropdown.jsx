import React from 'react';
import { formatPromoAmount } from '../../utils/promoProgress';
import PromoProgressRow from './PromoProgressRow';

/**
 * Active promotion card for the header Balance Detail dropdown (matches balance modal UI).
 */
export default function PromoSummaryDropdown({
    promo,
    rolloverPercent,
    targetPercent,
    onEndPromo,
    className = '',
}) {
    if (!promo) return null;

    return (
        <section
            aria-label="Active promotion"
            className={`balance-modal-promo flex flex-col rounded-[18px] p-2.5 ${className}`.trim()}
        >
            <div className="flex items-center gap-2">
                <div className="min-w-0 flex-1">
                    <p className="balance-modal-promo__eyebrow text-xs font-semibold uppercase tracking-wide">
                        Active Promotion
                    </p>
                    <p className="balance-modal-text-primary mt-0.5 truncate text-sm font-bold leading-tight">
                        {promo.name}
                    </p>
                </div>
                {onEndPromo ? (
                    <button
                        type="button"
                        onClick={onEndPromo}
                        className="btn-theme-cta-soft inline-flex h-8 shrink-0 items-center justify-center rounded-[var(--radius-control)] px-3 text-xs font-bold shadow-[var(--shadow-cta-soft)] transition hover:brightness-105 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-nav-accent)]"
                    >
                        End Promo
                    </button>
                ) : null}
            </div>

            <div className="balance-modal-promo__metrics mt-2.5 flex flex-col gap-2.5 pt-2.5">
                <PromoProgressRow
                    label="Promo Rollover"
                    completedLabel={formatPromoAmount(promo.rolloverCompleted)}
                    targetLabel={formatPromoAmount(promo.rolloverTarget)}
                    percent={rolloverPercent}
                    variant="balance"
                    layout="split"
                />
                <PromoProgressRow
                    label="Target"
                    completedLabel={formatPromoAmount(promo.targetCompleted)}
                    targetLabel={formatPromoAmount(promo.targetGoal)}
                    percent={targetPercent}
                    variant="balance"
                    layout="split"
                />
            </div>
        </section>
    );
}
