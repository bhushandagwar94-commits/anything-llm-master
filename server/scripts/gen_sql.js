const crypto = require("crypto");

const keysToSeed = [
  { label: "OPENAI_API_KEY", key: "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" },
  { label: "GPT_API_KEY", key: "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" },
  { label: "EMBEDDING_API_KEY", key: "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" },
  { label: "OPENAI2_API_KEY", key: "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" },
  { label: "COBUDDY_API_KEY", key: "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" },
  { label: "FREEAI_API_KEY", key: "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" },
];

const SIG_KEY = 'passphrase';
const SIG_SALT = 'salt';

function encrypt(plainTextString) {
  const encryptionKey = crypto.scryptSync(SIG_KEY, SIG_SALT, 32);
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", encryptionKey, iv);
  const encrypted = cipher.update(plainTextString, "utf8", "hex");
  return [
    encrypted + cipher.final("hex"),
    Buffer.from(iv).toString("hex"),
  ].join(":");
}

console.log("-- SQL Migration for Enterprise Keys");
keysToSeed.forEach(item => {
  const encrypted = encrypt(item.key);
  console.log(`INSERT INTO llm_provider_keys (provider, label, encrypted_key, active, priority, health_score, failure_count, createdAt, updatedAt) VALUES ('openrouter', '${item.label}', '${encrypted}', 1, 100, 100, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);`);
});
