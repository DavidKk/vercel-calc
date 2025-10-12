import { fuzzyMatch } from '@/utils/fuzzyMatch'

describe('fuzzyMatch', () => {
  it('should match exact strings', () => {
    const result = fuzzyMatch('Cola', 'Cola')
    expect(result.matched).toBe(true)
    expect(result.score).toBeGreaterThan(0)
  })

  it('should match partial strings', () => {
    const result = fuzzyMatch('Coca Cola', 'Cola')
    expect(result.matched).toBe(true)
    expect(result.score).toBeGreaterThan(0)
  })

  it('should not match unrelated strings', () => {
    const result = fuzzyMatch('Coca Cola', 'Orange')
    expect(result.matched).toBe(false)
  })

  it('should handle empty pattern', () => {
    const result = fuzzyMatch('Coca Cola', '')
    expect(result.matched).toBe(true)
    expect(result.score).toBe(1)
  })

  it('should handle empty text', () => {
    const result = fuzzyMatch('', 'Cola')
    expect(result.matched).toBe(false)
    expect(result.score).toBe(0)
  })
})

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

  describe('Japanese text matching', () => {
    it('should match Japanese text with exact characters', () => {
      const result = fuzzyMatch('りんご (価格: ¥150 毎KG)', 'りんご')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should match Japanese text with partial characters', () => {
      const result = fuzzyMatch('りんご (価格: ¥150 毎KG)', 'んご')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should not match Japanese text with unrelated characters', () => {
      const result = fuzzyMatch('りんご (価格: ¥150 毎KG)', 'みかん')
      expect(result.matched).toBe(false)
      expect(result.score).toBe(0)
    })
  })

  describe('Korean text matching', () => {
    it('should match Korean text with exact characters', () => {
      const result = fuzzyMatch('사과 (가격: ₩2000 매KG)', '사과')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should match Korean text with partial characters', () => {
      const result = fuzzyMatch('사과 (가격: ₩2000 매KG)', '과')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should not match Korean text with unrelated characters', () => {
      const result = fuzzyMatch('사과 (가격: ₩2000 매KG)', '바나나')
      expect(result.matched).toBe(false)
      expect(result.score).toBe(0)
    })
  })

  describe('Malaysian text matching', () => {
    it('should match Malaysian text with exact characters', () => {
      const result = fuzzyMatch('Epal (Harga: RM5.00 sekilo)', 'Epal')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should match Malaysian text with partial characters', () => {
      const result = fuzzyMatch('Epal (Harga: RM5.00 sekilo)', 'pal')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should not match Malaysian text with unrelated characters', () => {
      const result = fuzzyMatch('Epal (Harga: RM5.00 sekilo)', 'oren')
      expect(result.matched).toBe(false)
      expect(result.score).toBe(0)
    })
  })

  describe('Indonesian text matching', () => {
    it('should match Indonesian text with exact characters', () => {
      const result = fuzzyMatch('Apel (Harga: Rp15.000 perkilo)', 'Apel')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should match Indonesian text with partial characters', () => {
      const result = fuzzyMatch('Apel (Harga: Rp15.000 perkilo)', 'pel')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should not match Indonesian text with unrelated characters', () => {
      const result = fuzzyMatch('Apel (Harga: Rp15.000 perkilo)', 'jeruk')
      expect(result.matched).toBe(false)
      expect(result.score).toBe(0)
    })
  })

  describe('Thai text matching', () => {
    it('should match Thai text with exact characters', () => {
      const result = fuzzyMatch('แอปเปิ้ล (ราคา: ฿50 ต่อกิโลกรัม)', 'แอปเปิ้ล')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should match Thai text with partial characters', () => {
      const result = fuzzyMatch('แอปเปิ้ล (ราคา: ฿50 ต่อกิโลกรัม)', 'ปเปิ้ล')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should not match Thai text with unrelated characters', () => {
      const result = fuzzyMatch('แอปเปิ้ล (ราคา: ฿50 ต่อกิโลกรัม)', 'ส้ม')
      expect(result.matched).toBe(false)
      expect(result.score).toBe(0)
    })
  })

  describe('Vietnamese text matching', () => {
    it('should match Vietnamese text with exact characters', () => {
      const result = fuzzyMatch('Táo (Giá: 50.000₫ mỗi kg)', 'Táo')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should match Vietnamese text with partial characters', () => {
      const result = fuzzyMatch('Táo (Giá: 50.000₫ mỗi kg)', 'áo')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should not match Vietnamese text with unrelated characters', () => {
      const result = fuzzyMatch('Táo (Giá: 50.000₫ mỗi kg)', 'cam')
      expect(result.matched).toBe(false)
      expect(result.score).toBe(0)
    })
  })

  describe('Portuguese (Brazil) text matching', () => {
    it('should match Portuguese text with exact characters', () => {
      const result = fuzzyMatch('Maçã (Preço: R$10,00 por KG)', 'Maçã')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should match Portuguese text with partial characters', () => {
      const result = fuzzyMatch('Maçã (Preço: R$10,00 por KG)', 'çã')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should not match Portuguese text with unrelated characters', () => {
      const result = fuzzyMatch('Maçã (Preço: R$10,00 por KG)', 'laranja')
      expect(result.matched).toBe(false)
      expect(result.score).toBe(0)
    })
  })

  describe('Russian text matching', () => {
    it('should match Russian text with exact characters', () => {
      const result = fuzzyMatch('Яблоко (Цена: 500₽ за кг)', 'Яблоко')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should match Russian text with partial characters', () => {
      const result = fuzzyMatch('Яблоко (Цена: 500₽ за кг)', 'блоко')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should not match Russian text with unrelated characters', () => {
      const result = fuzzyMatch('Яблоко (Цена: 500₽ за кг)', 'апельсин')
      expect(result.matched).toBe(false)
      expect(result.score).toBe(0)
    })
  })

  describe('Mixed language text matching', () => {
    it('should handle mixed text with Japanese pattern', () => {
      const result = fuzzyMatch('Appleりんご iPhone아이폰', 'りんご')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should handle mixed text with Korean pattern', () => {
      const result = fuzzyMatch('Appleりんご iPhone아이폰', '아이폰')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
    })

    it('should handle mixed text with English pattern', () => {
      const result = fuzzyMatch('Appleりんご iPhone아이폰', 'iphone')
      expect(result.matched).toBe(true)
      expect(result.score).toBeGreaterThan(0)
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
