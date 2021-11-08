import { useState } from "react";

import "./App.css";

function App() {
  const [query, setQuery] = useState("");

  return (
    <div>
      <input
        placeholder="Search"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
      />
    </div>
  );
}

export default App;
