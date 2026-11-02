import Dashboard from "@/components/Dashboard";
import GameWorld from "@/components/game/GameWorld";
import ModeSwitcher from "@/components/ModeSwitcher";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";

export default function Home() {
  return (
    <>
      <SiteHeader showModeToggle />
      <ModeSwitcher classic={<Dashboard />} game={<GameWorld />} />
      <SiteFooter />
    </>
  );
}
