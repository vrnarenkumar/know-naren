import { useEffect } from 'react'
import Nav from './components/Nav'
import LandingPage from './components/LandingPage'
import Stats from './components/Stats'
import TechMarquee from './components/TechMarquee'
import SectionHeading from './components/SectionHeading'
import Experience from './components/Experience'
import Projects from './components/Projects'
import Skills from './components/Skills'
import Education from './components/Education'
import JobMatchChat from './components/JobMatchChat'
import AskAnythingTab from './components/AskAnythingTab'
import Footer from './components/Footer'
import { hero } from './content'
import { API_URL } from './lib/api'

// Fire-and-forget: lets Naren know someone's on the site. Once per browser
// tab (sessionStorage), not once per section/interaction — see the "just a
// visit ping, not a full activity feed" decision.
function notifyVisit() {
  if (!API_URL || sessionStorage.getItem('visit_notified')) return
  sessionStorage.setItem('visit_notified', '1')
  fetch(`${API_URL}/visit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      referrer: document.referrer || null,
      user_agent: navigator.userAgent,
      language: navigator.language,
    }),
  }).catch(() => {})
}

function App() {
  useEffect(() => {
    notifyVisit()
  }, [])

  return (
    <>
      <Nav />
      <JobMatchChat />
      <AskAnythingTab />
      <div className="h-screen snap-y snap-mandatory overflow-y-scroll scroll-smooth">
        <LandingPage />

        <section
          id="about"
          className="bg-hero-gradient relative flex min-h-[calc(100vh-4rem)] w-full snap-start snap-always flex-col justify-center overflow-hidden"
        >
          <div className="relative">
            <Stats />
            <TechMarquee />
            <div className="mx-auto w-full max-w-5xl px-6">
              <SectionHeading title="About" eyebrow="Get to know me" />
              <p className="max-w-3xl text-lg leading-relaxed text-text">{hero.about}</p>
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
