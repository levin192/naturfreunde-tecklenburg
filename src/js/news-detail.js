import { tns } from 'tiny-slider/src/tiny-slider';
import 'tiny-slider/src/tiny-slider.scss';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const sliderControls = document.querySelector('.news-gallery-slider-controls');

function initLightbox () {
  const lightBox = new SimpleLightbox('.news-gallery-slider .lightbox', {
    captionSelector: 'self',
  });
}

function showControls () {
  if (sliderControls) {
    sliderControls.classList.remove('d-none');
  }
}

function onSliderInit () {
  initLightbox();
  showControls();
}

let options = {
  container: '.news-gallery-slider',
  items: 1,
  autoplay: true,
  controls: true,
  autoplayButtonOutput: false,
  nav: true,
  onInit: onSliderInit,
};
if (sliderControls) {
  options = {
    ...options,
    controlsContainer: sliderControls,

  };
} else {
  options = {
    ...options,
    autoHeight: true,
    mode: 'gallery'
  };
}
const slider = tns(options);
