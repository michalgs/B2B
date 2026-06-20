import Logo from '#/components/Logo'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardFooter } from '#/components/ui/card'
import { Field, FieldLabel, FieldDescription } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { CircleAlert } from 'lucide-react'
import { getApiBaseUrl } from '#/lib/utils'
import { useState, type ChangeEvent } from 'react'

export const Route = createFileRoute('/register')({
  component: Register,
});

const API_BASE_URL = getApiBaseUrl();

function Register() {
  const navigate = useNavigate();
  
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [companyAddress, setCompanyAddress] = useState("")
  const [nip, setNip] = useState("")
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isRequestProcessing, setIsRequestProcessing] = useState(false);

  const handleRegister = async () => {
    // Basic scaffolding validation
    const newErrors: { [key: string]: string } = {};
    if (!firstName) newErrors.firstName = "First name is required";
    if (!lastName) newErrors.lastName = "Last name is required";
    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    if (!companyName) newErrors.companyName = "Company name is required";
    if (!companyAddress) newErrors.companyAddress = "Company address is required";
    if (!nip) newErrors.nip = "NIP is required";
    else if (!/^\d{10}$/.test(nip)) newErrors.nip = "NIP must be 10 digits";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsRequestProcessing(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          password,
          companyName,
          companyAddress,
          nip
        }),
        credentials: 'include',
      });

      if (response.ok) {
        navigate({ to: '/login' });
      } else {
        const data = await response.json();
        setErrors({ root: data.message || "Registration failed. Please try again." });
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
          <h2 className='mt-4'>Create Account</h2>
          <p className='font-body font-normal text-md text-base/5 text-secondary mt-2'>Join us to start managing your company's negotiations.</p>
        </div>
        <Card className='pt-8 mt-8 box-shadow-2xl'>
          <CardContent className='px-4'>
            {errors.root &&
              <div data-test="register-error" className='bg-destructive-secondary h-12 my-2 border-2 border-destructive-primary flex items-center justify-center text-destructive-primary'>
                <CircleAlert className='mr-2' />
                <p>{errors.root}</p>
              </div>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Field data-invalid={!!errors.firstName}>
                <FieldLabel htmlFor='firstName' className='font-bold'>FIRST NAME</FieldLabel>
                <Input data-test="firstname-input" id='firstName' type='text' placeholder='John' value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                {errors.firstName && <FieldDescription data-test="firstname-error">{errors.firstName}</FieldDescription>}
                </Field>
                <Field data-invalid={!!errors.lastName}>
                <FieldLabel htmlFor='lastName' className='font-bold'>LAST NAME</FieldLabel>
                <Input data-test="lastname-input" id='lastName' type='text' placeholder='Doe' value={lastName} onChange={(e) => setLastName(e.target.value)} />
                {errors.lastName && <FieldDescription data-test="lastname-error">{errors.lastName}</FieldDescription>}
                </Field>
            </div>
            
            <Field className='mb-4' data-invalid={!!errors.email}>
              <FieldLabel htmlFor='email' className='font-bold'>EMAIL</FieldLabel>
              <Input data-test="email-input" id='email' type='text' placeholder='name@example.com' value={email} onChange={(e) => setEmail(e.target.value)} />
              {errors.email && <FieldDescription data-test="email-error">{errors.email}</FieldDescription>}
            </Field>

            <Field className='mb-4' data-invalid={!!errors.companyName}>
              <FieldLabel htmlFor='companyName' className='font-bold'>COMPANY NAME</FieldLabel>
              <Input data-test="company-name-input" id='companyName' type='text' placeholder='Acme Corp' value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
              {errors.companyName && <FieldDescription data-test="company-name-error">{errors.companyName}</FieldDescription>}
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Field data-invalid={!!errors.nip}>
                <FieldLabel htmlFor='nip' className='font-bold'>NIP</FieldLabel>
                <Input data-test="nip-input" id='nip' type='text' placeholder='1234567890' value={nip} onChange={(e) => setNip(e.target.value)} />
                {errors.nip && <FieldDescription data-test="nip-error">{errors.nip}</FieldDescription>}
                </Field>
                <Field data-invalid={!!errors.companyAddress}>
                <FieldLabel htmlFor='companyAddress' className='font-bold'>COMPANY ADDRESS</FieldLabel>
                <Input data-test="company-address-input" id='companyAddress' type='text' placeholder='123 Business St' value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} />
                {errors.companyAddress && <FieldDescription data-test="company-address-error">{errors.companyAddress}</FieldDescription>}
                </Field>
            </div>
            
            <Field data-invalid={!!errors.password}>
              <FieldLabel htmlFor='password' className='font-bold'>PASSWORD</FieldLabel>
              <Input data-test="password-input" id='password' type='password' placeholder='*********' value={password} onChange={(e) => setPassword(e.target.value)} />
              {errors.password && <FieldDescription data-test="password-error">{errors.password}</FieldDescription>}
            </Field>
          </CardContent>

          <Button data-test="register-submit" className='h-12 mt-8 mx-4' onClick={handleRegister} disabled={isRequestProcessing}>CREATE ACCOUNT</Button>
          
          <CardFooter className='flex-col'>
            <h3 className="font-light text-sm mb-2 text-secondary">Already have an account?</h3>
            <Link to="/login" className="w-full">
                <Button data-test="login-link" className='w-full h-12 bg-secondary'>SIGN IN</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      <h4 className='text-sm text-center mt-4 text-secondary font-light'>Need help? <span className='text-tertiary'>Contact support</span></h4>
    </main>
  )
}
