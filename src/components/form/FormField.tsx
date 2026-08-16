import React from 'react';
import { TemplateField } from '../../templates/types';
import FormTextField from './FormTextField';
import FormDateField from './FormDateField';
import FormSelectField from './FormSelectField';

interface Props {
  field: TemplateField;
  value: any;
  onChange: (value: any) => void;
  error?: string;
}

/** Renders the control for a template field definition. */
const FormField: React.FC<Props> = ({ field, value, onChange, error }) => {
  switch (field.type) {
    case 'date':
      return (
        <FormDateField
          label={field.label}
          value={value}
          onChange={onChange}
          required={field.required}
        />
      );
    case 'select':
      return (
        <FormSelectField
          label={field.label}
          value={value}
          options={field.options ?? []}
          onChange={onChange}
          required={field.required}
          error={error}
        />
      );
    case 'number':
      return (
        <FormTextField
          label={field.label}
          value={value ?? ''}
          onChangeText={onChange}
          keyboardType="number-pad"
          required={field.required}
          error={error}
        />
      );
    case 'notes':
      return (
        <FormTextField
          label={field.label}
          value={value ?? ''}
          onChangeText={onChange}
          multiline
          required={field.required}
          error={error}
        />
      );
    case 'items':
      return null; // rendered by the screen inside its section
    case 'text':
    default:
      return (
        <FormTextField
          label={field.label}
          value={value ?? ''}
          onChangeText={onChange}
          keyboardType={field.keyboardType}
          required={field.required}
          placeholder={field.placeholder}
          error={error}
        />
      );
  }
};

export default FormField;
