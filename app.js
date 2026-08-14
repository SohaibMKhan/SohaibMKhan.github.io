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
const smoother = t => t<.5 ? 4*t*t*t : 1-Math.pow(-2*t+2,3)/2;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(34,innerWidth/innerHeight,.1,100);
camera.position.set(0,0,10.8);
const renderer = new THREE.WebGLRenderer({canvas:$('#webgl'),antialias:true,alpha:false,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,2));
renderer.setSize(innerWidth,innerHeight);
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.42;
scene.background = new THREE.Color(0x01040a);

scene.add(new THREE.AmbientLight(0x526476,0.28));
const key = new THREE.DirectionalLight(0xe8fbff,4.8); key.position.set(4.5,5.5,7); scene.add(key);
const fill = new THREE.PointLight(0x61efff,25,9); fill.position.set(2.1,1.7,3.2); scene.add(fill);
const rim = new THREE.PointLight(0x8d6cff,20,9); rim.position.set(-2.6,-1.7,2.6); scene.add(rim);
const coreLight = new THREE.PointLight(0x8dfaff,18,6); coreLight.position.set(0,0,2.0); scene.add(coreLight);

const root = new THREE.Group(); scene.add(root);
const core = new THREE.Group(); root.add(core);

// ENERGY CORE -------------------------------------------------------------
// A layered emissive volume: no giant flat blue sphere, no heavy wireframe wall.
// The depth comes from nested physical shells, a bright nucleus, Fresnel light
// and moving energy filaments/particles inside the volume.
const coreBody = new THREE.Mesh(
  new THREE.SphereGeometry(1.22,64,64),
  new THREE.MeshPhysicalMaterial({
    color:0x06141b, emissive:0x073b4c, emissiveIntensity:.9,
    metalness:.28, roughness:.18, clearcoat:1, clearcoatRoughness:.08,
    transparent:true, opacity:.54, side:THREE.DoubleSide
  })
);
core.add(coreBody);

const plasmaShell = new THREE.Mesh(
  new THREE.SphereGeometry(1.31,64,64),
  new THREE.ShaderMaterial({
    uniforms:{
      uCyan:{value:new THREE.Color(0x5df4ff)},
      uViolet:{value:new THREE.Color(0x8f6dff)},
      uPower:{value:2.15},
      uIntensity:{value:.72},
      uTime:{value:0}
    },
    vertexShader:`varying vec3 vN; varying vec3 vW; void main(){vN=normalize(normalMatrix*normal); vec4 w=modelMatrix*vec4(position,1.0); vW=w.xyz; gl_Position=projectionMatrix*viewMatrix*w;}`,
    fragmentShader:`uniform vec3 uCyan; uniform vec3 uViolet; uniform float uPower; uniform float uIntensity; uniform float uTime; varying vec3 vN; varying vec3 vW; void main(){vec3 vd=normalize(cameraPosition-vW); float fres=pow(1.0-max(dot(normalize(vN),vd),0.0),uPower); float pulse=.82+.18*sin(uTime*2.0+vW.y*2.4); vec3 c=mix(uCyan,uViolet,smoothstep(.28,.92,fres)); gl_FragColor=vec4(c,fres*uIntensity*pulse);}`,
    transparent:true, blending:THREE.AdditiveBlending, depthWrite:false, side:THREE.FrontSide
  })
);
core.add(plasmaShell);

const innerShell = new THREE.Mesh(
  new THREE.IcosahedronGeometry(.92,3),
  new THREE.MeshPhysicalMaterial({
    color:0x111a34, emissive:0x253c91, emissiveIntensity:.82,
    metalness:.5, roughness:.1, clearcoat:1, clearcoatRoughness:.04,
    transparent:true, opacity:.34, side:THREE.DoubleSide
  })
);
core.add(innerShell);

const innerEnergy = new THREE.Mesh(
  new THREE.SphereGeometry(.68,48,48),
  new THREE.MeshBasicMaterial({color:0x20ddf4,transparent:true,opacity:.07,blending:THREE.AdditiveBlending,depthWrite:false})
);
core.add(innerEnergy);

const nucleus = new THREE.Mesh(
  new THREE.SphereGeometry(.135,48,48),
  new THREE.MeshStandardMaterial({color:0xffffff,emissive:0xd8ffff,emissiveIntensity:15,roughness:.02,metalness:.02})
);
core.add(nucleus);

const nucleusGlow = new THREE.Mesh(
  new THREE.SphereGeometry(.34,40,40),
  new THREE.MeshBasicMaterial({color:0x71f7ff,transparent:true,opacity:.11,blending:THREE.AdditiveBlending,depthWrite:false})
);
core.add(nucleusGlow);
const nucleusHalo = new THREE.Mesh(
  new THREE.SphereGeometry(.58,40,40),
  new THREE.MeshBasicMaterial({color:0x6befff,transparent:true,opacity:.022,blending:THREE.AdditiveBlending,depthWrite:false})
);
core.add(nucleusHalo);

const innerFilaments=[];
for(let i=0;i<7;i++){
  const curve=new THREE.EllipseCurve(0,0,.46+i*.07,.23+i*.055,0,Math.PI*2,false,0);
  const pts=curve.getPoints(96).map(p=>new THREE.Vector3(p.x, p.y, Math.sin((p.x+p.y)*5+i)*.12));
  const geo=new THREE.BufferGeometry().setFromPoints(pts);
  const line=new THREE.Line(geo,new THREE.LineBasicMaterial({color:i%2?0xa789ff:0x63efff,transparent:true,opacity:.16,blending:THREE.AdditiveBlending,depthWrite:false}));
  line.rotation.set(i*.51,.35+i*.37,i*.22); core.add(line); innerFilaments.push(line);
}

// MOVING NODE STREAMS -----------------------------------------------------
// These replace the old static-looking orbital rings. Every orbit is made of
// small moving nodes. In Projects, selected stream particles are pulled into
// the active project node, so the project literally grows out of the stream.
const streamGroup = new THREE.Group();
core.add(streamGroup);
const streams=[];
const streamColors=[0x62efff,0xa789ff,0x56dfe8];
for(let s=0;s<3;s++){
  const particles=[];
  const count=72;
  for(let i=0;i<count;i++){
    const m=new THREE.Mesh(
      new THREE.SphereGeometry(.012+(i%4)*.003,8,8),
      new THREE.MeshBasicMaterial({color:streamColors[s],transparent:true,opacity:.5+(i%5)*.055,blending:THREE.AdditiveBlending,depthWrite:false})
    );
    m.userData={a:(i/count)*Math.PI*2, speed:.0016+(i%7)*.00022, lane:i%3, seed:i*.73};
    streamGroup.add(m); particles.push(m);
  }
  streams.push({particles,phase:s*1.9});
}

// Small energy motes close to the core.
const closeParticles=[];
for(let i=0;i<34;i++){
  const p=new THREE.Mesh(new THREE.SphereGeometry(.009+(i%3)*.004,8,8),new THREE.MeshBasicMaterial({color:i%5===0?0xa78cff:0x62efff,transparent:true,opacity:.65,blending:THREE.AdditiveBlending,depthWrite:false}));
  p.userData={a:i/34*Math.PI*2,r:1.27+(i%6)*.08,y:(i%5-2)*.09};
  core.add(p); closeParticles.push(p);
}

// Background field stays deliberately quiet so the core remains the hero.
const field=new THREE.Group(); scene.add(field);
for(let i=0;i<240;i++){
  const p=new THREE.Mesh(new THREE.SphereGeometry(.004+(i%4)*.0016,6,6),new THREE.MeshBasicMaterial({color:i%15===0?0x8f78ff:0x52dce8,transparent:true,opacity:.07+(i%5)*.016}));
  p.position.set((Math.random()-.5)*16,(Math.random()-.5)*9,(Math.random()-.5)*9);
  p.userData={seed:Math.random()*Math.PI*2}; field.add(p);
}

// PROJECT CONSTELLATION --------------------------------------------------
const nodeGroup=new THREE.Group(); scene.add(nodeGroup);
const nodePositions=[[-3,1.55,.2],[3.05,1.15,-.1],[-3.15,-.15,.15],[3.1,-.35,.1],[-2.55,-1.7,-.15],[2.5,-1.65,.15],[0,-2.55,-.1]];
const nodes=[];
const nodeLinks=[];
const mergeParticles=[];

projects.forEach((p,i)=>{
  const g=new THREE.Group(); nodeGroup.add(g);
  const halo=new THREE.Mesh(new THREE.SphereGeometry(.29,24,24),new THREE.MeshBasicMaterial({color:i%2?0xa789ff:0x63efff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false})); g.add(halo);
  const mesh=new THREE.Mesh(new THREE.IcosahedronGeometry(.13,2),new THREE.MeshPhysicalMaterial({color:i%2?0x6b50ba:0x147b89,emissive:i%2?0x765bff:0x39e7ef,emissiveIntensity:4.2,metalness:.52,roughness:.1,clearcoat:1,transparent:true,opacity:0})); g.add(mesh);
  const coreDot=new THREE.Mesh(new THREE.SphereGeometry(.055,20,20),new THREE.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false})); g.add(coreDot);
  const orbit=new THREE.Mesh(new THREE.TorusGeometry(.22,.005,6,72),new THREE.MeshBasicMaterial({color:i%2?0xa789ff:0x63efff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false})); g.add(orbit);
  const label=document.createElement('div'); label.className='project-label '+(i%2?'violet':'');
  label.innerHTML=`<div class="k">${p[2]} / ${p[1]}</div><h3>${p[0]}</h3><div class="d">${p[3]}</div><div class="s">${p[4]}</div>`; $('#labels').appendChild(label);
  nodes.push({g,mesh,coreDot,halo,orbit,target:new THREE.Vector3(...nodePositions[i]),label,index:i});

  // A cloud of tiny nodes that will merge into this project node.
  const bits=[];
  for(let j=0;j<26;j++){
    const b=new THREE.Mesh(new THREE.SphereGeometry(.009+(j%3)*.003,7,7),new THREE.MeshBasicMaterial({color:i%2?0xa789ff:0x63efff,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));
    b.userData={j,angle:(j/26)*Math.PI*2,seed:(j*1.7+i),nodeIndex:i};
    nodeGroup.add(b); bits.push(b);
  }
  mergeParticles.push(bits);

  if(i>0){
    const line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(),new THREE.Vector3()]),new THREE.LineBasicMaterial({color:i%2?0x8e75ff:0x58e9f5,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));
    nodeGroup.add(line); nodeLinks.push(line);
  }
});

let pointerX=0,pointerY=0,smoothX=0,smoothY=0,targetScroll=0,scroll=0;
addEventListener('pointermove',e=>{pointerX=(e.clientX/innerWidth-.5)*2;pointerY=(e.clientY/innerHeight-.5)*2});
addEventListener('scroll',()=>{const max=document.documentElement.scrollHeight-innerHeight;targetScroll=max?scrollY/max:0},{passive:true});
const sections=['home','about','work','skills','projects','contact'];
$$('.nav').forEach(n=>n.addEventListener('click',()=>{const i=sections.indexOf(n.dataset.section);const max=document.documentElement.scrollHeight-innerHeight;window.scrollTo({top:max*(i/5),behavior:'smooth'})}));

function setLabelPosition(node,visible,activeAmount){
  const v=node.g.position.clone().project(camera);
  const x=(v.x*.5+.5)*innerWidth;
  const y=(-v.y*.5+.5)*innerHeight;
  const reveal=clamp(activeAmount);
  node.label.style.left=clamp(x+42,22,innerWidth-430)+'px';
  node.label.style.top=clamp(y-44,30,innerHeight-190)+'px';
  node.label.style.opacity=visible?String(reveal):'0';
  node.label.style.transform=visible?`translate3d(${(1-reveal)*22}px,${(1-reveal)*9}px,0) scale(${.97+.03*reveal})`:'translate3d(22px,9px,0) scale(.97)';
  node.label.style.clipPath=visible?`inset(0 ${Math.max(0,(1-reveal)*100)}% 0 0)`:'inset(0 100% 0 0)';
}

function streamPoint(streamIndex,particle,t){
  const a=particle.userData.a + t*.0007 + streams[streamIndex].phase;
  const r=1.52 + streamIndex*.16 + Math.sin(a*3+particle.userData.seed)*.055;
  const x=Math.cos(a)*r;
  const y=Math.sin(a*1.02)*r*.55;
  const z=Math.sin(a)*r*.72;
  const v=new THREE.Vector3(x,y,z);
  if(streamIndex===1) v.applyAxisAngle(new THREE.Vector3(1,0,0),.72);
  if(streamIndex===2) v.applyAxisAngle(new THREE.Vector3(0,1,0),-.62);
  return v;
}

function frame(t){
  requestAnimationFrame(frame);
  scroll+=(targetScroll-scroll)*.072;
  smoothX+=(pointerX-smoothX)*.055;
  smoothY+=(pointerY-smoothY)*.055;
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
  $('#stage').textContent=section==='projects'?'05 / PROJECT CONSTELLATION':section==='home'?'01 / DATA CORE':section.toUpperCase();
  $('#readout').textContent=section==='projects'?'SCROLL / PARTICLES FORM PROJECT NODES':`CORE / ${section.toUpperCase()}`;

  const projectP=clamp((scroll-.64)/.29);
  const inProjects=section==='projects';
  const projectEnergy=inProjects ? projectP : 0;

  // Cursor makes the entire 3D object feel physical rather than UI-like.
  const targetRootX=smoothY*.11 + (section==='about'?.03:section==='work'?.055:section==='skills'?-.04:0);
  const targetRootY=smoothX*.2 + (section==='about'?.045:section==='work'?.08:section==='skills'?.04:section==='projects'?.02:0);
  root.rotation.x+=(targetRootX-root.rotation.x)*.055;
  root.rotation.y+=(targetRootY-root.rotation.y)*.055;
  const sectionScale=section==='home'?1:section==='about'?.95:section==='work'?1.02:section==='skills'?.91:section==='projects'?.89:.98;
  const targetScale=sectionScale + (inProjects?.035*Math.sin(projectP*Math.PI*8):0);
  root.scale.lerp(new THREE.Vector3(targetScale,targetScale,targetScale),.055);

  const desiredCamX=smoothX*.62 + (section==='about'?.22:section==='work'?-.18:section==='skills'?.25:section==='projects'?smoothX*.18:0);
  const desiredCamY=-smoothY*.38 + (section==='work'?.07:section==='skills'?.-.08:0);
  const desiredCamZ=10.8-(inProjects?.4:0)+Math.abs(smoothX+smoothY)*.14;
  camera.position.x+=(desiredCamX-camera.position.x)*.055;
  camera.position.y+=(desiredCamY-camera.position.y)*.055;
  camera.position.z+=(desiredCamZ-camera.position.z)*.05;
  camera.lookAt(0,0,0);

  const pulse=.5+Math.sin(t*.0015)*.07+Math.abs(smoothX)*.16+Math.abs(smoothY)*.13+projectEnergy*.28;
  coreBody.material.emissiveIntensity=.72+pulse*.7;
  plasmaShell.material.uniforms.uTime.value=t*.001;
  plasmaShell.material.uniforms.uIntensity.value=.58+pulse*.5;
  innerShell.material.emissiveIntensity=.65+pulse*.8+projectEnergy*.25;
  innerEnergy.material.opacity=.055+pulse*.035;
  nucleus.material.emissiveIntensity=14+Math.sin(t*.004)*2.2+Math.abs(smoothX+smoothY)*3.8+projectEnergy*7;
  nucleusGlow.scale.setScalar(1.0+Math.sin(t*.0031)*.13+Math.abs(smoothX+smoothY)*.35+projectEnergy*.22);
  nucleusGlow.material.opacity=.09+projectEnergy*.04;
  nucleusHalo.scale.setScalar(1.0+Math.sin(t*.0022)*.11+projectEnergy*.42);
  fill.intensity=24+Math.abs(smoothX)*15+projectEnergy*12;
  rim.intensity=20+Math.abs(smoothY)*13;
  coreLight.intensity=16+Math.abs(smoothX+smoothY)*11+projectEnergy*10;
  fill.position.x=2.1+smoothX*2.5; fill.position.y=1.7-smoothY*1.9;
  rim.position.x=-2.6-smoothX*1.8; rim.position.y=-1.7+smoothY*1.5;

  core.rotation.y+=.0015+smoothX*.0022;
  core.rotation.x+=.00055-smoothY*.0013;
  coreBody.rotation.y+=.00035;
  plasmaShell.rotation.y+=.00045;
  innerShell.rotation.y-=.0025; innerShell.rotation.x+=.001;
  innerEnergy.rotation.y+=.0022;
  nucleusHalo.rotation.y-=.001;
  innerFilaments.forEach((l,i)=>{l.rotation.z+=.0013*(i%3+1);l.rotation.y+=.00055*(i%2?1:-1)});
  closeParticles.forEach(p=>{p.userData.a+=.0019;p.position.set(Math.cos(p.userData.a)*p.userData.r,Math.sin(p.userData.a*1.2)*p.userData.r*.72+p.userData.y,Math.sin(p.userData.a)*p.userData.r*.5)});

  // Each orbit is literally a moving chain of tiny nodes.
  streams.forEach((stream,s)=>stream.particles.forEach((p,i)=>{
    const v=streamPoint(s,p,t);
    const breathe=1+Math.sin(t*.0018+p.userData.seed)*.025;
    p.position.copy(v.multiplyScalar(breathe));
    p.scale.setScalar(1+Math.sin(t*.003+p.userData.seed)*.22);
  }));

  field.children.forEach((p,i)=>{
    p.position.x+=smoothX*.00022*(i%2?1:-1);
    p.position.y-=smoothY*.00016;
  });

  // PROJECTS: tiny particles from each orbital stream are pulled into a larger node.
  const step=1/projects.length;
  nodes.forEach((node,i)=>{
    const start=i*step;
    const local=clamp((projectP-start)/(step*.9));
    const amount=smoother(local);
    const active=local>0;
    node.g.visible=active;
    node.g.position.lerpVectors(new THREE.Vector3(0,0,0),node.target,amount);
    node.g.scale.setScalar(active?.58+amount*.82:0);
    node.mesh.material.opacity=active?clamp(Math.pow(amount,1.4)*1.4):0;
    node.mesh.material.emissiveIntensity=3.5+amount*3.5;
    node.halo.material.opacity=active?.02+amount*.25:0;
    node.halo.scale.setScalar(.75+amount*.85);
    node.coreDot.material.opacity=active?clamp(amount*1.2):0;
    node.orbit.material.opacity=active?amount*.34:0;
    node.mesh.rotation.y+=.006; node.mesh.rotation.x+=.0025; node.orbit.rotation.z+=.008;

    const bits=mergeParticles[i];
    bits.forEach((b,j)=>{
      const a=b.userData.angle + t*.0008*(j%2?1:-1);
      const swirl=.25*(1-amount)+.055;
      const target=node.g.position.clone();
      const orbitPos=new THREE.Vector3(
        Math.cos(a)*swirl,
        Math.sin(a*1.35)*swirl*.75,
        Math.sin(a)*swirl*.7
      );
      // Before the node exists, the particles ride near the core. As it forms,
      // they collapse toward the node and become its visible mass.
      const streamAnchor=streamPoint(i%3,streams[i%3].particles[(j*3+i)%streams[i%3].particles.length],t);
      const origin=streamAnchor.clone();
      const desired=origin.lerp(target.clone().add(orbitPos),amount);
      b.position.lerp(desired,.18);
      b.material.opacity=inProjects&&active?(.25+.72*amount):0;
      b.scale.setScalar(active?1+amount*1.5:0);
    });

    const labelVisible=active&&inProjects&&amount>.12;
    const textReveal=smoother(clamp((amount-.12)/.78));
    setLabelPosition(node,labelVisible,textReveal);

    if(i>0){
      const line=nodeLinks[i-1];
      line.material.opacity=inProjects&&amount>.1?.06+amount*.3:0;
      const arr=line.geometry.attributes.position.array;
      const prev=nodes[i-1].g.position;
      arr[0]=prev.x;arr[1]=prev.y;arr[2]=prev.z;
      arr[3]=node.g.position.x;arr[4]=node.g.position.y;arr[5]=node.g.position.z;
      line.geometry.attributes.position.needsUpdate=true;
    }
  });

  nodeGroup.visible=inProjects;
  if(!inProjects){
    nodes.forEach(n=>n.label.style.opacity='0');
    mergeParticles.flat().forEach(b=>b.material.opacity=0);
  }

  renderer.render(scene,camera);
}
requestAnimationFrame(frame);
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,2))});
