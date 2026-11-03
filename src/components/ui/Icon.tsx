"use client";

import { config, type IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowDown,
  faArrowUp,
  faAsterisk,
  faBrain,
  faCalendarDays,
  faComments,
  faEnvelope,
  faFileLines,
  faFlask,
  faListCheck,
  faMagnifyingGlass,
  faPlug,
} from "@fortawesome/free-solid-svg-icons";
import type { IconName } from "@/data/site";
import { cn } from "@/lib/utils";

// The global stylesheet is imported once in the root layout. Turning off the
// runtime style injection removes a flash of oversized icons on first paint.
config.autoAddCss = false;

export const moduleIcons: Record<IconName, IconDefinition> = {
  chat: faComments,
  memory: faBrain,
  research: faMagnifyingGlass,
  email: faEnvelope,
  calendar: faCalendarDays,
  tasks: faListCheck,
  documents: faFileLines,
  tools: faPlug,
  cookbook: faFlask,
};

export const icons = {
  arrowUp: faArrowUp,
  arrowDown: faArrowDown,
  asterisk: faAsterisk,
} as const;

type IconProps = {
  icon: IconDefinition;
  className?: string;
};

export function Icon({ icon, className }: IconProps) {
  return (
    <FontAwesomeIcon icon={icon} className={cn("icon", className)} aria-hidden="true" />
  );
}
