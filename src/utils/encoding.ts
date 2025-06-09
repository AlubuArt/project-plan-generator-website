import pako from 'pako';

// New short URL functions
export async function createShortShareableUrl(
  markdown: string,
  baseUrl: string = ''
): Promise<string> {
  try {
    const response = await fetch('/api/plans/store', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content: markdown }),
    });

    if (!response.ok) {
      throw new Error('Failed to store plan');
    }

    const { id } = await response.json();
    return `${baseUrl}#/plan/${id}`;
  } catch (error) {
    console.error('Error creating short URL:', error);
    // Fallback to old encoding method
    return createShareableUrl(markdown, baseUrl);
  }
}

export async function getProjectPlanFromShortUrl(): Promise<string | null> {
  if (typeof window === 'undefined') return null;

  const hash = window.location.hash;

  // Check for new short URL format
  const shortMatch = hash.match(/#\/plan\/(.+)/);
  if (shortMatch) {
    try {
      const response = await fetch(`/api/plans/${shortMatch[1]}`);
      if (!response.ok) {
        throw new Error('Plan not found');
      }
      const { content } = await response.json();
      return content;
    } catch (error) {
      console.error('Error fetching plan from short URL:', error);
      return null;
    }
  }

  // Fallback to old URL format
  return getProjectPlanFromUrl();
}

// Original encoding functions (kept for backwards compatibility and CLI)
export function encodeProjectPlan(markdown: string): string {
  try {
    // Convert string to Uint8Array
    const utf8Bytes = new TextEncoder().encode(markdown);

    // Compress using gzip
    const compressed = pako.gzip(utf8Bytes);

    // Convert to base64 - fix for TypeScript compilation
    const base64 = btoa(
      String.fromCharCode.apply(null, Array.from(compressed))
    );

    // Make URL-safe
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  } catch (error) {
    console.error('Error encoding project plan:', error);
    throw new Error('Failed to encode project plan');
  }
}

export function decodeProjectPlan(encoded: string): string {
  try {
    // Convert back from URL-safe base64
    let base64 = encoded.replace(/-/g, '+').replace(/_/g, '/');

    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }

    // Convert from base64
    const binaryString = atob(base64);
    const compressed = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      compressed[i] = binaryString.charCodeAt(i);
    }

    // Decompress using gzip
    const decompressed = pako.ungzip(compressed);

    // Convert back to string
    return new TextDecoder().decode(decompressed);
  } catch (error) {
    console.error('Error decoding project plan:', error);
    throw new Error('Failed to decode project plan');
  }
}

export function createShareableUrl(
  markdown: string,
  baseUrl: string = ''
): string {
  const encoded = encodeProjectPlan(markdown);
  return `${baseUrl}#/p=${encoded}`;
}

export function getProjectPlanFromUrl(): string | null {
  if (typeof window === 'undefined') return null;

  const hash = window.location.hash;
  const match = hash.match(/#\/p=(.+)/);

  if (!match) return null;

  try {
    return decodeProjectPlan(match[1]);
  } catch (error) {
    console.error('Error parsing project plan from URL:', error);
    return null;
  }
}

// Helper function for the API endpoint
export function decompressAndDecode(encodedData: string): string | null {
  try {
    return decodeProjectPlan(encodedData);
  } catch (error) {
    console.error('Failed to decompress and decode:', error);
    return null;
  }
}
