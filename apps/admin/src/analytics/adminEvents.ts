/** Browser admin portal events, sent through the Pendo agent when it's loaded. */

import type { Plan, Role } from "../api/client";

type TrackProperties = Record<string, string | boolean | number>;

declare global {
  interface Window {
    pendo?: {
      track: (eventName: string, metadata?: TrackProperties) => void;
    };
  }
}

function withOrganization(properties: TrackProperties, organizationId?: string): TrackProperties {
  return organizationId === undefined ? properties : { ...properties, organizationId };
}

export interface SubscriptionUpdatedMetadata {
  plan: Plan;
  previousPlan: Plan;
  seats: number;
  previousSeats: number;
  organizationId?: string;
}

/** Fires after the API accepts a billing change. */
export function trackSubscriptionUpdated({
  organizationId,
  ...properties
}: SubscriptionUpdatedMetadata): void {
  window.pendo?.track("subscription_updated", withOrganization(properties, organizationId));
}

export interface MemberRoleChangedMetadata {
  memberId: string;
  previousRole: Role;
  newRole: Role;
  organizationId?: string;
}

/** Fires after the API accepts a role change for a member. */
export function trackMemberRoleChanged({
  organizationId,
  ...properties
}: MemberRoleChangedMetadata): void {
  window.pendo?.track("member_role_changed", withOrganization(properties, organizationId));
}
