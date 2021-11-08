const getUsers = (query: string) =>
  fetch(`https://api.github.com/search/users?q=${query}`).then((response) =>
    response.json()
  );

export { getUsers };
