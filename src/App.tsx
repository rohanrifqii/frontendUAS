import Header from './components/Header'
import HeroSection from './components/HeroSection'
import './index.css'

function App() {
  return (
    // Latar belakang gradien gelap ke abu-abu medium
    <div className="min-h-screen bg-gradient-to-br from-ftech-dark via-ftech-medium to-ftech-medium/80 font-sans">
      <Header />
      <main>
        <HeroSection />
      </main>
    </div>
  )
}

export default App