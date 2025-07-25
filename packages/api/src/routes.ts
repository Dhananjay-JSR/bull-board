import { AppRouteDefs } from '../typings/app';
import { addJobHandler } from './handlers/addJob';
import { cleanAllHandler } from './handlers/cleanAll';
import { cleanJobHandler } from './handlers/cleanJob';
import { emptyQueueHandler } from './handlers/emptyQueue';
import { entryPoint } from './handlers/entryPoint';
import { jobLogsHandler } from './handlers/jobLogs';
import { jobHandler } from './handlers/job';
import { pauseQueueHandler } from './handlers/pauseQueue';
import { promoteJobHandler } from './handlers/promotJob';
import { queuesHandler } from './handlers/queues';
import { redisStatsHandler } from './handlers/redisStats';
import { resumeQueueHandler } from './handlers/resumeQueue';
import { retryAllHandler } from './handlers/retryAll';
import { retryJobHandler } from './handlers/retryJob';
import { promoteAllHandler } from './handlers/promoteAll';
import { updateJobDataHandler } from './handlers/updateJobData';
import { pauseAllHandler } from './handlers/pauseAll';
import { resumeAllHandler } from './handlers/resumeAll';
import { retryPartialHandler } from './handlers/retryPartial';

export const appRoutes: AppRouteDefs = {
  entryPoint: {
    method: 'get',
    route: ['/', '/queue/:queueName', '/queue/:queueName/:jobId'],
    handler: entryPoint,
  },
  api: [
    { method: 'get', route: '/api/redis/stats', handler: redisStatsHandler },
    { method: 'get', route: '/api/queues', handler: queuesHandler },
    { method: 'put', route: '/api/queues/pause', handler: pauseAllHandler },
    { method: 'put', route: '/api/queues/resume', handler: resumeAllHandler },
    {
      method: 'get',
      route: '/api/queues/:queueName/:jobId/logs',
      handler: jobLogsHandler,
    },
    {
      method: 'get',
      route: '/api/queues/:queueName/:jobId',
      handler: jobHandler,
    },
    {
      method: 'post',
      route: '/api/queues/:queueName/add',
      handler: addJobHandler,
    },
    {
      method: 'put',
      route: '/api/queues/:queueName/retry/:queueStatus',
      handler: retryAllHandler,
    },
    {
      method: 'post',
      route: '/api/queues/:queueName/retry-partial/:queueStatus',
      handler: retryPartialHandler,
    },
    {
      method: 'put',
      route: '/api/queues/:queueName/promote',
      handler: promoteAllHandler,
    },
    {
      method: 'put',
      route: '/api/queues/:queueName/clean/:queueStatus',
      handler: cleanAllHandler,
    },
    {
      method: 'put',
      route: '/api/queues/:queueName/pause',
      handler: pauseQueueHandler,
    },
    {
      method: 'put',
      route: '/api/queues/:queueName/resume',
      handler: resumeQueueHandler,
    },
    {
      method: 'put',
      route: '/api/queues/:queueName/empty',
      handler: emptyQueueHandler,
    },
    {
      method: 'put',
      route: '/api/queues/:queueName/:jobId/retry/:queueStatus',
      handler: retryJobHandler,
    },
    {
      method: 'put',
      route: '/api/queues/:queueName/:jobId/clean',
      handler: cleanJobHandler,
    },
    {
      method: 'put',
      route: '/api/queues/:queueName/:jobId/promote',
      handler: promoteJobHandler,
    },
    {
      method: 'patch',
      route: '/api/queues/:queueName/:jobId/update-data',
      handler: updateJobDataHandler,
    },
  ],
};
