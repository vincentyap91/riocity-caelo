import React from 'react';
import PromoProgressRow from '../promo/PromoProgressRow';

/**
 * Promo rollover row for the slots browse panel.
 */
export default function PromoProgress({
    percent,
    completedLabel,
    targetLabel,
    variant = 'browse',
    className = '',
}) {
    return (
        <PromoProgressRow
            label="Promo Rollover"
            completedLabel={completedLabel}
            targetLabel={targetLabel}
            percent={percent}
            variant={variant}
            className={className}
        />
    );
}
