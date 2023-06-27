const clampEls = document.querySelectorAll('.js-clamp')
clampEls.forEach(el => {
  el.addEventListener('click', () => {
    el.classList.toggle('open')
  })
})