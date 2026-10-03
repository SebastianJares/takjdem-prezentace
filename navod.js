'use strict';
const search = document.querySelector('#guide-search');
const sections = [...document.querySelectorAll('.guide section')];
const normalize = value => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
function filter(){const words=normalize(search.value).trim().split(/\s+/).filter(Boolean);let count=0;sections.forEach(section=>{const text=normalize(section.textContent);const match=words.every(word=>text.includes(word));section.hidden=!match;if(match)count++;});document.querySelector('#search-status').textContent=words.length?`Nalezeno sekcí: ${count}. Vymazáním hledání zobrazíte celý návod.`:'';}
search.addEventListener('input',filter);
document.querySelectorAll('aside a[href^="#"]').forEach(link=>link.addEventListener('click',()=>{search.value='';filter();}));
let savedDetails=[];
let savedQuery='';
window.addEventListener('beforeprint',()=>{savedQuery=search.value;search.value='';filter();savedDetails=[...document.querySelectorAll('details')].map(detail=>[detail,detail.open]);savedDetails.forEach(([detail])=>detail.open=true);});
window.addEventListener('afterprint',()=>{search.value=savedQuery;filter();savedDetails.forEach(([detail,open])=>detail.open=open);});
document.querySelector('#print-guide').addEventListener('click',()=>window.print());
