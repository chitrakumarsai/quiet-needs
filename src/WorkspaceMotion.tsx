import React, { forwardRef, useImperativeHandle, useLayoutEffect, useRef } from 'react';
import { useIsPresent } from 'motion/react';
import * as m from 'motion/react-m';

type MotionDiv = React.ComponentPropsWithoutRef<typeof m.div>;

export const MotionLayer = forwardRef<HTMLDivElement, MotionDiv>(function MotionLayer(props, ref) {
  const present = useIsPresent();
  const element = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => element.current!, []);
  useLayoutEffect(() => { if (element.current) element.current.inert = !present; }, [present]);
  return <m.div {...props} ref={element} aria-hidden={present ? props['aria-hidden'] : true}/>;
});

export function ApprovalMark() {
  return <span className="approval-mark" aria-hidden="true">
    <span className="approval-glow"/>
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path className="check-start" d="M5 12l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path className="check-end" d="M10 17l9-10" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </span>;
}
