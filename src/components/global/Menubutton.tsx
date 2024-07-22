import { Fragment } from "react";
import { Menu, Transition } from "@headlessui/react";

interface MenuProps {
  title: React.ReactNode;
  menu: React.ReactNode;
}

export const Menubutton = (props: MenuProps) => {
  const { title, menu } = props;

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="flex cursor-pointer rounded-lg px-4 py-3 font-semibold text-gray-600 opacity-80 transition duration-200 hover:opacity-100">
          {title}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          onKeyDown={(e) => {
            if (e.key === " ") {
              e.preventDefault();
            }
          }}
          className="absolute right-0 z-10 w-96 origin-top-right rounded-md border-2 border-gray-50 bg-white shadow-2xl focus:outline-none"
        >
          <Menu.Item disabled>
            <div className="py-1">{menu}</div>
          </Menu.Item>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};
