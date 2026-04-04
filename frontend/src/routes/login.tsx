import Logo from '#/components/Logo'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardFooter } from '#/components/ui/card'
import { Field, FieldLabel, FieldDescription } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CircleAlert } from 'lucide-react'
import { useState, type ChangeEvent } from 'react'

export const Route = createFileRoute('/login')({
  component: Login,
});

type ValidationResult = { isValid: true } | { isValid: false, error: string };

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// TODO: Pick constants to separate file
const validateLogin = (login: string): ValidationResult => {
  if (login.length === 0) {
    return {
      isValid: false,
      error: 'Login field is required.'
    }
  }
  return {
    isValid: true,
  };
}

const validatePassword = (password: string): ValidationResult => {
  if (password.length === 0) {
    return {
      isValid: false,
      error: 'Password field is required.'
    }
  }
  return {
    isValid: true,
  };
}

function Login() {
  const navigate = useNavigate();

  const [areCredentialsInvalid, setAreCredentialsInvalid] = useState(false);

  const [login, setLogin] = useState("")
  const [loginError, setLoginError] = useState("");

  const [password, setPassword] = useState("")
  const [passwordError, setPasswordError] = useState("");

  const [isRequestProcessing, setIsRequestProcessing] = useState(false);

  const handleLogin = async () => {
    const loginValidationResult = validateLogin(login);
    const passwordValidationResult = validatePassword(password);
    setLoginError(loginValidationResult.isValid ? "" : loginValidationResult.error);
    setPasswordError(passwordValidationResult.isValid ? "" : passwordValidationResult.error);

    if (!loginValidationResult.isValid || !passwordValidationResult.isValid) {
      return;
    }

    setIsRequestProcessing(true);
    const loginResponse = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: login,
        password
      }),
      credentials: 'include',
    });

    if (loginResponse.ok) {
      navigate({ to: '/dashboard' });
    }
    else {
      setAreCredentialsInvalid(true);
    }

    setIsRequestProcessing(false);
  }

  const handleLoginInput = (event: ChangeEvent<HTMLInputElement>) => {
    setLogin(event.target.value);
  };

  const handlePasswordInput = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

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
            {areCredentialsInvalid &&
              <div className='bg-destructive-secondary h-12 my-2 border-2 border-destructive-primary flex items-center justify-center text-destructive-primary'>
                <CircleAlert className='mr-2' />
                <p>Invalid credentials. Please check your email and password.</p>
              </div>}
            <Field className='mb-4' data-invalid={loginError.length > 0}>
              <FieldLabel htmlFor='email' className='font-bold'>EMAIL</FieldLabel>
              <Input id='email' type='text' placeholder='name@example.com' onChange={handleLoginInput} />
              {loginError && <FieldDescription>{loginError}</FieldDescription>}
            </Field>
            <Field data-invalid={passwordError.length > 0}>
              <FieldLabel htmlFor='password' className='font-bold'>PASSWORD</FieldLabel>
              <Input id='password' type='password' placeholder='*********' onChange={handlePasswordInput} />
              {passwordError && <FieldDescription>{passwordError}</FieldDescription>}
            </Field>
          </CardContent>

          <Button className='h-12 mt-8 mx-4' onClick={handleLogin} disabled={isRequestProcessing}>SIGN IN TO DASHBOARD</Button>
          <CardFooter className='flex-col'>
            <h3 className="font-light text-sm mb-2 text-secondary">Haven't signed up yet?</h3>
            <Button className='w-full h-12 bg-secondary'>REGISTER</Button>
          </CardFooter>
        </Card>
      </div>
      <h4 className='text-sm text-center mt-4 text-secondary font-light'>Need help logging in? <span className='text-tertiary'>Click here</span></h4>
    </main >
  )
}
