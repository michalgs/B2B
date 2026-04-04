import Logo from '#/components/Logo'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardFooter } from '#/components/ui/card'
import { Field, FieldLabel, FieldDescription } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { CircleAlert } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'

export const Route = createFileRoute('/login')({
  component: Login,
});

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isRequestProcessing, setIsRequestProcessing] = useState(false);

  const handleLogin = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsRequestProcessing(true);
    try {
      const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password
        }),
        credentials: 'include',
      });

      if (loginResponse.ok) {
        navigate({ to: '/dashboard' });
      } else {
        setErrors({ root: "Invalid credentials. Please check your email and password." });
      }
    } catch (error) {
      setErrors({ root: "An error occurred. Please try again later." });
    } finally {
      setIsRequestProcessing(false);
    }
  }

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
            {errors.root &&
              <div className='bg-destructive-secondary h-12 my-2 border-2 border-destructive-primary flex items-center justify-center text-destructive-primary'>
                <CircleAlert className='mr-2' />
                <p>{errors.root}</p>
              </div>}
            <Field className='mb-4' data-invalid={!!errors.email}>
              <FieldLabel htmlFor='email' className='font-bold'>EMAIL</FieldLabel>
              <Input id='email' type='text' placeholder='name@example.com' value={email} onChange={(e) => setEmail(e.target.value)} />
              {errors.email && <FieldDescription>{errors.email}</FieldDescription>}
            </Field>
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor='password' className='font-bold'>PASSWORD</FieldLabel>
              <Input id='password' type='password' placeholder='*********' value={password} onChange={(e) => setPassword(e.target.value)} />
              {errors.password && <FieldDescription>{errors.password}</FieldDescription>}
            </Field>
          </CardContent>

          <Button className='h-12 mt-8 mx-4' onClick={handleLogin} disabled={isRequestProcessing}>SIGN IN TO DASHBOARD</Button>
          <CardFooter className='flex-col'>
            <h3 className="font-light text-sm mb-2 text-secondary">Haven't signed up yet?</h3>
            <Link to="/register" className="w-full">
              <Button className='w-full h-12 bg-secondary'>REGISTER</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      <h4 className='text-sm text-center mt-4 text-secondary font-light'>Need help logging in? <span className='text-tertiary'>Click here</span></h4>
    </main >
  )
}
