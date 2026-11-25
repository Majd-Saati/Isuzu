import * as Yup from 'yup';

/** Budget types that require an attached media file */
export const BUDGET_TYPES_REQUIRING_MEDIA = ['estimated cost', 'actual cost'];

export function isMediaRequiredForBudgetType(budgetType) {
  return BUDGET_TYPES_REQUIRING_MEDIA.includes(budgetType);
}

/**
 * Build Yup schema for Add Budget form.
 * When termMonths exist and budget value > 0, monthly breakdown is required:
 * blank months count as 0; the sum must equal the budget value.
 * Pass `context.budgetType` at validate time; media is required only for estimated/actual cost.
 * @param {{ key: string, label: string }[]} termMonths
 * @returns {Yup.ObjectSchema}
 */
export function getAddBudgetSchema(termMonths) {
  const breakdownShape = {};
  if (termMonths && termMonths.length > 0) {
    termMonths.forEach((m) => {
      // Blank fields count as 0 so unused months can stay empty / zero.
      breakdownShape[m.key] = Yup.number()
        .transform((value, originalValue) => {
          if (originalValue === '' || originalValue == null) return 0;
          const n = Number(originalValue);
          return Number.isNaN(n) ? value : n;
        })
        .typeError(`${m.label} must be a number`)
        .min(0, `${m.label} must be 0 or more`);
    });
  }

  return Yup.object({
    value: Yup.string()
      .required('Value is required')
      .test('positive', 'Value must be greater than 0', (v) => parseFloat(v) > 0),
    description: Yup.string().required('Description is required'),
    media: Yup.mixed()
      .nullable()
      .test('media-by-type', function (value) {
        // Normalize to an array: supports a single File (legacy) or an array of Files.
        const files = Array.isArray(value) ? value : value ? [value] : [];
        const allValid = files.every((f) => f instanceof File);
        const budgetType = this.options.context?.budgetType;
        const needsMedia = isMediaRequiredForBudgetType(budgetType);
        if (needsMedia) {
          if (files.length === 0) {
            return this.createError({ message: 'Media is required' });
          }
          if (!allValid) {
            return this.createError({ message: 'Please attach valid files' });
          }
          return true;
        }
        if (files.length > 0 && !allValid) {
          return this.createError({ message: 'Please attach valid files' });
        }
        return true;
      }),
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
