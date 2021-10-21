import React, { Suspense, useRef, useState, useEffect, useContext } from 'react'
import { Canvas, useLoader, useFrame, extend } from '@react-three/fiber'
import { shaderMaterial } from '@react-three/drei'
import gsap from 'gsap'
import { TextureLoader } from 'three/src/loaders/TextureLoader'
import * as THREE from 'three'
import glsl from 'babel-plugin-glsl/macro'
import { workId } from '../context'

import img1 from '../../images/test/1.jpg'
import img2 from '../../images/test/2.jpg'
import img3 from '../../images/test/3.jpg'
import img4 from '../../images/test/4.jpg'
import img5 from '../../images/test/5.jpg'

const ColorShiftMaterial = shaderMaterial(
  { uTime: 0, uTexture: new THREE.Texture(), uDistance: 0 },
  // vertex shader
  glsl`
    uniform float uTime;
    varying vec2 vUv;
    varying vec3 vPosition;
    uniform vec2 pixels;
    float PI = 3.141592653589793238;
    uniform float uDistance;

    void main() {
      vUv = (uv - vec2(0.5))*(0.95 - 0.1 * uDistance) + vec2(0.5);
      vec3 pos = position;
      pos.y += sin(PI*uv.x)*0.01;
      pos.z += sin(PI*uv.x)*0.02;

      pos.y += sin(uTime*0.4)*0.025;
      vUv.y -= sin(uTime*0.4)*0.025;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    }
  `,
  // fragment shader
  glsl`
    precision mediump float;

    uniform vec3 uColor;
    uniform vec4 resolution;
    uniform highp float uDistance;
    uniform float uTime;

    uniform sampler2D uTexture;

    varying vec2 vUv;

    void main() {

      vec4 texture = texture2D(uTexture, vUv);
      float bw = (texture.r + texture.b + texture.g)/3.;
      vec4 another = vec4(bw,bw,bw, 1.);

      gl_FragColor = mix(another, texture, uDistance);
      gl_FragColor.a = clamp(uDistance, 0.5, 1.);
    }
  `
);

extend({ ColorShiftMaterial });

function Scene(props) {
  const [rounded, setRounded] = useState(0);

  const group = useRef();

  const work1Ref = useRef();
  const work2Ref = useRef();
  const work3Ref = useRef();
  const work4Ref = useRef();
  const work5Ref = useRef();

  const [work_1, work_2, work_3, work_4, work_5] = useLoader(TextureLoader, [img1, img2, img3, img4, img5])

  useFrame(({ clock }) => (
    work1Ref.current.uTime = clock.getElapsedTime(),
    work2Ref.current.uTime = clock.getElapsedTime(),
    work3Ref.current.uTime = clock.getElapsedTime(),
    work4Ref.current.uTime = clock.getElapsedTime(),
    work5Ref.current.uTime = clock.getElapsedTime()
  ));

  const ChangePosition = (rounded) => {
    setRounded(rounded);
    props.onChange(rounded);
  }

  useEffect(() => {
    let meshes = group.current.children;
    let objs = Array(5).fill({ dist: 0 })


    let speed = 0;
    let rounded = 0;
    let changePosition = 0;
    let position = 0;
    let attractTo = 0;
    let attractMode = false;

    window.addEventListener('wheel', (e) => {
      speed += e.deltaY * 0.0004;
    })

    let navs = [...document.querySelectorAll('.nameWork')];
    let nav = document.querySelector('.navWork');

    if (nav != null) {
      nav.addEventListener('mouseenter', () => {
        attractMode = true;
        gsap.to(group.current.rotation, {
          duration: 0.3,
          x: 0,
          y: 0,
          z: 0,
        })
        gsap.to(group.current.position, {
          duration: 0.3,
          x: 0,
          y: 0,
          z: 0,
        })
        gsap.to(group.current.scale, {
          duration: 0.2,
          x: 1.5,
          y: 1.5,
          z: 1.5,
        })
      })

      nav.addEventListener('mouseleave', () => {
        attractMode = false;
        gsap.to(group.current.rotation, {
          duration: 0.3,
          x: -0.4,
          y: -0.2,
          z: -0.1,
        })
        gsap.to(group.current.position, {
          duration: 0.3,
          x: 0.75,
          y: 0,
          z: 0,
        })
        gsap.to(group.current.scale, {
          duration: 0.2,
          x: 1,
          y: 1,
          z: 1,
        })
      })

      navs.forEach(el => {
        el.addEventListener('mouseenter', (e) => {
          attractTo = Number(e.target.getAttribute('data-nav'));
        })
      })
    }


    function raf() {
      position += speed;
      speed *= 0.8;

      // Скейлить элементы с активным Position
      objs.forEach((o, i) => {
        o.dist = Math.min(Math.abs(position - i), 1);
        o.dist = 1 - o.dist ** 2;

        let scale = 1 + 0.15 * o.dist;
        if (Object.keys(meshes).length !== 0) {
          meshes[i].position.y = position * 1.2 - i * 1.2;
          meshes[i].scale.set(scale, scale, scale);
          meshes[i].material.uniforms.uDistance.value = o.dist;
        }
      })

      rounded = Math.round(position);

      let diff = (rounded - position);

      if (attractMode) {
        position += -(position - attractTo) * 0.05;
      }
      else {
        position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.035;

        if (rounded < 0) {
          position += -(position - 0) * 0.1;
        }
        else if (rounded > 4) {
          position += -(position - 4) * 0.1;
        }
      }

      // изменить состояние активного элемента, если оно изменилось
      if (changePosition !== rounded && rounded >= 0 && rounded <= 4) {
        changePosition = Math.abs(rounded);
        ChangePosition(changePosition);
      }

      window.requestAnimationFrame(raf)
    }

    raf();

  }, [])




  return (
    <>
      <ambientLight intensity={0.1} />
      <directionalLight color="white" position={[0, 0, 1]} />
      <group rotation={[-0.4, -0.2, -0.1]} scale={[1, 1, 1]} position={[0.75, 0, 0]} ref={group}>
        <mesh>
          <planeBufferGeometry args={[1.5, 1, 20, 20]} />
          <colorShiftMaterial uTexture={work_1} ref={work1Ref} transparent />
        </mesh>
        <mesh>
          <planeBufferGeometry args={[1.5, 1, 20, 20]} />
          <colorShiftMaterial uTexture={work_2} ref={work2Ref} transparent />
        </mesh>
        <mesh>
          <planeBufferGeometry args={[1.5, 1, 20, 20]} />
          <colorShiftMaterial uTexture={work_3} ref={work3Ref} transparent />
        </mesh>
        <mesh>
          <planeBufferGeometry args={[1.5, 1, 20, 20]} />
          <colorShiftMaterial uTexture={work_4} ref={work4Ref} transparent />
        </mesh>
        <mesh>
          <planeBufferGeometry args={[1.5, 1, 20, 20]} />
          <colorShiftMaterial uTexture={work_5} ref={work5Ref} transparent />
        </mesh>
      </group>
    </>
  )
}

function WorksList() {
  const { setidChange } = useContext(workId);

  return (
    <>
      <div className="canvas"  >
        <Canvas pixelRatio={[1, 1.5]} camera={{ position: [0, 0, 12], fov: 10 }}>
          <Suspense fallback={null}>
            <Scene onChange={(rounded) => setidChange(rounded)} />
          </Suspense>
        </Canvas>
      </div>
    </>
  )
}

export default WorksList