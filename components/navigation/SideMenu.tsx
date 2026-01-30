import { getNavigation } from '@/features/learn';
import SideMenuClient from './SideMenuClient';

export default async function SideMenu() {
  const navigation = await getNavigation();
  return <SideMenuClient navigation={navigation} />;
}
