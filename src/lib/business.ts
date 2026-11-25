import "server-only";
import { cache } from "react";
import { envBusiness, type Business } from "@/config/business";

export const BUSINESS_TAG = "business";

/**
 * Current business details from environment variables and verified configuration.
 * Fully static and zero database dependency.
 */
export const getBusiness = cache(async (): Promise<Business> => envBusiness());
