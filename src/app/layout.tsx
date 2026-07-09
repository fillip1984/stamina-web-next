import { Geist, Geist_Mono, Noto_Sans } from "next/font/google"

import { AppSidebar } from "@/components/nav/app-sidebar"
import AppTopbar from "@/components/nav/app-topbar"
import { ThemeProvider } from "@/components/theme/theme-provider"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import "./globals.css"

const notoSansHeading = Noto_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
})

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn(
        "antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable,
        notoSansHeading.variable
      )}
    >
      <body>
        <ThemeProvider>
          <SidebarProvider
            style={
              {
                "--sidebar-width": "19rem",
              } as React.CSSProperties
            }
          >
            <AppSidebar />
            <SidebarInset className="h-screen overflow-hidden">
              <AppTopbar />
              <div className="flex grow overflow-hidden">{children}</div>
            </SidebarInset>
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
