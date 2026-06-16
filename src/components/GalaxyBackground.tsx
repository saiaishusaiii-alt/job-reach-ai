import { useEffect, useRef } from 'react';

const GalaxyBackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Generate stars
    interface Star {
      x: number;
      y: number;
      radius: number;
      opacity: number;
      phase: number;
      isBright: boolean;
    }

    const stars: Star[] = [];
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.2,
        phase: Math.random() * Math.PI * 2,
        isBright: i < 20,
      });
    }

    // Floating particles
    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
    }

    const particles: Particle[] = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.1,
        vy: (Math.random() - 0.5) * 0.1,
        radius: Math.random() * 1 + 0.5,
        color: i % 2 === 0 ? 'rgba(139, 92, 246, 0.4)' : 'rgba(6, 182, 212, 0.3)',
      });
    }

    // Shooting stars
    interface ShootingStar {
      x: number;
      y: number;
      vx: number;
      vy: number;
      length: number;
      opacity: number;
    }

    let shootingStars: ShootingStar[] = [];
    let shootingStarTimer = Math.random() * 5000 + 4000;

    // Animation loop
    let animationFrameId: number;
    let frameCount = 0;

    const animate = () => {
      frameCount++;

      // Clear canvas
      ctx.fillStyle = '#04050f';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw nebula glows
      const nebulas = [
        {
          x: canvas.width * 0.2,
          y: canvas.height * 0.3,
          r: 300,
          color: 'rgba(124, 58, 237, 0.06)',
        },
        {
          x: canvas.width * 0.8,
          y: canvas.height * 0.6,
          r: 250,
          color: 'rgba(6, 182, 212, 0.05)',
        },
        {
          x: canvas.width * 0.5,
          y: canvas.height * 0.8,
          r: 200,
          color: 'rgba(236, 72, 153, 0.04)',
        },
      ];

      nebulas.forEach((nebula) => {
        const gradient = ctx.createRadialGradient(nebula.x, nebula.y, 0, nebula.x, nebula.y, nebula.r);
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(
          nebula.x - nebula.r,
          nebula.y - nebula.r,
          nebula.r * 2,
          nebula.r * 2
        );
      });

      // Draw stars
      stars.forEach((star) => {
        const pulseOpacity = star.opacity + Math.sin(frameCount * 0.01 + star.phase) * 0.3;
        ctx.fillStyle = `rgba(255, 255, 255, ${pulseOpacity})`;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw and update particles
      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;

        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw particle connections
      particles.forEach((p1, i) => {
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < 80) {
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 * (1 - distance / 80)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      // Draw and update shooting stars
      shootingStars = shootingStars.filter((star) => {
        star.x += star.vx;
        star.y += star.vy;
        star.opacity -= 0.01;

        const gradient = ctx.createLinearGradient(
          star.x,
          star.y,
          star.x - star.vx * star.length,
          star.y - star.vy * star.length
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(star.x, star.y);
        ctx.lineTo(star.x - star.vx * star.length, star.y - star.vy * star.length);
        ctx.stroke();

        return star.opacity > 0;
      });

      // Create new shooting star
      shootingStarTimer -= 16; // Approximate 60fps
      if (shootingStarTimer <= 0) {
        const startX = Math.random() * canvas.width * 0.3;
        const startY = Math.random() * canvas.height * 0.3;
        shootingStars.push({
          x: startX,
          y: startY,
          vx: (Math.random() + 1) * 2,
          vy: (Math.random() + 1) * 2,
          length: 80,
          opacity: 1,
        });
        shootingStarTimer = Math.random() * 5000 + 4000;
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: '#04050f' }}
    />
  );
};

export default GalaxyBackground;
