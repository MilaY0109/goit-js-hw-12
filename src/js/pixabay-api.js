import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function getGallery(queryName, page = 1, perPage = 15) {
  const response = await axios.get('', {
    params: {
      key: '42112521-3ff4dfc201bab0977369cd2bc',
      q: queryName,
      image_type: 'photo',
      orientation: 'horizontal',
      safesearch: 'true',
      page,
      per_page: perPage,
    },
  });
  return response.data;
}
