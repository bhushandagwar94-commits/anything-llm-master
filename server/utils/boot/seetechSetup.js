const { Workspace } = require("../../models/workspace");
const { EmbedConfig } = require("../../models/embedConfig");
const { SystemSettings } = require("../../models/systemSettings");

async function seetechSetup() {
  try {
    console.log("\x1b[34m[SEETECH SETUP]\x1b[0m Initializing public access layer...");

    // 1. Ensure a public workspace exists
    let publicWorkspace = await Workspace.get({ name: "SEETECH Public" });
    if (!publicWorkspace) {
      console.log("\x1b[34m[SEETECH SETUP]\x1b[0m Creating default public workspace...");
      const { workspace } = await Workspace.new("SEETECH Public");
      publicWorkspace = workspace;
    }

    if (!publicWorkspace) {
      console.error("\x1b[31m[SEETECH SETUP]\x1b[0m Failed to find or create public workspace.");
      return;
    }

    // 2. Ensure an embed config exists for this workspace
    let embed = await EmbedConfig.get({ workspace_id: publicWorkspace.id });
    if (!embed) {
      console.log("\x1b[34m[SEETECH SETUP]\x1b[0m Creating public embed configuration...");
      const { embed: newEmbed } = await EmbedConfig.new({
        workspace_id: publicWorkspace.id,
        chat_mode: "chat",
        enabled: true,
      });
      embed = newEmbed;
    }

    if (embed) {
      // 3. Store the UUID in system settings
      await SystemSettings._updateSettings({
        seetech_public_embed_uuid: embed.uuid,
      });
      console.log(`\x1b[34m[SEETECH SETUP]\x1b[0m Public access enabled with UUID: ${embed.uuid}`);
    }
  } catch (e) {
    console.error("\x1b[31m[SEETECH SETUP] FAILED\x1b[0m", e.message);
  }
}

module.exports = seetechSetup;
