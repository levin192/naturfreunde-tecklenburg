import 'bootstrap/js/src/collapse'

const sn = document.getElementById('stickyNav')
const navBar = document.querySelector('.navbar')
const root = document.documentElement;

function calcMountainHeight() {
  return Math.floor(document.getElementById('mountainsFooter').children[0].height.baseVal.value)
}

function setMountainPadding() {
  root.style.setProperty('--mountain-spacer', calcMountainHeight() + 'px')
}

function setNavOffset() {
  root.style.setProperty('--nav-offset', navBar.offsetHeight + 'px')
}

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
  //document.getElementById('mountainSpacer').style.paddingBottom = calcMountainHeight() + 'px'
  setTimeout(() => {
    overlay.classList.remove('visible')
    document.body.style.overflowY = 'visible'
  }, 300)
})