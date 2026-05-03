import React, { useEffect, useRef } from 'react';

export default function InteractiveGrid({ cellSize = 48 }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const container = canvas.parentElement;
    if (!container) return;

    const ctx = canvas.getContext('2d');

    // tuneable constants
    const CELL = cellSize;
    const GLOW_DURATION = 2200;
    const FADE_DURATION = 1800;

    let cols,
      rows,
      cells = [];
    let animationFrameId;

    function resize() {
      canvas.width = container.offsetWidth;
      canvas.height = container.offsetHeight;
      cols = Math.ceil(canvas.width / CELL) + 1;
      rows = Math.ceil(canvas.height / CELL) + 1;

      const prev = {};
      for (const c of cells) prev[c.key] = c;
      cells = [];

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const key = `${r}_${c}`;
          cells.push(
            prev[key] || {
              key,
              x: c * CELL,
              y: r * CELL,
              litAt: null,
            }
          );
        }
      }
    }

    function getCell(px, py) {
      const c = Math.floor(px / CELL);
      const r = Math.floor(py / CELL);
      if (c < 0 || r < 0 || c >= cols || r >= rows) return null;
      return cells[r * cols + c] || null;
    }

    function light(px, py) {
      const cell = getCell(px, py);
      if (cell) cell.litAt = performance.now();
    }

    let lastMx = -1,
      lastMy = -1;
    function onMove(px, py) {
      if (Math.abs(px - lastMx) < 2 && Math.abs(py - lastMy) < 2) return;
      lastMx = px;
      lastMy = py;
      light(px, py);
    }

    let viewportX = -1,
      viewportY = -1;

    const handleMouseMove = (e) => {
      viewportX = e.clientX;
      viewportY = e.clientY;
    };

    const handleTouchMove = (e) => {
      viewportX = e.touches?.[0]?.clientX ?? -1;
      viewportY = e.touches?.[0]?.clientY ?? -1;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('resize', resize);

    function easeOut(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    let sweepT = 0;
    function draw() {
      const now = performance.now();

      // Interaction tracking
      const r = canvas.getBoundingClientRect();
      const isVisible = r.top < window.innerHeight && r.bottom > 0;

      if (isVisible) {
        if (viewportX !== -1) {
          // highlight under cursor
          onMove(viewportX - r.left, viewportY - r.top);
        } else {
          // auto-sweep if mouse never moved
          sweepT += 0.01;
          const sx = (Math.sin(sweepT) * 0.5 + 0.5) * canvas.width;
          const sy = (Math.cos(sweepT * 0.7) * 0.5 + 0.5) * canvas.height;
          light(sx, sy);
        }

        // ambient glimmers (increased frequency)
        if (Math.random() < 0.08) {
          const rc = Math.floor(Math.random() * cells.length);
          if (cells[rc] && !cells[rc].litAt) {
            cells[rc].litAt = now;
          }
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const cell of cells) {
        if (cell.litAt === null) continue;

        const elapsed = now - cell.litAt;
        let brightness;

        if (elapsed < GLOW_DURATION) {
          const t = elapsed / GLOW_DURATION;
          brightness = t < 0.08 ? easeOut(t / 0.08) : 1;
        } else {
          const fadeT = (elapsed - GLOW_DURATION) / FADE_DURATION;
          if (fadeT >= 1) {
            cell.litAt = null;
            continue;
          }
          brightness = 1 - easeOut(fadeT);
        }

        const alpha = brightness * 0.6;
        const green = Math.floor(brightness * 90 + 20);

        ctx.fillStyle = `rgba(10, ${green}, 35, ${alpha})`;
        ctx.strokeStyle = `rgba(74, 222, 128, ${brightness * 0.75})`;
        ctx.lineWidth = 0.5;

        ctx.beginPath();
        ctx.rect(cell.x + 0.5, cell.y + 0.5, CELL - 1, CELL - 1);
        ctx.fill();
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(draw);
    }

    resize();
    draw();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [cellSize]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full"
    />
  );
}
