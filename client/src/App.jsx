import React from 'react';
import {BrowserRouter,Routes,Route} from 'react-router-dom';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import Protectedroute from './components/protectedroute';
import Repositories from './pages/repositories';
import Profile from './pages/profile';
import ReactDOM from 'react-dom';
function App() {

  return (
    <>
      <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login/>}></Route>
        <Route path="/register" element={<Register/>}></Route>
        <Route path="/" element={<Protectedroute><Home/></Protectedroute>}></Route>
        <Route path="/repositories" element={<Protectedroute><Repositories/></Protectedroute>}></Route>
        <Route path="/profile" element={<Protectedroute><Profile/></Protectedroute>}></Route>
      </Routes>
      </BrowserRouter>
    </>
  )
}
export default App
