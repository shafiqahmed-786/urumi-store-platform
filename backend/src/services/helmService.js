const path = require("path");
const { execCmd } = require("../utils/exec");

// Absolute paths (quoted for Windows)
const HELM = `"C:\\ProgramData\\chocolatey\\bin\\helm.exe"`;

// Quote repo root to handle spaces in path
const REPO_ROOT = `"${path.resolve(__dirname, "../../../")}"`;

/**
 * Check if a Helm release already exists
 * This is used for idempotency
 */
async function releaseExists(storeId) {
  try {
    await execCmd(`${HELM} status ${storeId} --namespace ${storeId}`);
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  /**
   * Install a store via Helm (idempotent)
   */
  async installStore(storeId) {
    const namespace = storeId;

    // ✅ Idempotency guard at Helm level
    if (await releaseExists(storeId)) {
      console.log(`[helm] release ${storeId} already exists, skipping install`);
      return;
    }

    const cmd =
      `${HELM} install ${storeId} ${REPO_ROOT}\\charts\\store ` +
      `-f ${REPO_ROOT}\\charts\\store\\values.yaml ` +
      `-f ${REPO_ROOT}\\charts\\store\\values-local.yaml ` +
      `--namespace ${namespace} ` +
      `--create-namespace`;

    console.log("[helm] running command:");
    console.log(cmd);

    const output = await execCmd(cmd);
    console.log("[helm] output:");
    console.log(output);

    return output;
  },

  /**
   * Uninstall a store and clean up namespace
   */
  async uninstallStore(storeId) {
    try {
      await execCmd(`${HELM} uninstall ${storeId} --namespace ${storeId}`);
    } catch (err) {
      console.warn(`[helm] uninstall skipped for ${storeId}`);
    }

    await execCmd(`kubectl delete namespace ${storeId} --ignore-not-found`);
  }
};
