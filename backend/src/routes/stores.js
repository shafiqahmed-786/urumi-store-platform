const express = require("express");
const { v4: uuidv4 } = require("uuid");
const storeRepo = require("../db/storeRepo");
const { exec } = require("child_process");
const path = require("path");
const auditRepo = require("../db/auditRepo");
const provisionQueue = require("../utils/provisionQueue");

const router = express.Router();

/**
 * POST /stores
 */
router.post("/", async (req, res) => {
  const storeId = `store-${uuidv4().slice(0, 6)}`;

  const store = {
    id: storeId,
    type: "woocommerce",
    status: "Queued",
    namespace: storeId,
    createdAt: new Date().toISOString(),
  };

  storeRepo.create(store);

  auditRepo.log({
    storeId,
    action: "CREATE",
    ip: req.ip,
    status: "Queued",
    message: "Store provisioning requested",
  });

  res.status(202).json(store);

  // ✅ USE QUEUE INSTEAD OF setImmediate
  provisionQueue.enqueue((done) => {

    const chartPath = path.resolve(__dirname, "../../../charts/store");
    const valuesFile =
            process.env.ENVIRONMENT === "prod"
              ? "values-prod.yaml"
              : "values-local.yaml";

          const valuesPath = path.join(chartPath, valuesFile);


    const checkCmd = `helm status ${storeId} -n ${storeId}`;

    console.log(`[store:${storeId}] Checking existing release...`);
    storeRepo.updateStatus(storeId, "Provisioning");

    exec(checkCmd, (checkErr, checkStdout) => {

      if (!checkErr && checkStdout.includes("STATUS: failed")) {
        console.log(`[store:${storeId}] Previous failed release detected. Cleaning up...`);

        exec(`helm uninstall ${storeId} -n ${storeId}`, () => {
          runHelmInstall();
        });

      } else {
        runHelmInstall();
      }
    });

    function runHelmInstall() {
      const helmCmd = `helm upgrade --install ${storeId} "${chartPath}" --namespace ${storeId} --create-namespace -f "${valuesPath}"`;

      console.log(`[store:${storeId}] Running Helm upgrade/install...`);

      exec(helmCmd, (error, stdout, stderr) => {
        if (error) {
          console.error(`[store:${storeId}] Helm install failed`, stderr);

          storeRepo.updateStatus(storeId, "Failed");

          auditRepo.log({
            storeId,
            action: "CREATE",
            ip: "system",
            status: "Failed",
            message: stderr,
          });

          done(); // ✅ IMPORTANT
          return;
        }

        waitForReady();
      });
    }

    function waitForReady() {
      const waitCmd = `kubectl rollout status deployment/wordpress -n ${storeId} --timeout=300s`;

      console.log(`[store:${storeId}] Waiting for rollout...`);

      exec(waitCmd, (waitErr, waitStdout, waitStderr) => {
        if (waitErr) {
          console.error(`[store:${storeId}] Rollout failed`, waitStderr);

          storeRepo.updateStatus(storeId, "Failed");

          auditRepo.log({
            storeId,
            action: "CREATE",
            ip: "system",
            status: "Failed",
            message: waitStderr,
          });

          done(); // ✅ IMPORTANT
          return;
        }

        console.log(`[store:${storeId}] Store is Ready.`);

        storeRepo.updateStatus(storeId, "Ready");

        auditRepo.log({
          storeId,
          action: "CREATE",
          ip: "system",
          status: "Ready",
          message: "Provisioning completed successfully",
        });

        done(); // ✅ IMPORTANT
      });
    }
  });
});


/**
 * GET /stores
 */
router.get("/", (req, res) => {
  res.json(storeRepo.list());
});

/**
 * GET /stores/:id
 */
router.get("/:id", (req, res) => {
  const store = storeRepo.get(req.params.id);
  if (!store) return res.status(404).json({ error: "Store not found" });
  res.json(store);
});

/**
 * DELETE /stores/:id
 */
router.delete("/:id", async (req, res) => {
  const store = storeRepo.get(req.params.id);
  if (!store) return res.status(404).json({ error: "Store not found" });

  try {
    storeRepo.updateStatus(store.id, "Deleting");

    auditRepo.log({
      storeId: store.id,
      action: "DELETE",
      ip: req.ip,
      status: "Started",
      message: "Store deletion requested",
    });

    const uninstallCmd = `helm uninstall ${store.id} -n ${store.id}`;

    exec(uninstallCmd, (error, stdout, stderr) => {
      if (error) {
        console.error(`[store:${store.id}] Helm uninstall failed`, stderr);
        storeRepo.updateStatus(store.id, "Failed");

        auditRepo.log({
          storeId: store.id,
          action: "DELETE",
          ip: "system",
          status: "Failed",
          message: stderr,
        });

        return res.status(500).json({ error: "Deletion failed" });
      }

      storeRepo.delete(store.id);

      auditRepo.log({
        storeId: store.id,
        action: "DELETE",
        ip: req.ip,
        status: "Completed",
        message: "Store deleted successfully",
      });

      console.log(`[store:${store.id}] Successfully deleted`);
      res.status(204).send();
    });

  } catch (err) {
    console.error(`[store:${store.id}] deletion failed`, err);
    res.status(500).json({ error: "Deletion failed" });
  }
});

/**
 * GET /stores/audit/logs
 */
router.get("/audit/logs", async (req, res) => {
  const logs = await auditRepo.list();
  res.json(logs);
});

module.exports = router;
