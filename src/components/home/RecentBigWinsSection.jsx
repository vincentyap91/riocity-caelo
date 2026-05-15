import React from 'react';
import SectionHeader from '../SectionHeader';
import { Clock, Trophy } from 'lucide-react';
import { HOME_LIVE_BIG_WINS_FEED_HEIGHT_CLASS, MOCK_RECENT_BIG_WINS, maskUsername } from '../../constants/homeLiveActivity';

function WinRow({ item }) {
    const badge = item.badge || item.provider;

    return (
        <li className="border-b border-[var(--color-border-default)]/90 py-3.5 sm:py-4 md:py-[18px]">
            <div className="flex gap-2.5 max-sm:items-start sm:gap-3 md:gap-4">
                <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-[var(--radius-control)] bg-[var(--color-surface-muted)] ring-1 ring-[var(--color-border-accent)] max-sm:mt-0.5 sm:h-[4.5rem] sm:w-[4.5rem] md:h-[5rem] md:w-[5rem]">
                    <img src={item.imgUrl} alt="" className="h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3 md:gap-4">
                    <div className="min-w-0 flex-1 pr-0.5">
                        <span
                            title={badge}
                            className="inline-flex max-w-full rounded-md bg-[var(--color-surface-muted)] px-1.5 py-0.5 text-xs font-bold uppercase leading-snug tracking-wide text-[var(--color-text-subtle)] ring-1 ring-[var(--color-border-default)]/80 sm:px-2 sm:leading-normal"
                        >
                            <span className="min-w-0 break-words [overflow-wrap:anywhere]">{badge}</span>
                        </span>
                        <p className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-[var(--color-text-strong)] max-sm:mt-1.5 sm:mt-2 md:text-base">
                            {item.game}
                        </p>
                        <p className="mt-0.5 text-xs font-medium leading-snug text-[var(--color-text-muted)] sm:mt-1">
                            {maskUsername(item.user)}
                        </p>
                    </div>
                    <div className="flex min-w-0 shrink-0 flex-col items-end gap-0.5 self-center text-right sm:gap-1">
                        <span className="break-words text-right text-xs font-bold tabular-nums leading-tight tracking-tight text-[var(--color-brand-secondary)] sm:text-base sm:leading-none">
                            {item.amount}
                        </span>
                        <span className="flex max-w-[7.5rem] items-center justify-end gap-0.5 text-xs font-medium leading-none text-[var(--color-brand-secondary)] sm:max-w-none sm:gap-1">
                            <Clock size={11} className="max-sm:h-2.5 max-sm:w-2.5 shrink-0 opacity-80 sm:h-3 sm:w-3" aria-hidden />
                            <span className="min-w-0">{item.timeAgo}</span>
                        </span>
                    </div>
                </div>
            </div>
        </li>
    );
}

function WinsTrack({ items }) {
    return (
        <ul className="m-0 list-none p-0">
            {items.map((item) => (
                <WinRow key={item.id} item={item} />
            ))}
        </ul>
    );
}

/**
 * Homepage: flat recent wins list (no inner cards); optional infinite vertical scroll.
 */
export default function RecentBigWinsSection() {
    const items = MOCK_RECENT_BIG_WINS;

    return (
        <div className="flex min-h-0 w-full min-w-0 flex-col lg:h-full lg:min-h-0">
            <div className="shrink-0">
                <SectionHeader
                    title="Recent Big Wins"
                    icon={<Trophy size={22} className="text-[var(--color-nav-accent)]" fill="currentColor" strokeWidth={1.75} />}
                />
                <p className="-mt-1 mb-4 text-xs font-medium leading-snug text-[var(--color-text-muted)] md:text-sm">
                    Latest player jackpot moments
                </p>
            </div>

            <div className={`home-marquee-pausable shrink-0 overflow-hidden ${HOME_LIVE_BIG_WINS_FEED_HEIGHT_CLASS}`}>
                <div className="flex w-full flex-col animate-home-marquee-vertical-y will-change-transform">
                    <WinsTrack items={items} />
                    <div className="flex flex-col" aria-hidden>
                        <WinsTrack items={items.map((i) => ({ ...i, id: `${i.id}__dup` }))} />
                    </div>
                </div>
            </div>
        </div>
    );
}
