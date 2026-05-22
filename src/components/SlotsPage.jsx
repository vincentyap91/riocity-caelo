import React, { useState, useEffect } from 'react';
import { Play, TrendingUp, TrendingDown } from 'lucide-react';
import slotsBanner from '../assets/slot-banner.jpg';
import { PAGE_BANNER_IMG_FILL } from '../constants/pageBannerClasses';
import { MATCHED_SLOT_PROVIDERS } from '../constants/matchedSlotProviders';
import { GameCardFavouriteButton, GameCardPlayBar } from './game/GameCardActions';
import { SLOT_GAMES as slotGames } from '../constants/gameCatalogs';
import { buildGameDetailSlug, navigateToGameDetail } from '../utils/gameDetailRoutes';
import SlotBrowseFilterModal from './SlotBrowseFilterModal';
import ProductBrowseControlPanel from './ProductBrowseControlPanel';
import CurrentPromoSection from './slots/CurrentPromoSection';
import useProductBrowseFilters, { DEFAULT_ALL_PROVIDERS_VALUE } from '../hooks/useProductBrowseFilters';
import useSlotCurrentPromo from '../hooks/useSlotCurrentPromo';

const CDN = 'https://cdn.i8global.com/lb9/master';

const slotProviders = [
    { name: 'Pragmatic Play', src: `${CDN}/pragmaticplay/pp-202505140448040730-202506200354029751.svg`, featured: true },
    { name: 'PlayTech Slots', src: `${CDN}/playtechslots/playtech-202505140443475046-202507230000384478-202508140011404228.svg`, featured: true },
    /* AdvantPlay: strip-only asset (navbar mega-menu uses `matchedSlotProviders` — keep URLs independent). */
    { name: 'AdvantPlay', src: `${CDN}/advantplay1/advantplay-min-202507170638442926-202509040235032332-202509180625238829.png`, featured: true },
    { name: 'JiLi', src: `${CDN}/jili/jili-min-202506200742098986-202508110205447696-202508212322163049.png`, featured: true },
    { name: 'JDB', src: `${CDN}/jdb/jdbslot-min-202506200911451833-202506250030508552.png`, featured: true },
    { name: 'Mega888 H5', src: `${CDN}/mega888h5/mega888@2x-min-202510091328133268-202601132337530680.png`, featured: true },
    {
        name: 'Pussy888',
        src: 'https://pksoftcdn.azureedge.net/media/pussy888-202511050844023196.png',
        featured: true,
        new: true,
    },
    { name: 'Fat Panda', src: `${CDN}/fatpanda/fatpanda_wh-min-202507210010021076-202507210043526492.png`, featured: true },
    { name: 'AFB Slot', src: `${CDN}/afbslot/afb777-202505140445032607-202506242319591057.svg`, featured: true },
    { name: 'Fastspin', src: `${CDN}/fastspin/fastspin_wh-min-202507170648206305-202507180026049374.png`, featured: true },
    { name: 'Nextspin', src: `${CDN}/nextspin/nextspin_wh-min-202507150325176151-202507172124363806.png`, featured: true },
    { name: 'Funky Games', src: `${CDN}/funkygames/funky%20games-202505140444483770-202506242320544103.svg`, featured: true },
    { name: 'Evo888H5', src: `${CDN}/evo888h5/evo888h5_wh-202510120414485924-202510270133186749.png`, featured: false, new: true },
    { name: 'Joker', src: `${CDN}/joker/joker-1-202505140443313183-202506242335528120.svg`, featured: false },
    { name: 'YGR', src: `${CDN}/ygr/ygr-202505140441007635-202506250006231822.svg`, featured: false },
    { name: 'FaChai', src: `${CDN}/fachai/fachai_wh-min-202507150302042721-202507172121335159.png`, featured: false },
    { name: 'Habanero', src: `${CDN}/habanero/habanero-202505140509135729-202506250005244757.svg`, featured: false },
    { name: 'MicroGaming', src: `${CDN}/microgaming/microgaming-202505140443103466-202506242344011199.svg`, featured: false },
    { name: 'Yggdrasil', src: `${CDN}/yggdrasil/yggdrasil-202505140454199856-202506240658349745.svg`, featured: false },
    { name: 'RelaxGaming', src: `${CDN}/relaxgaming/relaxgaming_wh-min-202507170643564538-202507180024244323.png`, featured: false },
    { name: 'SBO Slots', src: `${CDN}/sboslots/sboslot-202505140448207414-202506240640270691.svg`, featured: false },
    { name: 'PlayStar', src: `${CDN}/playstar/ps-202505140440118534-202506250008317555.svg`, featured: false },
    { name: 'DragoonSoft', src: `${CDN}/dragoonsoft/dragoonsoft-min-202507150246327347-202507172115425245.png`, featured: false },
    { name: 'KA Gaming', src: `${CDN}/kagaming/ka%20gaming-202505132310342194-202506250009308750.svg`, featured: false },
    { name: 'SimplePlay', src: `${CDN}/simpleplay/simpleplay_wh-min-202511200222550469-202601112330240065.png`, featured: false, new: true },
    { name: '568WinGames', src: `${CDN}/568wingames/568win-202505140442284669-202506250001235776.svg`, featured: false },
    { name: 'CC88', src: `${CDN}/cc88/cc88-202505140440359959-202506250007312379.svg`, featured: false },
];

const searchScopes = [
    { id: 'all', label: 'All' },
    { id: 'games', label: 'Games' },
    { id: 'providers', label: 'Providers' },
];
const pageContainerClass = 'mx-auto w-full max-w-screen-2xl px-4 md:px-8';
const sectionTitleClass = 'text-xl font-bold tracking-tight text-slate-900 md:text-2xl';
const ALL_PROVIDERS = DEFAULT_ALL_PROVIDERS_VALUE;

const liveBigWins = [
    { user: 'Alex M.', amount: 'MYR 67,450', game: 'Great Blue Jackpot', time: '2 min ago', amountColor: 'text-[var(--color-danger-main)]' },
    { user: 'Sarah K.', amount: 'MYR 52,300', game: 'Fire Blaze: Blue Wizard', time: '5 min ago', amountColor: 'text-[var(--color-brand-primary)]' },
    { user: 'John D.', amount: 'MYR 120,500', game: 'Archer', time: '8 min ago', amountColor: 'text-[var(--color-danger-main)]' },
];

const INITIAL_GAMES = 30; // 5 rows × 6 columns (lg)

export default function SlotsPage({ selectedProviderIdFromMenu, onNavigate }) {
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
        providers: slotProviders,
        games: slotGames,
        initialProvider: slotProviders[0].name,
        allProvidersValue: ALL_PROVIDERS,
    });
    const [gamesToShow, setGamesToShow] = useState(INITIAL_GAMES);
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const { promo, isActive: isPromoActive, progressPercent, endPromo } = useSlotCurrentPromo();

    useEffect(() => {
        setGamesToShow(INITIAL_GAMES);
    }, [activeProvider, query, searchScope]);

    useEffect(() => {
        if (!selectedProviderIdFromMenu) return;
        const match = MATCHED_SLOT_PROVIDERS.find((p) => p.id === selectedProviderIdFromMenu);
        if (match) {
            setActiveProvider(match.gameProvider);
            setGamesToShow(INITIAL_GAMES);
        }
    }, [selectedProviderIdFromMenu]);

    useEffect(() => {
        if (activeProvider === ALL_PROVIDERS) return;
        if (!visibleProviders.length) return;
        if (!visibleProviders.some((provider) => provider.name === activeProvider)) {
            setActiveProvider(visibleProviders[0].name);
            setGamesToShow(INITIAL_GAMES);
        }
    }, [visibleProviders, activeProvider]);

    const handleApplyFilters = (payload) => {
        applyBrowseFilters(payload);
        setGamesToShow(INITIAL_GAMES);
    };

    return (
        <main className="w-full bg-gradient-to-b from-blue-50 via-slate-50 to-slate-100 pb-14 font-sans">
            <section className="w-full pt-5 md:pt-7">
                <div className="w-full max-w-screen-2xl mx-auto px-4 md:px-8">
                    <div className="page-hero-banner">
                        <img
                            src={slotsBanner}
                            alt="Slots Banner - Instant Rebate"
                            className={`page-hero-banner__img ${PAGE_BANNER_IMG_FILL}`}
                        />
                        <div className="absolute inset-y-0 left-0 w-[56%] bg-[linear-gradient(90deg,rgb(234_244_255_/_0.96)_0%,rgb(234_244_255_/_0.86)_45%,transparent_100%)] sm:w-[52%] md:w-[50%]" />
                        <div className="absolute inset-0 flex items-center justify-start">
                            <div className="w-[50%] max-md:pl-8 max-md:pr-3 sm:w-[50%] md:w-[50%] md:pl-[18%] md:pr-0">
                                <div className="w-full max-w-[420px] text-center max-md:text-center">
                                    <h1 className="text-xl font-bold uppercase tracking-[0.03em] text-[rgb(25_41_71)] sm:text-2xl md:text-3xl">
                                        Slots
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
                    category="slots"
                    query={query}
                    onQueryChange={setQuery}
                    searchScope={searchScope}
                    onSearchScopeChange={setSearchScope}
                    scopes={searchScopes}
                    onOpenFilterModal={() => setFilterModalOpen(true)}
                    resultSummary={resultSummary}
                    providerSummaryText={activeProvider === ALL_PROVIDERS ? 'Browsing all providers' : `Provider filter: ${activeProvider}`}
                    showWalletSummary={false}
                    promoSection={
                        isPromoActive ? (
                            <CurrentPromoSection
                                promo={promo}
                                progressPercent={progressPercent}
                                onEndPromo={endPromo}
                            />
                        ) : null
                    }
                />
            </section>

            <section className={`${pageContainerClass} mt-5 md:mt-6`}>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
                    {filteredGames.slice(0, gamesToShow).map((game, idx) => {
                        const isHighRtp = game.rtp >= 96.5;
                        const TrendIcon = isHighRtp ? TrendingUp : TrendingDown;
                        const arrowColor = isHighRtp ? 'text-green-600' : 'text-red-600';

                        return (
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
                                <img
                                    src={game.imgUrl}
                                    alt=""
                                    className="absolute inset-0 h-full w-full rounded-[inherit] object-cover object-center transition-transform duration-500 md:group-hover:scale-110"
                                    loading={idx < 12 ? 'eager' : 'lazy'}
                                    decoding="async"
                                />
                                <GameCardFavouriteButton
                                    category="slots"
                                    name={game.name}
                                    provider={game.provider}
                                    imgUrl={game.imgUrl}
                                    navigatePage="slots"
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
                                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-bold text-blue-700">
                                    RTP {game.rtp.toFixed(2)}%
                                    <TrendIcon size={14} strokeWidth={2.5} className={arrowColor} />
                                </span>
                            </div>
                        </div>
                        );
                    })}
                </div>
                {filteredGames.length === 0 && (
                    <div className="surface-card mt-6 rounded-2xl px-4 py-7 text-center">
                        <p className="text-base font-bold text-slate-800">No games or providers found.</p>
                        <p className="mt-1 text-xs text-slate-500">Try searching a different game or provider.</p>
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
                            const game = slotGames.find((g) => g.name === win.game) ?? slotGames[0];
                            return (
                            <div
                                key={idx}
                                className="surface-card flex min-w-0 flex-1 items-start gap-3.5 rounded-2xl p-3.5 transition hover:-translate-y-0.5 hover:shadow-lg sm:items-center sm:gap-5 sm:p-4"
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
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onNavigate?.('game-detail', {
                                                gameSlug: buildGameDetailSlug(game.name, game.provider),
                                            })
                                        }
                                        className="btn-theme-primary mt-1.5 inline-flex h-9 max-w-[180px] items-center justify-center gap-1.5 rounded-xl px-4 text-xs font-bold transition hover:scale-[1.02] active:scale-[0.98] sm:mt-2"
                                    >
                                        <Play size={14} fill="currentColor" className="opacity-95" aria-hidden />
                                        Play
                                    </button>
                                </div>
                            </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <SlotBrowseFilterModal
                open={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                providers={slotProviders}
                games={slotGames}
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
