const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
const projects=[
{name:'Aurel',category:'IDENTITY / ART DIRECTION',image:'assets/aurel.webp',description:'A concept for a fragrance house built around quiet confidence. Warm stone, soft ivory and precise typography give the identity room to breathe. This is an illustrative direction, not a commissioned client project.',tags:['Brand concept','Art direction','Packaging direction']},
{name:'Forme',category:'STRATEGY / VISUAL IDENTITY',image:'assets/forme.webp',description:'A concept for a design-led culture brand. Sculptural chrome and confident orange create an identity that moves between physical objects and digital experiences. This is an illustrative direction, not a commissioned client project.',tags:['Visual identity','Campaign concept','Creative direction']},
{name:'Vanta',category:'FASHION / BRAND IDENTITY',image:'assets/hero.webp',description:'An expressive fashion concept built on contrast. Deep shadows, amber light and a future-facing portrait create a distinctive campaign language. This is an illustrative direction, not a commissioned client project.',tags:['Fashion direction','Brand identity','Campaign imagery']}
];
const quotes=[
{text:'They took a feeling we couldn’t quite put into words and turned it into a brand that felt like us.',name:'Alex Lee',initials:'AL',role:'Founder, Aurel · Sample content',logo:'a.',color:'#cf471d'},
{text:'Every detail felt intentional. The identity gave us a clear direction and the confidence to take our next step.',name:'Jordan Ray',initials:'JR',role:'Creative lead, Forme · Sample content',logo:'f.',color:'#9c422c'},
{text:'From the first conversation to the final reveal, it felt like building something with a true creative partner.',name:'Sam Avery',initials:'SA',role:'Founder, Vanta · Sample content',logo:'v.',color:'#8f492c'}
];
let activeWork=0,voice=0,voiceTimer;
const stage=$('.work-stage'), reel=$('.work-reel'), frames=$$('.project-frame');
function renderScroll(){
 const max=document.documentElement.scrollHeight-innerHeight;
 $('.progress').style.transform=`scaleX(${max>0?scrollY/max:0})`;
 if(!reduced){
 const rect=stage.getBoundingClientRect();const range=stage.offsetHeight-innerHeight;
 const progress=Math.max(0,Math.min(1,-rect.top/Math.max(1,range)));
 const step=frames[0].offsetHeight+parseFloat(getComputedStyle(reel).gap);
 reel.style.transform=`translateY(${-frames[0].offsetHeight/2-progress*step*2}px)`;
 const next=Math.round(progress*2);
 if(next!==activeWork){activeWork=next;$('.work-backdrop').textContent=projects[next].name.toUpperCase();$('#work-number').textContent=String(next+1).padStart(2,'0');$('#work-category').textContent=projects[next].category;$('.work-open').dataset.project=next;}
 frames.forEach((f,i)=>{const distance=Math.abs(progress*2-i);f.style.filter=`brightness(${Math.max(.4,1-distance*.35)})`;f.style.scale=String(Math.max(.86,1-distance*.09));});
 }
}
let pending=false;addEventListener('scroll',()=>{if(!pending){requestAnimationFrame(()=>{renderScroll();pending=false});pending=true;}},{passive:true});addEventListener('resize',renderScroll);addEventListener('load',renderScroll);renderScroll();
const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.15});$$('.reveal').forEach(el=>observer.observe(el));
$('.menu-toggle').addEventListener('click',()=>{const open=$('.header nav').classList.toggle('open');$('.menu-toggle').setAttribute('aria-expanded',open);$('.menu-toggle span').textContent=open?'−':'+';});$$('.header nav a').forEach(a=>a.addEventListener('click',()=>{$('.header nav').classList.remove('open');$('.menu-toggle').setAttribute('aria-expanded','false');$('.menu-toggle span').textContent='+';}));
function openDialog(dialog){dialog.showModal();document.body.style.overflow='hidden';}
function closeDialog(dialog){dialog.close();document.body.style.overflow='';}
$$('dialog').forEach(d=>{d.querySelector('.dialog-close').addEventListener('click',()=>closeDialog(d));d.addEventListener('click',e=>{if(e.target===d){const r=d.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)closeDialog(d);}});d.addEventListener('close',()=>document.body.style.overflow='');});
$$('[data-brief]').forEach(b=>b.addEventListener('click',()=>openDialog($('#brief-dialog'))));
$$('[data-project]').forEach(b=>b.addEventListener('click',()=>{const p=projects[Number(b.dataset.project)];$('#project-title').textContent=p.name;$('#project-image').src=p.image;$('#project-image').alt=p.name+' original concept campaign';$('#project-description').textContent=p.description;$('#project-tags').replaceChildren(...p.tags.map(t=>{const s=document.createElement('span');s.textContent=t;return s}));openDialog($('#project-dialog'));}));
$('#project-enquire').addEventListener('click',()=>{closeDialog($('#project-dialog'));openDialog($('#brief-dialog'));});
let motionPaused=reduced, voiceBusy=false, lastVoice=0;
const rotor=$('.voice-rotor');
function showVoice(index){
 if(voiceBusy)return;
 voiceBusy=true;voice=(index+quotes.length)%quotes.length;
 const update=()=>{const q=quotes[voice];$('#quote-text').textContent=q.text;$('#quote-name').textContent=q.name;$('#quote-initials').textContent=q.initials;$('#quote-role').textContent=q.role;$('#quote-logo').textContent=q.logo;$('.voices').style.background=q.color;$('#voice-count').textContent=String(voice+1).padStart(2,'0')+' / 03';$$('[data-voice]').forEach((b,i)=>{b.classList.toggle('active',i===voice);b.setAttribute('aria-pressed',i===voice)});$('.side-left img').src=['assets/portrait.jpg','assets/poseidon.webp','assets/hero.webp'][voice];$('.side-left img').alt=['Editorial portrait — illustrative imagery','Poseidon sculpture — concept imagery','Fashion portrait — concept imagery'][voice];$('.side-right img').src=['assets/architecture.jpg','assets/forme.webp','assets/ocean.jpg'][voice];$('.side-right img').alt='Illustrative brand mood imagery';};
 lastVoice=performance.now();
 if(reduced||motionPaused){update();voiceBusy=false;return;}
 rotor.classList.add('turn-out');
 setTimeout(()=>{update();rotor.classList.remove('turn-out');rotor.classList.add('turn-in');void rotor.offsetWidth;requestAnimationFrame(()=>requestAnimationFrame(()=>rotor.classList.remove('turn-in')));setTimeout(()=>voiceBusy=false,650);},460);
}
$('#prev-voice').addEventListener('click',()=>showVoice(voice-1));$('#next-voice').addEventListener('click',()=>showVoice(voice+1));$$('[data-voice]').forEach(b=>b.addEventListener('click',()=>showVoice(Number(b.dataset.voice))));
document.body.classList.toggle('motion-paused', reduced);
matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change',()=>location.reload());
let sceneTime=0, previousTime=0;const orbitCards=$$('.float-card');
function animateScenes(now){
 const delta=Math.min(50,now-previousTime);previousTime=now;
 const scene=$('.growth-scene'),bounds=scene.getBoundingClientRect();
 if(!motionPaused&&!document.hidden){
 sceneTime+=delta;
 if((bounds.bottom>0&&bounds.top<innerHeight)||!scene.dataset.positioned){scene.dataset.positioned="true";
 const rx=scene.clientWidth*.39,ry=scene.clientHeight*.31;
 orbitCards.forEach((card,i)=>{const theta=sceneTime*.00019+i*Math.PI*2/orbitCards.length;const x=Math.cos(theta)*rx,y=Math.sin(theta)*ry+x*.22,depth=Math.sin(theta);card.style.transform=`translate(-50%,-50%) translate3d(${x}px,${y}px,${depth*100}px) rotateY(${Math.cos(theta)*47}deg) rotateZ(${-15+Math.sin(theta)*12}deg) scale(${.77+(depth+1)*.13})`;card.style.zIndex=depth>0?'3':'0';card.style.opacity=String(.65+(depth+1)*.175);});
 }
 const v=$('.voices').getBoundingClientRect();
 if(v.top<innerHeight*.65&&v.bottom>innerHeight*.35&&!$('.voices').matches(':hover, :focus-within')){if(now-lastVoice>6500)showVoice(voice+1);}else{lastVoice=now;}
 }
 requestAnimationFrame(animateScenes);
}
requestAnimationFrame(animateScenes);
$('#brief-form').addEventListener('submit',e=>{e.preventDefault();const fd=new FormData(e.currentTarget);const content=`POSEIDON — PROJECT BRIEF\n\nName: ${fd.get('name')}\nEmail: ${fd.get('email')}\nInterested in: ${fd.get('service')}\n\nProject\n${fd.get('project')}\n\nSaved locally from the Poseidon concept. This brief has not been sent.\n`;const url=URL.createObjectURL(new Blob([content],{type:'text/plain;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='poseidon-project-brief.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1500);$('#form-status').textContent='Your brief is ready in your downloads. No message has been sent.';});

