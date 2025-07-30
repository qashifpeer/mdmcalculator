'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
} from 'react'

export type MealsEntry = {
  date: string
  prePrimary: number
  primary: number
  middle: number
}

type MealsContextType = {
  meals: MealsEntry[]
  addMeal: (meal: MealsEntry) => void
  deleteMeal: (meal: MealsEntry) => void
}

const MealsContext = createContext<MealsContextType | undefined>(undefined)

export const useMeals = () => {
  const context = useContext(MealsContext)
  if (!context) throw new Error('useMeals must be used within MealsProvider')
  return context
}

export const MealsProvider = ({ children }: { children: React.ReactNode }) => {
  const [meals, setMeals] = useState<MealsEntry[]>([])

  // Sort ascending (earlier dates first)
  const sortMealsAsc = (list: MealsEntry[]) =>
    list.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    )

  useEffect(() => {
    const stored = localStorage.getItem('mealsData')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          const sorted = sortMealsAsc(parsed)
          setMeals(sorted)
        }
      } catch (e) {
        console.error('Failed to parse mealsData from localStorage')
      }
    }
  }, [])

  const addMeal = useCallback((meal: MealsEntry) => {
  setMeals((prevMeals) => {
    const updated = [...prevMeals, meal]
    const sorted = sortMealsAsc(updated)
    localStorage.setItem('mealsData', JSON.stringify(sorted))
    return sorted
  })
}, [])


  const deleteMeal = useCallback((target: MealsEntry) => {
  setMeals((prevMeals) => {
    const filtered = prevMeals.filter(
      (m) =>
        m.date !== target.date ||
        m.prePrimary !== target.prePrimary ||
        m.primary !== target.primary ||
        m.middle !== target.middle
    )
    localStorage.setItem('mealsData', JSON.stringify(filtered))
    return filtered
  })
}, [])


  const value = useMemo(
    () => ({ meals, addMeal, deleteMeal }),
    [meals, addMeal, deleteMeal]
  )

  return (
    <MealsContext.Provider value={value}>
      {children}
    </MealsContext.Provider>
  )
}
