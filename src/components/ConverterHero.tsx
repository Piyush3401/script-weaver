import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Languages } from "lucide-react";

const ConverterHero = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Icon animation
      gsap.from(iconRef.current, {
        scale: 0,
        rotation: -180,
        duration: 1,
        ease: "back.out(1.7)",
      });

      // Title animation with stagger
      gsap.from(titleRef.current, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power3.out",
      });

      // Subtitle animation
      gsap.from(subtitleRef.current, {
        y: 30,
        opacity: 0,
        duration: 0.8,
        delay: 0.5,
        ease: "power3.out",
      });

      // Floating animation for icon
      gsap.to(iconRef.current, {
        y: -10,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <header ref={heroRef} className="relative overflow-hidden py-16 md:py-24">
      {/* Background gradient */}
      <div className="absolute inset-0 gradient-hero opacity-50" />
      
      <div className="container relative mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <div
            ref={iconRef}
            className="mb-8 flex h-20 w-20 items-center justify-center rounded-3xl bg-primary shadow-primary"
          >
            <Languages className="h-10 w-10 text-primary-foreground" />
          </div>

          {/* Title */}
          <h1
            ref={titleRef}
            className="mb-4 text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl"
          >
            Devanagari Converter
          </h1>

          {/* Subtitle */}
          <p
            ref={subtitleRef}
            className="max-w-2xl text-lg text-muted-foreground md:text-xl"
          >
            Transform English text into beautiful Devanagari script instantly with
            AI-powered transliteration
          </p>
        </div>
      </div>
    </header>
  );
};

export default ConverterHero;
