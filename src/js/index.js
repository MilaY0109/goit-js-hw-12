import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import axios from 'axios';

const form = document.querySelector('.search-form');
const list = document.querySelector('.pictures-list');
const loader = document.querySelector('.loader');
const loadBtn = document.querySelector('.button-load');

const lightbox = new SimpleLightbox('.gallery-card a.gallary-card-link', {
  captionsData: 'alt',
  captionDelay: 250,
});

let search = null;
let totalResult = 0;

form.addEventListener('submit', e => {
  e.preventDefault();
  let searchImg = e.target.elements.input.value;
  search = searchImg;
  page = 1;

  if (search.trim('') === '') {
    return;
  }

  loader.style.display = 'flex';

  if (lightbox) {
    lightbox.close();
    list.innerHTML = '';
  }

  setTimeout(() => {
    getImg()
      .then(data => {
        totalResult = data.totalHits;
        render(data.hits);
        lightbox.refresh();
        if (data.hits.length === 0) {
          iziToast.error({
            message:
              'Sorry, there are no images matching your search query. Please try again!',
            position: 'topRight',
            backgroundColor: 'red',
            messageColor: 'white',
          });
          loadBtn.disabled = true;
          loadBtn.style.display = 'none';
          loadBtn.style.opacity = 0;
          loadBtn.style.overflow = 'hidden';
        } else {
          loadBtn.disabled = false;
          loadBtn.style.display = 'flex';
          loadBtn.style.opacity = 1;
          loadBtn.style.overflow = 'visible';
        }
      })
      .catch(error => {
        console.error('Помилка отримання зображень:', error);
      })
      .finally(() => {
        loader.style.display = 'none';
      });
  }, 500);
  btnChange();
  e.target.reset();
});

let page = 1;
let perPage = 15;

loadBtn.addEventListener('click', async () => {
  page += 1;
  const data = await getImg();
  render(data.hits);
  lightbox.refresh();
  btnChange();

  const galleryCards = document.querySelectorAll('.gallery-card');
  galleryCards.forEach(card => {
    const cardSize = card.getBoundingClientRect();
    window.scrollBy({
      top: cardSize.height * 1.36,
      behavior: 'smooth',
    });
  });
});

async function getImg() {
  const API_KEY = '42386647-98f841b623ea7dc572c802671';

  const params = new URLSearchParams({
    key: API_KEY,
    per_page: perPage,
    page: page,
    q: search,
    image_type: 'photo',
    orientation: 'horizontal',
    safesearch: true,
  });

  const response = await axios.get(`https://pixabay.com/api/?${params}`);
  return response.data;
}

function btnChange() {
  const maxPage = Math.ceil(totalResult / perPage);
  if (page === maxPage) {
    iziToast.warning({
      message: "We're sorry, but you've reached the end of search results.",
      position: 'topRight',
      backgroundColor: '#add8e6',
      messageColor: 'white',
    });
    loadBtn.disabled = true;
    loadBtn.style.display = 'none';
    loadBtn.style.opacity = 0;
    loadBtn.style.overflow = 'hidden';
  }
}

function render(imgs) {
  const markup = imgs
    .map(img => {
      return `<li class="gallery-card">
    <a class="gallary-card-link" href="${img.largeImageURL}">
        <img src="${img.webformatURL}" alt="${img.tags}" />
    <ul class="image-info">
            <li class="image-item-info">
            <p>Likes</p>
            <p>${img.likes}</p>
        </li>
        <li class="image-item-info">
            <p>Views</p>
            <p>${img.views}</p>
        </li>
        <li class="image-item-info">
            <p>Comments</p>
            <p>${img.comments}</p>
        </li>
        <li class="image-item-info">
            <p>Downloads</p>
            <p>${img.downloads}</p>
        </li>
    </ul>
    </a>
</li>`;
    })
    .join('');

  list.insertAdjacentHTML('beforeend', markup);
}
