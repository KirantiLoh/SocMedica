import type { User } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'

const UserCard = ({
    name,
    image
}: User) => {
  return (
    <Link href={`/${name}`} className="rounded-lg p-3 flex items-center gap-2 transition-colors duration-300 bg-secondary-900 hover:bg-primary">
        <div className="relative w-8 h-8 rounded-full overflow-hidden">
            <Image src={image || ""} alt="" fill />
        </div>
        <h3 className='text-lg'>{name}</h3>
    </Link>
  )
}

export default UserCard