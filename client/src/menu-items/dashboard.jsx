// assets
import { BarChartOutlined } from '@ant-design/icons';

// icons
const icons = {
  BarChartOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard = {
  id: 'group-dashboard',
  title: 'Navigation',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Tableau de bord',
      type: 'item',
      url: '/dashboard/default',
      icon: icons.BarChartOutlined,
      breadcrumbs: false
    }
  ]
};

export default dashboard;
