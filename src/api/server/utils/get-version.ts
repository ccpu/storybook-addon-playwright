import path from 'path';

export const getVersion = () => {
  const packagePath = path.resolve(__dirname, '../../../../package.json');

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const version = (require(packagePath).version as string)
    .split('.')[0]
    .toString();

  return version;
};
