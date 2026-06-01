export const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

export const TROUSER_FIELD_KEYS = [
  'waist',
  'trouserLength',
  'hip',
  'lap',
  'waistToKnee',
  'knee',
  'trouserMouth',
];

export const MEASUREMENT_SECTIONS = [
  {
    key: 'jacketSuit',
    title: 'Jacket (Suit) Measurements',
    fields: [
      { key: 'backShoulder', label: 'Back/Shoulder (Bone to Bone)' },
      { key: 'chest', label: 'Chest (Round Chest no space)' },
      { key: 'shoulderToWaist', label: 'Shoulder to Waist (SH–W – Shoulder to Navel Tip)' },
      { key: 'waist', label: 'Waist (Tummy/Navel Round)' },
      { key: 'sleeveLength', label: 'Sleeve Length' },
      { key: 'suitLength', label: 'Suit Length (Full Jacket Length)' },
      { key: 'bicep', label: 'Bicep (Upper Arm Round)' },
      { key: 'shoulderToElbow', label: 'Shoulder to Elbow' },
      { key: 'elbow', label: 'Elbow (Round Elbow Section)' },
      { key: 'wrist', label: 'Wrist' },
    ],
  },
  {
    key: 'trouser',
    title: 'Trouser Measurements',
    fields: [
      { key: 'waist', label: 'Waist' },
      { key: 'trouserLength', label: 'Trouser Length' },
      { key: 'hip', label: 'Hip' },
      { key: 'lap', label: 'Lap/Thigh' },
      { key: 'waistToKnee', label: 'Waist to Knee (W–Knee)' },
      { key: 'knee', label: 'Knee' },
      { key: 'trouserMouth', label: 'Trouser mouth' },
    ],
  },
  {
    key: 'nativeTop',
    title: 'Native Attire — Top (Buba / Shirt)',
    fields: [
      { key: 'chest', label: 'Chest (Round Chest no space)' },
      { key: 'shoulder', label: 'Shoulder (Bone to Bone)' },
      { key: 'sleeveLength', label: 'Sleeve Length' },
      { key: 'topLength', label: 'Top Length (Buba / Shirt Length)' },
      { key: 'neck', label: 'Neck' },
      { key: 'backLength', label: 'Back Length (Agbada / Full Back)' },
      { key: 'wrist', label: 'Wrist' },
    ],
  },
  {
    key: 'nativeTrouser',
    title: 'Native Attire — Trouser (Sokoto)',
    fields: [
      { key: 'waist', label: 'Waist' },
      { key: 'trouserLength', label: 'Trouser Length' },
      { key: 'hip', label: 'Hip' },
      { key: 'lap', label: 'Lap/Thigh' },
      { key: 'waistToKnee', label: 'Waist to Knee (W–Knee)' },
      { key: 'knee', label: 'Knee' },
      { key: 'trouserMouth', label: 'Trouser mouth' },
    ],
  },
  {
    key: 'shirt',
    title: 'Shirt Measurements',
    fields: [
      {
        key: 'shirtSize',
        label: 'Shirt Size',
        type: 'select',
        options: SHIRT_SIZES,
      },
      { key: 'chest', label: 'Chest (Round Chest no space)' },
      { key: 'shoulder', label: 'Shoulder (Bone to Bone)' },
      { key: 'sleeveLength', label: 'Sleeve Length' },
      { key: 'shirtLength', label: 'Shirt Length' },
      { key: 'waist', label: 'Waist' },
      { key: 'neck', label: 'Neck' },
      { key: 'wrist', label: 'Wrist' },
    ],
  },
  {
    key: 'shoes',
    title: 'Shoes',
    fields: [
      { key: 'ukSize', label: 'UK Size' },
      { key: 'usSize', label: 'US Size' },
      { key: 'euSize', label: 'EU Size' },
      { key: 'footLength', label: 'Foot Length (cm)' },
      { key: 'footWidth', label: 'Foot Width (cm)' },
    ],
  },
];

export const emptyMeasurements = () => {
  const data = {};
  MEASUREMENT_SECTIONS.forEach((section) => {
    data[section.key] = {};
    section.fields.forEach((f) => {
      data[section.key][f.key] = '';
    });
  });
  return data;
};

export const hasAnyMeasurement = (measurements) => {
  if (!measurements) return false;
  return MEASUREMENT_SECTIONS.some((section) => {
    const block = measurements[section.key];
    if (!block || typeof block !== 'object') return false;
    return section.fields.some((f) => {
      const v = block[f.key];
      return v !== undefined && v !== null && String(v).trim() !== '';
    });
  });
};

export const formatMeasurementsForCopy = (measurements) => {
  if (!measurements || !hasAnyMeasurement(measurements)) {
    return '';
  }

  const lines = [];
  MEASUREMENT_SECTIONS.forEach((section) => {
    const block = measurements[section.key];
    if (!block) return;

    const entries = section.fields
      .map((f, i) => {
        const val = block[f.key];
        if (val === undefined || val === null || String(val).trim() === '') return null;
        return `${i + 1}.\t${f.label} : ${String(val).trim()}`;
      })
      .filter(Boolean);

    if (entries.length) {
      lines.push(section.title);
      lines.push(...entries);
      lines.push('');
    }
  });

  return lines.join('\n').trim();
};
