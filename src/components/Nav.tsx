import { Menu, X } from 'lucide-react'
import { useEffect, useState } from 'react'

const links = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'skills', label: 'Skills' },
  { id: 'education', label: 'Education' },
  { id: 'jd-match', label: 'JD Match' },
  { id: 'contact', label: 'Contact' },
]

export default function Nav() {
  const [active, setActive] = useState('about')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: 0 },
    )

    links.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  return (
    <nav className="fixed bottom-0 z-50 w-full border-t border-border/60 bg-bg/80 backdrop-blur-md">
      {menuOpen && (
        <ul className="absolute bottom-full flex w-full flex-col gap-1 border-t border-border/60 bg-bg/95 px-6 py-4 text-sm backdrop-blur-md sm:hidden">
          {links.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                onClick={() => setMenuOpen(false)}
                className={`block py-2 transition-colors hover:text-text-h ${
                  active === id ? 'text-accent' : 'text-text-dim'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      )}

      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <a href="#hero" className="font-semibold text-text-h" onClick={() => setMenuOpen(false)}>
          NK<span className="text-accent">.</span>
        </a>

        <ul className="hidden gap-6 text-sm sm:flex">
          {links.map(({ id, label }) => (
            <li key={id}>
              <a
                href={`#${id}`}
                className={`transition-colors hover:text-text-h ${
                  active === id ? 'text-accent' : 'text-text-dim'
                }`}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setMenuOpen((v) => !v)}
          className="text-text-h sm:hidden"
        >
          {menuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </nav>
  )
}
