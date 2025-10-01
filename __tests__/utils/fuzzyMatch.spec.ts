import { fuzzyMatch } from '../../utils/fuzzyMatch'

describe('fuzzyMatch', () => {
  describe('Chinese text matching', () => {
    it('should match Chinese text with exact characters', () => {
      const result = fuzzyMatch('水果 (推荐价格: ¥15.00 每KG)', '水果')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should match Chinese text with characters in different order', () => {
      const result = fuzzyMatch('水果 (推荐价格: ¥15.00 每KG)', '果水')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should not match Chinese text with unrelated characters', () => {
      const result = fuzzyMatch('水果 (推荐价格: ¥15.00 每KG)', '苹果')
      expect(result.matched).toBe(false)
      expect(result.score).toBe(0)
    })
  })

  describe('English text matching', () => {
    it('should match English text with exact word (case insensitive)', () => {
      const result = fuzzyMatch('Apple iPhone 12 Pro', 'iphone')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should match English text with partial word', () => {
      const result = fuzzyMatch('Apple iPhone 12 Pro', 'phone')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should not match English text with scrambled characters', () => {
      const result = fuzzyMatch('Apple iPhone 12 Pro', 'ephon')
      expect(result.matched).toBe(false)
      expect(result.score).toBe(0)
    })

    it('should not match English text with unrelated words', () => {
      const result = fuzzyMatch('Apple iPhone 12 Pro', 'abc')
      expect(result.matched).toBe(false)
      expect(result.score).toBe(0)
    })
  })

  describe('Edge cases', () => {
    it('should return matched=true with score=1 for empty pattern', () => {
      const result = fuzzyMatch('some text', '')
      expect(result.matched).toBe(true)
      expect(result.score).toBe(1)
    })

    it('should return matched=false with score=0 for empty text', () => {
      const result = fuzzyMatch('', 'pattern')
      expect(result.matched).toBe(false)
      expect(result.score).toBe(0)
    })

    it('should return matched=true with score=1 for both empty text and pattern', () => {
      const result = fuzzyMatch('', '')
      expect(result.matched).toBe(true)
      expect(result.score).toBe(1)
    })
  })

  describe('Mixed Chinese and English text', () => {
    it('should handle mixed text with Chinese pattern', () => {
      const result = fuzzyMatch('Apple苹果 iPhone手机', '苹果')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should handle mixed text with English pattern', () => {
      const result = fuzzyMatch('Apple苹果 iPhone手机', 'iphone')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })
  })
})
