import { SLOT_GAMES } from './gameCatalogs';
import ezugiThumb from '../assets/live-casino/ezugi.webp';

function slotMeta(name, provider) {
    const match = SLOT_GAMES.find((g) => g.name === name && g.provider === provider);
    return {
        imgUrl: match?.imgUrl ?? '',
        provider: match?.provider ?? provider,
        page: 'slots',
    };
}

/**
 * Mock recent payout feed — order aligned with staging.riocity9.com homepage.
 * @typedef {Object} RecentPayoutItem
 * @property {string} id
 * @property {string} game
 * @property {string} user
 * @property {string} amount
 * @property {string} imgUrl
 * @property {string} [provider]
 * @property {string} [page]
 */

const METAL_SLUG = slotMeta('Archer', 'PlayTech Slots');
const GLADIATORS = slotMeta('Fire Blaze: Blue Wizard', 'PlayTech Slots');
const BONSAI = slotMeta('Sugar Rush', 'Pragmatic Play');

/** @type {RecentPayoutItem[]} */
export const MOCK_RECENT_PAYOUTS = [
    { id: 'payout-1', game: 'Metal Slug: Hyakutaro', user: 's*******t', amount: '$2.70', ...METAL_SLUG },
    { id: 'payout-2', game: 'Metal Slug: Hyakutaro', user: 's*******t', amount: '$0.45', ...METAL_SLUG },
    { id: 'payout-3', game: 'Metal Slug: Hyakutaro', user: 's*******t', amount: '$0.53', ...METAL_SLUG },
    { id: 'payout-4', game: 'Metal Slug: Hyakutaro', user: 's*******t', amount: '$0.90', ...METAL_SLUG },
    { id: 'payout-5', game: 'Gladiators', user: 't*****2', amount: '$5.00', ...GLADIATORS },
    { id: 'payout-6', game: 'Gladiators', user: 't*****2', amount: '$0.50', ...GLADIATORS },
    { id: 'payout-7', game: 'Gladiators', user: 't*****2', amount: '$1.55', ...GLADIATORS },
    {
        id: 'payout-8',
        game: 'Ezugi',
        user: 's*******t',
        amount: '$10.00',
        imgUrl: ezugiThumb,
        provider: 'Ezugi',
        page: 'live-casino',
    },
    { id: 'payout-9', game: 'Bonsai Bonanza', user: 't****w', amount: '$2.00', ...BONSAI },
    { id: 'payout-10', game: 'Bonsai Bonanza', user: 't****w', amount: '$6.00', ...BONSAI },
];
