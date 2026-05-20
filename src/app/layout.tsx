import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter } from "next/font/google";
import { AppExperience } from "@/components/motion/app-experience";
import { RegisterServiceWorker } from "@/components/pwa/register-service-worker";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Secret",
    template: "%s | Secret",
  },
  description:
    "Centro de comando pessoal para organizar tarefas, financas e estudos.",
  applicationName: "Secret",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Secret",
  },
  icons: {
    apple: "/logo.png",
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.png", type: "image/png" },
      { url: "/logo.png", type: "image/png" },
    ],
  },
  manifest: "/manifest.webmanifest",
};

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var stored = localStorage.getItem('secret-theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var theme = stored || (prefersDark ? 'dark' : 'light');
                  document.documentElement.classList.toggle('dark', theme === 'dark');
                  document.documentElement.dataset.theme = theme;
                } catch (error) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full bg-background text-foreground">
        <RegisterServiceWorker />
        <AppExperience>{children}</AppExperience>
      </body>
    </html>
  );
}
