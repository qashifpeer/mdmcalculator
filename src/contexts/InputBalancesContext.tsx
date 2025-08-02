"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useMeals } from "@/contexts/MealsContext";

type SectionKey = "prePrimary" | "primary" | "middle";

type Ingredient = {
  openingBalance: string;
  incomeReceived: string;
};

type Rice = {
  previousBalance: string;
  riceLifted: string;
};

type IngredientsDataType = Record<SectionKey, Ingredient>;
type RiceDataType = Record<SectionKey, Rice>;

interface InputBalancesContextType {
  ingredientsData: IngredientsDataType;
  riceData: RiceDataType;
  updateIngredient: (
    section: SectionKey,
    field: keyof Ingredient,
    value: string
  ) => void;
  updateRice: (section: SectionKey, field: keyof Rice, value: string) => void;
}

const InputBalancesContext = createContext<
  InputBalancesContextType | undefined
>(undefined);

export const InputBalancesProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { meals } = useMeals();

  const defaultIngredients: IngredientsDataType = {
    prePrimary: { openingBalance: "0", incomeReceived: "0" },
    primary: { openingBalance: "0", incomeReceived: "0" },
    middle: { openingBalance: "0", incomeReceived: "0" },
  };

  const defaultRice: RiceDataType = {
    prePrimary: { previousBalance: "0", riceLifted: "0" },
    primary: { previousBalance: "0", riceLifted: "0" },
    middle: { previousBalance: "0", riceLifted: "0" },
  };

  // const [ingredientsData, setIngredientsData] = useState<IngredientsDataType>(() => {
  //   try {
  //     const stored = localStorage.getItem('ingredientsData')
  //     return stored ? JSON.parse(stored) : defaultIngredients
  //   } catch {
  //     return defaultIngredients
  //   }
  // })

  // const [riceData, setRiceData] = useState<RiceDataType>(() => {
  //   try {
  //     const stored = localStorage.getItem('riceData')
  //     return stored ? JSON.parse(stored) : defaultRice
  //   } catch {
  //     return defaultRice
  //   }
  // })

  const [ingredientsData, setIngredientsData] =
    useState<IngredientsDataType>(defaultIngredients);
  const [riceData, setRiceData] = useState<RiceDataType>(defaultRice);
  const [hasLoaded, setHasLoaded] = useState(false);

  // ✅ Load from localStorage after first render (client-side only)
  // ✅ Load once from localStorage (or fallback if not found)
  useEffect(() => {
    const storedIngredients = localStorage.getItem("ingredientsData");
    const storedRice = localStorage.getItem("riceData");

    if (storedIngredients) {
      setIngredientsData(JSON.parse(storedIngredients));
    }

    if (storedRice) {
      setRiceData(JSON.parse(storedRice));
    }

    if (!storedIngredients || !storedRice) {
      // Check if any meal exists
      const hasAnyMeals = meals && meals.length > 0;
      if (hasAnyMeals) {
        setIngredientsData(defaultIngredients);
        setRiceData(defaultRice);
      }
    }

    setHasLoaded(true);
  }, [meals]);

  // ✅ Sync changes to localStorage
  useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem('ingredientsData', JSON.stringify(ingredientsData))
      window.dispatchEvent(new Event('storageUpdated'))
    }
  }, [ingredientsData, hasLoaded])

useEffect(() => {
    if (hasLoaded) {
      localStorage.setItem('riceData', JSON.stringify(riceData))
      window.dispatchEvent(new Event('storageUpdated'))
    }
  }, [riceData, hasLoaded])

  const updateIngredient = (
    section: SectionKey,
    field: keyof Ingredient,
    value: string
  ) => {
    setIngredientsData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const updateRice = (
    section: SectionKey,
    field: keyof Rice,
    value: string
  ) => {
    setRiceData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  return (
    <InputBalancesContext.Provider
      value={{ ingredientsData, riceData, updateIngredient, updateRice }}
    >
      {children}
    </InputBalancesContext.Provider>
  );
};

export const useInputBalances = (): InputBalancesContextType => {
  const context = useContext(InputBalancesContext);
  if (!context)
    throw new Error(
      "useInputBalances must be used within InputBalancesProvider"
    );
  return context;
};
