import { SLOT_GAMES, FISHING_GAMES, EXTRA_GAME_DETAIL_ENTRIES } from './gameCatalogs';
import { ALL_LOBBY_GAMES } from './lobbyRegistry';
import { wCasinoImage, dreamGamingImage, ezugiMenuTile } from './liveCasinoMenuTileAssets';
import gameplayLightmodeLogo from '../assets/gameplay-lightmode.png';

function findEntry(entries, name, provider) {
    return entries.find((entry) => entry.name === name && entry.provider === provider) ?? null;
}

function withPage(entry, page, overrides = {}) {
    return {
        ...(entry ?? {}),
        ...overrides,
        page,
    };
}

export const TOP_GAMES = [
    withPage(findEntry(SLOT_GAMES, 'Gates of Olympus Super Scatter', 'Pragmatic Play'), 'slots'),
    withPage(findEntry(ALL_LOBBY_GAMES, 'W Casino', 'Live Casino'), 'live-casino', { imgUrl: wCasinoImage }),
    withPage(findEntry(ALL_LOBBY_GAMES, 'DreamGaming', 'Live Casino'), 'live-casino', { imgUrl: dreamGamingImage }),
    withPage(findEntry(ALL_LOBBY_GAMES, 'Ezugi', 'Live Casino'), 'live-casino', { imgUrl: ezugiMenuTile }),
    withPage(findEntry(EXTRA_GAME_DETAIL_ENTRIES, "Dragon's Luck", 'Pragmatic Play'), 'slots'),
    withPage(findEntry(EXTRA_GAME_DETAIL_ENTRIES, 'Nomikai Fever', 'Pragmatic Play'), 'slots'),
    withPage(findEntry(ALL_LOBBY_GAMES, 'SABA Sports', 'Sportsbook'), 'sports'),
    withPage(findEntry(ALL_LOBBY_GAMES, 'SBO Sports', 'Sportsbook'), 'sports'),
    withPage(findEntry(ALL_LOBBY_GAMES, 'Lucky Sports', 'Sportsbook'), 'sports'),
    withPage(findEntry(FISHING_GAMES, 'Ocean King', 'JiLi Fishing'), 'fishing'),
    withPage(findEntry(FISHING_GAMES, 'Mermaid Treasure', 'Funky Games Fishing'), 'fishing'),
    withPage(findEntry(ALL_LOBBY_GAMES, 'TF Gaming', 'E-Sports'), 'e-sports'),
    withPage(findEntry(ALL_LOBBY_GAMES, 'Playtech Poker', 'Poker'), 'poker'),
    withPage(
        {
            name: 'GamePlay Lottery',
            provider: 'Lottery',
            imgUrl: gameplayLightmodeLogo,
            imageFit: 'contain',
        },
        'lottery',
    ),
    withPage(
        {
            name: '93Connect',
            provider: 'Lottery',
            imgUrl: 'https://pksoftcdn.azureedge.net/games/93Connect/LOBBY.png',
            /** Wide lobby art — same as LotteryPage; overrides All Games `contain` for lottery tiles. */
            imageFit: 'cover',
        },
        'lottery',
    ),
].filter((entry) => entry?.name && entry?.provider && entry?.imgUrl);

export const TOP_GAMES_DEFAULT_VISIBLE = 6;

/** Shared homepage game card grid (Top Games, Category Games). */
export const TOP_GAMES_GRID_CLASS = 'grid grid-cols-2 gap-4 pt-2 sm:grid-cols-3 lg:grid-cols-6';

export const TOP_GAME_PAGE_LABELS = {
    slots: 'Slots',
    fishing: 'Fishing',
    'live-casino': 'Live Casino',
    poker: 'Poker',
    sports: 'Sports',
    'e-sports': 'E-Sports',
    lottery: 'Lottery',
};

export function getTopGameFavouriteCategory(page) {
    return TOP_GAME_PAGE_LABELS[page] ? page : 'home-top';
}

function stableRtp(name, provider) {
    const key = `${name}|${provider}`;
    let hash = 0;
    for (let i = 0; i < key.length; i += 1) {
        hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
    }
    return Math.round((76 + (hash % 2100) / 100) * 100) / 100;
}

const RTP_LOOKUP_POOLS = [SLOT_GAMES, FISHING_GAMES, EXTRA_GAME_DETAIL_ENTRIES];

/** Badge text on category game cards, e.g. "Pragmatic Play Slot". */
export function getCategoryGameBadgeLabel(game) {
    const typeLabel = TOP_GAME_PAGE_LABELS[game?.page];
    if (!typeLabel) {
        return game?.provider ?? '';
    }
    const shortType = typeLabel === 'Slots' ? 'Slot' : typeLabel;
    return `${game.provider} ${shortType}`;
}

/** Attach catalog RTP when missing (lobby/sports tiles get a stable placeholder). */
export function enrichGameRtp(game) {
    if (!game) return game;
    if (typeof game.rtp === 'number') {
        return game;
    }

    for (const pool of RTP_LOOKUP_POOLS) {
        const match = pool.find((entry) => entry.name === game.name && entry.provider === game.provider);
        if (match && typeof match.rtp === 'number') {
            return { ...game, rtp: match.rtp, hot: game.hot ?? match.hot, new: game.new ?? match.new };
        }
    }

    return { ...game, rtp: stableRtp(game.name, game.provider) };
}
