import React from "react";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { RiMessage2Line, RiEqualizer2Line } from "react-icons/ri";
import { LuBell } from "react-icons/lu";

const Header = () => {
  return (
    <header className="flex items-center justify-end p-3 absolute top-2 right-3 w-full gap-4 lg:gap-10 mt-5">
      <div className="flex items-center gap-4 lg:gap-6">
        <IoIosHelpCircleOutline size={24} className="text-[#808281] hover:text-black" />
        <RiMessage2Line size={24} className="text-[#808281] hover:text-black" />
        <RiEqualizer2Line size={24} className="text-[#808281] hover:text-black" />
        <LuBell size={24} className="text-[#808281] hover:text-black" />

        <div className="flex items-center gap-4">
          <img
            src="/user.svg"
            alt="User"
            className="w-8 h-8 rounded-full lg:w-10 lg:h-10"
          />
          <span
            className="text-gray-700 font-bold hidden sm:block"
            style={{ fontFamily: "Noto Sans, sans-serif" }}
          >
            Adeline H. Dancy
          </span>
        </div>
      </div>
    </header>
  );
};

export default Header;
