import { globalCss } from './common/constants/styled';
import { Router } from './Router';

const globalStyle = globalCss({
  body: {
    backgroundColor: '$primaryMain',
  },
});

export function App() {
  globalStyle();

  return <Router />;
}
