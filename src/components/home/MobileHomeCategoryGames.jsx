import React, { useMemo, useState } from 'react';
import { LayoutGrid } from 'lucide-react';
import TopGameCard from '../game/TopGameCard';
import { GAME_CATEGORY_NAV_ITEMS, GameCategoryNavItem } from '../game/GameCategoryNavigation';
import SectionHeader from '../SectionHeader';
import SearchProvider from '../SearchProvider';
import {
    enrichGameRtp,
    TOP_GAMES,
    TOP_GAMES_DEFAULT_VISIBLE,
    TOP_GAMES_GRID_CLASS,
} from '../../constants/topGamesCatalog';
import { SPORTS_LOBBIES } from '../../constants/lobbyRegistry';

const CATEGORIES = GAME_CATEGORY_NAV_ITEMS
    .filter((category) => category.id !== 'popular')
    .map((category) => (
        category.id === 'all-games' ? { ...category, label: 'All' } : category
    ));

const DEFAULT_CATEGORY_ID = 'all-games';

const DESKTOP_PREVIEW_LIMIT = TOP_GAMES_DEFAULT_VISIBLE * 2;

function useCategoryGamesState() {
    const [activeId, setActiveId] = useState(DEFAULT_CATEGORY_ID);
    const [searchQuery, setSearchQuery] = useState('');

    const activeCategory = useMemo(
        () => CATEGORIES.find((category) => category.id === activeId),
        [activeId],
    );
    const activeCategoryName = activeCategory?.label ?? 'Category';

    const gamesPool = useMemo(() => {
        if (activeId === 'all-games') {
            return TOP_GAMES;
        }
        if (activeId === 'sports') {
            return SPORTS_LOBBIES.map((lobby) => ({
                ...lobby,
                page: 'sports',
            }));
        }
        const cat = CATEGORIES.find((c) => c.id === activeId);
        const pageKey = cat?.page;
        if (!pageKey) return TOP_GAMES;
        return TOP_GAMES.filter((g) => g.page === pageKey);
    }, [activeId]);

    const categoryGames = useMemo(() => {
        if (searchQuery.trim()) {
            return gamesPool;
        }
        return gamesPool;
    }, [gamesPool, searchQuery]);

    const filteredGames = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLowerCase();
        if (!normalizedQuery) {
            return categoryGames;
        }

        return categoryGames.filter((game) => {
            const name = (game.name ?? '').toLowerCase();
            const provider = (game.provider ?? '').toLowerCase();
            const label = (game.categoryLabel ?? '').toLowerCase();
            return (
                name.includes(normalizedQuery)
                || provider.includes(normalizedQuery)
                || label.includes(normalizedQuery)
            );
        });
    }, [categoryGames, searchQuery]);

    const imageFitForCategory = (categoryId) => (
        categoryId === 'sports'
        || categoryId === 'e-sports'
        || categoryId === 'lottery'
        || categoryId === 'poker'
            ? 'contain'
            : 'cover'
    );

    return {
        activeId,
        setActiveId,
        searchQuery,
        setSearchQuery,
        activeCategoryName,
        filteredGames,
        imageFitForCategory,
    };
}

function CategoryGamesEmpty({ searchQuery }) {
    return (
        <p className="mt-4 rounded-xl border border-dashed border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 py-6 text-center text-sm font-medium text-[var(--color-text-muted)]">
            {searchQuery.trim()
                ? 'No games match your search. Try a different name or provider.'
                : 'No featured games in this category yet.'}
        </p>
    );
}

function MobileCategoryBrowse({ onNavigate, state }) {
    const {
        activeId,
        setActiveId,
        searchQuery,
        setSearchQuery,
        activeCategoryName,
        filteredGames,
        imageFitForCategory,
    } = state;

    const previewGames = useMemo(() => {
        if (searchQuery.trim()) {
            return filteredGames;
        }
        return filteredGames.slice(0, 12);
    }, [filteredGames, searchQuery]);

    return (
        <div className="mx-auto flex max-w-screen-2xl gap-3 px-3 pb-8 pt-3">
            <nav
                aria-label="Game categories"
                className="sticky top-14 z-10 flex w-[4.5rem] shrink-0 flex-col gap-2 self-start"
            >
                {CATEGORIES.map((category) => (
                    <GameCategoryNavItem
                        key={category.id}
                        category={category}
                        active={activeId === category.id}
                        onSelect={(item) => setActiveId(item.id)}
                    />
                ))}
            </nav>

            <div className="min-w-0 flex-1">
                <SearchProvider
                    value={searchQuery}
                    onChange={setSearchQuery}
                    category={activeId}
                    placeholder={`Search in ${activeCategoryName}...`}
                    ariaLabel={`Search games in ${activeCategoryName}`}
                    className="mb-3"
                    widthClassName="w-full"
                />
                <div className={TOP_GAMES_GRID_CLASS}>
                    {previewGames.map((game) => (
                        <TopGameCard
                            key={`${game.name}-${game.provider}-${activeId}`}
                            game={enrichGameRtp(game)}
                            showRtp
                            onNavigate={onNavigate}
                            imageFit={imageFitForCategory(activeId)}
                        />
                    ))}
                </div>
                {previewGames.length === 0 ? <CategoryGamesEmpty searchQuery={searchQuery} /> : null}
            </div>
        </div>
    );
}

function DesktopCategoryBrowse({ onNavigate, state }) {
    const {
        activeId,
        setActiveId,
        searchQuery,
        setSearchQuery,
        activeCategoryName,
        filteredGames,
        imageFitForCategory,
    } = state;

    const previewGames = useMemo(() => {
        if (searchQuery.trim()) {
            return filteredGames;
        }
        return filteredGames.slice(0, DESKTOP_PREVIEW_LIMIT);
    }, [filteredGames, searchQuery]);

    return (
        <section className="w-full pt-4">
            <SectionHeader
                title="Category Games"
                icon={<LayoutGrid size={22} className="text-[var(--color-brand-secondary)]" strokeWidth={2.25} />}
            />

            <nav
                aria-label="Game category tabs"
                className="mb-3 min-w-0 overflow-x-auto pb-1"
            >
                <div className="flex min-w-max gap-2.5">
                    {CATEGORIES.map((category) => (
                        <GameCategoryNavItem
                            key={category.id}
                            category={category}
                            active={activeId === category.id}
                            orientation="horizontal"
                            onSelect={(item) => setActiveId(item.id)}
                        />
                    ))}
                </div>
            </nav>

            <SearchProvider
                value={searchQuery}
                onChange={setSearchQuery}
                category={activeId}
                placeholder={`Search in ${activeCategoryName}...`}
                ariaLabel={`Search games in ${activeCategoryName}`}
                className="mb-3"
                widthClassName="w-full"
            />

            <div className={TOP_GAMES_GRID_CLASS}>
                {previewGames.map((game) => (
                    <TopGameCard
                        key={`${game.name}-${game.provider}-${activeId}-desktop`}
                        game={enrichGameRtp(game)}
                        showRtp
                        onNavigate={onNavigate}
                        imageFit={imageFitForCategory(activeId)}
                    />
                ))}
            </div>
            {previewGames.length === 0 ? <CategoryGamesEmpty searchQuery={searchQuery} /> : null}
        </section>
    );
}

/**
 * Homepage category browser. Mobile: vertical sidebar + grid. Desktop: tabs + search + grid (below VIP).
 * @param {'mobile' | 'desktop'} variant
 */
export default function MobileHomeCategoryGames({ onNavigate, variant = 'mobile' }) {
    const state = useCategoryGamesState();

    if (variant === 'desktop') {
        return (
            <section aria-label="Games by category" className="hidden w-full md:block">
                <DesktopCategoryBrowse onNavigate={onNavigate} state={state} />
            </section>
        );
    }

    return (
        <section aria-label="Games by category" className="w-full md:hidden">
            <MobileCategoryBrowse onNavigate={onNavigate} state={state} />
        </section>
    );
}
