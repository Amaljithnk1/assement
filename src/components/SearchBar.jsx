import React from "react";
import { FiSearch } from "react-icons/fi";

const SearchBar = () => {
  return (
    <div className="absolute top-[14px] left-[268px] w-full max-w-[calc(100%-740px)] h-[48px] bg-white rounded-[12px] p-[14px] pl-[20px] flex items-center shadow-md border border-gray-200 ml-[20px] mt-[20px]">
      <FiSearch className="text-gray-400 text-[20px] mr-2" />
      <input
        type="text"
        placeholder="Search your course"
        className="flex-1 border-none outline-none bg-transparent text-gray-500 text-sm sm:text-base"
      />
    </div>
  );
};

export default SearchBar;
