// pages/_app.js
import "../styles/globals.css";
import Navbar from "../components/navbar";
import Footer from "../components/footer";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Navbar />
            <main className="max-w-6xl mx-auto px-4 pt-2">
      <Component {...pageProps} />
      </main>
      <Footer />
    </>
  );
}