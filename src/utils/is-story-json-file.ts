export const isStoryJsonFile = (
  jsonOrStoryFileName: string,
  storyFileName: string,
) => {
  if (jsonOrStoryFileName === storyFileName) return true;
  const jsonName = jsonOrStoryFileName.split('.').slice(0, -2).join('.');
  const storyName = storyFileName.split('.').slice(0, -1).join('.');
  return storyName.endsWith(jsonName);
};
