import React, { useState } from 'react';
import { savedReducedMotion, setMotionPreference } from './motion-settings.ts';

export function ReducedMotionSetting() {
  const [checked, setChecked] = useState(savedReducedMotion);
  return <label className="motion-setting">
    <input type="checkbox" checked={checked} onChange={event => {
      setChecked(event.target.checked);
      setMotionPreference(event.target.checked);
    }}/>
    Reduce motion
  </label>;
}
