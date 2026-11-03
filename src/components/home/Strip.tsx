"use client";

import { Icon, icons } from "@/components/ui/Icon";
import { useSmoothScroll } from "@/components/providers/SmoothScrollProvider";
import { siteConfig } from "@/data/site";

export function Strip() {
  const { scrollTo } = useSmoothScroll();

  return (
    <div className="strip" role="note" aria-label="Project information">
      <div className="strip-est">
        VERSION <span>{siteConfig.version}</span>
      </div>
      <button className="scroll-cue" type="button" onClick={() => scrollTo("#manifesto")}>
        <span>SCROLL DOWN</span>
        <span className="arrow-disc">
          <Icon icon={icons.arrowDown} />
        </span>
      </button>
      <div className="strip-live">SELF-HOSTED</div>
    </div>
  );
}
