import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import { getPhoto } from './api';
import 'simplelightbox/dist/simple-lightbox.min.css';
const form = document.querySelector('.search-form');
const btnLoadMore = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

form.addEventListener('submit', submitForm);
btnLoadMore.addEventListener('click', onLoadMore);

let page = 1;
let searchQuery = '';
let totalPages = 0;

const lightbox = new SimpleLightbox('.gallery a');

function submitForm(e) {
  e.preventDefault();
  page = 1;
  gallery.innerHTML = '';
  btnLoadMore.classList.add('hidden');
  searchQuery = e.currentTarget.elements.searchQuery.value;

  getPhoto(searchQuery, page)
    .then(data => {
      if (data.hits.length !== 0) {
        createMarkup(data);
        btnLoadMore.classList.remove('hidden');
        totalPages = Math.ceil(data.totalHits / 40);
        console.log(totalPages);
      } else {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    })
    .catch(error => Notiflix.Notify.failure(error.message));
}
function createMarkup(data) {
  const markup = data.hits
    .map(
      ({
        webformatURL,
        largeImageURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      }) => `
       
  <a class="photo-card" href="${largeImageURL}"> 
  <img src="${webformatURL}" alt="${tags}" width="300px" height="200px" loading="lazy" />

  <div class="info">
    <p class="info-item">
      <b >Likes</b>${likes}
    </p>
    <p class="info-item">
      <b >Views</b>${views}
    </p>
    <p class="info-item">
      <b >Comments</b>${comments}
    </p>
    <p class="info-item">
      <b >Downloads</b>${downloads}
    </p>
  </div>
</a>
  `
    )
    .join('');
  gallery.insertAdjacentHTML('beforeend', markup);
  lightbox.refresh();
}

function onLoadMore() {
  page += 1;
  getPhoto(searchQuery, page)
    .then(data => {
      createMarkup(data);
      if (page >= totalPages) {
        btnLoadMore.classList.add('hidden');
        Notiflix.Notify.info(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => Notiflix.Notify.failure(error.message));
}
