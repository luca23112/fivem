const categories = [
  'moderation',
  'community',
  'tickets',
  'automation',
  'security',
  'fun',
  'team',
  'analytics',
  'welcome',
  'economy'
];

const features = [];
let i = 1;
for (const category of categories) {
  for (let n = 1; n <= 22; n += 1) {
    features.push({
      id: `${category}_${String(n).padStart(2, '0')}`,
      name: `${category.toUpperCase()} Funktion ${n}`,
      category,
      description: `Konfigurierbare ${category}-Funktion #${n}`
    });
    i += 1;
  }
}

function getFeature(id) {
  return features.find((f) => f.id === id);
}

module.exports = { features, getFeature };
