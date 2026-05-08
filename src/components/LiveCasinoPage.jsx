import React, { useEffect, useMemo, useState } from 'react';
import PromotionStyleTabs from './PromotionStyleTabs';
import ProviderLaunchModal from './ProviderLaunchModal';
import PromotionWarningModal from './PromotionWarningModal';
import LobbyHeroBanner from './lobby/LobbyHeroBanner';
import LobbyProviderCard from './game/LobbyProviderCard';
import SearchProvider from './SearchProvider';
import { navigateToGameDetail } from '../utils/gameDetailRoutes';
import liveCasinoBanner from '../assets/live-casino.jpg';
import {
    EZUGI_PROVIDER_ID,
    LIVE_CASINO_LAUNCH_MODAL_BY_PROVIDER_ID,
    LIVE_CASINO_PAGE_PROVIDERS,
} from '../constants/liveCasinoProviders';

const providerTags = ['All', 'Trending', 'Baccarat', 'Roulette', 'Dragon Tiger', 'Blackjack', 'Game Shows'];
const providerLogos = LIVE_CASINO_PAGE_PROVIDERS;

function resolveLaunchConfig(providerId) {
    return LIVE_CASINO_LAUNCH_MODAL_BY_PROVIDER_ID[providerId] ?? null;
}

export default function LiveCasinoPage({ selectedProviderIdFromMenu, onNavigate }) {
    const [activeTag, setActiveTag] = useState('All');
    const [query, setQuery] = useState('');
    const [providerLaunchOpen, setProviderLaunchOpen] = useState(false);
    const [promotionWarningOpen, setPromotionWarningOpen] = useState(false);
    const [bannerProvider, setBannerProvider] = useState(
        () => providerLogos.find((provider) => provider.name === 'SA Gaming') ?? providerLogos[0]
    );

    useEffect(() => {
        if (selectedProviderIdFromMenu) {
            const match = providerLogos.find((p) => p.id === selectedProviderIdFromMenu);
            if (match) {
                setActiveTag('All');
                setQuery('');
                setBannerProvider(match);
            }
        }
    }, [selectedProviderIdFromMenu]);
    const filteredProviders = useMemo(() => {
        const text = query.trim().toLowerCase();

        return providerLogos.filter((provider) => {
            const tagMatch =
                activeTag === 'All'
                    ? true
                    : activeTag === 'Trending'
                        ? provider.featured
                        : provider.categories.includes(activeTag);
            const textMatch = text ? provider.name.toLowerCase().includes(text) : true;
            return tagMatch && textMatch;
        });
    }, [activeTag, query]);

    const handleSelectProvider = (provider) => {
        setBannerProvider(provider);
        if (resolveLaunchConfig(provider.id)) setProviderLaunchOpen(true);
    };

    const handlePlayLive = () => {
        if (resolveLaunchConfig(bannerProvider.id)) {
            setProviderLaunchOpen(true);
            return;
        }
        navigateToGameDetail(onNavigate, bannerProvider.name, 'Live Casino');
    };

    const handleStartProviderGame = () => {
        setPromotionWarningOpen(true);
    };

    const handleCloseProviderLaunch = () => {
        setProviderLaunchOpen(false);
        setPromotionWarningOpen(false);
    };

    const handleContinueEzugiLaunch = () => {
        setPromotionWarningOpen(false);
        setProviderLaunchOpen(false);
        const launchCfg = resolveLaunchConfig(bannerProvider.id);
        navigateToGameDetail(onNavigate, launchCfg?.title ?? bannerProvider.name, 'Live Casino');
    };

    const stickyPlayAriaLabel = resolveLaunchConfig(bannerProvider.id)
        ? `Play ${resolveLaunchConfig(bannerProvider.id)?.title ?? bannerProvider.name}`
        : `Play ${bannerProvider.name}`;
    const bannerPlayAriaLabel =
        bannerProvider.id === EZUGI_PROVIDER_ID
            ? `Play ${resolveLaunchConfig(EZUGI_PROVIDER_ID)?.title ?? bannerProvider.name}`
            : `Play ${bannerProvider.name}`;

    return (
        <main
            className="w-full pb-14 bg-[linear-gradient(180deg,var(--gradient-live-page-start)_0%,var(--gradient-live-page-mid)_36%,var(--gradient-live-page-end)_100%)]"
        >
            <ProviderLaunchModal
                open={providerLaunchOpen}
                onClose={handleCloseProviderLaunch}
                title={(resolveLaunchConfig(bannerProvider.id) ?? resolveLaunchConfig(EZUGI_PROVIDER_ID)).title}
                bannerImage={(resolveLaunchConfig(bannerProvider.id) ?? resolveLaunchConfig(EZUGI_PROVIDER_ID)).bannerImage}
                wallet={(resolveLaunchConfig(bannerProvider.id) ?? resolveLaunchConfig(EZUGI_PROVIDER_ID)).wallet}
                membershipRebate={(resolveLaunchConfig(bannerProvider.id) ?? resolveLaunchConfig(EZUGI_PROVIDER_ID)).membershipRebate}
                onStartGame={handleStartProviderGame}
            />
            <PromotionWarningModal
                open={promotionWarningOpen}
                onClose={() => setPromotionWarningOpen(false)}
                onContinue={handleContinueEzugiLaunch}
            />

            <LobbyHeroBanner
                bannerImage={liveCasinoBanner}
                bannerAlt="Live Casino Banner"
                provider={bannerProvider}
                onPlay={handlePlayLive}
                ctaLabel="PLAY LIVE"
                title="Live Casino"
                tagline="Live dealers, real thrills, instant payouts."
                stickyPlayAriaLabel={stickyPlayAriaLabel}
                bannerPlayAriaLabel={bannerPlayAriaLabel}
                imageClassName="page-hero-banner__img--show-bottom"
            />

            <section id="live-casino-providers" className="w-full max-w-screen-2xl mx-auto px-4 md:px-8 mt-4 md:mt-6">
                <div className="rounded-2xl border border-[rgb(219_228_243)] bg-[var(--color-surface-base-80)] p-4 shadow-[0_6px_18px_rgba(20,43,87,0.09)] backdrop-blur-sm md:p-5">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div>
                            <p className="text-xl font-bold tracking-[0.02em] text-[rgb(28_40_65)] md:text-2xl">Live Casino Providers</p>
                            <p className="mt-1 text-xs text-[rgb(93_103_128)] md:text-sm">
                                Choose from top brands with real-time action and studio-grade stream quality.
                            </p>
                        </div>
                        <SearchProvider
                            value={query}
                            onChange={setQuery}
                            category="live-casino"
                            placeholder="Search provider"
                            ariaLabel="Search live casino providers"
                            widthClassName="w-full lg:w-[330px]"
                        />
                    </div>

                    <div className="mt-4">
                        <PromotionStyleTabs
                            items={providerTags}
                            value={activeTag}
                            onChange={setActiveTag}
                            ariaLabel="Live casino categories"
                        />
                    </div>

                    <p className="mt-3 text-xs font-bold uppercase tracking-[0.08em] text-[rgb(106_117_144)] md:text-xs">
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
                            onSelect={handleSelectProvider}
                            gameProvider="Live Casino"
                            favouriteCategory="live-casino"
                            navigatePage="live-casino"
                            onNavigate={onNavigate}
                            onPlayClick={
                                resolveLaunchConfig(provider.id)
                                    ? () => {
                                          setBannerProvider(provider);
                                          setProviderLaunchOpen(true);
                                      }
                                    : undefined
                            }
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


