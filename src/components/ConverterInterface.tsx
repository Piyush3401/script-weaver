import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { Copy, Trash2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

const ConverterInterface = () => {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [isConverting, setIsConverting] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLDivElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardRef.current, {
        y: 100,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });

      gsap.from([inputRef.current, outputRef.current], {
        scale: 0.95,
        opacity: 0,
        duration: 0.6,
        stagger: 0.2,
        delay: 0.3,
        ease: "back.out(1.2)",
      });

      // Arrow pulse animation
      gsap.to(arrowRef.current, {
        x: 5,
        duration: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });
    }, cardRef);

    return () => ctx.revert();
  }, []);

  // Animate output text when it changes
  useEffect(() => {
    if (outputText) {
      gsap.from(outputRef.current?.querySelector("textarea"), {
        opacity: 0,
        y: 10,
        duration: 0.4,
        ease: "power2.out",
      });
    }
  }, [outputText]);

  const handleConvert = async () => {
    if (!inputText.trim()) {
      toast.error("Please enter some text to convert");
      return;
    }

    setIsConverting(true);
    
    // Temporary mock conversion - will be replaced with actual API call
    // This simulates the backend conversion
    setTimeout(() => {
      // Basic mock transliteration (will be replaced with actual backend)
      const mockConversion = inputText
        .toLowerCase()
        .replace(/hello/gi, "नमस्ते")
        .replace(/namaste/gi, "नमस्ते")
        .replace(/india/gi, "भारत")
        .replace(/bharat/gi, "भारत")
        .replace(/welcome/gi, "स्वागत")
        .replace(/swagat/gi, "स्वागत")
        .replace(/thank you/gi, "धन्यवाद")
        .replace(/dhanyavad/gi, "धन्यवाद");
      
      setOutputText(mockConversion || "Backend integration pending...");
      setIsConverting(false);
      
      toast.success("Text converted successfully!");
    }, 500);
  };

  // Real-time conversion as user types
  useEffect(() => {
    const timer = setTimeout(() => {
      if (inputText.trim()) {
        handleConvert();
      } else {
        setOutputText("");
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [inputText]);

  const handleCopy = () => {
    if (outputText) {
      navigator.clipboard.writeText(outputText);
      toast.success("Copied to clipboard!");
      
      // Animate copy button
      gsap.to(cardRef.current?.querySelector('[data-copy-btn]'), {
        scale: 1.1,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
      });
    }
  };

  const handleClear = () => {
    setInputText("");
    setOutputText("");
    toast.info("Text cleared");
  };

  return (
    <section className="container mx-auto px-4 pb-16">
      <Card ref={cardRef} className="overflow-hidden shadow-card">
        <div className="grid gap-0 md:grid-cols-2">
          {/* Input Section */}
          <div ref={inputRef} className="border-b border-border p-6 md:border-b-0 md:border-r">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">English Text</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                className="h-8 px-2"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type English text here... (e.g., 'namaste', 'bharat', 'swagat')"
              className="min-h-[300px] resize-none border-0 bg-transparent text-base focus-visible:ring-0"
            />
          </div>

          {/* Output Section */}
          <div ref={outputRef} className="relative p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Devanagari Output</h2>
              <Button
                data-copy-btn
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                disabled={!outputText}
                className="h-8 px-2"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={outputText}
              readOnly
              placeholder="Devanagari text will appear here..."
              className="devanagari-text min-h-[300px] resize-none border-0 bg-transparent text-xl focus-visible:ring-0"
            />
            
            {isConverting && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 text-primary">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "0ms" }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "150ms" }} />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-primary" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Arrow indicator */}
        <div
          ref={arrowRef}
          className="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 md:block"
        >
          <div className="rounded-full bg-primary p-3 shadow-primary">
            <ArrowRight className="h-6 w-6 text-primary-foreground" />
          </div>
        </div>
      </Card>

      {/* Info Cards */}
      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Card className="p-6 shadow-card">
          <h3 className="mb-2 font-semibold text-primary">Real-time Conversion</h3>
          <p className="text-sm text-muted-foreground">
            Text converts automatically as you type
          </p>
        </Card>
        <Card className="p-6 shadow-card">
          <h3 className="mb-2 font-semibold text-secondary">NLP Powered</h3>
          <p className="text-sm text-muted-foreground">
            Using Indic NLP for accurate transliteration
          </p>
        </Card>
        <Card className="p-6 shadow-card">
          <h3 className="mb-2 font-semibold text-accent">Phonetic Mapping</h3>
          <p className="text-sm text-muted-foreground">
            Context-aware character transformation
          </p>
        </Card>
      </div>
    </section>
  );
};

export default ConverterInterface;
