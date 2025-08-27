import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import { Toaster } from "sonner";
import { Header } from "@/components/Header";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Zcrum",
  description: "Project management tool",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} dotted-background`}>
        <ClerkProvider
          appearance={{
            baseTheme: shadesOfPurple,
            variables: {
              colorPrimary: "#3b82f6",
              colorBackground: "#1a202c",
              colorInputBackground: "#2D3748",
              colorInputText: "#F3F4F6",
            },
            elements: {
              formButtonPrimary: "text-white",
              card: "bg-gray-800",
              headerTitle: "text-blue-500",
              headerSubtitle: "text-gray-400",
            },
          }}
        >
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Header/>
            <main className="min-h-screen">{children}</main>
            <Toaster richColors/>
            <footer className="bg-gray-900 py-4">
              <div className="container mx-auto p-4 text-center text-gray-200">
                <p>Zcrum Powered by Bold-Zyt</p>
              </div>
            </footer>
          </ThemeProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
