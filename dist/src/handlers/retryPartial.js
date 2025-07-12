"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryPartialHandler = void 0;
const queue_1 = require("../providers/queue");
async function retryPartial(req, queue) {
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
exports.retryPartialHandler = (0, queue_1.queueProvider)(retryPartial);
//# sourceMappingURL=retryPartial.js.map