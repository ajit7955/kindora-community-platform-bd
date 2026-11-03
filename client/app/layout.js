import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "react-hot-toast";

export const metadata = { title: "Kindora — Small acts, lasting impact", description: "Discover and join community service events around you." };
export default function RootLayout({ children }) {
  return <html lang="en" suppressHydrationWarning><body><Providers><Navbar/><main>{children}</main><Footer/><Toaster position="top-right"/></Providers></body></html>;
}
