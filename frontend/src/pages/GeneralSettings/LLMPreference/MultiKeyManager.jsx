import React, { useState, useEffect } from "react";
import System from "@/models/system";
import showToast from "@/utils/toast";
import { Trash, ToggleLeft, ToggleRight, Plus, Activity, ShieldCheck, ClockClockwise } from "@phosphor-icons/react";
import CTAButton from "@/components/lib/CTAButton";

export default function MultiKeyManager({ provider }) {
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newKey, setNewKey] = useState({ label: "", apiKey: "", model: "", priority: 0 });

  useEffect(() => {
    fetchConfigs();
  }, [provider]);

  const fetchConfigs = async () => {
    setLoading(true);
    const { configs } = await System.getLLMConfigs();
    setConfigs(configs.filter(c => c.provider === provider));
    setLoading(false);
  };

  const handleToggle = async (id) => {
    const { success } = await System.toggleLLMConfig(id);
    if (success) {
      showToast("Key status toggled.", "success");
      fetchConfigs();
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this API key?")) return;
    const { success } = await System.deleteLLMConfig(id);
    if (success) {
      showToast("Key deleted.", "success");
      fetchConfigs();
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const { success, error } = await System.addLLMConfig({ ...newKey, provider });
    if (success) {
      showToast("Key added successfully.", "success");
      setShowAddModal(false);
      setNewKey({ label: "", apiKey: "", model: "", priority: 0 });
      fetchConfigs();
    } else {
      showToast(`Failed to add key: ${error}`, "error");
    }
  };

  if (!provider) return null;

  return (
    <div className="mt-8 p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <ShieldCheck className="text-blue-400" size={24} />
            Enterprise Key Registry
          </h3>
          <p className="text-sm text-white/60">Manage multiple API keys and failover priority for {provider}.</p>
        </div>
        <CTAButton onClick={() => setShowAddModal(true)} className="bg-blue-600 hover:bg-blue-500 flex items-center gap-2 px-4 py-2">
          <Plus size={18} weight="bold" /> Add Key
        </CTAButton>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
              <th className="px-4 py-3 font-semibold">Label / Health</th>
              <th className="px-4 py-3 font-semibold">Masked Key</th>
              <th className="px-4 py-3 font-semibold text-center">Priority</th>
              <th className="px-4 py-3 font-semibold text-center">Usage</th>
              <th className="px-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading ? (
              <tr><td colSpan="5" className="py-8 text-center text-white/40">Loading registry...</td></tr>
            ) : configs.length === 0 ? (
              <tr><td colSpan="5" className="py-8 text-center text-white/40">No keys configured. Add one to enable orchestration.</td></tr>
            ) : (
              configs.map((config) => (
                <tr key={config.id} className={`hover:bg-white/5 transition-colors ${!config.active ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-white">{config.label || "Unnamed Key"}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className={`w-2 h-2 rounded-full ${config.health_score > 80 ? 'bg-green-400 shadow-[0_0_8px_#4ade80]' : config.health_score > 40 ? 'bg-yellow-400' : 'bg-red-400'}`} />
                        <span className="text-[10px] text-white/40">Score: {config.health_score}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 font-mono text-xs text-blue-300/80">{config.key_preview}</td>
                  <td className="px-4 py-4 text-center">
                    <span className="px-2 py-1 rounded bg-white/10 text-[10px] font-bold text-white">{config.priority}</span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <div className="flex flex-col text-[10px] text-white/40 leading-tight">
                      <span>Uses: {config.use_count || 0}</span>
                      <span className="text-red-400/60">Fails: {config.failure_count || 0}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-3 text-white/60">
                      <button onClick={() => handleToggle(config.id)} title={config.active ? "Deactivate" : "Activate"} className="hover:text-blue-400 transition-colors">
                        {config.active ? <ToggleRight size={24} weight="fill" className="text-blue-500" /> : <ToggleLeft size={24} />}
                      </button>
                      <button onClick={() => handleDelete(config.id)} title="Delete" className="hover:text-red-400 transition-colors">
                        <Trash size={20} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex justify-center items-center p-4">
          <div className="bg-[#1a1c2e] border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-[0_0_50px_rgba(37,99,235,0.2)]">
            <h4 className="text-2xl font-bold text-white mb-2">Register AI Gateway</h4>
            <p className="text-sm text-white/40 mb-6">Enter details for the new provider instance.</p>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase font-bold text-white/40 mb-1 ml-1">Friendly Label</label>
                <input 
                  autoFocus
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                  placeholder="Production Key 1"
                  value={newKey.label}
                  onChange={(e) => setNewKey({...newKey, label: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase font-bold text-white/40 mb-1 ml-1">API Key</label>
                <input 
                  required
                  type="password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                  placeholder="sk-..."
                  value={newKey.apiKey}
                  onChange={(e) => setNewKey({...newKey, apiKey: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1 ml-1">Priority (Higher = First)</label>
                  <input 
                    type="number"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                    value={newKey.priority}
                    onChange={(e) => setNewKey({...newKey, priority: parseInt(e.target.value)})}
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase font-bold text-white/40 mb-1 ml-1">Model Override</label>
                  <input 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-blue-500 transition-colors"
                    placeholder="Optional"
                    value={newKey.model}
                    onChange={(e) => setNewKey({...newKey, model: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-6">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-white font-bold hover:bg-white/10 transition-colors">
                  Cancel
                </button>
                <button type="submit" className="flex-[2] px-4 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all">
                  Confirm Registration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
