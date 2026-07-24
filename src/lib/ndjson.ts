export type NdjsonEvent = Record<string, unknown>

/** Streams newline-delimited JSON from a fetch response as an async generator. */
export async function* streamNDJSON(input: string, init: RequestInit): AsyncGenerator<NdjsonEvent> {
  const res = await fetch(input, init)
  if (!res.body) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed with status ${res.status}`)
  }
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed with status ${res.status}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })

    let newlineIndex: number
    while ((newlineIndex = buffer.indexOf('\n')) >= 0) {
      const line = buffer.slice(0, newlineIndex).trim()
      buffer = buffer.slice(newlineIndex + 1)
      if (line) yield JSON.parse(line)
    }
  }

  const rest = buffer.trim()
  if (rest) yield JSON.parse(rest)
}
