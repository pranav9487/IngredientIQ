import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const PIPELINE_STEPS = [
  {
    title: 'Fetching product page',
    subtitle: 'Connected to source successfully.',
    duration: 2000,
  },
  {
    title: 'Extracting ingredient list with AI',
    subtitle: 'Parsing complex chemical terminology...',
    duration: 4000,
  },
  {
    title: 'Cross-referencing clinical databases',
    subtitle: 'Checking PubChem, CIR, and EU Cosing...',
    duration: 5000,
  },
  {
    title: 'Generating safety report',
    subtitle: 'Compiling final analysis...',
    duration: 3000,
  },
]

const FUN_FACTS = [
  'The European Union has banned over 1,300 chemicals from cosmetics that are known or suspected to cause cancer, genetic mutation, or reproductive harm.',
  'The average woman uses 12 personal care products containing 168 unique ingredients every day.',
  'Only 11% of the 10,500 ingredients used in cosmetics have been assessed for safety by the CIR.',
  'Fragrance formulations can contain up to 3,000 different chemical ingredients, often unlisted.',
]

function AnalyzingPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const url = location.state?.url || 'amazon.in/dp/B08XYZ123'
  const [currentStep, setCurrentStep] = useState(0)
  const [progress, setProgress] = useState(0)
  const [factIndex, setFactIndex] = useState(0)
  const [extractedText, setExtractedText] = useState('')
  const intervalRef = useRef(null)

  const sampleIngredients = 'Aqua, Sodium Lauryl Sulfate, Cocamidopropyl Betaine, Glycerin, Dimethiconol, TEA-Dodecylbenzenesulfonate, Sodium Chloride, Parfum, Citric Acid, Methylparaben...'

  // Simulate typing for ingredient extraction
  useEffect(() => {
    if (currentStep === 1) {
      let charIndex = 0
      intervalRef.current = setInterval(() => {
        if (charIndex <= sampleIngredients.length) {
          setExtractedText(sampleIngredients.slice(0, charIndex))
          charIndex++
        } else {
          clearInterval(intervalRef.current)
        }
      }, 30)
      return () => clearInterval(intervalRef.current)
    }
  }, [currentStep])

  // Step progression
  useEffect(() => {
    const totalDuration = PIPELINE_STEPS.reduce((sum, s) => sum + s.duration, 0)
    let elapsed = 0

    const timer = setInterval(() => {
      elapsed += 100
      const pct = Math.min((elapsed / totalDuration) * 100, 100)
      setProgress(pct)

      let stepElapsed = 0
      for (let i = 0; i < PIPELINE_STEPS.length; i++) {
        stepElapsed += PIPELINE_STEPS[i].duration
        if (elapsed < stepElapsed) {
          setCurrentStep(i)
          break
        }
        if (i === PIPELINE_STEPS.length - 1) {
          setCurrentStep(PIPELINE_STEPS.length)
        }
      }

      if (elapsed >= totalDuration) {
        clearInterval(timer)
      }
    }, 100)

    return () => clearInterval(timer)
  }, [navigate, url])

  // Fetch backend data
  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/v1/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url: url || "amazon.in/dp/B08XYZ123" })
        });
        const data = await response.json();
        if (isMounted) {
          navigate('/report', { state: { url, reportData: data } });
        }
      } catch (err) {
        console.error("Analyze error:", err);
        if (isMounted) {
          navigate('/report', { state: { url } });
        }
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, [url, navigate]);

  // Rotate fun facts
  useEffect(() => {
    const factTimer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % FUN_FACTS.length)
    }, 5000)
    return () => clearInterval(factTimer)
  }, [])

  const getStepIcon = (index) => {
    if (index < currentStep) {
      return <span className="material-symbols-outlined filled text-secondary text-2xl">check_circle</span>
    }
    if (index === currentStep) {
      return <span className="material-symbols-outlined text-secondary-fixed-dim text-2xl animate-spin-slow">progress_activity</span>
    }
    return <span className="material-symbols-outlined text-outline text-2xl">schedule</span>
  }

  // Truncate URL for display
  const displayUrl = url.length > 30 ? url.slice(0, 27) + '...' : url

  return (
    <div className="flex flex-col min-h-screen bg-surface-container-lowest">
      <div className="flex-grow w-full max-w-2xl mx-auto px-6 py-8 flex flex-col gap-8 mt-8">
        {/* Context Header */}
        <div className="flex flex-col items-center text-center gap-2 animate-fade-in-up">
          <nav className="flex items-center gap-2 font-chemical-name text-xs font-semibold uppercase tracking-widest text-outline mb-2">
            <span>Home</span>
            <span className="material-symbols-outlined text-sm">chevron_right</span>
            <span className="text-on-surface-variant">Analyzing...</span>
          </nav>
          <h1 className="text-2xl font-semibold">Analysis In Progress</h1>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-surface border border-outline-variant rounded-full max-w-[240px]">
              <span className="material-symbols-outlined text-base">link</span>
              <span className="font-chemical-name text-sm font-medium text-on-surface-variant truncate">{displayUrl}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary-container text-on-secondary-container rounded-full">
              <span className="material-symbols-outlined filled text-base">water_drop</span>
              <span className="font-chemical-name text-xs font-semibold uppercase tracking-widest">Product detected</span>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="flex flex-col gap-2 w-full animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
          <div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
            <div
              className="h-full bg-secondary-fixed-dim rounded-full transition-all duration-100 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between items-center text-sm text-on-surface-variant">
            <span>Processing details...</span>
            <span className="font-medium text-on-surface">Estimated time: 15-20 seconds</span>
          </div>
        </div>

        {/* Pipeline Steps */}
        <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-2xl p-4 shadow-card flex flex-col animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          {PIPELINE_STEPS.map((step, i) => (
            <div
              key={step.title}
              className={`flex items-start gap-4 py-4 border-b border-outline-variant last:border-b-0 last:pb-0 first:pt-0 transition-opacity duration-300 ${
                i > currentStep ? 'opacity-50' : ''
              }`}
            >
              <div className="mt-0.5">
                {getStepIcon(i)}
              </div>
              <div className="flex flex-col w-full">
                <span className="font-body-main text-base font-medium text-on-surface">{step.title}</span>
                {(i <= currentStep) && (
                  <span className={`text-sm ${i === currentStep ? 'text-on-surface-variant mb-3' : 'text-outline'}`}>
                    {step.subtitle}
                  </span>
                )}
                {i === 1 && currentStep === 1 && (
                  <div className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 text-on-surface-variant break-all relative overflow-hidden max-h-20">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-container-low z-10" />
                    <span className="font-chemical-name text-sm font-medium">{extractedText}</span>
                    <span className="inline-block w-2 h-4 bg-outline-variant ml-0.5 align-middle animate-pulse-slow" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AnalyzingPage
