import { Component, ComponentChildren, ComponentType } from 'preact';
import BrowserRouter, { route } from 'preact-router';
import { useEffect } from 'preact/hooks';
import { useMeQuery } from './hooks/queries';
import { HomePage } from './routes/home';
import { LoginPage } from './routes/login';
import { SchedulePage } from './routes/schedule';
import { SchedulesPage } from './routes/schedules';

function ProtectedRoute({
  path,
  component: Component,
  ...props
}: {
  path: string;
  component: ComponentType<any>;
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

  return <Component {...props} />;
}

export function Router() {
  return (
    <BrowserRouter>
      <LoginPage path="/login" />

      <ProtectedRoute path="/" component={HomePage} />

      <ProtectedRoute path="/schedules" component={SchedulesPage} />

      <ProtectedRoute path="/schedules/:id" component={SchedulePage} />
    </BrowserRouter>
  );
}
