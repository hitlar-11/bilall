import "@/styles/globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SessionProvider } from "next-auth/react"
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function App({ Component, pageProps: { session, ...pageProps }, }) {
  return (
  <div>
    <SessionProvider session={session}>
       
        <Component {...pageProps} />
      <Footer/>
      <SpeedInsights />
    </SessionProvider>
  </div>
  )
}
