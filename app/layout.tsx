import type { Metadata } from "next";
import "@/styles.css";
import { PriveProvider } from "@/lib/prive/store";

export const metadata: Metadata = {
  title: "Privé — Restaurant Intelligence Platform",
  description: "A cognitive layer over POS, payroll, inventory and guest systems for The Morning Table Restaurant Group.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-[#F4EFEA] text-[#1C1917] font-sans antialiased">
        <PriveProvider>{children}</PriveProvider>
      </body>
    </html>
  );
}
