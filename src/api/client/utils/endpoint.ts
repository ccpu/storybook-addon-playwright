import * as routes from '../../../constants/routes';

export const getEndpoint = (route?: keyof typeof routes) => {
  const url = `${window.location.protocol}//${window.location.host}`;
  if (!route) url;
  return url + routes[route];
};
