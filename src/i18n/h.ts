import React from 'react';
import { tr } from './index';

const map = (k: unknown): unknown => (typeof k === 'string' ? tr(k) : Array.isArray(k) ? k.map(map) : k);

/** JSX factory: translates visible strings at render so screens stay plain JSX. */
export function __h(type: any, props: any, ...kids: any[]) {
  let p = props;
  for (const key of ['aria-label', 'placeholder']) {
    if (typeof p?.[key] === 'string') p = { ...p, [key]: tr(p[key]) };
  }
  return React.createElement(type, p, ...(kids.map(map) as any[]));
}
