export const getPreviewIframe = () => {
  const iframe = document.body.querySelector<HTMLIFrameElement>(
    '#storybook-preview-iframe',
  );
  return iframe;
};
