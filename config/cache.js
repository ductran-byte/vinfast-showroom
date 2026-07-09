class CacheManager {
  constructor() {
    this.cache = {};
  }

  get(key) {
    const entry = this.cache[key];
    if (!entry) return null;
    
    // Cache expires after 10 minutes (600000ms)
    if (Date.now() - entry.timestamp > 600000) {
      delete this.cache[key];
      return null;
    }
    return entry.data;
  }

  set(key, data) {
    this.cache[key] = {
      data: data,
      timestamp: Date.now()
    };
  }

  delete(key) {
    delete this.cache[key];
  }

  clear() {
    this.cache = {};
  }
}

module.exports = new CacheManager();
