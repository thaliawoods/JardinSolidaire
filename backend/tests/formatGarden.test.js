const { getMissingRequiredFields } = require('../utils/formUtils');

describe('getMissingRequiredFields (backend)', () => {
  test('returns [] when name and description are properly filled', () => {
    const formData = {
      name: 'Alice Dupont',
      description: "J'ai 5 ans d'expérience en jardinage",
      location: 'Paris',
      area: '20m²',
      services: 'Potager',
      photos: [],
    };
    expect(getMissingRequiredFields(formData)).toEqual([]);
  });

  test('flags "name" if the name field is empty or whitespace', () => {
    const formData = {
      name: '   ',
      description: 'Il fait beau dans le jardin',
      location: '',
      area: '',
      services: '',
      photos: [],
    };
    expect(getMissingRequiredFields(formData)).toEqual(['name']);
  });

  test('flags "description" if the description field is empty', () => {
    const formData = {
      name: 'Bob Martin',
      description: '',
      location: 'Lyon',
      area: '',
      services: '',
      photos: [],
    };
    expect(getMissingRequiredFields(formData)).toEqual(['description']);
  });

  test('flags ["name","description"] if both fields are empty', () => {
    const formData = {
      name: '',
      description: '    ',
      location: 'Marseille',
      area: '',
      services: '',
      photos: [],
    };

    const missing = getMissingRequiredFields(formData);
    expect(missing.sort()).toEqual(['description', 'name']);
  });

  test('ignores other fields (only name & description are required)', () => {
    const formData = {
      name: 'Carole',
      description: 'Je jardine en ville',
      location: '',
      area: '',
      services: '',
      photos: [],
    };
    expect(getMissingRequiredFields(formData)).toEqual([]);
  });
});
