"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Section = "Pre-Primary" | "Primary" | "Middle";
type SectionKey = "prePrimary" | "primary" | "middle";

interface FinancialData {
  section: Section;
  openingBalance: number;
  incomeReceived: number;
  avlBalance: number;
  expenditure: number;
  balance: number;
}

interface CalculateContextType {
  data: FinancialData[];
  rates: Record<Section, number>;
}

const CalculateContext = createContext<CalculateContextType | undefined>(
  undefined
);


export const useCalculate = () => {
  const context = useContext(CalculateContext);
  if (!context)
    throw new Error("useCalculate must be used within CalculateProvider");
  return context;
};


export const CalculateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [data, setData] = useState<FinancialData[]>([]);

  const sections: Section[] = ["Pre-Primary", "Primary", "Middle"];
  const sectionKeys: SectionKey[] = ["prePrimary", "primary", "middle"];

  const rates: Record<Section, number> = {
    "Pre-Primary": 6.78,
    Primary: 6.78,
    Middle: 10.17,
  };
   

  const calculateData = () => {
    const storedInputs = localStorage.getItem("ingredientsData");
    const storedMealsTotals = localStorage.getItem("mealsTotals");

    if (!storedInputs || !storedMealsTotals) return;

    const ingredients = JSON.parse(storedInputs);
    const mealsTotals = JSON.parse(storedMealsTotals);

    const newData: FinancialData[] = sections.map((section, idx) => {
      const key = sectionKeys[idx];
      const opening = parseFloat(ingredients?.[key]?.openingBalance) || 0;
      const income = parseFloat(ingredients?.[key]?.incomeReceived) || 0;
      const mealsCount = parseFloat(mealsTotals?.[key]) || 0;
      const rate = rates[section];

      const avl = opening + income;
      const expenditure = mealsCount * rate;
      const balance = avl - expenditure;


      return {
        section,
        openingBalance: opening,
        incomeReceived: income,
        avlBalance: avl,
        expenditure,
        balance,
        
      };
    });

    setData(newData);
  };

  useEffect(() => {
    calculateData();

    const handleUpdate = () => calculateData();
    window.addEventListener("storageUpdated", handleUpdate);

    return () => window.removeEventListener("storageUpdated", handleUpdate);
  }, []);

  return (
    <CalculateContext.Provider value={{ data,rates  }}>
      {children}
    </CalculateContext.Provider>
  );
};

// Custom Hook
export const useCalculateContext = () => {
  const context = useContext(CalculateContext);
  if (!context) {
    throw new Error("useHeaderContext must be used within a HeaderProvider");
  }
  return context;
};
