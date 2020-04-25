import { TAKE_SNAPSHOT } from '../../constants/routes';
import bodyParser from 'body-parser';
import { getSnapShot } from './controller';

const expressMiddleWare = (router) => {
  router.use(bodyParser.urlencoded({ extended: false }));
  router.use(bodyParser.json());

  router.post(TAKE_SNAPSHOT, getSnapShot);
};
export default expressMiddleWare;
