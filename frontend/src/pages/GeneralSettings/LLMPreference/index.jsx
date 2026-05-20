import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import Sidebar from "@/components/SettingsSidebar";
import { isMobile } from "react-device-detect";
import System from "@/models/system";
import showToast from "@/utils/toast";
import AnythingLLMIcon from "@/media/logo/anything-llm-icon.png";
import OpenAiLogo from "@/media/llmprovider/openai.png";
import GenericOpenAiLogo from "@/media/llmprovider/generic-openai.png";
import AzureOpenAiLogo from "@/media/llmprovider/azure.png";
import AnthropicLogo from "@/media/llmprovider/anthropic.png";
import GeminiLogo from "@/media/llmprovider/gemini.png";
import OllamaLogo from "@/media/llmprovider/ollama.png";
import NovitaLogo from "@/media/llmprovider/novita.png";
import LMStudioLogo from "@/media/llmprovider/lmstudio.png";
import LocalAiLogo from "@/media/llmprovider/localai.png";
import TogetherAILogo from "@/media/llmprovider/togetherai.png";
import FireworksAILogo from "@/media/llmprovider/fireworksai.jpeg";
import MistralLogo from "@/media/llmprovider/mistral.jpeg";
import HuggingFaceLogo from "@/media/llmprovider/huggingface.png";
import PerplexityLogo from "@/media/llmprovider/perplexity.png";
import OpenRouterLogo from "@/media/llmprovider/openrouter.jpeg";
import GroqLogo from "@/media/llmprovider/groq.png";
import KoboldCPPLogo from "@/media/llmprovider/koboldcpp.png";
import TextGenWebUILogo from "@/media/llmprovider/text-generation-webui.png";
import CohereLogo from "@/media/llmprovider/cohere.png";
import LiteLLMLogo from "@/media/llmprovider/litellm.png";
import AWSBedrockLogo from "@/media/llmprovider/bedrock.png";
import DeepSeekLogo from "@/media/llmprovider/deepseek.png";
import APIPieLogo from "@/media/llmprovider/apipie.png";
import XAILogo from "@/media/llmprovider/xai.png";
import ZAiLogo from "@/media/llmprovider/zai.png";
import NvidiaNimLogo from "@/media/llmprovider/nvidia-nim.png";
import PPIOLogo from "@/media/llmprovider/ppio.png";
import DellProAiStudioLogo from "@/media/llmprovider/dpais.png";
import MoonshotAiLogo from "@/media/llmprovider/moonshotai.png";
import CometApiLogo from "@/media/llmprovider/cometapi.png";
import FoundryLogo from "@/media/llmprovider/foundry-local.png";
import GiteeAILogo from "@/media/llmprovider/giteeai.png";
import DockerModelRunnerLogo from "@/media/llmprovider/docker-model-runner.png";
import PrivateModeLogo from "@/media/llmprovider/privatemode.png";
import SambaNovaLogo from "@/media/llmprovider/sambanova.png";
import LemonadeLogo from "@/media/llmprovider/lemonade.png";

import PreLoader from "@/components/Preloader";
import OpenAiOptions from "@/components/LLMSelection/OpenAiOptions";
import GenericOpenAiOptions from "@/components/LLMSelection/GenericOpenAiOptions";
import AzureAiOptions from "@/components/LLMSelection/AzureAiOptions";
import AnthropicAiOptions from "@/components/LLMSelection/AnthropicAiOptions";
import LMStudioOptions from "@/components/LLMSelection/LMStudioOptions";
import LocalAiOptions from "@/components/LLMSelection/LocalAiOptions";
import GeminiLLMOptions from "@/components/LLMSelection/GeminiLLMOptions";
import OllamaLLMOptions from "@/components/LLMSelection/OllamaLLMOptions";
import NovitaLLMOptions from "@/components/LLMSelection/NovitaLLMOptions";
import CometApiLLMOptions from "@/components/LLMSelection/CometApiLLMOptions";
import TogetherAiOptions from "@/components/LLMSelection/TogetherAiOptions";
import FireworksAiOptions from "@/components/LLMSelection/FireworksAiOptions";
import MistralOptions from "@/components/LLMSelection/MistralOptions";
import HuggingFaceOptions from "@/components/LLMSelection/HuggingFaceOptions";
import PerplexityOptions from "@/components/LLMSelection/PerplexityOptions";
import OpenRouterOptions from "@/components/LLMSelection/OpenRouterOptions";
import GroqAiOptions from "@/components/LLMSelection/GroqAiOptions";
import CohereAiOptions from "@/components/LLMSelection/CohereAiOptions";
import KoboldCPPOptions from "@/components/LLMSelection/KoboldCPPOptions";
import TextGenWebUIOptions from "@/components/LLMSelection/TextGenWebUIOptions";
import LiteLLMOptions from "@/components/LLMSelection/LiteLLMOptions";
import AWSBedrockLLMOptions from "@/components/LLMSelection/AwsBedrockLLMOptions";
import DeepSeekOptions from "@/components/LLMSelection/DeepSeekOptions";
import ApiPieLLMOptions from "@/components/LLMSelection/ApiPieOptions";
import XAILLMOptions from "@/components/LLMSelection/XAiLLMOptions";
import ZAiLLMOptions from "@/components/LLMSelection/ZAiLLMOptions";
import NvidiaNimOptions from "@/components/LLMSelection/NvidiaNimOptions";
import PPIOLLMOptions from "@/components/LLMSelection/PPIOLLMOptions";
import DellProAiStudioOptions from "@/components/LLMSelection/DPAISOptions";
import MoonshotAiOptions from "@/components/LLMSelection/MoonshotAiOptions";
import FoundryOptions from "@/components/LLMSelection/FoundryOptions";
import GiteeAIOptions from "@/components/LLMSelection/GiteeAIOptions/index.jsx";
import DockerModelRunnerOptions from "@/components/LLMSelection/DockerModelRunnerOptions";
import PrivateModeOptions from "@/components/LLMSelection/PrivateModeOptions";
import SambaNovaOptions from "@/components/LLMSelection/SambaNovaOptions";
import LemonadeOptions from "@/components/LLMSelection/LemonadeOptions";
import MultiKeyManager from "./MultiKeyManager";

import LLMItem from "@/components/LLMSelection/LLMItem";
import { CaretUpDown, MagnifyingGlass, X, Activity } from "@phosphor-icons/react";
import CTAButton from "@/components/lib/CTAButton";

export const AVAILABLE_LLM_PROVIDERS = [
  {
    name: "OpenAI",
    value: "openai",
    logo: OpenAiLogo,
    options: (settings) => <OpenAiOptions settings={settings} />,
    description: "The standard option for most non-commercial use.",
    requiredConfig: ["OpenAiKey"],
  },
  {
    name: "Azure OpenAI",
    value: "azure",
    logo: AzureOpenAiLogo,
    options: (settings) => <AzureAiOptions settings={settings} />,
    description: "The enterprise option of OpenAI hosted on Azure services.",
    requiredConfig: ["AzureOpenAiEndpoint"],
  },
  {
    name: "Anthropic",
    value: "anthropic",
    logo: AnthropicLogo,
    options: (settings) => <AnthropicAiOptions settings={settings} />,
    description: "A friendly AI Assistant hosted by Anthropic.",
    requiredConfig: ["AnthropicApiKey"],
  },
  {
    name: "Gemini",
    value: "gemini",
    logo: GeminiLogo,
    options: (settings) => <GeminiLLMOptions settings={settings} />,
    description: "Google's largest and most capable AI model",
    requiredConfig: ["GeminiLLMApiKey"],
  },
  {
    name: "NVIDIA NIM",
    value: "nvidia-nim",
    logo: NvidiaNimLogo,
    options: (settings) => <NvidiaNimOptions settings={settings} />,
    description:
      "Run full parameter LLMs directly on your NVIDIA RTX GPU using NVIDIA NIM.",
    requiredConfig: ["NvidiaNimLLMBasePath"],
  },
  {
    name: "HuggingFace",
    value: "huggingface",
    logo: HuggingFaceLogo,
    options: (settings) => <HuggingFaceOptions settings={settings} />,
    description:
      "Access 150,000+ open-source LLMs and the world's AI community",
    requiredConfig: [
      "HuggingFaceLLMEndpoint",
      "HuggingFaceLLMAccessToken",
      "HuggingFaceLLMTokenLimit",
    ],
  },
  {
    name: "Ollama",
    value: "ollama",
    logo: OllamaLogo,
    options: (settings) => <OllamaLLMOptions settings={settings} />,
    description: "Run LLMs locally on your own machine.",
    requiredConfig: ["OllamaLLMBasePath"],
  },
  {
    name: "Dell Pro AI Studio",
    value: "dpais",
    logo: DellProAiStudioLogo,
    options: (settings) => <DellProAiStudioOptions settings={settings} />,
    description:
      "Run powerful LLMs quickly on NPU powered by Dell Pro AI Studio.",
    requiredConfig: [
      "DellProAiStudioBasePath",
      "DellProAiStudioModelPref",
      "DellProAiStudioTokenLimit",
    ],
  },
  {
    name: "LM Studio",
    value: "lmstudio",
    logo: LMStudioLogo,
    options: (settings) => <LMStudioOptions settings={settings} />,
    description:
      "Discover, download, and run thousands of cutting edge LLMs in a few clicks.",
    requiredConfig: ["LMStudioBasePath"],
  },
  {
    name: "Docker Model Runner",
    value: "docker-model-runner",
    logo: DockerModelRunnerLogo,
    options: (settings) => <DockerModelRunnerOptions settings={settings} />,
    description: "Run LLMs using Docker Model Runner.",
    requiredConfig: [
      "DockerModelRunnerBasePath",
      "DockerModelRunnerModelPref",
      "DockerModelRunnerModelTokenLimit",
    ],
  },
  {
    name: "Lemonade",
    value: "lemonade",
    logo: LemonadeLogo,
    options: (settings) => <LemonadeOptions settings={settings} />,
    description:
      "Run local LLMs, ASR, TTS, and more in a single unified AI runtime.",
    requiredConfig: ["LemonadeLLMBasePath"],
  },
  {
    name: "SambaNova",
    value: "sambanova",
    logo: SambaNovaLogo,
    options: (settings) => <SambaNovaOptions settings={settings} />,
    description: "Run open source models from SambaNova.",
    requiredConfig: ["SambaNovaLLMApiKey"],
  },
  {
    name: "Local AI",
    value: "localai",
    logo: LocalAiLogo,
    options: (settings) => <LocalAiOptions settings={settings} />,
    description: "Run LLMs locally on your own machine.",
    requiredConfig: ["LocalAiApiKey", "LocalAiBasePath", "LocalAiTokenLimit"],
  },
  {
    name: "Together AI",
    value: "togetherai",
    logo: TogetherAILogo,
    options: (settings) => <TogetherAiOptions settings={settings} />,
    description: "Run open source models from Together AI.",
    requiredConfig: ["TogetherAiApiKey"],
  },

  {
    name: "Fireworks AI",
    value: "fireworksai",
    logo: FireworksAILogo,
    options: (settings) => <FireworksAiOptions settings={settings} />,
    description:
      "The fastest and most efficient inference engine to build production-ready, compound AI systems.",
    requiredConfig: ["FireworksAiLLMApiKey"],
  },
  {
    name: "Mistral",
    value: "mistral",
    logo: MistralLogo,
    options: (settings) => <MistralOptions settings={settings} />,
    description: "Run open source models from Mistral AI.",
    requiredConfig: ["MistralApiKey"],
  },
  {
    name: "Perplexity AI",
    value: "perplexity",
    logo: PerplexityLogo,
    options: (settings) => <PerplexityOptions settings={settings} />,
    description:
      "Run powerful and internet-connected models hosted by Perplexity AI.",
    requiredConfig: ["PerplexityApiKey"],
  },
  {
    name: "OpenRouter",
    value: "openrouter",
    logo: OpenRouterLogo,
    options: (settings) => <OpenRouterOptions settings={settings} />,
    description: "A unified interface for LLMs.",
    requiredConfig: ["OpenRouterApiKey"],
  },
  {
    name: "Groq",
    value: "groq",
    logo: GroqLogo,
    options: (settings) => <GroqAiOptions settings={settings} />,
    description:
      "The fastest LLM inferencing available for real-time AI applications.",
    requiredConfig: ["GroqApiKey"],
  },
  {
    name: "KoboldCPP",
    value: "koboldcpp",
    logo: KoboldCPPLogo,
    options: (settings) => <KoboldCPPOptions settings={settings} />,
    description: "Run local LLMs using koboldcpp.",
    requiredConfig: [
      "KoboldCPPModelPref",
      "KoboldCPPBasePath",
      "KoboldCPPTokenLimit",
    ],
  },
  {
    name: "Oobabooga Web UI",
    value: "textgenwebui",
    logo: TextGenWebUILogo,
    options: (settings) => <TextGenWebUIOptions settings={settings} />,
    description: "Run local LLMs using Oobabooga's Text Generation Web UI.",
    requiredConfig: ["TextGenWebUIBasePath", "TextGenWebUITokenLimit"],
  },
  {
    name: "Cohere",
    value: "cohere",
    logo: CohereLogo,
    options: (settings) => <CohereAiOptions settings={settings} />,
    description: "Run Cohere's powerful Command models.",
    requiredConfig: ["CohereApiKey"],
  },
  {
    name: "LiteLLM",
    value: "litellm",
    logo: LiteLLMLogo,
    options: (settings) => <LiteLLMOptions settings={settings} />,
    description: "Run LiteLLM's OpenAI compatible proxy for various LLMs.",
    requiredConfig: ["LiteLLMBasePath"],
  },
  {
    name: "DeepSeek",
    value: "deepseek",
    logo: DeepSeekLogo,
    options: (settings) => <DeepSeekOptions settings={settings} />,
    description: "Run DeepSeek's powerful LLMs.",
    requiredConfig: ["DeepSeekApiKey"],
  },
  {
    name: "PPIO",
    value: "ppio",
    logo: PPIOLogo,
    options: (settings) => <PPIOLLMOptions settings={settings} />,
    description:
      "Run stable and cost-efficient open-source LLM APIs, such as DeepSeek, Llama, Qwen etc.",
    requiredConfig: ["PPIOApiKey"],
  },
  {
    name: "AWS Bedrock",
    value: "bedrock",
    logo: AWSBedrockLogo,
    options: (settings) => <AWSBedrockLLMOptions settings={settings} />,
    description: "Run powerful foundation models privately with AWS Bedrock.",
    requiredConfig: [
      "AwsBedrockLLMAccessKeyId",
      "AwsBedrockLLMAccessKey",
      "AwsBedrockLLMRegion",
      "AwsBedrockLLMModel",
    ],
  },
  {
    name: "APIpie",
    value: "apipie",
    logo: APIPieLogo,
    options: (settings) => <ApiPieLLMOptions settings={settings} />,
    description: "A unified API of AI services from leading providers",
    requiredConfig: ["ApipieLLMApiKey", "ApipieLLMModelPref"],
  },
  {
    name: "Moonshot AI",
    value: "moonshotai",
    logo: MoonshotAiLogo,
    options: (settings) => <MoonshotAiOptions settings={settings} />,
    description: "Run Moonshot AI's powerful LLMs.",
    requiredConfig: ["MoonshotAiApiKey"],
  },
  {
    name: "Privatemode",
    value: "privatemode",
    logo: PrivateModeLogo,
    options: (settings) => <PrivateModeOptions settings={settings} />,
    description: "Run LLMs with end-to-end encryption.",
    requiredConfig: ["PrivateModeBasePath"],
  },
  {
    name: "Novita AI",
    value: "novita",
    logo: NovitaLogo,
    options: (settings) => <NovitaLLMOptions settings={settings} />,
    description:
      "Reliable, Scalable, and Cost-Effective for LLMs from Novita AI",
    requiredConfig: ["NovitaLLMApiKey"],
  },
  {
    name: "CometAPI",
    value: "cometapi",
    logo: CometApiLogo,
    options: (settings) => <CometApiLLMOptions settings={settings} />,
    description: "500+ AI Models all in one API.",
    requiredConfig: ["CometApiLLMApiKey"],
  },
  {
    name: "Microsoft Foundry Local",
    value: "foundry",
    logo: FoundryLogo,
    options: (settings) => <FoundryOptions settings={settings} />,
    description: "Run Microsoft's Foundry models locally.",
    requiredConfig: [
      "FoundryBasePath",
      "FoundryModelPref",
      "FoundryModelTokenLimit",
    ],
  },
  {
    name: "xAI",
    value: "xai",
    logo: XAILogo,
    options: (settings) => <XAILLMOptions settings={settings} />,
    description: "Run xAI's powerful LLMs like Grok-2 and more.",
    requiredConfig: ["XAIApiKey", "XAIModelPref"],
  },
  {
    name: "Z.AI",
    value: "zai",
    logo: ZAiLogo,
    options: (settings) => <ZAiLLMOptions settings={settings} />,
    description: "Run Z.AI's powerful GLM models.",
    requiredConfig: ["ZAiApiKey"],
  },
  {
    name: "GiteeAI",
    value: "giteeai",
    logo: GiteeAILogo,
    options: (settings) => <GiteeAIOptions settings={settings} />,
    description: "Run GiteeAI's powerful LLMs.",
    requiredConfig: ["GiteeAIApiKey"],
  },
  {
    name: "Generic OpenAI",
    value: "generic-openai",
    logo: GenericOpenAiLogo,
    options: (settings) => <GenericOpenAiOptions settings={settings} />,
    description:
      "Connect to any OpenAi-compatible service via a custom configuration",
    requiredConfig: [
      "GenericOpenAiBasePath",
      "GenericOpenAiModelPref",
      "GenericOpenAiTokenLimit",
      "GenericOpenAiKey",
    ],
  },
];

export const LLM_PREFERENCE_CHANGED_EVENT = "llm-preference-changed";
export default function GeneralLLMPreference() {
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLLMs, setFilteredLLMs] = useState([]);
  const [selectedLLM, setSelectedLLM] = useState(null);
  const [searchMenuOpen, setSearchMenuOpen] = useState(false);
  const searchInputRef = useRef(null);
  const formRef = useRef(null);
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!formRef.current) return;

    setSaving(true);
    try {
      const data = { LLMProvider: selectedLLM };
      const formData = new FormData(formRef.current);
      for (var [key, value] of formData.entries()) {
        if (!key || value.includes("******")) continue;
        data[key] = value;
      }

      console.log("[LLM CONFIG] Saving settings for:", selectedLLM);
      const { error } = await System.updateSystem(data);

      if (error) {
        showToast(`Failed to save LLM settings: ${error}`, "error");
        setHasChanges(true);
      } else {
        showToast("LLM preferences saved successfully.", "success");
        setHasChanges(false);
      }
    } catch (err) {
      console.error("[LLM ERROR] Manual save failed:", err);
      showToast(`Error during save: ${err.message}`, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!formRef.current) return;

    setTesting(true);
    try {
      const data = { LLMProvider: selectedLLM };
      const formData = new FormData(formRef.current);
      for (var [key, value] of formData.entries()) {
        if (!key) continue;
        data[key] = value;
      }

      showToast(`Testing connection to ${selectedLLM}...`, "info");
      const { success, error } = await System.testLLM(data);

      if (success) {
        showToast(`${selectedLLM} connection successful!`, "success");
      } else {
        showToast(`Connection failed: ${error}`, "error");
      }
    } catch (err) {
      console.error("[LLM ERROR] Connection test failed:", err);
      showToast(`Test failed: ${err.message}`, "error");
    } finally {
      setTesting(false);
    }
  };

  const updateLLMChoice = (selection) => {
    setSearchQuery("");
    setSelectedLLM(selection);
    setSearchMenuOpen(false);
    setHasChanges(true);
  };

  const handleXButton = () => {
    if (searchQuery.length > 0) {
      setSearchQuery("");
      if (searchInputRef.current) searchInputRef.current.value = "";
    } else {
      setSearchMenuOpen(!searchMenuOpen);
    }
  };

  useEffect(() => {
    async function fetchKeys() {
      const _settings = await System.keys();
      setSettings(_settings);
      setSelectedLLM(_settings?.LLMProvider);
      setLoading(false);
    }
    fetchKeys();
  }, []);

  // Some more complex LLM options do not bubble up the change event, so we need to listen to the custom event
  // we can emit from the LLM options component using window.dispatchEvent(new Event(LLM_PREFERENCE_CHANGED_EVENT));
  useEffect(() => {
    function updateHasChanges() {
      setHasChanges(true);
    }
    window.addEventListener(LLM_PREFERENCE_CHANGED_EVENT, updateHasChanges);
    return () => {
      window.removeEventListener(
        LLM_PREFERENCE_CHANGED_EVENT,
        updateHasChanges
      );
    };
  }, []);

  useEffect(() => {
    const filtered = AVAILABLE_LLM_PROVIDERS.filter((llm) =>
      llm.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredLLMs(filtered);
  }, [searchQuery, selectedLLM]);

  const selectedLLMObject = AVAILABLE_LLM_PROVIDERS.find(
    (llm) => llm.value === selectedLLM
  );
  return (
    <div className="w-screen h-screen overflow-hidden bg-[#0b0c14] flex">
      <Sidebar />
      {loading ? (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[24px] bg-[#11121e] w-full h-full overflow-y-scroll p-4 md:p-0 border border-white/5 shadow-2xl"
        >
          <div className="w-full h-full flex justify-center items-center">
            <PreLoader />
          </div>
        </div>
      ) : (
        <div
          style={{ height: isMobile ? "100%" : "calc(100% - 32px)" }}
          className="relative md:ml-[2px] md:mr-[16px] md:my-[16px] md:rounded-[24px] bg-[#11121e] w-full h-full overflow-y-scroll p-4 md:p-8 border border-white/5 shadow-2xl"
        >
          <div className="max-w-4xl mx-auto">
            <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col w-full">
              <div className="w-full flex justify-between items-end pb-8 border-b border-white/10">
                <div className="flex flex-col gap-y-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)]">
                      <Activity className="text-white" size={24} weight="bold" />
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight">
                      AI INFRASTRUCTURE
                    </h1>
                  </div>
                  <p className="text-sm font-medium text-white/40 max-w-lg">
                    Manage industrial-grade AI provider orchestration, multi-key failover, and real-time connectivity diagnostics.
                  </p>
                </div>
                
                <div className="flex gap-x-3">
                  <CTAButton
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="bg-transparent border border-white/10 text-white hover:bg-white/5 h-12 px-6 rounded-xl transition-all"
                  >
                    {testing ? "Analyzing..." : "Test Connection"}
                  </CTAButton>
                  {hasChanges && (
                    <CTAButton
                      onClick={() => handleSubmit()}
                      disabled={saving}
                      className="bg-blue-600 text-white h-12 px-8 rounded-xl shadow-lg shadow-blue-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                    >
                      {saving ? "Deploying..." : "Commit Changes"}
                    </CTAButton>
                  )}
                </div>
              </div>

              <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="flex flex-col gap-y-4">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-blue-400/80 ml-1">
                    Primary Engine Selection
                  </label>
                  <div className="relative">
                    {searchMenuOpen && (
                      <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={() => setSearchMenuOpen(false)}
                      />
                    )}
                    {searchMenuOpen ? (
                      <div className="absolute top-0 left-0 w-full bg-[#1a1b26] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden">
                        <div className="flex items-center px-4 py-3 border-b border-white/10">
                          <MagnifyingGlass size={20} className="text-white/40" />
                          <input
                            autoFocus
                            type="text"
                            placeholder="Search providers..."
                            className="flex-1 bg-transparent border-none text-white px-4 py-2 outline-none text-sm"
                            onChange={(e) => setSearchQuery(e.target.value)}
                            ref={searchInputRef}
                          />
                          <button onClick={() => setSearchMenuOpen(false)} className="text-white/40 hover:text-white">
                            <X size={20} weight="bold" />
                          </button>
                        </div>
                        <div className="max-h-64 overflow-y-auto p-2 divide-y divide-white/5">
                          {filteredLLMs.map((llm) => (
                            <button
                              key={llm.name}
                              type="button"
                              onClick={() => updateLLMChoice(llm.value)}
                              className="w-full flex items-center gap-3 p-3 hover:bg-white/5 rounded-xl transition-colors text-left"
                            >
                              <img src={llm.logo} className="w-8 h-8 rounded-lg" />
                              <div>
                                <div className="text-sm font-bold text-white">{llm.name}</div>
                                <div className="text-[10px] text-white/40 line-clamp-1">{llm.description}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSearchMenuOpen(true)}
                        className="w-full h-20 bg-white/5 border border-white/10 rounded-2xl p-4 flex items-center justify-between hover:border-blue-500/50 transition-all group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-xl overflow-hidden border border-white/10 group-hover:scale-105 transition-transform">
                            <img src={selectedLLMObject?.logo || AnythingLLMIcon} className="w-full h-full object-cover" />
                          </div>
                          <div className="text-left">
                            <div className="text-sm font-black text-white">{selectedLLMObject?.name || "ORCHESTRATOR OFFLINE"}</div>
                            <div className="text-[10px] text-white/40 font-medium">ACTIVE PROVIDER NODE</div>
                          </div>
                        </div>
                        <CaretUpDown size={20} className="text-white/20 group-hover:text-blue-400 transition-colors" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex flex-col gap-y-4">
                  <label className="text-xs font-black uppercase tracking-[0.2em] text-blue-400/80 ml-1">
                    Environment Parameters
                  </label>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-6 min-h-[80px]" onChange={() => setHasChanges(true)}>
                    {selectedLLM &&
                      AVAILABLE_LLM_PROVIDERS.find(
                        (llm) => llm.value === selectedLLM
                      )?.options?.(settings)}
                  </div>
                </div>
              </div>

              <MultiKeyManager provider={selectedLLM} />
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
