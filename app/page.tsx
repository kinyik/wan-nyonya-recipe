import { LangProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import DemoBanner from "@/components/DemoBanner";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Highlights from "@/components/Highlights";
import ProductMenu from "@/components/ProductMenu";
import GiftSets from "@/components/GiftSets";
import OurStory from "@/components/OurStory";
import HowToOrder from "@/components/HowToOrder";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import Cart from "@/components/Cart";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <LangProvider>
      <CartProvider>
        <DemoBanner />
        <Navbar />
        <main>
          <Hero />
          <Highlights />
          <ProductMenu />
          <GiftSets />
          <OurStory />
          <HowToOrder />
          <FAQ />
        </main>
        <Footer />
        <Cart />
        <WhatsAppButton />
      </CartProvider>
    </LangProvider>
  );
}
