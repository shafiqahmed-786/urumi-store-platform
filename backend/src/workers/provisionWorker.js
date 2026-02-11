const storeRepo = require("../db/storeRepo");
const helmService = require("../services/helmService");
const { withRetry } = require("../utils/retry");

async function provisionStore(storeId) {
  const store = storeRepo.get(storeId);

  // ✅ Idempotency guard
  if (!store || store.status !== "Queued") {
    console.log(`[store:${storeId}] skipping provisioning (status=${store?.status})`);
    return;
  }

  try {
    storeRepo.updateStatus(storeId, "Provisioning");

    await withRetry(
      async () => {
        await helmService.installStore(storeId);
      },
      { retries: 1 } // IMPORTANT: retries ≠ re-install loops
    );

    storeRepo.updateStatus(storeId, "Ready");
  } catch (err) {
    console.error(`[store:${storeId}] provisioning failed`, err);
    storeRepo.updateStatus(storeId, "Failed");
  }
}

module.exports = { provisionStore };
