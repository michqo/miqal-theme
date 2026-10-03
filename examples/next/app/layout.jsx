import "./globals.css";
export const metadata = { title: "Miqal foundation — Next.js verification", description: "Shared theme verification fixture" };
export default function Layout({ children }) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{ __html: "if (matchMedia('(prefers-color-scheme: dark)').matches) document.documentElement.classList.add('dark');" }} /></head><body>{children}</body></html>;
}
