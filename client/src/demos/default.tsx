import React from 'react';
import { ParallaxComponent } from '../components/ui/parallax-scrolling.tsx';

export default function ParallaxDemo() {
  return (
    <div className="w-full">
      <ParallaxComponent />
      <div className="osmo-credits flex items-center justify-center p-8 bg-background border-t border-border">
        <p className="osmo-credits__p text-foreground font-body-sm text-sm uppercase tracking-wider">
          Resource by <a target="_blank" href="https://www.osmo.supply/" className="osmo-credits__p-a text-primary hover:underline font-bold">Osmo</a>
        </p>
      </div>
    </div>
  );
}
