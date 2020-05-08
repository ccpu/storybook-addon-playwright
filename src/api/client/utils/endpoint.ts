import { ROUTE } from '../../../constants/routes';

export const getEndpoint = (route?: keyof typeof ROUTE) => {
  const url = `${window.location.protocol}//${window.location.host}`;
  if (!route) url;
  return url + ROUTE[route];
};
