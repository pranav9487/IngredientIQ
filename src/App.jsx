import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Footer from './components/Footer/Footer'
import HomePage from './pages/Home/HomePage'
import AnalyzingPage from './pages/Analyzing/AnalyzingPage'
import ReportPage from './pages/Report/ReportPage'

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/analyzing" element={<AnalyzingPage />} />
          <Route path="/report" element={<ReportPage />} />
          <Route path="/report/:id" element={<ReportPage />} />
          {/* About page left for user to build */}
          <Route path="/about" element={
            <div className="w-full max-w-[1280px] mx-auto px-6 pt-[120px] pb-20 text-center">
              <h1 className="text-3xl font-bold font-body-main">About Page</h1>
              <p className="text-base text-on-surface-variant font-body-main mt-4">
                This page is reserved for you to build!
              </p>
            </div>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
