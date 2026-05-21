import React, { Children } from 'react';
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion';

const SCROLL_TRACK_FLEX_CLASS =
    'flex snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-4 [&::-webkit-scrollbar]:hidden';

const SCROLL_TRACK_GRID_CLASS =
    'grid auto-cols-max grid-flow-col snap-x snap-mandatory gap-3 overflow-x-auto pb-2 pt-0.5 [-ms-overflow-style:none] [scrollbar-width:none] md:gap-4 [&::-webkit-scrollbar]:hidden';

const MARQUEE_ROW_FLEX_CLASS = 'flex shrink-0 items-stretch gap-3 md:gap-4';
const MARQUEE_ROW_GRID_CLASS = 'grid shrink-0 auto-cols-max grid-flow-col items-stretch gap-3 md:gap-4';

/**
 * Infinite horizontal marquee on all viewports (auto-starts via CSS).
 * Set enableMobileScroll to show a static snap-scroll row on small screens instead.
 * Duplicates children once for seamless -50% translate loop.
 */
export default function HomeHorizontalMarquee({
    children,
    ariaLabel,
    className = '',
    durationSeconds = 36,
    enableMobileScroll = false,
    trackLayout = 'flex',
    reverse = false,
}) {
    const reducedMotion = usePrefersReducedMotion();
    const useGrid = trackLayout === 'grid';
    const scrollTrackClass = useGrid ? SCROLL_TRACK_GRID_CLASS : SCROLL_TRACK_FLEX_CLASS;
    const marqueeRowClass = useGrid ? MARQUEE_ROW_GRID_CLASS : MARQUEE_ROW_FLEX_CLASS;
    const items = Children.toArray(children).filter(Boolean);

    if (!items.length) {
        return null;
    }

    const itemNodes = items.map((child, index) => (
        <div key={`marquee-item-${index}`} className="shrink-0 snap-start">
            {child}
        </div>
    ));

    if (reducedMotion) {
        return (
            <div
                className={`${scrollTrackClass} ${className}`.trim()}
                aria-label={ariaLabel}
                role={ariaLabel ? 'region' : undefined}
            >
                {itemNodes}
            </div>
        );
    }

    const duplicatedNodes = items.map((child, index) => (
        <div key={`marquee-dup-${index}`} className="shrink-0">
            {child}
        </div>
    ));

    const animClass = reverse ? 'animate-home-marquee-horizontal-x-reverse' : 'animate-home-marquee-horizontal-x';

    const marqueeTrack = (
        <div
            className={`home-marquee-pausable overflow-hidden ${enableMobileScroll ? 'hidden md:block' : 'block'} ${className}`.trim()}
            style={{ '--home-marquee-duration': `${durationSeconds}s` }}
            aria-label={enableMobileScroll ? undefined : ariaLabel}
            role={!enableMobileScroll && ariaLabel ? 'region' : undefined}
        >
            <div className={`flex w-max will-change-transform ${animClass}`}>
                <div className={marqueeRowClass}>
                    {itemNodes}
                </div>
                <div className={marqueeRowClass} aria-hidden>
                    {duplicatedNodes}
                </div>
            </div>
        </div>
    );

    if (!enableMobileScroll) {
        return marqueeTrack;
    }

    return (
        <>
            <div
                className={`${scrollTrackClass} md:hidden ${className}`.trim()}
                aria-label={ariaLabel}
                role={ariaLabel ? 'region' : undefined}
            >
                {itemNodes}
            </div>
            {marqueeTrack}
        </>
    );
}
