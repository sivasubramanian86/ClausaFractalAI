/**
 * OpenAPI Client with W3C Trace Injection and Neuro-Symbolic Agent Mesh Client.
 */

export interface TraceContext {
  traceId: string;
  spanId: string;
  traceparent: string;
}

export function generateW3CTraceparent(): TraceContext {
  const hex = "0123456789abcdef";
  let traceId = "";
  for (let i = 0; i < 32; i++) {
    traceId += hex[Math.floor(Math.random() * 16)];
  }
  let spanId = "";
  for (let i = 0; i < 16; i++) {
    spanId += hex[Math.floor(Math.random() * 16)];
  }
  const traceparent = `00-${traceId}-${spanId}-01`;
  return { traceId, spanId, traceparent };
}

export interface VerificationResultPayload {
  is_satisfiable: boolean;
  status: "SAT" | "UNSAT" | "UNKNOWN";
  unsat_core: string[];
  model_assignments: Record<string, string>;
  diagnostics: string;
}

export interface NeuroSymbolicResponse {
  trace_id: string;
  cached: boolean;
  cache_tier?: "L1" | "L2" | "MISS";
  usage?: {
    consumed_tokens: number;
    cost_usd: number;
    cost_saved_usd: number;
  };
  result: {
    status: string;
    plan: {
      plan_id: string;
      intent: string;
      proposed_action: string;
      risk_category: string;
      proposed_liability_cap_usd: number;
      proposed_notice_days: number;
      require_mutual_indemnity: boolean;
      forbid_consequential_waiver: boolean;
      confidence: number;
    };
    verification: VerificationResultPayload;
    synthesis: {
      counter_clause: string;
      negotiation_rationale: string;
      suggested_questions: string[];
    };
    delegation_depth: number;
    delegation_stack: string[];
  };
}

import { getW3CTraceparent, logger } from "./logger";

export class NeuroSymbolicApiClient {
  private baseUrl: string;

  constructor(baseUrl: string = "http://localhost:8000") {
    this.baseUrl = baseUrl;
  }

  async analyzeClause(clauseText: string): Promise<NeuroSymbolicResponse> {
    const traceparent = getW3CTraceparent();
    logger.info("NeuroSymbolicApiClient", "Dispatching clause analysis", { clauseText: clauseText.slice(0, 60) });
    const response = await fetch(`${this.baseUrl}/api/v2/analyze`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        traceparent,
      },
      body: JSON.stringify({ clause_text: clauseText, use_cache: true }),
    });

    if (!response.ok) {
      const err = new Error(`API analysis failed with status ${response.status}`);
      logger.error("NeuroSymbolicApiClient", "Clause analysis request failed", err);
      throw err;
    }

    const data = await response.json();
    logger.info("NeuroSymbolicApiClient", "Clause analysis success", { trace_id: data.trace_id });
    return data;
  }

  async listMCPTools(): Promise<Array<{ name: string; description: string; required_capability: string }>> {
    const traceparent = getW3CTraceparent();
    const response = await fetch(`${this.baseUrl}/api/v2/mcp/tools`, {
      headers: { traceparent },
    });
    if (!response.ok) {
      const err = new Error(`Failed to list MCP tools: ${response.status}`);
      logger.error("NeuroSymbolicApiClient", "Failed to list MCP tools", err);
      throw err;
    }
    return response.json();
  }

  async listHITLTickets(): Promise<any[]> {
    const traceparent = getW3CTraceparent();
    const response = await fetch(`${this.baseUrl}/api/v2/hitl/tickets`, {
      headers: { traceparent },
    });
    if (!response.ok) {
      const err = new Error(`Failed to fetch HITL tickets: ${response.status}`);
      logger.error("NeuroSymbolicApiClient", "Failed to fetch HITL tickets", err);
      throw err;
    }
    return response.json();
  }
}

export const api = new NeuroSymbolicApiClient();
