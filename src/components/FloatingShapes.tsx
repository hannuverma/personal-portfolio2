import { useEffect, useRef } from "react";

interface Node3D {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  radius: number;
  color: string;
}

interface Ripple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  alpha: number;
}

export default function FloatingShapes() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, active: false });
  const ripplesRef = useRef<Ripple[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let dpr = window.devicePixelRatio || 1;
    let width = canvas.offsetWidth;
    let height = canvas.offsetHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;

    const nodes3D: Node3D[] = [];
    const colors = [
      "rgba(251, 146, 60, 0.75)",  // Bright orange
      "rgba(249, 115, 22, 0.75)",  // Orange
      "rgba(34, 197, 94, 0.65)"    // Green
    ];

    // Generate balanced 3D nodes (spread in a cubic volume)
    const particleCount = Math.min(65, Math.floor((width * height) / 24000));
    for (let i = 0; i < particleCount; i++) {
      nodes3D.push({
        x: (Math.random() - 0.5) * 600,
        y: (Math.random() - 0.5) * 600,
        z: (Math.random() - 0.5) * 600,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        vz: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 1.5 + 1.2,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    // 3D Grid points for a background mesh
    const gridRows = 6;
    const gridCols = 6;
    const gridDepth = 3;
    const gridPoints: { x: number; y: number; z: number }[] = [];
    for (let d = 0; d < gridDepth; d++) {
      const z = (d / (gridDepth - 1) - 0.5) * 400;
      for (let r = 0; r < gridRows; r++) {
        const y = (r / (gridRows - 1) - 0.5) * 500;
        for (let c = 0; c < gridCols; c++) {
          const x = (c / (gridCols - 1) - 0.5) * 500;
          gridPoints.push({ x, y, z });
        }
      }
    }

    // Rotational velocities
    let angleX = 0.001;
    let angleY = 0.0012;
    let angleZ = 0.0006;

    const fov = 380; // Field of View (distance descriptor)

    const handleResize = () => {
      if (!canvas) return;
      dpr = window.devicePixelRatio || 1;
      width = canvas.offsetWidth;
      height = canvas.offsetHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const currentX = e.clientX - rect.left;
      const currentY = e.clientY - rect.top;
      mouseRef.current.targetX = currentX;
      mouseRef.current.targetY = currentY;
      mouseRef.current.active = true;

      // Slowly mutate rotational vectors as cursor shifts coordinates
      const factorX = (currentX - width / 2) / (width / 2);
      const factorY = (currentY - height / 2) / (height / 2);
      angleZ = factorX * 0.002;
      angleY = factorY * 0.002;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    // Clicking spawns interactive sci-fi wave rings on the canvas
    const handleCanvasClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickY = e.clientY - rect.top;
      
      ripplesRef.current.push({
        x: clickX,
        y: clickY,
        radius: 0,
        maxRadius: 220,
        speed: 4.5,
        alpha: 0.95
      });
    };

    window.addEventListener("resize", handleResize, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    canvas.addEventListener("click", handleCanvasClick, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    const draw = () => {
      // Scale all drawing operations on high-DPI displays
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Dark space fluid decay backdrop clearing (creates soft organic trace elements)
      ctx.fillStyle = "rgba(2, 2, 2, 0.15)";
      ctx.fillRect(0, 0, width, height);

      const centerX = width * 0.72; // Focus center visual on center-right
      const centerY = height * 0.46;

      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.1;
      mouse.y += (mouse.targetY - mouse.y) * 0.1;

      // Increment rotation values slightly
      angleX += 0.0008;
      angleY += 0.0005;

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);
      const cosZ = Math.cos(angleZ);
      const sinZ = Math.sin(angleZ);

      // --- Draw 3D Sci-fi Grid Matrix background ---
      ctx.lineWidth = 0.5;
      gridPoints.forEach((point, idx) => {
        // Apply 3D Rotation
        // Rotate X
        let y1 = point.y * cosX - point.z * sinX;
        let z1 = point.y * sinX + point.z * cosX;
        // Rotate Y
        let x2 = point.x * cosY - z1 * sinY;
        let z2 = point.x * sinY + z1 * cosY;

        // Project coordinate
        const scaleFactor = fov / (fov + z2 + 300);
        const projX = centerX + x2 * scaleFactor;
        const projY = centerY + y1 * scaleFactor;

        // Render point
        if (projX >= 0 && projX <= width && projY >= 0 && projY <= height) {
          const depthAlpha = Math.max(0.01, Math.min(0.05, (1 - (z2 + 200) / 400) * 0.05));
          ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha})`;
          ctx.beginPath();
          ctx.arc(projX, projY, 1, 0, Math.PI * 2);
          ctx.fill();

          // Connect every grid point to its neighboring cells for a vector-grid layer
          if (idx % gridCols !== gridCols - 1) { // Connect to next column
            const nextPt = gridPoints[idx + 1];
            let ny1 = nextPt.y * cosX - nextPt.z * sinX;
            let nz1 = nextPt.y * sinX + nextPt.z * cosX;
            let nx2 = nextPt.x * cosY - nz1 * sinY;
            let nz2 = nextPt.x * sinY + nz1 * cosY;
            const nScale = fov / (fov + nz2 + 300);
            const nProjX = centerX + nx2 * nScale;
            const nProjY = centerY + ny1 * nScale;
            
            ctx.strokeStyle = `rgba(34, 197, 94, ${depthAlpha * 0.55})`; // Green tint grid connections
            ctx.beginPath();
            ctx.moveTo(projX, projY);
            ctx.lineTo(nProjX, nProjY);
            ctx.stroke();
          }
        }
      });

      // --- Draw Interactive Click Ripples (2D UI Intersections) ---
      ripplesRef.current.forEach((rip, idx) => {
        rip.radius += rip.speed;
        rip.alpha -= 0.018;

        if (rip.alpha <= 0) {
          ripplesRef.current.splice(idx, 1);
          return;
        }

        ctx.strokeStyle = `rgba(249, 115, 22, ${rip.alpha * 0.25})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.radius, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = `rgba(249, 115, 22, ${rip.alpha * 0.12})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, Math.max(0, rip.radius - 12), 0, Math.PI * 2);
        ctx.stroke();
      });

      // --- Draw Orbiting 3D Vector Cage System ---
      const orbitPointsCount = 28;
      const radiusOuter = 210;
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(249, 115, 22, 0.15)";
      
      // Outer Orbiting Toroid Ring trace
      ctx.beginPath();
      for (let i = 0; i <= orbitPointsCount; i++) {
        const phi = (i / orbitPointsCount) * Math.PI * 2 + angleX * 0.5;
        const x3d = Math.cos(phi) * radiusOuter;
        const y3d = Math.sin(phi) * radiusOuter;
        const z3d = Math.sin(phi * 2.5) * 80;

        let y1 = y3d * cosX - z3d * sinX;
        let z1 = y3d * sinX + z3d * cosX;
        let x2 = x3d * cosY - z1 * sinY;
        let z2 = x3d * sinY + z1 * cosY;

        const scaleScale = fov / (fov + z2 + 100);
        const drawPx = centerX + x2 * scaleScale;
        const drawPy = centerY + y1 * scaleScale;

        if (i === 0) ctx.moveTo(drawPx, drawPy);
        else ctx.lineTo(drawPx, drawPy);
      }
      ctx.stroke();

      // --- Project and Draw 3D Nodes Constellation ---
      const projectCoords = nodes3D.map((node) => {
        // Apply physics velocities
        node.x += node.vx;
        node.y += node.vy;
        node.z += node.vz;

        // Inward pull (gravity center) to keep them in volume boundaries
        const rSq = node.x * node.x + node.y * node.y + node.z * node.z;
        if (rSq > 280 * 280) {
          node.vx -= (node.x * 0.00005);
          node.vy -= (node.y * 0.00005);
          node.vz -= (node.z * 0.00005);
        }

        // Apply interactive mouse tracking (Attractor grid deflection)
        if (mouse.active && mouse.x > 0 && mouse.y > 0) {
          // Approximate projected flat coordinates first
          const tempScale = fov / (fov + node.z);
          const flatNodeX = centerX + node.x * tempScale;
          const flatNodeY = centerY + node.y * tempScale;

          const dx = mouse.x - flatNodeX;
          const dy = mouse.y - flatNodeY;
          const distSquare = dx * dx + dy * dy;
          const dist = Math.sqrt(distSquare);
          if (dist < 185) {
            // Apply physics deflection force
            const force = (185 - dist) * 0.045;
            node.vx += (dx / dist) * force * 0.055;
            node.vy += (dy / dist) * force * 0.055;
          }
        }

        // Apply Multi-axis rotation based on current frames
        // Y-axis rotation
        let x1 = node.x * cosY - node.z * sinY;
        let z1 = node.x * sinY + node.z * cosY;
        // X-axis rotation
        let y2 = node.y * cosX - z1 * sinX;
        let z2 = node.y * sinX + z1 * cosX;
        // Z-axis rotation
        let rx = x1 * cosZ - y2 * sinZ;
        let ry = x1 * sinZ + y2 * cosZ;

        // Perspective Projection scale factor
        const scaleTerm = fov / (fov + z2 + 80);
        const projectedX = centerX + rx * scaleTerm;
        const projectedY = centerY + ry * scaleTerm;
        
        return {
          projectedX,
          projectedY,
          z2, // Store raw Z position for depth calculation and sorting
          node
        };
      });

      // Quick depth sort (draw back nodes first, then connections, then front nodes for correct 3D overlapping)
      projectCoords.sort((a, b) => b.z2 - a.z2);

      // Render link vectors in 3D perspective
      projectCoords.forEach((pA, indexA) => {
        const pxA = pA.projectedX;
        const pyA = pA.projectedY;

        // Boundary safety check
        if (pxA < 0 || pxA > width || pyA < 0 || pyA > height) return;

        // Link node targets
        for (let j = indexA + 1; j < projectCoords.length; j++) {
          const pB = projectCoords[j];
          const pxB = pB.projectedX;
          const pyB = pB.projectedY;

          // 3D Distance check
          const dx3d = pA.node.x - pB.node.x;
          const dy3d = pA.node.y - pB.node.y;
          const dz3d = pA.node.z - pB.node.z;
          const dist3D = Math.sqrt(dx3d * dx3d + dy3d * dy3d + dz3d * dz3d);

          if (dist3D < 110) {
            const opacity = Math.min(0.24, (110 - dist3D) / 110 * 0.22);
            ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
            ctx.lineWidth = 0.45;
            ctx.beginPath();
            ctx.moveTo(pxA, pyA);
            ctx.lineTo(pxB, pyB);
            ctx.stroke();
          }
        }

        // Draw individual nodes with size relative to projected scale
        const renderScale = fov / (fov + pA.z2 + 80);
        const visualRadius = Math.max(0.6, pA.node.radius * renderScale);
        
        ctx.fillStyle = pA.node.color;
        ctx.beginPath();
        ctx.arc(pxA, pyA, visualRadius, 0, Math.PI * 2);
        ctx.fill();

        // Extra dynamic halo tracking for major focus points close to viewer
        if (pA.z2 < -150) {
          ctx.strokeStyle = pA.node.color.replace("0.6", "0.15").replace("0.75", "0.22");
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.arc(pxA, pyA, visualRadius * 3.5, 0, Math.PI * 2);
          ctx.stroke();
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("click", handleCanvasClick);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-auto z-0 cursor-crosshair"
      style={{ opacity: 0.8 }}
    />
  );
}
