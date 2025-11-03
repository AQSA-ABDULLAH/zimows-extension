import React, { useState, useEffect } from "react";
import { Provider } from "react-redux";
import { AnimatePresence } from "framer-motion";

import "./App.css";
import store from "./store";

// Components
import Home from "./components/home/Home";
import History from "./components/history/History";
import VisitorUser from "./components/startup/VisitorUser";

function App() {
  const [activePage, setActivePage] = useState("home");
  const [loading, setLoading] = useState(true);

  // 🚫 Disable right-click globally
  useEffect(() => {
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  return (
    <Provider store={store}>
      <AnimatePresence mode="wait">
        {/* Handle Visitor & Loading */}
        <VisitorUser loading={loading} setLoading={setLoading} />

        {/* Country Check & Page Content */}
        <div className="w-full overflow-hidden">
          {activePage === "home" && <Home setActivePage={setActivePage} />}
          {activePage === "history" && <History setActivePage={setActivePage} />}
        </div>
      </AnimatePresence>
    </Provider>
  );
}

export default App;


