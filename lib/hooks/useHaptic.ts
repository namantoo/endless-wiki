// navigator.vibrate() is supported on Android Chrome and most Android browsers.
// On iOS and desktop it's a no-op (the API is simply missing), so the
// optional-chaining (?.) makes every call safely silent on unsupported devices.
//
// Durations are in milliseconds.
// Patterns are [vibrate, pause, vibrate, pause, ...].

export function useHaptic() {
  return {
    // Very short tap — for UI interactions (pill tap, button press)
    light: () => navigator.vibrate?.(6),

    // Slightly stronger — for confirmations (bookmark saved)
    medium: () => navigator.vibrate?.(14),

    // Double pulse — for navigation snap (feels like a card click into place)
    snap: () => navigator.vibrate?.([8, 40, 8]),
  };
}
