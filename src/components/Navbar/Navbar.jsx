import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/'

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'How It Works', path: '/#how-it-works' },
    { label: 'About', path: '/about' },
    { label: 'Sources', path: '/#sources' },
  ]

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/'
    if (path.startsWith('/#')) return false
    return location.pathname === path
  }

  const handleNavClick = (e, path) => {
    if (path.startsWith('/#')) {
      e.preventDefault()
      const sectionId = path.replace('/#', '')
      if (location.pathname !== '/') {
        navigate('/')
        setTimeout(() => {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      } else {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <nav 
      className={`transition-all duration-300 ease-out z-[100] ${
        isHome 
          ? 'fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-[1280px] h-16 rounded-full backdrop-blur-xl bg-white/85' 
          : 'sticky top-0 left-0 w-full h-16 bg-surface-container-lowest border-b border-surface-variant'
      } ${
        isHome && scrolled ? 'shadow-[0_4px_30px_rgba(0,0,0,0.08)] bg-white/95' : ''
      }`}
    >
      <div className={`flex justify-between items-center w-full h-full ${isHome ? 'px-6 pr-8' : 'px-6 max-w-[1280px] mx-auto'}`}>
        <Link to="/" className="text-xl font-bold text-on-surface flex items-center gap-2 whitespace-nowrap">
          <span className="material-symbols-outlined filled text-secondary text-2xl">science</span>
          IngredientIQ
        </Link>

        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-chemical-name text-xs font-semibold uppercase tracking-widest py-1 border-b-2 transition-all duration-200 ${
                isActive(link.path) 
                  ? 'text-secondary border-secondary' 
                  : 'text-on-surface-variant border-transparent hover:text-on-surface'
              }`}
              onClick={(e) => handleNavClick(e, link.path)}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          className="hidden md:block font-chemical-name text-xs font-semibold uppercase tracking-widest bg-secondary text-on-secondary px-6 py-2.5 rounded-full shadow-[0_2px_8px_rgba(0,108,83,0.2)] hover:bg-on-secondary-container hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(0,108,83,0.3)] transition-all duration-200"
          onClick={() => navigate('/')}
        >
          Analyze a Product
        </button>

        <button
          className="md:hidden flex text-on-surface p-2"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">
            {mobileOpen ? 'close' : 'menu'}
          </span>
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute top-[calc(64px+8px)] left-4 right-4 bg-surface-container-lowest rounded-xl border border-surface-variant shadow-elevated p-4 flex flex-col gap-1 animate-slide-down md:hidden">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`font-chemical-name text-[13px] font-semibold uppercase tracking-widest px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive(link.path)
                  ? 'bg-surface-container text-secondary'
                  : 'text-on-surface-variant hover:bg-surface-container hover:text-secondary'
              }`}
              onClick={(e) => handleNavClick(e, link.path)}
            >
              {link.label}
            </Link>
          ))}
          <button
            className="flex items-center justify-center gap-2 font-chemical-name text-[13px] font-semibold uppercase tracking-widest bg-secondary text-on-secondary px-6 py-3 rounded-lg mt-2 hover:bg-on-secondary-container transition-all duration-200"
            onClick={() => navigate('/')}
          >
            <span className="material-symbols-outlined text-[18px]">search</span>
            Analyze a Product
          </button>
        </div>
      )}
    </nav>
  )
}

export default Navbar
