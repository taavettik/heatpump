import { Schedule } from './schema';

export type CamelCaseKey<S extends string | number | Symbol> =
  S extends `${infer T}_${infer U}` ? `${T}${Capitalize<CamelCaseKey<U>>}` : S;

export type CamelCase<T> = {
  [K in keyof T as CamelCaseKey<K>]: T[K];
};

export type Resolved<T> = T extends Promise<any>
  ? Parameters<NonNullable<Parameters<T['then']>[0]>>[0]
  : T;

export type CreateSchedulePayload = Omit<
  CamelCase<Schedule>,
  'id' | 'çreatedAt'
>;
