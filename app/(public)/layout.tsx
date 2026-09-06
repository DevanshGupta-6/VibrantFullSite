import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import StickyRegisterCta from "@/components/StickyRegisterCta";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <Navbar /> */}
      {children}
      {/* <Footer />
      <StickyRegisterCta /> */}
    </>
  );
}