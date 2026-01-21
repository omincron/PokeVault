import { useState } from 'react';
import { generatePack } from '../utils/packGenerator';
import { usePokemonCache } from '../hooks/usePokemonCache';
import Card from './Card';
import './PackOpener.css';

export default function PackOpener({ onPackOpened }) {
  const [currentPack, setCurrentPack] = useState(null);
  const [pokemonDataList, setPokemonDataList] = useState([]);
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const [isOpening, setIsOpening] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { fetchMultiple } = usePokemonCache();

  const openPack = async () => {
    setIsOpening(true);
    setIsLoading(true);
    const pack = generatePack();
    setCurrentPack(pack);
    setRevealedIndex(-1);
    
    // Fetch all Pokémon data in background
    const pokemonIds = pack.map(card => card.pokemonId);
    const data = await fetchMultiple(pokemonIds);
    setPokemonDataList(data);
    
    setIsLoading(false);
    setIsOpening(false);
  };

  const revealNextCard = () => {
    if (revealedIndex < 4) {
      setRevealedIndex(revealedIndex + 1);
    }
  };

  const addToCollection = () => {
    if (currentPack && pokemonDataList.length === 5) {
      // Create collection entries
      const collectionEntries = currentPack.map((card, index) => ({
        ...card,
        pokemonData: pokemonDataList[index],
        addedAt: Date.now()
      }));
      
      onPackOpened(collectionEntries);
      setCurrentPack(null);
      setPokemonDataList([]);
      setRevealedIndex(-1);
    }
  };

  const allRevealed = revealedIndex === 4;
  const canReveal = currentPack && !isLoading && revealedIndex < 4;

  return (
    <div className="pack-opener">
      <div className="pack-header">
        <h1>PokéVault</h1>
        <p className="tagline">Open packs. Collect Pokémon. Chase shinies.</p>
      </div>

      {!currentPack ? (
        <div className="pack-button-container">
          <button 
            className="open-pack-button"
            onClick={openPack}
            disabled={isOpening}
          >
            {isOpening ? 'Opening...' : 'Open Pack'}
          </button>
          <p className="pack-info">Each pack contains 5 random Pokémon!</p>
        </div>
      ) : (
        <div className="pack-reveal">
          {isLoading ? (
            <div className="pack-loading">
              <div className="loading-spinner"></div>
              <p>Preparing your cards...</p>
            </div>
          ) : (
            <>
              <div className="reveal-progress">
                <div className="progress-text">
                  Card {revealedIndex + 1} of 5
                </div>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${((revealedIndex + 1) / 5) * 100}%` }}
                  ></div>
                </div>
              </div>

              <div className="cards-reveal-container">
                {currentPack.map((card, index) => (
                  index <= revealedIndex && (
                    <div 
                      key={card.id}
                      className={`card-reveal-wrapper ${index === revealedIndex ? 'active' : 'revealed'}`}
                      onClick={index === revealedIndex && !allRevealed ? revealNextCard : null}
                      style={{ '--card-index': index }}
                    >
                      <Card
                        cardData={card}
                        pokemonData={pokemonDataList[index]}
                      />
                    </div>
                  )
                ))}
                
                {!allRevealed && revealedIndex >= 0 && (
                  <div className="next-card-teaser" onClick={revealNextCard}>
                    <div className="card-back">
                      <div className="card-back-design">🎴</div>
                      <p>Click to reveal</p>
                    </div>
                  </div>
                )}
              </div>

              {revealedIndex === -1 && (
                <div className="start-reveal-container">
                  <button 
                    className="start-reveal-button"
                    onClick={revealNextCard}
                  >
                    Reveal First Card
                  </button>
                </div>
              )}
              
              {allRevealed && (
                <div className="pack-actions">
                  <button 
                    className="add-to-collection-button"
                    onClick={addToCollection}
                  >
                    Add to Collection
                  </button>
                  <button 
                    className="open-another-button"
                    onClick={() => {
                      addToCollection();
                      setTimeout(openPack, 100);
                    }}
                  >
                    Open Another Pack
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
