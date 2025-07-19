import Image from 'next/image'
import Link from 'next/link'

const values = [
  {
    icon: '🏛️',
    title: 'Heritage',
    description: 'Preserving traditional weaving techniques and textile heritage for future generations'
  },
  {
    icon: '✨',
    title: 'Quality',
    description: 'Uncompromising commitment to premium materials and exceptional craftsmanship'
  },
  {
    icon: '🤝',
    title: 'Trust',
    description: 'Building lasting relationships with customers through transparency and reliability'
  },
  {
    icon: '🌱',
    title: 'Sustainability',
    description: 'Supporting eco-friendly practices and empowering local artisan communities'
  }
]

const team = [
  {
    name: 'Priya Nava Jothi',
    role: 'Founder & Creative Director',
    description: 'With over 15 years in textile design, Priya brings passion for traditional Indian crafts',
    image: '/images/team/founder.jpg'
  },
  {
    name: 'Meera Krishnan',
    role: 'Head of Operations',
    description: 'Expert in supply chain management ensuring quality from loom to customer',
    image: '/images/team/operations.jpg'
  },
  {
    name: 'Rajesh Kumar',
    role: 'Master Weaver',
    description: 'Third-generation weaver specializing in traditional Chettinad and Ikath techniques',
    image: '/images/team/weaver.jpg'
  }
]

const milestones = [
  {
    year: '2008',
    title: 'Company Founded',
    description: 'Started as a small family business with a vision to preserve traditional textile arts'
  },
  {
    year: '2012',
    title: 'First Collection Launch',
    description: 'Launched our signature Chettinad silk collection with 25 unique designs'
  },
  {
    year: '2016',
    title: 'Online Expansion',
    description: 'Expanded to online retail, reaching customers across India and internationally'
  },
  {
    year: '2020',
    title: 'Artisan Partnership Program',
    description: 'Launched program supporting 100+ local weavers and their families'
  },
  {
    year: '2024',
    title: 'Sustainable Initiative',
    description: 'Committed to 100% sustainable and eco-friendly production processes'
  }
]

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-accent-cream via-white to-primary-50">
      {/* Hero Section */}
      <section className="relative py-32 bg-gradient-to-r from-primary-800 to-primary-600 text-white">
        <div className="absolute inset-0">
          <Image
            src="/images/hero/hero1.png"
            alt="About Nava Jothi Silks"
            fill
            className="object-cover opacity-30"
            priority
          />
        </div>
        
        <div className="relative z-10 container-custom text-center">
          <h1 className="hero-title text-white mb-6">
            About Nava Jothi Silks
          </h1>
          <p className="text-xl lg:text-2xl mb-8 max-w-3xl mx-auto">
            Celebrating India's rich textile heritage through premium silk sarees that blend traditional craftsmanship with contemporary elegance
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-6">Our Story</h2>
              <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                Founded in 2008, Nava Jothi Silks began as a passionate endeavor to preserve and celebrate 
                India's magnificent textile traditions. What started as a small family business has 
                grown into a trusted name in premium silk sarees, known for authenticity and quality.
              </p>
              <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                Our journey is rooted in deep respect for traditional weaving techniques, particularly 
                the exquisite crafts of Tamil Nadu. We work directly with skilled artisans and master 
                weavers, ensuring that ancient techniques are preserved while creating contemporary 
                designs that resonate with modern women.
              </p>
              <p className="text-lg text-neutral-600 mb-8 leading-relaxed">
                Every saree in our collection tells a story - of heritage, craftsmanship, and the 
                timeless beauty of Indian textiles. We take pride in being custodians of this rich 
                cultural legacy while making it accessible to women around the world.
              </p>
              <Link href="/catalog" className="btn-primary">
                Explore Our Collections
              </Link>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image
                src="/images/products/chettinad1.jpg"
                alt="Traditional Weaving"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="section-padding bg-primary-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">
              The principles that guide everything we do and every saree we create
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value) => (
              <div key={value.title} className="text-center card-elegant">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full mb-6 text-2xl">
                  {value.icon}
                </div>
                <h3 className="font-display text-xl font-semibold text-primary-900 mb-4">
                  {value.title}
                </h3>
                <p className="text-neutral-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Meet Our Team</h2>
            <p className="section-subtitle">
              The passionate individuals behind Nava Jothi Silks'; success and commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member) => (
              <div key={member.name} className="text-center card-elegant">
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden bg-primary-100">
                  <div className="w-full h-full flex items-center justify-center text-4xl text-primary-600">
                    👤
                  </div>
                </div>
                <h3 className="font-display text-xl font-semibold text-primary-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-secondary-600 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-neutral-600 leading-relaxed">
                  {member.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey Section */}
      <section className="section-padding bg-gradient-to-br from-secondary-50 to-primary-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="section-title">Our Journey</h2>
            <p className="section-subtitle">
              Key milestones in our mission to preserve and promote Indian textile heritage
            </p>
          </div>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 bg-primary-300 h-full hidden lg:block"></div>
            
            <div className="space-y-12">
              {milestones.map((milestone, index) => (
                <div key={milestone.year} className={`flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'}`}>
                  <div className="flex-1 text-center lg:text-left">
                    <div className="card-elegant">
                      <div className="inline-block bg-secondary-500 text-primary-900 px-4 py-2 rounded-full font-bold text-lg mb-4">
                        {milestone.year}
                      </div>
                      <h3 className="font-display text-xl font-semibold text-primary-900 mb-3">
                        {milestone.title}
                      </h3>
                      <p className="text-neutral-600 leading-relaxed">
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                  
                  {/* Timeline dot */}
                  <div className="hidden lg:block w-4 h-4 bg-secondary-500 rounded-full border-4 border-white shadow-lg relative z-10"></div>
                  
                  <div className="flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Commitment Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-xl overflow-hidden">
              <Image
                src="/images/products/ikath1.jpg"
                alt="Artisan at Work"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <h2 className="section-title mb-6">Our Commitment</h2>
              <p className="text-lg text-neutral-600 mb-6 leading-relaxed">
                We are committed to supporting the artisan communities that make our beautiful 
                sarees possible. Through fair trade practices, skill development programs, and 
                sustainable sourcing, we ensure that traditional crafts continue to thrive.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <span className="text-secondary-500 text-xl">✓</span>
                  <p className="text-neutral-600">Fair wages and working conditions for all artisans</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-secondary-500 text-xl">✓</span>
                  <p className="text-neutral-600">Eco-friendly production and sustainable materials</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-secondary-500 text-xl">✓</span>
                  <p className="text-neutral-600">Preservation of traditional weaving techniques</p>
                </div>
                <div className="flex items-start gap-3">
                  <span className="text-secondary-500 text-xl">✓</span>
                  <p className="text-neutral-600">Community development and skill training programs</p>
                </div>
              </div>
              <Link href="/contact" className="btn-outline">
                Get in Touch
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-r from-primary-700 to-primary-600 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl lg:text-4xl font-display font-semibold mb-6">
            Experience the Beauty of Traditional Silk
          </h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Discover our exquisite collections and be part of preserving India';s textile heritage
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/catalog" className="btn-secondary">
              Shop Collections
            </Link>
            <Link href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary-600">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}