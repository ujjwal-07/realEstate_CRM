import Sidebar from "@/components/layout/Sidebar";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen overflow-x-hidden">
        <div className="flex">
          {/* Permanent on Desktop, Toggleable on Mobile */}
          <Sidebar />

          {/* Main Content Area */}
          <main className="flex-1 w-full transition-all duration-300 lg:ml-72 min-h-screen">
            <div className="p-4 md:p-8 pt-20 lg:pt-8">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}