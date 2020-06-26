let _context;
export const setRequiredContext = (context) => {
  console.log('set');
  _context = context;
};
export const getRequiredContext = () => {
  return _context;
};
