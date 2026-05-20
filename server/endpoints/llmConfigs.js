const { GlobalProviderOrchestrator } = require("../utils/llm/ProviderOrchestrator");
const { reqBody } = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { flexUserRoleValid, ROLES } = require("../utils/middleware/multiUserProtected");
const prisma = require("../utils/prisma");
const { EncryptionManager } = require("../utils/EncryptionManager");

function llmConfigEndpoints(app) {
  if (!app) return;

  // Get all LLM provider configs
  app.get(
    "/system/llm-configs",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (_, response) => {
      try {
        const configs = await prisma.llm_provider_keys.findMany({
          orderBy: { createdAt: "desc" },
        });

        // Mask keys before sending to frontend
        const maskedConfigs = configs.map((c) => {
          const { encrypted_key, ...rest } = c;
          return {
            ...rest,
            key_preview: "••••••••" + encrypted_key.slice(-4),
          };
        });

        response.status(200).json({ configs: maskedConfigs });
      } catch (e) {
        console.error(e.message);
        response.sendStatus(500).end();
      }
    }
  );

  // Add a new LLM provider key
  app.post(
    "/system/llm-configs/add",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { provider, label, apiKey, model, baseUrl, priority } = reqBody(request);
        const encryption = new EncryptionManager();

        const newKey = await prisma.llm_provider_keys.create({
          data: {
            provider,
            label,
            encrypted_key: encryption.encrypt(apiKey),
            model,
            base_url: baseUrl,
            priority: parseInt(priority) || 0,
            active: true,
          },
        });

        await GlobalProviderOrchestrator.reload();
        response.status(200).json({ success: true, key: newKey });
      } catch (e) {
        console.error(e.message);
        response.status(500).json({ success: false, error: e.message });
      }
    }
  );

  // Toggle key active status
  app.post(
    "/system/llm-configs/:id/toggle",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = request.params;
        const key = await prisma.llm_provider_keys.findUnique({ where: { id: parseInt(id) } });
        
        if (!key) return response.status(404).json({ error: "Key not found" });

        await prisma.llm_provider_keys.update({
          where: { id: parseInt(id) },
          data: { active: !key.active },
        });

        await GlobalProviderOrchestrator.reload();
        response.status(200).json({ success: true });
      } catch (e) {
        console.error(e.message);
        response.sendStatus(500).end();
      }
    }
  );

  // Delete an LLM provider key
  app.delete(
    "/system/llm-configs/:id",
    [validatedRequest, flexUserRoleValid([ROLES.admin])],
    async (request, response) => {
      try {
        const { id } = request.params;
        await prisma.llm_provider_keys.delete({ where: { id: parseInt(id) } });
        await GlobalProviderOrchestrator.reload();
        response.status(200).json({ success: true });
      } catch (e) {
        console.error(e.message);
        response.sendStatus(500).end();
      }
    }
  );
}

module.exports = { llmConfigEndpoints };
