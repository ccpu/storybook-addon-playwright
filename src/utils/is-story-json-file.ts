export const isStoryJsonFile = (
  jsonFileName: string,
  storyFileName: string,
) => {
  const jsonName = jsonFileName.split('.').slice(0, -2).join('.');
  const storyName = storyFileName.split('.').slice(0, -1).join('.');
  return storyName.endsWith(jsonName);
};
