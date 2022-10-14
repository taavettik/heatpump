import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { globalCss } from './common/constants/styled';
import { Router } from './Router';

const queryClient = new QueryClient();

const globalStyle = globalCss({
  body: {
    backgroundColor: '$primaryMain',
  },
});

export function App() {
  globalStyle();

  return (
    <QueryClientProvider client={queryClient}>
      <Router />
    </QueryClientProvider>
  );
}
