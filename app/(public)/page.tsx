import IntroExperience from "@/components/IntroExperience";
import Hero from "@/components/Hero";
import Countdown from "@/components/Countdown";
import About from "@/components/About";
import Stats from "@/components/Stats";
import Organizers from "@/components/Organizers";
import Events from "@/components/Events";
import Schedule from "@/components/Schedule";
import PrizePool from "@/components/PrizePool";
import Sponsors from "@/components/Sponsors";
import FAQ from "@/components/FAQ";
import Contact from "@/components/Contact";
import RegistrationCTA from "@/components/RegistrationCTA";

export default function HomePage() {
  return (
    <>
      <IntroExperience />
      <main id="main">
        <Hero />
        <Countdown />
        <About />
        <Stats />
        <Organizers />
        <Events />
        <Schedule />
        <PrizePool />
        <Sponsors />
        <FAQ />
        <Contact />
        <RegistrationCTA />
      </main>
    </>
  );
}