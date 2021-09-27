import React, {useState} from 'react';
import { Container } from 'semantic-ui-react';
import NavBar from './NavBar';
import api from './api';
import Loading from '../components/loading';
import StoreList from '../components/StoreList';
import StoreForm from '../components/StoreForm';
import LoginForm from '../components/LoginForm';
import { Route } from 'react-router';
import HomePage from '../components/HomePage';
import RegisterForm from '../components/RegisterForm';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import { UserContext } from '../components/UserProvider';
import UserForm from '../components/UserForm';
import { useHistory } from 'react-router-dom';


function App() {
  const userCtx=React.useContext(UserContext);
  const history = useHistory();
  const [loading, setLoading]=useState(true);

  function handleLogout(){
//    api.Account.logout().then(()=>{
      userCtx.setUser(null);
      console.log('Successfully loged out');
//     })
//    setActiveItem('home');
      history.push('/');
  }

  // if (loading) return <Loading content='Loading App ...'/>
  return (
    <div className="App">
        <NavBar logout={handleLogout}/>
        <Container style={{marginTop:'7em'}}>
          <Route exact path='/' component={HomePage}/>
          <Route path='/store' component={StoreList}/>
          <Route path={['/newstore', '/editstore/:id']} component={StoreForm}/>
          <Route path='/product' component={ProductList}/>
          <Route path={['/newproduct', '/editproduct/:id']} component={ProductForm}/>
          <Route path={['/newuser', '/edituser/:id']} component={UserForm}/>
          <Route path='/login' component={LoginForm}/>
          <Route path='/register' component={RegisterForm}/>
        </Container>
    </div>
  );
}

export default App;
