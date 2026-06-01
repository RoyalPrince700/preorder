const TROUSER_FIELDS = ['waist', 'trouserLength', 'hip', 'lap', 'waistToKnee', 'knee', 'trouserMouth'];
const SHIRT_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];

const MEASUREMENT_KEYS = {
  jacketSuit: [
    'backShoulder',
    'chest',
    'shoulderToWaist',
    'waist',
    'sleeveLength',
    'suitLength',
    'bicep',
    'shoulderToElbow',
    'elbow',
    'wrist',
  ],
  trouser: TROUSER_FIELDS,
  nativeTop: ['chest', 'shoulder', 'sleeveLength', 'topLength', 'neck', 'backLength', 'wrist'],
  nativeTrouser: TROUSER_FIELDS,
  shirt: ['shirtSize', 'chest', 'shoulder', 'sleeveLength', 'shirtLength', 'waist', 'neck', 'wrist'],
  shoes: ['ukSize', 'usSize', 'euSize', 'footLength', 'footWidth'],
};

function sanitizeBlock(input, allowedKeys, sectionKey) {
  if (!input || typeof input !== 'object') return {};
  const out = {};
  allowedKeys.forEach((key) => {
    if (input[key] === undefined || input[key] === null) return;
    if (key === 'shirtSize' && sectionKey === 'shirt') {
      const size = String(input[key]).trim().toUpperCase();
      if (SHIRT_SIZES.includes(size)) out[key] = size;
      return;
    }
    const val = String(input[key]).trim();
    if (val) out[key] = val;
  });
  return out;
}

function sanitizeMeasurements(body) {
  const result = {};
  Object.keys(MEASUREMENT_KEYS).forEach((section) => {
    result[section] = sanitizeBlock(body?.[section], MEASUREMENT_KEYS[section], section);
  });
  return result;
}

function hasAnyMeasurement(measurements) {
  if (!measurements) return false;
  return Object.values(measurements).some(
    (block) => block && typeof block === 'object' && Object.keys(block).length > 0
  );
}

module.exports = {
  MEASUREMENT_KEYS,
  SHIRT_SIZES,
  sanitizeMeasurements,
  hasAnyMeasurement,
};
