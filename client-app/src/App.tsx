import React, {useEffect, useState} from 'react';
import logo from './logo.svg';
import './App.css';
import {Store} from './models/store'
import axios from 'axios';
import { List } from 'semantic-ui-react';


function App() {
  const [stores, setStores]=useState<Store[]>([]);
  useEffect(() => {
    axios.get('https://localhost:49153/api/store').then(response => {
      console.log(response);
      setStores(response.data);
    })
  }, [])
  return (
    <div className="App">
      <header className="App-header">
        <List>
        <List.Item>
          {stores.map((store: Store) => (
            <li key={store.Id}>{store.StoreName}</li>
          ))}  
        </List.Item>
        </List>
      </header>
    </div>
  );
}

export default App;
