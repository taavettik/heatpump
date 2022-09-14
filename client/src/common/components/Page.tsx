import { ComponentChildren } from 'preact';

interface Props {
  children?: ComponentChildren;
}

export function Page({ children }: Props) {
  return <div>{children}</div>;
}
