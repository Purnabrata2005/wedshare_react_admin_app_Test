import { useEffect, useRef, useState } from "react";

interface AnimatedBlockProps {
  children: React.ReactNode;
  delay?: number;
}

export function AnimatedBlock({ children, delay = 0 }: AnimatedBlockProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) =>
        entry.isIntersecting && setTimeout(() => setVisible(true), delay),
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}>
      {children}
    </div>
  );
}