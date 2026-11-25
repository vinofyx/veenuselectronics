export type ServiceArea = { id: string; area_name: string; city: string };

/**
 * Verified service areas served by Veenus Electronics.
 * Preserves the exact existing list (currently empty, which renders the honest
 * contact/locality confirmation message until the owner specifies areas).
 * None are invented.
 */
export const STATIC_SERVICE_AREAS: ServiceArea[] = [];
