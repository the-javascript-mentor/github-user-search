import { useState } from "react";
import useDebounce from "./useDebounce";

import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);

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
