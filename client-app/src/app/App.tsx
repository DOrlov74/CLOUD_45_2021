import React, {useEffect, useState} from 'react';
import {Store} from '../models/store'
import { Container, List, MenuItem } from 'semantic-ui-react';
import NavBar from './NavBar';
import api from './api';
import Loading from '../components/loading';
import StoreList from '../components/StoreList';
import StoreForm from '../components/StoreForm';
import UserProvider from '../components/UserProvider';
import LoginForm from '../components/LoginForm';
import { UserDto } from '../models/user';
import { Route } from 'react-router';
import HomePage from '../components/HomePage';


function App() {
  const [activeItem, setActiveItem]=useState<string>('home');
  const [userdto, setUser]=useState<UserDto|null>(null);
  const [stores, setStores]=useState<Store[]>([]);
  const [selectedStore, setSelectedStore]=useState<Store|undefined>(undefined);
  const [editMode, setEditMode]=useState(false);
  const [loading, setLoading]=useState(true);

  function handleLogout(){
    api.Account.logout().then(()=>{
      setUser(null);
      console.log('Successfully loged out');
      })
    setActiveItem('home');   
  }

  // if (loading) return <Loading content='Loading App ...'/>
  return (
    <div className="App">
        <NavBar activeItem={activeItem} logout={handleLogout}/>
        <Container style={{marginTop:'7em'}}>
          <Route exact path='/' component={HomePage}/>
          <Route path='/store' component={StoreList}/>
          <Route path={['/newstore', '/editstore/:id']} component={StoreForm}/>
          <Route path='/login' component={LoginForm}/>
        </Container>
    </div>
  );
}

export default App;
