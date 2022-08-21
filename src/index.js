import './css/styles.css';
import { fetchPhoto } from './js/fetchPhoto';
import { renderGallery } from './js/render-gallery';

import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  btnLoadMore: document.querySelector('.btn-load-more'),
};
const { searchForm, gallery, btnLoadMore } = refs;

let query = '';
let page = 1;
let simpleLightBox;
const perPage = 40;

searchForm.addEventListener('submit', onSubmitSearch);
btnLoadMore.addEventListener('click', onBtnLoadMore);

function onSubmitSearch(evt) {
  evt.preventDefault();

  query = evt.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';

  if (query === '') {
    Notiflix.Notify.failure('Please specify your search query.');
    return;
  }
  fetchPhoto(query /** */, page, perPage)
    .then(({ data }) => {
      //   console.log(data);
      if (data.totalHits === 0) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      } else {
        renderGallery(data.hits);
        simpleLightBox = new SimpleLightbox('.gallery a').refresh();
        Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);

        if (data.totalHits > perPage) {
          // console.log(data.totalHits);
          btnLoadMore.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error))
    .finally(() => {
      searchForm.reset();
    });
}

function onBtnLoadMore() {
  page += 1;
  simpleLightBox.destroy();
  fetchPhoto(query, page, perPage)
    .then(({ data }) => {
      renderGallery(data.hits);
      simpleLightBox = new SimpleLightbox('.gallery a').refresh();
      const totalPages = data.totalHits / perPage;
      // console.log(page);
      // console.log(perPage);
      if (page > totalPages) {
        btnLoadMore.classList.add('is-hidden');
        Notiflix.Notify.failure(
          "We're sorry, but you've reached the end of search results."
        );
      }
    })
    .catch(error => console.log(error));
}
