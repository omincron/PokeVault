// Legendary Pokémon IDs (Gen 1-6)
const LEGENDARY_IDS = [
  144, 145, 146, 150, 151, // Gen 1
  243, 244, 245, 249, 250, 251, // Gen 2
  377, 378, 379, 380, 381, 382, 383, 384, 385, 386, // Gen 3
  480, 481, 482, 483, 484, 487, 488, 491, 492, 493, 494, // Gen 4
  638, 639, 640, 641, 642, 643, 644, 645, 646, 647, 648, 649, // Gen 5
  716, 717, 718, 719, 720, 721 // Gen 6
];

export const RARITY_TIERS = {
  COMMON: {
    name: 'common',
    chance: 60,
    color: '#9E9E9E',
    glowColor: '#BDBDBD',
    idRange: { min: 1, max: 151 }
  },
  RARE: {
    name: 'rare',
    chance: 25,
    color: '#2196F3',
    glowColor: '#64B5F6',
    idRange: { min: 152, max: 386 }
  },
  EPIC: {
    name: 'epic',
    chance: 10,
    color: '#9C27B0',
    glowColor: '#BA68C8',
    idRange: { min: 387, max: 721 }
  },
  LEGENDARY: {
    name: 'legendary',
    chance: 5,
    color: '#FFD700',
    glowColor: '#FFE44D',
    legendaryIds: LEGENDARY_IDS
  }
};

export function rollRarity() {
  const roll = Math.random() * 100;

  if (roll < 60) return RARITY_TIERS.COMMON;
  if (roll < 85) return RARITY_TIERS.RARE;
  if (roll < 95) return RARITY_TIERS.EPIC;
  return RARITY_TIERS.LEGENDARY;
}

export function rollShiny() {
  return Math.random() < (1 / 512);
}

export function getRandomPokemonId(rarity) {
  if (rarity.name === 'legendary') {
    const randomIndex = Math.floor(Math.random() * rarity.legendaryIds.length);
    return rarity.legendaryIds[randomIndex];
  }

  const { min, max } = rarity.idRange;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
