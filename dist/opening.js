// A reversible scroll timeline. Browser scrolling remains native: no wheel/touch interception.
const opening=document.querySelector('.scroll-opening');
const sticky=opening.querySelector('.opening-sticky');
const cards=[...opening.querySelectorAll('.scene-panel')];
const copy=opening.querySelector('.opening-copy');
const design=opening.querySelector('.opening-design');
const intro=opening.querySelector('.opening-intro');
const resolve=opening.querySelector('.opening-resolve');
const surface=opening.querySelector('.opening-surface');
const bar=opening.querySelector('.opening-timeline i');
const tracker=document.querySelector('.tide-tracker');
const sections=[...document.querySelectorAll('main>section')];
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v));
const mix=(a,b,t)=>a+(b-a)*t;
const smooth=(a,b,v)=>{const t=clamp((v-a)/(b-a));return t*t*(3-2*t)};
let progress=0,target=0,last=0,ambient=0,pointer={x:0,y:0},threeScene=null;
let layout={width:innerWidth,height:innerHeight,start:0,range:1};
function measure(){layout={width:innerWidth,height:sticky.clientHeight,start:opening.getBoundingClientRect().top+scrollY,range:Math.max(1,opening.offsetHeight-sticky.clientHeight)};onScroll();threeScene?.resize();}
function onScroll(){target=clamp((scrollY-layout.start)/layout.range);}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',measure);addEventListener('load',measure);
opening.addEventListener('pointermove',e=>{if(e.pointerType==='mouse'){pointer.x=(e.clientX/innerWidth-.5)*2;pointer.y=(e.clientY/innerHeight-.5)*2;}});
opening.addEventListener('pointerleave',()=>{pointer.x=0;pointer.y=0;});
measure();progress=target;
function paint(p){
 const w=layout.width,h=layout.height,mobile=w<701;
 const light=smooth(.43,.50,p),ring=smooth(.49,.58,p),grid=smooth(.68,.79,p),exit=smooth(.86,.98,p);
 const rgb=[mix(24,238,light),mix(37,234,light),mix(34,226,light)].map(Math.round);
 surface.style.background=`rgb(${rgb.join(',')})`;
 sticky.style.color=light>.5?'#20201c':'#eeeae2';
 copy.style.opacity=1-smooth(.13,.24,p);
 opening.querySelector('.trident-poster').style.opacity=1-smooth(.05,.25,p);
 intro.style.opacity=smooth(.24,.34,p)*(1-smooth(.40,.46,p));
 copy.style.transform=`translate(-50%,-50%) scale(${1-p*.15})`;
 design.style.opacity=ring*(1-smooth(.65,.70,p));
 design.style.transform=`translate(-50%,-50%) scale(${mix(.78,1.06,smooth(.5,.65,p))})`;
 resolve.style.opacity=smooth(.90,.98,p);
 resolve.style.translate=`0 ${(1-exit)*45}px`;
 bar.style.transform=`scaleX(${p})`;
 opening.querySelector('.opening-step').textContent=p<.24?'01 / THE DEPTH':p<.46?'02 / THE PERSPECTIVE':p<.79?'03 / THE IDENTITY':'04 / THE EXPRESSION';
 const drift=document.body.classList.contains('motion-paused')?0:Math.sin(ambient*.0003)*.045;
 cards.forEach((card,i)=>{
  const angle=i/cards.length*Math.PI*2+p*2.8+drift;
  const rx=w*(mobile?.43:.37),ry=h*(mobile?.30:.32);
  const ringX=Math.cos(angle)*rx,ringY=Math.sin(angle)*ry;
  const col=mobile?i%3:i%5,row=mobile?Math.floor(i/3):Math.floor(i/5);
  const gridX=(col-(mobile?1:2))*w*(mobile?.34:.205),gridY=(row-(mobile?1.5:.5))*h*(mobile?.235:.39);
  let x=mix(ringX,gridX,grid),y=mix(ringY,gridY,grid);
  let z=mix(Math.sin(angle)*140,0,grid),rz=mix(Math.sin(angle)*18,0,grid),ryaw=mix(Math.cos(angle)*40,0,grid);
  let scale=mix(.8,mobile?1.05:1.18,grid),opacity=ring;
  if(i===4){x=mix(x,mobile?0:-w*.28,exit);y=mix(y,mobile?-h*.19:0,exit);scale=mix(scale,mobile?1.45:1.95,exit);rz=mix(rz,-6,exit);z=mix(z,0,exit);}
  else{x*=1+exit*1.7;y*=1+exit*1.4;z+=exit*430;opacity*=1-smooth(.86,.94,p);}
  card.style.transform=`translate(-50%,-50%) translate3d(${x}px,${y}px,${z}px) rotateY(${ryaw}deg) rotateZ(${rz}deg) scale(${scale})`;
  card.style.opacity=opacity;card.style.zIndex=z>0?'2':'0';
 });
 const later=scrollY>layout.start+layout.range+layout.height*.45;
 tracker.classList.toggle('is-visible',later);
 if(later){let current=1;sections.forEach((s,i)=>{if(s.getBoundingClientRect().top<innerHeight*.55)current=i+1});tracker.querySelector('b').textContent=String(current).padStart(2,'0');tracker.querySelector('i').style.transform=`scaleY(${.2+.8*scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight)})`;}
 sticky.dataset.progress=p.toFixed(3);
}
function tick(now){
 const dt=Math.min(100,now-last||16);last=now;
 const paused=document.body.classList.contains('motion-paused');
 if(!paused&&!document.hidden)ambient+=dt;
 const direction=target<progress?-1:1;
 const eased=(target-progress)*(1-Math.exp(-dt/(direction<0?620:320)));
 const maximum=dt*.001*(direction<0?.18:.28);
 progress+=paused?target-progress:clamp(eased,-maximum,maximum);
 if(Math.abs(target-progress)<.0001)progress=target;
 if(!reduce){paint(progress);threeScene?.render(progress,ambient,paused);}
 if(!document.hidden)requestAnimationFrame(tick);
}
document.addEventListener('visibilitychange',()=>{if(!document.hidden){last=performance.now();requestAnimationFrame(tick);}});
if(!reduce)requestAnimationFrame(tick);

async function createSculpture(){
 if(reduce)return;
 try{
  const T=await import('./vendor/three.module.min.js');
  const {GLTFLoader}=await import('./vendor/GLTFLoader.js');
  const gltf=await new GLTFLoader().loadAsync('./assets/poseidon-trident.glb');
  const renderer=new T.WebGLRenderer({alpha:true,antialias:true,powerPreference:'low-power'});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.25));renderer.setSize(innerWidth,innerHeight);
  renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.3;
  renderer.domElement.className='trident-canvas';renderer.domElement.setAttribute('aria-hidden','true');document.body.append(renderer.domElement);
  const scene=new T.Scene(),camera=new T.PerspectiveCamera(38,innerWidth/innerHeight,.1,100);camera.position.z=8;
  const environment=new T.Scene();environment.background=new T.Color('#6f7870');
  for(const [x,y,z,sx,sy,color] of [[-4,2,3,3,6,'#fff3de'],[4,0,2,2,7,'#dd8050'],[0,5,-2,6,2,'#ffffff'],[0,-3,4,4,1,'#537e78']]){
   const light=new T.Mesh(new T.PlaneGeometry(sx,sy),new T.MeshBasicMaterial({color,side:T.DoubleSide}));light.position.set(x,y,z);light.lookAt(0,0,0);environment.add(light);
  }
  const pmrem=new T.PMREMGenerator(renderer);scene.environment=pmrem.fromScene(environment,.04).texture;pmrem.dispose();
  scene.add(new T.HemisphereLight('#fff1d7','#173e37',2));
  const key=new T.DirectionalLight('#ffe4be',4);key.position.set(-3,5,4);scene.add(key);
  const rim=new T.DirectionalLight('#e35c2d',3);rim.position.set(4,1,-2);scene.add(rim);
  const sculpture=new T.Group();scene.add(sculpture);
  const model=gltf.scene;
  model.updateMatrixWorld(true);
  let bounds=new T.Box3().setFromObject(model),size=bounds.getSize(new T.Vector3());
  if(size.z>size.y&&size.z>size.x)model.rotation.x=-Math.PI/2;
  else if(size.x>size.y)model.rotation.z=Math.PI/2;
  model.updateMatrixWorld(true);bounds=new T.Box3().setFromObject(model);size=bounds.getSize(new T.Vector3());
  if(size.z>size.x){model.rotation.y+=Math.PI/2;model.updateMatrixWorld(true);bounds=new T.Box3().setFromObject(model);size=bounds.getSize(new T.Vector3());}
  const centre=bounds.getCenter(new T.Vector3()),normalizer=new T.Group();
  model.position.sub(centre);normalizer.add(model);normalizer.scale.setScalar(3.6/size.y);sculpture.add(normalizer);
  model.traverse(object=>{if(object.isMesh){object.geometry.computeBoundingSphere();object.castShadow=false;object.receiveShadow=false;}});
  renderer.domElement.dataset.model='poseidon-trident.glb';
  const closeQuaternion=new T.Quaternion().setFromEuler(new T.Euler(.025,-.10,-.055));
  const fullQuaternion=new T.Quaternion(),focus=new T.Vector3();
  let pointerX=0,pointerY=0;
  threeScene={
   resize(){camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);},
   render(p,time,paused){
    const mobile=innerWidth<701;const docking=smooth(.39,.46,p),zoom=smooth(.025,.22,p),slide=smooth(.24,.36,p),turn=smooth(.22,.36,p);const after=scrollY>layout.start+layout.range+layout.height*.5;
    const opacity=after?(mobile?0:.6):(mobile?1-docking:mix(1,.6,docking));
    renderer.domElement.style.opacity=opacity;
    if(opacity<.01||document.hidden)return;
    pointerX=mix(pointerX,paused?0:pointer.x,.035);pointerY=mix(pointerY,paused?0:pointer.y,.035);
    const viewH=2*Math.tan(T.MathUtils.degToRad(19))*8,viewW=viewH*camera.aspect;
    const fullScale=mobile?.52:1.15;
    const closeScale=mobile?3.1:Math.min(9,viewW*1.04);
    const scale=after?.115:mix(mix(closeScale,fullScale,zoom),.115,docking);
    sculpture.scale.setScalar(scale);
    fullQuaternion.setFromEuler(new T.Euler(.14+Math.sin(time*.00065)*.08+pointerY*.12, -.4+time*.00032+pointerX*.2,(after?-.2:-.28)+Math.sin(time*.0005)*.045));
    sculpture.quaternion.copy(closeQuaternion).slerp(fullQuaternion,turn);
    focus.set(0,1.50,0).multiplyScalar(scale*(1-zoom)).applyQuaternion(sculpture.quaternion);
    const x=after?viewW*.467:mix((mobile?viewW*.07:viewW*.23)*slide,viewW*.467,docking);
    const y=after?0:(mobile?viewH*.18*slide:0);
    sculpture.position.set(x-focus.x,y-focus.y, -focus.z);
    const floatStrength=(after?.015:(mobile?.045:.08)*(1-docking))*turn;
    sculpture.position.x+=Math.sin(time*.0006)*floatStrength;
    sculpture.position.y+=Math.sin(time*.00085)*floatStrength*1.5;
    renderer.domElement.dataset.scale=scale.toFixed(3);
    renderer.domElement.dataset.phase=zoom<1?'closeup':slide<1?'pullback':docking<1?'right':'docked';
    renderer.domElement.dataset.rotation=sculpture.rotation.y.toFixed(3);
    renderer.render(scene,camera);
   }
  };
  renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();renderer.domElement.style.display='none';document.body.classList.remove('webgl-ready');});
  threeScene.render(progress,ambient,reduce);
  document.body.classList.add('webgl-ready');
 }catch(error){document.body.classList.add('webgl-fallback');console.info('3D unavailable; showing the trident poster.');}
}
createSculpture();
