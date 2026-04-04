import { createFileRoute, redirect } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardFooter } from '#/components/ui/card'
import Logo from '#/components/Logo'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/me`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw redirect({
          to: '/login',
        })
      }
      const user = await response.json();
      return {
        user,
      }
    } catch (error) {
      if (error instanceof Error && 'to' in error) {
        throw error;
      }
      throw redirect({
        to: '/login',
      })
    }
  },
  component: Dashboard,
})

function Dashboard() {
  const { user } = Route.useRouteContext();

  return (
    <main className="page-wrap px-4 py-12 flex flex-col items-center">
      <div className='w-full md:w-3/4 lg:w-1/2'>
        <div className='flex flex-col mb-8'>
          <Logo />
          <h2 className='mt-4 text-3xl font-bold'>Welcome, {user.firstName} {user.lastName}!</h2>
          <p className='font-body font-normal text-md text-base/5 text-secondary mt-2'>
            You are logged in as <span className="font-semibold">{user.email}</span>
          </p>
        </div>

        <Card className='pt-8 mt-8 box-shadow-2xl'>
          <CardContent className='px-4'>
            <p className="text-lg">This is your secure dashboard. Only authenticated users can see this page.</p>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
