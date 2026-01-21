import { useState } from 'react';
import Card from './Card';
import './Collection.css';

export default function Collection({ collection }) {
  const [filterRarity, setFilterRarity] = useState('all');
  const [filterShiny, setFilterShiny] = useState(false);
  const [sortBy, setSortBy] = useState('recent');

  // Calculate stats
  const stats = {
    total: collection.length,
    shiny: collection.filter(c => c.isShiny).length,
    common: collection.filter(c => c.rarity === 'common').length,
    rare: collection.filter(c => c.rarity === 'rare').length,
    epic: collection.filter(c => c.rarity === 'epic').length,
    legendary: collection.filter(c => c.rarity === 'legendary').length
  };

  // Filter and sort
  let displayedCollection = [...collection];

  if (filterRarity !== 'all') {
    displayedCollection = displayedCollection.filter(c => c.rarity === filterRarity);
  }

  if (filterShiny) {
    displayedCollection = displayedCollection.filter(c => c.isShiny);
  }

  if (sortBy === 'recent') {
    displayedCollection.sort((a, b) => b.addedAt - a.addedAt);
  } else if (sortBy === 'id') {
    displayedCollection.sort((a, b) => a.pokemonData.id - b.pokemonData.id);
  } else if (sortBy === 'name') {
    displayedCollection.sort((a, b) => 
      a.pokemonData.name.localeCompare(b.pokemonData.name)
    );
  }

  return (
    <div className="collection">
      <div className="collection-header">
        <h2>Your Collection</h2>
        <div className="collection-stats">
          <div className="stat">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat">
            <span className="stat-value shiny-text">{stats.shiny}</span>
            <span className="stat-label">Shinies</span>
          </div>
          <div className="stat">
            <span className="stat-value legendary-text">{stats.legendary}</span>
            <span className="stat-label">Legendary</span>
          </div>
        </div>
      </div>

      <div className="collection-filters">
        <div className="filter-group">
          <label>Rarity:</label>
          <select value={filterRarity} onChange={(e) => setFilterRarity(e.target.value)}>
            <option value="all">All</option>
            <option value="common">Common</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
          </select>
        </div>

        <div className="filter-group">
          <label>
            <input 
              type="checkbox" 
              checked={filterShiny}
              onChange={(e) => setFilterShiny(e.target.checked)}
            />
            Shiny Only
          </label>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="id">Pokédex #</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      {displayedCollection.length === 0 ? (
        <div className="empty-collection">
          <p>No Pokémon found with these filters.</p>
          {collection.length === 0 && (
            <p>Open your first pack to start collecting!</p>
          )}
        </div>
      ) : (
        <div className="collection-grid">
          {displayedCollection.map((card) => (
            <Card
              key={card.id}
              cardData={card}
              pokemonData={card.pokemonData}
            />
          ))}
        </div>
      )}
    </div>
  );
}
