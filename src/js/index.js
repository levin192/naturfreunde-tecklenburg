import AOS from 'aos';
import bootstrap from 'bootstrap'


import 'aos/src/sass/aos.scss';
import 'animate.css/animate.css'
import '../styles/style.scss';


AOS.init();


const sn = document.getElementById('stickyNav')
const navBar = document.querySelector('.navbar')



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

window.addEventListener('load',  () => {
  const overlay = document.getElementById('loadingOverlay')
  document.body.style.marginTop = navBar.offsetHeight + 'px'
  setTimeout(()=>{
    overlay.classList.remove('visible')
    document.body.style.overflowY = 'visible'
  }, 300)

})