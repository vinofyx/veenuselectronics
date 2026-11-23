"use client";

import { createContext, useContext, type ReactNode } from "react";
import { envBusiness, type Business } from "@/config/business";

const BusinessContext = createContext<Business | null>(null);

/** Makes the current business details available to client components. */
export function BusinessProvider({ value, children }: { value: Business; children: ReactNode }) {
  return <BusinessContext.Provider value={value}>{children}</BusinessContext.Provider>;
}

/** Business details inside client components. Falls back to env values outside the provider. */
export function useBusiness(): Business {
  return useContext(BusinessContext) ?? envBusiness();
}
