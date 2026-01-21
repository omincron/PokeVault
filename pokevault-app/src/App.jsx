import { useState, useEffect } from 'react';
import PackOpener from './components/PackOpener';
import Collection from './components/Collection';
import './App.css';

const COLLECTION_KEY = 'pokevault_collection';

function App() {
  const [collection, setCollection] = useState(() => {
    try {
      const saved = localStorage.getItem(COLLECTION_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading collection:', error);
      return [];
    }
  });

  // Save collection to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(COLLECTION_KEY, JSON.stringify(collection));
    } catch (error) {
      console.error('Error saving collection:', error);
    }
  }, [collection]);

  const handlePackOpened = (newCards) => {
    setCollection(prev => [...newCards, ...prev]);
  };

  return (
    <div className="app">
      <PackOpener onPackOpened={handlePackOpened} />
      <Collection collection={collection} />
    </div>
  );
}

export default App;
