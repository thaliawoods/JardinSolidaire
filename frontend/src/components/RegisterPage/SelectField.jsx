import React, { useId } from 'react';

const SelectField = ({
  name,
  value,
  onChange,
  options = [],
  required = true,
  disabled = false,
  placeholder = '-- Choisissez votre rôle --',
  'aria-label': ariaLabel,
}) => {
  const selectId = useId();

  const styles = {
    wrapper: { marginBottom: '20px' },
    select: {
      width: '100%',
      padding: '14px',
      border: '2px solid #6ec173',
      borderRadius: '10px',
      fontSize: '18px',
      color: '#021904',
      backgroundColor: '#fff',
    },
  };

  return (
    <div style={styles.wrapper}>
      <select
        id={`${name || 'select'}-${selectId}`}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        aria-label={ariaLabel || name}
        style={styles.select}
      >
        <option value="" disabled>
          {placeholder}
        </option>

        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectField;
