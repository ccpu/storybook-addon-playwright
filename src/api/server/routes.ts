import { TAKE_SCREENSHOT } from '../../constants/routes';
import bodyParser from 'body-parser';
import { getScreenshot } from './controller';

const expressMiddleWare = (router) => {
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  router.post(TAKE_SCREENSHOT, getScreenshot);
};
export default expressMiddleWare;
