import {Collapse} from 'bootstrap';


const sn = document.getElementById('stickyNav')
const navBar = document.querySelector('.navbar')
const root = document.documentElement
const docBody = document.body
const collapsingNav = document.getElementById('navbarSupportedContent')

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
  docBody.dataset.screenSize = getScreenSizeString()
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

function collapseNav() {
  collapsingNav.addEventListener('shown.bs.collapse', () => {
    docBody.classList.add('nav-visible')
  })
  collapsingNav.addEventListener('hidden.bs.collapse', () => {
    docBody.classList.remove('nav-visible')
  })

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
  if (scrollPos > 400) {
    if (docBody.classList.contains('nav-visible')){
      docBody.classList.remove('nav-visible')
      new Collapse(collapsingNav, {
        hide: true
      })
    }
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
  collapseNav()
  setTimeout(() => {
    overlay.classList.remove('visible')
    docBody.style.overflowY = 'visible'
  }, 300)
})