import { MenuItem } from '../models/menu.model';

export class Menu {
  public static pages: MenuItem[] = [
    {
      group: 'Dashboard',
      items: [
        { icon: 'home', label: 'Home', route: '/main-layout/home' }
      ]
    }
  ];
}
