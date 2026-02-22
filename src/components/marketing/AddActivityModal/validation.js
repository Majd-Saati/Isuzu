import * as Yup from 'yup';
import { parseYMD, formatDateForInput } from './utils';

// Create validation schema with plan date constraints
// Use string-based YYYY-MM-DD tests and construct local Date(year, month-1, day)
// to avoid timezone offsets when comparing dates.
export const createActivitySchema = (planStartDate, planEndDate, isEditMode = false) => {
  return Yup.object({
    activityName: Yup.string()
      .required('Activity name is required')
      .min(3, 'Activity name must be at least 3 characters')
      .max(100, 'Activity name must be less than 100 characters'),
    companyId: isEditMode ? Yup.string() : Yup.string().required('Dealer is required'),
    termId: isEditMode ? Yup.string() : Yup.string().required('Term is required'),
    startsAt: Yup.string()
      .required('Start date is required')
      .test('valid-date', 'Please enter a valid date', function(value) {
        if (!value) return false;
        return parseYMD(value) instanceof Date && !isNaN(parseYMD(value).getTime());
      })
      .test('min-plan-start', `Start date cannot be before plan start (${planStartDate})`, function(value) {
        if (!value || !planStartDate) return true;
        const v = parseYMD(value);
        const p = parseYMD(planStartDate) || parseYMD(formatDateForInput(planStartDate));
        if (!v || !p) return true;
        return v.getTime() >= p.getTime();
      })
      .test('max-plan-end', `Start date cannot be after plan end (${planEndDate})`, function(value) {
        if (!value || !planEndDate) return true;
        const v = parseYMD(value);
        const p = parseYMD(planEndDate) || parseYMD(formatDateForInput(planEndDate));
        if (!v || !p) return true;
        return v.getTime() <= p.getTime();
      }),
    endsAt: Yup.string()
      .required('End date is required')
      .test('valid-date', 'Please enter a valid date', function(value) {
        if (!value) return false;
        return parseYMD(value) instanceof Date && !isNaN(parseYMD(value).getTime());
      })
      .test('min-after-start', 'End date must be after start date', function(value) {
        const { startsAt } = this.parent || {};
        if (!value || !startsAt) return true;
        const v = parseYMD(value);
        const s = parseYMD(startsAt);
        if (!v || !s) return true;
        return v.getTime() >= s.getTime();
      })
      .test('max-plan-end', `End date cannot be after plan end (${planEndDate})`, function(value) {
        if (!value || !planEndDate) return true;
        const v = parseYMD(value);
        const p = parseYMD(planEndDate) || parseYMD(formatDateForInput(planEndDate));
        if (!v || !p) return true;
        return v.getTime() <= p.getTime();
      }),
  });
};



