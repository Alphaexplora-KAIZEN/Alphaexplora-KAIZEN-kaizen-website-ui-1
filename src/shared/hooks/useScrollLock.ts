import { useEffect } from 'react';

// Module-level, shared across every useScrollLock consumer. Several UI
// pieces (mobile nav drawer, booking modal, etc.) can want the scroll lock
// at once — a naive per-instance "save/restore overflow" approach lets one
// consumer's cleanup clobber another's lock. A simple reference count keeps
// the body locked as long as *anyone* needs it, and only restores the
// original overflow once every consumer has released it.
let lockCount = 0;
let previousOverflow = '';

/**
 * Locks body scroll while `locked` is true. Safe to use from multiple
 * components simultaneously (e.g. mobile nav drawer + booking modal).
 */
export function useScrollLock(locked: boolean): void {
  useEffect(() => {
    if (!locked) return;

    if (lockCount === 0) {
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    lockCount += 1;

    return () => {
      lockCount = Math.max(0, lockCount - 1);
      if (lockCount === 0) {
        document.body.style.overflow = previousOverflow;
      }
    };
  }, [locked]);
}
