import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js';

const projects = [
  ['Sprocket Central — Customer & Sales Intelligence','CUSTOMER INTELLIGENCE','01','Customer segmentation, sales performance and insight discovery.','Power BI · Segmentation · Analysis'],
  ['Credit Card Transaction Analysis','FINANCIAL ANALYTICS','02','Transaction patterns, customer behavior and financial performance.','Power BI · SQL · Data Modeling'],
  ['COVID-19 Data Analysis','GLOBAL HEALTH ANALYTICS','03','A visual exploration of global COVID-19 trends and impact.','Power BI · Trends · Visualization'],
  ['Company Attrition Analytics','PEOPLE ANALYTICS','04','Workforce attrition patterns and people-focused business insights.','Power BI · HR Analytics · Insights'],
  ['Data-Driven Sales Analysis','COMMERCIAL ANALYTICS','05','Sales performance analysis focused on commercial decision-making.','Power BI · Forecasting · KPI'],
  ['Google Play Store Apps Analysis','PRODUCT ANALYTICS','06','App ecosystem, category and performance analysis.','Power BI · Data Cleaning · App Analytics'],
  ['Sales Data Analysis','SALES INTELLIGENCE','07','Performance trends and actionable business metrics.','Power BI · Excel · Data Analysis']
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
renderer.toneMappingExposure = 1.28;
scene.background = new THREE.Color(0x02050a);

scene.add(new THREE.AmbientLight(0x526476,0.5));
const key = new THREE.DirectionalLight(0xd9f8ff,4.2); key.position.set(4.5,5.5,7); scene.add(key);
const fill = new THREE.PointLight(0x61efff,22,8); fill.position.set(2.1,1.7,3.2); scene.add(fill);
const rim = new THREE.PointLight(0x8d6cff,18,8); rim.position.set(-2.6,-1.7,2.6); scene.add(rim);
const coreLight = new THREE.PointLight(0x8dfaff,12,5); coreLight.position.set(0,0,1.8); scene.add(coreLight);

const root = new THREE.Group(); scene.add(root);
const core = new THREE.Group(); root.add(core);

// Premium dimensional core: smooth glass-like volume, restrained cage, internal energy and light.
const outer = new THREE.Mesh(
  new THREE.SphereGeometry(1.38,64,64),
  new THREE.MeshPhysicalMaterial({
    color:0x071a23,
    emissive:0x075365,
    emissiveIntensity:0.48,
    metalness:0.34,
    roughness:0.18,
    clearcoat:1,
    clearcoatRoughness:0.07,
    transparent:true,
    opacity:0.66
  })
);
core.add(outer);

const cage = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.43,2),
  new THREE.MeshBasicMaterial({color:0x70edff,wireframe:true,transparent:true,opacity:0.105,blending:THREE.AdditiveBlending,depthWrite:false})
);
core.add(cage);

const inner = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.86,1),
  new THREE.MeshPhysicalMaterial({
    color:0x101d3c,
    emissive:0x341d78,
    emissiveIntensity:0.72,
    metalness:0.5,
    roughness:0.13,
    clearcoat:1,
    clearcoatRoughness:0.06,
    transparent:true,
    opacity:0.58
  })
);
core.add(inner);

const innerWire = new THREE.Mesh(
  new THREE.IcosahedronGeometry(0.91,2),
  new THREE.MeshBasicMaterial({color:0xb08cff,wireframe:true,transparent:true,opacity:0.18,blending:THREE.AdditiveBlending,depthWrite:false})
);
core.add(innerWire);

const innerGlow = new THREE.Mesh(
  new THREE.SphereGeometry(0.58,48,48),
  new THREE.MeshBasicMaterial({color:0x24dff5,transparent:true,opacity:0.045,blending:THREE.AdditiveBlending,depthWrite:false})
);
core.add(innerGlow);

const nucleus = new THREE.Mesh(
  new THREE.SphereGeometry(0.12,48,48),
  new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xc9ffff,emissiveIntensity:10,roughness:0.025,metalness:0.02})
);
core.add(nucleus);
const nucleusGlow = new THREE.Mesh(
  new THREE.SphereGeometry(0.31,32,32),
  new THREE.MeshBasicMaterial({color:0x72f6ff,transparent:true,opacity:0.07,blending:THREE.AdditiveBlending,depthWrite:false})
);
core.add(nucleusGlow);

const energyBeams=[];
for(let i=0;i<4;i++){
  const beam = new THREE.Mesh(
    new THREE.TorusGeometry(0.48+i*0.09,0.008,8,120),
    new THREE.MeshBasicMaterial({color:i%2?0xa789ff:0x6df4ff,transparent:true,opacity:0.11,blending:THREE.AdditiveBlending,depthWrite:false})
  );
  beam.rotation.set(i*0.72,0.3+i*0.48,0.2+i*0.31);
  core.add(beam); energyBeams.push(beam);
}

const rings=[];
for(let i=0;i<3;i++){
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.65+i*0.22,0.009,8,220),
    new THREE.MeshBasicMaterial({color:i===1?0xa789ff:0x61eaff,transparent:true,opacity:0.15,blending:THREE.AdditiveBlending,depthWrite:false})
  );
  ring.rotation.set(0.5+i*0.44,0.3+i*0.37,0.15+i*0.52);
  core.add(ring); rings.push(ring);
}

const closeParticles=[];
for(let i=0;i<30;i++){
  const p=new THREE.Mesh(new THREE.SphereGeometry(0.011+(i%3)*0.006,10,10),new THREE.MeshBasicMaterial({color:i%5===0?0xa78cff:0x62efff,transparent:true,opacity:0.72}));
  p.userData={a:i/30*Math.PI*2,r:1.36+(i%6)*0.11,y:(i%5-2)*0.11};
  core.add(p); closeParticles.push(p);
}

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
  const mesh=new THREE.Mesh(new THREE.IcosahedronGeometry(0.105,2),new THREE.MeshPhysicalMaterial({color:i%2?0x6146a8:0x146d78,emissive:i%2?0x765bff:0x39e7ef,emissiveIntensity:3.2,metalness:.55,roughness:.12,clearcoat:1,transparent:true,opacity:0})); g.add(mesh);
  const orbit=new THREE.Mesh(new THREE.TorusGeometry(.19,.006,6,72),new THREE.MeshBasicMaterial({color:i%2?0xa789ff:0x63efff,transparent:true,opacity:0,blending:THREE.AdditiveBlending})); g.add(orbit);
  const label=document.createElement('div'); label.className='project-label '+(i%2?'violet':'');
  label.innerHTML=`<div class="k">${p[2]} / ${p[1]}</div><h3>${p[0]}</h3><div class="d">${p[3]}</div><div class="s">${p[4]}</div>`;
  $('#labels').appendChild(label);
  nodes.push({g,mesh,halo,orbit,target:new THREE.Vector3(...nodePositions[i]),label,index:i});
  if(i>0){
    const pts=[new THREE.Vector3(0,0,0),new THREE.Vector3(0,0,0)];
    const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),new THREE.LineBasicMaterial({color:i%2?0x8e75ff:0x58e9f5,transparent:true,opacity:0,blending:THREE.AdditiveBlending}));
    nodeGroup.add(line);nodeLinks.push(line)
  }
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
  node.label.style.left=clamp(x+34,22,innerWidth-430)+'px';
  node.label.style.top=clamp(y-38,30,innerHeight-190)+'px';
  const reveal=clamp(activeAmount);
  node.label.style.opacity=visible?String(reveal):'0';
  node.label.style.transform=visible?`translate3d(${(1-reveal)*12}px,${(1-reveal)*10}px,0)`:'translate3d(12px,10px,0)';
  node.label.style.clipPath=visible?`inset(0 ${Math.max(0,(1-reveal)*100)}% 0 0)`:'inset(0 100% 0 0)';
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

  // Stronger, continuous mouse response: camera, core tilt, light position and surrounding field all follow the pointer.
  root.rotation.y += (smoothX*.22-root.rotation.y)*.065;
  root.rotation.x += (-smoothY*.15-root.rotation.x)*.065;
  camera.position.x += (smoothX*.52-camera.position.x)*.05;
  camera.position.y += (-smoothY*.32-camera.position.y)*.05;
  camera.position.z += (10.8 + Math.abs(smoothX+smoothY)*.18-camera.position.z)*.04;
  camera.lookAt(0,0,0);

  const energy=0.48+Math.sin(t*.0013)*.07+Math.abs(smoothX)*.22+Math.abs(smoothY)*.18;
  outer.material.emissiveIntensity=energy;
  inner.material.emissiveIntensity=.72+Math.abs(smoothX)*.55+Math.abs(smoothY)*.42;
  nucleus.material.emissiveIntensity=10+Math.sin(t*.004)*1.8+Math.abs(smoothX+smoothY)*3.0;
  nucleusGlow.scale.setScalar(1+Math.sin(t*.003)*.14+Math.abs(smoothX+smoothY)*.42);
  innerGlow.scale.setScalar(1+Math.sin(t*.0021)*.08+Math.abs(smoothX-smoothY)*.2);
  fill.intensity=22+Math.abs(smoothX)*15;
  rim.intensity=18+Math.abs(smoothY)*12;
  coreLight.intensity=12+Math.abs(smoothX+smoothY)*10;
  fill.position.x=2.1+smoothX*2.4; fill.position.y=1.7-smoothY*1.8;
  rim.position.x=-2.6-smoothX*1.8; rim.position.y=-1.7+smoothY*1.5;

  core.rotation.y += 0.0022 + smoothX*0.0022;
  core.rotation.x += 0.0007 - smoothY*0.0015;
  outer.rotation.y += 0.00045;
  outer.rotation.x -= 0.00018;
  cage.rotation.y -= 0.0012;
  cage.rotation.z += 0.00045;
  inner.rotation.y -= 0.0035;
  inner.rotation.x += 0.0012;
  innerWire.rotation.z -= 0.002;
  innerGlow.rotation.y += 0.002;
  energyBeams.forEach((r,i)=>{r.rotation.z+=0.0015*(i+1);r.rotation.y+=0.0008*(i+1)});
  rings.forEach((r,i)=>{r.rotation.z+=0.0012*(i+1)+smoothX*.0005;r.rotation.y+=0.0007*(i+1)-smoothY*.0004});
  closeParticles.forEach(p=>{p.userData.a+=0.0018+(p.userData.r%0.2)*.001;p.position.set(Math.cos(p.userData.a)*p.userData.r,Math.sin(p.userData.a*1.2)*p.userData.r*.72+p.userData.y,Math.sin(p.userData.a)*p.userData.r*.5)});

  // Projects are activated only in the Projects section. Each node physically forms from the core.
  const projT=clamp((scroll-.64)/.29);
  const step=1/projects.length;
  nodes.forEach((node,i)=>{
    const start=i*step;
    const local=clamp((projT-start)/(step*.92));
    const amount=ease(local);
    const active=local>0;
    node.g.visible=active;
    node.g.position.lerpVectors(new THREE.Vector3(0,0,0),node.target,amount);
    node.g.scale.setScalar(active?(0.58+amount*.78):0);
    node.mesh.material.opacity=active?clamp(amount*1.3):0;
    node.halo.material.opacity=active?(0.035+amount*.25):0;
    node.halo.scale.setScalar(0.8+amount*.65);
    node.orbit.material.opacity=active?(0.1+amount*.42):0;
    node.mesh.rotation.y+=0.006;
    node.orbit.rotation.z+=0.008;
    const labelVisible=active && section==='projects' && amount>.12;
    const textReveal=ease(clamp((amount-.12)/.78));
    setLabelPosition(node,labelVisible,textReveal);
    if(i>0){
      const line=nodeLinks[i-1];
      line.material.opacity=section==='projects'&&amount>.08?0.09+amount*.27:0;
      const arr=line.geometry.attributes.position.array;
      const prev=nodes[i-1].g.position;
      arr[0]=prev.x;arr[1]=prev.y;arr[2]=prev.z;
      arr[3]=node.g.position.x;arr[4]=node.g.position.y;arr[5]=node.g.position.z;
      line.geometry.attributes.position.needsUpdate=true;
    }
  });

  nodeGroup.visible=section==='projects';
  if(!nodeGroup.visible) nodes.forEach(n=>n.label.style.opacity='0');

  renderer.render(scene,camera);
}
requestAnimationFrame(frame);

addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2))});
