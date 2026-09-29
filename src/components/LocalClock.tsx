"use client";

import { useEffect, useState } from "react";
import { site } from "@/config/site";

export function LocalClock() {
  const [time, setTime] = useState("");
  useEffect(() => {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: site.timeZone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    const update = () => setTime(formatter.format(new Date()));
    update();
    const id = window.setInterval(update, 30_000);
    return () => window.clearInterval(id);
  }, []);
  return <time aria-label={`${site.location} local time ${time}`}>{time}</time>;
}
