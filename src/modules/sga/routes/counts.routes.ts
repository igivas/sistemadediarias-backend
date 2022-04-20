import { Router } from 'express';
import CountsController from '../controllers/CountsController';

import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';

const countsRouter = Router();
const countsController = new CountsController();

countsRouter.use(ensureAuthenticated);

countsRouter.get('/', countsController.show);

export default countsRouter;
