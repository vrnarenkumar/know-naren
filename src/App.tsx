import { motion } from 'framer-motion'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Stats from './components/Stats'
import TechMarquee from './components/TechMarquee'
import SectionHeading from './components/SectionHeading'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Footer from './components/Footer'
import { hero } from './content'

function App() {
  return (
    <>
      <Nav />
      <div className="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth">
        <Hero />

        <section
          id="about"
          className="bg-hero-gradient relative flex min-h-[calc(100vh-4rem)] w-full snap-start snap-always flex-col justify-center overflow-hidden"
        >
          <motion.div
            animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.15, 1] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
            className="glow-orb left-1/2 top-1/2 h-[28rem] w-[28rem] -translate-x-1/2 -translate-y-1/2 bg-accent/10"
          />
          <div className="relative">
            <Stats />
            <TechMarquee />
            <div className="mx-auto w-full max-w-5xl px-6">
              <SectionHeading title="About" eyebrow="Get to know me" />
              <p className="max-w-3xl text-lg leading-relaxed text-text">{hero.summary}</p>
            </div>
          </div>
        </section>

        <Experience />
        <Projects />
        <Skills />
        <Education />
        <Footer />
      </div>
    </>
  )
}

export default App
