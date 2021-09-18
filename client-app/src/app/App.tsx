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


function App() {
  const [activeItem, setActiveItem]=useState<string>('home');
  const [userdto, setUser]=useState<UserDto|null>(null);
  const [stores, setStores]=useState<Store[]>([]);
  const [selectedStore, setSelectedStore]=useState<Store|undefined>(undefined);
  const [editMode, setEditMode]=useState(false);
  const [loading, setLoading]=useState(true);
  const [submiting, setSubmiting]=useState(false);
  useEffect(() => {
    api.Stores.list().then(response => {
      console.log(response);
      setStores(response);
      setLoading(false);
    })
  }, [])

  function handleItemClick(item: string){
    if (item == 'login') setEditMode(true);
    if (item == 'logout') handleLogout();
    setActiveItem(item);
  }

  function handleFormOpen(id?: string){
    id ? handleSelectStore(id) : handleCancelSelectStore();
    setEditMode(true);
  }

  function handleFormClose(){
    setEditMode(false);
  }

  function handleSelectStore(id: string){
    setSelectedStore(stores.find(s=>s.Id===id));
  }

  function handleCancelSelectStore(){
    setSelectedStore(undefined);
  }

  function handleEditStore(store: Store){
    setSubmiting(true);
    if (store.Id){
      api.Stores.update(store).then(()=>{
        setStores([...stores.filter(s=>s.Id !== store.Id), store]);
      })
    } else {
      api.Stores.create(store).then(()=>{
        setStores([...stores, store]);
      })
    }
    setSelectedStore(store);
    setEditMode(false);
    setSubmiting(false);   
  }

  function handleDeleteStore(id: string){
    setSubmiting(true);
    api.Stores.delete(id).then(()=>{
      setStores([...stores.filter(s=>s.Id !== id)]);
      setSubmiting(false);
    })
  }

  function handleLogin(user: UserDto){
    setSubmiting(true);
    api.Account.login(user).then(()=>{
      setUser(user);
      console.log(user);
      })
    setEditMode(false);
    setSubmiting(false);
    setActiveItem('home');   
  }

  function handleLogout(){
    api.Account.logout().then(()=>{
      setUser(null);
      console.log('Successfully loged out');
      })
    setActiveItem('home');   
  }

  if (loading) return <Loading content='Loading App ...'/>
  if (activeItem == 'login' && editMode) return <LoginForm userdto={userdto} login={handleLogin} closeForm={handleFormClose} submitting={submiting}/>
  return (
    <div className="App">
      <UserProvider>
        <NavBar activeItem={activeItem} handleItemClick={handleItemClick} openForm={handleFormOpen}/>
        <Container style={{marginTop:'7em'}}>
          <StoreList stores={stores} openForm={handleFormOpen} deleteStore={handleDeleteStore} submitting={submiting}/>
          {editMode &&
          <StoreForm store={selectedStore} closeForm={handleFormClose} editStore={handleEditStore} submitting={submiting}/>}
        </Container>
      </UserProvider>
    </div>
  );
}

export default App;
