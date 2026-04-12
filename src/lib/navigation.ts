let navigatedCount = 0;

export function markNavigation() {
  navigatedCount++;
}

export function hasNavigatedWithinApp() {
  return navigatedCount > 1;
}
