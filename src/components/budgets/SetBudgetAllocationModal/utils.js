/**
 * Build API payload from form values.
 * @param {{ termId: string, companyId: string, value: string|number }} values
 * @returns {{ term_id: number, company_id: number, value: number }}
 */
export const buildSetAllocationPayload = (values) => ({
  term_id: Number(values.termId),
  company_id: Number(values.companyId),
  value: Number(values.value) || 0,
});
