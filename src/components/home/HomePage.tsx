import { Hero } from "@/components/home/Hero";
import { Manifesto } from "@/components/home/Manifesto";
import { SiteFooter } from "@/components/home/SiteFooter";
import { Strip } from "@/components/home/Strip";
import { Trust } from "@/components/home/Trust";
import { MotionPreferences } from "@/components/providers/MotionPreferences";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";

export function HomePage() {
  return (
    <SmoothScrollProvider>
      <MotionPreferences />
      <a className="skip-link" href="#manifesto">
        Skip to content
      </a>
      <div className="site">
        <main>
          <Hero />
          <Strip />
          <Manifesto />
          <Trust />
        </main>
        <SiteFooter />
      </div>
    </SmoothScrollProvider>
  );
}
