import type { Metadata } from "next";
import "@/styles.css";
import { PriveProvider } from "@/lib/prive/store";

export const metadata: Metadata = {
  title: "Privé — Restaurant Intelligence Platform",
  description: "A cognitive layer over POS, payroll, inventory and guest systems for The Morning Table Restaurant Group.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-white/8 text-white font-sans antialiased">
        <PriveProvider>{children}</PriveProvider>
      </body>
    </html>
  );
}
