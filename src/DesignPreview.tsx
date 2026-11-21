import React from 'react';

export const directions = [
  ['a', 'Refined minimalism'],
  ['b', 'Experimental premium'],
  ['c', 'Balanced hybrid'],
] as const;

export type Direction = typeof directions[number][0];

export function directionFromLocation(): Direction {
  const value = new URLSearchParams(location.search).get('design');
  return value === 'a' || value === 'b' ? value : 'c';
}

export function DirectionPicker({ direction, onSelect }: {
  direction: Direction;
  onSelect: (direction: Direction) => void;
}) {
  return <fieldset className="direction-picker">
    <legend>Compare designs</legend>
    {directions.map(([id, label]) => <button type="button" key={id} aria-pressed={id === direction}
      onClick={() => onSelect(id)}>{id.toUpperCase()} · {label}</button>)}
  </fieldset>;
}

export function CardArtwork({ direction }: { direction: Direction }) {
  if (direction === 'a') return <svg className="card-art" viewBox="0 0 192 74" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor" strokeWidth="1.5">
      <path d="M14 16h51v43H14z M23 27h29 M23 36h22 M23 45h33 M76 37h38m-7-6 7 6-7 6 M126 10h52v53h-52z M135 22h34 M135 31h34 M135 40h21"/>
      <path d="m144 51 5 5 10-10" strokeWidth="2"/>
    </g>
  </svg>;

  if (direction === 'b') return <svg className="card-art" viewBox="0 0 300 132" aria-hidden="true" focusable="false">
    <g fill="none" stroke="currentColor">
      <path d="M5 100h290M5 32h290M33 8v116M261 8v116" opacity=".22"/>
      <path d="M33 95 85 25h68l-52 70z M74 106l53-70h67l-53 70z M118 118l54-70h86l-54 70z" fill="var(--paper)" strokeWidth="2"/>
      <path d="M89 39h41m-52 14h32m27-4h33m-43 14h32m47-1h23m-48 18h41m-51 15h38" strokeWidth="2"/>
      <path d="m231 36 8-11 15 1m-5-6 5 6-4 6M16 65h27m-4-4 4 4-4 4m192 28 8-1 7-10" strokeWidth="2"/>
      <circle cx="59" cy="93" r="3" fill="currentColor"/><circle cx="277" cy="70" r="4" fill="currentColor"/>
    </g>
  </svg>;

  return <svg className="card-art" viewBox="0 0 244 106" aria-hidden="true" focusable="false">
    <path d="M24 58c20-45 61-48 102-27s57 17 94-4c16 35-9 66-56 67S58 107 24 58Z" fill="var(--accent)"/>
    <g stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
      <path d="m48 27 67 10-9 59-67-10z" fill="var(--surface)"/>
      <path d="m53 41 46 7M51 52l45 7M49 63l26 4" opacity=".7"/>
      <path d="m106 20 75-8 9 68-75 8z" fill="var(--paper)"/>
      <path d="m119 34 50-5m-49 16 50-5m-49 16 32-4" opacity=".7"/>
      <path d="m157 66 7 5 13-15" fill="none" strokeWidth="2.5"/>
    </g>
    <path d="M204 21v16m-8-8h16M31 43v12m-6-6h12" stroke="currentColor" fill="none" opacity=".7"/>
  </svg>;
}
