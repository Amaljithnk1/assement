import SideBar from "../components/SideBar";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import StudentTable from "../components/StudentTable";

const App = () => {
  return (
    <div className="bg-[#F6F8FA] min-h-screen flex">
      {/* Sidebar */}
      <SideBar />

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header />

        {/* Content area */}
        <div className="p-4 space-y-6">
          {/* Search bar */}
          <SearchBar />

          {/* Table with Add New Button */}
          <div>
            <StudentTable />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
