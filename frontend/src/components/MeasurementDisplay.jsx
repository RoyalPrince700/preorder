import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { FiCopy, FiCheck } from 'react-icons/fi';
import {
  MEASUREMENT_SECTIONS,
  formatMeasurementsForCopy,
  hasAnyMeasurement,
} from '../constants/measurementFields';

const MeasurementDisplay = ({ measurements, showCopyAll = true }) => {
  const [copiedSection, setCopiedSection] = useState(null);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!hasAnyMeasurement(measurements)) {
    return (
      <div className="border-2 border-dashed border-slate-100 py-16 text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400">
          No measurements on file yet
        </p>
        <p className="mt-3 text-[10px] font-bold text-slate-400 normal-case tracking-normal max-w-sm mx-auto">
          Your tailor measurements will appear here once saved by our team from the store.
        </p>
      </div>
    );
  }

  const copyText = async (text, label) => {
    if (!text) {
      toast.error('Nothing to copy');
      return;
    }
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copied`);
    } catch {
      toast.error('Copy failed. Select and copy manually.');
    }
  };

  const handleCopySection = async (section) => {
    const block = measurements[section.key];
    if (!block) return;
    const partial = { [section.key]: block };
    const text = formatMeasurementsForCopy(partial);
    await copyText(text, section.title);
    setCopiedSection(section.key);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const handleCopyAll = async () => {
    const text = formatMeasurementsForCopy(measurements);
    await copyText(text, 'All measurements');
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  return (
    <div className="space-y-8">
      {showCopyAll && (
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={handleCopyAll}
            className="flex items-center gap-2 bg-slate-950 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-orange-600"
          >
            {copiedAll ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
            {copiedAll ? 'Copied' : 'Copy all measurements'}
          </button>
        </div>
      )}

      {MEASUREMENT_SECTIONS.map((section) => {
        const block = measurements[section.key];
        const rows = section.fields.filter((f) => {
          const v = block?.[f.key];
          return v !== undefined && v !== null && String(v).trim() !== '';
        });

        if (!rows.length) return null;

        return (
          <div
            key={section.key}
            className="border-2 border-slate-900 bg-white overflow-hidden shadow-[0_16px_40px_rgba(0,0,0,0.04)]"
          >
            <div className="flex flex-col gap-3 border-b-2 border-slate-100 bg-slate-50 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-slate-950">
                {section.title}
              </h3>
              <button
                type="button"
                onClick={() => handleCopySection(section)}
                className="flex items-center gap-2 self-start border-2 border-slate-900 bg-white px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-950 transition hover:border-orange-600 hover:text-orange-600"
              >
                {copiedSection === section.key ? (
                  <FiCheck className="h-3.5 w-3.5" />
                ) : (
                  <FiCopy className="h-3.5 w-3.5" />
                )}
                {copiedSection === section.key ? 'Copied' : 'Copy section'}
              </button>
            </div>
            <ol className="divide-y-2 divide-slate-50">
              {rows.map((field, index) => (
                <li
                  key={field.key}
                  className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                    {index + 1}. {field.label}
                  </span>
                  {field.type === 'select' ? (
                    <span className="inline-flex min-w-[3rem] items-center justify-center border-2 border-orange-600 bg-orange-600 px-4 py-2 text-sm font-black uppercase text-white sm:text-right">
                      {String(block[field.key]).trim()}
                    </span>
                  ) : (
                    <span className="text-sm font-black tabular-nums text-slate-950 sm:text-right">
                      {String(block[field.key]).trim()}
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </div>
        );
      })}

      {measurements.updatedAt && (
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
          Last updated: {new Date(measurements.updatedAt).toLocaleString()}
        </p>
      )}
    </div>
  );
};

export default MeasurementDisplay;
