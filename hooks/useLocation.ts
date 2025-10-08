import { useEffect, useState } from 'react'

interface LocationInfo {
  province: {
    chinese: string | null
    english: string | null
  }
  loading: boolean
}

export function useLocation(): LocationInfo {
  const [province, setProvince] = useState<{ chinese: string | null; english: string | null }>({
    chinese: '广东',
    english: 'Guangdong',
  })
  const [loading, setLoading] = useState<boolean>(false)

  // 简化实现，直接返回默认省份"广东"
  useEffect(() => {
    // 不再执行任何异步操作，直接使用默认值
    // 默认省份已设置为"广东"
  }, [])

  return {
    province,
    loading,
  }
}
