import { useState } from 'react';
import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
  useTransitionStyles
} from '@floating-ui/react';

// Scale-in grows away from the anchor, whichever side Floating UI ends up choosing
const originBySide = { top: 'bottom', bottom: 'top', left: 'right', right: 'left' };

/**
 * Material-style plain tooltip (M3 look) positioned with Floating UI.
 * - works with ANY child (custom components too): the ref and hover/focus
 *   handlers live on a wrapper <span>, so the child doesn't need forwardRef
 * - flips / shifts when it would overflow the viewport, follows scroll and resize
 * - hover (500 ms open delay), keyboard focus, Escape to dismiss
 * - rendered in a portal, so overflow:hidden parents (map containers, panels) don't clip it
 *
 * Usage:
 *   <Tooltip label="Get Directions">
 *     <DirectionsButton … />
 *   </Tooltip>
 */
const Tooltip = ({ label, placement = 'top', children }) => {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })],
  });

  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context, { move: false, delay: { open: 500, close: 0 } }),
    useFocus(context),
    useDismiss(context),
    useRole(context, { role: 'tooltip' }),
  ]);

  const { isMounted, styles: transitionStyles } = useTransitionStyles(context, {
    duration: 150,
    initial: { opacity: 0, transform: 'scale(0.9)' },
    common: ({ side }) => ({ transformOrigin: originBySide[side] }),
  });

  return (
    <>
      {/* Wrapper holds the ref + events; React's focus events bubble, so focusing the inner button also opens it */}
      <span ref={refs.setReference} className="inline-flex" {...getReferenceProps()}>
        {children}
      </span>

      {isMounted && (
        <FloatingPortal>
          {/* Outer div: Floating UI positioning. Inner div: animation, so the two transforms don't clash */}
          <div ref={refs.setFloating} style={floatingStyles} className="pointer-events-none z-50" {...getFloatingProps()}>
            <div
              style={transitionStyles}
              className="max-w-[260px] whitespace-normal rounded bg-zinc-800 px-2 py-1 text-xs font-medium leading-5 text-zinc-50 shadow-sm dark:bg-zinc-100 dark:text-zinc-900"
            >
              {label}
            </div>
          </div>
        </FloatingPortal>
      )}
    </>
  );
}
export default Tooltip;