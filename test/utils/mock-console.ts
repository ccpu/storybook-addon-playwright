import { vi } from 'vitest';

const consoleMethods = ['log', 'warn', 'error'] as const;

export default function mockConsole(): () => void {
  const mocks = consoleMethods.map((method) =>
    vi.spyOn(console, method).mockImplementation(() => undefined),
  );

  return () => {
    for (const mock of mocks) {
      mock.mockRestore();
    }
  };
}
