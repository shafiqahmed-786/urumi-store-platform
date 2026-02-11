const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function withRetry(fn, {
  retries = 3,
  baseDelayMs = 2000,
  factor = 2
} = {}) {
  let attempt = 0;
  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;
      if (attempt > retries) throw err;
      const delay = baseDelayMs * Math.pow(factor, attempt - 1);
      await sleep(delay);
    }
  }
}

module.exports = { withRetry };
