import React from 'react';
import { Calendar, Building2 } from 'lucide-react';
import {
  SECTION_FILTERS_CLASS,
  SECTION_FILTER_ICON_BOX_CLASS,
  SECTION_FILTER_ICON_CLASS,
  SECTION_FILTER_LABEL_CLASS,
  SECTION_FILTER_SELECT_CLASS,
  SECTION_FILTER_DIVIDER_CLASS,
} from '@/components/dashboard/sectionStyles';
import { YEAR_OPTIONS } from '../constants';

export const TwoYearsFilters = ({
  year1,
  year2,
  companyId,
  companies,
  onYear1Change,
  onYear2Change,
  onCompanyChange,
  isAdmin,
}) => {
  return (
    <div className={SECTION_FILTERS_CLASS}>
      {isAdmin && (
        <div className="flex items-center gap-3">
          <div className={SECTION_FILTER_ICON_BOX_CLASS}>
            <Building2 className={SECTION_FILTER_ICON_CLASS} />
          </div>
          <div className="flex flex-col">
            <label className={SECTION_FILTER_LABEL_CLASS}>Company</label>
            <select
              value={companyId}
              onChange={(e) => onCompanyChange(e.target.value)}
              className={`${SECTION_FILTER_SELECT_CLASS} min-w-[180px]`}
            >
              <option value="all">All companies</option>
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className={`flex flex-wrap items-center gap-4 ${isAdmin ? SECTION_FILTER_DIVIDER_CLASS : ''}`}>
        <div className="flex items-center gap-3">
          <div className={SECTION_FILTER_ICON_BOX_CLASS}>
            <Calendar className={SECTION_FILTER_ICON_CLASS} />
          </div>
          <div className="flex flex-col">
            <label className={SECTION_FILTER_LABEL_CLASS}>Year 1</label>
            <select
              value={year1}
              onChange={(e) => onYear1Change(Number(e.target.value))}
              className={`${SECTION_FILTER_SELECT_CLASS} min-w-[120px]`}
            >
              {YEAR_OPTIONS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex flex-col">
          <label className={SECTION_FILTER_LABEL_CLASS}>Year 2</label>
          <select
            value={year2}
            onChange={(e) => onYear2Change(Number(e.target.value))}
            className={`${SECTION_FILTER_SELECT_CLASS} min-w-[120px]`}
          >
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};
