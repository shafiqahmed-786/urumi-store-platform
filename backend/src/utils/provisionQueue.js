const MAX_CONCURRENT = 2; // safe limit for local cluster

let active = 0;
const queue = [];

function enqueue(task) {
  queue.push(task);
  processQueue();
}

function processQueue() {
  if (active >= MAX_CONCURRENT) return;
  if (queue.length === 0) return;

  const task = queue.shift();
  active++;

  task(() => {
    active--;
    processQueue();
  });
}

module.exports = { enqueue };
