import "server-only";
import { STATIC_SERVICE_AREAS, type ServiceArea } from "@/config/service-areas";

export type { ServiceArea };

/**
 * Returns active, verified service areas.
 * Preserves exact existing data as static configuration.
 */
export async function getServiceAreas(): Promise<ServiceArea[]> {
  return STATIC_SERVICE_AREAS;
}
