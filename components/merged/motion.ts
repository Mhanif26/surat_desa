// Shared motion for merged components: shadcn structure + iconiq-style springs, held to IT-2023.
// Springs are critically damped (bounce 0): they track interruptions like iconiq's, without overshoot.
import type { Transition } from "motion/react"

/** Default for anything a press moves (thumbs, pills, underlines). ~250ms settle. */
export const SPRING: Transition = { type: "spring", bounce: 0, duration: 0.25 }

/** Slightly slower, for things that enter (dialogs, content). */
export const SPRING_ENTER: Transition = { type: "spring", bounce: 0, duration: 0.3 }

/** IT-2023 ease-out, for fades. */
export const FADE: Transition = { duration: 0.15, ease: [0.23, 1, 0.32, 1] }

/** Reduced motion: no movement, only a short fade. */
export const INSTANT: Transition = { duration: 0 }
