import { Poppins } from "next/font/google";
import "./globals.css";
import ReduxProvider from "@/redux/Provider";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  display: 'swap',
});

export const metadata = {
  title: "Health Mate",
  description: "Your personal health assistant",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.className} antialiased bg-white`}>
        <ReduxProvider>{children}</ReduxProvider>
      </body>
    </html>
  );
}
