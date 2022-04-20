import Queue from 'bull';
import * as jobs from '../jobs';
import redisConfig from '../config/redis';

const queues: any[] = Object.values(jobs).map(job => ({
  bull: new Queue(job.key, redisConfig),
  name: job.key,
  handle: job.handle,
  options: job.options,
}));

export default {
  queues,
  add(name: string, data: any): any {
    const queue = this.queues.find(queueItem => queueItem.name === name);

    return queue.bull.add(data, queue.options);
  },
  process(): any {
    return this.queues.forEach(queue => {
      queue.bull.process(queue.handle);

      queue.bull.on('failed', (job: any, err: any) => {
        console.log('Job failed', queue.key, job.data);
        console.log(err);
      });
    });
  },
};
