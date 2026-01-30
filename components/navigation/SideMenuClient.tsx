'use client';
import { NavSection } from '@/features/learn';
import NavigationMenu from './NavigationMenu.client';
import { useSideMenu } from '@/contexts/SideMenuContext';

interface SideMenuClientProps {
  navigation: NavSection[];
}

export default function SideMenuClient({ navigation }: SideMenuClientProps) {
  const { isOpen, close } = useSideMenu();

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="fixed inset-0 z-40 bg-base/50 backdrop-blur-sm" onClick={close} />}

      {/* Menu */}
      <NavigationMenu navigation={navigation} variant="mobile" isOpen={isOpen} onClose={close} />
    </>
  );
}
