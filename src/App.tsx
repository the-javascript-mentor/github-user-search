import { useState } from "react";
import useGitHubUserSearch from "./hooks";

import "./App.css";

const App = () => {
  const [query, setQuery] = useState("");
  const { suggestions, isLoading, hasNoResults } = useGitHubUserSearch(query);

  return (
    <div className="search">
      <input
        placeholder="Search"
        type="search"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
        }}
      />
      {suggestions.length > 0 && !isLoading && (
        <ul>
          {suggestions.map((suggestion) => (
            <li key={suggestion.id}>
              <a
                href={suggestion.link}
                target="_blank"
                rel="noreferrer noopener"
              >
                <img src={suggestion.avatar} alt={suggestion.userName} />
                <span>{suggestion.userName}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      {hasNoResults && <div className="noResultsMessage">No results</div>}
      {isLoading && <div className="loadingMessage">Loading...</div>}
    </div>
  );
};

export default App;
