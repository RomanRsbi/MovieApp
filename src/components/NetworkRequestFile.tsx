const _apiBase = 'https://api.themoviedb.org/3/search/movie?query=';
const tailApi = '&include_adult=false&language=en-US&page=';
async function getResource(url: string, page: number) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization:
        'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4ZTQzNDA1ZWZhM2YwNjE0NmQ1N2IzNjA4MjZlMDMzYSIsIm5iZiI6MTczMzMzMzEwMC41NjgsInN1YiI6IjY3NTA5MDZjNWY3NDRiZjE3NDFlMTQ2ZCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ._jYk44OEKibhNRvrhvLEyUR5mh9GFivXQm072e1LeTg'
    }
  };
  const response = await fetch(`${_apiBase}${url}${tailApi}${page}`, options);
  if (!response.ok) {
    throw new Error(`Could not fetch ${url}` + `, received ${response.status}`);
  }
  return await response.json();
}

export default getResource;
