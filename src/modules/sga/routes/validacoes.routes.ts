import { Router } from 'express';
import ValidacoesController from '../controllers/ValidacoesController';

import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';

const validacoesRouter = Router();
const validacoes = new ValidacoesController();

validacoesRouter.use(ensureAuthenticated);

validacoesRouter.post('/', validacoes.create);
validacoesRouter.get('/', validacoes.index);
validacoesRouter.put('/revoga/:id', validacoes.updateRevoga);
validacoesRouter.put('/:id', validacoes.updateFinaliza);

export default validacoesRouter;
