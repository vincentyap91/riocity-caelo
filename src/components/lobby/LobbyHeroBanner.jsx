import React, { useEffect, useRef, useState } from 'react';
import { NAV_STICKY_QUICK_PLAY_BAR_CLASS } from '../../constants/navStickyOffsets';
import { PAGE_BANNER_IMG_FILL } from '../../constants/pageBannerClasses';

const STICKY_CTA_CLASS =
    'btn-theme-cta inline-flex h-10 min-w-[140px] items-center justify-center rounded-[10px] px-5 text-sm font-bold tracking-[0.06em] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta-focus)] focus-visible:ring-offset-2 md:h-12 md:min-w-[180px] md:px-8 md:text-base';

const BANNER_CTA_CLASS =
    'btn-theme-cta mt-1 inline-flex h-8 min-w-[118px] items-center justify-center self-center rounded-[9px] px-4 text-xs font-bold tracking-[0.05em] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(29_51_84)] sm:mt-2 sm:h-9 sm:min-w-[136px] sm:px-5 sm:text-sm md:mt-6 md:h-14 md:min-w-[260px] md:self-auto md:rounded-[10px] md:px-12 md:text-xl';

const POKER_BANNER_CTA_CLASS = `${BANNER_CTA_CLASS} max-md:self-start`;

/**
 * Shared lobby hero: banner image + provider headline + primary CTA, plus sticky quick-play bar.
 * Use `layout="poker"` for the left-gradient / left-aligned hero; default matches Live Casino (right column).
 */
export default function LobbyHeroBanner({
    bannerImage,
    bannerAlt,
    /** Current provider shown in the hero (name + logo src). */
    provider,
    onPlay,
    ctaLabel,
    title,
    tagline,
    stickyPlayAriaLabel,
    bannerPlayAriaLabel,
    layout = 'live-casino',
    imageClassName = '',
}) {
    const [showStickyPlayBar, setShowStickyPlayBar] = useState(false);
    const playButtonAreaRef = useRef(null);

    useEffect(() => {
        const el = playButtonAreaRef.current;
        if (!el) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => setShowStickyPlayBar(!entry.isIntersecting),
            { threshold: 0, rootMargin: '-80px 0px 0px 0px', root: null }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    return (
        <>
            {showStickyPlayBar && (
                <div className={NAV_STICKY_QUICK_PLAY_BAR_CLASS} role="banner" aria-label="Quick play bar">
                    <div className="flex items-center justify-center gap-4 px-4 py-3">
                        <img src={provider.src} alt={provider.name} className="h-8 object-contain md:h-10" />
                        <span className="hidden text-sm font-bold text-[rgb(42_53_72)] sm:inline md:text-base">
                            {provider.name}
                        </span>
                        <button
                            type="button"
                            onClick={onPlay}
                            className={STICKY_CTA_CLASS}
                            aria-label={stickyPlayAriaLabel}
                        >
                            {ctaLabel}
                        </button>
                    </div>
                </div>
            )}

            <section className="w-full pt-5 md:pt-7">
                <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
                    <div className="page-hero-banner">
                        <img
                            src={bannerImage}
                            alt={bannerAlt}
                            className={`page-hero-banner__img ${PAGE_BANNER_IMG_FILL} ${imageClassName}`}
                        />
                        {layout === 'poker' ? (
                            <>
                                <div className="absolute inset-y-0 left-0 w-[56%] bg-[linear-gradient(90deg,rgb(234_244_255_/_0.96)_0%,rgb(234_244_255_/_0.86)_45%,transparent_100%)] sm:w-[52%] md:w-[50%]" />
                                <div
                                    ref={playButtonAreaRef}
                                    className="absolute inset-0 flex items-center justify-start"
                                >
                                    <div className="w-[50%] max-md:pl-8 max-md:pr-3 sm:w-[50%] md:w-[50%] md:pl-[18%] md:pr-0">
                                        <div className="w-full max-w-[420px] text-center max-md:text-center">
                                            <div className="flex justify-center max-md:justify-center">
                                                <img
                                                    src={provider.src}
                                                    alt={provider.name}
                                                    className="h-10 max-w-[140px] object-contain sm:h-12 sm:max-w-[170px] md:h-20 md:max-w-none"
                                                />
                                            </div>
                                            <h1 className="mt-3 hidden text-3xl font-bold uppercase tracking-[0.03em] text-[rgb(25_41_71)] md:block">
                                                {title}
                                            </h1>
                                            <p className="mx-auto mt-3 hidden max-w-[420px] text-base font-semibold leading-snug text-[rgb(42_53_72)] md:block md:mt-4">
                                                {tagline}
                                            </p>
                                            <button
                                                type="button"
                                                onClick={onPlay}
                                                className={POKER_BANNER_CTA_CLASS}
                                                aria-label={bannerPlayAriaLabel}
                                            >
                                                {ctaLabel}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div
                                ref={playButtonAreaRef}
                                className="absolute inset-y-0 right-0 flex w-[56%] items-center justify-end pr-3 sm:w-[52%] sm:pr-4 md:w-[50%] md:justify-start md:pr-0"
                            >
                                <div className="flex w-full max-w-[500px] flex-col items-end justify-center py-4 text-right md:block md:px-8 md:py-7 md:text-center">
                                    <div className="mt-1 flex w-full justify-center md:mt-5 md:justify-center">
                                        <img
                                            src={provider.src}
                                            alt={provider.name}
                                            className="h-10 max-w-[140px] object-contain sm:h-12 sm:max-w-[170px] md:h-15 md:max-w-none"
                                        />
                                    </div>
                                    <h1 className="mt-3 hidden text-3xl font-bold uppercase tracking-[0.03em] text-[rgb(25_41_71)] md:block">
                                        {title}
                                    </h1>
                                    <p className="mx-auto mt-3 hidden max-w-[420px] text-base font-semibold leading-snug text-[rgb(42_53_72)] md:block md:mt-4">
                                        {tagline}
                                    </p>
                                    <button
                                        type="button"
                                        onClick={onPlay}
                                        className={BANNER_CTA_CLASS}
                                        aria-label={bannerPlayAriaLabel}
                                    >
                                        {ctaLabel}
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}
