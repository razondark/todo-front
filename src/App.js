import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Board } from "./components/BoardComponent";
import { Todo } from "./components/TodoComponent"

function App() {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/board/:action/:elementId" element={<Board />} />
        <Route path="/todo/:action/:elementId" element={<Todo />} />
  </Routes>
    </Router>
    <h1/>
    </>
  );
}

export default App;
