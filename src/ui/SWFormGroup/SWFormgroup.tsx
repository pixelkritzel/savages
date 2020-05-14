import React from 'react';

interface SWFormGroupProps<T extends keyof HTMLElementTagNameMap = 'label'>
  extends Omit<React.HTMLProps<HTMLElementTagNameMap[T]>, 'label'> {
  as?: T;
  className?: string;
  id?: string;
  label: string | JSX.Element;
}

export class SWFormGroup<T extends keyof HTMLElementTagNameMap = 'label'> extends React.Component<
  SWFormGroupProps<T>
> {
  render() {
    const { as = 'label', children, className, id, label, ...otherProps } = this.props;
    return (
      <div className={className}>
        {React.createElement(as, { htmlFor: id, ...otherProps }, label)}
        {children}
      </div>
    );
  }
}
