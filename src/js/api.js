import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '38715052-64f33d15b6d1089a39ac295f6';

export const getPhoto = async (query, page) => {
  try {
    const { data } = await axios(
      `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=40`
    );
    return data;
  } catch (error) {
    console.log(error.message);
  }
};
