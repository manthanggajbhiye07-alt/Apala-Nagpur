import { useState, useRef, useEffect } from 'react';
import { ImageIcon } from 'lucide-react';

interface SmartImageProps {
  src: string;
  alt: string;
  className?: string;
  lazy?: boolean;
  attribution?: string;
  showAttribution?: boolean;
}

export function SmartImage({ src, alt, className = '', lazy = true, attribution, showAttribution = false }: SmartImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [inView, setInView] = useState(!lazy);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lazy || inView) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [lazy, inView]);

  // Reset state when src changes
  useEffect(() => {
    setLoaded(false);
    setError(false);
    setRetryCount(0);
  }, [src]);

  const handleError = () => {
    if (retryCount < 1) {
      setRetryCount(c => c + 1);
    } else {
      setError(true);
    }
  };

  // Add cache-busting param on retry
  const imgSrc = retryCount > 0 ? `${src}${src.includes('?') ? '&' : '?'}_r=${retryCount}` : src;

  return (
    <div ref={ref} className={`relative overflow-hidden ${className}`}>
      {!loaded && !error && (
        <div className="absolute inset-0 shimmer-bg animate-shimmer" />
      )}
      {error ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-sand-100 text-sand-400 p-2">
          <ImageIcon className="w-8 h-8 mb-2" />
          <span className="text-xs font-medium text-center line-clamp-2">{alt}</span>
        </div>
      ) : inView ? (
        <img
          src={imgSrc}
          alt={alt}
          loading={lazy ? 'lazy' : 'eager'}
          className={`w-full h-full object-cover transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setLoaded(true)}
          onError={handleError}
        />
      ) : null}
      {showAttribution && attribution && loaded && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1">
          <span className="text-[10px] text-white/70 font-body">{attribution}</span>
        </div>
      )}
    </div>
  );
}
