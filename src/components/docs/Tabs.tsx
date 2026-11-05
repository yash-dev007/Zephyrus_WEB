"use client";

import { createContext, useContext, useId, useState, type ReactNode } from "react";

type TabsContextValue = {
  active: string;
  setActive: (value: string) => void;
  baseId: string;
};

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({
  items,
  children,
  defaultValue,
}: {
  items: string[];
  children: ReactNode;
  defaultValue?: string;
}) {
  const [active, setActive] = useState(defaultValue ?? items[0] ?? "");
  const baseId = useId();

  return (
    <TabsContext.Provider value={{ active, setActive, baseId }}>
      <div className="docs-tabs">
        <div className="docs-tabs-list" role="tablist" aria-label="Code samples">
          {items.map((item) => {
            const selected = item === active;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                id={`${baseId}-tab-${slugify(item)}`}
                aria-selected={selected}
                aria-controls={`${baseId}-panel-${slugify(item)}`}
                tabIndex={selected ? 0 : -1}
                className="docs-tabs-trigger"
                data-active={selected ? "" : undefined}
                onClick={() => setActive(item)}
              >
                {item}
              </button>
            );
          })}
        </div>
        <div className="docs-tabs-panels">{children}</div>
      </div>
    </TabsContext.Provider>
  );
}

export function Tab({ value, children }: { value: string; children: ReactNode }) {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tab must be rendered inside Tabs");
  }

  const selected = context.active === value;

  return (
    <div
      role="tabpanel"
      id={`${context.baseId}-panel-${slugify(value)}`}
      aria-labelledby={`${context.baseId}-tab-${slugify(value)}`}
      hidden={!selected}
      className="docs-tab-panel"
    >
      {children}
    </div>
  );
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
