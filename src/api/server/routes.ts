import { ROUTE } from '../../constants/routes';
import bodyParser from 'body-parser';
import {
  getScreenshot,
  getActionsSchema,
  saveScreenshot,
  saveActionSet,
  getActionSet,
  deleteActionSet,
} from './controller';

const expressMiddleWare = (router) => {
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  router.post(ROUTE.TAKE_SCREENSHOT, getScreenshot);
  router.post(ROUTE.SAVE_SCREENSHOT, saveScreenshot);
  router.post(ROUTE.GET_ACTIONS_DATA, getActionsSchema);
  router.post(ROUTE.SAVE_ACTION_SET, saveActionSet);
  router.post(ROUTE.GET_ACTION_SET, getActionSet);
  router.post(ROUTE.DELETE_ACTION_SET, deleteActionSet);
};
export default expressMiddleWare;
