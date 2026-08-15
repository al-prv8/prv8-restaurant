// SidebarSimple.tsx — deprecated
// The sidebar navigation has been replaced by TopNav.tsx (top horizontal navbar).
// This file is kept as a stub to avoid breaking any residual imports during transition.

export function SidebarNavigationSimple() {
  return null;
}

export interface NavItemType {
  id?: string;
  label: string;
  href: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: any;
  badge?: number | string;
  items?: NavItemType[];
}

export interface SidebarNavigationSimpleProps {
  items: NavItemType[];
  footerItems?: NavItemType[];
  featureCard?: React.ReactNode;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
  onResetDemo?: () => void;
}
