import { Router } from 'express';
import ensureAuthenticated from 'middlewares/ensureAuthenticated';
import FuncoesController from '../controllers/FuncoesController';

const funcoesRouter = Router();
const funcoesController = new FuncoesController();
funcoesRouter.use(ensureAuthenticated);
funcoesRouter.get('/:codigo', funcoesController.listFuncoes);

export default funcoesRouter;
