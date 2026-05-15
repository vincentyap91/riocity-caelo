import React, { useMemo, useState } from 'react';
import { Club, Dices, Fish, Flame, Gamepad2, Grid3x3, Ticket, Trophy } from 'lucide-react';
import CasinoChipIcon from '../ui/CasinoChipIcon';
import TopGameCard from '../game/TopGameCard';
import SearchProvider from '../SearchProvider';
import { TOP_GAMES } from '../../constants/topGamesCatalog';
import { SPORTS_LOBBIES } from '../../constants/lobbyRegistry';

const CATEGORIES = [
    { id: 'all-games', label: 'All Games', page: 'all-games', icon: Grid3x3 },
    { id: 'popular', label: 'Popular', page: null, icon: Flame },
    { id: 'live-casino', label: 'Casino', page: 'live-casino', icon: CasinoChipIcon },
    { id: 'sports', label: 'Sports', page: 'sports', icon: Trophy },
    { id: 'e-sports', label: 'E-Sports', page: 'e-sports', icon: Gamepad2 },
    { id: 'slots', label: 'Slots', page: 'slots', icon: Dices },
    { id: 'fishing', label: 'Fishing', page: 'fishing', icon: Fish },
    { id: 'lottery', label: 'Lottery', page: 'lottery', icon: Ticket },
    { id: 'poker', label: 'Poker', page: 'poker', icon: Club },
];

export default function MobileHomeCategoryGames({ onNavigate }) {
    const [activeId, setActiveId] = useState('popular');
    const [searchQuery, setSearchQuery] = useState('');

    const activeCategory = useMemo(
        () => CATEGORIES.find((category) => category.id === activeId),
        [activeId]
    );
    const activeCategoryName = activeCategory?.label ?? 'Category';

    /** Full list for the active category (used when searching so matches aren’t limited to the first 12). */
    const gamesPool = useMemo(() => {
        if (activeId === 'all-games' || activeId === 'popular') {
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
        return gamesPool.slice(0, 12);
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

    return (
        <section aria-label="Games by category" className="w-full md:hidden">
            <div className="mx-auto flex max-w-screen-2xl gap-3 px-3 pb-8 pt-3">
                <nav
                    aria-label="Game categories"
                    className="sticky top-14 z-10 flex w-[4.5rem] shrink-0 flex-col gap-2 self-start"
                >
                    {CATEGORIES.map(({ id, label, icon: Icon }) => {
                        const active = activeId === id;
                        return (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setActiveId(id)}
                                className={`flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-xl px-1 py-2.5 text-center transition-all ${active
                                    ? 'border border-white/10 bg-[linear-gradient(90deg,rgb(232_23_47)_0%,rgb(248_48_77)_52%,rgb(255_108_121)_100%)] text-white ring-1 ring-white/10'
                                    : 'border border-[var(--color-border-default)] bg-white text-[var(--color-text-strong)] shadow-sm'
                                    }`}
                            >
                                <Icon
                                    size={18}
                                    strokeWidth={active ? 2.5 : 2}
                                    className={active ? 'text-white' : 'text-[var(--color-brand-primary)]'}
                                    aria-hidden
                                />
                                <span className="line-clamp-2 w-full text-center text-[11px] font-bold leading-tight">{label}</span>
                            </button>
                        );
                    })}
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
                    <div className="grid grid-cols-2 gap-3">
                        {filteredGames.map((game) => (
                            <TopGameCard
                                key={`${game.name}-${game.provider}-${activeId}`}
                                game={game}
                                onNavigate={onNavigate}
                                className="h-full"
                                imageFit={(activeId === 'sports' || activeId === 'e-sports' || activeId === 'lottery' || activeId === 'poker') ? 'contain' : 'cover'}
                            />
                        ))}
                    </div>
                    {filteredGames.length === 0 ? (
                        <p className="mt-4 rounded-xl border border-dashed border-[var(--color-border-default)] bg-[var(--color-surface-muted)] px-4 py-6 text-center text-sm font-medium text-[var(--color-text-muted)]">
                            {searchQuery.trim()
                                ? 'No games match your search. Try a different name or provider.'
                                : 'No featured games in this category yet.'}
                        </p>
                    ) : null}
                </div>
            </div>
        </section>
    );
}
