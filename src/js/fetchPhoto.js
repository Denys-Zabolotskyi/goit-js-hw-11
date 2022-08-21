import axios from 'axios';
export { fetchPhoto };

const BASE_URL = 'https://pixabay.com/api/';
const KEY = '29344300-7dc520cb37f9e72405df75692';

async function fetchPhoto(query, page, perPage) {
  const response = await axios.get(
    `${BASE_URL}?key=${KEY}&image_type=photo&orientation=horizontal&safesearch=true&q=${query}&page=${page}&per_page=${perPage}`
  );
  return response;
}
