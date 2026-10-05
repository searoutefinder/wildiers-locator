import { useEffect, useId, useRef, useState } from "react";

const MultiSelect = ({ label, value = [], onChange, options = [], getValue = (opt) => opt.name }) => {

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
 
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const listId = useId();
 
  const selected = (Array.isArray(value) ? value : []).map((v) =>
    v !== null && typeof v === "object" ? getValue(v) : v
  );
  const isSelected = (opt) => selected.includes(getValue(opt));
  
  const toggle = (opt) => {
    const v = getValue(opt);
    const next = isSelected(opt)
      ? selected.filter((x) => x !== v)
      : [...selected, v];

    const nextOptions = options.filter((o) => next.includes(getValue(o)));

    onChange?.(next, nextOptions, opt);
  };
 
  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);
 
  // Keep the keyboard-active option visible while navigating
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: "nearest" });
  }, [open, activeIndex]);
 
  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (!open && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      setOpen(true);
      setActiveIndex(0);
      return;
    }
    if (!open) return;
 
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, options.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if ((e.key === "Enter" || e.key === " ") && activeIndex >= 0) {
      e.preventDefault();
      toggle(options[activeIndex]);
    }
  };
 
  // Text on the control: label, the single selected name, or "label (n)"
  const summary =
    selected.length === 0
      ? label
      : selected.length === 1
        ? (options.find((o) => getValue(o) === selected[0])?.name ?? selected[0])
        : `${label} (${selected.length})`;
 
  return (
    <div ref={rootRef} className="relative w-full flex-1">
      {/* Control */}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        onKeyDown={onKeyDown}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-activedescendant={open && activeIndex >= 0 ? `${listId}-${activeIndex}` : undefined}
        className={`flex h-10 w-full items-center justify-between gap-2 rounded-md border bg-[#fafaf9] px-3 py-2 text-left text-sm transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#99c066] ${
          open || selected.length ? "border-[#99c066]" : "border-[#e7e5e4]"
        }`}
      >
        <span className={`min-w-0 truncate ${selected.length ? "font-medium text-[#161412]" : "text-black/60"}`}>
          {summary}
        </span>
        <img
          alt=""
          className={`size-5 shrink-0 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
          src="/icons/material-symbols/keyboard_arrow_down.svg"
        />
      </button>
 
      {/* Dropdown */}
      {open && (
        <ul
          ref={listRef}
          id={listId}
          role="listbox"
          aria-multiselectable="true"
          aria-label={label}
          className="
            absolute left-0 right-0 top-full z-30 mt-1 max-h-60 overflow-y-auto
            rounded-md border border-[#e7e5e4] bg-white py-1 shadow-lg
            [scrollbar-color:#99c066_transparent] [scrollbar-width:thin]
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-transparent
            [&::-webkit-scrollbar-thumb]:rounded-full
            [&::-webkit-scrollbar-thumb]:bg-[#99c066]
            [&::-webkit-scrollbar-thumb:hover]:bg-[#5c733d]
          "
        >
          {options.map((opt, idx) => {
            const sel = isSelected(opt);
            const active = idx === activeIndex;
            return (
              <li
                key={opt.id ?? getValue(opt)}
                id={`${listId}-${idx}`}
                role="option"
                aria-selected={sel}
                onMouseDown={(e) => e.preventDefault()} // keep focus on the control
                onClick={() => toggle(opt)}
                onMouseEnter={() => setActiveIndex(idx)}
                className={`mx-1 flex cursor-pointer items-center gap-2 rounded px-2 py-2 text-sm transition-colors ${
                  sel
                    ? `${active ? "bg-[#99c066]/40" : "bg-[#99c066]/25"} font-medium text-[#3f5129]`
                    : active
                      ? "bg-[#f5f5f4] text-[#161412]"
                      : "text-[#161412]"
                }`}
              >
                {/* Checkbox indicator */}
                <span
                  aria-hidden="true"
                  className={`flex size-4 shrink-0 items-center justify-center rounded-sm border ${
                    sel ? "border-[#5c733d] bg-[#5c733d]" : "border-[#d6d3d1] bg-white"
                  }`}
                >
                  {sel && (
                    <svg viewBox="0 0 16 16" className="size-3 text-white" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <span className="min-w-0 truncate">{opt.name}</span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
 
export default MultiSelect;