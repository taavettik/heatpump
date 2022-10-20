import { ComponentChildren } from 'preact';
import BrowserRouter, { route } from 'preact-router';
import { useEffect } from 'preact/hooks';
import { useMeQuery } from './hooks/queries';
import { HomePage } from './routes/home';
import { LoginPage } from './routes/login';
import { SchedulesPage } from './routes/schedules';

function ProtectedRoute({
  path,
  children,
}: {
  path: string;
  children: ComponentChildren;
}) {
  const { error, data, isLoading } = useMeQuery({
    retry: false,
  });

  useEffect(() => {
    if (!isLoading && error) {
      route('/login');
    }
  }, [error, isLoading]);

  if (!data) {
    return null;
  }

  return <>{children}</>;
}

export function Router() {
  return (
    <BrowserRouter>
      <LoginPage path="/login" />

      <ProtectedRoute path="/">
        <HomePage />
      </ProtectedRoute>

      <ProtectedRoute path="/schedules">
        <SchedulesPage />
      </ProtectedRoute>
    </BrowserRouter>
  );
}
