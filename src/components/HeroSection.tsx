import React, { useEffect, useState } from "react";
import { ShineBorder } from "./ui/magicui/sine-border";
import SparklesText from "./ui/magicui/sparkles-text";
import FlickeringGrid from "@/components/ui/magicui/flickering-grid";
import { AnimatedText } from "./hero/animated-text";

export const HeroSection: React.FC = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    const isDarkMode = document.documentElement.classList.contains("dark");
    setTheme(isDarkMode ? "dark" : "light");

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDarkMode =
            document.documentElement.classList.contains("dark");
          setTheme(isDarkMode ? "dark" : "light");
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => observer.disconnect();
  }, []);

  const gridColor =
    theme === "light" ? "rgb(167, 208, 148)" : "rgb(10, 99, 15)";

  return (
    <ShineBorder
      className="h-[60vh] p-0 relative flex w-full flex-col items-center justify-center rounded-lg border bg-background md:shadow-xl mb-8 overflow-hidden"
      color={["#7cfebb", "#fef18f", "#ff9a7b"]}
    >
      <div className="absolute inset-0">
        <FlickeringGrid
          className="w-full h-full"
          squareSize={4}
          gridGap={6}
          maxOpacity={0.5}
          flickerChance={0.1}
          color={gridColor}
        />
      </div>
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl p-8">
        <div className="mb-4">
          <AnimatedText />
        </div>
        <h1 className="text-6xl font-extrabold text-primary mb-4 tracking-tight">
          <SparklesText text="Lumina" />
        </h1>
        <p className="text-3xl text-primary font-light mb-8">
          Illuminating Research Insights
        </p>
        <p className="text-xl text-primary max-w-2xl">
          Unlock the power of advanced querying and metadata access. Explore,
          discover, and innovate with unparalleled clarity.
        </p>
      </div>
    </ShineBorder>
  );
};
