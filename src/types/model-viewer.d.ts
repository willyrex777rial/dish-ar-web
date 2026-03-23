import React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          src?: string
          'ios-src'?: string
          alt?: string
          ar?: boolean | string
          'ar-modes'?: string
          'camera-controls'?: boolean | string
          'auto-rotate'?: boolean | string
          style?: React.CSSProperties
          className?: string
        },
        HTMLElement
      >
    }
  }
}

export {}
