'use client';

import { useState, useEffect } from 'react';

function SvgCircle() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <svg width="100" height="100">
      {isClient && (
        <circle
          cx="50"
          cy="50"
          r="40"
          stroke="black"
          strokeWidth="3"
          fill="red"
        />
      )}
    </svg>
  );
}

export default SvgCircle;