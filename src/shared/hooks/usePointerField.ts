import { useRef } from 'react';
import type { PointerEvent as ReactPointerEvent } from 'react';
import type { PointerState } from '../../features/about-us/views/IconField';

/**
 * Raw VIEWPORT pixel pointer position, read directly by IconField's
 * animation loop rather than through React state (so movement never
 * triggers a re-render). Returns handlers to spread onto an ancestor of
 * both the icon backdrop and the section's content — pointer events need
 * to bubble up from whatever's on top (text, cards) for the field to react
 * anywhere but the empty margins.
 */
export function usePointerField() {
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, active: false });

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    pointerRef.current = { x: event.clientX, y: event.clientY, active: true };
  }

  function onPointerLeave() {
    pointerRef.current.active = false;
  }

  return { pointerRef, onPointerMove, onPointerLeave };
}
