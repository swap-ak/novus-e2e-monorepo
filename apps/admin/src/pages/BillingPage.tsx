import { Button, Card, ErrorMessage, SelectField, TextField } from "@fieldnotes/ui";
import { useEffect, useState, type FormEvent } from "react";
import { trackSubscriptionUpdated } from "../analytics/adminEvents";
import { adminApi, type Billing, type Plan } from "../api/client";
import { useAdminAuth } from "../auth/AdminAuthContext";

const PLAN_OPTIONS = [
  { value: "free", label: "Free" },
  { value: "team", label: "Team" },
  { value: "enterprise", label: "Enterprise" },
];

export function BillingPage() {
  const { admin } = useAdminAuth();
  const [billing, setBilling] = useState<Billing | null>(null);
  // Last values the API confirmed, used as the "previous" values for subscription_updated.
  const [savedBilling, setSavedBilling] = useState<Billing | null>(null);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    adminApi
      .getBilling()
      .then((current) => {
        setBilling(current);
        setSavedBilling(current);
      })
      .catch((err: Error) => setError(err.message));
  }, []);

  if (!billing) return <ErrorMessage message={error} />;

  const save = async (event: FormEvent) => {
    event.preventDefault();
    setSaved(false);
    setError(null);
    try {
      const updated = await adminApi.updateBilling(billing);
      trackSubscriptionUpdated({
        plan: updated.plan,
        previousPlan: savedBilling?.plan ?? updated.plan,
        seats: updated.seats,
        previousSeats: savedBilling?.seats ?? updated.seats,
        organizationId: admin?.organization.id,
      });
      setBilling(updated);
      setSavedBilling(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save billing details");
    }
  };

  return (
    <>
      <h1>Billing</h1>
      <Card title="Subscription">
        <form onSubmit={(event) => void save(event)}>
          <SelectField
            id="billing-plan-select"
            label="Plan"
            options={PLAN_OPTIONS}
            value={billing.plan}
            onChange={(event) => setBilling({ ...billing, plan: event.target.value as Plan })}
          />
          <TextField
            id="billing-email-input"
            label="Billing email"
            type="email"
            value={billing.billingEmail}
            onChange={(event) => setBilling({ ...billing, billingEmail: event.target.value })}
          />
          <TextField
            id="billing-seats-input"
            label="Seats"
            type="number"
            min={1}
            value={billing.seats}
            onChange={(event) => setBilling({ ...billing, seats: Number(event.target.value) })}
          />
          <ErrorMessage message={error} />
          <Button id="save-billing-button" type="submit">
            Save billing
          </Button>
          {saved && <span className="fn-muted"> Saved.</span>}
        </form>
      </Card>
    </>
  );
}
