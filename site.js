'use strict';
const toggle=document.querySelector('.menu-toggle');
const mobileNav=document.querySelector('#mobile-nav');
function closeMenu(){if(!toggle||!mobileNav)return;toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Ouvrir le menu');mobileNav.hidden=true;}
if(toggle&&mobileNav){toggle.addEventListener('click',()=>{const opened=toggle.getAttribute('aria-expanded')==='true';toggle.setAttribute('aria-expanded',String(!opened));toggle.setAttribute('aria-label',opened?'Ouvrir le menu':'Fermer le menu');mobileNav.hidden=opened;});mobileNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!mobileNav.hidden){closeMenu();toggle.focus();}});window.matchMedia('(min-width:761px)').addEventListener('change',e=>{if(e.matches)closeMenu();});}
const form=document.querySelector('#inquiry-form');
if(form){form.querySelector('[type=submit]').disabled=false;const select=form.elements.equipment,query=new URLSearchParams(location.search).get('equipement');if([...select.options].some(o=>o.value===query))select.value=query;
form.addEventListener('submit',event=>{event.preventDefault();if(!form.reportValidity())return;const fields=new FormData(form);const selected=select.options[select.selectedIndex].textContent;document.querySelector('#request-summary').value=`Demande de renseignements — Drassel Équipement\n\nNom : ${fields.get('name')}\nTéléphone : ${fields.get('phone')||'Non précisé'}\nCourriel : ${fields.get('email')}\nÉquipement : ${selected}\n\nMes travaux :\n${fields.get('message')}\n\nDemande préparée localement, non envoyée.`;const result=document.querySelector('#request-result');result.hidden=false;document.querySelector('#copy-status').textContent='Aucun message n’a été envoyé.';result.focus({preventScroll:true});result.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center'});});
document.querySelector('#copy-request').addEventListener('click',async()=>{const summary=document.querySelector('#request-summary'),status=document.querySelector('#copy-status');try{await navigator.clipboard.writeText(summary.value);status.textContent='Résumé copié. Aucun message n’a été envoyé.';}catch{summary.focus();summary.select();status.textContent='Sélectionnez « Copier » dans votre navigateur pour copier le résumé.';}});
form.addEventListener('input',()=>{document.querySelector('#request-result').hidden=true;});}
const photoDialog=document.querySelector('.photo-dialog');
if(photoDialog){const open=document.querySelector('.photo-open');open.addEventListener('click',()=>photoDialog.showModal());photoDialog.querySelector('.dialog-close').addEventListener('click',()=>photoDialog.close());photoDialog.addEventListener('click',e=>{if(e.target===photoDialog){const r=photoDialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)photoDialog.close();}});}
// Subtle cinematic framing, with natural scrolling. No invented machine articulation.
const hero=document.querySelector('.hero'),motion=matchMedia('(prefers-reduced-motion: reduce)'),desktop=matchMedia('(min-width:761px)');let queued=false;
function updateHero(){queued=false;if(!hero)return;if(motion.matches||!desktop.matches){hero.style.removeProperty('--hero-scale');return;}const progress=Math.max(0,Math.min(1,scrollY/hero.offsetHeight));hero.style.setProperty('--hero-scale',String(1.025+progress*.035));}
if(hero){addEventListener('scroll',()=>{if(!queued){queued=true;requestAnimationFrame(updateHero);}},{passive:true});motion.addEventListener('change',updateHero);desktop.addEventListener('change',updateHero);updateHero();}
// Passe premium : en-tête condensé, révélations, rail, carte à la demande.
window.__drassel=true;
const siteHeader=document.querySelector('.site-header'),mobileCta=document.querySelector('.mobile-cta');let chromeQueued=false;
function updateChrome(){chromeQueued=false;if(siteHeader)siteHeader.classList.toggle('is-stuck',scrollY>30);if(mobileCta)mobileCta.classList.toggle('show',scrollY>480);}
addEventListener('scroll',()=>{if(!chromeQueued){chromeQueued=true;requestAnimationFrame(updateChrome);}},{passive:true});updateChrome();
const revealed=document.querySelectorAll('[data-reveal]');
if('IntersectionObserver' in window){const io=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('in');io.unobserve(entry.target);}}),{rootMargin:'0px 0px -6% 0px',threshold:.06});revealed.forEach(el=>io.observe(el));}else{revealed.forEach(el=>el.classList.add('in'));}
document.querySelectorAll('[data-rail]').forEach(section=>{const rail=section.querySelector('.rail'),prev=section.querySelector('.prev'),next=section.querySelector('.next'),bar=section.querySelector('.rail-progress i');
const step=()=>{const card=rail.querySelector('.rail-card');return card?card.getBoundingClientRect().width+18:300;};
const sync=()=>{const max=rail.scrollWidth-rail.clientWidth,visible=rail.clientWidth/rail.scrollWidth;prev.disabled=rail.scrollLeft<4;next.disabled=rail.scrollLeft>max-4;if(bar){bar.style.width=(Math.min(1,visible)*100)+'%';bar.style.transform=`translateX(${max>0?(rail.scrollLeft/max)*(1/visible-1)*100:0}%)`;}};
const move=dir=>rail.scrollBy({left:dir*step(),behavior:motion.matches?'auto':'smooth'});
prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));rail.addEventListener('scroll',sync,{passive:true});addEventListener('resize',sync);sync();});
const mapButton=document.querySelector('#load-map');
if(mapButton){mapButton.addEventListener('click',()=>{const view=document.querySelector('.map-view'),frame=document.createElement('iframe');frame.title='Carte Google Maps : Drassel Équipement, 1025, 187e Rue, Saint-Georges';frame.referrerPolicy='no-referrer';frame.src='https://www.google.com/maps?q=1025+187e+Rue,+Saint-Georges,+QC&output=embed';frame.tabIndex=0;view.replaceChildren(frame);mapButton.hidden=true;frame.focus();});}
// v3 : scène vivante du premier écran, inclinaison des cartes, compteurs, parallaxe.
(()=>{const fine=matchMedia('(hover:hover) and (pointer:fine)');
if(hero){
 // Le contenu s'efface et la photo réagit au pointeur.
 let hq=false;const hp=()=>{hq=false;hero.style.setProperty('--hp',motion.matches?'0':String(Math.max(0,Math.min(1,scrollY/hero.offsetHeight))));};
 addEventListener('scroll',()=>{if(!hq){hq=true;requestAnimationFrame(hp);}},{passive:true});hp();
 hero.addEventListener('pointermove',e=>{if(!fine.matches||motion.matches)return;const r=hero.getBoundingClientRect();hero.style.setProperty('--px',((.5-(e.clientX-r.left)/r.width)*18).toFixed(1)+'px');hero.style.setProperty('--py',((.5-(e.clientY-r.top)/r.height)*10).toFixed(1)+'px');});
 hero.addEventListener('pointerleave',()=>{hero.style.setProperty('--px','0px');hero.style.setProperty('--py','0px');});
 // Poussière dans la lumière.
 const canvas=hero.querySelector('.hero-dust');
 if(canvas&&!motion.matches){const ctx=canvas.getContext('2d');let w=0,h=0,dpr=1,parts=[],raf=0,visible=true,last=0;
  const size=()=>{dpr=Math.min(devicePixelRatio||1,1.5);w=hero.clientWidth;h=hero.clientHeight;canvas.width=w*dpr;canvas.height=h*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);const n=w<761?26:64;parts=Array.from({length:n},()=>({x:w*(.28+Math.random()*.72),y:Math.random()*h,r:.5+Math.random()*1.7,vx:-(.04+Math.random()*.14),vy:-(.02+Math.random()*.1),p:Math.random()*6.28,s:.4+Math.random()*1.1,a:.15+Math.random()*.5}));};
  const draw=t=>{raf=0;if(!visible)return;const dt=Math.min(40,t-last||16);last=t;ctx.clearRect(0,0,w,h);for(const q of parts){q.p+=dt*.001*q.s;q.x+=q.vx*dt*.06+Math.sin(q.p)*.12;q.y+=q.vy*dt*.06+Math.cos(q.p*.7)*.08;if(q.x<w*.2||q.y<-10){q.x=w*(.5+Math.random()*.5);q.y=h*(.3+Math.random()*.7);}const glow=(.55+.45*Math.sin(q.p*1.7))*q.a*Math.min(1,(q.x/w-.2)*3);ctx.beginPath();ctx.fillStyle=`rgba(255,221,165,${glow.toFixed(3)})`;ctx.arc(q.x,q.y,q.r,0,6.283);ctx.fill();}raf=requestAnimationFrame(draw);};
  size();addEventListener('resize',size);new IntersectionObserver(es=>{visible=es[0].isIntersecting;if(visible&&!raf)raf=requestAnimationFrame(draw);}).observe(hero);document.addEventListener('visibilitychange',()=>{visible=!document.hidden;if(visible&&!raf)raf=requestAnimationFrame(draw);});}
}
// Inclinaison des cartes d'univers.
document.querySelectorAll('.usage-card').forEach(card=>{card.addEventListener('pointermove',e=>{if(!fine.matches||motion.matches)return;const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;card.classList.add('tilt');card.style.setProperty('--ry',((x-.5)*7).toFixed(2)+'deg');card.style.setProperty('--rx',((.5-y)*6).toFixed(2)+'deg');card.style.setProperty('--gx',(x*100).toFixed(1)+'%');card.style.setProperty('--gy',(y*100).toFixed(1)+'%');});card.addEventListener('pointerleave',()=>card.classList.remove('tilt'));});
// Compteurs.
const counters=document.querySelectorAll('[data-count]');
if(counters.length&&'IntersectionObserver' in window&&!motion.matches){const co=new IntersectionObserver(es=>es.forEach(en=>{if(!en.isIntersecting)return;co.unobserve(en.target);const el=en.target,to=+el.dataset.count,from=+(el.dataset.from||0),t0=performance.now(),dur=1400;const tick=t=>{const k=Math.min(1,(t-t0)/dur),e=1-Math.pow(1-k,3);el.textContent=String(Math.round(from+(to-from)*e));if(k<1)requestAnimationFrame(tick);};requestAnimationFrame(tick);}),{threshold:.6});counters.forEach(el=>co.observe(el));}
// Parallaxe de la photo diagonale.
const aboutPhoto=document.querySelector('.about-photo');
if(aboutPhoto&&!motion.matches){let pq=false;const par=()=>{pq=false;const r=aboutPhoto.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight)return;aboutPhoto.style.setProperty('--par',(((r.top+r.height/2)-innerHeight/2)*-.06).toFixed(1));};addEventListener('scroll',()=>{if(!pq){pq=true;requestAnimationFrame(par);}},{passive:true});par();}
// Rail : glisser à la souris.
document.querySelectorAll('.rail').forEach(rail=>{let down=false,sx=0,sl=0,moved=false;rail.addEventListener('pointerdown',e=>{if(e.pointerType!=='mouse'||e.button!==0)return;down=true;moved=false;sx=e.clientX;sl=rail.scrollLeft;});addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-sx;if(Math.abs(dx)>6&&!moved){moved=true;rail.classList.add('dragging');}if(moved)rail.scrollLeft=sl-dx;});addEventListener('pointerup',()=>{if(!down)return;down=false;if(moved)setTimeout(()=>rail.classList.remove('dragging'),0);});rail.addEventListener('click',e=>{if(moved){e.preventDefault();moved=false;}},true);rail.addEventListener('dragstart',e=>e.preventDefault());});
})();
