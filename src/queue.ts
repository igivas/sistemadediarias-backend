import 'reflect-metadata';
import 'dotenv/config';
import { createConnection } from 'typeorm';

import './container/mail.container';
import Queue from './lib/Queue';
// import './database';
const initProcess = async (): Promise<void> => {
  await createConnection();
  Queue.process();
};

initProcess();

console.log('Queue is running!');
