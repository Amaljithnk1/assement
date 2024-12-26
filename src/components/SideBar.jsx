import React, { useState } from "react";
import { RiDashboard3Line, RiBookReadFill, RiBookMarkedLine } from "react-icons/ri";
import { IoIosHelpCircleOutline } from "react-icons/io";
import { TbSettings2 } from "react-icons/tb";
import { HiOutlineChartPie } from "react-icons/hi2";

const SideBar = () => {
  const [activeItem, setActiveItem] = useState(null);

  const menuItems = [
    { icon: <RiDashboard3Line size={24} />, label: "Dashboard" },
    { icon: <RiBookReadFill size={24} />, label: "Students" },
    { icon: <RiBookMarkedLine size={24} />, label: "Chapter" },
    { icon: <IoIosHelpCircleOutline size={24} />, label: "Help" },
    { icon: <HiOutlineChartPie size={24} />, label: "Reports" },
    { icon: <TbSettings2 size={24} />, label: "Settings" },
  ];

  const handleClick = (label) => {
    setActiveItem(label);
  };

  return (
    <div className="w-64 min-h-screen bg-white border-r border-gray-200 flex flex-col pt-[30px] pr-[12px] pb-[30px] pl-[12px] rounded-[6px] gap-[30px] ml-[12px]">
      <div className="mb-[8px] mt-[20px]">
        <img src="/quyl.svg" alt="Quyl Logo" />
      </div>
      <nav className="space-y-[10px]">
        {menuItems.map((item, index) => (
          <div
            key={index}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer ${
              activeItem === item.label ? "bg-[#EEEEEE]" : "bg-[#FFFFFF] hover:bg-gray-50"
            }`}
            onClick={() => handleClick(item.label)}
          >
            <div
              className={`flex items-center justify-center ${
                activeItem === item.label ? "text-[#0A0A0A]" : "text-[#6F767E]"
              }`}
            >
              {item.icon}
            </div>
            <span
              className={`font-bold ${
                activeItem === item.label ? "text-[#0A0A0A]" : "text-[#6F767E]"
              }`}
            >
              {item.label}
            </span>
          </div>
        ))}
      </nav>
    </div>
  );
};

export default SideBar;
