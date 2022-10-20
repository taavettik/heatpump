import { useEffect, useState } from 'preact/hooks';

export function useCurrentTime() {
  const [time, setTime] = useState(Date.now());

  useEffect(() => {
    const timer = setInterval(() => setTime(Date.now()), 1000);

    return () => clearInterval(timer);
  }, []);

  return new Date(time);
}

export function useCurrentHours() {
  const time = useCurrentTime();

  return time.getHours() + time.getMinutes() / 60;
}
