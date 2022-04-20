import { Router } from 'express';
import ensureAuthenticated from 'middlewares/ensureAuthenticated';
import OpmsController from '../controllers/OpmsController';

const opmsRouter = Router();
const opmsController = new OpmsController();
opmsRouter.use(ensureAuthenticated);
opmsRouter.get('/:unidade', opmsController.listOpms);

export default opmsRouter;
