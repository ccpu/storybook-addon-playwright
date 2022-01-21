import { createTheme } from '@mui/material/styles';

const makeStyles = (cb) => {
  const obj = cb(createTheme());
  const keys = Object.keys(obj);

  return (p) => {
    keys.forEach((key) => {
      const styles = obj[key];
      Object.keys(styles).forEach((styleKey) => {
        const styleVal = styles[styleKey];
        if (typeof styleVal === 'function') {
          styleVal(p);
        }
      });
    });
    return keys.reduce((o, k) => ({ ...o, [k]: k }), {});
  };
};

export default makeStyles;
