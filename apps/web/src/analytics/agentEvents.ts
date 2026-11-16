/** Pendo Track Agent events for the Fieldnotes Research Assistant. */

export const RESEARCH_ASSISTANT_AGENT_ID = "OglbVm8yCV-7mbae3asDEGvMkUg";

export type AgentEventType = "prompt" | "agent_response" | "user_reaction";

export interface AgentEventMetadata {
  agentId: string;
  conversationId: string;
  messageId: string;
  content: string;
  modelUsed?: string;
  suggestedPrompt?: boolean;
  toolsUsed?: string[];
  fileUploaded?: boolean;
}

/** Returns a UUID, or a `<prefix>_<timestamp>` ID where crypto.randomUUID is unavailable. */
export function createAgentEventId(prefix: string): string {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `${prefix}_${Date.now()}`;
}

export function trackResearchAssistantEvent(
  eventType: AgentEventType,
  metadata: Omit<AgentEventMetadata, "agentId">
): void {
  window.pendo?.trackAgent?.(eventType, { agentId: RESEARCH_ASSISTANT_AGENT_ID, ...metadata });
}
