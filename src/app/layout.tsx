import { ReactNode } from "react";
import "@/styles/globals.css";
import Providers from "./providers";
export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body {...{ "cz-shortcut-listen": "true" }}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
