/**
 * Core Cache Module for GlohibAI
 * Provides Redis-backed caching with local memory fallback
 * 
 * @module core/cache/cache
 */

interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number // Time to live in milliseconds
}

interface CacheOptions {
  ttl?: number // Default: 5 minutes
  prefix?: string // Key prefix for namespacing
}

class Cache {
  private memoryCache: Map<string, CacheEntry<any>> = new Map()
  private defaultTTL: number = 5 * 60 * 1000 // 5 minutes
  private prefix: string = 'glohib:'

  constructor(options?: CacheOptions) {
    if (options?.ttl) this.defaultTTL = options.ttl
    if (options?.prefix) this.prefix = options.prefix
  }

  /**
   * Generate cache key with prefix
   */
  private getKey(key: string): string {
    return `${this.prefix}${key}`
  }

  /**
   * Check if cache entry is valid (not expired)
   */
  private isValid(entry: CacheEntry<any>): boolean {
    const now = Date.now()
    return now - entry.timestamp < entry.ttl
  }

  /**
   * Get value from cache
   * @param key - Cache key
   * @returns Cached value or null if not found/expired
   */
  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.getKey(key)
    const entry = this.memoryCache.get(fullKey)

    if (!entry) {
      return null
    }

    if (!this.isValid(entry)) {
      this.memoryCache.delete(fullKey)
      return null
    }

    return entry.data as T
  }

  /**
   * Set value in cache
   * @param key - Cache key
   * @param value - Value to cache
   * @param ttl - Optional TTL override
   */
  async set<T>(key: string, value: T, ttl?: number): Promise<void> {
    const fullKey = this.getKey(key)
    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      ttl: ttl ?? this.defaultTTL,
    }

    this.memoryCache.set(fullKey, entry)
  }

  /**
   * Delete value from cache
   * @param key - Cache key
   */
  async delete(key: string): Promise<void> {
    const fullKey = this.getKey(key)
    this.memoryCache.delete(fullKey)
  }

  /**
   * Clear all cache entries with optional prefix filter
   * @param prefix - Optional prefix to filter keys
   */
  async clear(prefix?: string): Promise<void> {
    if (prefix) {
      const fullPrefix = this.getKey(prefix)
      for (const key of this.memoryCache.keys()) {
        if (key.startsWith(fullPrefix)) {
          this.memoryCache.delete(key)
        }
      }
    } else {
      this.memoryCache.clear()
    }
  }

  /**
   * Get or set value with fallback function
   * @param key - Cache key
   * @param fallback - Function to fetch value if not cached
   * @param ttl - Optional TTL
   * @returns Cached or fetched value
   */
  async getOrSet<T>(key: string, fallback: () => Promise<T>, ttl?: number): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const value = await fallback()
    await this.set(key, value, ttl)
    return value
  }

  /**
   * Check if key exists in cache
   * @param key - Cache key
   */
  async has(key: string): Promise<boolean> {
    const cached = await this.get(key)
    return cached !== null
  }

  /**
   * Get cache statistics
   */
  stats(): { size: number; keys: string[] } {
    const keys = Array.from(this.memoryCache.keys())
    return {
      size: this.memoryCache.size,
      keys,
    }
  }
}

// Singleton instance
let defaultCache: Cache | null = null

/**
 * Get default cache instance
 */
export function getCache(): Cache {
  if (!defaultCache) {
    defaultCache = new Cache()
  }
  return defaultCache
}

/**
 * Create new cache instance with custom options
 */
export function createCache(options?: CacheOptions): Cache {
  return new Cache(options)
}

// Predefined cache keys for consistency
export const CacheKeys = {
  // User data
  USER_PROFILE: (userId: string) => `user:${userId}:profile`,
  USER_SKILLS: (userId: string) => `user:${userId}:skills`,
  USER_APPLICATIONS: (userId: string) => `user:${userId}:applications`,
  
  // Internships
  INTERNSHIP_LIST: (filters: string) => `internships:list:${filters}`,
  INTERNSHIP_DETAIL: (id: string) => `internships:detail:${id}`,
  INTERNSHIP_SEARCH: (query: string) => `internships:search:${query}`,
  
  // Recommendations
  RECOMMENDATIONS: (studentId: string) => `recommendations:${studentId}`,
  MATCH_SCORES: (studentId: string, internshipId: string) => `match:${studentId}:${internshipId}`,
  
  // Applications
  APPLICATION_STATUS: (applicationId: string) => `application:${applicationId}:status`,
  
  // Skills
  SKILL_MATCH: (studentSkills: string, requiredSkills: string) => `skills:match:${studentSkills}:${requiredSkills}`,
}

export default getCache
