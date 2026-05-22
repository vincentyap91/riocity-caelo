import { useCallback, useMemo, useState } from 'react';
import { DEMO_SLOT_CURRENT_PROMO } from '../constants/slotCurrentPromo';
import { getPromoProgressPercent, getPromoTargetPercent } from '../utils/promoProgress';

/**
 * Slots page promo state — keeps rollover math out of presentation components.
 */
export default function useSlotCurrentPromo(initialPromo = DEMO_SLOT_CURRENT_PROMO) {
    const [promo, setPromo] = useState(initialPromo);
    const [isActive, setIsActive] = useState(true);

    const progressPercent = useMemo(() => getPromoProgressPercent(promo), [promo]);
    const targetPercent = useMemo(() => getPromoTargetPercent(promo), [promo]);

    const endPromo = useCallback(() => {
        setIsActive(false);
    }, []);

    const restorePromo = useCallback((nextPromo = DEMO_SLOT_CURRENT_PROMO) => {
        setPromo(nextPromo);
        setIsActive(true);
    }, []);

    return {
        promo,
        isActive,
        progressPercent,
        targetPercent,
        endPromo,
        restorePromo,
        setPromo,
    };
}
