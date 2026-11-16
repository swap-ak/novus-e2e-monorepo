/** Browser research assistant events. The window.pendo type is declared in ./objectEvents. */

const MAX_ERROR_MESSAGE_LENGTH = 100;

export interface AssistantResponseMetadata {
  success: boolean;
  /** Model that answered, or null when the assistant isn't configured or the request failed. */
  model: string | null;
  messageCount: number;
  replyLength?: number;
  errorMessage?: string;
}

/** Fires once per assistant request, after it resolves or throws. */
export function trackAssistantResponseReceived(metadata: AssistantResponseMetadata): void {
  const properties: Record<string, string | boolean | number> = {
    success: metadata.success,
    model: metadata.model ?? "none",
    messageCount: metadata.messageCount,
  };
  if (metadata.replyLength !== undefined) properties.replyLength = metadata.replyLength;
  if (metadata.errorMessage !== undefined) {
    properties.errorMessage = metadata.errorMessage.slice(0, MAX_ERROR_MESSAGE_LENGTH);
  }
  window.pendo?.track("assistant_response_received", properties);
}
