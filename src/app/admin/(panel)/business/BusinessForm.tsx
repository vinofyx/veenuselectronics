"use client";

import { useActionState, type ReactNode } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
import { ALL_EQUIPMENT, ALL_TV_BRANDS, CLAIM_KEYS, CLAIM_LABELS, DEFAULT_CLAIMS, type BusinessSettingsRow } from "@/config/business";
import { saveBusinessSettings, type BusinessState } from "../../actions";

export function BusinessForm({ row }: { row: BusinessSettingsRow }) {
  const [state, action, pending] = useActionState<BusinessState, FormData>(saveBusinessSettings, {});
  const fe = state.fieldErrors ?? {};
  const v = (k: keyof BusinessSettingsRow) => {
    const x = row[k];
    return x === null || x === undefined ? "" : String(x);
  };
  const brands = row.supported_brands?.length ? row.supported_brands : ALL_TV_BRANDS;
  const equipment = row.supported_equipment?.length ? row.supported_equipment : ALL_EQUIPMENT;
  const bool = (x: boolean | null | undefined) => x !== false; // NULL (not set) = offered, as in the original brief
  const claim = (k: (typeof CLAIM_KEYS)[number]) => {
    const c = row.confirmed_claims?.[k];
    return typeof c === "boolean" ? c : DEFAULT_CLAIMS[k];
  };

  return (
    <form action={action} className="space-y-6" encType="multipart/form-data">
      <Section title="Identity">
        <Text name="business_name" label="Business name" defaultValue={v("business_name")} placeholder="Veenus Electronics" error={fe.business_name} />
        <div>
          <label className="label" htmlFor="logo">Logo (PNG, JPG or WEBP, max 1 MB, square works best)</label>
          {row.logo_url && (
            <div className="mb-2 flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={row.logo_url} alt="Current logo" className="h-12 w-12 rounded-lg border border-brand-100 object-contain" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" name="remove_logo" /> Remove logo
              </label>
            </div>
          )}
          <input id="logo" name="logo" type="file" accept="image/png,image/jpeg,image/webp" className="text-sm" />
        </div>
      </Section>

      <Section title="Contact">
        <Text name="phone" label="Phone number" defaultValue={v("phone")} placeholder="98765 43210" error={fe.phone} help="Used for all Call buttons." />
        <Text name="phone_display" label="Phone (as displayed)" defaultValue={v("phone_display")} placeholder="+91 98765 43210" error={fe.phone_display} />
        <Text name="whatsapp" label="WhatsApp number" defaultValue={v("whatsapp")} placeholder="98765 43210" error={fe.whatsapp} help="Used for all WhatsApp buttons." />
        <Text name="email" label="Email" type="email" defaultValue={v("email")} error={fe.email} />
        <Text name="working_hours" label="Working hours" defaultValue={v("working_hours")} placeholder="Mon-Sat 10:00 AM - 8:00 PM" error={fe.working_hours} />
      </Section>

      <Section title="Shop location">
        <Text name="address_street" label="Street address" defaultValue={v("address_street")} error={fe.address_street} />
        <Text name="address_locality" label="Area / locality" defaultValue={v("address_locality")} error={fe.address_locality} />
        <Text name="city" label="City" defaultValue={v("city")} error={fe.city} help="Also added to page titles for local search - only set it if this is your real service city." />
        <Text name="state" label="State" defaultValue={v("state")} error={fe.state} />
        <Text name="postcode" label="PIN code" defaultValue={v("postcode")} error={fe.postcode} />
        <Text name="maps_url" label="Google Maps link" defaultValue={v("maps_url")} placeholder="https://maps.app.goo.gl/..." error={fe.maps_url} />
        <Text name="latitude" label="Latitude (for the map)" defaultValue={v("latitude")} placeholder="17.4375" error={fe.latitude} />
        <Text name="longitude" label="Longitude (for the map)" defaultValue={v("longitude")} placeholder="78.4482" error={fe.longitude} />
        <Text name="reviews_url" label="Google reviews link" defaultValue={v("reviews_url")} error={fe.reviews_url} />
      </Section>

      <Section title="Services">
        <div className="sm:col-span-2">
          <p className="label">Service options offered</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <Check name="home_visit_available" label="Home visit" defaultChecked={bool(row.home_visit_available)} />
            <Check name="workshop_repair_available" label="Workshop repair" defaultChecked={bool(row.workshop_repair_available)} />
            <Check name="pickup_delivery_available" label="Pickup and delivery" defaultChecked={bool(row.pickup_delivery_available)} />
          </div>
        </div>
        <div className="sm:col-span-2">
          <p className="label">TV brands you repair</p>
          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-5">
            {ALL_TV_BRANDS.map((b) => (
              <Check key={b} name="supported_brands" value={b} label={b} defaultChecked={brands.includes(b)} />
            ))}
          </div>
          {fe.supported_brands && <p className="field-error">{fe.supported_brands}</p>}
          <p className="mt-1 text-xs text-slate-500">Unticked brands are removed from the website, the sitemap and the enquiry form.</p>
        </div>
        <div className="sm:col-span-2">
          <p className="label">Equipment you repair</p>
          <div className="grid grid-cols-2 gap-2 text-sm sm:grid-cols-4">
            {ALL_EQUIPMENT.map((e) => (
              <Check key={e} name="supported_equipment" value={e} label={e} defaultChecked={equipment.includes(e)} />
            ))}
          </div>
          {fe.supported_equipment && <p className="field-error">{fe.supported_equipment}</p>}
          <p className="mt-1 text-xs text-slate-500">Unticked equipment is removed from the menus, service pages, sitemap and booking form.</p>
        </div>
        <Text
          name="inspection_charges"
          label="Inspection / visit charges"
          defaultValue={v("inspection_charges")}
          placeholder="e.g. Rs 300 home visit, adjusted against the repair cost"
          error={fe.inspection_charges}
          help="Shown on the FAQ, How It Works, booking page and Terms. Leave empty to explain charges by phone."
        />
        <Text name="years_experience" label="Years of experience" type="number" defaultValue={v("years_experience")} error={fe.years_experience} help="Leave empty unless verified." />
        <Text name="warranty_terms" label="Repair warranty terms" defaultValue={v("warranty_terms")} placeholder="e.g. 90-day warranty on replaced parts" error={fe.warranty_terms} help="Leave empty if no warranty is offered." />
      </Section>

      <Section title="Website claims (tick only what is true)">
        <div className="space-y-2 text-sm sm:col-span-2">
          {CLAIM_KEYS.map((k) => (
            <Check key={k} name={`claim_${k}`} label={CLAIM_LABELS[k]} defaultChecked={claim(k)} />
          ))}
        </div>
      </Section>

      {state.error && <p className="rounded-lg bg-red-50 p-3 text-sm text-red-700" role="alert">{state.error}</p>}
      {state.ok && !pending && (
        <p className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-800" role="status">
          <CheckCircle2 className="h-4 w-4" /> Saved. The website will show the new details within a minute.
        </p>
      )}
      <button type="submit" className="btn-accent" disabled={pending}>
        {pending && <Loader2 className="h-4 w-4 animate-spin" />} Save business details
      </button>
    </form>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <fieldset className="card grid gap-4 p-5 sm:grid-cols-2">
      <legend className="sr-only">{title}</legend>
      <h2 className="text-lg font-semibold sm:col-span-2">{title}</h2>
      {children}
    </fieldset>
  );
}

function Text({
  name,
  label,
  defaultValue,
  placeholder,
  error,
  help,
  type = "text",
}: {
  name: string;
  label: string;
  defaultValue: string;
  placeholder?: string;
  error?: string;
  help?: string;
  type?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="label">{label}</label>
      <input id={name} name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} className="input" aria-invalid={Boolean(error)} />
      {help && !error && <p className="mt-1 text-xs text-slate-500">{help}</p>}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

function Check({ name, label, defaultChecked, value }: { name: string; label: string; defaultChecked: boolean; value?: string }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" name={name} value={value} defaultChecked={defaultChecked} className="h-4 w-4 rounded border-brand-200 text-accent" />
      {label}
    </label>
  );
}
