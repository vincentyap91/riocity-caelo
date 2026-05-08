import React, { useEffect, useMemo, useRef, useState } from 'react';
import LobbyProviderCard from './game/LobbyProviderCard';
import { navigateToGameDetail } from '../utils/gameDetailRoutes';
import sportsBanner from '../assets/sports-banner.jpg';
import { NAV_STICKY_QUICK_PLAY_BAR_CLASS } from '../constants/navStickyOffsets';
import { PAGE_BANNER_IMG_FILL } from '../constants/pageBannerClasses';
import { normalizeFavouriteCategory } from '../utils/favouriteGames';
import SearchProvider from './SearchProvider';

const CDN = 'https://cdn.i8global.com/lb9/master';

const providerLogos = [
    {
        id: 'saba-sports',
        name: 'SABA Sports',
        src: `${CDN}/sabasports/sabasports_wh-202507150659307576-202507172158490800.png`,
        categories: ['Sportsbook'],
        featured: true,
    },
    {
        id: 'sbo-sports',
        name: 'SBO Sports',
        src: `${CDN}/sbosports/sbobet-202505140446487117-202506242314511303.svg`,
        categories: ['Sportsbook'],
        featured: true,
    },
    {
        id: 'pragmatic-virtual-sports',
        name: 'Pragmatic Play Virtual Sports',
        src: `${CDN}/pragmaticplayvirtualsports/pragmaticvs_wh-202507101340022927-202507101413412524.png`,
        categories: ['Virtual Sports'],
        featured: false,
    },
    {
        id: 'sbo-virtual-sports',
        name: 'SBO Virtual Sports',
        src: `${CDN}/sbovirtualsports/sbobet_vsport-202505140510055251-202506242315525359.svg`,
        categories: ['Virtual Sports'],
        featured: false,
    },
];

export default function SportsPage({ onNavigate }) {
    const [query, setQuery] = useState('');
    const [bannerProvider, setBannerProvider] = useState(
        () => providerLogos.find((provider) => provider.id === 'pragmatic-virtual-sports') ?? providerLogos[0]
    );
    const [showStickyPlayBar, setShowStickyPlayBar] = useState(false);
    const playButtonAreaRef = useRef(null);

    const filteredProviders = useMemo(() => {
        const text = query.trim().toLowerCase();

        return providerLogos.filter((provider) => {
            const textMatch = text ? provider.name.toLowerCase().includes(text) : true;
            return textMatch;
        });
    }, [query]);

    useEffect(() => {
        if (!filteredProviders.some((provider) => provider.id === bannerProvider.id)) {
            setBannerProvider(filteredProviders[0] ?? providerLogos[0]);
        }
    }, [filteredProviders, bannerProvider.id]);

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

    const PlayButton = ({ className = '' }) => (
        <button
            type="button"
            onClick={() => navigateToGameDetail(onNavigate, bannerProvider.name, 'Sportsbook')}
            className={`btn-theme-cta inline-flex h-10 min-w-[140px] items-center justify-center rounded-[10px] px-5 text-sm font-bold tracking-[0.06em] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta-focus)] focus-visible:ring-offset-2 md:h-12 md:min-w-[180px] md:px-8 md:text-base ${className}`}
            aria-label={`Play ${bannerProvider.name}`}
        >
            PLAY SPORTS
        </button>
    );

    return (
        <main
            className="w-full pb-14 bg-[linear-gradient(180deg,var(--gradient-live-page-start)_0%,var(--gradient-live-page-mid)_36%,var(--gradient-live-page-end)_100%)]"
        >
            {showStickyPlayBar && (
                <div className={NAV_STICKY_QUICK_PLAY_BAR_CLASS} role="banner" aria-label="Quick play bar">
                    <div className="flex items-center justify-center gap-4 px-4 py-3">
                        <img
                            src={bannerProvider.src}
                            alt={bannerProvider.name}
                            className="h-8 md:h-10 object-contain"
                        />
                        <span className="hidden text-sm font-bold text-[rgb(42_53_72)] sm:inline md:text-base">
                            {bannerProvider.name}
                        </span>
                        <PlayButton />
                    </div>
                </div>
            )}

            <section className="w-full pt-5 md:pt-7">
                <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
                    <div className="page-hero-banner">
                        <img
                            src={sportsBanner}
                            alt="Sports Banner"
                            className={`page-hero-banner__img ${PAGE_BANNER_IMG_FILL} page-hero-banner__img--show-bottom`}
                        />
                        <div className="absolute inset-y-0 left-0 w-[56%] bg-[linear-gradient(90deg,rgb(234_244_255_/_0.96)_0%,rgb(234_244_255_/_0.86)_45%,transparent_100%)] sm:w-[52%] md:w-[50%]" />
                        <div ref={playButtonAreaRef} className="absolute inset-0 flex items-center justify-start">
                            <div className="w-[50%] max-md:pl-8 max-md:pr-3 sm:w-[50%] md:w-[50%] md:pl-[18%] md:pr-0">
                                <div className="w-full max-w-[420px] text-center max-md:text-center">
                                    <div className="flex justify-center max-md:justify-center">
                                        <img
                                            src={bannerProvider.src}
                                            alt={bannerProvider.name}
                                            className="h-10 max-w-[140px] object-contain sm:h-12 sm:max-w-[170px] md:h-15 md:max-w-none"
                                        />
                                    </div>
                                    <h1 className="mt-3 hidden text-3xl font-bold uppercase tracking-[0.03em] text-[rgb(25_41_71)] md:block">
                                        Sportsbook
                                    </h1>
                                    <p className="mx-auto mt-3 hidden max-w-[420px] text-base font-semibold leading-snug text-[rgb(42_53_72)] md:block md:mt-4">
                                        Big matches, sharp odds, instant action.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => navigateToGameDetail(onNavigate, bannerProvider.name, 'Sportsbook')}
                                        className="btn-theme-cta mt-1 inline-flex h-8 min-w-[118px] items-center justify-center self-center rounded-[9px] px-4 text-xs font-bold tracking-[0.05em] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(29_51_84)] max-md:self-start sm:mt-2 sm:h-9 sm:min-w-[136px] sm:px-5 sm:text-sm md:mt-6 md:h-14 md:min-w-[260px] md:self-auto md:rounded-[10px] md:px-12 md:text-xl"
                                        aria-label={`Play ${bannerProvider.name}`}
                                    >
                                        PLAY SPORTS
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 mt-4 md:mt-6">
                <div className="rounded-2xl border border-[rgb(219_228_243)] bg-[var(--color-surface-base-80)] p-4 shadow-[0_6px_18px_rgba(20,43,87,0.09)] backdrop-blur-sm md:p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <p className="text-xl font-bold tracking-[0.02em] text-[rgb(28_40_65)] md:text-2xl">Sports Providers</p>
                            <p className="mt-1 text-xs text-[rgb(93_103_128)] md:text-sm">
                                Pick your preferred sportsbook or virtual sports provider with a consistent premium experience.
                            </p>
                        </div>
                        <SearchProvider
                            value={query}
                            onChange={setQuery}
                            category="sports"
                            placeholder="Search provider"
                            ariaLabel="Search sports providers"
                            widthClassName="w-full lg:w-[330px]"
                        />
                    </div>

                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.08em] text-[rgb(106_117_144)] md:text-xs">
                        {filteredProviders.length} provider{filteredProviders.length === 1 ? '' : 's'} found
                    </p>
                </div>
            </section>

            <section className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 mt-5 md:mt-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                    {filteredProviders.map((provider, index) => (
                        <LobbyProviderCard
                            key={provider.name}
                            provider={provider}
                            index={index}
                            selected={bannerProvider.name === provider.name}
                            onSelect={setBannerProvider}
                            gameProvider="Sportsbook"
                            favouriteCategory={normalizeFavouriteCategory(
                                'sports',
                                provider.name,
                            )}
                            navigatePage="sports"
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>
                {filteredProviders.length === 0 && (
                    <div className="mt-6 rounded-2xl border border-[rgb(220_228_242)] bg-[var(--color-surface-base)] px-4 py-7 text-center">
                        <p className="text-base font-bold text-[rgb(43_58_87)]">No providers match your search.</p>
                        <p className="mt-1 text-xs text-[rgb(106_117_144)]">Try a different keyword or switch filter.</p>
                    </div>
                )}
            </section>
        </main>
    );
}

