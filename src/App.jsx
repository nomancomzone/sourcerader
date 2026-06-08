import { useState } from 'react'
import './App.css'

const PLATFORMS = [
  { id: 'aliexpress', name: 'AliExpress', color: '#D85A30', bg: '#FAECE7' },
  { id: 'dhgate',     name: 'DHgate',     color: '#185FA5', bg: '#E6F1FB' },
  { id: 'etsy',       name: 'Etsy',       color: '#F56400', bg: '#FEF0E7' },
  { id: 'banggood',   name: 'Banggood',   color: '#CC0000', bg: '#FDEAEA' },
]

const DUMMY = [
  { id:'aliexpress', price:6.49, shipping:'12–20 days', shippingDays:16, rating:4.8, reviews:12430, aiScore:82, reliability:78, value:95, quality:72, pros:'Free shipping', cons:'Long delivery' },
  { id:'dhgate',     price:5.20, shipping:'15–25 days', shippingDays:20, rating:4.6, reviews:8870,  aiScore:74, reliability:70, value:98, quality:65, pros:'Lowest price',  cons:'Slow response' },
  { id:'etsy',       price:24.00,shipping:'5–10 days',  shippingDays:7,  rating:4.9, reviews:340,   aiScore:91, reliability:95, value:48, quality:96, pros:'Premium quality',cons:'Higher price' },
  { id:'banggood',   price:7.80, shipping:'10–18 days', shippingDays:14, rating:4.7, reviews:5210,  aiScore:79, reliability:80, value:88, quality:76, pros:'Good reviews',   cons:'Average brand' },
]

const METRICS = [
  { key: 'aiScore',     label: 'AI Score' },
  { key: 'reliability', label: 'Reliability' },
  { key: 'value',       label: 'Value' },
  { key: 'quality',     label: 'Quality' },
]

function barColor(v) {
  if (v >= 85) return '#1D9E75'
  if (v >= 65) return '#BA7517'
  return '#D85A30'
}

export default function App() {
  const [query, setQuery] = useState('')
  const [active, setActive] = useState(new Set(['aliexpress','dhgate','etsy','banggood']))
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)
  const [imgFile, setImgFile] = useState(null)

  function togglePlatform(id) {
    setActive(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleSearch() {
    if (!query && !imgFile) return
    setLoading(true)
    setTimeout(() => {
      const data = DUMMY.filter(d => active.has(d.id))
      setResults({ query: query || 'product', data })
      setLoading(false)
    }, 1400)
  }

  function handleImg(e) {
    const file = e.target.files[0]
    if (file) setImgFile(file)
  }

  const activePlatforms = PLATFORMS.filter(p => active.has(p.id))
  const gridCols = `160px ${activePlatforms.map(() => '1fr').join(' ')}`

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#1D9E75', display: 'inline-block' }}></span>
          <span style={{ fontSize: 22, fontWeight: 600 }}>SourceRadar</span>
        </div>
        <div style={{ fontSize: 13, color: '#888' }}>Compare suppliers across platforms — find the best deal instantly</div>
      </div>

      {/* Search Box */}
      <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: '16px', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="Search any product... e.g. wireless earbuds"
            style={{ flex: 1, border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px', fontSize: 15, outline: 'none' }}
          />
          <label style={{ border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 14px', fontSize: 13, cursor: 'pointer', background: '#f9fafb', display: 'flex', alignItems: 'center', gap: 6 }}>
            📷 Photo
            <input type="file" accept="image/*" onChange={handleImg} style={{ display: 'none' }} />
          </label>
          <button
            onClick={handleSearch}
            style={{ background: '#1D9E75', color: '#fff', border: 'none', borderRadius: 8, padding: '8px 20px', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
          >
            Search
          </button>
        </div>

        {imgFile && (
          <div style={{ marginTop: 8, fontSize: 13, color: '#888' }}>
            📷 {imgFile.name}
            <span onClick={() => setImgFile(null)} style={{ marginLeft: 8, cursor: 'pointer' }}>✕</span>
          </div>
        )}

        {/* Platform chips */}
        <div style={{ marginTop: 12, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
          <span style={{ fontSize: 12, color: '#888' }}>Sources:</span>
          {PLATFORMS.map(p => (
            <div
              key={p.id}
              onClick={() => togglePlatform(p.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                border: `1px solid ${active.has(p.id) ? p.color : '#e5e7eb'}`,
                borderRadius: 20, padding: '4px 12px', fontSize: 13, cursor: 'pointer',
                background: active.has(p.id) ? p.bg : '#fff',
                color: active.has(p.id) ? p.color : '#666',
                fontWeight: active.has(p.id) ? 600 : 400,
              }}
            >
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: p.color, opacity: active.has(p.id) ? 1 : 0.3, display: 'inline-block' }}></span>
              {p.name}
            </div>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: 32, color: '#888' }}>
          🔍 Searching across platforms...
        </div>
      )}

      {/* Empty state */}
      {!loading && !results && (
        <div style={{ textAlign: 'center', padding: 48, color: '#aaa' }}>
          🔍 Search a product to compare suppliers
        </div>
      )}

      {/* Results */}
      {!loading && results && (
        <>
          <div style={{ fontSize: 14, color: '#888', marginBottom: 12 }}>
            Comparing <strong style={{ color: '#111' }}>{results.data.length} platforms</strong> for "<strong style={{ color: '#111' }}>{results.query}</strong>"
          </div>

          <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>

            {/* Header row */}
            <div style={{ display: 'grid', gridTemplateColumns: gridCols, background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <div style={{ padding: '12px 16px', fontSize: 12, color: '#888', borderRight: '1px solid #e5e7eb' }}>Platform</div>
              {results.data.map(d => {
                const p = PLATFORMS.find(x => x.id === d.id)
                return (
                  <div key={d.id} style={{ padding: '12px 16px', borderRight: '1px solid #e5e7eb' }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: p.color, marginBottom: 4 }}>{p.name}</div>
                    <div style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>${d.price.toFixed(2)}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>🚚 {d.shipping}</div>
                    <div style={{ fontSize: 11, color: '#888' }}>⭐ {d.rating} ({d.reviews.toLocaleString()})</div>
                  </div>
                )
              })}
            </div>

            {/* Metric rows */}
            {METRICS.map(m => (
              <div key={m.key} style={{ display: 'grid', gridTemplateColumns: gridCols, borderBottom: '1px solid #e5e7eb' }}>
                <div style={{ padding: '10px 16px', fontSize: 12, color: '#888', borderRight: '1px solid #e5e7eb', display: 'flex', alignItems: 'center' }}>{m.label}</div>
                {results.data.map(d => {
                  const v = d[m.key]
                  const c = barColor(v)
                  return (
                    <div key={d.id} style={{ padding: '10px 16px', borderRight: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ flex: 1, height: 6, background: '#f0f0f0', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ width: `${v}%`, height: '100%', background: c, borderRadius: 3 }}></div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 600, color: c, width: 32, textAlign: 'right' }}>{v}%</span>
                    </div>
                  )
                })}
              </div>
            ))}

            {/* Pros/Cons */}
            <div style={{ display: 'grid', gridTemplateColumns: gridCols, borderBottom: '1px solid #e5e7eb', background: '#f9fafb' }}>
              <div style={{ padding: '10px 16px', fontSize: 12, color: '#888', borderRight: '1px solid #e5e7eb', display: 'flex', alignItems: 'center' }}>Highlights</div>
              {results.data.map(d => (
                <div key={d.id} style={{ padding: '10px 16px', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: '#E1F5EE', color: '#0F6E56', width: 'fit-content' }}>✓ {d.pros}</span>
                  <span style={{ fontSize: 11, padding: '3px 8px', borderRadius: 20, background: '#FAECE7', color: '#993C1D', width: 'fit-content' }}>⚠ {d.cons}</span>
                </div>
              ))}
            </div>

            {/* Buy buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: gridCols }}>
              <div style={{ padding: '12px 16px', borderRight: '1px solid #e5e7eb' }}></div>
              {results.data.map(d => {
                const p = PLATFORMS.find(x => x.id === d.id)
                return (
                  <div key={d.id} style={{ padding: '12px 16px', borderRight: '1px solid #e5e7eb' }}>
                    <button style={{ width: '100%', background: p.color, color: '#fff', border: 'none', borderRadius: 8, padding: '8px', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>
                      Buy on {p.name} ↗
                    </button>
                  </div>
                )
              })}
            </div>

          </div>
        </>
      )}
    </div>
  )
}