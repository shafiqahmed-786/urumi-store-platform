const JobQueue = require("./jobQueue");
const { provisionStore } = require("../workers/provisionWorker");

const provisionQueue = new JobQueue({ concurrency: 1 }); // start conservative

module.exports = {
  enqueueProvision(storeId) {
    provisionQueue.enqueue(() => provisionStore(storeId));
  }
};
