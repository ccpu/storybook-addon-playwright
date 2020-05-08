import { ROUTE } from '../../constants/routes';
import bodyParser from 'body-parser';
import {
  getScreenshot,
  getActionsSchema,
  saveScreenshot,
  saveActionSet,
} from './controller';

const expressMiddleWare = (router) => {
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  router.post(ROUTE.TAKE_SCREENSHOT, getScreenshot);
  router.post(ROUTE.SAVE_SCREENSHOT, saveScreenshot);
  router.post(ROUTE.GET_ACTIONS_DATA, getActionsSchema);
  router.post(ROUTE.SAVE_ACTION_SET, saveActionSet);
};
export default expressMiddleWare;
