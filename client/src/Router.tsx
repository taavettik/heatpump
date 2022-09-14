import BrowserRouter from 'preact-router';
import { HomePage } from './routes/home';

export function Router() {
  return (
    <BrowserRouter>
      <HomePage path="/" />
    </BrowserRouter>
  );
}
