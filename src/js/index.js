import AOS from 'aos';
import bootstrap from 'bootstrap'


import 'aos/src/sass/aos.scss';
import 'animate.css/animate.css'
import '../styles/style.scss';


AOS.init();


const sn = document.getElementById('stickyNav')
const navBar = document.querySelector('.navbar')

document.body.style.marginTop = navBar.offsetHeight + 'px'

let lastKnownScrollPosition = 0;
let ticking = false;

function onScrollChange(scrollPos) {
  if (scrollPos > 10) {
    sn.classList.remove('docked')
  } else {
    sn.classList.add('docked')
  }

}

document.addEventListener('scroll', function () {
  lastKnownScrollPosition = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(() => {
      onScrollChange(lastKnownScrollPosition);
      ticking = false;
    });
    ticking = true;
  }
});