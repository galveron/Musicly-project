import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Views/Home.jsx';
import './index.css';
import Login from './Views/Login.jsx';
import Search from './views/Search.jsx';
import Favorites from './views/Favorites.jsx';
import Profile from './Views/Profile.jsx';
import { Layout } from './Views/Layout.jsx';

export default function Main() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path='/' element={<Layout />}>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/search' element={<Search />} />
          <Route path='/favorites' element={<Favorites />} />
          <Route path='/profile' element={<Profile />} />
        </Route>

      </Routes>
    </BrowserRouter>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Main />);
