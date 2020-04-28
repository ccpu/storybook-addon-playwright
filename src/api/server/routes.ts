import {
  TAKE_SCREENSHOT,
  SAVE_SCREENSHOT,
  GET_ACTION_DATA,
} from '../../constants/routes';
import bodyParser from 'body-parser';
import { getScreenshot, getActions, saveScreenshot } from './controller';

const expressMiddleWare = (router) => {
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  router.post(TAKE_SCREENSHOT, getScreenshot);
  router.post(SAVE_SCREENSHOT, saveScreenshot);
  router.post(GET_ACTION_DATA, getActions);
};
export default expressMiddleWare;
