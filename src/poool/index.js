// Simple local "poool" library
// Exports a function and a small React component for demonstration.
import React from 'react';

export function getMessage() {
  return 'poool: Hello from the poool library!';
}

export function PooolBadge() {
  return (
    <span style={{
      display: 'inline-block',
      padding: '4px 8px',
      marginLeft: 8,
      background: '#4f76c5ff',
      color: 'white',
      borderRadius: 4,
      fontSize: 12
    }}>poool</span>
  );
}

export default {
  getMessage,
  PooolBadge
};
