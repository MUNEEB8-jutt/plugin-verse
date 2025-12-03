export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatCurrency(amount: number): string {
  return `${amount} Coins`
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop() || ''
}

export function generateFileName(originalName: string): string {
  const ext = getFileExtension(originalName)
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 15)
  return `${timestamp}-${random}.${ext}`
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => file.type.includes(type))
}

export function validateFileSize(file: File, maxSizeMB: number): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

export function isValidUrl(urlString: string): boolean {
  if (!urlString || urlString.trim() === '') {
    return false
  }

  try {
    const url = new URL(urlString)
    // Only allow http and https protocols
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch (error) {
    return false
  }
}

export function extractDomain(urlString: string): string {
  try {
    const url = new URL(urlString)
    return url.hostname
  } catch (error) {
    return ''
  }
}
