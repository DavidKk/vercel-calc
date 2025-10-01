import Meta, { generate } from '@/components/Meta'

const { generateMetadata, metaProps } = generate({
  title: 'Calculator',
  description: 'A lightweight Next.js calculator app. This project currently includes the Price Calculator for product management, unit price calculations, and price history.',
})

export { generateMetadata }

export default function Home() {
  return (
    <div className="flex flex-col items-center p-10 pt-20 max-w-4xl mx-auto text-center">
      <Meta {...metaProps} />
    </div>
  )
}
