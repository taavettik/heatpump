export type CamelCaseKey<S extends string | number | Symbol> =
  S extends `${infer T}_${infer U}` ? `${T}${Capitalize<CamelCaseKey<U>>}` : S;

export type CamelCase<T extends { [key: string]: any }> = {
  [K in keyof T as CamelCaseKey<K>]: T[K];
};
