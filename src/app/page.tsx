import {
  DisplayData,
  HeaderInput,
  MealsInput,
  PreviousInputs,
} from "@/components";

export default function Home() {
  return (
    <div className="max-w- 2xl lg:max-w-4xl bg-gradient-to-r from-slate-500 from-0% via-amber-100 via- to-violet-300 to- mx-auto">
      <main className="flex flex-col justify-center items-center">
        <HeaderInput />
        <PreviousInputs />
        <MealsInput />
        <div className="border-2 border-red-300 w-full" />
        <DisplayData />
      </main>
    </div>
  );
}
