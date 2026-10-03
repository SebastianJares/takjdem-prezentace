'use strict';
const slides = [...document.querySelectorAll('.slide')];
const previous = document.querySelector('#prev');
const next = document.querySelector('#next');
let current = 0;
function show(index) {
  current = Math.max(0, Math.min(slides.length - 1, index));
  slides.forEach((slide, i) => { const active = i === current; slide.classList.toggle('active', active); slide.setAttribute('aria-hidden', String(!active)); slide.inert = !active; });
  document.querySelector('#counter').textContent = `${String(current + 1).padStart(2, '0')} / ${slides.length}`;
  document.querySelector('#slide-title').textContent = slides[current].dataset.title;
  document.querySelector('#progress').style.width = `${(current + 1) / slides.length * 100}%`;
  previous.disabled = current === 0;
  next.disabled = current === slides.length - 1;
  document.querySelectorAll('header nav button').forEach(button => button.classList.toggle('selected', Number(button.dataset.goto) === 2 ? current >= 2 && current < 6 : current >= 6));
  document.querySelector('#deck').scrollTop = 0;
  history.replaceState(null, '', `#${current + 1}`);
}
previous.addEventListener('click', () => show(current - 1));
next.addEventListener('click', () => show(current + 1));
document.querySelectorAll('[data-goto]').forEach(button => button.addEventListener('click', () => show(Number(button.dataset.goto))));
document.addEventListener('keydown', event => {
  if (event.altKey || event.ctrlKey || event.metaKey || /INPUT|TEXTAREA|SELECT/.test(event.target.tagName)) return;
  if (['ArrowRight', 'PageDown', 'ArrowLeft', 'PageUp', 'Home', 'End'].includes(event.key)) event.preventDefault();
  if (['ArrowRight', 'PageDown'].includes(event.key)) show(current + 1);
  if (['ArrowLeft', 'PageUp'].includes(event.key)) show(current - 1);
  if (event.key === 'Home') show(0);
  if (event.key === 'End') show(slides.length - 1);
});
let startX = 0;
let startY = 0;
const deck = document.querySelector('#deck');
deck.addEventListener('touchstart', event => { startX = event.changedTouches[0].clientX; startY = event.changedTouches[0].clientY; }, {passive:true});
deck.addEventListener('touchend', event => { const dx = event.changedTouches[0].clientX - startX; const dy = event.changedTouches[0].clientY - startY; if (Math.abs(dx) > 70 && Math.abs(dx) > Math.abs(dy) * 1.5) show(current + (dx < 0 ? 1 : -1)); }, {passive:true});
document.querySelector('#fullscreen').addEventListener('click', async () => { try { if (document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen(); } catch { document.querySelector('#fullscreen').textContent = 'Použijte F11'; } });
function restoreAccessibility(){ slides.forEach((slide, i) => {slide.inert = i !== current; slide.setAttribute('aria-hidden', String(i !== current));}); }
window.addEventListener('beforeprint', () => slides.forEach(slide => {slide.inert = false; slide.removeAttribute('aria-hidden');}));
window.addEventListener('afterprint', restoreAccessibility);
document.querySelector('#print').addEventListener('click', () => window.print());
window.addEventListener('hashchange', () => show(Number(location.hash.slice(1)) - 1 || 0));
show(Number(location.hash.slice(1)) - 1 || 0);
