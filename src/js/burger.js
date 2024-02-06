const btn = document.querySelector('[data-burger]')
const menu = document.querySelector('[data-menu]')

btn.addEventListener('click', ()=>{
   btn.classList.toggle('burger--active');
   menu.classList.toggle('--active')
})