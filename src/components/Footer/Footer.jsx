import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-hero-navy pt-16 px-6 pb-8 mt-auto">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-8 md:gap-12">
        <div className="flex flex-col gap-4">
          <div className="text-xl font-bold text-white flex items-center gap-2">
            <span className="material-symbols-outlined filled text-status-safe text-2xl">science</span>
            IngredientIQ
          </div>
          <p className="font-body-main text-sm text-gray-400 max-w-[380px] leading-relaxed">
            Clinical-grade cosmetic data for informed consumers. Data provided for informational purposes only.
          </p>
        </div>

        <div className="grid grid-cols-2 md:contents gap-6 md:gap-0">
          <div className="flex flex-col gap-3">
            <h4 className="font-chemical-name text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Product</h4>
            <Link to="/" className="font-body-main text-sm text-gray-400 hover:text-status-safe transition-colors duration-200">Home</Link>
            <Link to="/#how-it-works" className="font-body-main text-sm text-gray-400 hover:text-status-safe transition-colors duration-200">How It Works</Link>
            <Link to="/#sources" className="font-body-main text-sm text-gray-400 hover:text-status-safe transition-colors duration-200">Data Sources</Link>
          </div>
          <div className="flex flex-col gap-3">
            <h4 className="font-chemical-name text-xs font-semibold uppercase tracking-widest text-gray-500 mb-1">Company</h4>
            <Link to="/about" className="font-body-main text-sm text-gray-400 hover:text-status-safe transition-colors duration-200">About</Link>
            <span className="font-body-main text-sm text-gray-400 hover:text-status-safe transition-colors duration-200 cursor-pointer">Legal Disclaimer</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto mt-12 pt-6 border-t border-white/10">
        <p className="font-body-main text-[13px] text-gray-500">
          © {new Date().getFullYear()} IngredientIQ. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
