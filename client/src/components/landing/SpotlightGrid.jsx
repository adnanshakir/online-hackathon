import { useRef, useCallback } from 'react';

export function SpotlightGrid({ children, className = '' }) {
  const containerRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const cards = containerRef.current?.querySelectorAll('.spotlight-card');
    if (!cards) return;
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--spotlight-x', `${e.clientX - rect.left}px`);
      card.style.setProperty('--spotlight-y', `${e.clientY - rect.top}px`);
    });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className={className}
    >
      {children}
    </div>
  );
}
