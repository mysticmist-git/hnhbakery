export interface TabItem {
  label: string;
  href: string;
}

export interface NavbarContextType {
  tabs: any;
  handleSetTabState: any;
  drawerOpen: boolean;
  handleSetDrawerOpenState: any;
  isSignIn: boolean;
  isScrolled: boolean;
  cartCount: number;
}
