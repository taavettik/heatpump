import { CamelCase, Resolved } from './types';

function toCamelCase(str: string) {
  const arr = str.split(/_([a-z]+)/g);
  return (
    arr[0] +
    arr
      .slice(1)
      .filter(Boolean)
      .map((w) => `${w[0].toLocaleUpperCase()}${w.slice(1)}`)
      .join('')
  );
}

type CamelCaseReturn<T> = T extends Array<any>
  ? CamelCase<T[0]>[]
  : T extends Promise<any>
  ? Promise<CamelCaseReturn<Resolved<T>>>
  : CamelCase<T>;

interface asd {
  hello_world: 'asd';
}

export function camelCase<T>(obj: T): CamelCaseReturn<T> {
  if (Array.isArray(obj)) {
    return obj.map((e) => camelCase(e)) as any;
  }

  if (obj instanceof Promise) {
    return obj.then((res) => camelCase(res)) as any;
  }

  return Object.entries(obj as any).reduce(
    (obj, [key, val]) => ({
      ...obj,
      [toCamelCase(key)]: val,
    }),
    {},
  ) as any;
}
