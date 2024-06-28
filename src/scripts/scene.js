import * as THREE from 'three'
import Stats from 'three/examples/jsm/libs/stats.module.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { GUI } from 'lil-gui'




// MARK: Variables

var renderer, scene
var camera, controls

const isMobile = 'ontouchend' in document

const slideImgs = []
const slideMtl = new THREE.MeshBasicMaterial({ toneMapped: false })


const mount = document.getElementById('three')

const stats = new Stats()
// document.body.appendChild(stats.dom)

// const gui = new GUI()




// MARK: Utils

const roundedRect = (x, y, width, height, radius) => {
    const shape = new THREE.Shape();
    shape.moveTo(x, y + radius);
    shape.lineTo(x, y + height - radius);
    shape.quadraticCurveTo(x, y + height, x + radius, y + height);
    shape.lineTo(x + width - radius, y + height);
    shape.quadraticCurveTo(
        x + width,
        y + height,
        x + width,
        y + height - radius
    );
    shape.lineTo(x + width, y + radius);
    shape.quadraticCurveTo(x + width, y, x + width - radius, y);
    shape.lineTo(x + radius, y);
    shape.quadraticCurveTo(x, y, x, y + radius);
    return shape;
}



// MARK: Init

export const init = () => {
    addRenderer()
    addCamCon()
    addLights()
    addListeners()
    addScene()

    onWindowResize()
    animate()
}



// MARK: Renderer

const addRenderer = () => {
    scene = new THREE.Scene()
    scene.background = new THREE.Color(0x141622)

    renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 0.85 // 1.2
    renderer.shadowMap.enabled = true
    renderer.shadowMapSoft = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    mount.appendChild(renderer.domElement)
}



// MARK: CamCon

const addCamCon = () => {
    camera = new THREE.PerspectiveCamera(50, window.innerWidth / (window.innerHeight), 0.1, 1000)
    camera.position.set(0, 0, 3)

    controls = new OrbitControls(camera, renderer.domElement)
    controls.enablePan = false
    controls.enableRotate = false

    if (isMobile) {
        controls.minDistance = 5
        // controls.maxDistance = 50
    } else {
        controls.minDistance = 3
        controls.maxDistance = 20
    }

    controls.update()
    onWindowResize()



    // Zoom
    const onZoom = () => {
        const scrollLimit = isMobile ? 18 : 20
        const distance = controls.getDistance()
        // console.log({ distance })

        if (distance > 3) { slideMtl.map = slideImgs[0]; slideMtl.needsUpdate = true }
        if (3 < distance && distance > 6) { slideMtl.map = slideImgs[1]; slideMtl.needsUpdate = true }
        if (6 < distance && distance > 9) { slideMtl.map = slideImgs[2]; slideMtl.needsUpdate = true }
        if (9 < distance && distance > 12) { slideMtl.map = slideImgs[3]; slideMtl.needsUpdate = true }
        if (12 < distance && distance > 15) { slideMtl.map = slideImgs[4]; slideMtl.needsUpdate = true }
        if (15 < distance && distance > 18) { slideMtl.map = slideImgs[5]; slideMtl.needsUpdate = true }
        if (distance >= scrollLimit) controls.enableZoom = false
    }

    controls.addEventListener('change', onZoom)



    // Scroll
    let scrollY = 0
    let ticking = false

    const onScroll = (scrollPos) => {
        console.log(scrollPos === 0)
        if (scrollPos <= 0) {
            controls.enableZoom = true
            mount.style.removeProperty('pointer-events')
            camera.position.set(0, 0, 19.99)
        }
    }

    document.addEventListener('scroll', () => {
        scrollY = window.scrollY
        if (!ticking) { window.requestAnimationFrame(() => { onScroll(scrollY); ticking = false }); ticking = true }
    })
}



// MARK: Lights

const addLights = () => {
    const aLight = new THREE.AmbientLight(0xffffff, 0.35)
    scene.add(aLight)

    // const dLight = new THREE.DirectionalLight(0xffffff, 0.7)
    // dLight.position.set(0, 5, 10)
    // scene.add(dLight)

    // const dLightHelper = new THREE.DirectionalLightHelper(dLight, 5)
    // scene.add(dLightHelper)

    const sLight = new THREE.SpotLight(0xffffff, 60, 9, Math.PI / 9)
    sLight.position.set(0, 3, 5)
    scene.add(sLight)

    // const sLightHelper = new THREE.SpotLightHelper(sLight, 5)
    // scene.add(sLightHelper)
}



// MARK: Scene

const addScene = () => {
    for (let i = 0; i < 6; i++) {
        const t = new THREE.TextureLoader().load(`assets/imgs/slide-${i}.png`)
        t.colorSpace = THREE.SRGBColorSpace
        slideImgs.push(t)
    }

    slideMtl.map = slideImgs[0]
    const board = new THREE.Mesh(new THREE.PlaneGeometry(9.6, 5.4), slideMtl)
    board.position.set(0, 0.5, -2)
    scene.add(board)


    const rectLight = new THREE.RectAreaLight(0xffffff, 1, 9.6, 5.4)
    rectLight.position.set(0, 0.5, -2)
    rectLight.lookAt(0, 0.5, 0)
    RectAreaLightUniformsLib.init()
    scene.add(rectLight)


    const sphereGeo = new THREE.SphereGeometry(0.5, 32, 32)
    const semiSphereGeo = new THREE.SphereGeometry(0.8, 32, 32, 0, Math.PI, 0, Math.PI)
    semiSphereGeo.rotateX(- Math.PI / 2)
    semiSphereGeo.translate(0, -1.5, 0)
    const personGeo = mergeGeometries([sphereGeo, semiSphereGeo])


    const presenter = new THREE.Mesh(personGeo, new THREE.MeshStandardMaterial({ color: 0xff9900, metalness: 0, roughness: 0, side: THREE.DoubleSide }))
    scene.add(presenter)


    const count = 18
    const columns = 6

    const people = new THREE.InstancedMesh(personGeo, new THREE.MeshStandardMaterial({ color: 0xAEAEb2, metalness: 0.1, roughness: 0, side: THREE.DoubleSide }), count)
    scene.add(people)


    const peopleObj = new THREE.Object3D()
    for (let i = 0; i < count; i++) {
        const pos = { x: i % columns % 2 ? - Math.ceil((i % columns + 1) / 2) * 2 : Math.ceil((i % columns + 1) / 2) * 2, y: -0.8, z: Math.floor(i / columns) * 2.9 + 5 }

        peopleObj.position.set(pos.x, pos.y, pos.z)
        peopleObj.updateMatrix()
        people.setMatrixAt(i, peopleObj.matrix)
    }


    for (let i = 0; i < count; i++) {
        const pos = { x: i % columns % 2 ? - Math.ceil((i % columns + 1) / 2) * 2 : Math.ceil((i % columns + 1) / 2) * 2, y: -0.8, z: Math.floor(i / columns) * 2.9 + 5 }

        const device = new THREE.Mesh(
            new THREE.ExtrudeGeometry(roundedRect(-(0.54 + 0.03), -0.02, 0.96 + 0.06, 0.54 + 0.06, 0.05), { depth: 0.01, bevelEnabled: true, bevelSegments: 3, steps: 3, bevelSize: 0.01, bevelThickness: 0.02 }),
            new THREE.MeshStandardMaterial({ color: 0x636366, metalness: 0, roughness: 0, side: THREE.DoubleSide })
        )
        device.position.set(pos.x, pos.y - 1, pos.z - 1)
        device.rotateX(-Math.PI / 6)


        const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.96, 0.54), slideMtl)
        screen.position.set(pos.x - 0.06, pos.y - 0.74, pos.z - 1.11)
        screen.rotateX(-Math.PI / 6)


        scene.add(device)
        scene.add(screen)
    }
}



// MARK: Listeners

const onWindowResize = () => {
    camera.aspect = isMobile ? 9 / 16 : 16 / 9
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerWidth * (isMobile ? 16 / 9 : 9 / 16))
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
}


var yDown = null

const onTouchStart = (e) => {
    yDown = e.touches[0].clientY
}

const onTouchMove = (e) => {
    if (!yDown) return

    const yUp = e.touches[0].clientY
    const yDiff = yDown - yUp

    if (controls.getDistance() < 20) camera.position.set(0, 0, camera.position.z + (yDiff / 500))
    else mount.style.pointerEvents = 'none'
}


const addListeners = () => {
    window.addEventListener('resize', onWindowResize, false)
    document.addEventListener('touchstart', onTouchStart)
    document.addEventListener('touchmove', onTouchMove)
}



// MARK: Animate

const animate = () => {
    requestAnimationFrame(animate)
    controls.update()
    stats.update()
    renderer.render(scene, camera)
}