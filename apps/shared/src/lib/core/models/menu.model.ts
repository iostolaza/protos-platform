export interface MenuItem {
  group: string;
  separator: boolean;
  items: SubMenuItem[];
  active?: boolean;
}

export interface SubMenuItem {
  label: string;
  icon?: string;
  route?: string | null;
  children?: SubMenuItem[];
  expanded?: boolean;
  active?: boolean;
  adminOnly?: boolean; // For conditional display
}
