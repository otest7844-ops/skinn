import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { Sparkles, Play, ChevronRight } from 'lucide-react'

export default function Intro3D({ onEnter }: { onEnter: () => void }) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [exiting, setExiting] = useState(false)

  function handleEnter() {
    setExiting(true)
    window.setTimeout(() => {
      onEnter()
    }, 700)
  }

  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    let width = container.clientWidth || window.innerWidth
    let height = container.clientHeight || window.innerHeight

    // 1. Scene & Camera
    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x060814, 0.05)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 9)

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.3
    container.appendChild(renderer.domElement)

    // 3. Materials - Realistic Metallic Luxury Obsidian & Gold & Amethyst
    const goldMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xf59e0b,
      emissive: 0x78350f,
      emissiveIntensity: 0.2,
      metalness: 0.92,
      roughness: 0.16,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      reflectivity: 1.0,
    })

    const amethystMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8b5cf6,
      emissive: 0x4c1d95,
      emissiveIntensity: 0.35,
      metalness: 0.75,
      roughness: 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.15,
      transmission: 0.1,
    })

    const titaniumMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd8b4fe,
      metalness: 0.88,
      roughness: 0.18,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    })

    const diamondMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.4,
      metalness: 0.2,
      roughness: 0.05,
      transmission: 0.6,
      thickness: 1.2,
    })

    // 4. Create 3D Sculptural "19"
    const group19 = new THREE.Group()
    scene.add(group19)

    const extrudeSettings = {
      depth: 0.45,
      bevelEnabled: true,
      bevelSegments: 5,
      steps: 2,
      bevelSize: 0.08,
      bevelThickness: 0.08,
    }

    // Number "1" Shape
    const shape1 = new THREE.Shape()
    // Top flag
    shape1.moveTo(-0.9, 0.8)
    shape1.lineTo(-0.25, 1.4)
    shape1.lineTo(0.25, 1.4)
    // Main right stem
    shape1.lineTo(0.25, -1.4)
    // Base right
    shape1.lineTo(0.7, -1.4)
    shape1.lineTo(0.7, -1.8)
    // Base bottom
    shape1.lineTo(-0.7, -1.8)
    shape1.lineTo(-0.7, -1.4)
    shape1.lineTo(-0.25, -1.4)
    // Up left stem
    shape1.lineTo(-0.25, 0.65)
    shape1.lineTo(-0.75, 0.4)
    shape1.closePath()

    const geom1 = new THREE.ExtrudeGeometry(shape1, extrudeSettings)
    geom1.center()
    const mesh1 = new THREE.Mesh(geom1, goldMaterial)
    mesh1.position.x = -1.15
    group19.add(mesh1)

    // Number "9" Shape
    const shape9 = new THREE.Shape()
    // Outer boundary of 9
    shape9.moveTo(0.8, 1.1)
    shape9.bezierCurveTo(0.8, 1.7, 0.2, 1.85, -0.3, 1.85)
    shape9.bezierCurveTo(-0.9, 1.85, -1.15, 1.4, -1.15, 0.7)
    shape9.bezierCurveTo(-1.15, -0.05, -0.7, -0.4, -0.15, -0.4)
    shape9.bezierCurveTo(0.1, -0.4, 0.35, -0.3, 0.5, -0.1)
    // Tail curving down
    shape9.lineTo(0.5, -0.7)
    shape9.bezierCurveTo(0.5, -1.35, 0.1, -1.65, -0.6, -1.65)
    shape9.lineTo(-0.7, -1.35)
    shape9.lineTo(-0.2, -1.35)
    shape9.bezierCurveTo(0.1, -1.35, 0.2, -1.15, 0.2, -0.85)
    shape9.lineTo(0.2, -0.45)
    shape9.bezierCurveTo(0.0, -0.55, -0.2, -0.6, -0.4, -0.6)
    shape9.bezierCurveTo(-1.0, -0.6, -1.4, -0.1, -1.4, 0.65)
    shape9.bezierCurveTo(-1.4, 1.45, -0.9, 1.95, 0.1, 1.95)
    shape9.bezierCurveTo(0.9, 1.95, 1.1, 1.3, 1.1, 0.8)
    shape9.closePath()

    // Inner cutout hole for 9
    const hole9 = new THREE.Path()
    hole9.moveTo(0.5, 0.65)
    hole9.bezierCurveTo(0.5, 1.25, 0.1, 1.4, -0.25, 1.4)
    hole9.bezierCurveTo(-0.65, 1.4, -0.8, 1.1, -0.8, 0.65)
    hole9.bezierCurveTo(-0.8, 0.2, -0.55, 0.05, -0.2, 0.05)
    hole9.bezierCurveTo(0.2, 0.05, 0.5, 0.2, 0.5, 0.65)
    hole9.closePath()
    shape9.holes.push(hole9)

    const geom9 = new THREE.ExtrudeGeometry(shape9, extrudeSettings)
    geom9.center()
    const mesh9 = new THREE.Mesh(geom9, titaniumMaterial)
    mesh9.position.x = 1.05
    group19.add(mesh9)

    // Inner Amethyst Glowing Cores inside "1" and "9"
    const coreSettings = {
      depth: 0.15,
      bevelEnabled: true,
      bevelSegments: 3,
      bevelSize: 0.04,
      bevelThickness: 0.04,
    }
    const coreMesh1 = new THREE.Mesh(new THREE.ExtrudeGeometry(shape1, coreSettings), amethystMaterial)
    coreMesh1.position.set(-1.15, 0, 0.2)
    coreMesh1.scale.set(0.85, 0.85, 1)
    group19.add(coreMesh1)

    // Orbiting Golden Halo Rings
    const ringGeom = new THREE.TorusGeometry(2.6, 0.035, 16, 100)
    const ringMesh1 = new THREE.Mesh(ringGeom, goldMaterial)
    ringMesh1.rotation.x = Math.PI / 3.2
    scene.add(ringMesh1)

    const ringMesh2 = new THREE.Mesh(new THREE.TorusGeometry(3.1, 0.02, 16, 100), amethystMaterial)
    ringMesh2.rotation.x = -Math.PI / 4
    ringMesh2.rotation.y = Math.PI / 6
    scene.add(ringMesh2)

    // Floating 3D Diamond / Voxel Crystals
    const crystals: THREE.Mesh[] = []
    const crystalGeom = new THREE.OctahedronGeometry(0.22, 0)
    for (let i = 0; i < 9; i++) {
      const crystal = new THREE.Mesh(crystalGeom, i % 2 === 0 ? diamondMaterial : goldMaterial)
      const angle = (i / 9) * Math.PI * 2
      const radius = 2.4 + (i % 3) * 0.5
      crystal.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * (radius * 0.65) + ((i % 2) - 0.5) * 0.5,
        Math.sin(angle) * 1.2
      )
      crystal.scale.setScalar(0.7 + (i % 3) * 0.3)
      scene.add(crystal)
      crystals.push(crystal)
    }

    // Floating Star Dust / Particle Galaxy
    const particleCount = 700
    const particlePositions = new Float32Array(particleCount * 3)
    const particleColors = new Float32Array(particleCount * 3)

    for (let i = 0; i < particleCount; i++) {
      const idx = i * 3
      particlePositions[idx] = (Math.random() - 0.5) * 20
      particlePositions[idx + 1] = (Math.random() - 0.5) * 20
      particlePositions[idx + 2] = (Math.random() - 0.5) * 14

      // Gold & violet particle palette
      if (Math.random() > 0.4) {
        particleColors[idx] = 0.54 // R
        particleColors[idx + 1] = 0.36 // G
        particleColors[idx + 2] = 0.98 // B (purple)
      } else {
        particleColors[idx] = 0.98 // R
        particleColors[idx + 1] = 0.75 // G
        particleColors[idx + 2] = 0.15 // B (gold)
      }
    }

    const particleGeom = new THREE.BufferGeometry()
    particleGeom.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    particleGeom.setAttribute('color', new THREE.BufferAttribute(particleColors, 3))

    const particleMat = new THREE.PointsMaterial({
      size: 0.065,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    })

    const particleSystem = new THREE.Points(particleGeom, particleMat)
    scene.add(particleSystem)

    // 5. Cinematic Lighting
    const ambientLight = new THREE.AmbientLight(0x1a1233, 1.2)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8)
    keyLight.position.set(4, 5, 6)
    scene.add(keyLight)

    // Purple Point Light
    const purpleLight = new THREE.PointLight(0xa855f7, 5.0, 15)
    purpleLight.position.set(-3, 2, 3)
    scene.add(purpleLight)

    // Amber / Gold Point Light
    const goldLight = new THREE.PointLight(0xf59e0b, 6.0, 15)
    goldLight.position.set(3, -2, 3)
    scene.add(goldLight)

    // Cyan Rim Light
    const rimLight = new THREE.PointLight(0x38bdf8, 3.5, 12)
    rimLight.position.set(0, -4, -2)
    scene.add(rimLight)

    // 6. Interactive Cursor / Touch Parallax
    let targetRotX = 0
    let targetRotY = 0
    let currentRotX = 0
    let currentRotY = 0

    function handlePointerMove(e: PointerEvent) {
      const normX = (e.clientX / window.innerWidth) * 2 - 1
      const normY = (e.clientY / window.innerHeight) * 2 - 1
      targetRotY = normX * 0.45
      targetRotX = -normY * 0.35
    }
    window.addEventListener('pointermove', handlePointerMove)

    // 7. Animation Loop
    let animationFrameId: number
    let clock = new THREE.Clock()
    let startTime = Date.now()

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      // Smooth camera intro reveal
      const introDuration = 2.2
      const timeSinceStart = (Date.now() - startTime) / 1000
      if (timeSinceStart < introDuration) {
        const progress = Math.min(1, timeSinceStart / introDuration)
        const easeOut = 1 - Math.pow(1 - progress, 3)
        camera.position.z = 14 - easeOut * 5.2
      }

      // Parallax smooth interpolation
      currentRotX += (targetRotX - currentRotX) * 0.05
      currentRotY += (targetRotY - currentRotY) * 0.05

      // Floating gentle breathing motion
      group19.rotation.y = currentRotY + Math.sin(elapsedTime * 0.8) * 0.12
      group19.rotation.x = currentRotX + Math.cos(elapsedTime * 0.7) * 0.08
      group19.position.y = Math.sin(elapsedTime * 1.2) * 0.12

      // Rotate orbital rings
      ringMesh1.rotation.z = elapsedTime * 0.25
      ringMesh2.rotation.z = -elapsedTime * 0.18

      // Orbit crystals
      crystals.forEach((crystal, index) => {
        const speed = 0.02 + (index % 3) * 0.01
        crystal.rotation.x += speed
        crystal.rotation.y += speed * 1.5
        crystal.position.y += Math.sin(elapsedTime * 2 + index) * 0.003
      })

      // Particle subtle drifting
      particleSystem.rotation.y = elapsedTime * 0.03
      particleSystem.rotation.x = Math.sin(elapsedTime * 0.05) * 0.05

      // Moving light flares
      purpleLight.position.x = Math.sin(elapsedTime * 1.2) * 4
      purpleLight.position.y = Math.cos(elapsedTime * 0.9) * 3
      goldLight.position.x = Math.cos(elapsedTime * 1.1) * 4
      goldLight.position.y = Math.sin(elapsedTime * 0.8) * 3

      renderer.render(scene, camera)
    }
    animate()

    // Resize Handler
    function handleResize() {
      if (!container) return
      width = container.clientWidth || window.innerWidth
      height = container.clientHeight || window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('resize', handleResize)
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div
      className={`fixed inset-0 z-[150] flex flex-col justify-between items-center overflow-hidden bg-[#060814] select-none transition-all duration-700 ${
        exiting ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* 3D WebGL Canvas Viewport */}
      <div ref={mountRef} className="absolute inset-0 z-0 touch-none" />

      {/* Atmospheric Vignette & Glow */}
      <div className="absolute inset-0 z-[1] pointer-events-none bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(6,8,20,0.85)_80%,rgba(6,8,20,0.98)_100%)]" />

      {/* Top Header branding with Crown */}
      <div className="relative z-10 pt-10 px-6 flex flex-col items-center text-center animate-in fade-in duration-1000">
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-purple-500/30 backdrop-blur-md shadow-lg shadow-purple-900/20 mb-2">
          <Sparkles size={13} className="text-amber-400 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">
            L&apos;Arène Suprême
          </span>
          <Sparkles size={13} className="text-purple-400 animate-pulse" />
        </div>
      </div>

      {/* Center 3D Space - Interactive Notice */}
      <div className="relative z-10 pointer-events-none flex flex-col items-center text-center px-4">
        {/* Glow ambient bloom */}
        <div className="w-56 h-56 rounded-full bg-purple-600/20 blur-3xl absolute -z-10 animate-pulse-subtle" />

        {/* Big Luxury Title below the 3D model */}
        <div className="mt-48 sm:mt-56 flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl font-black tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-purple-200 drop-shadow-[0_4px_18px_rgba(139,92,246,0.5)]">
            DIX-NEUF
          </h1>
          <p className="text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-purple-300/80 mt-1">
            Jeux · Défis · Performances
          </p>
        </div>
      </div>

      {/* Bottom CTA to Enter the App */}
      <div className="relative z-10 pb-12 px-6 w-full max-w-sm flex flex-col items-center gap-3 animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-300">
        <button
          type="button"
          onClick={handleEnter}
          className="group relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#7C3AED] via-[#6B38FB] to-[#A855F7] text-white font-black text-sm tracking-widest uppercase shadow-[0_0_30px_rgba(124,58,237,0.5)] hover:shadow-[0_0_40px_rgba(124,58,237,0.8)] active:scale-95 transition-all flex items-center justify-center gap-2 overflow-hidden"
        >
          {/* Shimmer light pass */}
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <Play size={16} fill="currentColor" />
          <span>Entrer dans 19</span>
          <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>

        <span className="text-[9.5px] font-semibold text-slate-400 tracking-wider">
          Touchez ou bougez l&apos;écran pour explorer en 3D
        </span>
      </div>
    </div>
  )
}
