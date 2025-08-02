"use client";
// import React, { useState } from "react";
import { useHeaderContext } from "@/contexts/HeaderContext";
import { useCalculate } from "@/contexts/CalculateContext";

// import HeaderInput from "../headerInput/HeaderInput";

const DisplayHeader: React.FC = () => {
  const { selectedMonth, schoolName, year } = useHeaderContext();
  const { rates } = useCalculate();

  return (
    <section className="px-8 w-full mt-4">
      <h2 className="text-2xl capitalize text-center">
        Mid Day Meals Consumption Register
      </h2>
      <h2 className="text-4xl font-bold text-center uppercase">{schoolName}</h2>
      <div className="flex justify-between">
        <div>
          <p className="text-lg text-center">Month: <span className="font-semibold">{selectedMonth}</span> </p>
          <p className="text-lg text-center">Year: <span className="font-semibold">{year}</span></p>
        </div>
        <div className="text-start space-y-1">
          <h2 className="font-semibold  text-lg">Ingredient Rates</h2>
          <ul className="pl-5 list-none">
            {Object.entries(rates).map(([section, rate]) => (
              <li key={section}>
                {section}: <span className="font-semibold">₹{rate}</span> 
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="hidden">
        <div>school name </div>
      </div>
    </section>
  );
};

export default DisplayHeader;
