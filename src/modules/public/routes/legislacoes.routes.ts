import { Router } from 'express';
import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';
import LegislacoesController from '../controllers/LegislacoesController';

const legislacoesRouter = Router();
const legislacoesController = new LegislacoesController();
legislacoesRouter.use(ensureAuthenticated);
legislacoesRouter.put('/:id', legislacoesController.update);
legislacoesRouter.put('/deletar/:id', legislacoesController.softDelete);
legislacoesRouter.post('/', legislacoesController.create);
legislacoesRouter.get('/', legislacoesController.index);
legislacoesRouter.get('/:id', legislacoesController.show);

export default legislacoesRouter;
