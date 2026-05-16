import { useNavigate } from '@tanstack/react-router'
import Logo from './Logo'

interface HeaderProps {
  user?: {
    firstName?: string
    lastName?: string
    email?: string
  }
}

function Header({ user }: HeaderProps) {
  const navigate = useNavigate()

  const initials = user
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase()
    : 'U'

  return (
    <header className='flex items-center justify-between mb-8 pb-4 border-b border-stone-200/50'>
      <Logo />

      {user && (
        <button
          onClick={() => navigate({ to: '/company-profile' })}
          className='flex items-center gap-2 p-2 hover:bg-stone-100 rounded-md transition-colors group'
          title={`${user.firstName} ${user.lastName} - Click to edit profile`}
        >
          <div className='w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm'>
            {initials}
          </div>
          <div className='hidden md:flex flex-col items-start'>
            <span className='text-xs font-bold text-foreground'>{user.firstName} {user.lastName}</span>
            <span className='text-xs text-secondary'>{user.email}</span>
          </div>
        </button>
      )}
    </header>
  )
}

export default Header


