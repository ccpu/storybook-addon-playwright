describe('test setup', () => {
  it('passes fetch calls through by default', async () => {
    const response = await fetch('data:text/plain,fetch-passthrough');

    await expect(response.text()).resolves.toBe('fetch-passthrough');
  });

  it('does not expose a Jest global', () => {
    expect(globalThis).not.toHaveProperty('jest');
  });
});
