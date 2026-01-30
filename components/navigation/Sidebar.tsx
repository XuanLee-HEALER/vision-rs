import { getNavigation } from '@/features/learn';
import NavigationMenu from './NavigationMenu.client';

export default async function Sidebar() {
  const navigation = await getNavigation();

  return <NavigationMenu navigation={navigation} variant="sidebar" />;
}
