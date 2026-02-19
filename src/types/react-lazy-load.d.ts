declare module 'react-lazy-load' {
  import { ReactNode, CSSProperties } from 'react';

  interface LazyLoadProps {
    children?: ReactNode;
    className?: string;
    height?: number | string;
    offset?: number;
    offsetBottom?: number;
    offsetHorizontal?: number;
    offsetLeft?: number;
    offsetRight?: number;
    offsetTop?: number;
    offsetVertical?: number;
    onContentVisible?: () => void;
    threshold?: number;
    width?: number | string;
    style?: CSSProperties;
  }

  const LazyLoad: React.FC<LazyLoadProps>;
  export default LazyLoad;
}
