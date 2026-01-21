import { rollRarity, rollShiny, getRandomPokemonId } from './rarity';

const RARITY_ORDER = {
  'common': 1,
  'rare': 2,
  'epic': 3,
  'legendary': 4
};

export function generatePack() {
  const pack = [];
  
  for (let i = 0; i < 5; i++) {
    const rarity = rollRarity();
    const pokemonId = getRandomPokemonId(rarity);
    const isShiny = rollShiny();
    
    pack.push({
      id: `${pokemonId}-${Date.now()}-${i}`, // Unique ID for React keys
      pokemonId,
      rarity: rarity.name,
      isShiny,
      rarityData: rarity
    });
  }
  
  // Sort pack: commons first, rarest last (for dramatic reveal)
  pack.sort((a, b) => {
    const rarityDiff = RARITY_ORDER[a.rarity] - RARITY_ORDER[b.rarity];
    if (rarityDiff !== 0) return rarityDiff;
    // If same rarity, shiny goes last
    if (a.isShiny !== b.isShiny) return a.isShiny ? 1 : -1;
    return 0;
  });
  
  return pack;
}
