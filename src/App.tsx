import { useEffect, useRef, useState } from 'react'

/* ------------------------------------------------------------------ *
 * Meridian — single page.
 * Nav + hero card with animated icon pipeline + tooling row,
 * then network, process, pricing, FAQ, CTA and footer.
 *
 * Design, layout and animation are the Xero hero, unchanged.
 * Only the content is Meridian: checkout the copy constants below.
 * ------------------------------------------------------------------ */

/** Single place to set the sales channel. */
const TELEGRAM = 'https://t.me/QuotaPingBot'
const TELEGRAM_LABEL = 'Get access'

type Phase = 'p1' | 'splash' | 'p2' | 'idle'

const PHASE_MS: Record<Phase, number> = {
  p1: 800,
  splash: 800,
  p2: 800,
  idle: 1000,
}

const GRADIENT_HALF_WIDTH = 5 // percentage units
const CSS_PCT = 100

/* ------------------------------------------------------------------ *
 * Marks and icons
 * ------------------------------------------------------------------ */

function BrandMark() {
  /* Meridian mark — globe with a meridian line. Sized and positioned
     exactly like the original centre mark. */
  return (
    <svg className="brand-mark" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="16" />
      <ellipse cx="20" cy="20" rx="7.2" ry="16" />
      <path d="M4 20h32" />
    </svg>
  )
}

/* ------------------------------------------------------------------ *
 * Content
 * ------------------------------------------------------------------ */

const NAV_LINKS = [
  { label: 'Network', href: '#network' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'How it works', href: '#how' },
  { label: 'FAQ', href: '#faq' },
]

const TOOLING = [
  {
    name: 'Scrapy',
    icon: (
      <>
        <circle cx="12" cy="13" r="3.2" />
        <path d="M12 9.8V6M9.3 11.4 6 9M14.7 11.4 18 9M9.4 15.2 6 18M14.6 15.2 18 18" />
      </>
    ),
  },
  {
    name: 'Playwright',
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M10 9.5l5 2.5-5 2.5z" />
      </>
    ),
  },
  {
    name: 'Selenium',
    icon: (
      <>
        <circle cx="12" cy="12" r="2" />
        <path d="M12 4a8 8 0 0 1 0 16" />
        <path d="M4.5 8.5a8 8 0 0 0 15 7" />
      </>
    ),
  },
  {
    name: 'Puppeteer',
    icon: (
      <>
        <rect x="4" y="8" width="16" height="11" rx="3" />
        <path d="M12 8V4M9 13h.01M15 13h.01" />
      </>
    ),
  },
  {
    name: 'curl',
    icon: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="3" />
        <path d="M7.5 10l3 3-3 3M13 16h4" />
      </>
    ),
  },
]

const FEATURES = [
  {
    title: 'Rotating exits',
    body: 'Every connection picks a different live home IP from the pool. Rotation is what keeps you under rate limits and out of blocklists.',
    icon: (
      <>
        <path d="M12 3v18M3 12h18" />
        <circle cx="12" cy="12" r="9" />
      </>
    ),
  },
  {
    title: 'Sticky sessions',
    body: 'Tag your username and hold the same exit for the length of a job — log in, browse, submit, without a mid-flow IP change.',
    icon: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3.4 2" />
      </>
    ),
  },
  {
    title: 'Country targeting',
    body: 'Ask for a country per connection. Prefer a location and fall back automatically, or lock to it strictly when the job depends on it.',
    icon: (
      <>
        <path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z" />
        <circle cx="12" cy="10" r="2.6" />
      </>
    ),
  },
  {
    title: 'SOCKS5 and HTTPS',
    body: 'Both protocols on every account. Browsers, Python, Playwright, Selenium, scrapers, curl — if it takes a proxy, it works.',
    icon: (
      <>
        <path d="M8 9V6a4 4 0 0 1 8 0v3" />
        <rect x="5" y="9" width="14" height="11" rx="2.5" />
      </>
    ),
  },
  {
    title: 'Per-gigabyte billing',
    body: 'You pay for traffic, not seats or time. Credits never expire and you can check your balance on demand instead of guessing.',
    icon: (
      <>
        <path d="M4 18V9M10 18V5M16 18v-6M22 18H2" />
      </>
    ),
  },
  {
    title: 'Instant top-ups',
    body: 'Run out and your connections stop. Top up and access resumes in seconds — same account, same history, nothing reset.',
    icon: (
      <>
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
      </>
    ),
  },
]

const STEPS = [
  {
    title: 'Message us',
    body: 'Everything runs through Telegram. Tell us roughly what you are running and how much traffic you expect — that sizes your account.',
  },
  {
    title: 'Top up, get your code',
    body: 'Send your first top-up. You receive a single-use code, paste it into the bot, and your credentials are issued on the spot.',
  },
  {
    title: 'Point your tool at it',
    body: 'Drop the endpoint and credentials into your scraper, browser or script. Rotation works immediately; add a session or country when needed.',
  },
]

type Plan = {
  name: string
  price: string
  unit: string
  sub: string
  points: string[]
  featured?: boolean
  cta: string
}

const PLANS: Plan[] = [
  {
    name: 'Pool',
    price: '$3',
    unit: '/ GB',
    sub: 'Rotating residential exits',
    points: [
      'Different live IP per request',
      'Sticky sessions included',
      'SOCKS5 and HTTPS',
      'Balance never expires',
    ],
    featured: true,
    cta: 'Get access',
  },
  {
    name: 'Preferred country',
    price: '$4',
    unit: '/ GB',
    sub: 'Location first, never fails',
    points: [
      'Everything in Pool',
      'Ask for a country per request',
      'Falls back automatically',
      'Best for steady scraping',
    ],
    cta: 'Get access',
  },
  {
    name: 'Country-locked',
    price: '$6',
    unit: '/ GB',
    sub: 'Guaranteed geography',
    points: [
      'Everything in Preferred',
      'Strict country enforcement',
      'Refused rather than relocated',
      'Subject to live availability',
    ],
    cta: 'Get access',
  },
  {
    name: 'Dedicated exit',
    price: '$29',
    unit: '/ month',
    sub: 'One reserved IP',
    points: [
      'Exclusive single exit',
      'Stable for long sessions',
      'Traffic billed separately',
      'Availability by request',
    ],
    cta: 'Ask about it',
  },
]

const FAQ = [
  {
    q: 'What exactly am I buying?',
    a: 'Gigabytes of traffic that leave the internet through residential connections instead of data-centre IPs. You get an endpoint and credentials; your requests exit through a real home connection somewhere in the pool.',
  },
  {
    q: 'How do I get access?',
    a: 'Message us on Telegram. We size the account, you top up, and you receive a single-use code. Paste it into the bot and your endpoint and credentials are issued immediately.',
  },
  {
    q: 'Do you offer a free trial?',
    a: 'No. The minimum purchase is $20, which is several gigabytes at our rates — enough to run a real test against real targets, and it costs what a trial would cost to serve. Unused balance stays on your account.',
  },
  {
    q: 'Preferred or locked country — what is the difference?',
    a: 'Preferred asks for a country and quietly falls back to another exit if that country is momentarily empty, so a request is never wasted. Locked enforces the country strictly: if no exit is available there, the connection is refused rather than relocated. Most workloads are fine with preferred.',
  },
  {
    q: 'What happens when my balance runs out?',
    a: 'Connections stop — refused, with an explicit payment-required response on HTTPS. Your account and usage history stay intact, and access resumes within seconds of a top-up.',
  },
  {
    q: 'Which countries do you have?',
    a: 'Coverage depends on which exits are online at that moment, because these are real home connections that come and go. Ask for the current list before you buy if one country is essential.',
  },
]

/* ------------------------------------------------------------------ *
 * Page
 * ------------------------------------------------------------------ */

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  const pipelineRef = useRef<HTMLDivElement>(null)
  const nodeStackRef = useRef<HTMLDivElement>(null)
  const nodeXRef = useRef<HTMLDivElement>(null)
  const nodeShieldRef = useRef<HTMLDivElement>(null)
  const beamGlowRef = useRef<SVGPathElement>(null)
  const beamCoreRef = useRef<SVGPathElement>(null)
  const gradientRef = useRef<SVGLinearGradientElement>(null)
  const splashRef = useRef<HTMLDivElement>(null)

  /* ---------------- mobile nav ---------------- */
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  /* ---------------- beam animation ---------------- */
  useEffect(() => {
    const pipeline = pipelineRef.current
    const nodeStack = nodeStackRef.current
    const nodeX = nodeXRef.current
    const nodeShield = nodeShieldRef.current
    const beamGlow = beamGlowRef.current
    const beamCore = beamCoreRef.current
    const gradient = gradientRef.current
    const splash = splashRef.current

    if (
      !pipeline ||
      !nodeStack ||
      !nodeX ||
      !nodeShield ||
      !beamGlow ||
      !beamCore ||
      !gradient ||
      !splash
    ) {
      return
    }

    let raf = 0
    let phase: Phase = 'p1'
    let lastStateChange = performance.now()
    let percentage = 0

    const buildPath = () => {
      const pRect = pipeline.getBoundingClientRect()
      const sRect = nodeStack.getBoundingClientRect()
      const xRect = nodeX.getBoundingClientRect()
      const shRect = nodeShield.getBoundingClientRect()

      const startX = sRect.left + sRect.width / 2 - pRect.left
      const startY = sRect.top + sRect.height / 2 - pRect.top
      const midX = xRect.left + xRect.width / 2 - pRect.left
      const midY = xRect.top + xRect.height / 2 - pRect.top
      const endX = shRect.left + shRect.width / 2 - pRect.left
      const endY = shRect.top + shRect.height / 2 - pRect.top

      const d = `M ${startX},${startY} L ${midX},${midY} L ${endX},${endY}`
      beamGlow.setAttribute('d', d)
      beamCore.setAttribute('d', d)
    }

    /* Hide during the splash, then hand opacity back to the stylesheet so the
       glow path keeps its 0.6 and the core path sits at 1. */
    const setBeamHidden = (hidden: boolean) => {
      for (const path of [beamGlow, beamCore]) {
        if (hidden) path.style.opacity = '0'
        else path.style.removeProperty('opacity')
      }
    }

    const loop = (now: number) => {
      const elapsed = now - lastStateChange

      if (phase === 'p1') {
        const t = Math.min(elapsed / PHASE_MS.p1, 1)
        percentage = t * 0.5

        if (percentage < 0.4) nodeStack.classList.add('active')
        else nodeStack.classList.remove('active')

        if (elapsed >= PHASE_MS.p1) {
          phase = 'splash'
          lastStateChange = now
          nodeStack.classList.remove('active')
          setBeamHidden(true)
          splash.classList.add('animate')
        }
      } else if (phase === 'splash') {
        if (elapsed >= PHASE_MS.splash) {
          phase = 'p2'
          lastStateChange = now
          splash.classList.remove('animate')
          setBeamHidden(false)
        }
      } else if (phase === 'p2') {
        const t = Math.min(elapsed / PHASE_MS.p2, 1)
        percentage = 0.5 + t * 0.5

        if (percentage > 0.6) nodeShield.classList.add('active')
        else nodeShield.classList.remove('active')

        if (elapsed >= PHASE_MS.p2) {
          phase = 'idle'
          lastStateChange = now
          nodeShield.classList.remove('active')
        }
      } else {
        if (elapsed >= PHASE_MS.idle) {
          phase = 'p1'
          lastStateChange = now
        }
      }

      const center = percentage * CSS_PCT
      gradient.setAttribute('x1', center - GRADIENT_HALF_WIDTH + '%')
      gradient.setAttribute('x2', center + GRADIENT_HALF_WIDTH + '%')
      gradient.setAttribute('y1', '0%')
      gradient.setAttribute('y2', '0%')

      raf = requestAnimationFrame(loop)
    }

    buildPath()
    window.addEventListener('resize', buildPath)
    raf = requestAnimationFrame(loop)

    return () => {
      window.removeEventListener('resize', buildPath)
      cancelAnimationFrame(raf)
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav>
        <span className="nav-logo">Meridian</span>

        <div className={`nav-menu${menuOpen ? ' active' : ''}`}>
          <ul className="nav-links">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.href} onClick={closeMenu}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav-actions">
            <a href="#faq" className="btn-login" onClick={closeMenu}>
              FAQ
            </a>
            <a href={TELEGRAM} className="btn-signup" onClick={closeMenu}>
              {TELEGRAM_LABEL}
            </a>
          </div>
        </div>

        <button
          type="button"
          className={`menu-toggle${menuOpen ? ' active' : ''}`}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </nav>

      {/* ---------------- HERO ---------------- */}
      <section className="hero-card">
        <div className="hero-grid" />

        <div className="icon-pipeline" ref={pipelineRef}>
          <svg className="beam-svg" aria-hidden="true">
            <defs>
              <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* the ref here is required: the beam gradient is moved by the
                  animation loop, and the effect bails out without it */}
              <linearGradient
                ref={gradientRef}
                id="beam-gradient"
                gradientUnits="userSpaceOnUse"
              >
                <stop offset="0%" stopColor="#b04090" stopOpacity="0" />
                <stop offset="20%" stopColor="#b04090" stopOpacity="0.8" />
                <stop offset="50%" stopColor="#fff" stopOpacity="1" />
                <stop offset="80%" stopColor="#c8a0e0" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#c8a0e0" stopOpacity="0" />
              </linearGradient>
            </defs>

            <path
              ref={beamGlowRef}
              className="beam-glow"
              stroke="url(#beam-gradient)"
              strokeWidth="2"
              filter="url(#glow)"
            />
            <path
              ref={beamCoreRef}
              className="beam-core"
              stroke="url(#beam-gradient)"
              strokeWidth="0.8"
            />
          </svg>

          {/* network */}
          <div className="icon-node node-light-right" id="node-stack" ref={nodeStackRef}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="9" />
              <path d="M3 12h18" />
              <ellipse cx="12" cy="12" rx="4" ry="9" />
            </svg>
          </div>

          <div className="pipeline-line" />

          <div className="node-center-wrap">
            <div className="splash" ref={splashRef} />
            <div className="icon-node-center" id="node-x" ref={nodeXRef}>
              <BrandMark />
            </div>
          </div>

          <div className="pipeline-line right" />

          {/* privacy */}
          <div className="icon-node node-light-left" id="node-shield" ref={nodeShieldRef}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <polyline points="9 12 11 14 15 10" />
            </svg>
          </div>
        </div>

        <div className="hero-content">
          <h1 className="hero-heading">
            Residential IPs
            <strong>without the noise</strong>
          </h1>
          <p className="hero-sub">
            Rotating home connections across multiple countries, sticky sessions
            <br />
            when a job needs one IP, billed per gigabyte.
          </p>
          <a href={TELEGRAM} className="btn-cta">
            {TELEGRAM_LABEL}
          </a>
        </div>
      </section>

      {/* ---------------- TOOLING ROW ---------------- */}
      <div className="brands">
        {TOOLING.map((tool) => (
          <div className="brand-item" key={tool.name}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              {tool.icon}
            </svg>
            {tool.name}
          </div>
        ))}
      </div>

      {/* ---------------- NETWORK ---------------- */}
      <section className="section" id="network">
        <div className="panel">
          <div className="section-head">
            <h2 className="section-heading">
              Built for people who
              <strong>move real volume</strong>
            </h2>
            <p className="section-sub">
              Everything a scraping, SEO or automation workload needs — and nothing it does not.
            </p>
          </div>

          <div className="tiles">
            {FEATURES.map((feature) => (
              <article className="tile" key={feature.title}>
                <div className="tile-icon">
                  <svg viewBox="0 0 24 24" aria-hidden="true">{feature.icon}</svg>
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- HOW IT WORKS ---------------- */}
      <section className="section" id="how">
        <div className="panel">
          <div className="section-head">
            <h2 className="section-heading">
              Three steps,
              <strong>a couple of minutes</strong>
            </h2>
            <p className="section-sub">
              No installers, no dashboards to learn, no onboarding calls.
            </p>
          </div>

          <div className="steps">
            {STEPS.map((step, index) => (
              <article className="step" key={step.title}>
                <span className="step-num">{String(index + 1).padStart(2, '0')}</span>
                <h3>{step.title}</h3>
                <p>{step.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- PRICING ---------------- */}
      <section className="section" id="pricing">
        <div className="panel">
          <div className="section-head">
            <h2 className="section-heading">
              Priced per gigabyte,
              <strong>nothing else</strong>
            </h2>
            <p className="section-sub">
              Prepaid balances never expire. Move up or down a tier whenever your workload changes.
            </p>
          </div>

          <div className="plans">
            {PLANS.map((plan) => (
              <article className={`plan${plan.featured ? ' featured' : ''}`} key={plan.name}>
                {plan.featured && <span className="plan-tag">Most popular</span>}
                <h3>{plan.name}</h3>
                <div className="plan-price">
                  {plan.price}
                  <span>{plan.unit}</span>
                </div>
                <p className="plan-sub">{plan.sub}</p>
                <ul>
                  {plan.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <a href={TELEGRAM} className={`btn-plan${plan.featured ? ' solid' : ''}`}>
                  {plan.cta}
                </a>
              </article>
            ))}
          </div>

          <p className="plans-note">
            Minimum purchase $20 · 50 GB or more $2.50/GB · balances never expire
          </p>
        </div>
      </section>

      {/* ---------------- FAQ ---------------- */}
      <section className="section" id="faq">
        <div className="panel">
          <div className="section-head">
            <h2 className="section-heading">
              Questions we get
              <strong>asked first</strong>
            </h2>
          </div>

          <div className="faq">
            {FAQ.map((item, index) => (
              <details key={item.q} open={index === 0}>
                <summary>{item.q}</summary>
                <p>{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- CTA ---------------- */}
      <section className="hero-card compact">
        <div className="hero-grid" />
        <div className="hero-content">
          <h2 className="hero-heading">
            Ready
            <strong>when you are</strong>
          </h2>
          <p className="hero-sub">
            Tell us what you are running and how much traffic you expect.
            <br />
            You can be pulling through a residential exit within minutes.
          </p>
          <a href={TELEGRAM} className="btn-cta">
            {TELEGRAM_LABEL}
          </a>
        </div>
      </section>

      {/* ---------------- FOOTER ---------------- */}
      <footer className="site-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="nav-logo">Meridian</span>
            <p>
              Residential proxy network. Rotating home exits, country targeting,
              sticky sessions, billed per gigabyte.
            </p>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <h4>Service</h4>
              <a href="#network">Network</a>
              <a href="#pricing">Pricing</a>
              <a href="#how">How it works</a>
              <a href="#faq">FAQ</a>
            </div>
            <div className="footer-col">
              <h4>Policies</h4>
              <a href="policies.html#terms">Terms of service</a>
              <a href="policies.html#privacy">Privacy</a>
              <a href="policies.html#refunds">Refunds</a>
              <a href="policies.html#aup">Acceptable use</a>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <a href={TELEGRAM}>Telegram</a>
              <a href="#faq">Support FAQ</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Meridian. All rights reserved.</span>
          <span>Access is prepaid and subject to our acceptable use policy.</span>
        </div>
      </footer>
    </>
  )
}
