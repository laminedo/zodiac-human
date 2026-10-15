import { useEffect, useState } from 'react';
import { buildChart, zonedToUtc } from './hd/engine.js';

const KEY = 'zodiac-human.profiles.v1';

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

export function useProfiles() {
  const [profiles, setProfiles] = useState(load);
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(profiles));
    } catch {
      /* storage unavailable — keep in memory */
    }
  }, [profiles]);
  return [profiles, setProfiles];
}

const cache = new Map();
export function chartFor(profile) {
  const key = `${profile.date}|${profile.time}|${profile.tz}`;
  if (!cache.has(key)) cache.set(key, buildChart(zonedToUtc(profile.date, profile.time, profile.tz)));
  return cache.get(key);
}
