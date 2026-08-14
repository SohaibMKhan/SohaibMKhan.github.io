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
const smoother = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;
const lerp = (a,b,t) => a+(b-a)*t;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34,innerWidth/innerHeight,.1,100);
camera.position.set(0,0,10.8);
const renderer = new THREE.WebGLRenderer({canvas:$('#webgl'),antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.34;
scene.background = new THREE.Color(0x01040a);

scene.add(new THREE.AmbientLight(0x526476,0.32));
const key = new THREE.DirectionalLight(0xd9f8ff,4.6); key.position.set(4.5,5.5,7); scene.add(key);
const fill = new THREE.PointLight(0x61efff,24,9); fill.position.set(2.1,1.7,3.2); scene.add(fill);
const rim = new THREE.PointLight(0x8d6cff,19,9); rim.position.set(-2.6,-1.7,2.6); scene.add(rim);
const coreLight = new THREE.PointLight(0x8dfaff,14,5.5); coreLight.position.set(0,0,1.8); scene.add(coreLight);

const root = new THREE.Group(); scene.add(root);
const core = new THREE.Group(); root.add(core);

// The approved core stays structurally simple, but gains depth through layered materials and a fresnel rim.
const outer = new THREE.Mesh(
  new THREE.SphereGeometry(1.38,72,72),
  new THREE.MeshPhysicalMaterial({color:0x071a23,emissive:0x075365,emissiveIntensity:.56,metalness:.42,roughness:.15,clearcoat:1,clearcoatRoughness:.055,transparent:true,opacity:.72,side:THREE.DoubleSide})
);
core.add(outer);

const outerRim = new THREE.Mesh(
  new THREE.SphereGeometry(1.405,64,64),
  new THREE.ShaderMaterial({
    uniforms:{uColor:{value:new THREE.Color(0x62efff)},uViolet:{value:new THREE.Color(0x8e74ff)},uPower:{value:2.8},uIntensity:{value:.52}},
    vertexShader:`varying vec3 vNormal; varying vec3 vWorld; void main(){vNormal=normalize(normalMatrix*normal); vec4 w=modelMatrix*vec4(position,1.0); vWorld=w.xyz; gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`uniform vec3 uColor; uniform vec3 uViolet; uniform float uPower; uniform float uIntensity; varying vec3 vNormal; varying vec3 vWorld; void main(){vec3 viewDir=normalize(cameraPosition-vWorld); float fres=pow(1.0-max(dot(normalize(vNormal),normalize(viewDir)),0.0),uPower); vec3 c=mix(uColor,uViolet,smoothstep(.35,1.0,fres)); float a=fres*uIntensity; gl_FragColor=vec4(c,a);}`,
    transparent:true,blending:THREE.AdditiveBlending,depthWrite:false,side:THREE.FrontSide
  })
);
core.add(outerRim);

const cage = new THREE.Mesh(new THREE.IcosahedronGeometry(1.43,2),new THREE.MeshBasicMaterial({color:0x70edff,wireframe:true,transparent:true,opacity:.09,blending:THREE.AdditiveBlending,depthWrite:false}));
core.add(cage);

const facetShell = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.31,2),
  new THREE.MeshPhysicalMaterial({color:0x0b2732,emissive:0x083d50,emissiveIntensity:.3,metalness:.25,roughness:.25,clearcoat:1,transparent:true,opacity:.34,wireframe:false,side:THREE.DoubleSide})
);
core.add(facetShell);

const inner = new THREE.Mesh(
  new THREE.IcosahedronGeometry(.86,1),
  new THREE.MeshPhysicalMaterial({color:0x101d3c,emissive:0x341d78,emissiveIntensity:.82,metalness:.52,roughness:.11,clearcoat:1,clearcoatRoughness:.05,transparent:true,opacity:.62})
);
core.add(inner);
const innerWire = new THREE.Mesh(new THREE.IcosahedronGeometry(.91,2),new THREE.MeshBasicMaterial({color:0xb08cff,wireframe:true,transparent:true,opacity:.15,blending:THREE.AdditiveBlending,depthWrite:false}));
core.add(innerWire);

const innerGlow = new THREE.Mesh(new THREE.SphereGeometry(.58,48,48),new THREE.MeshBasicMaterial({color:0x24dff5,transparent:true,opacity:.055,blending:THREE.AdditiveBlending,depthWrite:false}));
core.add(innerGlow);
const nucleus = new THREE.Mesh(new THREE.SphereGeometry(.115,48,48),new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xc9ffff,emissiveIntensity:12,roughness:.02,metalness:.02}));
core.add(nucleus);
const nucleusGlow = new THREE.Mesh(new THREE.SphereGeometry(.31,32,32),new THREE.MeshBasicMaterial({color:0x72f6ff,transparent:true,opacity:.085,blending:THREE.AdditiveBlending,depthWrite:false}));
core.add(nucleusGlow);
const nucleusHalo = new THREE.Mesh(new THREE.SphereGeometry(.52,32,32),new THREE.MeshBasicMaterial({color:0x5beaff,transparent:true,opacity:.018,blending:THREE.AdditiveBlending,depthWrite:false}));
core.add(nucleusHalo);

const energyBeams=[];
for(let i=0;i<4;i++){
  const beam=new THREE.Mesh(new THREE.TorusGeometry(.48+i*.09,.0075,8,120),new THREE.MeshBasicMaterial({color:i%2?0xa789ff:0x6df4ff,transparent:true,opacity:.1,blending:THREE.AdditiveBlending,depthWrite:false}));
  beam.rotation.set(i*.72,.3+i*.48,.2+i*.31); core.add(beam); energyBeams.push(beam);
}

const rings=[];
for(let i=0;i<3;i++){
  const ring=new THREE.Mesh(new THREE.TorusGeometry(1.65+i*.22,.0085,8,220),new THREE.MeshBasicMaterial({color:i===1?0xa789ff:0x61eaff,transparent:true,opacity:.13,blending:THREE.AdditiveBlending,depthWrite:false}));
  ring.rotation.set(.5+i*.44,.3+i*.37,.15+i*.52); core.add(ring); rings.push(ring);
}

const closeParticles=[];
for(let i=0;i<30;i++){
  const p=new THREE.Mesh(new THREE.SphereGeometry(.011+(i%3)*.006,10,10),new THREE.MeshBasicMaterial({color:i%5===0?0xa78cff:0x62efff,transparent:true,opacity:.72}));
  p.userData={a:i/30*Math.PI*2,r:1.36+(i%6)*.11,y:(i%5-2)*.11}; core.add(p); closeParticles.push(p);
}

const field=new THREE.Group(); scene.add(field);
for(let i=0;i<260;i++){
  const p=new THREE.Mesh(new THREE.SphereGeometry(.0045+(i%4)*.0018,6,6),new THREE.MeshBasicMaterial({color:i%13===0?0x8f78ff:0x52dce8,transparent:true,opacity:.085+(i%5)*.018}));
  p.position.set((Math.random()-.5)*16,(Math.random()-.5)*9,(Math.random()-.5)*9); p.userData={seed:Math.random()*Math.PI*2,depth:p.position.z}; field.add(p);
}

const nodeGroup=new THREE.Group(); scene.add(nodeGroup);
const nodePositions=[[-3,1.55,.2],[3.05,1.15,-.1],[-3.15,-.15,.15],[3.1,-.35,.1],[-2.55,-1.7,-.15],[2.5,-1.65,.15],[0,-2.55,-.1]];
const nodes=[]; const nodeLinks=[];
projects.forEach((p,i)=>{
  const g=new THREE.Group(); nodeGroup.add(g);
  const halo=new THREE.Mesh(new THREE.SphereGeometry(.25,24,24),new THREE.MeshBasicMaterial({color:i%2?0xa789ff:0x63efff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false})); g.add(halo);
  const mesh=new THREE.Mesh(new THREE.IcosahedronGeometry(.105,2),new THREE.MeshPhysicalMaterial({color:i%2?0x6146a8:0x146d78,emissive:i%2?0x765bff:0x39e7ef,emissiveIntensity:3.2,metalness:.55,roughness:.12,clearcoat:1,transparent:true,opacity:0})); g.add(mesh);
  const orbit=new THREE.Mesh(new THREE.TorusGeometry(.19,.006,6,72),new THREE.MeshBasicMaterial({color:i%2?0xa789ff:0x63efff,transparent:true,opacity:0,blending:THREE.AdditiveBlending})); g.add(orbit);
  const label=document.createElement('div'); label.className='project-label '+(i%2?'violet':'');
  label.innerHTML=`<div class="k">${p[2]} / ${p[1]}</div><h3>${p[0]}</h3><div class="d">${p[3]}</div><div class="s">${p[4]}</div>`; $('#labels').appendChild(label);
  nodes.push({g,mesh,halo,orbit,target:new THREE.Vector3(...nodePositions[i]),label,index:i});
  if(i>0){const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),new THREE.LineBasicMaterial({color:i%2?0x8e75ff:0x58e9f5,transparent:true,opacity:0,blending:THREE.AdditiveBlending})); nodeGroup.add(line); nodeLinks.push(line)}
});

let pointerX=0,pointerY=0,smoothX=0,smoothY=0,targetScroll=0,scroll=0;
addEventListener('pointermove',e=>{pointerX=(e.clientX/innerWidth-.5)*2;pointerY=(e.clientY/innerHeight-.5)*2});
addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;targetScroll=max?scrollY/max:0},{passive:true});
const sections=['home','about','work','skills','projects','contact'];
$$('.nav').forEach(n=>n.addEventListener('click',()=>{const i=sections.indexOf(n.dataset.section);const max=document.documentElement.scrollHeight-innerHeight;window.scrollTo({top:max*(i/5),behavior:'smooth'})}));

function setLabelPosition(node,visible,activeAmount){
  const v=node.g.position.clone().project(camera); const x=(v.x*.5+.5)*innerWidth; const y=(-v.y*.5+.5)*innerHeight; const reveal=clamp(activeAmount);
  node.label.style.left=clamp(x+38,22,innerWidth-430)+'px'; node.label.style.top=clamp(y-42,30,innerHeight-190)+'px';
  node.label.style.opacity=visible?String(reveal):'0'; node.label.style.transform=visible?`translate3d(${(1-reveal)*18}px,${(1-reveal)*8}px,0) scale(${.985+.015*reveal})`:'translate3d(18px,8px,0) scale(.985)';
  node.label.style.clipPath=visible?`inset(0 ${Math.max(0,(1-reveal)*100)}% 0 0)`:'inset(0 100% 0 0)';
}

function frame(t){
  requestAnimationFrame(frame);
  scroll+=(targetScroll-scroll)*.072; smoothX+=(pointerX-smoothX)*.055; smoothY+=(pointerY-smoothY)*.055;
  $('#bar').style.width=(scroll*100)+'%';

  let section='home';
  if(scroll>=.166&&scroll<.333)section='about'; else if(scroll>=.333&&scroll<.5)section='work'; else if(scroll>=.5&&scroll<.64)section='skills'; else if(scroll>=.64&&scroll<.93)section='projects'; else if(scroll>=.93)section='contact';
  $$('.nav').forEach(n=>n.classList.toggle('active',n.dataset.section===section));
  ['about','work','skills'].forEach(n=>$('#'+n).classList.toggle('active',section===n));
  $('#hero').classList.toggle('gone',section!=='home');
  $('#stage').textContent=section==='projects'?'05 / PROJECT CONSTELLATION':section==='home'?'01 / DATA CORE':section.toUpperCase();
  $('#readout').textContent=section==='projects'?'SCROLL / FORM PROJECT NODES':`CORE / ${section.toUpperCase()}`;

  // Scroll-driven camera choreography gives each section its own visual state instead of only swapping text.
  const homeP=clamp(scroll/.166), aboutP=clamp((scroll-.166)/.167), workP=clamp((scroll-.333)/.167), skillP=clamp((scroll-.5)/.14), projectP=clamp((scroll-.64)/.29), contactP=clamp((scroll-.93)/.07);
  const inProjects=section==='projects';
  const scenePulse=inProjects ? .10*Math.sin(projectP*Math.PI*7) : 0;
  const targetRootX=smoothX*.18 + (section==='about'?-.035:section==='work'?.055:section==='skills'?.08:section==='projects'?-.02:0);
  const targetRootY=smoothX*.22 + (section==='about'?.05:section==='work'?.08:section==='skills'?-.05:section==='projects'?.02:0);
  root.rotation.x+=(targetRootX-root.rotation.x)*.055; root.rotation.y+=(targetRootY-root.rotation.y)*.055;

  const sectionScale=section==='home'?1:section==='about'?.94:section==='work'?1.03:section==='skills'?.9:section==='projects'?.88:.98;
  const targetScale=sectionScale + scenePulse;
  root.scale.x+=(targetScale-root.scale.x)*.055; root.scale.y+=(targetScale-root.scale.y)*.055; root.scale.z+=(targetScale-root.scale.z)*.055;
  const desiredCamX=smoothX*.62 + (section==='about'?.25:section==='work'?-.2:section==='skills'?.3:section==='projects'?smoothX*.16:0);
  const desiredCamY=-smoothY*.4 + (section==='about'?-.05:section==='work'?.08:section==='skills'?-.1:0);
  const desiredCamZ=10.8 - (section==='projects'?.45:0) + Math.abs(smoothX+smoothY)*.16;
  camera.position.x+=(desiredCamX-camera.position.x)*.055; camera.position.y+=(desiredCamY-camera.position.y)*.055; camera.position.z+=(desiredCamZ-camera.position.z)*.05; camera.lookAt(0,0,0);

  const energy=.55+Math.sin(t*.0012)*.06+Math.abs(smoothX)*.2+Math.abs(smoothY)*.16 + (inProjects?projectP*.16:0);
  outer.material.emissiveIntensity=energy; outerRim.material.uniforms.uIntensity.value=.42+energy*.42; inner.material.emissiveIntensity=.78+Math.abs(smoothX)*.48+Math.abs(smoothY)*.38+(inProjects?projectP*.28:0); facetShell.material.emissiveIntensity=.24+energy*.18;
  nucleus.material.emissiveIntensity=12+Math.sin(t*.004)*1.7+Math.abs(smoothX+smoothY)*3.5+(inProjects?projectP*4:0);
  nucleusGlow.scale.setScalar(1+Math.sin(t*.003)*.14+Math.abs(smoothX+smoothY)*.38); nucleusHalo.scale.setScalar(1+Math.sin(t*.002)*.12+(inProjects?projectP*.45:0)); innerGlow.scale.setScalar(1+Math.sin(t*.0021)*.08+Math.abs(smoothX-smoothY)*.2);
  fill.intensity=24+Math.abs(smoothX)*14+(inProjects?projectP*9:0); rim.intensity=19+Math.abs(smoothY)*12; coreLight.intensity=14+Math.abs(smoothX+smoothY)*10+(inProjects?projectP*8:0); fill.position.x=2.1+smoothX*2.5; fill.position.y=1.7-smoothY*1.9; rim.position.x=-2.6-smoothX*1.8; rim.position.y=-1.7+smoothY*1.5;

  core.rotation.y+=.0018+smoothX*.0024; core.rotation.x+=.0006-smoothY*.0014; outer.rotation.y+=.0004; outer.rotation.x-=.00016; outerRim.rotation.y+=.00042; cage.rotation.y-=.00105; cage.rotation.z+=.00042; facetShell.rotation.y+=.0009; facetShell.rotation.z-=.00035; inner.rotation.y-=.003; inner.rotation.x+=.0011; innerWire.rotation.z-=.0018; innerGlow.rotation.y+=.0018; nucleusHalo.rotation.y-=.001;
  energyBeams.forEach((r,i)=>{r.rotation.z+=.00135*(i+1);r.rotation.y+=.00072*(i+1)}); rings.forEach((r,i)=>{r.rotation.z+=.00105*(i+1)+smoothX*.00045;r.rotation.y+=.00065*(i+1)-smoothY*.00035});
  closeParticles.forEach(p=>{p.userData.a+=.0018+(p.userData.r%0.2)*.001;p.position.set(Math.cos(p.userData.a)*p.userData.r,Math.sin(p.userData.a*1.2)*p.userData.r*.72+p.userData.y,Math.sin(p.userData.a)*p.userData.r*.5)});
  field.children.forEach((p,i)=>{p.position.x+=smoothX*.00035*(i%2?1:-1);p.position.y+=-smoothY*.00025;});

  // Projects exist only in Projects. Their reveal is staggered, continuous and tied to the scroll position.
  const projT=clamp((scroll-.64)/.29); const step=1/projects.length;
  nodes.forEach((node,i)=>{
    const start=i*step; const local=clamp((projT-start)/(step*.9)); const amount=smoother(local); const active=local>0;
    node.g.visible=active; node.g.position.lerpVectors(new THREE.Vector3(0,0,0),node.target,amount); node.g.scale.setScalar(active?.58+amount*.78:0);
    node.mesh.material.opacity=active?clamp(amount*1.35):0; node.halo.material.opacity=active?.035+amount*.28:0; node.halo.scale.setScalar(.8+amount*.72); node.orbit.material.opacity=active?.1+amount*.44:0;
    node.mesh.rotation.y+=.006; node.mesh.rotation.x+=.002; node.orbit.rotation.z+=.008;
    const labelVisible=active&&inProjects&&amount>.08; const textReveal=smoother(clamp((amount-.08)/.82)); setLabelPosition(node,labelVisible,textReveal);
    if(i>0){const line=nodeLinks[i-1]; line.material.opacity=inProjects&&amount>.06?.09+amount*.31:0; const arr=line.geometry.attributes.position.array; const prev=nodes[i-1].g.position; arr[0]=prev.x;arr[1]=prev.y;arr[2]=prev.z;arr[3]=node.g.position.x;arr[4]=node.g.position.y;arr[5]=node.g.position.z; line.geometry.attributes.position.needsUpdate=true;}
  });
  nodeGroup.visible=inProjects; if(!inProjects)nodes.forEach(n=>n.label.style.opacity='0');

  renderer.render(scene,camera);
}
requestAnimationFrame(frame);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2))});