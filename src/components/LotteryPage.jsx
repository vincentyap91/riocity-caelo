import React, { useEffect, useMemo, useState } from 'react';
import ninetyThreeConnectLightmodeLogo from '../assets/93connect-lightmode.png';
import gameplayLightmodeLogo from '../assets/gameplay-lightmode.png';
import lotteryBanner from '../assets/lottery-banner.jpg';
import { PAGE_BANNER_IMG_FILL } from '../constants/pageBannerClasses';
import { GameCardFavouriteButton, GameCardPlayBar } from './game/GameCardActions';
import { navigateToGameDetail } from '../utils/gameDetailRoutes';
import SlotBrowseFilterModal from './SlotBrowseFilterModal';
import ProductBrowseControlPanel from './ProductBrowseControlPanel';
import useProductBrowseFilters, { DEFAULT_ALL_PROVIDERS_VALUE } from '../hooks/useProductBrowseFilters';

const LOTTERY_GAME_FALLBACK_IMAGE = 'https://pksoftcdn.azureedge.net/media/placeholder_riocity-202408050928489215.jpg';
const pageContainerClass = 'mx-auto w-full max-w-screen-2xl px-4 md:px-8';
const searchScopes = [
    { id: 'all', label: 'All' },
    { id: 'games', label: 'Games' },
    { id: 'providers', label: 'Providers' },
];
const ALL_PROVIDERS = DEFAULT_ALL_PROVIDERS_VALUE;

const lotteryProviders = [
    {
        id: 'gameplay-lottery',
        name: 'GamePlay Lottery',
        logo: gameplayLightmodeLogo,
        games: [
            { name: 'Keno', imgUrl: 'https://pksoftcdn.azureedge.net/games/GamePlay/keno.png' },
            { name: 'Thai Lottery', imgUrl: 'https://pksoftcdn.azureedge.net/games/GamePlay/thailottery.png' },
            { name: 'Fast3', imgUrl: 'https://pksoftcdn.azureedge.net/games/GamePlay/fast3.png' },
            { name: 'So De', imgUrl: 'https://pksoftcdn.azureedge.net/games/GamePlay/sode.png' },
            { name: 'Sabaidee Lottery', imgUrl: 'https://pksoftcdn.azureedge.net/games/GamePlay/sabaideelottery.png' },
        ],
    },
    {
        id: '93connect',
        name: '93Connect',
        logo: ninetyThreeConnectLightmodeLogo,
        games: [
            {
                name: '93Connect',
                imgUrl: 'https://pksoftcdn.azureedge.net/games/93Connect/LOBBY.png',
            },
            { name: 'KENO', imgUrl: 'https://pksoftcdn.azureedge.net/media/keno_gameicon_en_200x200-202410231423355657.png' },
            { name: 'COIN MINI', imgUrl: LOTTERY_GAME_FALLBACK_IMAGE },
            { name: 'DRAGON TIGER', imgUrl: 'https://pksoftcdn.azureedge.net/media/dragontiger_gameicon_200x200_en-202410231421552615.png' },
            { name: '7 UP 7 DOWN', imgUrl: 'https://pksoftcdn.azureedge.net/media/7up7down_gamebanner_200x200_en_vn-202410231418075809.png' },
            { name: 'NOONA SHOT', imgUrl: 'https://pksoftcdn.azureedge.net/media/noonashot_gameicon_200x200_en-202410231426009637.png' },
            { name: 'BELANGKAI', imgUrl: 'https://pksoftcdn.azureedge.net/media/download-202410231420078860.png' },
            { name: 'BOUNTY DICE', imgUrl: 'https://pksoftcdn.azureedge.net/media/bountydice_gameicon_200x200_en-202410231420410546.png' },
            { name: 'JHANDI MUNDA', imgUrl: 'https://pksoftcdn.azureedge.net/media/jhandimunda_gameicon_200x200_en-202410231423009974.png' },
            { name: 'FISH PRAWN CRAB', imgUrl: 'https://pksoftcdn.azureedge.net/media/fishprawncrab_gameicon_200x200_en-202410231422279102.png' },
            { name: 'XOC DIA', imgUrl: 'https://pksoftcdn.azureedge.net/media/xocdia_gameicon_200x200_en_id-202410231429033306.png' },
            { name: '2D LUCKY STRIKE', imgUrl: 'https://pksoftcdn.azureedge.net/media/2dls_gameicon_200x200_en-202410231417234604.png' },
            { name: 'THAI HILO', imgUrl: 'https://pksoftcdn.azureedge.net/media/thaihilo_gameicon_200x200_en-202410231427503462.png' },
            { name: 'THAI LOTTO', imgUrl: 'https://pksoftcdn.azureedge.net/media/tlotto_gameicon_200x200_en-202410231428259060.png' },
            { name: 'DING DONG', imgUrl: 'https://pksoftcdn.azureedge.net/media/dd_gameicon_200x200_en_id-202410231421225002.png' },
            { name: 'RNG WAR', imgUrl: 'https://pksoftcdn.azureedge.net/media/rngwar_gameicon_en_200x200-202410231427177305.png' },
            { name: 'NUMBER GAME', imgUrl: 'https://pksoftcdn.azureedge.net/media/numbergame_gameicon_en_200x200-202410231426447740.png' },
            { name: 'ATOM WAR', imgUrl: 'https://pksoftcdn.azureedge.net/media/atomwar_gameicon_en_200x200-202410231419158717.png' },
            { name: 'ATOM', imgUrl: 'https://pksoftcdn.azureedge.net/media/atom_gameicon_en_200x200-202410231418460629.png' },
            { name: 'KENO SOCCER', imgUrl: 'https://pksoftcdn.azureedge.net/media/keno-soccer_gameicon_200x200_en_id-202410231424254568.png' },
            { name: 'KENO WAR', imgUrl: 'https://pksoftcdn.azureedge.net/media/kenowar_gameicon_en_200x200-202410231425243506.png' },
            { name: 'KENO MINI', imgUrl: LOTTERY_GAME_FALLBACK_IMAGE },
            { name: 'TAIXIU MINI', imgUrl: LOTTERY_GAME_FALLBACK_IMAGE },
        ],
    },
];

const NINETY_THREE_CONNECT_PROVIDER_ID = '93connect';

function LotteryGameCard({ game, providerName, providerId, onNavigate }) {
    const src = game.imgUrl || LOTTERY_GAME_FALLBACK_IMAGE;
    const is93Connect = providerId === NINETY_THREE_CONNECT_PROVIDER_ID;
    /** 93Connect only: full-bleed cover (placeholders + wide lobby); use `imageFit: 'contain'` to letterbox. */
    const use93ConnectFill = is93Connect && game.imageFit !== 'contain';

    const onImgError = (event) => {
        event.currentTarget.onerror = null;
        event.currentTarget.src = LOTTERY_GAME_FALLBACK_IMAGE;
    };

    return (
        <div className="surface-card group relative flex flex-col overflow-hidden rounded-2xl transition md:hover:-translate-y-1 md:hover:shadow-lg">
            <button
                type="button"
                className="absolute inset-0 z-[5] md:hidden"
                onClick={() => navigateToGameDetail(onNavigate, game.name, providerName)}
                aria-label={`Open ${game.name}`}
            />

            {use93ConnectFill ? (
            <div className="pointer-events-none relative z-10 h-44 overflow-hidden rounded-t-2xl bg-[linear-gradient(180deg,rgb(13_33_71)_0%,rgb(10_28_63)_100%)] sm:h-52 xl:h-56">
                <img
                    src={src}
                    alt={game.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-500 md:group-hover:scale-[1.03]"
                    onError={onImgError}
                />
                <GameCardFavouriteButton
                    category="lottery"
                    name={game.name}
                    provider={providerName}
                    imgUrl={game.imgUrl || LOTTERY_GAME_FALLBACK_IMAGE}
                    navigatePage="lottery"
                />
                <GameCardPlayBar
                    showOnHover
                    gameName={game.name}
                    gameProvider={providerName}
                    onNavigate={onNavigate}
                />
            </div>
            ) : (
            <div className="pointer-events-none relative z-10 flex h-44 items-center justify-center overflow-hidden rounded-t-2xl bg-[linear-gradient(180deg,rgb(13_33_71)_0%,rgb(10_28_63)_100%)] p-4 sm:h-52 sm:p-5 xl:h-56">
                <img
                    src={src}
                    alt={game.name}
                    loading="lazy"
                    className="h-full w-full max-w-full rounded-[inherit] object-contain transition-transform duration-500 md:group-hover:scale-[1.03]"
                    onError={onImgError}
                />
                <GameCardFavouriteButton
                    category="lottery"
                    name={game.name}
                    provider={providerName}
                    imgUrl={game.imgUrl || LOTTERY_GAME_FALLBACK_IMAGE}
                    navigatePage="lottery"
                />
                <GameCardPlayBar
                    showOnHover
                    gameName={game.name}
                    gameProvider={providerName}
                    onNavigate={onNavigate}
                />
            </div>
            )}

            <div className="p-2 md:p-3">
                <p className="line-clamp-2 text-xs font-bold text-slate-800 md:text-sm">{game.name}</p>
                <p className="mt-1 text-xs text-slate-500">{providerName}</p>
            </div>
        </div>
    );
}

export default function LotteryPage({ onNavigate }) {
    const [filterModalOpen, setFilterModalOpen] = useState(false);
    const [gamesToShow, setGamesToShow] = useState(30);

    const lotteryBrowseProviders = useMemo(
        () => lotteryProviders.map((provider) => ({ name: provider.name, src: provider.logo })),
        []
    );
    const lotteryGames = useMemo(
        () => lotteryProviders.flatMap((provider) => provider.games.map((game) => ({
            ...game,
            provider: provider.name,
            providerId: provider.id,
            imgUrl: game.imgUrl || LOTTERY_GAME_FALLBACK_IMAGE,
        }))),
        []
    );

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
        providers: lotteryBrowseProviders,
        games: lotteryGames,
        initialProvider: lotteryBrowseProviders[0]?.name,
        allProvidersValue: ALL_PROVIDERS,
    });

    useEffect(() => {
        if (activeProvider === ALL_PROVIDERS) return;
        if (!visibleProviders.length) return;
        if (!visibleProviders.some((provider) => provider.name === activeProvider)) {
            setActiveProvider(visibleProviders[0].name);
            setGamesToShow(30);
        }
    }, [activeProvider, setActiveProvider, visibleProviders]);

    useEffect(() => {
        setGamesToShow(30);
    }, [activeProvider, query, searchScope]);

    const handleApplyFilters = (payload) => {
        applyBrowseFilters(payload);
        setGamesToShow(30);
    };

    return (
        <main className="w-full bg-gradient-to-b from-blue-50 via-slate-50 to-slate-100 pb-14 font-sans">
            <section className="w-full pt-5 md:pt-7">
                <div className={pageContainerClass}>
                    <div className="page-hero-banner">
                        <img
                            src={lotteryBanner}
                            alt="Lottery Banner"
                            className={`page-hero-banner__img ${PAGE_BANNER_IMG_FILL}`}
                        />
                        <div className="absolute inset-y-0 left-0 w-[56%] bg-[linear-gradient(90deg,rgb(234_244_255_/_0.96)_0%,rgb(234_244_255_/_0.86)_45%,transparent_100%)] sm:w-[52%] md:w-[50%]" />
                        <div className="absolute inset-0 flex items-center justify-start">
                            <div className="w-[50%] max-md:pl-8 max-md:pr-3 sm:w-[50%] md:w-[50%] md:pl-[18%] md:pr-0">
                                <div className="w-full max-w-[420px] text-center max-md:text-center">
                                    <h1 className="text-xl font-bold uppercase tracking-[0.03em] text-[rgb(25_41_71)] sm:text-2xl md:text-3xl">
                                        Lottery
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
                                <img
                                    src={provider.src}
                                    alt={provider.name}
                                    className="max-h-8 object-contain md:max-h-10"
                                    draggable={false}
                                />
                            </button>
                        );
                    })}
                </div>
            </section>

            <section className={pageContainerClass}>
                <ProductBrowseControlPanel
                    category="lottery"
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
                <div className="grid grid-cols-2 gap-3 md:gap-4 sm:grid-cols-3 lg:grid-cols-6">
                    {filteredGames.slice(0, gamesToShow).map((game) => (
                        <LotteryGameCard
                            key={`${game.providerId}-${game.name}`}
                            game={game}
                            providerName={game.provider}
                            providerId={game.providerId}
                            onNavigate={onNavigate}
                        />
                    ))}
                </div>

                {filteredGames.length === 0 && (
                    <div className="surface-card mt-6 rounded-2xl px-4 py-7 text-center">
                        <p className="text-base font-bold text-slate-800">No games match your search.</p>
                        <p className="mt-1 text-xs text-slate-500">Try a different keyword or switch provider.</p>
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

            <SlotBrowseFilterModal
                open={filterModalOpen}
                onClose={() => setFilterModalOpen(false)}
                providers={lotteryBrowseProviders}
                games={lotteryGames}
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
