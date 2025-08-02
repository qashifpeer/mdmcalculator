'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

type Section = 'Pre-Primary' | 'Primary' | 'Middle'
type SectionKey = 'prePrimary' | 'primary' | 'middle'

interface FinancialData {
  section: Section
  openingBalance: number
  riceLifted: number
  riceAvailable: number
  expenditure: number
  balance: number
}

interface RiceContextType {
  riceData: FinancialData[]
}

const RiceContext = createContext<RiceContextType | undefined>(undefined)

export const useRiceCalculate = () => {
  const context = useContext(RiceContext)
  if (!context) throw new Error('useCalculate must be used within RiceProvider')
  return context
}

export const RiceProvider = ({ children }: { children: React.ReactNode }) => {
  const [riceData, setRiceData] = useState<FinancialData[]>([])

  const sections: Section[] = ['Pre-Primary', 'Primary', 'Middle']
  const sectionKeys: SectionKey[] = ['prePrimary', 'primary', 'middle']

  const rates: Record<Section, number> = {
    'Pre-Primary': 0.1,
    'Primary': 0.1,
    'Middle': 0.150,
  }

  const calculateData = () => {
    const storedInputs = localStorage.getItem('riceData')
    const storedMealsTotals = localStorage.getItem('mealsTotals')

    if (!storedInputs || !storedMealsTotals) return

    const rice = JSON.parse(storedInputs)
    const mealsTotals = JSON.parse(storedMealsTotals)

 

    const newData: FinancialData[] = sections.map((section, idx) => {
      const key = sectionKeys[idx]
      const opening = parseFloat(rice?.[key]?.previousBalance) || 0
      const income = parseFloat(rice?.[key]?.riceLifted) || 0
      const mealsCount = parseFloat(mealsTotals?.[key]) || 0
      const rate = rates[section]

      const avl = opening + income
      const expenditure = mealsCount * rate
      const balance = avl - expenditure


      return {
        section,
        openingBalance: opening,
        riceLifted: income,
        riceAvailable: avl,
        expenditure,
        balance,
      }
    })

    setRiceData(newData)
  }

  useEffect(() => {
    calculateData()

    const handleUpdate = () => calculateData()
    window.addEventListener('storageUpdated', handleUpdate)

    return () => window.removeEventListener('storageUpdated', handleUpdate)
  }, [])

  return (
    <RiceContext.Provider value={{ riceData }}>
      {children}
    </RiceContext.Provider>
  )
}
