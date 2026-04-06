import { useUIStore } from './ui-store';

export function useAddonStateValue() {
  return useUIStore((s) => s.addonState);
}

export function useBrowserOptionsValue() {
  return useUIStore((s) => s.browserOptions);
}

export function useScreenshotOptionsValue() {
  return useUIStore((s) => s.screenshotOptions);
}

export function useDragStartValue() {
  return useUIStore((s) => s.dragStart);
}

export function useSelectorManagerValue() {
  return useUIStore((s) => s.selectorManager);
}

export function useScreenshotUpdateStateValue() {
  return useUIStore((s) => s.screenshotUpdateState);
}

export function useEditScreenshotStateValue() {
  return useUIStore((s) => s.editScreenshotState);
}

export function useSchemaLoaded() {
  return useUIStore((s) => s.schemaLoaded);
}
