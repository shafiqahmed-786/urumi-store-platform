const { exec } = require("child_process");

function execCmd(command, { timeoutMs = 10 * 60 * 1000 } = {}) {
  return new Promise((resolve, reject) => {
    exec(
      command,
      { maxBuffer: 1024 * 1024, timeout: timeoutMs },
      (error, stdout, stderr) => {
        if (error) reject(stderr || error.message);
        else resolve(stdout);
      }
    );
  });
}

module.exports = { execCmd };
