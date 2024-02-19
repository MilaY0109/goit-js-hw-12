import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { renderGallery } from './js/render-functions.js';
import { getGallery } from './js/pixabay-api.js';

const form = document.querySelector('.search-form');
const galleryList = document.querySelector('.gallery');
const loader = document.querySelector('.loader');
const loadMoreBtn = document.querySelector('.load-more');
let currentPage = 1;
let query = '';
let totalPages = 0;
const perPage = 15;

loadMoreBtn.classList.add('hidden');
form.addEventListener('submit', onFormSubmit);
loadMoreBtn.addEventListener('click', onLoadMore);

async function onFormSubmit(event) {
  event.preventDefault();

  galleryList.innerHTML = '';
  query = event.target.elements.query.value.trim();

  if (query === '') {
    showNotification('Please enter a search query!');
    return;
  }

  loader.classList.remove('hidden');
  currentPage = 1;

  try {
    const data = await getGallery(query, currentPage);
    totalPages = Math.ceil(data.totalHits / perPage);
    loadMoreBtn.classList.remove('hidden');
    handleGalleryResponse(data);
  } catch (error) {
    console.error(error);
    showNotification('Failed to fetch images');
  } finally {
    loader.classList.add('hidden');
  }
}

async function onLoadMore() {
  loader.classList.remove('hidden');
  currentPage++;

  try {
    const data = await getGallery(query, currentPage);
    handleGalleryResponse(data);
    smoothScroll();
  } catch (error) {
    console.error(error);
    showNotification('Failed to fetch images');
  } finally {
    loader.classList.add('hidden');
  }
}

function handleGalleryResponse(data) {
  if (data.hits.length === 0) {
    showNotification(
      'Sorry, there are no images matching your search query. Please try again!'
    );
  } else {
    renderGallery(data);
  }

  if (currentPage >= totalPages) {
    loadMoreBtn.classList.add('hidden');
    if (currentPage >= totalPages) {
      showNotification(
        "We're sorry, but you've reached the end of search results."
      );
    }
  } else {
    loadMoreBtn.classList.remove('hidden');
  }
}

function showNotification(message) {
  iziToast.show({
    message: message,
    messageColor: '#fff',
    backgroundColor: '#FF0000',
    position: 'topRight',
  });
}

function smoothScroll() {
  const galleryItemHeight =
    document.querySelector('.gallery-item').offsetHeight;
  window.scrollBy({
    top: galleryItemHeight * 2,
    left: 0,
    behavior: 'smooth',
  });
}
