const MILLISECONDS_IN_SECOND = 1000;
const SECONDS_IN_MINUTE = 60;

export function formatElapsedTime(milliseconds: number) {
  if (milliseconds < MILLISECONDS_IN_SECOND) {
    return `${milliseconds}ms`;
  }

  const totalSeconds = Math.round(milliseconds / MILLISECONDS_IN_SECOND);

  if (totalSeconds < SECONDS_IN_MINUTE) {
    return `${totalSeconds}s`;
  }

  const minutes = Math.floor(totalSeconds / SECONDS_IN_MINUTE);
  const seconds = totalSeconds % SECONDS_IN_MINUTE;

  return seconds ? `${minutes}m ${seconds}s` : `${minutes}m`;
}
