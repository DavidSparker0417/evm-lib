export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function getCurrentTimestamp() {
  return Math.floor(new Date().getTime())
}
