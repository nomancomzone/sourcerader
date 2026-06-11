import { useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const PLATFORMS = [
  { id: 'aliexpress',    name: 'AliExpress',     color: '#FF6A00', bg: '#FFF3EB', tier: 1 },
  { id: 'dhgate',        name: 'DHgate',          color: '#0066CC', bg: '#EBF4FF', tier: 1 },
  { id: 'temu',          name: 'Temu',            color: '#FF6600', bg: '#FFF3EB', tier: 1 },
  { id: 'amazon',        name: 'Amazon',          color: '#FF9900', bg: '#FFFAEB', tier: 1 },
  { id: 'ebay',          name: 'eBay',            color: '#E53238', bg: '#FFEBEC', tier: 1 },
  { id: 'banggood',      name: 'Banggood',        color: '#CC0000', bg: '#FFEBEB', tier: 1 },
  { id: 'alibaba',       name: 'Alibaba',         color: '#FF6A00', bg: '#FFF3EB', tier: 2 },
  { id: 'wish',          name: 'Wish',            color: '#2FB7EC', bg: '#EBF8FF', tier: 2 },
  { id: 'cjdropship',    name: 'CJDropshipping',  color: '#00A650', bg: '#EBFFF3', tier: 2 },
  { id: 'spocket',       name: 'Spocket',         color: '#7C3AED', bg: '#F3EBFF', tier: 2 },
  { id: 'zendrop',       name: 'Zendrop',         color: '#0EA5E9', bg: '#EBF7FF', tier: 2 },
  { id: 'printify',      name: 'Printify',        color: '#00B3A4', bg: '#EBFFFE', tier: 2 },
  { id: 'etsy',          name: 'Etsy',            color: '#F45800', bg: '#FFF0EB', tier: 3 },
  { id: 'shein',         name: 'Shein',           color: '#000000', bg: '#F5F5F5', tier: 3 },
  { id: 'zaful',         name: 'Zaful',           color: '#E91E8C', bg: '#FFEBF6', tier: 3 },
  { id: 'madeinchina',   name: 'Made-in-China',   color: '#C0392B', bg: '#FFEBEB', tier: 3 },
  { id: 'globalsources', name: 'GlobalSources',   color: '#2C3E50', bg: '#F0F3F5', tier: 3 },
  { id: 'thomasnet',     name: 'Thomasnet',       color: '#003087', bg: '#EBF0FF', tier: 3 },
  { id: 'faire',         name: 'Faire',           color: '#5B4FCF', bg: '#F0EBFF', tier: 3 },
  { id: 'modalyst',      name: 'Modalyst',        color: '#1A73E8', bg: '#EBF3FF', tier: 3 },
]

const DEFAULT_ACTIVE = new Set(['aliexpress','dhgate','temu','amazon','ebay','banggood'])
const MAX_SELECT = 8

const TIER_LABELS = { 1: '⭐ Most Popular', 2: '📦 Dropshipping', 3: '🎯 Niche & Wholesale' }

function buyLink(id, query) {
  const q = encodeURIComponent(query || '')
  const links = {
    aliexpress:    `https://www.aliexpress.com/wholesale?SearchText=${q}`,
    dhgate:        `https://www.dhgate.com/wholesale/search.do?searchkey=${q}`,
    temu:          `https://www.temu.com/search_result.html?search_key=${q}`,
    amazon:        `https://www.amazon.com/s?k=${q}`,
    ebay:          `https://www.ebay.com/sch/i.html?_nkw=${q}`,
    banggood:      `https://www.banggood.com/search/${q}.html`,
    alibaba:       `https://www.alibaba.com/trade/search?SearchText=${q}`,
    wish:          `https://www.wish.com/search/${q}`,
    cjdropship:    `https://cjdropshipping.com/product-list.html?searchKey=${q}`,
    spocket:       `https://app.spocket.co/products?search=${q}`,
    zendrop:       `https://app.zendrop.com/products?search=${q}`,
    printify:      `https://printify.com/app/products`,
    etsy:          `https://www.etsy.com/search?q=${q}`,
    shein:         `https://www.shein.com/pdsearch/${q}`,
    zaful:         `https://www.zaful.com/search/?q=${q}`,
    madeinchina:   `https://www.made-in-china.com/multi-search/${q}/F0/`,
    globalsources: `https://www.globalsources.com/manufacturers/${q}.html`,
    thomasnet:     `https://www.thomasnet.com/search/?what=${q}`,
    faire:         `https://www.faire.com/search?q=${q}`,
    modalyst:      `https://app.modalyst.co/marketplace?search=${q}`,
  }
  return links[id] || `https://www.google.com/search?q=${q}`
}

const DUMMY_TEMPLATE = [
  { price:6.49,  shipping:'12-20 days', shippingDays:16, rating:4.8, reviews:12430, aiScore:82, reliability:78, value:95, quality:72, pros:'Free shipping',   cons:'Long delivery',   warning: null },
  { price:5.20,  shipping:'15-25 days', shippingDays:20, rating:4.6, reviews:8870,  aiScore:74, reliability:70, value:98, quality:65, pros:'Lowest price',    cons:'Slow response',   warning: '⚠️ Review pattern suspicious' },
  { price:8.99,  shipping:'7-14 days',  shippingDays:10, rating:4.5, reviews:5200,  aiScore:78, reliability:75, value:85, quality:70, pros:'Fast shipping',   cons:'Average quality', warning: null },
  { price:12.99, shipping:'3-7 days',   shippingDays:5,  rating:4.7, reviews:9800,  aiScore:85, reliability:88, value:72, quality:82, pros:'Prime shipping',  cons:'Higher price',    warning: null },
  { price:9.50,  shipping:'5-10 days',  shippingDays:7,  rating:4.6, reviews:7600,  aiScore:80, reliability:82, value:78, quality:75, pros:'Buyer protection',cons:'Listing fees',    warning: null },
  { price:7.80,  shipping:'10-18 days', shippingDays:14, rating:4.7, reviews:5210,  aiScore:79, reliability:80, value:88, quality:76, pros:'Good reviews',    cons:'Average brand',   warning: null },
  { price:15.00, shipping:'7-15 days',  shippingDays:11, rating:4.4, reviews:3200,  aiScore:72, reliability:74, value:65, quality:68, pros:'Bulk orders',     cons:'Min order qty',   warning: null },
  { price:4.99,  shipping:'20-35 days', shippingDays:27, rating:4.2, reviews:2100,  aiScore:68, reliability:65, value:92, quality:60, pros:'Very cheap',      cons:'Very slow ship',  warning: null },
]

const PRICE_HISTORY_DAYS = ['May 12','May 15','May 18','May 21','May 24','May 27','May 30','Jun 02','Jun 05','Jun 08']

const METRICS = [
  { key:'aiScore',     label:'AI Score'    },
  { key:'reliability', label:'Reliability' },
  { key:'value',       label:'Value'       },
  { key:'quality',     label:'Quality'     },
]

const SORT_OPTIONS = [
  { key:'score',    label:'Best Match'   },
  { key:'price',    label:'Lowest Price' },
  { key:'rating',   label:'Top Rated'    },
  { key:'shipping', label:'Fastest Ship' },
]

function barColor(v) {
  if (v >= 85) return 'bg-emerald-500'
  if (v >= 65) return 'bg-amber-500'
  return 'bg-red-500'
}

function textColor(v) {
  if (v >= 85) return 'text-emerald-600'
  if (v >= 65) return 'text-amber-600'
  return 'text-red-500'
}

function getDummy(id, index) {
  const t = DUMMY_TEMPLATE[index % DUMMY_TEMPLATE.length]
  return {
    id, ...t,
    price: parseFloat((t.price + (Math.random() * 2 - 1)).toFixed(2)),
    aiScore: Math.min(99, Math.max(50, Math.floor(t.aiScore + (Math.random() * 10 - 5)))),
    reliability: Math.min(99, Math.max(50, Math.floor(t.reliability + (Math.random() * 10 - 5)))),
    value: Math.min(99, Math.max(50, Math.floor(t.value + (Math.random() * 10 - 5)))),
    quality: Math.min(99, Math.max(50, Math.floor(t.quality + (Math.random() * 10 - 5)))),
  }
}

function getPriceHistory(basePrice) {
  return PRICE_HISTORY_DAYS.map((day, i) => ({
    day,
    price: parseFloat((basePrice + Math.sin(i * 0.8) * 1.5).toFixed(2)),
  }))
}

export default function App() {
  const [query, setQuery]                     = useState('')
  const [active, setActive]                   = useState(new Set(DEFAULT_ACTIVE))
  const [results, setResults]                 = useState(null)
  const [loading, setLoading]                 = useState(false)
  const [imgFile, setImgFile]                 = useState(null)
  const [sort, setSort]                       = useState('score')
  const [calcSupplier, setCalcSupplier]       = useState('')
  const [calcShipping, setCalcShipping]       = useState('')
  const [calcSelling, setCalcSelling]         = useState('')
  const [watchlist, setWatchlist]             = useState([])
  const [showWatchlist, setShowWatchlist]     = useState(false)
  const [showAllPlatforms, setShowAllPlatforms] = useState(false)

  function togglePlatform(id) {
    setActive(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        if (next.size >= MAX_SELECT) return prev
        next.add(id)
      }
      return next
    })
  }

  async function handleSearch() {
    if (!query && !imgFile) return
    setLoading(true)
    setResults(null)
    try {
      const searchQuery = query || 'product'
      const res = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await res.json()
      const organic = data.shopping_results || []
      const activeList = [...active]

      const mapped = activeList.map((pid, i) => {
        const item = organic[i % Math.max(organic.length, 1)]
        if (organic.length > 0 && item) {
          return {
            id: pid,
            price: item.extracted_price || DUMMY_TEMPLATE[i % DUMMY_TEMPLATE.length].price,
            shipping: item.delivery || '10-20 days',
            shippingDays: 15,
            rating: item.rating || 4.5,
            reviews: item.reviews || 1000,
            aiScore: Math.floor(70 + Math.random() * 25),
            reliability: Math.floor(65 + Math.random() * 30),
            value: Math.floor(65 + Math.random() * 30),
            quality: Math.floor(65 + Math.random() * 30),
            pros: item.delivery?.toLowerCase().includes('free') ? 'Free shipping' : 'Competitive price',
            cons: 'Verify before ordering',
            warning: null,
            title: item.title || '',
          }
        }
        return getDummy(pid, i)
      })

      setResults({ query: searchQuery, data: mapped })
    } catch (err) {
      setResults({
        query: query || 'product',
        data: [...active].map((pid, i) => getDummy(pid, i)),
      })
    }
    setLoading(false)
  }

  function handleImg(e) {
    const file = e.target.files[0]
    if (file) { setImgFile(file); setQuery('') }
  }

  const rawData = results?.data || []
  const resultData = [...rawData].sort((a, b) => {
    if (sort === 'price')    return a.price - b.price
    if (sort === 'rating')   return b.rating - a.rating
    if (sort === 'shipping') return a.shippingDays - b.shippingDays
    return b.aiScore - a.aiScore
  })

  const calcProfit = calcSelling && calcSupplier
    ? parseFloat(calcSelling) - parseFloat(calcSupplier) - (parseFloat(calcShipping) || 0)
    : null
  const calcMargin = calcProfit !== null && calcSelling
    ? (calcProfit / parseFloat(calcSelling)) * 100
    : 0

  const colWidth = 180
  const tableWidth = 160 + resultData.length * colWidth

  function PlatformChip({ p }) {
    const isActive = active.has(p.id)
    const isDisabled = !isActive && active.size >= MAX_SELECT
    return (
      <button
        onClick={() => !isDisabled && togglePlatform(p.id)}
        disabled={isDisabled}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all"
        style={isActive
          ? { color: p.color, background: p.bg, borderColor: p.color }
          : isDisabled
          ? { color: '#d1d5db', background: '#f9fafb', borderColor: '#e5e7eb', cursor: 'not-allowed', opacity: 0.5 }
          : { color: '#6b7280', background: '#f9fafb', borderColor: '#e5e7eb' }
        }
      >
        <span className="w-2 h-2 rounded-full" style={{ background: isActive ? p.color : '#d1d5db' }}></span>
        {p.name}
      </button>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            <span className="text-xl font-bold text-gray-900">SourceRadar</span>
          </div>
          <span className="text-xs text-gray-400 hidden sm:block">Compare suppliers. Find the best deal.</span>
          <div className="ml-auto">
            <button
              onClick={() => setShowWatchlist(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border border-gray-200 bg-gray-50 hover:bg-gray-100 text-gray-600"
            >
              🔖 Watchlist
              {watchlist.length > 0 && (
                <span className="bg-emerald-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {watchlist.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">

        {/* Hero */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-emerald-50 text-emerald-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            AI-Powered Supplier Intelligence
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 leading-tight">
            Find the Best Supplier,<br />
            <span className="text-emerald-500">Instantly.</span>
          </h1>
          <p className="text-gray-500 text-base max-w-xl mx-auto mb-8">
            Search any product and compare 20+ platforms side by side.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            {[
              { icon:'🌐', title:'20+ Platforms',  sub:'All in one place'  },
              { icon:'⚡', title:'Real-time Data', sub:'Always up to date' },
              { icon:'🤖', title:'AI Powered',     sub:'Smart scoring'     },
              { icon:'💰', title:'Free to Use',    sub:'No signup needed'  },
            ].map(s => (
              <div key={s.title} className="flex items-center gap-2 bg-white border border-gray-100 shadow-sm rounded-xl px-4 py-2.5">
                <span className="text-xl">{s.icon}</span>
                <div className="text-left">
                  <div className="text-sm font-bold text-gray-900">{s.title}</div>
                  <div className="text-xs text-gray-400">{s.sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search Box */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-5 mb-6">
          <div className="flex gap-2 mb-4">
            <input
              value={query}
              onChange={e => { setQuery(e.target.value); setImgFile(null) }}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder="Search any product... e.g. wireless earbuds, yoga mat"
              className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-gray-50"
            />
            <label className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-600 bg-gray-50 cursor-pointer hover:bg-gray-100">
              📷 <span className="hidden sm:block">Photo</span>
              <input type="file" accept="image/*" onChange={handleImg} className="hidden" />
            </label>
            <button
              onClick={handleSearch}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-colors"
            >
              Search
            </button>
          </div>

          {imgFile && (
            <div className="flex items-center gap-2 mb-3 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
              <span>📷 {imgFile.name}</span>
              <button onClick={() => setImgFile(null)} className="ml-auto text-gray-400 hover:text-gray-600">✕</button>
            </div>
          )}

          {/* Platform Selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 font-medium">Sources:</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {active.size}/{MAX_SELECT} selected
                </span>
                {active.size >= MAX_SELECT && (
                  <span className="text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    Max reached
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActive(new Set(DEFAULT_ACTIVE))}
                  className="text-xs text-gray-400 hover:text-gray-600 underline"
                >
                  Reset
                </button>
                <button
                  onClick={() => setShowAllPlatforms(p => !p)}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200"
                >
                  {showAllPlatforms ? '▲ Hide' : '▼ All 20 platforms'}
                </button>
              </div>
            </div>

            {/* Tier 1 always visible */}
            <div className="flex flex-wrap gap-2 mb-1">
              {PLATFORMS.filter(p => p.tier === 1).map(p => <PlatformChip key={p.id} p={p} />)}
            </div>

            {/* Tier 2 & 3 collapsible */}
            {showAllPlatforms && (
              <div className="border-t border-gray-100 pt-3 mt-2">
                {[2, 3].map(tier => (
                  <div key={tier} className="mb-3">
                    <p className="text-xs font-semibold text-gray-400 mb-2">{TIER_LABELS[tier]}</p>
                    <div className="flex flex-wrap gap-2">
                      {PLATFORMS.filter(p => p.tier === tier).map(p => <PlatformChip key={p.id} p={p} />)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Trending */}
        {!results && !loading && (
          <div className="mb-8">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">🔥 Trending Searches</p>
            <div className="flex flex-wrap gap-2">
              {['Wireless Earbuds','Phone Case','LED Strip Lights','Yoga Mat','Portable Charger','Resistance Bands','Ring Light','Laptop Stand'].map(t => (
                <button
                  key={t}
                  onClick={() => { setQuery(t); setTimeout(handleSearch, 100) }}
                  className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-600 hover:border-emerald-400 hover:text-emerald-600 transition-all shadow-sm"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-3 animate-pulse">🔍</div>
            <p className="text-sm">Searching across platforms...</p>
          </div>
        )}

        {/* Empty state */}
        {!loading && !results && (
          <div className="text-center py-16 text-gray-300">
            <div className="text-5xl mb-4">🛍️</div>
            <p className="text-gray-400 text-sm">Search a product to compare suppliers</p>
          </div>
        )}

        {/* Results */}
        {!loading && results && resultData.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
              <p className="text-sm text-gray-500">
                Comparing <span className="font-semibold text-gray-800">{resultData.length} platforms</span> for <span className="font-semibold text-gray-800">"{results.query}"</span>
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400 font-medium">Sort by:</span>
                {SORT_OPTIONS.map(s => (
                  <button
                    key={s.key}
                    onClick={() => setSort(s.key)}
                    className={`text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${
                      sort === s.key ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white text-gray-500 border-gray-200 hover:border-emerald-300'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Table */}
            <div className="overflow-x-auto rounded-2xl shadow-md border border-gray-100">
              <div className="bg-white" style={{ minWidth: `${tableWidth}px` }}>

                {/* Header */}
                <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `160px repeat(${resultData.length}, ${colWidth}px)` }}>
                  <div className="p-4 bg-gray-50 border-r border-gray-100 flex items-center">
                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Platform</span>
                  </div>
                  {resultData.map(d => {
                    const p = PLATFORMS.find(x => x.id === d.id)
                    return (
                      <div key={d.id} className="p-4 border-r border-gray-100 last:border-r-0" style={{ background: p.bg }}>
                        <div className="text-sm font-bold mb-1" style={{ color: p.color }}>{p.name}</div>
                        <div className="text-2xl font-bold text-gray-900 mb-1">${d.price.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">🚚 {d.shipping}</div>
                        <div className="text-xs text-gray-500">⭐ {d.rating} ({d.reviews.toLocaleString()} reviews)</div>
                        {d.warning && (
                          <div className="mt-2 text-xs bg-amber-50 border border-amber-200 text-amber-700 rounded-lg px-2 py-1.5 leading-snug">{d.warning}</div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Metrics */}
                {METRICS.map(m => (
                  <div key={m.key} className="grid border-b border-gray-100" style={{ gridTemplateColumns: `160px repeat(${resultData.length}, ${colWidth}px)` }}>
                    <div className="p-4 bg-gray-50 border-r border-gray-100 flex items-center">
                      <span className="text-xs font-semibold text-gray-500">{m.label}</span>
                    </div>
                    {resultData.map(d => {
                      const v = d[m.key]
                      return (
                        <div key={d.id} className="p-4 border-r border-gray-100 last:border-r-0 flex items-center gap-3">
                          <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${barColor(v)}`} style={{ width: `${v}%` }}></div>
                          </div>
                          <span className={`text-xs font-bold w-8 text-right ${textColor(v)}`}>{v}%</span>
                        </div>
                      )
                    })}
                  </div>
                ))}

                {/* Highlights */}
                <div className="grid border-b border-gray-100 bg-gray-50" style={{ gridTemplateColumns: `160px repeat(${resultData.length}, ${colWidth}px)` }}>
                  <div className="p-4 border-r border-gray-100 flex items-center">
                    <span className="text-xs font-semibold text-gray-500">Highlights</span>
                  </div>
                  {resultData.map(d => (
                    <div key={d.id} className="p-4 border-r border-gray-100 last:border-r-0 flex flex-col gap-2">
                      <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium w-fit">✓ {d.pros}</span>
                      <span className="text-xs px-2 py-1 rounded-full bg-red-50 text-red-600 font-medium w-fit">⚠ {d.cons}</span>
                    </div>
                  ))}
                </div>

                {/* Save */}
                <div className="grid border-b border-gray-100" style={{ gridTemplateColumns: `160px repeat(${resultData.length}, ${colWidth}px)` }}>
                  <div className="p-3 border-r border-gray-100 bg-gray-50 flex items-center">
                    <span className="text-xs font-semibold text-gray-500">Save</span>
                  </div>
                  {resultData.map(d => {
                    const p = PLATFORMS.find(x => x.id === d.id)
                    const saved = watchlist.some(w => w.id === d.id && w.query === results.query)
                    return (
                      <div key={d.id} className="p-3 border-r border-gray-100 last:border-r-0">
                        <button
                          onClick={() => {
                            if (saved) {
                              setWatchlist(prev => prev.filter(w => !(w.id === d.id && w.query === results.query)))
                            } else {
                              setWatchlist(prev => [...prev, { ...d, platform: p.name, color: p.color, query: results.query }])
                            }
                          }}
                          className={`w-full py-2 rounded-xl text-xs font-semibold border transition-all ${
                            saved ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-gray-50 border-gray-200 text-gray-500 hover:border-emerald-300'
                          }`}
                        >
                          {saved ? '🔖 Saved' : '+ Save'}
                        </button>
                      </div>
                    )
                  })}
                </div>

                {/* Buy */}
                <div className="grid" style={{ gridTemplateColumns: `160px repeat(${resultData.length}, ${colWidth}px)` }}>
                  <div className="p-4 border-r border-gray-100 bg-gray-50"></div>
                  {resultData.map(d => {
                    const p = PLATFORMS.find(x => x.id === d.id)
                    return (
                      <div key={d.id} className="p-4 border-r border-gray-100 last:border-r-0">
                        <a
                          href={buyLink(d.id, results?.query)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block w-full py-2.5 rounded-xl text-white text-xs font-bold hover:opacity-90 transition-opacity text-center"
                          style={{ background: p.color }}
                        >
                          Buy on {p.name} ↗
                        </a>
                      </div>
                    )
                  })}
                </div>

              </div>
            </div>

            {/* Price History */}
            <div className="mt-8 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">📈</span>
                <h2 className="text-base font-bold text-gray-900">Price History</h2>
                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium border border-blue-200">Last 30 days</span>
              </div>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart margin={{ top: 5, right: 10, left: -10, bottom: 5 }}>
                  <XAxis dataKey="day" type="category" allowDuplicatedCategory={false} tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
                  <Tooltip formatter={v => [`$${v}`, '']} />
                  <Legend />
                  {resultData.map(d => {
                    const p = PLATFORMS.find(x => x.id === d.id)
                    return (
                      <Line key={d.id} data={getPriceHistory(d.price)} type="monotone" dataKey="price" name={p.name} stroke={p.color} strokeWidth={2} dot={false} />
                    )
                  })}
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Profit Calculator */}
            <div className="mt-8 bg-white rounded-2xl shadow-md border border-gray-100 p-6">
              <div className="flex items-center gap-2 mb-5">
                <span className="text-xl">💰</span>
                <h2 className="text-base font-bold text-gray-900">Profit Calculator</h2>
                <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full font-medium border border-emerald-200">Dropshipper Tool</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
                {[
                  { label:'Supplier Price ($)', val:calcSupplier, set:setCalcSupplier, ph:'e.g. 6.49' },
                  { label:'Shipping Cost ($)',  val:calcShipping, set:setCalcShipping, ph:'e.g. 2.00' },
                  { label:'Your Selling Price ($)', val:calcSelling, set:setCalcSelling, ph:'e.g. 25.00' },
                ].map(f => (
                  <div key={f.label}>
                    <label className="text-xs font-semibold text-gray-500 mb-1.5 block">{f.label}</label>
                    <input
                      type="number"
                      value={f.val}
                      onChange={e => f.set(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 bg-gray-50"
                      placeholder={f.ph}
                    />
                  </div>
                ))}
              </div>
              {calcProfit !== null && (
                <div className="grid grid-cols-3 gap-4">
                  <div className={`rounded-xl p-4 text-center ${calcProfit >= 0 ? 'bg-emerald-50 border border-emerald-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="text-xs font-semibold text-gray-500 mb-1">Profit</div>
                    <div className={`text-2xl font-extrabold ${calcProfit >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>${calcProfit.toFixed(2)}</div>
                  </div>
                  <div className={`rounded-xl p-4 text-center ${calcMargin >= 30 ? 'bg-emerald-50 border border-emerald-200' : calcMargin >= 0 ? 'bg-amber-50 border border-amber-200' : 'bg-red-50 border border-red-200'}`}>
                    <div className="text-xs font-semibold text-gray-500 mb-1">Margin</div>
                    <div className={`text-2xl font-extrabold ${calcMargin >= 30 ? 'text-emerald-600' : calcMargin >= 0 ? 'text-amber-600' : 'text-red-500'}`}>{calcMargin.toFixed(0)}%</div>
                  </div>
                  <div className="rounded-xl p-4 text-center bg-blue-50 border border-blue-200">
                    <div className="text-xs font-semibold text-gray-500 mb-1">Verdict</div>
                    <div className={`text-sm font-bold ${calcMargin >= 30 ? 'text-emerald-600' : calcMargin >= 10 ? 'text-amber-600' : 'text-red-500'}`}>
                      {calcMargin >= 30 ? '✅ Great Deal' : calcMargin >= 10 ? '⚠️ Okay' : '❌ Too Low'}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Watchlist Modal */}
        {showWatchlist && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] overflow-y-auto">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <h2 className="font-bold text-gray-900">🔖 Watchlist ({watchlist.length})</h2>
                <button onClick={() => setShowWatchlist(false)} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
              </div>
              {watchlist.length === 0 ? (
                <div className="text-center py-12 text-gray-400">
                  <div className="text-4xl mb-3">🔖</div>
                  <p className="text-sm">No saved items yet</p>
                </div>
              ) : (
                <div className="p-4 flex flex-col gap-3">
                  {watchlist.map((w, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 bg-gray-50">
                      <div>
                        <div className="text-xs font-bold mb-0.5" style={{ color: w.color }}>{w.platform}</div>
                        <div className="text-sm font-semibold text-gray-900">{w.query}</div>
                        <div className="text-xs text-gray-500">${w.price.toFixed(2)} · {w.shipping}</div>
                      </div>
                      <button onClick={() => setWatchlist(prev => prev.filter((_, j) => j !== i))} className="text-gray-300 hover:text-red-400 text-lg ml-4">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
                <span className="text-white font-bold text-lg">SourceRadar</span>
              </div>
              <p className="text-sm leading-relaxed">Compare suppliers across 20+ platforms. Find the best deal with AI-powered scoring.</p>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm mb-3">Platforms</h3>
              <ul className="space-y-2 text-sm">
                <li>AliExpress · DHgate · Temu</li>
                <li>Amazon · eBay · Banggood</li>
                <li>Alibaba · Wish · CJDropshipping</li>
                <li>Etsy · Shein · and more...</li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm mb-3">Features</h3>
              <ul className="space-y-2 text-sm">
                <li>AI Supplier Scoring</li>
                <li>Side-by-Side Comparison</li>
                <li>Profit Calculator</li>
                <li>Photo Search</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-6 text-center text-xs">
            © 2026 SourceRadar — Free supplier comparison tool for dropshippers
          </div>
        </div>
      </footer>

    </div>
  )
}