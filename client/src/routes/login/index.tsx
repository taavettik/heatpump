import { useMutation, useQuery } from '@tanstack/react-query';
import { route } from 'preact-router';
import { useForm } from 'react-hook-form';
import { api } from '../../common/api';
import { Stack } from '../../common/components/Layout';
import { Page } from '../../common/components/Page';
import { Text } from '../../common/components/Text';
import { useLoginMutation } from '../../hooks/mutations';
import { useMeQuery } from '../../hooks/queries';

interface LoginForm {
  username: string;
  password: string;
}

export function LoginPage({ path }: { path: string }) {
  const { data } = useMeQuery();

  const loginMutation = useLoginMutation({
    onSuccess: () => route('/'),
  });

  const { register, handleSubmit } = useForm<LoginForm>();

  return (
    <Page>
      <Text variant="title1">Login</Text>

      <form
        onSubmit={handleSubmit(async (data) => {
          loginMutation.mutate({
            username: data.username,
            password: data.password,
          });
        })}
      >
        <Stack axis="y">
          <input placeholder="Username" {...register('username')} />

          <input
            type="password"
            placeholder="Password"
            {...register('password')}
          />

          <button disabled={loginMutation.isLoading}>Login</button>
        </Stack>
      </form>
    </Page>
  );
}
