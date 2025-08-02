"use client";
import React from "react";
import DisplayHeader from "../displayHeader/DisplayHeader";
import DisplayMeals from "../displayMeals/DisplayMeals";
import DisplayBalances from "../displayBalances/DisplayBalances";
import { Button } from "@/components/ui/button";
import { useReactToPrint } from "react-to-print";
import { useRef } from "react";
import FinalCalculations from "../finalCalculations/FinalCalculations";

const DisplayData = () => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });

  //  clear All the Local Storage
  const clearData = () => {
    // Clear all localStorage for this domain
   const keysToRemove = [
   
   
    "ingredientsData",
    "riceData",
    "mealsData",
    "mealsTotals"
  ];

  keysToRemove.forEach((key) => localStorage.removeItem(key));

    // Optional: Reload to reset app state
    window.location.reload();
  };
  return (
    <div>
      <div ref={contentRef} className="w-full px-2">
        <DisplayHeader />
        <div className="flex  gap-1 justify-center items-start">
          <DisplayMeals />
          <DisplayBalances />
        </div>
        <FinalCalculations />
      </div>
      <div className="flex justify-center items-center gap-2">
        <Button variant="destructive" onClick={reactToPrintFn}>
          Print
        </Button>
        <Button variant="outline" onClick={clearData}>
          Clear
        </Button>
      </div>
    </div>
  );
};

export default DisplayData;
