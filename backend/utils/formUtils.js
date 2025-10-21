// Checks required fields for the “I want to garden” form.
// Required fields: name (covers first/last) and description.
// Returns an array of missing field names (English).

function getMissingRequiredFields(formData = {}) {
  // Back-compat alias: accept French 'nom' for a while
  const name = (formData.name ?? formData.nom ?? '').toString().trim();
  const description = (formData.description ?? '').toString().trim();

  const missing = [];
  if (!name) missing.push('name');
  if (!description) missing.push('description');
  return missing;
}

module.exports = { getMissingRequiredFields };
