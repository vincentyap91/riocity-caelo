import { MATCHED_SLOT_PROVIDERS } from './matchedSlotProviders';

const CDN = 'https://cdn.i8global.com/lb9/master';

/** Logos aligned with SlotsPage provider strip (CDN) for consistent branding. */
const SLOTS_STRIP_LOGOS_BY_PROVIDER = {
    'Pragmatic Play': `${CDN}/pragmaticplay/pp-202505140448040730-202506200354029751.svg`,
    'PlayTech Slots': `${CDN}/playtechslots/playtech-202505140443475046-202507230000384478-202508140011404228.svg`,
    AdvantPlay: `${CDN}/advantplay1/advantplay-min-202507170638442926-202509040235032332-202509180625238829.png`,
    JiLi: `${CDN}/jili/jili-min-202506200742098986-202508110205447696-202508212322163049.png`,
    'Mega888 H5': `${CDN}/mega888h5/mega888@2x-min-202510091328133268-202601132337530680.png`,
    Pussy888: 'https://pksoftcdn.azureedge.net/media/pussy888-202511050844023196.png',
    Joker: `${CDN}/joker/joker-1-202505140443313183-202506242335528120.svg`,
    Habanero: `${CDN}/habanero/habanero-202505140509135729-202506250005244757.svg`,
};

/**
 * Homepage “Hot Providers” row — hot-flagged matched providers with strip logos when available.
 * @returns {{ id: string, name: string, src: string, gameProvider: string }[]}
 */
export function getHomeHotProviders() {
    return MATCHED_SLOT_PROVIDERS.filter((provider) => provider.hot).map((provider) => ({
        id: provider.id,
        name: provider.label,
        gameProvider: provider.gameProvider,
        src: SLOTS_STRIP_LOGOS_BY_PROVIDER[provider.gameProvider] ?? provider.image,
    }));
}
