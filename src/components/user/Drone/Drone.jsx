import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import DroneModal from '../../../Images/3d/drone.glb';
import './Drone.css';

function Drone() {
  const containerRef = useRef(null);
  const animationRef = useRef(null);
  const modelRef = useRef(null);
  const propellersRef = useRef([]);
  
  useEffect(() => {
    // Scene setup
    const scene = new THREE.Scene();
    
    // Camera setup - adjusted for better viewing angle
    const camera = new THREE.PerspectiveCamera(65, 1, 0.1, 1000);
    camera.position.z = 12;
    camera.position.y = 4;
    camera.position.x = 2; // Slight side angle for better 3D effect
    camera.lookAt(0, 0, 0);
    
    // Renderer setup with improved quality
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(500, 500);
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Add renderer to DOM
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }
    
    // Enhanced lighting setup for more dramatic effect
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Main directional light (sun-like)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    scene.add(directionalLight);
    
    // Front fill light for detail
    const frontLight = new THREE.PointLight(0x7ec8ff, 0.8);
    frontLight.position.set(0, 2, -5);
    scene.add(frontLight);
    
    // Bottom light for the "glow" effect when drone is up
    const bottomLight = new THREE.PointLight(0x00c6ff, 0.9);
    bottomLight.position.set(0, -3, 0);
    scene.add(bottomLight);
    
    // Create a placeholder while model loads
    const placeholderGeometry = new THREE.BoxGeometry(2, 0.4, 2);
    const placeholderMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const placeholder = new THREE.Mesh(placeholderGeometry, placeholderMaterial);
    scene.add(placeholder);
    modelRef.current = placeholder;
    
    // Function to load a GLTF/GLB model with enhanced handling
    const loadGLTFModel = (url) => {
      if (modelRef.current) {
        scene.remove(modelRef.current);
      }
      
      import('three/examples/jsm/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
        const loader = new GLTFLoader();
        
        loader.load(
          url,
          function(gltf) {
            modelRef.current = gltf.scene;
            
            // Scale model appropriate to view
            gltf.scene.scale.set(10, 9.5, 10);
            
            // Store references to propeller parts for animation
            propellersRef.current = [];
            
            // Enable shadows and identify propellers/parts to animate
            gltf.scene.traverse(function(node) {
              if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                
                // If this is a propeller or special part (identify by name or position)
                if (node.name.includes('propeller') || 
                    node.name.includes('rotor') || 
                    node.name.includes('blade') ||
                    (node.position.y > 0.5 && (node.geometry.type === 'CylinderGeometry' || 
                                              node.geometry.type === 'CircleGeometry'))) {
                  propellersRef.current.push(node);
                  
                  // Make propellers slightly transparent
                  if (node.material) {
                    node.material = node.material.clone(); // Clone to avoid affecting other meshes
                    node.material.transparent = true;
                    node.material.opacity = 0.85;
                  }
                }
                
                // Add subtle environmental reflections to the drone body
                if (node.material && !node.name.includes('glass')) {
                  node.material = node.material.clone();
                  node.material.envMapIntensity = 0.8;
                  node.material.roughness = 0.5;
                  node.material.metalness = 0.7;
                }
                
                // Add glow to any LED-like parts
                if (node.name.includes('light') || node.name.includes('led') || node.name.includes('indicator')) {
                  node.material = new THREE.MeshStandardMaterial({
                    emissive: 0x00aaff,
                    emissiveIntensity: 1
                  });
                }
              }
            });
            
            // Add model to scene
            scene.add(gltf.scene);
            
            // If no propellers were identified, create some visual effects
            if (propellersRef.current.length === 0) {
              createVisualEffects(gltf.scene);
            }
          },
          function(xhr) {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
          },
          function(error) {
            console.error('An error happened while loading the model:', error);
          }
        );
      });
    };
    
    // Create visual effects for propellers if not found in model
    const createVisualEffects = (model) => {
      // Create simple propeller effect discs at the likely propeller positions
      const propellerPositions = [
        new THREE.Vector3(1, 0.2, 1),
        new THREE.Vector3(-1, 0.2, 1),
        new THREE.Vector3(1, 0.2, -1),
        new THREE.Vector3(-1, 0.2, -1)
      ];
      
      propellerPositions.forEach(position => {
        const geometry = new THREE.CircleGeometry(0.8, 32);
        const material = new THREE.MeshBasicMaterial({ 
          color: 0xcccccc,
          transparent: true,
          opacity: 0.7,
          side: THREE.DoubleSide
        });
        
        const propeller = new THREE.Mesh(geometry, material);
        propeller.position.set(position.x, position.y, position.z);
        propeller.rotation.x = -Math.PI / 2; // Flat horizontal
        
        model.add(propeller);
        propellersRef.current.push(propeller);
      });
    };
    
    // Load the drone model
    loadGLTFModel(DroneModal);
    
    // Enhanced animation function with wave-like movement
    const animate = () => {
      const time = Date.now() * 0.0006; // Slow, smooth movement
      
      // Wave-like hovering motion
      const yOffset = Math.sin(time) * 0.5; // Vertical movement
      const xOffset = Math.sin(time * 0.7) * 0.2; // Slight horizontal drift
      const zOffset = Math.cos(time * 0.5) * 0.2; // Forward/backward drift
      
      // Apply animation to model
      if (modelRef.current) {
        // Position with wave-like movement
        modelRef.current.position.y = yOffset;
        modelRef.current.position.x = xOffset;
        modelRef.current.position.z = zOffset;
        
        // Subtle tilting in the direction of movement
        const tiltX = Math.sin(time * 0.5) * 0.1;
        console.log(tiltX)

        const tiltZ = Math.cos(time * 0.3) * 0.1;
        console.log(tiltZ)
        modelRef.current.rotation.x = -zOffset * 0.3; // Tilt forward/backward with movement
        modelRef.current.rotation.z = -xOffset * 0.3; // Tilt sideways with movement
        modelRef.current.rotation.y = time * 0.1; // Slow continuous rotation
        
        // Animate propellers and special parts
        propellersRef.current.forEach((propeller, index) => {
          if (propeller) {
            // Rotate propellers rapidly
            propeller.rotation.y += 0.3;
            
            // Make propellers more/less visible based on height
            // When drone is lower, propellers appear to spin faster but become less visible
            if (propeller.material && propeller.material.opacity !== undefined) {
              // Base opacity varies with height - more visible when higher
              const baseOpacity = 0.6 + (yOffset + 0.5) * 0.4; // 0.6-1.0 opacity range
              
              // Fluctuate opacity rapidly for propeller blur effect
              const flickerAmount = yOffset < -0.1 ? 0.4 : 0.2; // More fluctuation when lower
              const flicker = (Math.sin(Date.now() * 0.01 * (index + 1)) * 0.5 + 0.5) * flickerAmount;
              
              propeller.material.opacity = Math.max(0.1, Math.min(0.9, baseOpacity - flicker));
            }
          }
        });
      }
      
      // Update bottom light intensity based on height
      // Brighter when drone is higher up
      if (bottomLight) {
        bottomLight.intensity = 0.5 + (yOffset + 0.5) * 0.8; // 0.5-1.3 intensity range
      }
      
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    
    animate();
    
    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);
  
  return (
    <div className="relative w-full h-screen">
      <div 
        ref={containerRef}
        className="drone-container"
      >
        <div className="drone-environment"></div>
      </div>
    </div>
  );
}

export default Drone;