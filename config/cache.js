class CacheManager {
  constructor() {
    this.cache = {};
  }

  get(key) {
    // Vô hiệu hóa cache trong môi trường serverless (như Vercel) để tránh bất đồng bộ giữa các instance
    return null;
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
