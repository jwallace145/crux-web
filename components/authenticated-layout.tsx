"use client";

import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  TransitionChild,
} from "@headlessui/react";
import {
  Bars3Icon,
  BoltIcon,
  BookOpenIcon,
  ChartBarIcon,
  HomeIcon,
  MapIcon,
  MapPinIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
  { name: "Logbook", href: "/logbook", icon: BookOpenIcon },
  { name: "Routes", href: "/routes", icon: MapIcon },
  { name: "Training", href: "/training", icon: BoltIcon },
  { name: "Progress", href: "/progress", icon: ChartBarIcon },
  { name: "Gyms & Crags", href: "/locations", icon: MapPinIcon },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface AuthenticatedLayoutProps {
  children: React.ReactNode;
}

export default function AuthenticatedLayout({
  children,
}: AuthenticatedLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  // Get display name for user
  const userDisplayName = user?.first_name
    ? `${user.first_name} ${user.last_name || ""}`.trim()
    : user?.username || user?.email || "User";

  // Get user initials for avatar
  const userInitials = user?.first_name
    ? `${user.first_name[0]}${user.last_name?.[0] || ""}`.toUpperCase()
    : user?.username?.[0]?.toUpperCase() || "U";

  return (
    <div>
      {/* Mobile sidebar */}
      <Dialog
        open={sidebarOpen}
        onClose={setSidebarOpen}
        className="relative z-50 lg:hidden"
      >
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-900/80 transition-opacity duration-300 ease-linear data-closed:opacity-0"
        />

        <div className="fixed inset-0 flex">
          <DialogPanel
            transition
            className="relative mr-16 flex w-full max-w-xs flex-1 transform transition duration-300 ease-in-out data-closed:-translate-x-full"
          >
            <TransitionChild>
              <div className="absolute top-0 left-full flex w-16 justify-center pt-5 duration-300 ease-in-out data-closed:opacity-0">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="-m-2.5 p-2.5"
                >
                  <span className="sr-only">Close sidebar</span>
                  <XMarkIcon aria-hidden="true" className="size-6 text-white" />
                </button>
              </div>
            </TransitionChild>

            {/* Mobile sidebar content */}
            <div className="relative flex grow flex-col gap-y-5 overflow-y-auto bg-gray-900 px-6 pb-2 ring-1 ring-white/10">
              <div className="relative flex h-16 shrink-0 items-center">
                <Link href="/dashboard">
                  <h1 className="text-xl font-bold text-white">CruxProject</h1>
                </Link>
              </div>
              <nav className="flex flex-1 flex-col">
                <ul className="flex flex-1 flex-col gap-y-7">
                  <li>
                    <ul className="-mx-2 space-y-1">
                      {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <li key={item.name}>
                            <Link
                              href={item.href}
                              className={classNames(
                                isActive
                                  ? "bg-white/5 text-white"
                                  : "text-gray-400 hover:bg-white/5 hover:text-white",
                                "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                              )}
                            >
                              <item.icon
                                aria-hidden="true"
                                className="size-6 shrink-0"
                              />
                              {item.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  </li>
                  <li className="-mx-6 mt-auto">
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-white/5"
                    >
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-medium text-gray-400 outline -outline-offset-1 outline-white/10">
                        {userInitials}
                      </span>
                      <span aria-hidden="true">{userDisplayName}</span>
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </DialogPanel>
        </div>
      </Dialog>

      {/* Desktop sidebar */}
      <div className="hidden bg-gray-900 lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto px-6">
          <div className="flex h-16 shrink-0 items-center">
            <Link href="/dashboard">
              <h1 className="text-xl font-bold text-white">CruxProject</h1>
            </Link>
          </div>
          <nav className="flex flex-1 flex-col">
            <ul className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                      <li key={item.name}>
                        <Link
                          href={item.href}
                          className={classNames(
                            isActive
                              ? "bg-white/5 text-white"
                              : "text-gray-400 hover:bg-white/5 hover:text-white",
                            "group flex gap-x-3 rounded-md p-2 text-sm/6 font-semibold",
                          )}
                        >
                          <item.icon
                            aria-hidden="true"
                            className="size-6 shrink-0"
                          />
                          {item.name}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </li>
              <li className="-mx-6 mt-auto">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-x-4 px-6 py-3 text-sm/6 font-semibold text-white hover:bg-white/5"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-medium text-gray-400 outline -outline-offset-1 outline-white/10">
                    {userInitials}
                  </span>
                  <span aria-hidden="true">{userDisplayName}</span>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Mobile header */}
      <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-gray-900 px-4 py-4 shadow-sm sm:px-6 lg:hidden">
        <button
          type="button"
          onClick={() => setSidebarOpen(true)}
          className="-m-2.5 p-2.5 text-gray-400 hover:text-white lg:hidden"
        >
          <span className="sr-only">Open sidebar</span>
          <Bars3Icon aria-hidden="true" className="size-6" />
        </button>
        <div className="flex-1 text-sm/6 font-semibold text-white">
          {navigation.find((item) => item.href === pathname)?.name ||
            "Dashboard"}
        </div>
        <button type="button" onClick={handleLogout}>
          <span className="sr-only">Your profile</span>
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gray-800 text-xs font-medium text-gray-400 outline -outline-offset-1 outline-white/10">
            {userInitials}
          </span>
        </button>
      </div>

      {/* Main content */}
      <main className="min-h-screen bg-gray-50 py-10 lg:pl-72">
        <div className="px-4 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
