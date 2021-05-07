import 'bootstrap/js/src/collapse'

const sn = document.getElementById('stickyNav')
const navBar = document.querySelector('.navbar')
const root = document.documentElement

function calcMountainHeight() {
  return Math.floor(document.getElementById('mountainsFooter').children[0].height.baseVal.value)
}

function setMountainPadding() {
  root.style.setProperty('--mountain-spacer', calcMountainHeight() + 'px')
}

function windowMatch(minWidth) {
  return window.matchMedia('(min-width:' + minWidth + 'px)').matches
}

function getScreenSizeString() {
  let screenSizeString = 'screen-sm'

  if (windowMatch(768)) screenSizeString = 'screen-md';
  if (windowMatch(992)) screenSizeString = 'screen-lg';
  if (windowMatch(1200)) screenSizeString = 'screen-xl';
  if (windowMatch(1400)) screenSizeString = 'screen-xxl';

  return screenSizeString
}

function setResponsiveDataSet() {
  document.body.dataset.screenSize = getScreenSizeString()
}

function setNavOffset() {
  root.style.setProperty('--nav-offset', navBar.offsetHeight + 'px')
}

function addOpenClass() {
  sn.classList.toggle('open')
}

function stickyNavListener(el) {
    el.addEventListener('click', addOpenClass)
}

let lastKnownScrollPosition = 0;
let ticking = false;

function onScrollChange(scrollPos) {
  if (scrollPos > 10) {
    sn.classList.remove('docked')
    sn.classList.remove('open')
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

window.addEventListener('resize', function () {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      setMountainPadding()
      setNavOffset()
      ticking = false;
    });
    ticking = true;
  }
});

window.addEventListener('load', () => {
  const overlay = document.getElementById('loadingOverlay')
  setMountainPadding()
  setNavOffset()
  setResponsiveDataSet()
  stickyNavListener(sn)
  setTimeout(() => {
    overlay.classList.remove('visible')
    document.body.style.overflowY = 'visible'
  }, 300)
})