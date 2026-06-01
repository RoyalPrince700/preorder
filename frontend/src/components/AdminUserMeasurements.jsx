import React, { useEffect, useState } from 'react';
import { IoMdClose } from 'react-icons/io';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import { MEASUREMENT_SECTIONS, emptyMeasurements, SHIRT_SIZES } from '../constants/measurementFields';

const inputClass =
  'w-full rounded-none border-2 border-slate-200 bg-slate-50 px-3 py-2 text-xs font-bold text-slate-950 outline-none focus:border-orange-500';

const AdminUserMeasurements = ({ user, onClose, onSaved }) => {
  const [form, setForm] = useState(emptyMeasurements());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const url = `${SummaryApi.getUserMeasurements.url}?userId=${user._id}`;
        const res = await fetch(url, {
          method: SummaryApi.getUserMeasurements.method,
          credentials: 'include',
        });
        const result = await res.json();
        if (result.success && result.data) {
          const merged = emptyMeasurements();
          MEASUREMENT_SECTIONS.forEach((section) => {
            const block = result.data[section.key] || {};
            section.fields.forEach((f) => {
              if (block[f.key] !== undefined) {
                merged[section.key][f.key] = block[f.key];
              }
            });
          });
          setForm(merged);
        } else {
          setForm(emptyMeasurements());
        }
      } catch {
        toast.error('Could not load measurements');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user._id]);

  const handleFieldChange = (sectionKey, fieldKey, value) => {
    setForm((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        [fieldKey]: value,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(SummaryApi.updateUserMeasurements.url, {
        method: SummaryApi.updateUserMeasurements.method,
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user._id,
          measurements: form,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast.success(result.message);
        onSaved?.();
        onClose();
      } else {
        toast.error(result.message || 'Failed to save measurements');
      }
    } catch {
      toast.error('Could not save measurements');
    } finally {
      setSaving(false);
    }
  };

  const displayName = user.fullName || user.email;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col border-2 border-slate-900 bg-white shadow-2xl">
        <div className="flex shrink-0 items-center justify-between border-b-2 border-slate-900 bg-slate-950 px-6 py-4 text-white">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-400">
              Customer measurements
            </p>
            <h2 className="mt-1 text-sm font-black uppercase tracking-widest truncate max-w-[240px] sm:max-w-md">
              {displayName}
            </h2>
            <p className="text-[10px] font-bold text-slate-400 truncate">{user.email}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center border-2 border-white/20 transition hover:border-orange-500"
            aria-label="Close"
          >
            <IoMdClose className="h-6 w-6" />
          </button>
        </div>

        {loading ? (
          <div className="flex flex-1 items-center justify-center p-12">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">Loading…</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-10">
              {MEASUREMENT_SECTIONS.map((section) => (
                <div key={section.key}>
                  <h3 className="mb-4 border-b-2 border-slate-100 pb-2 text-xs font-black uppercase tracking-widest text-slate-950">
                    {section.title}
                  </h3>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {section.fields.map((field, index) => (
                      <div
                        key={field.key}
                        className={field.type === 'select' ? 'sm:col-span-2' : ''}
                      >
                        <label className="mb-1 block text-[10px] font-bold uppercase tracking-wide text-slate-500 leading-snug">
                          {index + 1}. {field.label}
                        </label>
                        {field.type === 'select' ? (
                          <select
                            value={form[section.key]?.[field.key] ?? ''}
                            onChange={(e) =>
                              handleFieldChange(section.key, field.key, e.target.value)
                            }
                            className={inputClass}
                          >
                            <option value="">— Select size —</option>
                            {(field.options || SHIRT_SIZES).map((size) => (
                              <option key={size} value={size}>
                                {size}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            inputMode="decimal"
                            value={form[section.key]?.[field.key] ?? ''}
                            onChange={(e) =>
                              handleFieldChange(section.key, field.key, e.target.value)
                            }
                            className={inputClass}
                            placeholder="—"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="flex shrink-0 gap-3 border-t-2 border-slate-100 bg-slate-50 p-4">
              <button
                type="submit"
                disabled={saving}
                className="flex-1 bg-slate-950 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white transition hover:bg-orange-600 disabled:opacity-60"
              >
                {saving ? 'Saving…' : 'Save measurements'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="border-2 border-slate-900 px-6 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-950"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminUserMeasurements;
