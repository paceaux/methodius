// this doesn't build properly with exported class if this isn't exported as default
/* eslint-disable-next-line import/no-named-default */
import { default as Methodius } from './methodius.class';

// I just like being explicit
/* eslint-disable import/prefer-default-export */
export { Methodius };
