import { HugeiconsIcon } from "@hugeicons/react";
import {
  PackageIcon,
  DropletIcon,
  BandageIcon,
  ScissorIcon,
  Shield01Icon,
  Medicine01Icon,
  Medicine02Icon,
  StethoscopeIcon,
  WindPowerIcon,
  AmbulanceIcon,
  FavouriteIcon,
} from "@hugeicons/core-free-icons";

type IconType = typeof PackageIcon;

const ICON_MAP: Record<string, IconType> = {
  PackageIcon,
  DropletIcon,
  BandageIcon,
  ScissorIcon,
  Shield01Icon,
  SafetyIcon: Shield01Icon,
  Medicine01Icon,
  Medicine02Icon,
  StethoscopeIcon,
  WindPowerIcon,
  AmbulanceIcon,
  FavouriteIcon,
};

export function CategoryIcon({
  name,
  className,
}: {
  name?: string | null;
  className?: string;
}) {
  const icon = (name && ICON_MAP[name]) || PackageIcon;
  return (
    <HugeiconsIcon icon={icon} strokeWidth={2} className={className ?? "size-5"} />
  );
}
