"use client"

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu"
import { Home, Trophy, User } from "lucide-react"
import Link from "next/link"

export function BottomNav() {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 w-fit px-4 py-2 bg-white border shadow-lg rounded-full backdrop-blur-sm">
      <NavigationMenu>
        <NavigationMenuList className="flex gap-6">
          <NavigationMenuItem>
            <Link href="/" legacyBehavior passHref>
              <NavigationMenuLink className="flex flex-col items-center text-sm text-gray-700 hover:text-black">
                <Home size={20} />
                Home
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/achievements" legacyBehavior passHref>
              <NavigationMenuLink className="flex flex-col items-center text-sm text-gray-700 hover:text-black">
                <Trophy size={20} />
                Achievements
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>

          <NavigationMenuItem>
            <Link href="/profile" legacyBehavior passHref>
              <NavigationMenuLink className="flex flex-col items-center text-sm text-gray-700 hover:text-black">
                <User size={20} />
                Profile
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
