import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './assets/styles.css';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState(null);
  const [isFavoriteClicked, setIsFavoriteClicked] = useState(false);
  const [isFavoritesEmpty, setIsFavoritesEmpty] = useState(true);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('https://6484c22cee799e3216270591.mockapi.io/produtos');
      setItems(response.data);
      setCurrentItem(response.data[0]);
    } catch (error) {
      console.error('Erro ao buscar os itens:', error);
    }
  };

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  };

  const handleDelete = async id => {
    try {
      await axios.delete(`https://6484c22cee799e3216270591.mockapi.io/produtos/${id}`);
      const updatedItems = items.filter(item => item.id !== id);
      setItems(updatedItems);

      if (currentItem && currentItem.id === id) {
        showNextItem();
      }
    } catch (error) {
      console.error('Erro ao excluir o item:', error);
    }
  };

  const handleFavorite = async id => {
    try {
      const updatedItems = items.map(item => {
        if (item.id === id) {
          return { ...item, favorite: !item.favorite };
        }
        return item;
      });

      showNextItem();
      setItems(updatedItems);

      if (!isFavoritesEmpty) {
        setIsFavoriteClicked(true);
      }
      await axios.put(`https://6484c22cee799e3216270591.mockapi.io/produtos/${id}`, {
        favorite: !items.find(item => item.id === id).favorite
      });
    } catch (error) {
      console.error('Erro ao atualizar o item:', error);
    }
  };

  const showNextItem = () => {
    const currentIndex = items.findIndex(item => item === currentItem);
    const nextIndex = (currentIndex + 1) % items.length;
    setCurrentItem(items[nextIndex]);
  };

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const favoriteItems = filteredItems.filter(item => item.favorite);

  const handleClearFavorites = () => {
    setItems(items.map(item => ({ ...item, favorite: false })));
    setIsFavoritesEmpty(true);
  };

  const handleFavoriteClick = id => {
    handleFavorite(id);
  };


  return (
    <div className="app">
      <div className="container">
        <h1 className="header">Vai dar Namoro!!!</h1>
        <input
          type="text"
          placeholder="Filtrar as Pessoas que você curtiu"
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
        <div className="favorite-list">
          <h2>Pessoas que você Curtiu</h2>
          <ul>
            {favoriteItems.map(item => (
              <li key={item.id}>{item.name}</li>
            ))}
            <button onClick={handleClearFavorites}>Limpar Curtidas</button>
          </ul>
        </div>
        {currentItem && (
          <div className="current-item">
            <h2>Pretendentes:</h2>
            <div className="item-details">
              <p>{currentItem.name}-{currentItem.idade} anos</p>
              <img src={currentItem.avatar} alt="Imagem do produto" className="rounded-image" />
              <p>{currentItem.descricao}</p>
            </div>
            <button
              onClick={() => handleFavoriteClick(currentItem.id)}
              className={`favorite-button ${currentItem.favorite ? 'favorite' : 'favorite-clicked'} ${isFavoriteClicked ? 'favorite-clicked' : ''}`}
            >
              {currentItem.favorite ? 'Hoje não Faro' : 'Hoje sim Faro '}
            </button>
            <button onClick={showNextItem}>Próximo</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
