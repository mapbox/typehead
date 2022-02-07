import { isString } from 'lodash';

// @ts-expect-error - this is a string
import css from './index.css';

export { css };

export function hello() {
  return isString('Hello world!');
}
