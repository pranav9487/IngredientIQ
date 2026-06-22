import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import SafetyGauge from '../../components/SafetyGauge/SafetyGauge'

// Temporary mock data. In a real app, this would be fetched from your backend.
const MOCK_REPORT = {
  id: 'IQ-99482-B',
  brand: 'CLINIQUE BRAND',
  productName: 'Hydra-Renew Daily Face Moisturizer',
  url: 'https://example.com/product',
  score: 71,
  stats: { safe: 18, caution: 5, restricted: 1 },
  aiSummary: [
    'This formulation is primarily composed of standard moisturizing agents and humectants that are generally recognized as safe (GRAS) for daily topical application. The base relies heavily on water and glycerin, which provide a low-risk foundation for hydration.',
    'However, the presence of certain surfactants and preservatives elevates the overall risk profile. Notably, the inclusion of Sodium Lauryl Sulfate (SLS) may cause barrier disruption and irritation in individuals with sensitive or compromised skin, especially with prolonged use.'
  ],
  warning: 'Crucial finding: The formula contains Methylparaben. While permitted in certain concentrations under EU regulations, it is currently under review by several regulatory bodies due to potential endocrine-disrupting properties. Continuous daily use over large body surface areas should be monitored.',
  recommendation: 'Use With Caution',
  ingredients: [
    {
      name: 'Glycerin',
      type: 'Humectant',
      status: 'safe',
      details: null
    },
    {
      name: 'Sodium Lauryl Sulfate (SLS)',
      type: 'Surfactant / Cleansing',
      status: 'caution',
      details: {
        cas: '151-21-3',
        ec: '205-788-1',
        concern: 'Skin and eye irritation; barrier disruption.',
        euNotes: 'Not restricted in Annex III, but strongly advised against in leave-on products due to cumulative irritation potential.',
        cir: 'Safe in rinse-off products. In leave-on formulations, concentration should not exceed 1%.',
        concentration: 'Medium (2-5%)',
        concentrationPct: 35
      }
    },
    {
      name: 'Methylparaben',
      type: 'Preservative',
      status: 'restricted',
      details: null
    },
    {
      name: 'Aqua (Water)',
      type: 'Solvent',
      status: 'safe',
      details: null
    },
    {
      name: 'Cocamide DEA',
      type: 'Foam Booster / Viscosity Agent',
      status: 'caution',
      details: null
    },
    {
      name: 'Citric Acid',
      type: 'pH Adjuster',
      status: 'safe',
      details: null
    }
  ]
}

function ReportPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all') // all, safe, caution, restricted
  const [expandedIng, setExpandedIng] = useState('Sodium Lauryl Sulfate (SLS)')
  
  const rawData = location.state?.reportData;
  const urlParams = location.state?.url || 'https://example.com/product';
  
  let report = MOCK_REPORT;
  if (rawData && rawData.ingredients) {
      let safeCount = 0;
      let cautionCount = 0;
      let restrictedCount = 0;
      
      const mappedIngredients = rawData.ingredients.map(ing => {
          let status = 'safe';
          const regStatus = ing.regulatory_analysis?.regulation_status?.status?.toLowerCase() || '';
          if (regStatus === 'banned') {
              status = 'restricted';
              restrictedCount++;
          } else if (regStatus === 'restricted') {
              status = 'caution';
              cautionCount++;
          } else {
              status = 'safe';
              safeCount++;
          }
          
          const limits = ing.regulatory_analysis?.concentration_limits || [];
          const concentrationText = limits.map(l => `${l.product_type}: ${l.max_threshold}`).join(' | ') || 'None';
          const warnings = ing.regulatory_analysis?.warnings?.join('; ') || 'None';

          return {
              name: ing.ingredient,
              type: ing.regulatory_analysis?.ingredient_name || 'Ingredient',
              status: status,
              details: {
                  cas: ing.properties?.CID ? `CID: ${ing.properties.CID}` : 'N/A',
                  limits: concentrationText,
                  warnings: warnings,
                  concern: ing.hazards?.hazards_summary?.[0] || 'No hazard info listed',
                  euNotes: ing.regulatory_analysis?.summary?.technical || 'No technical summary available',
                  cir: ing.regulatory_analysis?.summary?.simple_explanation || 'No explanation available'
              }
          }
      });
      
      const total = safeCount + cautionCount + restrictedCount;
      const score = total > 0 ? Math.round((safeCount / total) * 100) : 100;
      
      report = {
          id: 'IQ-' + Math.floor(Math.random() * 100000),
          brand: 'Scanned Product',
          productName: urlParams.split('/').pop() || 'Product Analysis',
          url: urlParams,
          score: score,
          stats: { safe: safeCount, caution: cautionCount, restricted: restrictedCount },
          aiSummary: [
              `Analyzed ${total} ingredients from the provided product URL.`,
              `Found ${restrictedCount} banned and ${cautionCount} restricted ingredients based on regulatory databases.`
          ],
          warning: restrictedCount > 0 ? `Crucial finding: Contains ${restrictedCount} banned ingredients that pose health risks.` : 'No banned ingredients found.',
          recommendation: restrictedCount > 0 ? 'Do Not Use' : (cautionCount > 0 ? 'Use With Caution' : 'Safe to Use'),
          ingredients: mappedIngredients
      };
  }

  const toggleIngredient = (name) => {
    setExpandedIng(expandedIng === name ? null : name)
  }

  const filteredIngredients = report.ingredients.filter(ing => {
    if (filter === 'all') return true
    return ing.status === filter
  })

  const getStatusLabel = (status) => {
    switch (status) {
      case 'safe': return 'SAFE'
      case 'caution': return 'CAUTION'
      case 'restricted': return 'RESTRICTED'
      default: return 'UNKNOWN'
    }
  }

  const getPillColor = (status) => {
    switch (status) {
      case 'safe': return 'bg-status-safe-bg text-status-safe'
      case 'caution': return 'bg-status-caution-bg text-status-caution'
      case 'restricted': return 'bg-status-harmful-bg text-status-harmful'
      default: return ''
    }
  }

  const getDotColor = (status) => {
    switch (status) {
      case 'safe': return 'bg-status-safe'
      case 'caution': return 'bg-status-caution'
      case 'restricted': return 'bg-status-harmful'
      default: return ''
    }
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Sub Navigation */}
      <div className="sticky top-16 bg-surface-container-lowest border-b border-surface-variant z-40">
        <div className="max-w-[1280px] mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="text-on-surface-variant hover:text-on-surface transition-colors flex items-center justify-center" onClick={() => navigate(-1)}>
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <div className="w-px h-6 bg-surface-variant" />
            <div className="flex items-center gap-2">
              <span className="font-chemical-name text-xs font-semibold uppercase tracking-widest text-on-surface-variant">NEW ANALYSIS</span>
              <span className="text-on-surface-variant">/</span>
              <span className="text-sm font-medium text-on-surface truncate max-w-[150px] md:max-w-[300px]">{report.productName}</span>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 rounded font-chemical-name text-xs font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity" onClick={() => navigate('/')}>
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            <span className="hidden sm:inline">RUN FRESH ANALYSIS</span>
          </button>
        </div>
      </div>

      <main className="max-w-[1280px] mx-auto px-6 py-8 grid grid-cols-1 lg:grid-cols-[8fr_4fr] gap-6">
        <div className="flex flex-col gap-4">
          {/* Product Summary Card */}
          <div className="bg-surface-container-lowest border border-surface-variant rounded-2xl shadow-card overflow-hidden flex flex-col">
            <div className="p-4 md:p-6 flex flex-col md:flex-row gap-6">
              <div className="w-full flex flex-col justify-between gap-4">
                <div className="flex items-start gap-4">
                  {/* <SafetyGauge score={report.score} size={80} showLabel={false} /> */}
                  <div className="flex flex-col">
                    <p className="text-sm text-on-surface-variant mt-1">
                      Based on {report.ingredients.length} analyzed ingredients.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-surface-container-low border border-surface-variant rounded-xl p-2 flex flex-col items-center justify-center">
                    <span className="text-2xl font-semibold text-status-safe">{report.stats.safe}</span>
                    <span className="font-chemical-name text-xs font-semibold uppercase tracking-widest text-on-surface-variant mt-1">Safe</span>
                  </div>
                  <div className="bg-surface-container-low border border-surface-variant rounded-xl p-2 flex flex-col items-center justify-center">
                    <span className="text-2xl font-semibold text-status-caution">{report.stats.caution}</span>
                    <span className="font-chemical-name text-xs font-semibold uppercase tracking-widest text-on-surface-variant mt-1">Caution</span>
                  </div>
                  <div className="bg-surface-container-low border border-status-harmful/20 rounded-xl p-2 flex flex-col items-center justify-center">
                    <span className="text-2xl font-semibold text-status-harmful">{report.stats.restricted}</span>
                    <span className="font-chemical-name text-xs font-semibold uppercase tracking-widest text-status-harmful mt-1">Restricted</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex gap-2">
                    <span className="text-[10px] bg-surface-variant text-on-surface-variant px-2 py-1 rounded font-chemical-name font-semibold uppercase tracking-widest">PUBCHEM</span>
                    <span className="text-[10px] bg-surface-variant text-on-surface-variant px-2 py-1 rounded font-chemical-name font-semibold uppercase tracking-widest">CIR</span>
                    <span className="text-[10px] bg-surface-variant text-on-surface-variant px-2 py-1 rounded font-chemical-name font-semibold uppercase tracking-widest">EU Cosing</span>
                  </div>
                  <div className="text-sm text-on-surface-variant flex items-center gap-1">
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* AI Summary Card */}
          <div className="bg-surface-container-lowest border border-surface-variant rounded-2xl shadow-card p-4 md:p-6 flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="material-symbols-outlined filled text-secondary">memory</span>
              <h2 className="text-2xl font-semibold">AI Safety Assessment</h2>
            </div>
            <div className="text-base text-on-surface-variant flex flex-col gap-4">
              {report.aiSummary.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              
              {/* <div className="bg-status-caution-bg border border-status-caution/30 rounded-xl p-4 flex gap-3 mt-4 text-[#925a00]">
                <span className="material-symbols-outlined filled shrink-0">warning</span>
                <p className="text-sm m-0">
                  {report.warning}
                </p>
              </div> */}
            </div>
          </div>

          {/* Ingredient Breakdown */}
          <div className="mt-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4 md:gap-0">
              <h2 className="text-2xl font-semibold">Ingredient Breakdown</h2>
              <div className="flex gap-2">
                <button 
                  className={`font-chemical-name text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full transition-all duration-200 border border-surface-variant ${filter === 'all' ? 'bg-on-surface text-surface-container-lowest border-on-surface' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'}`}
                  onClick={() => setFilter('all')}
                >
                  ALL ({report.ingredients.length})
                </button>
                <button 
                  className={`font-chemical-name text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full transition-all duration-200 border border-surface-variant ${filter === 'safe' ? 'bg-on-surface text-surface-container-lowest border-on-surface' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'}`}
                  onClick={() => setFilter('safe')}
                >
                  SAFE
                </button>
                <button 
                  className={`font-chemical-name text-xs font-semibold uppercase tracking-widest px-3 py-1.5 rounded-full transition-all duration-200 border border-surface-variant ${filter === 'caution' ? 'bg-on-surface text-surface-container-lowest border-on-surface' : 'bg-surface-container text-on-surface-variant hover:bg-surface-variant'}`}
                  onClick={() => setFilter('caution')}
                >
                  CAUTION
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {filteredIngredients.map(ing => {
                const isExpanded = expandedIng === ing.name;
                return (
                  <div key={ing.name} className={`bg-surface-container-lowest border rounded-xl overflow-hidden transition-all duration-200 ${isExpanded ? 'shadow-card border-surface-variant' : ing.status === 'restricted' ? 'border-status-harmful/30 hover:bg-surface-container-low' : ing.status === 'caution' ? 'border-status-caution/30 hover:bg-surface-container-low' : 'border-surface-variant hover:bg-surface-container-low'}`}>
                    <div className={`p-3 flex items-center justify-between cursor-pointer ${isExpanded ? 'bg-surface-container-low border-b border-surface-variant' : ''}`} onClick={() => toggleIngredient(ing.name)}>
                      <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
                        <div className="flex items-center gap-2 md:gap-4">
                          <div className={`w-2 h-2 rounded-full ${getDotColor(ing.status)}`} />
                          <span className="font-chemical-name text-sm font-semibold">{ing.name}</span>
                        </div>
                        <span className="text-xs text-on-surface-variant md:ml-0 ml-4">{ing.type}</span>
                      </div>
                      <div className="flex items-center gap-3 ml-2">
                        <span className={`font-chemical-name text-[10px] font-semibold uppercase tracking-widest px-2 py-1 rounded-full ${getPillColor(ing.status)}`}>{getStatusLabel(ing.status)}</span>
                        <span className="material-symbols-outlined text-on-surface-variant">
                          {isExpanded ? 'expand_less' : 'expand_more'}
                        </span>
                      </div>
                    </div>

                    {isExpanded && ing.details && (
                      <div className="p-4 flex flex-col gap-4 animate-slide-down">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_1fr_2fr] gap-4">
                          <div className="flex flex-col gap-1">
                            <span className="font-chemical-name text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">CAS/CID NUMBER</span>
                            <span className="text-sm font-chemical-name">{ing.details.cas}</span>
                          </div>
                          <div className="flex flex-col gap-1">
                            <span className="font-chemical-name text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">CONCENTRATION LIMITS</span>
                            <span className="text-sm font-chemical-name">{ing.details.limits}</span>
                          </div>
                          <div className="flex flex-col gap-1 md:col-span-2 lg:col-span-1">
                            <span className="font-chemical-name text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">PRIMARY CONCERN</span>
                            <span className="text-sm">{ing.details.concern}</span>
                          </div>
                        </div>

                        {ing.details.warnings !== 'None' && (
                          <div className="flex flex-col gap-1">
                            <span className="font-chemical-name text-[10px] font-semibold uppercase tracking-widest text-status-harmful">WARNINGS</span>
                            <span className="text-sm text-status-harmful font-medium">{ing.details.warnings}</span>
                          </div>
                        )}

                        <div className="h-px bg-surface-variant w-full" />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="bg-surface-container border border-surface-variant rounded p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">policy</span>
                              <span className="font-chemical-name text-[12px] font-semibold uppercase tracking-widest">TECHNICAL DETAILS</span>
                            </div>
                            <p className="text-[13px] text-on-surface-variant">
                              {ing.details.euNotes}
                            </p>
                          </div>
                          <div className="bg-surface-container border border-surface-variant rounded p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">biotech</span>
                              <span className="font-chemical-name text-[12px] font-semibold uppercase tracking-widest">SIMPLE EXPLANATION</span>
                            </div>
                            <p className="text-[13px] text-on-surface-variant">
                              {ing.details.cir}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="hidden lg:flex flex-col">
          <div className="sticky top-[calc(64px+56px+24px)] bg-surface-container-low border border-surface-variant rounded-2xl p-6 shadow-card">
            <h3 className="text-2xl font-semibold mb-4">Report Info</h3>
            <p className="text-sm text-on-surface-variant mb-4">
              This report was generated using data from publicly available safety databases. It does not constitute medical advice.
            </p>
            {/* <div className="flex flex-col gap-2">
              <span className="font-chemical-name text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">ANALYSIS ID</span>
              <span className="font-chemical-name text-sm">{report.id}</span>
            </div>
            <div className="flex flex-col gap-2 mt-2">
              <span className="font-chemical-name text-[10px] font-semibold uppercase tracking-widest text-on-surface-variant">DATABASE VERSION</span>
              <span className="font-chemical-name text-sm">v2023.11</span>
            </div> */}
          </div>
        </div>
      </main>

    </div>
  )
}

export default ReportPage
