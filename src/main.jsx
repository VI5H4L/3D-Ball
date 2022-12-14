import { render } from 'react-dom';
import * as THREE from 'three';
import "./styles.css"
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls"
import gsap from 'gsap';

//Scene
const scene = new THREE.Scene();

//Create our Sphere
const geometry = new THREE.SphereGeometry(3,64,64);
const material = new THREE.MeshStandardMaterial(
    {
        color:"#00ff83",
        roughness: 0.5,
    }
);
const mesh = new THREE.Mesh(geometry,material); 
scene.add(mesh);

//Sizes
const sizes = {
    width : window.innerWidth,
    heigth : window.innerHeight,
}

// Light
const light = new THREE.PointLight(0xffffff,1,100);
light.position.set(0,10,10);
light.intensity = 1.25
scene.add(light);

// Camera
const camera = new THREE.PerspectiveCamera(45,sizes.width/sizes.heigth,0.1,100);
camera.position.z = 20;
scene.add(camera);

// Renderer
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setPixelRatio(2);
renderer.setSize(sizes.width,sizes.heigth);
renderer.render(scene,camera);

// Controls
const controls = new OrbitControls(camera,canvas);
controls.enableDamping=(true);
controls.enablePan= false;
controls.enableZoom= false;
controls.autoRotate=true;
controls.autoRotateSpeed=5;

// Resize 
window.addEventListener("resize",()=>{
    sizes.width = window.innerWidth;
    sizes.heigth = window.innerHeight;

    camera.aspect=(sizes.width/sizes.heigth);
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width,sizes.heigth);
});

const loop = ()=>{
    controls.update();
    renderer.render(scene,camera);
    window.requestAnimationFrame(loop);
}
loop();

// Timeline magic 
const tl = gsap.timeline({defaults:{duration:1}});
tl.fromTo(mesh.scale,{z:0,x:0,y:0},{z:1,x:1,y:1});
tl.fromTo('nav',{y:'-100%'},{y:'0%'});
tl.fromTo('.title',{opacity:'0'},{opacity:'1'});

// Mouse Animation Color 
let mousedown = false;
let rgb;
window.addEventListener("mousedown",()=>{mousedown = true});
window.addEventListener("mouseup",()=>{mousedown = false});

window.addEventListener("mousemove",(e)=>{
    if(mousedown){
        rgb=[
            Math.round((e.pageX/sizes.width)*255),
            Math.round((e.pageY/sizes.heigth)*255),
            150,
        ]

        let newColor = new THREE.Color(`rgb(${rgb.join(",")})`);
        gsap.to(mesh.material.color,{r:newColor.r, g:newColor.g, b:newColor.b});
    }
});

