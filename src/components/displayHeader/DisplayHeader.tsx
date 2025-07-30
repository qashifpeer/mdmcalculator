"use client";
import React, { useState } from "react";
import { useHeaderContext } from "@/contexts/HeaderContext";

import HeaderInput from "../headerInput/HeaderInput";

const DisplayHeader: React.FC = () => {
  const { selectedMonth, schoolName, year } = useHeaderContext();

  return (
    <div className="p-4 space-y-4 border rounded-md shadow-md">
      <h1 className="text-xl font-bold text-center">{schoolName}</h1>
      <p className="text-lg text-center">Month: {selectedMonth}</p>
      <p className="text-lg text-center">Year: {year}</p>
      <div className="text-center space-y-2">
        <p>Primary - Rate: ₹4.45</p>
        <p>Middle - Rate: ₹5.65</p>
      </div>
      <div className="hidden">
        <div>school name </div>
      </div>
    </div>
  );
};

export default DisplayHeader;
