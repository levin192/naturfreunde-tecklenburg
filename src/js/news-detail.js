import {tns} from 'tiny-slider/src/tiny-slider';
import 'tiny-slider/dist/tiny-slider.css'

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css'

function initLightbox() {
  const lightBox = new SimpleLightbox('.news-gallery-slider .lightbox', {
    captionSelector: 'self'
  });
}

function showControls() {
  document.querySelector('.news-gallery-slider-controls').classList.remove('d-none')
}

function onSliderInit() {
  initLightbox()
  showControls()
}
function checkForSlides() {

}
const slider = tns({
  container: '.news-gallery-slider',
  items: 1,
  autoplay: true,
  controls: true,
  controlsContainer: '.news-gallery-slider-controls',
  onInit: onSliderInit(),
  autoplayButtonOutput: false,
  nav: true
})
