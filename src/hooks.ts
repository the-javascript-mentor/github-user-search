import { useEffect, useState, useRef } from "react";
import { getUsers } from "./api";

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

const useDebounce: any = (value: any, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const useGitHubUserSearch = (query: string) => {
  const [suggestions, setSuggestions] = useState<Suggestion[] | []>([]);
  const [numberOfPendingRequests, setNumberOfPendingRequests] = useState(0);
  const lastRequestWasFiredAt = useRef<number | null>(null);
  const debouncedQuery = useDebounce(query, 500);

  useEffect(() => {
    if (debouncedQuery !== "") {
      setNumberOfPendingRequests((previousValue) => previousValue + 1);

      const searchFiredAt = Date.now();
      lastRequestWasFiredAt.current = searchFiredAt;

      getUsers(debouncedQuery).then((data) => {
        setNumberOfPendingRequests((previousValue) => previousValue - 1);
        if (lastRequestWasFiredAt.current === searchFiredAt) {
          setSuggestions(
            data.items.map((item: GitHubUser) => ({
              avatar: item.avatar_url,
              id: item.id,
              userName: item.login,
              link: item.html_url,
            }))
          );
        }
      });
    } else {
      setSuggestions([]);
    }
  }, [debouncedQuery]);

  const hasNoResults =
    debouncedQuery !== "" &&
    suggestions.length === 0 &&
    numberOfPendingRequests === 0;

  const isLoading = numberOfPendingRequests > 0;

  return {
    suggestions,
    isLoading,
    hasNoResults,
  };
};

export default useGitHubUserSearch;
