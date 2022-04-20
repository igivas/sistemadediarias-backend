import { Router } from 'express';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';
import TransportesController from '../controllers/TransportesController';

const transportesRouter = Router();
const transportesController = new TransportesController();
transportesRouter.use(ensureAuthenticated);
transportesRouter.post('/', transportesController.create);
transportesRouter.get('/', transportesController.index);
transportesRouter.put('/:id', transportesController.update);
transportesRouter.put('/deletar/:id', transportesController.softDelete);

export default transportesRouter;
