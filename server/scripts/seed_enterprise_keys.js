const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { EncryptionManager } = require("../utils/EncryptionManager");

const keysToSeed = [
  { label: "OPENAI_API_KEY", key: "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" },
  { label: "GPT_API_KEY", key: "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" },
  { label: "EMBEDDING_API_KEY", key: "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" },
  { label: "OPENAI2_API_KEY", key: "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" },
  { label: "COBUDDY_API_KEY", key: "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" },
  { label: "FREEAI_API_KEY", key: "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" },
];

async function seed() {
  const encryption = new EncryptionManager();
  console.log("Seeding Enterprise AI Keys...");

  for (const item of keysToSeed) {
    try {
      const existing = await prisma.llm_provider_keys.findFirst({
        where: { label: item.label }
      });

      if (!existing) {
        await prisma.llm_provider_keys.create({
          data: {
            provider: "openrouter", // Defaulting to OpenRouter based on key format
            label: item.label,
            encrypted_key: encryption.encrypt(item.key),
            active: true,
            priority: 100,
          }
        });
        console.log(`[SUCCESS] Seeded: ${item.label}`);
      } else {
        console.log(`[SKIP] Already exists: ${item.label}`);
      }
    } catch (e) {
      console.error(`[ERROR] Failed to seed ${item.label}:`, e.message);
    }
  }

  console.log("Seeding complete.");
  await prisma.$disconnect();
}

seed();
