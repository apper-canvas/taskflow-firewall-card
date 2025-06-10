import HomePage from '@/components/pages/HomePage';

export const routes = {
  home: {
    id: 'home',
    label: 'Home',
    path: '/home',
    icon: 'Home',
component: HomePage
  }
};

export const routeArray = Object.values(routes);