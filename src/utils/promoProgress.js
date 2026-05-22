/**
 * Promo progress helpers (UI-agnostic).
 */

export function getRatioPercent(completed, target) {
    const targetNum = Number(target) || 0;
    const completedNum = Number(completed) || 0;

    if (targetNum <= 0) return 0;
    return Math.min(100, Math.max(0, (completedNum / targetNum) * 100));
}

export function getPromoProgressPercent(promo) {
    if (!promo) return 0;
    return getRatioPercent(promo.rolloverCompleted, promo.rolloverTarget);
}

export function getPromoTargetPercent(promo) {
    if (!promo) return 0;
    return getRatioPercent(promo.targetCompleted, promo.targetGoal);
}

export { formatRolloverAmount as formatPromoAmount } from '../constants/rolloverStatus';
