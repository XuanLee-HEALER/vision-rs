import { getNavigation } from '@/features/learn';
import SideMenuClient from './SideMenu.client';

export default async function SideMenu() {
  const navigation = await getNavigation();

  return <SideMenuClient navigation={navigation} />;
}
