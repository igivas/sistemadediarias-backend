import { Router } from 'express';

import DocumentosController from '../controllers/DocumentosController';
/* import ensureAuthenticated from '../../../middlewares/ensureAuthenticated';
import uploadMulter from '../../../middlewares/uploadMulter'; */

const documentosRouter = Router();

const documentos = new DocumentosController();

/* documentosRouter.get('/', ensureAuthenticated, documentos.index);
documentosRouter.get('/pdf/:ano/:sistema/:arquivo', documentos.showPdf);
documentosRouter.get('/check/', documentos.check);
documentosRouter.get('/:id', documentos.show);

documentosRouter.post(
  '/',
  ensureAuthenticated,
  uploadMulter,
  documentos.create,
);
documentosRouter.post('/assinar', documentos.createAssinar);
documentosRouter.put('/', ensureAuthenticated, uploadMulter, documentos.update);
documentosRouter.put(
  '/reassinar',
  ensureAuthenticated,
  uploadMulter,
  documentos.updateReassinar,
);
documentosRouter.post(
  '/termo/assinar',
  uploadMulter,
  documentos.createAssinarTermo,
); */

documentosRouter.post('/gerardocumento', documentos.createDocumento);

export default documentosRouter;
