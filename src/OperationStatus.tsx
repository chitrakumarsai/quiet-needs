import React from 'react';

export function OperationStatus({ busy, message }: { busy?: boolean; message: string }) {
  return <p className="operation-status" role="status">
    {busy && <span className="progress-ring" aria-hidden="true"/>}
    {message}
  </p>;
}
