import './App.css'
import Header from './components/Header'
import Hero from './components/Hero'
import FeaturedArticles from './components/FeaturedArticles'
import FeaturedTutorials from './components/FeaturedTutorials'
import SubscribeSection from './components/SubscribeSection'
import Footer from './components/Footer'

function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <FeaturedArticles />
        <FeaturedTutorials />
        <SubscribeSection />
      </main>
      <Footer />
    </>
  )
}

export default App
