"use client";
import { useHeaderContext } from "@/contexts/HeaderContext";
const HeaderInput: React.FC = () => {
  const {
    selectedMonth,
    setSelectedMonth,
    schoolName,
    setSchoolName,
    year,
    setYear,
  } = useHeaderContext();

  // Handlers that also update localStorage
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedMonth(value);
    localStorage.setItem("selectedMonth", value);
  };

  // Handler for School Name update to local storage
  const handleSchoolNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSchoolName(value);
    localStorage.setItem("schoolName", value);
  };

  // Handler for School Name update to lYear
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setYear(value);
    localStorage.setItem("year", value);
  };

  return (
    <section className="w-full px-2 bg-primary py-4">
      <h2 className="text-center font-bold text-xl mb-2 text-secondary">
        Mid-Day Meals Consumption Register <span className="text-sm">(By Qashif Peer)</span>
      </h2>
      <div className="flex justify-center items-center gap-3">
        <label className="block text-secondary font-bold ">Select Month</label>
        <select
          value={selectedMonth}
          onChange={handleMonthChange}
          className="border border-gray-300 rounded-lg p-2 text-secondary bg-primary  focus:outline-none focus:ring-2 focus:ring-blue-500"
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

        <div>
          {/* <label className="block text-gray-700">Enter Year</label> */}
          <input
            type="text"
            value={year}
            onChange={handleYearChange}
            className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-secondary"
            placeholder="Enter Year"
          />
        </div>

        <div>
          {/* <label className="block text-gray-700">Enter School Name</label> */}
          <input
            type="text"
            value={schoolName}
            onChange={handleSchoolNameChange}
            name="schoolName"
            id="schoolName"
            className="w-full px-2 py-1 border text-secondary border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            placeholder="Enter School Name"
          />
        </div>
      </div>
    </section>
  );
};

export default HeaderInput;
