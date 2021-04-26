type DataPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];

type FilterReadOnlyTypes<T> = {
  [K in keyof T]: T[K] extends Readonly<any> ? never : K;
}[keyof T];

type DataPropertiesOnly<T> = {
  [P in DataPropertyNames<T>]: T[P] extends object
    ? FilterReadOnlyTypes<OnlyProperties<T[P]>>
    : T[P];
};

export type OnlyProperties<T> = DataPropertiesOnly<T>;
