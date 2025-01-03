
import "./global.css";
import Navbar from "../components/Navbar/Navbar";
import SessionAuthProvider from "@/context/SessionAuthProvider";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Metadata } from "next"
import { Toaster } from "@/components/ui/sonner"
import Providers from "./providers";


export const metadata: Metadata = {
  title: 'TaxiApp',
  description:
    "Aplicación de taxis -  backoffice",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body>
        <SessionAuthProvider>
          <Providers>

            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <SidebarProvider>
                <AppSidebar />
                <main className="h-screen w-screen">

                  <Navbar />
                  
                    {children}
                  
                  <Toaster richColors position="bottom-center" closeButton />

                </main>
              </SidebarProvider>
            </ThemeProvider>
          </Providers>
        </SessionAuthProvider>
      </body>
    </html>
  );
}
