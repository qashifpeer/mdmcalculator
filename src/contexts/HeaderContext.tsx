"use client";
import {useEffect} from 'react';

import { createContext, useContext, useState, ReactNode } from "react";

// Define the context type
interface HeaderContextType {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  schoolName: string;
  setSchoolName: (name: string) => void;
  year : string;
  setYear: (year: string) => void;
}

// Create Context
const HeaderContext = createContext<HeaderContextType | undefined>(undefined);

// Provider Component
export const HeaderProvider = ({ children }: { children: ReactNode }) => {
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [schoolName, setSchoolName] = useState<string>("");
  const [year, setYear] = useState<string>("");

   // 🔄 Load from localStorage on first mount
  useEffect(() => {
    const monthFromStorage = localStorage.getItem("selectedMonth");
    const yearFromStorage = localStorage.getItem("year");
    const schoolNameFromStorage = localStorage.getItem("schoolName");

    if (monthFromStorage) setSelectedMonth(monthFromStorage);
    if (yearFromStorage) setYear(yearFromStorage);
    if (schoolNameFromStorage) setSchoolName(schoolNameFromStorage);
  }, []);

  return (
    <HeaderContext.Provider
      value={{ selectedMonth, setSelectedMonth, schoolName, setSchoolName , year, setYear}}
    >
      {children}
    </HeaderContext.Provider>
  );
};

// Custom Hook
export const useHeaderContext = () => {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error("useHeaderContext must be used within a HeaderProvider");
  }
  return context;
};
