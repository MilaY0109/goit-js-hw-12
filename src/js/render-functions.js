import 'izitoast/dist/css/iziToast.min.css';
import SimpleLightbox from 'simplelightbox';

const galleryList = document.querySelector('.gallery');
let lightBox = new SimpleLightbox('.gallery-link', {
  captionsData: 'alt',
  captionDelay: 500,
});

export function galleryTemplate(element) {
  const {
    largeImageURL,
    webformatURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = element;
  return `
   <li class="gallery-item">
      <a class="gallery-link" href="${largeImageURL}">
        <img class="gallery-image" src="${webformatURL}" alt="${tags}" />
      </a>
      <ul class="gallery-body">
        <li class="info-box">
          <h3>Likes:</h3>
          <p>${likes}</p>
        </li>
        <li class="info-box">
          <h3>Views:</h3>
          <p>${views}</p>
        </li>
        <li class="info-box">
          <h3>Comments:</h3>
          <p>${comments}</p>
        </li>
        <li class="info-box">
          <h3>Downloads:</h3>
          <p>${downloads}</p>
        </li>
      </ul>
    </li>`;
}

export function renderGallery(elements) {
  const markup = elements.hits
    .map(element => {
      return galleryTemplate(element);
    })
    .join('\n');

  galleryList.insertAdjacentHTML('beforeend', markup);

  lightBox.refresh();
}
