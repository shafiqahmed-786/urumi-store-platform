class JobQueue {
  constructor({ concurrency = 1 } = {}) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  enqueue(job) {
    this.queue.push(job);
    this._next();
  }

  async _next() {
    if (this.running >= this.concurrency) return;
    const job = this.queue.shift();
    if (!job) return;

    this.running++;

    try {
      await job();
    } catch (err) {
      console.error("[jobQueue] job failed", err);
      // swallow error so queue continues
    } finally {
      this.running--;
      this._next();
    }
  }
}

module.exports = JobQueue;
