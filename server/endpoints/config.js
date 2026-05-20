const { SystemSettings } = require("../models/systemSettings");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { flexUserRoleValid, ROLES } = require("../utils/middleware/multiUserProtected");
const { reqBody } = require("../utils/http");
const { Workspace } = require("../models/workspace");
const { EmbedConfig } = require("../models/embedConfig");

function configEndpoints(router) {
  router.get("/config", async (request, response) => {
    try {
      const settings = {};
      const labels = [
        "seetech_chat_heading",
        "seetech_chat_subtitle",
        "seetech_chat_suggested_prompts",
        "seetech_chat_placeholder",
        "seetech_welcome_message",
        "seetech_primary_color",
        "seetech_bg_primary",
        "seetech_typography",
        "antigravity_branding"
      ];
      
      for (const label of labels) {
        settings[label] = await SystemSettings.getValueOrFallback({ label }, null);
      }
      
      response.status(200).json({ config: settings });
    } catch (e) {
      console.error(e);
      response.status(500).json({ error: "Internal server error" });
    }
  });

  router.post(
    "/config",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const updates = reqBody(request);
        const allowedKeys = [
          "seetech_chat_heading",
          "seetech_chat_subtitle",
          "seetech_chat_suggested_prompts",
          "seetech_chat_placeholder",
          "seetech_welcome_message",
          "seetech_primary_color",
          "seetech_bg_primary",
          "seetech_typography",
          "antigravity_branding"
        ];
        
        const filteredUpdates = {};
        for (const key of Object.keys(updates)) {
          if (allowedKeys.includes(key)) {
            filteredUpdates[key] = updates[key];
          }
        }

        await SystemSettings.updateSettings(filteredUpdates);
        response.status(200).json({ success: true, error: null });
      } catch (e) {
        console.error(e);
        response.status(500).json({ success: false, error: "Internal server error" });
      }
    }
  );

  router.get("/public-workspace", async (request, response) => {
    try {
      const embedUuid = await SystemSettings.getValueOrFallback({ label: "seetech_public_embed_uuid" }, null);
      if (!embedUuid) {
        return response.status(200).json({ embed_uuid: null, workspace_id: null });
      }
      
      const embedConfig = await EmbedConfig.getWithWorkspace({ uuid: embedUuid });
      if (!embedConfig) {
        return response.status(200).json({ embed_uuid: null, workspace_id: null, workspace: null });
      }

      response.status(200).json({ 
        embed_uuid: embedConfig.uuid, 
        workspace_id: embedConfig.workspace_id,
        workspace: embedConfig.workspace
      });
    } catch (e) {
      console.error(e);
      response.status(500).json({ error: "Internal server error" });
    }
  });

  router.post(
    "/public-workspace",
    [validatedRequest, flexUserRoleValid([ROLES.admin, ROLES.manager])],
    async (request, response) => {
      try {
        const { workspaceId } = reqBody(request);
        if (!workspaceId) {
          return response.status(400).json({ success: false, error: "Missing workspaceId" });
        }

        const workspace = await Workspace.get({ id: Number(workspaceId) });
        if (!workspace) {
          return response.status(404).json({ success: false, error: "Workspace not found" });
        }

        let embedConfig = await EmbedConfig.get({ workspace_id: Number(workspaceId) });
        if (!embedConfig) {
          const { embed } = await EmbedConfig.new({
            workspace_id: Number(workspaceId),
            chat_mode: "chat",
            enabled: true,
          });
          if (!embed) {
            return response.status(500).json({ success: false, error: "Failed to create EmbedConfig" });
          }
          embedConfig = embed;
        }

        await SystemSettings.updateSettings({ seetech_public_embed_uuid: embedConfig.uuid });
        response.status(200).json({ success: true, embed_uuid: embedConfig.uuid });
      } catch (e) {
        console.error(e);
        response.status(500).json({ success: false, error: "Internal server error" });
      }
    }
  );
}

module.exports = { configEndpoints };
