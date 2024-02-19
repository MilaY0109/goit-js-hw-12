import axios from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function getGallery(queryName, page = 1, perPage = 15) {
  const response = await axios.get('', {
    params: {
      key: '42386647-98f841b623ea7dc572c802671',
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
