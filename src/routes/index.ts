import { Router } from 'express';
import funcoesRouter from '@modules/public/routes/funcoes.routes';
import transportesRouter from '../modules/public/routes/transportes.routes';
import classesRouter from '../modules/public/routes/classes.routes';
import classesCargoRouter from '../modules/public/routes/classesCargo.routes';
import credoresRouter from '../modules/public/routes/credores.routes';
import finalidadesRouter from '../modules/public/routes/finalidades.routes';
import hospedagensRouter from '../modules/public/routes/hospedagens.routes';
import sessionsRouter from '../modules/seg/routes/sessions.routes';

import legislacoesRouter from '../modules/public/routes/legislacoes.routes';
import municipiosRouter from '../modules/public/routes/municipios.routes';
import opmsRouter from '../modules/public/routes/opms.routes';

const routes = Router();

routes.use('/sessions', sessionsRouter);
routes.use('/legislacoes', legislacoesRouter);
routes.use('/finalidades', finalidadesRouter);
routes.use('/hospedagens', hospedagensRouter);
routes.use('/transportes', transportesRouter);
routes.use('/classes', classesRouter);
routes.use('/classescargos', classesCargoRouter);
routes.use('/credores', credoresRouter);
routes.use('/municipios', municipiosRouter);
routes.use('/opms', opmsRouter);
routes.use('/funcoes', funcoesRouter);

export default routes;
