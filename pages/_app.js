import "@/styles/globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { SessionProvider } from "next-auth/react"


export default function App({ Component, pageProps: { session, ...pageProps }, }) {
  return (
  <div>
    <SessionProvider session={session}>
       
        <Component {...pageProps} />
      <Footer/>
    </SessionProvider>
  </div>
  )
}
