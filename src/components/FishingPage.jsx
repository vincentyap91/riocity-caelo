import React, { useMemo, useState, useEffect } from 'react';
import fishingBanner from '../assets/fishing-banner.jpg';
import { PAGE_BANNER_IMG_FILL } from '../constants/pageBannerClasses';
import PromotionStyleTabs from './PromotionStyleTabs';
import { GameCardFavouriteButton, GameCardPlayBar } from './game/GameCardActions';
import { navigateToGameDetail } from '../utils/gameDetailRoutes';
import { FISHING_GAMES as fishingGames } from '../constants/gameCatalogs';
import SlotBrowseFilterModal from './SlotBrowseFilterModal';
import ProductBrowseControlPanel from './ProductBrowseControlPanel';
import useProductBrowseFilters, { DEFAULT_ALL_PROVIDERS_VALUE } from '../hooks/useProductBrowseFilters';

const CDN = 'https://cdn.i8global.com/lb9/master';

const fishingProviders = [
    { name: 'JiLi Fishing', src: `${CDN}/jilifishing/jilif-202506200821066519-202508130218481666-202508220228072561.png`, featured: true },
    { name: 'JDB Fishing', src: `${CDN}/jdbfishing/jdbf-202506200914179063-202506250031365113.png`, featured: true },
    { name: 'DragoonSoft Fishing', src: `${CDN}/dragoonsoftfishing/dragoonsoft-min-202507150246327347-202507210728004447-202507212313114465.png`, featured: false },
    { name: 'Funky Games Fishing', src: `${CDN}/funkygamesfishing/funky%20games-202505140444483770-202507210731202838-202507212316321214.svg`, featured: false },
];

const gameTabs = ['All Games', 'Hot Games', 'New Games'];
const searchScopes = [
    { id: 'all', label: 'All' },
    { id: 'games', label: 'Games' },
    { id: 'providers', label: 'Providers' },
];
const pageContainerClass = 'mx-auto w-full max-w-screen-2xl px-4 md:px-8';
const sectionTitleClass = 'text-xl font-bold tracking-tight text-slate-900 md:text-2xl';
const ALL_PROVIDERS = DEFAULT_ALL_PROVIDERS_VALUE;

const liveBigWins = [
    { user: 'Alex M.', amount: 'MYR 45,200', game: 'Ocean King', time: '2 min ago', amountColor: 'text-[var(--color-danger-main)]' },
    { user: 'Sarah K.', amount: 'MYR 32,800', game: 'Fishing God', time: '5 min ago', amountColor: 'text-[var(--color-brand-primary)]' },
    { user: 'John D.', amount: 'MYR 78,500', game: 'Dragon Fortune', time: '8 min ago', amountColor: 'text-[var(--color-danger-main)]' },
];

const INITIAL_GAMES = 12;

export default function FishingPage({ onNavigate }) {
    const [activeTab, setActiveTab] = useState('All Games');
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [gamesToShow, setGamesToShow] = useState(INITIAL_GAMES);

    const tabFilteredGames = useMemo(() => fishingGames.filter((game) => (
        activeTab === 'All Games'
            ? true
            : activeTab === 'Hot Games'
                ? game.hot
                : activeTab === 'New Games'
                    ? game.new
                    : true
    )), [activeTab]);

    const {
        query,
        setQuery,
        searchScope,
        setSearchScope,
        activeProvider,
        setActiveProvider,
        visibleProviders,
        filteredGames,
        resultSummary,
        applyBrowseFilters,
    } = useProductBrowseFilters({
        providers: fishingProviders,
        games: tabFilteredGames,
        initialProvider: fishingProviders[0].name,
        allProvidersValue: ALL_PROVIDERS,
    });

    useEffect(() => {
        setGamesToShow(INITIAL_GAMES);
    }, [activeProvider, activeTab, query, searchScope]);

    useEffect(() => {
        if (activeProvider === ALL_PROVIDERS) return;
        if (!visibleProviders.length) return;
        if (!visibleProviders.some((provider) => provider.name === activeProvider)) {
            setActiveProvider(visibleProviders[0].name);
            setGamesToShow(INITIAL_GAMES);
        }
    }, [activeProvider, setActiveProvider, visibleProviders]);

    const handleApplyFilters = (payload) => {
        applyBrowseFilters(payload);
        setGamesToShow(INITIAL_GAMES);
    };

    return (
        <main className="w-full bg-gradient-to-b from-blue-50 via-slate-50 to-slate-100 pb-14 font-sans">
            <section className="w-full pt-5 md:pt-7">
                <div className={pageContainerClass}>
                    <div className="page-hero-banner">
                        <img
                            src={fishingBanner}
                            alt="Fishing Banner"
                            className={`page-hero-banner__img ${PAGE_BANNER_IMG_FILL}`}
                        />
                        <div className="absolute inset-y-0 left-0 w-[56%] bg-[linear-gradient(90deg,rgb(234_244_255_/_0.96)_0%,rgb(234_244_255_/_0.86)_45%,transparent_100%)] sm:w-[52%] md:w-[50%]" />
                        <div className="absolute inset-0 flex items-center justify-start">
                            <div className="w-[50%] max-md:pl-8 max-md:pr-3 sm:w-[50%] md:w-[50%] md:pl-[18%] md:pr-0">
                                <div className="w-full max-w-[420px] text-center max-md:text-center">
                                    <h1 className="text-xl font-bold uppercase tracking-[0.03em] text-[rgb(25_41_71)] sm:text-2xl md:text-3xl">
                                        Fishing
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`${pageContainerClass} mt-4`}>
                <div className="flex flex-nowrap gap-2 overflow-x-auto pb-2 pr-3">
                    {visibleProviders.map((provider) => {
                        const isActive = activeProvider === provider.name;
                        return (
                            <button
                                key={provider.name}
                                type="button"
                                onClick={() => setActiveProvider(provider.name)}
                                className={`relative flex h-14 min-w-[calc((100%-0.5rem)/2.35)] shrink-0 items-center justify-center rounded-2xl border-2 bg-[var(--color-surface-base)] px-2 shadow-[var(--shadow-card-soft)] transition sm:min-w-[calc((100%-0.75rem)/3.35)] md:h-16 md:min-w-[calc((100%-1rem)/4.35)] lg:min-w-[calc((100%-2rem)/5.6)] xl:min-w-[calc((100%-3rem)/7.6)] ${
                                    isActive ? 'border-[var(--color-brand-deep)] ring-2 ring-[var(--color-brand-deep)]/30' : 'border-[rgb(209_216_229)] hover:border-[rgb(183_194_215)]'
                                }`}
                            >
                                {(provider.featured || provider.new) && (
                                    <span className={`absolute right-1 top-1 rounded-full px-2 py-0.5 text-xs font-bold text-white ${provider.new ? 'bg-blue-500' : 'bg-orange-500'}`}>
                                        {provider.new ? 'New' : 'Hot'}
                                    </span>
                                )}
                                <img src={provider.src} alt={provider.name} className="max-h-8 md:max-h-10 object-contain" draggable={false} />
                            </button>
                        );
                    })}
                </div>
            </section>

            <section className={pageContainerClass}>
                <ProductBrowseControlPanel
                    category="fishing"
                    query={query}
                    onQueryChange={setQuery}
                    searchScope={searchScope}
                    onSearchScopeChange={setSearchScope}
                    scopes={searchScopes}
                    onOpenFilterModal={() => setFilterModalOpen(true)}
                    resultSummary={resultSummary}
                    providerSummaryText={activeProvider === ALL_PROVIDERS ? 'Browsing all providers' : `Provider filter: ${activeProvider}`}
                />
            </section>

            <section className={`${pageContainerClass} mt-5 md:mt-6`}>
                <div className="mb-3 md:mb-4">
                    <PromotionStyleTabs
                        items={gameTabs}
                        value={activeTab}
                        onChange={setActiveTab}
                        ariaLabel="Fishing game filters"
                    />
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                    {filteredGames.slice(0, gamesToShow).map((game, idx) => (
                            <div
                                key={idx}
                                className="surface-card group relative flex flex-col overflow-hidden rounded-2xl transition md:hover:-translate-y-1 md:hover:shadow-lg"
                            >
                                <button
                                    type="button"
                                    className="absolute inset-0 z-[5] md:hidden"
                                    onClick={() => navigateToGameDetail(onNavigate, game.name, game.provider)}
                                    aria-label={`Open ${game.name}`}
                                />
                                {(game.hot || game.new) && (
                                    <span className="pointer-events-none absolute left-2 top-2 z-10 rounded-full bg-orange-500 px-2.5 py-0.5 text-xs font-bold text-white">
                                        {game.hot ? 'HOT' : 'NEW'}
                                    </span>
                                )}
                                <div className="pointer-events-none relative z-10 h-44 overflow-hidden rounded-t-2xl sm:h-52 xl:h-56">
                                    <div
                                        className="absolute inset-0 rounded-[inherit] bg-cover bg-center transition-transform duration-500 md:group-hover:scale-110"
                                        style={{ backgroundImage: `url("${game.imgUrl}")` }}
                                    />
                                    <GameCardFavouriteButton
                                        category="fishing"
                                        name={game.name}
                                        provider={game.provider}
                                        imgUrl={game.imgUrl}
                                        navigatePage="fishing"
                                    />
                                    <GameCardPlayBar
                                        showOnHover
                                        gameName={game.name}
                                        gameProvider={game.provider}
                                        onNavigate={onNavigate}
                                    />
                                </div>
                                <div className="p-2 md:p-3">
                                    <p className="line-clamp-2 text-xs font-bold text-slate-800 md:text-sm">{game.name}</p>
                                    <p className="mt-1 text-xs text-slate-500">{game.provider}</p>
                                </div>
                            </div>
                    ))}
                </div>
                {filteredGames.length === 0 && (
                    <div className="surface-card mt-6 rounded-2xl px-4 py-7 text-center">
                        <p className="text-base font-bold text-slate-800">No games match your search.</p>
                        <p className="mt-1 text-xs text-slate-500">Try a different keyword or switch filter.</p>
                    </div>
                )}
                {filteredGames.length > gamesToShow && (
                    <div className="mt-6 flex justify-center">
                        <button
                            type="button"
                            onClick={() => setGamesToShow(filteredGames.length)}
                            className="btn-theme-cta inline-flex h-12 items-center justify-center rounded-lg px-8 text-sm font-bold tracking-wide transition hover:-translate-y-0.5 hover:brightness-105"
                        >
                            SEE MORE
                        </button>
                    </div>
                )}
            </section>

            <section className={`${pageContainerClass} mt-8 pb-8 md:mt-10`}>
                <div className="surface-panel rounded-2xl p-3 sm:p-4 md:p-5">
                    <h2 className={sectionTitleClass}>Live Big Wins</h2>
                    <div className="mt-4 flex flex-col gap-2.5 sm:mt-6 sm:flex-row sm:flex-wrap sm:gap-6">
                        {liveBigWins.map((win, idx) => {
                            const game = fishingGames.find((g) => g.name === win.game) ?? fishingGames[0];
                            return (
                                <a
                                    key={idx}
                                    href="#"
                                    className="surface-card group flex min-w-0 flex-1 basis-[220px] items-start gap-3.5 rounded-2xl p-3.5 transition hover:-translate-y-0.5 hover:shadow-lg sm:items-center sm:gap-5 sm:p-4"
                                >
                                    <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-slate-100 sm:h-20 sm:w-20">
                                        <img
                                            src={game.imgUrl}
                                            alt={win.game}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold leading-snug text-slate-800">
                                            {win.user} won <span className={win.amountColor}>{win.amount}</span>
                                        </p>
                                        <p className="mt-px text-xs leading-snug text-slate-500 sm:mt-0.5">
                                            on {win.game}
                                            {' \u00B7 '}
                                            {win.time}
                                        </p>
                                    </div>
                                </a>
                            );
                        })}
                    </div>
                </div>
            </section>

            <SlotBrowseFilterModal
                open={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                providers={fishingProviders}
                games={tabFilteredGames}
                scopes={searchScopes}
                initialQuery={query}
                initialScope={searchScope}
                initialProvider={activeProvider}
                allProvidersValue={ALL_PROVIDERS}
                onApply={handleApplyFilters}
            />
        </main>
    );
}
