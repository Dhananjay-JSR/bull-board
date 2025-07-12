import { BullBoardRequest, ControllerHandlerReturnType } from '../../typings/app';
import { BaseAdapter } from '../queueAdapters/base';
import { queueProvider } from '../providers/queue';

async function retryPartial(
  req: BullBoardRequest,
  queue: BaseAdapter,
): Promise<ControllerHandlerReturnType> {
  const { queueStatus } = req.params;
  const { count } = req.body;

  if (!count || count <= 0) {
    return { 
      status: 500, 
      body: { error: 'Count parameter is required and must be a positive number' } 
    };
  }

  const jobs = await queue.getJobs([queueStatus]);

  // Limit the number of jobs to retry
  const jobsToRetry = jobs.slice(0, count);

  await Promise.all(jobsToRetry.map((job) => job.retry(queueStatus)));

  return { status: 200, body: { retriedCount: jobsToRetry.length } };
}

export const retryPartialHandler = queueProvider(retryPartial);