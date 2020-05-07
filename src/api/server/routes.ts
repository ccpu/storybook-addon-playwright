import {
  TAKE_SCREENSHOT,
  SAVE_SCREENSHOT,
  GET_ACTIONS_DATA,
} from '../../constants/routes';
import bodyParser from 'body-parser';
import { getScreenshot, getActionsSchema, saveScreenshot } from './controller';

const expressMiddleWare = (router) => {
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  router.post(TAKE_SCREENSHOT, getScreenshot);
  router.post(SAVE_SCREENSHOT, saveScreenshot);
  router.post(GET_ACTIONS_DATA, getActionsSchema);
};
export default expressMiddleWare;
