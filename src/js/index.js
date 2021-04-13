
import AOS from 'aos';
import 'aos/src/sass/aos.scss';
import 'animate.css/animate.css'


import '../styles/style.scss';

AOS.init();


const sn = document.getElementById('stickyNav')


let lastKnownScrollPosition = 0;
let ticking = false;

function onScrollChange(scrollPos) {
  if (scrollPos > 10) {
    sn.classList.remove('docked')
  } else {
    sn.classList.add('docked')
  }

}

document.addEventListener('scroll', function (e) {
  lastKnownScrollPosition = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(function () {
      onScrollChange(lastKnownScrollPosition);
      ticking = false;
    });

    ticking = true;
  }
});