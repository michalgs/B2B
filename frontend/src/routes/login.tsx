import Logo from '#/components/Logo'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardFooter } from '#/components/ui/card'
import { Field, FieldLabel } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/login')({
  component: Login,
})

function Login() {
  return (
    <main className="page-wrap px-4 py-12 flex flex-col pl-10 md:flex md:flex-col md:items-center">
      <div className='w-full md:w-3/4 lg:w-1/2'>
        <div className='flex flex-col'>
          <Logo />
          <h2 className='mt-4'>Company Access</h2>
          <p className='font-body font-normal text-md text-base/5 text-secondary mt-2'>Enter your credentials to manage your company's negotations.</p>
        </div>
        <Card className='pt-8 mt-8 box-shadow-2xl'>
          <CardContent className='px-4'>
            <FieldLabel htmlFor='email' className='font-bold'>EMAIL</FieldLabel>
            <Field className='mb-4'>
              <Input id='email' type='text' placeholder='name@example.com' />
            </Field>
            <FieldLabel htmlFor='password' className='font-bold'>PASSWORD</FieldLabel>
            <Field>
              <Input id='email' type='text' placeholder='*********' />
            </Field>
          </CardContent>

          <Button className='h-12 mt-8 mx-4'>SIGN IN TO DASHBOARD</Button>
          <CardFooter className='flex-col'>
            <h3 className="font-light text-sm mb-2 text-secondary">Haven't signed up yet?</h3>
            <Button className='w-full h-12 bg-secondary'>REGISTER</Button>
          </CardFooter>
        </Card>
      </div>
      <h4 className='text-sm text-center mt-4 text-secondary font-light'>Need help logging in? <span className='text-tertiary'>Click here</span></h4>
    </main>
  )
}
