import React from "react";
import { ShineBorder } from "./ui/magicui/sine-border";
import SparklesText from "./ui/magicui/sparkles-text";
import FlickeringGrid from "@/components/ui/magicui/flickering-grid";

export const HeroSection: React.FC = () => {
  return (
    <ShineBorder
      className="h-[60vh] p-0 relative flex w-full flex-col items-center justify-center rounded-lg border bg-background md:shadow-xl mb-8 overflow-hidden"
      color={["#7cfebb", "#fef18f", "#ff9a7b"]}
    >
      <div className="relative p-8 w-full h-full flex items-center justify-center">
        <div className="">
          <FlickeringGrid
            className="z-0 absolute inset-0"
            squareSize={4}
            gridGap={6}
            color="#bababa"
            maxOpacity={0.5}
            flickerChance={0.1}
            height={800}
            width={800}
          />
        </div>
        <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
          <h1 className="text-6xl font-extrabold text-primary mb-4 tracking-tight">
            <SparklesText text="Lumina" />
          </h1>
          <p className="text-3xl text-primary font-light mb-8">
            Illuminating Research Insights
          </p>
          <p className="text-xl text-muted-foreground max-w-2xl">
            Unlock the power of advanced querying and metadata access. Explore,
            discover, and innovate with unparalleled clarity.
          </p>
        </div>
      </div>
    </ShineBorder>
  );
};
