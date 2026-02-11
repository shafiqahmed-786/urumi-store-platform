const storeRepo = require("../db/storeRepo");
const helmService = require("../services/helmService");
const { withRetry } = require("../utils/retry");

async function deleteStore(storeId) {
  storeRepo.updateStatus(storeId, "Deleting");

  await withRetry(
    async () => {
      await helmService.uninstallStore(storeId);
    },
    { retries: 1, baseDelayMs: 2000 }
  );

  storeRepo.delete(storeId);
}

module.exports = { deleteStore };
