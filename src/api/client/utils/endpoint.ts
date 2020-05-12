import { ROUTE } from '../../../constants/routes';

export const getEndpoint = (route: keyof typeof ROUTE) => {
  const url = `${window.location.protocol}//${window.location.host}`;
  return url + ROUTE[route];
};
