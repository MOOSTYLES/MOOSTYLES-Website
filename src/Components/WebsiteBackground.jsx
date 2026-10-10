import React, { useEffect, useRef } from 'react';

export const WebsiteBackground = ({
  backgroundColor = '#FFFFFF',
  squareSize = 40,
  lineThickness = 1,
  lineColor = 'rgba(0, 0, 0, 0.12)',

  glowColor = '#a8fff2',
  glowSize = 400,

  followSpeed = 0.08,
}) => {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const currentPosRef = useRef({ x: -1000, y: -1000 });
  const animationFrameRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const handleMouseMove = (e) => {
      mouseRef.current = {
        x: e.clientX,
        y: e.clientY,
      };
    };
    window.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      currentPosRef.current.x += (mouseRef.current.x - currentPosRef.current.x) * followSpeed;
      currentPosRef.current.y += (mouseRef.current.y - currentPosRef.current.y) * followSpeed;

      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = lineColor;
      ctx.lineWidth = lineThickness;

      for (let x = -squareSize; x < canvas.width + squareSize; x += squareSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }

      for (let y = 0; y < canvas.height; y += squareSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      const glowRadius = glowSize * 0.6;

      for (let x = -squareSize; x < canvas.width + squareSize; x += squareSize) {
        ctx.beginPath();
        let isInGlow = false;
        let segmentStart = null;

        for (let y = 0; y < canvas.height; y += 2) {
          const dx = x - currentPosRef.current.x;
          const dy = y - currentPosRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < glowRadius) {
            if (!isInGlow) {
              segmentStart = y;
              isInGlow = true;
            }
          } else if (isInGlow) {
            const gradient = ctx.createRadialGradient(
              currentPosRef.current.x,
              currentPosRef.current.y,
              0,
              currentPosRef.current.x,
              currentPosRef.current.y,
              glowRadius
            );
            gradient.addColorStop(0, glowColor);
            gradient.addColorStop(0.3, glowColor + 'dd');
            gradient.addColorStop(0.6, glowColor + '88');
            gradient.addColorStop(0.8, glowColor + '33');
            gradient.addColorStop(1, glowColor + '00');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = lineThickness * 1.5;
            ctx.shadowBlur = 15;
            ctx.shadowColor = glowColor;
            ctx.globalAlpha = 0.8;
            ctx.moveTo(x, segmentStart);
            ctx.lineTo(x, y);
            ctx.stroke();
            isInGlow = false;
          }
        }

        if (isInGlow) {
          const gradient = ctx.createRadialGradient(
            currentPosRef.current.x,
            currentPosRef.current.y,
            0,
            currentPosRef.current.x,
            currentPosRef.current.y,
            glowRadius
          );
          gradient.addColorStop(0, glowColor);
          gradient.addColorStop(0.3, glowColor + 'dd');
          gradient.addColorStop(0.6, glowColor + '88');
          gradient.addColorStop(0.8, glowColor + '33');
          gradient.addColorStop(1, glowColor + '00');

          ctx.strokeStyle = gradient;
          ctx.lineWidth = lineThickness * 1.5;
          ctx.shadowBlur = 15;
          ctx.shadowColor = glowColor;
          ctx.globalAlpha = 0.8;
          ctx.moveTo(x, segmentStart);
          ctx.lineTo(x, canvas.height);
          ctx.stroke();
        }
      }

      for (let y = 0; y < canvas.height; y += squareSize) {
        ctx.beginPath();
        let isInGlow = false;
        let segmentStart = null;

        for (let x = 0; x < canvas.width; x += 2) {
          const dx = x - currentPosRef.current.x;
          const dy = y - currentPosRef.current.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < glowRadius) {
            if (!isInGlow) {
              segmentStart = x;
              isInGlow = true;
            }
          } else if (isInGlow) {
            const gradient = ctx.createRadialGradient(
              currentPosRef.current.x,
              currentPosRef.current.y,
              0,
              currentPosRef.current.x,
              currentPosRef.current.y,
              glowRadius
            );
            gradient.addColorStop(0, glowColor);
            gradient.addColorStop(0.5, glowColor + '99');
            gradient.addColorStop(1, glowColor + '00');

            ctx.strokeStyle = gradient;
            ctx.lineWidth = lineThickness * 1.5;
            ctx.shadowBlur = 15;
            ctx.shadowColor = glowColor;
            ctx.globalAlpha = 0.8;
            ctx.moveTo(segmentStart, y);
            ctx.lineTo(x, y);
            ctx.stroke();
            isInGlow = false;
          }
        }

        if (isInGlow) {
          const gradient = ctx.createRadialGradient(
            currentPosRef.current.x,
            currentPosRef.current.y,
            0,
            currentPosRef.current.x,
            currentPosRef.current.y,
            glowRadius
          );
          gradient.addColorStop(0, glowColor);
          gradient.addColorStop(0.5, glowColor + '99');
          gradient.addColorStop(1, glowColor + '00');

          ctx.strokeStyle = gradient;
          ctx.lineWidth = lineThickness * 1.5;
          ctx.shadowBlur = 15;
          ctx.shadowColor = glowColor;
          ctx.globalAlpha = 0.8;
          ctx.moveTo(segmentStart, y);
          ctx.lineTo(canvas.width, y);
          ctx.stroke();
        }
      }

      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    backgroundColor,
    squareSize,
    lineThickness,
    lineColor,
    glowColor,
    glowSize,
    followSpeed,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className="glowing-grid-background"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        opacity: 0.4,
        zIndex: -10,
        pointerEvents: 'none',
      }}
    />
  );
};
