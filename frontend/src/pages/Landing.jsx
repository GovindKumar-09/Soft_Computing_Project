
import HeroSection from '../components/landing/HeroSection'
import MetricsSection from '../components/landing/MetricsSection'
import FeatureTicker from '../components/landing/FeatureTicker'
import FeatureGrid from '../components/landing/FeatureGrid'
import RecentLectures from '../components/landing/RecentLectures'
import BottomCTA from '../components/landing/BottomCTA'
import Footer from '../components/landing/Footer'
import Reveal from '../components/motion/Reveal'

function Landing() {
  return (
    <div className="overflow-x-clip">
      <HeroSection />

      <Reveal delay={0.05}>
        <MetricsSection />
      </Reveal>

      <Reveal>
        <FeatureTicker />
      </Reveal>

      <Reveal>
        <FeatureGrid />
      </Reveal>

      <Reveal>
        <RecentLectures />
      </Reveal>

      <Reveal>
        <BottomCTA />
      </Reveal>

      <Reveal>
        <Footer />
      </Reveal>
    </div>
  )
}

export default Landing
