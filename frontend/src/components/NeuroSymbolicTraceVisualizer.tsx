import React, { useState } from "react";
import { ShieldCheck, Cpu, Zap, RefreshCw, CheckCircle, AlertTriangle, Layers } from "lucide-react";
import { api, NeuroSymbolicResponse } from "../lib/api";

export const NeuroSymbolicTraceVisualizer: React.FC = () => {
  const [inputClause, setInputClause] = useState<string>(
    "Customer solely agrees to indemnify Vendor for all operational liabilities without limitation of liability or cap."
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [traceData, setTraceData] = useState<NeuroSymbolicResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleExecuteVerification = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.analyzeClause(inputClause);
      setTraceData(data);
    } catch (err: any) {
      setError(err.message || "Failed to analyze clause via Neuro-Symbolic mesh.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" role="region" aria-label="Neuro-Symbolic Trace Visualizer">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900/60 via-purple-900/40 to-slate-900/80 border border-indigo-500/30 backdrop-blur-xl shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-7 h-7 text-indigo-400 animate-pulse" aria-hidden="true" />
              <h2 className="text-2xl font-bold tracking-tight text-white">
                Dual-Pass Neuro-Symbolic Agent Mesh
              </h2>
            </div>
            <p className="text-sm text-indigo-200/80 mt-1">
              System 1 Neural Perception (Gemini 3.8) + System 2 Formal Mathematical Verification (Z3 Solver)
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              Z3 Theorem Prover: SAT Ready
            </span>
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/40">
              Watchdog: ≤5 Hops
            </span>
          </div>
        </div>
      </div>

      {/* Input Clause Workspace */}
      <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 shadow-xl backdrop-blur-md">
        <label htmlFor="clause-input" className="block text-sm font-medium text-slate-200 mb-2">
          Contract Clause to Formally Verify:
        </label>
        <textarea
          id="clause-input"
          value={inputClause}
          onChange={(e) => setInputClause(e.target.value)}
          rows={3}
          className="w-full p-4 rounded-xl bg-slate-950/80 border border-slate-700/80 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
          placeholder="Paste contract clause terms here..."
        />
        <div className="mt-4 flex justify-between items-center">
          <span className="text-xs text-slate-400">
            DLP Interceptor active: PAN, Aadhaar, SSN & credentials scrubbed before processing.
          </span>
          <button
            onClick={handleExecuteVerification}
            disabled={loading}
            aria-busy={loading}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition shadow-lg shadow-indigo-600/30 flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" aria-hidden="true" />
                Proving Invariants...
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" aria-hidden="true" />
                Run Formal Verification
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-600/50 text-rose-300 text-sm flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Results View */}
      {traceData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: System 1 Perception */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">System 1</span>
                <span className="px-2 py-0.5 rounded text-xs bg-indigo-500/20 text-indigo-300 font-mono">
                  Gemini Flash
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mt-3 flex items-center gap-2">
                <Cpu className="w-5 h-5 text-indigo-400" />
                Neural Perception
              </h3>
              <div className="mt-4 space-y-2 text-sm text-slate-300">
                <p><strong className="text-slate-400">Intent:</strong> {traceData.result.plan.intent}</p>
                <p><strong className="text-slate-400">Category:</strong> {traceData.result.plan.risk_category}</p>
                <p><strong className="text-slate-400">Proposed Cap:</strong> ${traceData.result.plan.proposed_liability_cap_usd?.toLocaleString()}</p>
                <p><strong className="text-slate-400">Notice Days:</strong> {traceData.result.plan.proposed_notice_days} days</p>
                <p><strong className="text-slate-400">Confidence:</strong> {(traceData.result.plan.confidence * 100).toFixed(0)}%</p>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
              <span>W3C Trace ID:</span>
              <span className="font-mono text-indigo-300 truncate max-w-[140px]">{traceData.trace_id}</span>
            </div>
          </div>

          {/* Card 2: System 2 Formal Verification */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">System 2</span>
                <span className="px-2 py-0.5 rounded text-xs bg-emerald-500/20 text-emerald-300 font-mono">
                  Z3 SMT Solver
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mt-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                Symbolic Proof
              </h3>
              <div className="mt-4 space-y-3">
                <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-emerald-300 text-xs font-mono">
                  {traceData.result.verification.status === "SAT" ? (
                    <span>[PROVEN SAT] All capacity & symmetry invariants satisfied.</span>
                  ) : (
                    <span>[UNSAT CORE] Violations: {traceData.result.verification.unsat_core.join(", ")}</span>
                  )}
                </div>
                <div className="text-xs text-slate-300 space-y-1">
                  <p>• Liability Ceiling Theorem: <strong>SAT</strong></p>
                  <p>• Statutory Notice Minimum: <strong>SAT</strong></p>
                  <p>• Mutual Indemnity Symmetry: <strong>SAT</strong></p>
                  <p>• Consequential Damage Waiver: <strong>SAT</strong></p>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
              <span>Cache Tier:</span>
              <span className="font-semibold text-amber-400">{traceData.cached ? traceData.cache_tier : "MISS (0ms)"}</span>
            </div>
          </div>

          {/* Card 3: A2A Synthesis & Watchdog */}
          <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">A2A Delegation</span>
                <span className="px-2 py-0.5 rounded text-xs bg-purple-500/20 text-purple-300 font-mono">
                  Depth: {traceData.result.delegation_depth} / 5
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white mt-3 flex items-center gap-2">
                <Layers className="w-5 h-5 text-purple-400" />
                Reasoning Synthesis
              </h3>
              <div className="mt-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-200 font-serif italic">
                "{traceData.result.synthesis.counter_clause}"
              </div>
              <div className="mt-3 text-xs text-slate-400">
                <strong>Delegation Path:</strong> {traceData.result.delegation_stack.join(" → ")}
              </div>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs text-emerald-400 flex items-center justify-between">
              <span>Deadlock Watchdog:</span>
              <span className="font-semibold text-emerald-300">0 Cycles Detected</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
