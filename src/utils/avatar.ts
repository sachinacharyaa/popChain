// Generate a unique avatar based on wallet address
export const generateAvatarGradient = (address: string): string => {
  // Generate colors from address hash
  const hash = address.split('').reduce((acc, char, i) => {
    return acc + char.charCodeAt(0) * (i + 1)
  }, 0)

  const colors = [
    '#9945FF', // Solana purple
    '#14F195', // Solana green
    '#00D1FF', // Cyan
    '#FF6B6B', // Coral
    '#FFE66D', // Yellow
    '#4ECDC4', // Teal
    '#FF8C42', // Orange
    '#A855F7', // Purple
    '#EC4899', // Pink
    '#3B82F6', // Blue
  ]

  const color1 = colors[hash % colors.length]
  const color2 = colors[(hash * 7) % colors.length]
  const angle = (hash * 13) % 360

  return `linear-gradient(${angle}deg, ${color1}, ${color2})`
}

// Generate SVG avatar with unique pattern
export const generateAvatarSVG = (address: string): string => {
  const hash = address.split('').reduce((acc, char, i) => {
    return acc + char.charCodeAt(0) * (i + 1)
  }, 0)

  const colors = [
    '#9945FF', '#14F195', '#00D1FF', '#FF6B6B', 
    '#FFE66D', '#4ECDC4', '#FF8C42', '#A855F7'
  ]

  const bgColor = colors[hash % colors.length]
  const fgColor = colors[(hash * 3) % colors.length]
  
  // Generate pattern based on hash
  const patterns: string[] = []
  for (let i = 0; i < 9; i++) {
    const shouldFill = ((hash >> i) & 1) === 1
    if (shouldFill) {
      const x = (i % 3) * 12 + 6
      const y = Math.floor(i / 3) * 12 + 6
      patterns.push(`<circle cx="${x}" cy="${y}" r="5" fill="${fgColor}" opacity="0.8"/>`)
    }
  }

  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <rect width="40" height="40" fill="${bgColor}" rx="8"/>
      ${patterns.join('')}
    </svg>
  `)}`
}

// Generate pixel art style avatar
export const generatePixelAvatar = (address: string): string => {
  const hash = address.split('').reduce((acc, char, i) => {
    return acc + char.charCodeAt(0) * (i + 1)
  }, 0)

  const colors = [
    ['#9945FF', '#14F195'],
    ['#00D1FF', '#FF6B6B'],
    ['#FFE66D', '#4ECDC4'],
    ['#FF8C42', '#A855F7'],
    ['#EC4899', '#3B82F6'],
    ['#10B981', '#F59E0B'],
  ]

  const [color1, color2] = colors[hash % colors.length]
  
  // Generate 5x5 symmetric pattern
  const pixels: string[] = []
  const size = 8
  
  for (let y = 0; y < 5; y++) {
    for (let x = 0; x < 3; x++) {
      const idx = y * 3 + x
      const filled = ((hash >> idx) & 1) === 1
      if (filled) {
        const color = ((hash >> (idx + 15)) & 1) === 1 ? color1 : color2
        // Left side
        pixels.push(`<rect x="${x * size}" y="${y * size}" width="${size}" height="${size}" fill="${color}"/>`)
        // Mirror to right side (except middle column)
        if (x < 2) {
          pixels.push(`<rect x="${(4 - x) * size}" y="${y * size}" width="${size}" height="${size}" fill="${color}"/>`)
        }
      }
    }
  }

  return `data:image/svg+xml,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40">
      <rect width="40" height="40" fill="#1a1a1f" rx="8"/>
      ${pixels.join('')}
    </svg>
  `)}`
}
