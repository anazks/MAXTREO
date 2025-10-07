import React, { useEffect } from "react";
import Grid2Background from "https://cdn.jsdelivr.net/npm/threejs-components@0.0.17/build/backgrounds/grid2.cdn.min.js";
import "./style.css";

const CylinderGrid = () => {
    useEffect(() => {
        // Initialize the background grid
        const canvas = document.getElementById("webgl-canvas");
        const bg = Grid2Background(canvas);
    
        // Add click event listener to change colors and intensities
        const handleClick = () => {
          bg.grid.setColors([
            0xffffff * Math.random(),
            0xffffff * Math.random(),
            0xffffff * Math.random(),
          ]);
          bg.grid.light1.color.set(0xffffff * Math.random());
          bg.grid.light1.intensity = 500 + Math.random() * 1000;
          bg.grid.light2.color.set(0xffffff * Math.random());
          bg.grid.light2.intensity = 270 + Math.random() * 250;
        };
    
        document.body.addEventListener("click", handleClick);
    
        return () => {
          // Cleanup the event listener when the component is unmounted
          document.body.removeEventListener("click", handleClick);
        };
      }, []);
  useEffect(() => {
    // Initialize the background grid
    const canvas = document.getElementById("webgl-canvas");
    const bg = Grid2Background(canvas);

    // Add click event listener to change colors and intensities
    const handleClick = () => {
      bg.grid.setColors([
        0xffffff * Math.random(),
        0xffffff * Math.random(),
        0xffffff * Math.random(),
      ]);
      bg.grid.light1.color.set(0xffffff * Math.random());
      bg.grid.light1.intensity = 500 + Math.random() * 1000;
      bg.grid.light2.color.set(0xffffff * Math.random());
      bg.grid.light2.intensity = 270 + Math.random() * 250;
    };

    document.body.addEventListener("click", handleClick);

    return () => {
      // Cleanup the event listener when the component is unmounted
      document.body.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div id="apps">
      <canvas id="webgl-canvas"></canvas>
      <div className="hero">
    
      </div>
    </div>
  );
};

export default CylinderGrid;
