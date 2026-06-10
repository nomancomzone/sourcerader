export default async (req, context) => {
  const url = new URL(req.url)
  const query = url.searchParams.get('q')
  const engine = url.searchParams.get('engine') || 'aliexpress'

  if (!query) {
    return new Response(JSON.stringify({ error: 'No query' }), { status: 400 })
  }

  const apiKey = process.env.SERPAPI_KEY

  const engineMap = {
    aliexpress: 'aliexpress',
    etsy: 'etsy',
    walmart: 'walmart',
  }

  const serpEngine = engineMap[engine] || 'aliexpress'

  const serpUrl = `https://serpapi.com/search.json?engine=${serpEngine}&q=${encodeURIComponent(query)}&api_key=${apiKey}`

  try {
    const res = await fetch(serpUrl)
    const data = await res.json()
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}

export const config = {
  path: '/api/search'
}