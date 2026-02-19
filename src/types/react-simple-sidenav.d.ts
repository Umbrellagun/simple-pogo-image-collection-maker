declare module 'react-simple-sidenav' {
  import { ReactNode, CSSProperties } from 'react';

  interface SideNavProps {
    showNav: boolean;
    onHideNav: () => void;
    title?: ReactNode;
    items?: ReactNode[];
    navStyle?: CSSProperties;
    titleStyle?: CSSProperties;
    itemStyle?: CSSProperties;
    itemHoverStyle?: CSSProperties;
    children?: ReactNode;
  }

  export const SideNav: React.FC<SideNavProps>;
  export default SideNav;
}
