"use client";

import React, { useState } from "react";
import { useMeals } from "@/contexts/MealsContext";
const MealsInput: React.FC = () => {
  const [date, setDate] = useState("");
  const [prePrimary, setPrePrimary] = useState("");
  const [primary, setPrimary] = useState("");
  const [middle, setMiddle] = useState("");

  const { addMeal } = useMeals();

 

  
  
  const handleSubmit = () => {
    if (!date || !prePrimary || !primary || !middle) {
      alert("Please fill in all fields.");
      return;
    }

    const newEntry = {
      date,
      prePrimary: Number(prePrimary),
      primary: Number(primary),
      middle: Number(middle),
    };

    addMeal(newEntry);
    // alert('Meal data saved!')

  

    setDate("");
    setPrePrimary("");
    setPrimary("");
    setMiddle("");
  };

  return (
    <section className="overflow-x-auto p-4">
      
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="">
            <th
              className="border border-gray-300 px-4 py-1 text-center bg-gray-600 text-orange-500"
              colSpan={2}
            >
              Enter Roll (Day-Wise)
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="border border-gray-300 px-4 py-0.5">Date</td>
            <td className="border border-gray-300 px-4 py-0.5">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Pre-Primary</td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="number"
                value={prePrimary}
                onChange={(e) => setPrePrimary(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Primary</td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="number"
                value={primary}
                onChange={(e) => setPrimary(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </td>
          </tr>
          <tr>
            <td className="border border-gray-300 px-4 py-2">Upper Primary</td>
            <td className="border border-gray-300 px-4 py-2">
              <input
                type="number"
                value={middle}
                onChange={(e) => setMiddle(e.target.value)}
                className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </td>
          </tr>
        </tbody>
      </table>
      <div className="mt-4 text-center">
        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          Submit
        </button>
      </div>
    </section>
  );
};

export default MealsInput;
