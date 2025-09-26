(function(){
const script = document.currentScript;
const API = script.getAttribute('data-api') || 'http://localhost:8787';
const SITE = script.getAttribute('data-site-id');
const INPUT_SEL = script.getAttribute('data-input') || '#search';
const input = document.querySelector(INPUT_SEL);
if(!input){ console.warn('intent-search: input not found'); return; }


const dropdown = document.createElement('div');
dropdown.style.position = 'absolute';
dropdown.style.background = '#fff';
dropdown.style.border = '1px solid #e5e7eb';
dropdown.style.borderRadius = '8px';
dropdown.style.padding = '8px';
dropdown.style.width = input.offsetWidth + 'px';
dropdown.style.zIndex = 9999;
dropdown.style.display = 'none';
input.parentElement.style.position = 'relative';
input.parentElement.appendChild(dropdown);


let debounce; function d(fn){ clearTimeout(debounce); debounce=setTimeout(fn, 200); }


input.addEventListener('input', () => {
d(async ()=>{
const q = input.value.trim();
if(!q){ dropdown.style.display='none'; dropdown.innerHTML=''; return; }
const r = await fetch(`${API}/suggest?site_id=${encodeURIComponent(SITE)}&q=${encodeURIComponent(q)}`).then(r=>r.json());
dropdown.innerHTML = r.suggestions.map(s=>`<div style="padding:6px;cursor:pointer">${s.title}</div>`).join('');
dropdown.style.display = 'block';
Array.from(dropdown.children).forEach((el,i)=>{
el.addEventListener('click', ()=>{ input.value = r.suggestions[i].title; dropdown.style.display='none'; input.form?.requestSubmit(); });
});
});
});


(input.form||document).addEventListener('submit', async (e)=>{
e.preventDefault();
const q = input.value.trim(); if(!q) return;
const res = await fetch(`${API}/search`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ site_id: SITE, q }) }).then(r=>r.json());
console.log('Search results', res);
// You can render a full-page results view here; for MVP just log.
});
})();