import React, { useState } from 'react';
import './App.css';
import Home from './components/home/Home';
import History from './components/history/History';

function App() {
  const [activePage, setActivePage] = useState('home'); // default Home

  return (
    <div className="w-[100%] overflow-hidden">
      {activePage === 'home' && <Home setActivePage={setActivePage} />}
      {activePage === 'history' && <History setActivePage={setActivePage} />}
    </div>
  );
}

export default App;
