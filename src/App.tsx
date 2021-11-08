import { useEffect, useState } from "react";
import useDebounce from "./useDebounce";
import { getUsers } from "./api";

import "./App.css";

interface GitHubUser {
  avatar_url: string;
  id: number;
  login: string;
  html_url: string;
}

interface Suggestion {
  avatar: string;
  id: number;
  userName: string;
  link: string;
}

const App = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[] | []>([]);
  const [numberOfPendingRequests, setNumberOfPendingRequests] = useState(0);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery !== "") {
      setNumberOfPendingRequests((previousValue) => previousValue + 1);
      getUsers(debouncedQuery).then((data) => {
        setNumberOfPendingRequests((previousValue) => previousValue - 1);
        // TODO: Fix race condition issue
        setSuggestions(
          data.items.map((item: GitHubUser) => ({
            avatar: item.avatar_url,
            id: item.id,
            userName: item.login,
            link: item.html_url,
          }))
        );
      });
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

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
      {suggestions.length > 0 && numberOfPendingRequests === 0 && (
        <ul>
          {suggestions.map((suggestion) => (
            <li key={suggestion.id}>
              <a href={suggestion.link}>
                <img src={suggestion.avatar} alt={suggestion.userName} />
                <span>{suggestion.userName}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
      {debouncedQuery !== "" &&
        suggestions.length === 0 &&
        numberOfPendingRequests === 0 && (
          <div className="noResultsMessage">No results</div>
        )}
      {numberOfPendingRequests > 0 && (
        <div className="loadingMessage">Loading...</div>
      )}
    </div>
  );
};

export default App;
