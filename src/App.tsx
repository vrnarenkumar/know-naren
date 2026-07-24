import Nav from './components/Nav'
import Hero from './components/Hero'
import Stats from './components/Stats'
import TechMarquee from './components/TechMarquee'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import Footer from './components/Footer'
import Section from './components/Section'
import { hero } from './content'

function App() {
  return (
    <>
      <Nav />
      <Hero />
      <Stats />
      <TechMarquee />
      <Section id="about" title="About" eyebrow="Get to know me">
        <p className="max-w-3xl text-lg leading-relaxed text-text">{hero.summary}</p>
      </Section>
      <Experience />
      <Projects />
      <Skills />
      <Education />
      <Footer />
    </>
  )
}

export default App
