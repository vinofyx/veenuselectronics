/**
 * Supabase/PostgREST returns at most 1000 rows per request by default.
 * This pages through a query using .range() until all rows (up to `cap`) are read.
 */
export async function fetchAll<T>(
  page: (from: number, to: number) => PromiseLike<{ data: unknown; error: { message: string } | null }>,
  cap = 50_000,
  size = 1000,
): Promise<{ rows: T[]; error: string | null }> {
  const rows: T[] = [];
  for (let from = 0; from < cap; from += size) {
    const { data, error } = await page(from, from + size - 1);
    if (error) return { rows, error: error.message };
    const batch = (data ?? []) as T[];
    rows.push(...batch);
    if (batch.length < size) break;
  }
  return { rows, error: null };
}
