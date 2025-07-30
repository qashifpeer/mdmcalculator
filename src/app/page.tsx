import { DisplayHeader, DisplayMeals, HeaderInput, MealsInput, PreviousInputs } from "@/components";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center">
      {/* <HeaderInput /> */}
      {/* <PreviousInputs /> */}
      <MealsInput />
      <DisplayHeader />
      <DisplayMeals />
    </div>
  );
}
