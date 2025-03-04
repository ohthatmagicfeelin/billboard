// client/src/components/Home.jsx
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import config from '@/config/env';

const Home = () => {
  console.log("Home Route");
  
  const [inputText, setInputText] = useState('');
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get(`${config.BACKEND_URL}/api/items`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${config.BACKEND_URL}/api/items`, { text: inputText });
      setInputText('');
      fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Home | Billboard</title>
      </Helmet>
      <h1>Home</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter text"
        />
        <button type="submit">Add Item</button>
      </form>
      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.text}</li>
        ))}
      </ul>
    </>
  );
};

export default Home;