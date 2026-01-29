import { getNavigation } from '@/features/learn';
import SidebarClient from './Sidebar.client';

export default async function Sidebar() {
  const navigation = await getNavigation();

  return <SidebarClient navigation={navigation} />;
}
