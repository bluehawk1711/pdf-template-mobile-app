/** Shared display formatting (₹ en-IN grouping, dd/mm/yyyy). */

/** ₹ with en-IN grouping (lakhs/crores) — manual, no ICU dependency. */
export const formatINR = (n: number): string => {
  const [int, frac] = n.toFixed(2).split('.');
  let grouped = int;
  if (int.length > 3) {
    const last3 = int.slice(-3);
    const rest = int.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    grouped = `${rest},${last3}`;
  }
  return `\u20B9${grouped}.${frac}`;
};

export const formatDate = (iso?: string): string => {
  if (!iso) return '';
  const [y, m, d] = iso.split('T')[0].split('-');
  return `${d}/${m}/${y}`;
};
