import React, { useEffect, useRef, useState } from 'react';
import { Search } from 'lucide-react';
import LobbyProviderCard from './game/LobbyProviderCard';
import { navigateToGameDetail } from '../utils/gameDetailRoutes';
import esportsBanner from '../assets/esports.jpg';
import { NAV_STICKY_QUICK_PLAY_BAR_CLASS } from '../constants/navStickyOffsets';
import { PAGE_BANNER_IMG_FILL } from '../constants/pageBannerClasses';
import tfGamingLogo from '../assets/tf-gaming.webp';

const providerLogos = [
    { id: 'tf-gaming', name: 'TF Gaming', src: tfGamingLogo },
];

export default function EsportsPage({ onNavigate }) {
    const [query, setQuery] = useState('');
    const [bannerProvider, setBannerProvider] = useState(providerLogos[0]);
    const [showStickyPlayBar, setShowStickyPlayBar] = useState(false);
    const playButtonAreaRef = useRef(null);

    const filteredProviders = providerLogos.filter((p) =>
        query.trim() ? p.name.toLowerCase().includes(query.trim().toLowerCase()) : true
    );

    const handlePlayEsports = () => {
        navigateToGameDetail(onNavigate, bannerProvider.name, 'E-Sports');
    };

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
            onClick={handlePlayEsports}
            className={`btn-theme-cta inline-flex h-10 min-w-[140px] items-center justify-center rounded-[10px] px-5 text-sm font-bold tracking-[0.06em] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta-focus)] focus-visible:ring-offset-2 md:h-12 md:min-w-[180px] md:px-8 md:text-base ${className}`}
            aria-label={`Play ${bannerProvider.name}`}
        >
            PLAY E-SPORTS
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
                            className="h-8 object-contain md:h-10"
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
                            src={esportsBanner}
                            alt="E-Sports Banner"
                            className={`page-hero-banner__img ${PAGE_BANNER_IMG_FILL} page-hero-banner__img--show-bottom`}
                        />
                        <div
                            ref={playButtonAreaRef}
                            className="absolute inset-y-0 right-0 flex w-[56%] items-center justify-end pr-3 sm:w-[52%] sm:pr-4 md:w-[50%] md:justify-start md:pr-0"
                        >
                            <div className="flex w-full max-w-[500px] flex-col items-end justify-center py-4 text-right md:block md:px-8 md:py-7 md:text-center">
                                <div className="mt-1 flex w-full justify-center md:mt-5 md:justify-center">
                                    <img
                                        src={bannerProvider.src}
                                        alt={bannerProvider.name}
                                        className="h-10 max-w-[140px] object-contain sm:h-12 sm:max-w-[170px] md:h-15 md:max-w-none"
                                    />
                                </div>
                                <h1 className="mt-3 hidden text-3xl font-bold uppercase tracking-[0.03em] text-[rgb(25_41_71)] md:block">
                                    E-Sports
                                </h1>
                                <p className="mx-auto mt-3 hidden max-w-[420px] text-base font-semibold leading-snug text-[rgb(42_53_72)] md:block md:mt-4">
                                    Top tournaments, live odds, nonstop hype.
                                </p>
                                <button
                                    type="button"
                                    onClick={handlePlayEsports}
                                    className="btn-theme-cta relative z-10 mt-1 inline-flex h-8 min-w-[118px] items-center justify-center self-center rounded-[9px] px-4 text-xs font-bold tracking-[0.05em] transition hover:-translate-y-0.5 hover:brightness-105 active:translate-y-0 active:brightness-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-cta-focus)] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(29_51_84)] sm:mt-2 sm:h-9 sm:min-w-[136px] sm:px-5 sm:text-sm md:mt-6 md:h-14 md:min-w-[260px] md:self-auto md:rounded-[10px] md:px-12 md:text-xl"
                                    aria-label={`Play ${bannerProvider.name}`}
                                >
                                    PLAY E-SPORTS
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto mt-4 w-full max-w-screen-2xl px-4 md:mt-6 md:px-8">
                <div className="rounded-2xl border border-[rgb(219_228_243)] bg-[var(--color-surface-base-80)] p-4 shadow-[0_6px_18px_rgba(20,43,87,0.09)] backdrop-blur-sm md:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <p className="text-xl font-bold tracking-[0.02em] text-[rgb(28_40_65)] md:text-2xl">E-Sports Providers</p>
                            <p className="mt-1 text-xs text-[rgb(93_103_128)] md:text-sm">
                                Choose your preferred E-sports and virtual competition provider with the same premium sportsbook experience.
                            </p>
                        </div>
                        <label className="flex h-11 w-full items-center gap-2 rounded-xl border border-[var(--color-border-live)] bg-[var(--color-surface-base)] px-3 shadow-[inset_0_1px_2px_rgba(9,30,66,0.06)] lg:w-[330px]">
                            <Search size={16} className="text-[rgb(95_110_139)]" />
                            <input
                                value={query}
                                onChange={(event) => setQuery(event.target.value)}
                                placeholder="Search provider"
                                className="w-full bg-transparent text-sm font-semibold text-[rgb(42_58_88)] outline-none placeholder:text-[rgb(139_151_174)]"
                            />
                        </label>
                    </div>

                    <p className="mt-4 text-xs font-bold uppercase tracking-[0.08em] text-[rgb(106_117_144)] md:text-xs">
                        {filteredProviders.length} provider{filteredProviders.length === 1 ? '' : 's'} found
                    </p>
                </div>
            </section>

            <section className="mx-auto mt-5 w-full max-w-screen-2xl px-4 md:mt-6 md:px-8">
                <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-6 sm:grid-cols-3">
                    {filteredProviders.map((p, index) => (
                        <LobbyProviderCard
                            key={p.name}
                            provider={p}
                            index={index}
                            selected={bannerProvider.name === p.name}
                            onSelect={setBannerProvider}
                            gameProvider="E-Sports"
                            favouriteCategory="e-sports"
                            navigatePage="e-sports"
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

