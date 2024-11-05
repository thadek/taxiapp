
import "./global.css";
import Navbar from "./components/Navbar/Navbar";
import SessionAuthProvider from "@/context/SessionAuthProvider";
import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import Providers from "./providers";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
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
              <SessionAuthProvider>
                <Navbar />
               
                {children}
                <Toaster richColors position="bottom-center" closeButton/>
              </SessionAuthProvider>
            </main>
          </SidebarProvider>
        </ThemeProvider>
               </Providers>
      </body>
    </html>
  );
}
