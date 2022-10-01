import { render } from 'preact';
import { App } from './App';
import * as preact from 'preact';

(window as any).h = preact.h;
(window as any).preact = preact;

render(<App />, document.body);
