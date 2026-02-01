import * as Yup from 'yup';

/**
 * Build Yup schema for Add Budget form.
 * When termMonths exist and budget value > 0, monthly breakdown is required:
 * each month must have a value and the sum must equal the budget value.
 * @param {{ key: string, label: string }[]} termMonths
 * @returns {Yup.ObjectSchema}
 */
export function getAddBudgetSchema(termMonths) {
  const breakdownShape = {};
  if (termMonths && termMonths.length > 0) {
    termMonths.forEach((m) => {
      breakdownShape[m.key] = Yup.number()
        .transform((v) => (v === '' || v == null ? undefined : Number(v)))
        .typeError(`${m.label} is required`)
        .required(`${m.label} is required`)
        .min(0, `${m.label} must be 0 or more`);
    });
  }

  return Yup.object({
    value: Yup.string()
      .required('Value is required')
      .test('positive', 'Value must be greater than 0', (v) => parseFloat(v) > 0),
    description: Yup.string().required('Description is required'),
    monthsBreakdown:
      Object.keys(breakdownShape).length > 0
        ? Yup.object()
            .shape(breakdownShape)
            .test(
              'sum-equals-total',
              'Monthly total must equal budget value',
              function (obj) {
                const budgetValue = this.options.context?.budgetValue ?? 0;
                const sum = Object.values(obj || {}).reduce(
                  (s, n) => s + (Number(n) || 0),
                  0
                );
                return Math.abs(sum - budgetValue) < 0.01;
              }
            )
        : Yup.object().optional(),
  });
}
