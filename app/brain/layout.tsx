import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function BrainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main>{children}</main>
      <Footer />
    </>
  );
}
