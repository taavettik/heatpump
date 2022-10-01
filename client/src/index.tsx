import { render } from 'preact';
import { App } from './App';
import { h } from 'preact';

(window as any).h = h;

render(<App />, document.body);
