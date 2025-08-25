import React, { useState, useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { VFX } from '@vfx-js/core';
import { EmotionLog } from '../../types/emotion-log';

// Register GSAP plugin
gsap.registerPlugin(Draggable);

// Simple emoji mappings
const EMOJIS = {
  topRight: ['😄', '🤩', '😆', '🥳', '😁'],
  topLeft: ['😤', '😠', '🤬', '😡', '😣'],
  bottomLeft: ['😢', '😞', '😔', '😿', '😭'],
  bottomRight: ['😌', '😊', '🙂', '😇', '☺️'],
  center: ['😐', '🤔', '😶']
};

interface EmojiGridMapperProps {
  onEmojiSelect?: (data: EmotionLog) => void;
  onGridChange?: (grid: any) => void;
}

const EmojiGridMapper: React.FC<EmojiGridMapperProps> = ({ onEmojiSelect }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 400, height: 400 });

  const containerRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const circleRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const vfxRef = useRef<VFX | null>(null);
  const selectRef = useRef<EmojiGridMapperProps['onEmojiSelect']>(onEmojiSelect);

  useEffect(() => {
    selectRef.current = onEmojiSelect;
  }, [onEmojiSelect]);

  const lastPositionRef = useRef({ x: 0, y: 0 });


  // Get emoji based on position
  const getEmoji = useCallback((x: number, y: number) => {
    const distance = Math.sqrt(x * x + y * y);
    const index = Math.floor(distance * 4) % 5;
    
    if (Math.abs(x) < 0.2 && Math.abs(y) < 0.2) {
      return EMOJIS.center[index % 3] || '😐';
    }
    
    if (x > 0 && y > 0) return EMOJIS.topRight[index] || '😄';
    if (x < 0 && y > 0) return EMOJIS.topLeft[index] || '😠';
    if (x < 0 && y < 0) return EMOJIS.bottomLeft[index] || '😢';
    if (x > 0 && y < 0) return EMOJIS.bottomRight[index] || '😌';
    
    return '😐';
  }, []);

  // Get emotion label based on position
  const getEmotionLabel = useCallback((x: number, y: number) => {
    if (Math.abs(x) < 0.15 && Math.abs(y) < 0.15) {
      return 'Neutral';
    }
    
    const absX = Math.abs(x);
    const absY = Math.abs(y);
    
    if (x < 0 && y > 0) {
      // Top-left: Angry/Frustrated
      if (absX > absY) return absX > 0.7 ? 'Furious' : absX > 0.4 ? 'Angry' : 'Annoyed';
      return absY > 0.7 ? 'Enraged' : absY > 0.4 ? 'Frustrated' : 'Irritated';
    } else if (x > 0 && y > 0) {
      // Top-right: Happy/Excited
      if (absX > absY) return absX > 0.7 ? 'Ecstatic' : absX > 0.4 ? 'Joyful' : 'Happy';
      return absY > 0.7 ? 'Euphoric' : absY > 0.4 ? 'Excited' : 'Cheerful';
    } else if (x < 0 && y < 0) {
      // Bottom-left: Sad/Depressed
      if (absX > absY) return absX > 0.7 ? 'Devastated' : absX > 0.4 ? 'Sad' : 'Melancholy';
      return absY > 0.7 ? 'Despairing' : absY > 0.4 ? 'Dejected' : 'Gloomy';
    } else {
      // Bottom-right: Calm/Peaceful
      if (absX > absY) return absX > 0.7 ? 'Blissful' : absX > 0.4 ? 'Content' : 'Pleased';
      return absY > 0.7 ? 'Serene' : absY > 0.4 ? 'Relaxed' : 'Calm';
    }
  }, []);

  // Initialize VFX
  useEffect(() => {
    if (!vfxRef.current) {
      vfxRef.current = new VFX();
    }

    return () => {
      if (vfxRef.current) {
        // Clean up VFX instance
        vfxRef.current = null;
      }
    };
  }, []);

  // Update container size with ResizeObserver for responsive panel changes
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current?.parentElement) {
        const parent = containerRef.current.parentElement;
        const rect = parent.getBoundingClientRect();
        const size = Math.min(rect.width - 60, rect.height - 100); // Leave padding for UI elements
        const clampedSize = Math.max(200, Math.min(size, 600)); // Min 200px, max 600px
        setContainerSize({ width: clampedSize, height: clampedSize });
      }
    };

    updateSize();

    // Use ResizeObserver to watch for panel size changes
    const resizeObserver = new ResizeObserver(() => {
      updateSize();
    });

    if (containerRef.current?.parentElement) {
      resizeObserver.observe(containerRef.current.parentElement);
    }

    // Also listen to window resize as fallback
    window.addEventListener('resize', updateSize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', updateSize);
    };
  }, []);

  // Setup GSAP dragging with VFX effects
  useEffect(() => {
    if (!emojiRef.current || !containerRef.current || !vfxRef.current) return;

    const radius = Math.min(containerSize.width, containerSize.height) / 2 - 20; // More generous radius
    
    // Reset emoji position to exact center
    gsap.set(emojiRef.current, { x: 0, y: 0, xPercent: -50, yPercent: -50 });

    const dragInstance = Draggable.create(emojiRef.current, {
      type: "x,y",
      // Remove restrictive bounds - let it move freely and constrain in onDrag
      onDragStart: function() {
        setIsDragging(true);
        
        // Add subtle VFX effects to background only
        if (backgroundRef.current && vfxRef.current) {
          vfxRef.current.add(backgroundRef.current, { 
            shader: "ripple",
            uniforms: {
              uTime: 0,
              uIntensity: 0.2
            }
          });
        }
      },
      onDrag: function() {
        // Constrain to circle with more generous movement
        const distance = Math.sqrt(this.x * this.x + this.y * this.y);
        if (distance > radius) {
          const angle = Math.atan2(this.y, this.x);
          const constrainedX = radius * Math.cos(angle);
          const constrainedY = radius * Math.sin(angle);
          gsap.set(this.target, { x: constrainedX, y: constrainedY });
          this.x = constrainedX;
          this.y = constrainedY;
        }

        // Convert to unit coordinates (-1 to 1)
        const unitX = this.x / radius;
        const unitY = -this.y / radius; // Flip Y for screen coordinates
        setPosition({ x: unitX, y: unitY });
        lastPositionRef.current = { x: unitX, y: unitY };

        // Update background VFX effects based on position
        const intensity = Math.sqrt(unitX * unitX + unitY * unitY);

        if (vfxRef.current && backgroundRef.current) {
          vfxRef.current.remove(backgroundRef.current);
          vfxRef.current.add(backgroundRef.current, { 
            shader: "ripple",
            uniforms: {
              uTime: Date.now() * 0.001,
              uIntensity: intensity * 0.3
            }
          });
        }

      },
      onDragEnd: function() {
        setIsDragging(false);

        const { x: unitX, y: unitY } = lastPositionRef.current;
        const currentEmoji = getEmoji(unitX, unitY);
        const emotion = getEmotionLabel(unitX, unitY);
        selectRef.current?.({
          emoji: currentEmoji,
          emotion,
          position: { x: unitX, y: unitY },
          valence: unitX,
          arousal: unitY,
          timestamp: new Date().toISOString()
        });


        // Throttle callback with current emoji
        const now = Date.now();
        if (now - lastEmitRef.current > 100) {
          lastEmitRef.current = now;
          const currentEmoji = getEmoji(unitX, unitY);
          const emotion = getEmotionLabel(unitX, unitY);
          onEmojiSelect?.({
            emoji: currentEmoji,
            emotion,
            position: { x: unitX, y: unitY },
            valence: unitX,
            arousal: unitY,
            timestamp: new Date().toISOString()
          });
        }
      },
      onDragEnd: function() {
        setIsDragging(false);
        

        // Remove VFX effects when drag ends
        if (vfxRef.current && backgroundRef.current) {
          vfxRef.current.remove(backgroundRef.current);
        }

        
        // Emit final position before snapping back
        const endUnitX = this.x / radius;
        const endUnitY = -this.y / radius;
        const endEmoji = getEmoji(endUnitX, endUnitY);
        const endEmotion = getEmotionLabel(endUnitX, endUnitY);
        onEmojiSelect?.({
          emoji: endEmoji,
          emotion: endEmotion,
          position: { x: endUnitX, y: endUnitY },
          valence: endUnitX,
          arousal: endUnitY,
          timestamp: new Date().toISOString()
        });

        // Snap back to center with enhanced animation
        gsap.to(this.target, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "elastic.out(1, 0.3)",
          onUpdate: () => {
            const unitX = this.x / radius;
            const unitY = -this.y / radius;
            setPosition({ x: unitX, y: unitY });
          },
          onComplete: () => {
            setPosition({ x: 0, y: 0 });
            
            // Add a very subtle ripple effect when returning to center
            if (vfxRef.current && backgroundRef.current) {
              vfxRef.current.add(backgroundRef.current, { 
                shader: "ripple",
                uniforms: {
                  uTime: 0,
                  uIntensity: 0.1
                }
              });
              
              // Remove the effect quickly
              setTimeout(() => {
                if (vfxRef.current && backgroundRef.current) {
                  vfxRef.current.remove(backgroundRef.current);
                }
              }, 150);
            }
          }
        });
      }
    })[0];

    return () => {
      if (dragInstance) {
        dragInstance.kill();
      }
    };
  }, [containerSize, getEmoji]);

  const currentEmoji = getEmoji(position.x, position.y);
  const distance = Math.sqrt(position.x * position.x + position.y * position.y);

  // Create smooth gradient background based on position
  const getGradientBackground = () => {
    const x = position.x; // -1 to 1
    const y = position.y; // -1 to 1
    
    // Define quadrant colors (corrected mapping)
    const topLeft = [255, 50, 50];     // Red (angry emotions)
    const topRight = [255, 215, 0];    // Yellow (excited/happy emotions)
    const bottomLeft = [128, 0, 128];  // Purple (sad emotions)
    const bottomRight = [0, 150, 255]; // Blue (calm emotions)
    
    // Interpolate colors based on position
    const topColor = [
      topLeft[0] * (1 - (x + 1) / 2) + topRight[0] * ((x + 1) / 2),
      topLeft[1] * (1 - (x + 1) / 2) + topRight[1] * ((x + 1) / 2),
      topLeft[2] * (1 - (x + 1) / 2) + topRight[2] * ((x + 1) / 2)
    ];
    
    const bottomColor = [
      bottomLeft[0] * (1 - (x + 1) / 2) + bottomRight[0] * ((x + 1) / 2),
      bottomLeft[1] * (1 - (x + 1) / 2) + bottomRight[1] * ((x + 1) / 2),
      bottomLeft[2] * (1 - (x + 1) / 2) + bottomRight[2] * ((x + 1) / 2)
    ];
    
    const finalColor = [
      topColor[0] * ((y + 1) / 2) + bottomColor[0] * (1 - (y + 1) / 2),
      topColor[1] * ((y + 1) / 2) + bottomColor[1] * (1 - (y + 1) / 2),
      topColor[2] * ((y + 1) / 2) + bottomColor[2] * (1 - (y + 1) / 2)
    ];
    
    // Apply Gaussian-like intensity based on distance from center
    const gaussianIntensity = Math.exp(-distance * 2) * 0.4 + distance * 0.3;
    const baseIntensity = isDragging ? 0.15 : 0.08;
    
    return `rgba(${Math.round(finalColor[0])}, ${Math.round(finalColor[1])}, ${Math.round(finalColor[2])}, ${baseIntensity + gaussianIntensity})`;
  };

  // Enhanced glow effect with corrected color mapping
  const getGlowEffect = () => {
    if (!isDragging) return 'none';
    const intensity = distance * 25;
    
    // Use the same color logic as gradient
    const x = position.x;
    const y = position.y;
    
    let color;
    if (x < 0 && y > 0) color = '255, 50, 50';     // Red (top-left, angry)
    else if (x > 0 && y > 0) color = '255, 215, 0'; // Yellow (top-right, happy)
    else if (x < 0 && y < 0) color = '128, 0, 128'; // Purple (bottom-left, sad)
    else color = '0, 150, 255';                     // Blue (bottom-right, calm)
    
    return `0 0 ${intensity}px rgba(${color}, 0.7), 0 0 ${intensity * 1.5}px rgba(${color}, 0.3)`;
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative'
    }}>
      {/* VFX Background Layer */}
      <div 
        ref={backgroundRef}
        style={{
          position: 'absolute',
          inset: 0,
          background: `radial-gradient(circle at 50% 50%, 
            rgba(255, 255, 255, 0.03) 0%, 
            rgba(255, 255, 255, 0.01) 40%, 
            transparent 70%)`,
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      {/* Circle container with VFX */}
      <div
        ref={containerRef}
        style={{
          position: 'relative',
          width: containerSize.width,
          height: containerSize.height,
          borderRadius: '50%',
          overflow: 'visible',
          zIndex: 10
        }}
      >
        {/* Enhanced circle with VFX support */}
        <div
          ref={circleRef}
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
                         backgroundColor: getGradientBackground(),
            border: '3px solid rgba(255, 255, 255, 0.4)',
            transition: 'all 0.3s ease',
            boxShadow: getGlowEffect(),
            transform: isDragging ? 'scale(1.05)' : 'scale(1)',
          }}
        />

        {/* Draggable emoji with enhanced effects */}
        <div
          ref={emojiRef}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            fontSize: `${75 + distance * 35}px`,
            cursor: isDragging ? 'grabbing' : 'grab',
            userSelect: 'none',
            touchAction: 'none',
            pointerEvents: 'auto',
            filter: `drop-shadow(0 4px 8px rgba(0,0,0,0.5))`,
            zIndex: 20,
            transition: isDragging ? 'none' : 'font-size 0.2s ease',
            transform: `scale(${isDragging ? 1.1 : 1})`
          }}
        >
          {currentEmoji}
        </div>

        {/* Enhanced center dot with pulsing effect */}
        {!isDragging && position.x === 0 && position.y === 0 && (
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '16px',
            height: '16px',
            backgroundColor: 'rgba(255, 255, 255, 0.6)',
            borderRadius: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
            boxShadow: '0 0 20px rgba(255, 255, 255, 0.5)'
          }}>
            <div style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '50%',
              animation: 'ping 2s cubic-bezier(0, 0, 0.2, 1) infinite'
            }} />
          </div>
        )}

        {/* Subtle quadrant labels when dragging */}
        {isDragging && distance > 0.3 && (
          <>
            <div style={{
              position: 'absolute',
              top: '15%',
              left: '15%',
              color: 'rgba(255, 50, 50, 0.7)',
              fontSize: '12px',
              fontWeight: 'bold',
              textShadow: '0 0 8px rgba(255, 50, 50, 0.8)',
              pointerEvents: 'none'
            }}>
              Angry
            </div>
            <div style={{
              position: 'absolute',
              top: '15%',
              right: '15%',
              color: 'rgba(255, 215, 0, 0.7)',
              fontSize: '12px',
              fontWeight: 'bold',
              textShadow: '0 0 8px rgba(255, 215, 0, 0.8)',
              pointerEvents: 'none'
            }}>
              Happy
            </div>
            <div style={{
              position: 'absolute',
              bottom: '15%',
              left: '15%',
              color: 'rgba(128, 0, 128, 0.7)',
              fontSize: '12px',
              fontWeight: 'bold',
              textShadow: '0 0 8px rgba(128, 0, 128, 0.8)',
              pointerEvents: 'none'
            }}>
              Sad
            </div>
            <div style={{
              position: 'absolute',
              bottom: '15%',
              right: '15%',
              color: 'rgba(0, 150, 255, 0.7)',
              fontSize: '12px',
              fontWeight: 'bold',
              textShadow: '0 0 8px rgba(0, 150, 255, 0.8)',
              pointerEvents: 'none'
            }}>
              Calm
            </div>
          </>
        )}
      </div>



      {/* Enhanced current emotion display with effects */}
      {isDragging && (
        <div style={{
          position: 'absolute',
          bottom: '30px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: 'white',
          textAlign: 'center',
          fontSize: '18px',
          fontWeight: 'bold',
          zIndex: 20,
          textShadow: '0 0 15px rgba(255, 255, 255, 0.8)',
          background: 'rgba(0, 0, 0, 0.7)',
          padding: '10px 20px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize: '28px', marginBottom: '8px' }}>{currentEmoji}</div>
          <div style={{ fontSize: '16px', fontWeight: '500' }}>
            {getEmotionLabel(position.x, position.y)}
          </div>
          <div style={{ fontSize: '12px', opacity: 0.8, marginTop: '4px' }}>
            Intensity: {Math.round(distance * 100)}%
          </div>
        </div>
      )}

      {/* Enhanced animations */}
      <style>{`
        @keyframes ping {
          75%, 100% {
            transform: scale(2);
            opacity: 0;
          }
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default EmojiGridMapper; 