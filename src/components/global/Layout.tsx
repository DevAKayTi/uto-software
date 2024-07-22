import { useMemo, type ReactNode } from "react";
import Image from "next/image";
import { Disclosure, Menu } from "@headlessui/react";
import { Bars3Icon, BellIcon, XMarkIcon } from "@heroicons/react/24/outline";
import Logo from "../../../public/images/uto-logo.png";
import MedicalLogo from "../../../public/images/uto-medical.png";
import GetWellLogo from "../../../public/images/getwell.png";
import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { useRouter } from "next/router";
import { Dropdown, Searchinput } from "../../components";
import { useBranch } from "../../contexts";

interface LayoutProps {
  children?: ReactNode;
  title: string;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

export const Layout = (props: LayoutProps) => {
  const { children, title } = props;
  const router = useRouter();
  const { branchName, changeBranch } = useBranch();

  const isMain = router.pathname.includes("/main-accounting");

  let navigation = [
    {
      name: "Dashboard",
      href: "/",
      current: router.pathname === "/" ? true : false,
    },
    {
      name: "Products",
      href: "/products",
      current: router.pathname === "/products" ? true : false,
    },
    {
      name: "Cart",
      href: "/cart",
      current: router.pathname === "/cart" ? true : false,
    },
    {
      name: "Receipts",
      href: "/receipts",
      current: router.pathname === "/receipts" ? true : false,
    },
    {
      name: "Transfers",
      href: "/transfers",
      current: router.pathname === "/transfers" ? true : false,
    },
    {
      name: "Credits",
      href: "/credits",
      current: router.pathname === "/credits" ? true : false,
    },
    {
      name: "Cashbook",
      href: "/cashbook",
      current: router.pathname === "/cashbook" ? true : false,
    },
  ];

  if (router.pathname.includes("/accounting")) {
    navigation = [
      {
        name: "Cosignments",
        href: "/accounting/cosignments",
        current: router.pathname === "/accounting/cosignments" ? true : false,
      },
      {
        name: "Input Cosignment",
        href: "/accounting/cosignments/create",
        current: router.pathname === "/accounting/cosignments/create" ? true : false,
      },
      {
        name: "Input Stock Adjustment",
        href: "/accounting/cosignments/stock-adjustment",
        current: router.pathname === "/accounting/cosignments/stock-adjustment" ? true : false,
      },
    ];
  } else if (router.pathname.includes("/main-accounting")) {
    navigation = [
      {
        name: "Charts Of Accounts",
        href: "/main-accounting/coa",
        current: router.pathname === "/main-accounting/coa" ? true : false,
      },
      {
        name: "New Journal",
        href: "/main-accounting/journal",
        current: router.pathname === "/main-accounting/journal" ? true : false,
      },
      {
        name: "Acoount Report",
        href: "/main-accounting/account-report",
        current:
          router.pathname === "/main-accounting/account-report" ? true : false,
      },
      {
        name: "Trial Balance",
        href: "/main-accounting/trial-balance",
        current:
          router.pathname === "/main-accounting/trial-balance" ? true : false,
      },
      {
        name: "Transactions",
        href: "/main-accounting/transactions",
        current:
          router.pathname === "/main-accounting/transactions" ? true : false,
      },
    ];
  }

  let branch = [
    "Medical YGN",
    "Medical MDY",
    "Tools YGN",
    "Tools MDY",
    "GetWell YGN",
    "GetWell MDY",
  ];

  if (router.pathname.includes("/accounting")) {
    branch = ["Medical", "Tools", "GetWell"];
  }

  const branchNameFilter = useMemo(() => {
    let name = "";
    if (router.pathname.includes("/accounting")) {
      name = branchName.split(" ")?.[0] || branchName;
    } else {
      name = branchName;
    }
    return name;
  }, [branchName, router.pathname]);

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-gray-800">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {branchName.split(" ")[0] === "Tools" ? (
                        <Image
                          className="h-8 w-8"
                          src={Logo}
                          width={32}
                          height={32}
                          alt="UTO"
                        />
                      ) : branchName.split(" ")[0] === "GetWell" ? (
                        <Image
                          className="h-16 w-16"
                          src={GetWellLogo}
                          width={70}
                          height={40}
                          alt="GetWell"
                        />
                      ) : (
                        <Image
                          className="h-8 w-8"
                          src={MedicalLogo}
                          width={48}
                          height={40}
                          alt="UTOMedical"
                        />
                      )}
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={classNames(
                              item.current
                                ? "bg-gray-900 text-white"
                                : "text-gray-300 hover:bg-gray-700 hover:text-white",
                              "rounded-md px-3 py-2 text-sm font-medium"
                            )}
                            aria-current={item.current ? "page" : undefined}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  {!isMain && (
                    <div className="hidden md:block">
                      <Dropdown
                        name={branchNameFilter}
                        menus={branch}
                        handleClick={changeBranch}
                      />
                    </div>
                  )}
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      <button
                        type="button"
                        className="rounded-full bg-gray-800 p-1 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                      >
                        <span className="sr-only">View notifications</span>
                        <BellIcon className="h-6 w-6" aria-hidden="true" />
                      </button>

                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <UserButton />
                      </Menu>
                    </div>
                  </div>
                  {/* start mobile */}
                  <div className="-mr-2 flex md:hidden">
                    <UserButton />
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    <button
                      type="button"
                      className="mr-3 flex-auto flex-shrink rounded-full bg-gray-800 px-2 text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                    >
                      <span className="sr-only">View notifications</span>
                      <BellIcon className="h-6 w-6" aria-hidden="true" />
                    </button>
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                  {/* end mobile */}
                </div>
              </div>
              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pb-3 pt-2 sm:px-3">
                  {navigation.map((item) => (
                    <Disclosure.Button
                      key={item.name}
                      as="a"
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </Disclosure.Button>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className="bg-white shadow">
          <div className="mx-auto flex max-w-7xl justify-between px-4 py-6 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">
              {title}
            </h1>
            <Searchinput currentPage={router.pathname} />
          </div>
        </header>
        <main>
          <div className="mx-auto overflow-hidden pb-12 pt-6 md:w-full lg:max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </>
  );
};
