// creating the api routes

import express from 'express';
import audioRouter from './audioRoutes';

const apiRouter=express.Router();

// if api url start with /audio then handel it with audioRouter
apiRouter.use('/audio',audioRouter);

export default apiRouter;