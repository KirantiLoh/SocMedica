import Image from 'next/image'

const OfflinePage = () => {
  return (
    <main className="flex flex-col items-center justify-center w-full h-screen ">
        <Image src="/sad.png" alt="From designs.ai" width={400} height={400} />
        <h1 className="font-medium text-lg">You&apos;re currently offline</h1>
    </main>
  )
}

export default OfflinePage