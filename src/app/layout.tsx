import type { Metadata } from "next";
import "./globals.css";
import { HeaderProvider } from "@/contexts/HeaderContext";
import { MealsProvider } from "@/contexts/MealsContext";
import { InputBalancesProvider } from "@/contexts/InputBalancesContext";
import { CalculateProvider } from "@/contexts/CalculateContext";
import { RiceProvider } from "@/contexts/RiceContext";

<meta
  name="mdm-calculator"
  content="mdm-calculator"
/>;

export const metadata: Metadata = {
  title: "MDM-Calculator by Qashif Peer",
  description: "Welcome to MDM-Calculator by Qashif Peer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <HeaderProvider>
          <MealsProvider>
            <InputBalancesProvider>
              <CalculateProvider>
                <RiceProvider>{children}</RiceProvider>
              </CalculateProvider>
            </InputBalancesProvider>
          </MealsProvider>
        </HeaderProvider>
      </body>
    </html>
  );
}
