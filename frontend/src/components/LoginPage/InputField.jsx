import React, { useId } from 'react';

const InputField = ({
  type = 'text',
  name,
  value,
  onChange,
  placeholder,
  required = true,
  autoComplete,
  autoFocus = false,
  'aria-invalid': ariaInvalid,
}) => {
  const inputId = useId();

  const styles = {
    wrapper: { marginBottom: '20px' },
    input: {
      width: '100%',
      padding: '14px',
      border: '2px solid #6ec173',
      borderRadius: '10px',
      fontSize: '18px',
      color: '#021904',
    },
  };

  return (
    <div style={styles.wrapper}>
      <input
        id={`${name || 'field'}-${inputId}`}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}  
        required={required}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        aria-invalid={ariaInvalid}
        style={styles.input}
      />
    </div>
  );
};

export default InputField;
