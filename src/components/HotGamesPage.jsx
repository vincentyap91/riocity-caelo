import React, { useMemo } from 'react';
import hotGamesBanner from '../assets/hot-games.jpg';
import { PAGE_BANNER_IMG_FILL } from '../constants/pageBannerClasses';
import { SLOT_GAMES, FISHING_GAMES } from '../constants/gameCatalogs';
import { navigateToGameDetail } from '../utils/gameDetailRoutes';
import { GameCardFavouriteButton, GameCardPlayBar } from './game/GameCardActions';

const pageContainerClass = 'w-full max-w-screen-2xl mx-auto px-4 md:px-8';

function buildHotGames() {
  const slotsHot = SLOT_GAMES.filter((g) => g?.hot).map((g) => ({ ...g, page: 'slots' }));
  const fishingHot = FISHING_GAMES.filter((g) => g?.hot).map((g) => ({ ...g, page: 'fishing' }));
  const combined = [...slotsHot, ...fishingHot].filter((g) => g?.name && g?.provider && g?.imgUrl && g?.page);

  // Fill a tidy 6-col grid similar to the reference (repeat deterministically if needed).
  if (combined.length >= 24) return combined.slice(0, 24);
  if (combined.length === 0) return [];
  const repeats = Math.ceil(24 / combined.length);
  return Array.from({ length: repeats })
    .flatMap(() => combined)
    .slice(0, 24);
}

export default function HotGamesPage({ onNavigate }) {
  const hotGames = useMemo(() => buildHotGames(), []);

  return (
    <main className="w-full bg-[var(--color-surface-subtle)] pb-14 font-sans">
      <section className="w-full pt-5 md:pt-7">
        <div className={pageContainerClass}>
          <div className="page-hero-banner" role="img" aria-label="Hot Games banner">
            <img src={hotGamesBanner} alt="Hot Games" className={`page-hero-banner__img ${PAGE_BANNER_IMG_FILL}`} />
          </div>
        </div>
      </section>

      <section className={`${pageContainerClass} mt-4 md:mt-5`}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
          {hotGames.map((game, idx) => (
            <div
              key={`${game.page}-${game.provider}-${game.name}-${idx}`}
              className="surface-card group relative flex flex-col overflow-hidden rounded-2xl transition md:hover:-translate-y-1 md:hover:shadow-lg"
            >
              <button
                type="button"
                className="absolute inset-0 z-[5] md:hidden"
                onClick={() => navigateToGameDetail(onNavigate, game.name, game.provider, { navigatePage: game.page })}
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
                  draggable={false}
                />
                <GameCardFavouriteButton
                  category={game.page === 'fishing' ? 'fishing' : 'slots'}
                  name={game.name}
                  provider={game.provider}
                  imgUrl={game.imgUrl}
                  navigatePage={game.page}
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
              </div>
            </div>
          ))}
        </div>

        {hotGames.length === 0 && (
          <div className="surface-card mt-6 rounded-2xl px-4 py-7 text-center">
            <p className="text-base font-bold text-[var(--color-text-strong)]">No hot games available.</p>
            <p className="mt-1 text-xs text-[var(--color-text-muted)]">Please try again later.</p>
          </div>
        )}
      </section>
    </main>
  );
}

