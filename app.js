import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

const projects = [
  ['Sprocket Central — Customer & Sales Intelligence','CUSTOMER INTELLIGENCE','01'],
  ['Credit Card Transaction Analysis','FINANCIAL ANALYTICS','02'],
  ['COVID-19 Data Analysis','GLOBAL HEALTH ANALYTICS','03'],
  ['Company Attrition Analytics','PEOPLE ANALYTICS','04'],
  ['Data-Driven Sales Analysis','COMMERCIAL ANALYTICS','05'],
  ['Google Play Store Apps Analysis','PRODUCT ANALYTICS','06'],
  ['Sales Data Analysis','SALES INTELLIGENCE','07']
];

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const clamp = (v,a=0,b=1) => Math.max(a,Math.min(b,v));
const ease = t => t*t*(3-2*t);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34,innerWidth/innerHeight,.1,100);
camera.position.set(0,0,10.8);
const renderer = new THREE.WebGLRenderer({canvas:$('#webgl'),antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.22;
scene.background = new THREE.Color(0x02050a);

scene.add(new THREE.AmbientLight(0x526476,0.72));
const key = new THREE.DirectionalLight(0xbcecff,3.2); key.position.set(4,5,7); scene.add(key);
const fill = new THREE.PointLight(0x61efff,18,9); fill.position.set(2.5,1.8,3.5); scene.add(fill);
const rim = new THREE.PointLight(0x8d6cff,14,8); rim.position.set(-2.7,-1.8,2.4); scene.add(rim);

const root = new THREE.Group(); scene.add(root);
const core = new THREE.Group(); root.add(core);

// Polished dimensional core: smooth outer volume + faceted inner structure + energy nucleus.
const outer = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.42,4),
  new THREE.MeshPhysicalMaterial({color:0x0d2630,emissive:0x063b47,emissiveIntensity:0.7,metalness:0.62,roughness:0.16,clearcoat:1,clearcoatRoughness:0.08,transparent:true,opacity:0.72})
);
core.add(outer);

const outerWire = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.45,2),
  new THREE.MeshBasicMaterial({color:0x71efff,wireframe:true,transparent:true,opacity:0.12,blending:THREE.AdditiveBlending,depthWrite:false})
);
core.add(outerWire);

const inner = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.88,2),
  new THREE.MeshPhysicalMaterial({color:0x19244b,emissive:0x29115d,emissiveIntensity:1.05,metalness:0.48,roughness:0.11,clearcoat:1,clearcoatRoughness:0.06,transparent:true,opacity:0.84})
);
core.add(inner);

const innerWire = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.93,2),
  new THREE.MeshBasicMaterial({color:0xa789ff,wireframe:true,transparent:true,opacity:0.28,blending:THREE.AdditiveBlending,depthWrite:false})
);
core.add(innerWire);

const nucleus = new THREE.Mesh(
  new THREE.SphereGeometry(0.16,48,48),
  new THREE.MeshStandardMaterial({color:0xffffff,emissive:0x9dfaff,emissiveIntensity:8,roughness:0.04,metalness:0.05})
);
core.add(nucleus);
const nucleusGlow = new THREE.Mesh(
  new THREE.SphereGeometry(0.34,32,32),
  new THREE.MeshBasicMaterial({color:0x6df5ff,transparent:true,opacity:0.055,blending:THREE.AdditiveBlending,depthWrite:false})
);
core.add(nucleusGlow);

const rings=[];
for(let i=0;i<3;i++){
  const ring = new THREE.Mesh(new THREE.TorusGeometry(1.68+i*0.22,0.009,8,220),new THREE.MeshBasicMaterial({color:i===1?0xa789ff:0x61eaff,transparent:true,opacity:0.18,blending:THREE.AdditiveBlending,depthWrite:false}));
  ring.rotation.set(0.5+i*0.44,0.3+i*0.37,0.15+i*0.52);
  core.add(ring); rings.push(ring);
}

const closeParticles=[];
for(let i=0;i<30;i++){
  const p=new THREE.Mesh(new THREE.SphereGeometry(0.011+(i%3)*0.006,10,10),new THREE.MeshBasicMaterial({color:i%5===0?0xa78cff:0x62efff,transparent:true,opacity:0.72}));
  p.userData={a:i/30*Math.PI*2,r:1.38+(i%6)*0.11,y:(i%5-2)*0.11};
  core.add(p); closeParticles.push(p);
}

// Quiet depth field — deliberately no oversized background blobs.
const field = new THREE.Group(); scene.add(field);
for(let i=0;i<300;i++){
  const p=new THREE.Mesh(new THREE.SphereGeometry(0.005+(i%4)*0.002,6,6),new THREE.MeshBasicMaterial({color:i%13===0?0x8f78ff:0x52dce8,transparent:true,opacity:0.12+(i%5)*0.025}));
  p.position.set((Math.random()-.5)*16,(Math.random()-.5)*9,(Math.random()-.5)*9);
  field.add(p);
}

const nodeGroup = new THREE.Group(); scene.add(nodeGroup);
const nodePositions=[[-3.0,1.55,0.2],[3.05,1.15,-0.1],[-3.15,-0.15,0.15],[3.1,-0.35,0.1],[-2.55,-1.7,-0.15],[2.5,-1.65,0.15],[0,-2.55,-0.1]];
const nodes=[];
const nodeLinks=[];

projects.forEach((p,i)=>{
  const g=new THREE.Group(); g.position.set(0,0,0); nodeGroup.add(g);
  const halo=new THREE.Mesh(new THREE.SphereGeometry(0.25,24,24),new THREE.MeshBasicMaterial({color:i%2?0xa789ff:0x63efff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false})); g.add(halo);
  const mesh=new THREE.Mesh(new THREE.IcosahedronGeometry(0.105,2),new THREE.MeshPhysicalMaterial({color:i%2?0x6146a8:0x146d78,emissive:i%2?0x765bff:0x39e7ef,emissiveIntensity:2.5,metalness:.55,roughness:.12,clearcoat:1,transparent:true,opacity:0})); g.add(mesh);
  const orbit=new THREE.Mesh(new THREE.TorusGeometry(.19,.006,6,72),new THREE.MeshBasicMaterial({color:i%2?0xa789ff:0x63efff,transparent:true,opacity:0,blending:THREE.AdditiveBlending})); g.add(orbit);
  const label=document.createElement('div'); label.className='project-label '+(i%2?'violet':'');
  label.innerHTML=`<div class="k">${p[2]} / ${p[1]}</div><h3>${p[0]}</h3><div class="s">Power BI · interactive node</div>`;
  $('#labels').appendChild(label);
  nodes.push({g,mesh,halo,orbit,target:new THREE.Vector3(...nodePositions[i]),label,index:i});
  if(i>0){const pts=[new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0)];const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:i%2?0x8e75ff:0x58e9f5,transparent:true,opacity:0,blending:THREE.AdditiveBlending}));nodeGroup.add(line);nodeLinks.push(line)}
});

let pointerX=0,pointerY=0,smoothX=0,smoothY=0;
let targetScroll=0,scroll=0;
addEventListener('pointermove',e=>{pointerX=(e.clientX/innerWidth-.5)*2;pointerY=(e.clientY/innerHeight-.5)*2});
addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;targetScroll=max?scrollY/max:0},{passive:true});

const sections=['home','about','work','skills','projects','contact'];
$$('.nav').forEach(n=>n.addEventListener('click',()=>{const i=sections.indexOf(n.dataset.section);const max=document.documentElement.scrollHeight-innerHeight;window.scrollTo({top:max*(i/5),behavior:'smooth'})}));

function setLabelPosition(node,visible,activeAmount){
  const v=node.g.position.clone().project(camera);
  const x=(v.x*.5+.5)*innerWidth;
  const y=(-v.y*.5+.5)*innerHeight;
  node.label.style.left=clamp(x+28,20,innerWidth-390)+'px';
  node.label.style.top=clamp(y-26,30,innerHeight-150)+'px';
  node.label.style.opacity=visible?String(clamp(activeAmount*1.2)): '0';
  node.label.style.transform=visible?`translateY(${(1-activeAmount)*14}px)`: 'translateY(14px)';
  node.label.style.clipPath=visible?`inset(0 ${Math.max(0,(1-activeAmount)*100)}% 0 0)`:'inset(0 100% 0 0)';
}

function frame(t){
  requestAnimationFrame(frame);
  scroll+=(targetScroll-scroll)*0.065;
  smoothX+=(pointerX-smoothX)*0.055; smoothY+=(pointerY-smoothY)*0.055;
  $('#bar').style.width=(scroll*100)+'%';

  let section='home';
  if(scroll>=.166&&scroll<.333)section='about';
  else if(scroll>=.333&&scroll<.5)section='work';
  else if(scroll>=.5&&scroll<.64)section='skills';
  else if(scroll>=.64&&scroll<.93)section='projects';
  else if(scroll>=.93)section='contact';
  $$('.nav').forEach(n=>n.classList.toggle('active',n.dataset.section===section));
  ['about','work','skills'].forEach(n=>$('#'+n).classList.toggle('active',section===n));
  $('#hero').classList.toggle('gone',section!=='home');
  $('#stage').textContent=section==='projects'?'05 / PROJECT CONSTELLATION':section.toUpperCase()==='HOME'?'01 / DATA CORE':section.toUpperCase();
  $('#readout').textContent=section==='projects'?'SCROLL / FORM PROJECT NODES':`CORE / ${section.toUpperCase()}`;

  // Mouse-reactive 3D: camera parallax + core tilt + subtle field drift.
  root.rotation.y += (smoothX*.13-root.rotation.y)*.045;
  root.rotation.x += (-smoothY*.09-root.rotation.x)*.045;
  camera.position.x += (smoothX*.42-camera.position.x)*.035;
  camera.position.y += (-smoothY*.25-camera.position.y)*.035;
  camera.lookAt(0,0,0);

  const homeToSkills=ease(clamp(scroll/.64));
  const energy=0.78+Math.sin(t*.0013)*.08+Math.abs(smoothX)*.08+Math.abs(smoothY)*.06;
  outer.material.emissiveIntensity=energy;
  inner.material.emissiveIntensity=1.0+Math.abs(smoothX)*.45+Math.abs(smoothY)*.35;
  nucleus.material.emissiveIntensity=7+Math.sin(t*.004)*1.5+Math.abs(smoothX+smoothY)*1.6;
  nucleusGlow.scale.setScalar(1+Math.sin(t*.003)*.12+Math.abs(smoothX+smoothY)*.3);
  fill.intensity=18+Math.abs(smoothX)*9;
  rim.intensity=14+Math.abs(smoothY)*7;

  core.rotation.y += 0.0022 + smoothX*0.0014;
  core.rotation.x += 0.0007 - smoothY*0.0008;
  inner.rotation.y -= 0.0035;
  inner.rotation.x += 0.0012;
  innerWire.rotation.z -= 0.002;
  rings.forEach((r,i)=>{r.rotation.z+=0.0012*(i+1);r.rotation.y+=0.0007*(i+1)});
  closeParticles.forEach(p=>{p.userData.a+=0.0018+(p.userData.r%0.2)*.001;p.position.set(Math.cos(p.userData.a)*p.userData.r,Math.sin(p.userData.a*1.2)*p.userData.r*.72+p.userData.y,Math.sin(p.userData.a)*p.userData.r*.5)});

  // Project nodes exist ONLY inside Projects. Each scroll beat forms one node out of the core.
  const projT=clamp((scroll-.64)/.29);
  const step=1/projects.length;
  const centerPull=1.0;
  nodes.forEach((node,i)=>{
    const start=i*step;
    const local=clamp((projT-start)/(step*.92));
    const amount=ease(local);
    const active=local>0;
    const prior=i===0?0:ease(clamp((projT-(start-step*.15))/(step*.85)));
    node.g.visible=active;
    node.g.position.lerpVectors(new THREE.Vector3(0,0,0),node.target,amount);
    const s=active?(0.72+amount*.62):0;
    node.g.scale.setScalar(s);
    node.mesh.material.opacity=active?clamp(amount*1.2):0;
    node.halo.material.opacity=active?(0.06+amount*.22):0;
    node.orbit.material.opacity=active?(0.15+amount*.35):0;
    node.mesh.rotation.y+=0.006;
    node.orbit.rotation.z+=0.008;
    const labelVisible=active && section==='projects' && amount>.55;
    setLabelPosition(node,labelVisible,clamp((amount-.45)/.55));
    if(i>0){
      const line=nodeLinks[i-1]; line.material.opacity=section==='projects'&&amount>.35?0.12+amount*.25:0;
      const arr=line.geometry.attributes.position.array;const prev=nodes[i-1].g.position;arr[0]=prev.x;arr[1]=prev.y;arr[2]=prev.z;arr[3]=node.g.position.x;arr[4]=node.g.position.y;arr[5]=node.g.position.z;line.geometry.attributes.position.needsUpdate=true;
    }
  });

  // Project constellation fades out cleanly outside Projects.
  const projectVisibility=section==='projects'?1:0;
  nodeGroup.visible=projectVisibility>0;
  if(!nodeGroup.visible) nodes.forEach(n=>n.label.style.opacity='0');

  renderer.render(scene,camera);
}
requestAnimationFrame(frame);

addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2))});
