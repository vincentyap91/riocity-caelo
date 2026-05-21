import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Trophy } from 'lucide-react';
import PayoutCard from './PayoutCard';
import { MOCK_RECENT_PAYOUTS } from '../../constants/homeRecentPayout';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';
import {
    RECENT_PAYOUT_CAROUSEL_TRACK_CLASS,
    RECENT_PAYOUT_CAROUSEL_VIEWPORT_CLASS,
    RECENT_PAYOUT_CAROUSEL_WRAP_CLASS,
    RECENT_PAYOUT_HEADER_CLASS,
    RECENT_PAYOUT_PANEL_CLASS,
    RECENT_PAYOUT_SLIDE_INTERVAL_MS,
} from '../../constants/homeSections';

/** Duplicate feed so the viewport never shows empty space to the right of the track. */
const LOOP_COPY_COUNT = 2;

function buildLoopPayouts(payouts) {
    const loop = [];
    for (let copy = 0; copy < LOOP_COPY_COUNT; copy += 1) {
        payouts.forEach((item) => {
            loop.push({ ...item, loopKey: `${item.id}-c${copy}` });
        });
    }
    return loop;
}

/**
 * Recent Payout — stepped auto-advance carousel (all viewports); static scroll if reduced motion.
 */
export default function RecentPayoutSection({ onNavigate, payouts = MOCK_RECENT_PAYOUTS }) {
    const reducedMotion = usePrefersReducedMotion();
    const cycleLength = payouts.length;
    const loopPayouts = useMemo(() => buildLoopPayouts(payouts), [payouts]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    const slideNext = useCallback(() => {
        if (!cycleLength) return;
        setIsTransitioning(true);
        setCurrentIndex((prev) => prev + 1);
    }, [cycleLength]);

    const useAutoCarousel = !reducedMotion;

    useEffect(() => {
        if (!useAutoCarousel || isPaused || !cycleLength) {
            return undefined;
        }

        const timer = setInterval(slideNext, RECENT_PAYOUT_SLIDE_INTERVAL_MS);
        return () => clearInterval(timer);
    }, [useAutoCarousel, isPaused, cycleLength, slideNext]);

    const handleTransitionEnd = () => {
        if (currentIndex >= cycleLength) {
            setIsTransitioning(false);
            setCurrentIndex(0);
        }
    };

    useEffect(() => {
        if (!isTransitioning && currentIndex === 0) {
            const frame = requestAnimationFrame(() => setIsTransitioning(true));
            return () => cancelAnimationFrame(frame);
        }
        return undefined;
    }, [isTransitioning, currentIndex]);

    if (!cycleLength) {
        return null;
    }

    const viewportClass = [
        RECENT_PAYOUT_CAROUSEL_VIEWPORT_CLASS,
        reducedMotion && 'recent-payout-carousel-viewport--scroll',
    ]
        .filter(Boolean)
        .join(' ');

    const trackClass = [
        RECENT_PAYOUT_CAROUSEL_TRACK_CLASS,
        !useAutoCarousel && 'recent-payout-carousel-track--static',
        useAutoCarousel && !isTransitioning && 'recent-payout-carousel-track--instant',
    ]
        .filter(Boolean)
        .join(' ');

    const trackStyle =
        useAutoCarousel && isTransitioning
            ? { transform: `translateX(calc(-1 * ${currentIndex} * var(--payout-card-step)))` }
            : undefined;

    return (
        <section aria-label="Recent payout" className="w-full pt-3 md:pt-4">
            <div
                className={`${RECENT_PAYOUT_PANEL_CLASS} p-6`}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                onFocusCapture={() => setIsPaused(true)}
                onBlurCapture={(e) => {
                    if (!e.currentTarget.contains(e.relatedTarget)) {
                        setIsPaused(false);
                    }
                }}
            >
                <header className={RECENT_PAYOUT_HEADER_CLASS}>
                    <Trophy
                        size={18}
                        className="recent-payout-header__icon shrink-0 text-[var(--color-nav-accent)] md:hidden"
                        fill="currentColor"
                        strokeWidth={1.75}
                        aria-hidden
                    />
                    <Trophy
                        size={20}
                        className="recent-payout-header__icon hidden shrink-0 text-[var(--color-nav-accent)] md:block"
                        fill="currentColor"
                        strokeWidth={1.75}
                        aria-hidden
                    />
                    <h2 className="recent-payout-header__title">
                        <span>RECENT</span> PAYOUT
                    </h2>
                </header>

                <div className={RECENT_PAYOUT_CAROUSEL_WRAP_CLASS}>
                    <div
                        className={viewportClass}
                        role="region"
                        aria-label="Recent payout games"
                        aria-live={useAutoCarousel ? 'polite' : undefined}
                    >
                        <div
                            className={trackClass}
                            style={trackStyle}
                            onTransitionEnd={useAutoCarousel ? handleTransitionEnd : undefined}
                        >
                            {loopPayouts.map((item) => (
                                <PayoutCard
                                    key={item.loopKey}
                                    item={item}
                                    onNavigate={onNavigate}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
