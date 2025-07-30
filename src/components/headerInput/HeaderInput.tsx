"use client"
import { useHeaderContext } from "@/contexts/HeaderContext"
const HeaderInput: React.FC = () => {
  const { selectedMonth, setSelectedMonth, schoolName, setSchoolName, year, setYear } = useHeaderContext();

  return (
    <div className="p-4 space-y-4">
      <div>
        <label className="block text-gray-700 ">Select Month</label>
        <select
        value={selectedMonth}
        onChange={(e) => setSelectedMonth(e.target.value)}
        className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Select Month</option>
        {[
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ].map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>
      </div>

      <div>
        <label className="block text-gray-700">Enter Year</label>
        <input
         type="text"
        value={year}
        onChange={(e) => setYear(e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter Year"
        />
      </div>

      <div>
        <label className="block text-gray-700">Enter School Name</label>
        <input
          type="text"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          name="schoolName"
          id="schoolName"
          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Enter School Name"
        />
      </div>
    </div>
  );
};

export default HeaderInput;
