import React from "react";
import List from "../List/List";
import "./App.scss";
import Header from "../Header/Header";
function App() {
  return (
    <div className="App">
      <div className="container">
        <Header />
        <List />
      </div>
    </div>
  );
}

export default App;
