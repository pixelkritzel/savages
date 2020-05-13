import React from 'react';

export const SWFormGroup: React.FC<{
  className?: string;
  id?: string;
  label: string | JSX.Element;
}> = ({ children, className, id, label, ...otherProps }) => (
  <div className={className}>
    <label htmlFor={id}>{label}</label>
    {children}
  </div>
);
