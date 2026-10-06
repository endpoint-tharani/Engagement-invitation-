import { useEffect, useState } from "react";

export function useCountdown(target: string) {
  const targetTime = new Date(target).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    let timer = 0;
    // Tick on the second boundary so all four numbers change together.
    const tick = () => {
      setNow(Date.now());
      timer = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    timer = window.setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    return () => window.clearTimeout(timer);
  }, []);

  const remaining = Math.max(0, (Number.isNaN(targetTime) ? 0 : targetTime) - now);
  const seconds = Math.floor(remaining / 1000);

  return {
    days: Math.floor(seconds / 86_400),
    hours: Math.floor((seconds % 86_400) / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
    done: remaining === 0,
  };
}
