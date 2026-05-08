import React, { useMemo, useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import allGameBanner from '../assets/all-game-banner.jpg';
import { PAGE_BANNER_IMG_FILL } from '../constants/pageBannerClasses';
import PromotionStyleTabs from './PromotionStyleTabs';
import TopGameCard from './game/TopGameCard';
import { TOP_GAMES, TOP_GAME_PAGE_LABELS } from '../constants/topGamesCatalog';

const pageContainerClass = 'mx-auto w-full max-w-screen-2xl px-4 md:px-8';

const filterItems = [
    { id: 'all', label: 'All Games' },
    ...Object.entries(TOP_GAME_PAGE_LABELS).map(([id, label]) => ({ id, label })),
];

export default function AllGamesPage({ onNavigate }) {
    const [activeFilter, setActiveFilter] = useState('all');

    const filteredGames = useMemo(() => {
        if (activeFilter === 'all') {
            return TOP_GAMES;
        }
        return TOP_GAMES.filter((game) => game.page === activeFilter);
    }, [activeFilter]);

    return (
        <main className="w-full bg-gradient-to-b from-blue-50 via-slate-50 to-slate-100 pb-14 font-sans">
            <section className="w-full pt-5 md:pt-7">
                <div className={pageContainerClass}>
                    <div className="page-hero-banner">
                        <img
                            src={allGameBanner}
                            alt="All Games Banner"
                            className={`page-hero-banner__img ${PAGE_BANNER_IMG_FILL}`}
                        />
                        <div className="absolute inset-y-0 left-0 w-[56%] bg-[linear-gradient(90deg,rgb(234_244_255_/_0.96)_0%,rgb(234_244_255_/_0.86)_65%,transparent_100%)] sm:w-[52%] md:w-[50%]" />
                        <div className="absolute inset-0 flex items-center justify-start">
                            <div className="w-[50%] max-md:pl-8 max-md:pr-3 sm:w-[50%] md:w-[50%] md:pl-[18%] md:pr-0">
                                <div className="w-full max-w-[420px] text-center max-md:text-center">
                                    <h1 className="text-xl font-bold uppercase tracking-[0.03em] text-[rgb(25_41_71)] sm:text-2xl md:text-3xl">
                                        All Games
                                    </h1>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className={`${pageContainerClass} mt-4 md:mt-6`}>
                <div className="surface-panel rounded-2xl p-4 md:p-5">
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                        <div>
                            <div className="flex items-center gap-2 text-[var(--color-brand-primary)]">
                                <LayoutGrid size={18} />
                                <p className="text-xl font-bold tracking-tight text-slate-900 md:text-2xl">
                                    Browse Games
                                </p>
                            </div>
                        </div>
                        <p className="text-xs font-bold uppercase tracking-[0.08em] text-[rgb(106_117_144)] md:text-xs">
                            Showing {filteredGames.length} game{filteredGames.length === 1 ? '' : 's'}
                        </p>
                    </div>

                    <PromotionStyleTabs
                        items={filterItems}
                        value={activeFilter}
                        onChange={setActiveFilter}
                        className="mt-4"
                        ariaLabel="All games category filters"
                    />
                </div>
            </section>

            <section className={`${pageContainerClass} mt-5 md:mt-6`}>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {filteredGames.map((game) => (
                        <TopGameCard
                            key={`${game.name}-${game.provider}`}
                            game={game}
                            onNavigate={onNavigate}
                            imageFit={['e-sports', 'poker', 'lottery'].includes(game.page) ? 'contain' : 'cover'}
                            imageStageClassName={['e-sports', 'poker', 'lottery'].includes(game.page) ? 'bg-[linear-gradient(180deg,rgb(248_250_255)_0%,rgb(236_243_252)_100%)]' : ''}
                        />
                    ))}
                </div>

                {filteredGames.length === 0 && (
                    <div className="surface-card mt-6 rounded-2xl px-4 py-8 text-center">
                        <p className="text-base font-bold text-slate-800">No games in this category yet.</p>
                        <p className="mt-1 text-sm text-slate-500">Try a different filter to keep browsing the featured collection.</p>
                    </div>
                )}
            </section>
        </main>
    );
}

