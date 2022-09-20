import { Stack } from '../../common/components/Layout';
import { Page } from '../../common/components/Page';
import { WheelInput } from './WheelInput';

interface Props {
  path?: string;
}

export function HomePage(props: Props) {
  return (
    <Page>
      <Stack justify="flex-end" axis="x" spacing="small">
        <span>a</span> <span>b</span> <span>c</span>
      </Stack>
      <h1>Home page</h1>

      <WheelInput />
    </Page>
  );
}
