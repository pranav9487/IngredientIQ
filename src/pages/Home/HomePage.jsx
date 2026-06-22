import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import SafetyGauge from '../../components/SafetyGauge/SafetyGauge'

const POPULAR_CATEGORIES = ['Soap', 'Shampoo', 'Moisturizer', 'Sunscreen']

const HOW_IT_WORKS_STEPS = [
  {
    icon: 'link',
    title: 'Paste URL',
    description: 'Drop a link to any product page from major retailers.',
  },
  {
    icon: 'smart_toy',
    title: 'AI Scrapes',
    description: 'Our system extracts the exact ingredient list automatically.',
  },
  {
    icon: 'shield',
    title: 'Cross-checks',
    description: 'Ingredients are matched against clinical safety databases.',
  },
  {
    icon: 'description',
    title: 'Report Generated',
    description: 'Get a clear, easy-to-understand safety score.',
  },
]

const SAMPLE_INGREDIENTS = [
  { name: 'Glycerin', status: 'safe' },
  { name: 'Sodium Laureth Sulfate (SLS)', status: 'caution' },
  { name: 'Methylparaben', status: 'harmful' },
  { name: 'Cocamidopropyl Betaine', status: 'caution' },
]

function HomePage() {
  const [url, setUrl] = useState('')
  const navigate = useNavigate()

  const handleAnalyze = (e) => {
    e.preventDefault()
    if (url.trim()) {
      navigate('/analyzing', { state: { url: url.trim() } })
    }
  }

  const statusLabel = {
    safe: 'Safe',
    caution: 'Caution',
    harmful: 'Harmful',
  }

  const getPillColor = (status) => {
    switch (status) {
      case 'safe': return 'bg-[rgba(0,196,154,0.1)] text-[#00C49A]'
      case 'caution': return 'bg-[rgba(245,158,11,0.1)] text-[#F59E0B]'
      case 'harmful': return 'bg-[rgba(239,68,68,0.1)] text-[#EF4444]'
      default: return ''
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* ===== HERO SECTION ===== */}
      <section className="relative bg-hero-navy text-white pt-[140px] px-6 pb-24 overflow-hidden hero-bg">
        <div className="relative z-10 max-w-[1280px] mx-auto text-center flex flex-col items-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 bg-[rgba(0,196,154,0.1)] text-status-safe px-3.5 py-1.5 rounded-full mb-8 border border-[rgba(0,196,154,0.2)]">
            <span className="material-symbols-outlined text-base">verified</span>
            <span className="font-chemical-name text-xs font-semibold uppercase tracking-widest">Powered by EU Regulation Data</span>
          </div>

          <h1 className="font-body-main text-[clamp(36px,5vw,60px)] font-bold leading-[1.1] mb-6 max-w-[800px] tracking-tight">
            Know exactly what's in your skincare.
          </h1>

          <form className="w-full max-w-[640px] bg-white rounded-full p-2 flex flex-col md:flex-row items-center mb-8 shadow-hero-input md:rounded-full rounded-xl gap-2 md:gap-0" onSubmit={handleAnalyze}>
            <div className="hidden md:flex px-4 py-2 text-gray-400 items-center">
              <span className="material-symbols-outlined">link</span>
            </div>
            <input
              type="text"
              className="flex-1 w-full bg-transparent text-gray-900 font-body-main text-base p-3 outline-none placeholder:text-gray-400"
              placeholder="Paste an Amazon, Sephora, or Ulta URL..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              id="hero-search-input"
            />
            <button type="submit" className="w-full md:w-auto flex justify-center items-center gap-2 bg-secondary text-white px-6 py-3.5 md:py-3 rounded-full font-chemical-name text-xs font-semibold uppercase tracking-widest hover:bg-on-secondary-container transition-colors duration-200 whitespace-nowrap" id="analyze-btn">
              Analyze Ingredients
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </form>

          <div className="flex flex-wrap justify-center items-center gap-3">
            <span className="text-gray-400 font-chemical-name text-xs font-semibold uppercase tracking-widest py-2">Popular Categories:</span>
            {POPULAR_CATEGORIES.map((cat) => (
              <button key={cat} className="px-4 py-2 rounded-full border border-gray-600 text-gray-300 font-chemical-name text-xs font-semibold uppercase tracking-widest hover:bg-white/10 hover:text-white hover:border-white/30 transition-all duration-200">{cat}</button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRUST BAR ===== */}
      <section className="border-b border-surface-variant bg-surface-container-lowest py-8 px-6">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row justify-between items-center text-center gap-6">
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl font-bold text-on-surface">EU Annex</span>
            <span className="font-chemical-name text-xs font-semibold uppercase tracking-widest text-on-surface-variant mt-1">Cosmetics Reg</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl font-bold text-on-surface">PubChem</span>
            <span className="font-chemical-name text-xs font-semibold uppercase tracking-widest text-on-surface-variant mt-1">NIH Database</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <span className="text-3xl font-bold text-on-surface">CIR</span>
            <span className="font-chemical-name text-xs font-semibold uppercase tracking-widest text-on-surface-variant mt-1">Safety Reviews</span>
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="py-24 px-6 bg-surface" id="how-it-works">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-2xl font-semibold mb-3">How It Works</h2>
            <p className="text-base text-on-surface-variant">
              Clinical data analysis in four simple steps.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {HOW_IT_WORKS_STEPS.map((step, i) => (
              <div
                key={step.title}
                className="group bg-surface-container-lowest p-6 rounded-2xl border border-surface-variant shadow-card flex flex-col items-center text-center cursor-pointer transition-all duration-300 hover:border-secondary hover:-translate-y-1 hover:shadow-[0_8px_24px_rgba(0,108,83,0.08)] animate-fade-in-up"
                style={{ animationDelay: `${i * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110">
                  <span className="material-symbols-outlined">{step.icon}</span>
                </div>
                <h3 className="font-body-main text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-sm text-on-surface-variant">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SAMPLE REPORT PREVIEW ===== */}
      <section className="py-24 px-6 bg-surface-container-lowest border-t border-surface-variant" id="sources">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-8 lg:gap-16 items-center">
          <div>
            <h2 className="text-2xl font-semibold mb-4">See clarity in action.</h2>
            <p className="text-base text-on-surface-variant mb-8">
              Stop guessing what chemical names mean. We break down the complex jargon into a simple safety score and highlight exactly what you need to pay attention to.
            </p>
            <ul className="flex flex-col gap-4">
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary mt-0.5">check_circle</span>
                <div>
                  <strong className="block mb-0.5">Clear Safety Scoring</strong>
                  <span className="text-sm text-on-surface-variant">
                    Aggregate score based on known concerns.
                  </span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="material-symbols-outlined text-secondary mt-0.5">check_circle</span>
                <div>
                  <strong className="block mb-0.5">Ingredient Breakdown</strong>
                  <span className="text-sm text-on-surface-variant">
                    Individual flags for toxicity, irritation, and allergens.
                  </span>
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-surface p-8 rounded-3xl border border-surface-variant shadow-elevated">
            <div className="flex items-center justify-between mb-8 pb-6 border-b border-surface-variant">
              <div>
                <span className="font-chemical-name text-xs font-semibold uppercase tracking-widest text-on-surface-variant block mb-1">Example Report</span>
                <h3 className="text-2xl font-semibold">Dove Deeply Nourishing</h3>
              </div>
              <SafetyGauge score={71} size={64} />
            </div>

            <div className="flex flex-col gap-3">
              {SAMPLE_INGREDIENTS.map((ing) => (
                <div
                  key={ing.name}
                  className={`bg-surface-container-lowest p-4 rounded-xl border flex justify-between items-center shadow-[0_1px_4px_rgba(0,0,0,0.02)] ${
                    ing.status === 'harmful' ? 'border-l-4 border-l-status-harmful border-t-surface-variant border-r-surface-variant border-b-surface-variant' : 'border-surface-variant'
                  }`}
                >
                  <span className="font-chemical-name text-sm font-medium">{ing.name}</span>
                  <span className={`font-chemical-name text-xs font-semibold uppercase tracking-widest px-3 py-1 rounded-full ${getPillColor(ing.status)}`}>
                    {statusLabel[ing.status]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
