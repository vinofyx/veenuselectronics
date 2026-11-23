"use client";

import { useActionState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { STATUSES } from "@/lib/constants";
import { updateEnquiry, type UpdateState } from "../../../actions";

type Values = {
  id: string;
  status: string;
  assigned_technician: string;
  diagnosis: string;
  estimated_cost: string;
  final_cost: string;
  parts_used: string;
  warranty_details: string;
  internal_notes: string;
};

export function UpdateForm({ enquiry, technicians }: { enquiry: Values; technicians: string[] }) {
  const [state, action, pending] = useActionState<UpdateState, FormData>(updateEnquiry, {});
  return (
    <form action={action} className="card space-y-4 p-5">
      <h2 className="text-lg font-semibold">Update repair</h2>
      <input type="hidden" name="id" value={enquiry.id} />

      <div>
        <label htmlFor="status" className="label">Status</label>
        <select id="status" name="status" defaultValue={enquiry.status} className="input">
          {STATUSES.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="assigned_technician" className="label">Assigned technician</label>
        <input id="assigned_technician" name="assigned_technician" list="technicians" defaultValue={enquiry.assigned_technician} className="input" maxLength={80} />
        <datalist id="technicians">
          {technicians.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
      </div>

      <div>
        <label htmlFor="diagnosis" className="label">Diagnosis</label>
        <textarea id="diagnosis" name="diagnosis" rows={3} defaultValue={enquiry.diagnosis} className="input" maxLength={2000} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="estimated_cost" className="label">Estimate (₹)</label>
          <input id="estimated_cost" name="estimated_cost" type="number" min="0" step="1" defaultValue={enquiry.estimated_cost} className="input" />
        </div>
        <div>
          <label htmlFor="final_cost" className="label">Final cost (₹)</label>
          <input id="final_cost" name="final_cost" type="number" min="0" step="1" defaultValue={enquiry.final_cost} className="input" />
        </div>
      </div>

      <div>
        <label htmlFor="parts_used" className="label">Parts used</label>
        <textarea id="parts_used" name="parts_used" rows={2} defaultValue={enquiry.parts_used} className="input" maxLength={1000} />
      </div>

      <div>
        <label htmlFor="warranty_details" className="label">Warranty information</label>
        <input id="warranty_details" name="warranty_details" defaultValue={enquiry.warranty_details} className="input" maxLength={500} placeholder="e.g. 90 days on backlight strips" />
      </div>

      <div>
        <label htmlFor="internal_notes" className="label">Internal notes (staff only)</label>
        <textarea id="internal_notes" name="internal_notes" rows={4} defaultValue={enquiry.internal_notes} className="input" maxLength={4000} />
      </div>

      {state.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{state.error}</p>}
      {state.ok && !pending && (
        <p className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800" role="status">
          <CheckCircle2 className="h-4 w-4" /> Saved
        </p>
      )}

      <button type="submit" className="btn-accent w-full" disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />} Save changes
      </button>
    </form>
  );
}
