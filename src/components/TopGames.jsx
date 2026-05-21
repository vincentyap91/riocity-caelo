import React from 'react';
import SectionHeader from './SectionHeader';
import { Crown } from 'lucide-react';
import TopGameCard from './game/TopGameCard';
import { TOP_GAMES, TOP_GAMES_DEFAULT_VISIBLE, TOP_GAMES_GRID_CLASS } from '../constants/topGamesCatalog';

export default function TopGames({ onNavigate }) {
    const hasMoreGames = TOP_GAMES.length > TOP_GAMES_DEFAULT_VISIBLE;
    const visibleGames = TOP_GAMES.slice(0, TOP_GAMES_DEFAULT_VISIBLE);

    return (
        <section className="w-full pt-4">
            <SectionHeader
                title="Top Games"
                icon={<Crown size={22} fill="currentColor" className="text-[var(--color-brand-secondary)]" />}
                rightLink={hasMoreGames ? 'See all' : undefined}
                rightLinkTo={hasMoreGames ? 'all-games' : undefined}
                onNavigate={onNavigate}
            />

            <div className={TOP_GAMES_GRID_CLASS}>
                {visibleGames.map((game) => (
                    <TopGameCard
                        key={`${game.name}-${game.provider}`}
                        game={game}
                        onNavigate={onNavigate}
                    />
                ))}
            </div>
        </section>
    );
}
