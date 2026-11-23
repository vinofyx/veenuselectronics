/**
 * GENUINE, VERIFIED CUSTOMER REVIEWS ONLY.
 *
 * Add a review here only when:
 *  - it was written by a real customer (e.g. copied from your Google Business profile), and
 *  - you have permission to reproduce it.
 * Never write or edit reviews yourself. Leave this array empty until you have real ones -
 * the website shows a neutral "reviews coming soon" message when it is empty.
 */
export type Review = {
  name: string; // as shown publicly by the reviewer, e.g. "Ravi K."
  text: string;
  rating?: 1 | 2 | 3 | 4 | 5;
  source: string; // e.g. "Google"
  sourceUrl?: string;
  date?: string; // ISO
};

export const reviews: Review[] = [];
