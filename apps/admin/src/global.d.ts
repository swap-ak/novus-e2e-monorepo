/** Novus by Pendo agent, stubbed by the install snippet in index.html. */
type PendoMetadataValue = string | number | boolean;

interface PendoIdentity {
  visitor: { id: string } & Record<string, PendoMetadataValue>;
  account?: { id: string } & Record<string, PendoMetadataValue>;
}

interface PendoAgent {
  initialize: (options: PendoIdentity) => void;
  identify: (identity: PendoIdentity) => void;
  /** The install snippet doesn't stub this, so it's undefined until the agent script loads. */
  clearSession?: () => void;
}

declare var pendo: PendoAgent;
