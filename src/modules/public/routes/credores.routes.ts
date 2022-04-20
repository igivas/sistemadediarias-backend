import { Router } from 'express';
import ensureAuthenticated from 'middlewares/ensureAuthenticated';
import CredoresController from '../controllers/CredoresController';

const credoresRouter = Router();
const credoresController = new CredoresController();
credoresRouter.use(ensureAuthenticated);
credoresRouter.get('/listpm/:dados', credoresController.listCredor);
credoresRouter.put('/:matricula', credoresController.update);

export default credoresRouter;
