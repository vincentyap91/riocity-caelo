import React from 'react';
import { GameCardFavouriteButton, GameCardPlayBar } from './GameCardActions';
import RtpLabel from './RtpLabel';
import { navigateToGameDetail } from '../../utils/gameDetailRoutes';
import { getCategoryGameBadgeLabel, getTopGameFavouriteCategory } from '../../constants/topGamesCatalog';

/** Footer game title — shared by Top Games and Category Games (compact) cards. */
const COMPACT_GAME_TITLE_CLASS =
    'line-clamp-2 text-center text-[11px] font-bold leading-tight text-white';

export default function TopGameCard({
    game,
    onNavigate,
    className = '',
    imageFit = 'cover',
    imageStageClassName = '',
    variant = 'compact',
    compact = false,
    showRtp = false,
    favouriteCategory,
    navigatePage,
    imageLoading = 'lazy',
}) {
    if (!game) {
        return null;
    }

    const resolvedFit =
        game.imageFit === 'cover' || game.imageFit === 'contain' ? game.imageFit : imageFit;

    const imageClassName =
        resolvedFit === 'contain'
            ? 'absolute inset-0 h-full w-full rounded-[inherit] object-contain p-2 transition-transform duration-500 ease-out md:group-hover:scale-[1.03]'
            : 'absolute inset-0 h-full w-full rounded-[inherit] object-cover object-center transition-transform duration-500 ease-out md:group-hover:scale-[1.05]';

    const category = variant === 'category';
    const categoryCompact = category && compact;
    const detailed = variant === 'detailed';
    const resolvedPage = navigatePage ?? game.page;
    const resolvedFavouriteCategory = favouriteCategory ?? getTopGameFavouriteCategory(resolvedPage);
    const badgeLabel = game.categoryLabel ?? getCategoryGameBadgeLabel(game);

    const titleClassName = category
        ? categoryCompact
            ? 'line-clamp-1 w-full text-center text-[11px] font-bold leading-snug tracking-tight text-white'
            : 'line-clamp-2 w-full text-center text-xs font-bold leading-snug tracking-tight text-white'
        : detailed
            ? 'line-clamp-2 text-xs font-bold leading-snug text-[var(--color-text-strong)] md:text-sm'
            : COMPACT_GAME_TITLE_CLASS;

    const cardClassName = category
        ? categoryCompact
            ? 'rounded-lg border-0 bg-[var(--color-surface-base)] shadow-[var(--shadow-subtle)]'
            : 'rounded-xl border-0 bg-[var(--color-surface-base)] shadow-[var(--shadow-brand-card)]'
        : 'rounded-xl border-b-4 border-[var(--color-brand-primary)] bg-[var(--color-surface-base)] shadow-[var(--shadow-brand-card)]';

    const imageStageClass = categoryCompact
        ? `aspect-square w-full overflow-hidden rounded-t-lg bg-[var(--color-surface-muted)] ${imageStageClassName}`.trim()
        : `aspect-square w-full overflow-hidden rounded-t-xl bg-[var(--color-surface-muted)] ${imageStageClassName}`.trim();

    const showRtpFooter = showRtp && typeof game.rtp === 'number' && !detailed && !category;
    const showCompactProviderBadge = !detailed && !category;
    const showCategoryProviderBadge = category && badgeLabel;

    return (
        <div
            className={`group relative flex flex-col overflow-hidden transition-[transform,box-shadow] duration-300 ease-out will-change-transform md:hover:-translate-y-0.5 md:hover:shadow-[var(--shadow-card-hover)] ${cardClassName} ${className}`.trim()}
        >
            <button
                type="button"
                onClick={() => navigateToGameDetail(onNavigate, game.name, game.provider)}
                className="absolute inset-0 z-[5] md:hidden"
                aria-label={`Open ${game.name}`}
            />
            <div className={`pointer-events-none relative z-10 isolate overflow-hidden bg-[var(--color-surface-muted)] ${imageStageClass}`.trim()}>
                <img
                    src={game.imgUrl}
                    alt={game.name}
                    loading={imageLoading}
                    decoding="async"
                    className={imageClassName}
                />

                <GameCardPlayBar
                    showOnHover
                    className="overflow-hidden rounded-t-xl"
                    gameName={game.name}
                    gameProvider={game.provider}
                    onNavigate={onNavigate}
                />

                {(game.hot || game.new) && detailed ? (
                    <span className="pointer-events-none absolute left-2 top-2 z-20 rounded-full bg-[var(--color-hot-main)] px-2.5 py-0.5 text-xs font-bold text-white shadow-[var(--shadow-hot)]">
                        {game.hot ? 'HOT' : 'NEW'}
                    </span>
                ) : null}

                {showCompactProviderBadge ? (
                    <div className="pointer-events-none absolute left-0 top-0 z-20 flex max-w-[65%] items-center justify-center rounded-br-lg bg-[var(--color-surface-base)] px-2 py-0.5 shadow-sm">
                        <span className="truncate text-xs font-bold italic text-[var(--color-brand-secondary)]">{game.provider}</span>
                    </div>
                ) : null}

                {showCategoryProviderBadge ? (
                    <div
                        className={`pointer-events-none absolute z-20 max-w-[calc(100%-1.75rem)] rounded bg-white shadow-sm ${categoryCompact ? 'left-1 top-1 px-1 py-0.5' : 'left-2 top-2 rounded-lg px-2 py-1'}`}
                    >
                        <span
                            className={`line-clamp-1 font-semibold leading-tight text-[var(--color-brand-secondary)] ${categoryCompact ? 'text-[9px]' : 'text-[10px]'}`}
                        >
                            {badgeLabel}
                        </span>
                    </div>
                ) : null}

                <GameCardFavouriteButton
                    category={resolvedFavouriteCategory}
                    name={game.name}
                    provider={game.provider}
                    imgUrl={game.imgUrl}
                    navigatePage={resolvedPage}
                    size="sm"
                    className={categoryCompact ? '!right-1 !top-1 scale-[0.82] origin-top-right' : ''}
                />
            </div>

            <div
                className={category
                    ? categoryCompact
                        ? 'flex w-full shrink-0 flex-col items-center justify-center gap-1 border-t border-white/10 bg-[var(--color-brand-primary)] px-1.5 py-2'
                        : 'flex min-h-[4rem] w-full shrink-0 flex-col items-center justify-center gap-1 border-t border-white/10 bg-[var(--color-brand-primary)] px-2 py-2.5'
                    : detailed
                        ? 'flex min-h-[4.6rem] w-full shrink-0 flex-col justify-center border-t border-[var(--color-border-default)] bg-[var(--color-surface-base)] px-2.5 py-2 md:px-3'
                        : showRtpFooter
                            ? 'flex w-full shrink-0 flex-col items-center justify-center gap-1 border-t border-white/10 bg-[var(--color-brand-primary)] px-2 py-2'
                            : 'flex h-11 w-full shrink-0 items-center justify-center border-t border-white/10 bg-[var(--color-brand-primary)] px-2 py-1'
                }
            >
                <span className={titleClassName}>{game.name}</span>
                {showRtpFooter ? (
                    <RtpLabel value={game.rtp} variant="footer" />
                ) : null}
                {category ? (
                    <RtpLabel value={game.rtp} variant="footer" compact={categoryCompact} />
                ) : null}
                {detailed ? (
                    <>
                        <span className="mt-1 truncate text-[11px] font-semibold text-[var(--color-text-muted)]">
                            {game.provider}
                        </span>
                        <RtpLabel value={game.rtp} className="mt-2 self-start" />
                    </>
                ) : null}
            </div>
        </div>
    );
}
