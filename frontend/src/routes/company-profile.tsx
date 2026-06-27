import Header from '#/components/Header'
import { Button } from '#/components/ui/button'
import { Card, CardContent } from '#/components/ui/card'
import { Field, FieldLabel, FieldDescription } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { CircleAlert } from 'lucide-react'
import { useState, useEffect } from 'react'

export const Route = createFileRoute('/company-profile')({
  component: CompanyProfile,
});

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function CompanyProfile() {
  const navigate = useNavigate();

  // User state
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [user, setUser] = useState<any>(null)

  // Form state
  const [companyName, setCompanyName] = useState("")
  const [address, setAddress] = useState("")
  const [description, setDescription] = useState("")
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  // Fetch current company data
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setUser(data)
          if (data.company) {
            setCompanyName(data.company.name || "")
            setAddress(data.company.address || "")
            setDescription(data.company.description || "")
            setLogoUrl(data.company.logoUrl || null)
          }
        } else if (response.status === 401) {
          navigate({ to: '/login' });
        }
      } catch (error) {
        setErrors({ root: "Failed to load company data" })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompanyData();
  }, [navigate])

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    if (url) {
      setLogoUrl(url)
      setErrors({ ...errors, logo: "" })
    }
  }

  const handleClearLogo = () => {
    setLogoUrl(null)
  }

  const handleSave = async () => {
    const newErrors: { [key: string]: string } = {}

    if (!companyName) newErrors.companyName = "Company name is required"
    if (!address) newErrors.address = "Address is required"

    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    setIsSaving(true)
    setSuccessMessage("")

    try {
      const payload = {
        name: companyName,
        address: address,
        description: description,
        logoUrl: logoUrl || undefined
      }

      const response = await fetch(`${API_BASE_URL}/api/v1/companies/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
        credentials: 'include',
      })

      if (response.ok) {
        setSuccessMessage("Company profile updated successfully!")
        setTimeout(() => setSuccessMessage(""), 5000)
      } else {
        const data = await response.json()
        setErrors({ root: data.message || "Failed to update company profile" })
      }
    } catch (error) {
      setErrors({ root: "An error occurred. Please try again later." })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <main className="page-wrap px-4 py-12 flex flex-col items-center">
        <p className="text-secondary">Loading company profile...</p>
      </main>
    )
  }

  return (
    <main className="page-wrap px-4 py-12 flex flex-col">
      <Header user={user} />

      <div className='mb-8'>
        <h1 className='text-4xl font-bold'>Company Profile</h1>
        <p className='font-body font-normal text-base text-secondary mt-2'>
          Manage your company's identity, registration data, and brand settings.
        </p>
      </div>

      {/* Dossier Header Section */}
      <Card className='mb-12 bg-stone-50 border-stone-200/50'>
        <CardContent className='px-8 py-8'>
          <div className='flex items-center gap-3 mb-4'>
            <span className='text-xs uppercase tracking-widest font-bold text-tertiary'>Configuration</span>
            <div className='h-px flex-1 bg-stone-200/30'></div>
          </div>
          <h2 className='text-3xl font-bold tracking-tight text-foreground mb-2'>Organization Profile</h2>
          <p className='text-secondary text-sm leading-relaxed max-w-2xl'>
            Manage your company's corporate identity, registration data, and global brand settings in the Dossier system.
          </p>
        </CardContent>
      </Card>

      <form className='space-y-12'>
        {/* Error Messages */}
        {errors.root &&
          <div className='bg-destructive-secondary border-l-4 border-destructive-primary p-4 flex items-start gap-3'>
            <CircleAlert className='w-5 h-5 text-destructive-primary shrink-0 mt-0.5' />
            <div>
              <p className='text-destructive-primary font-medium text-sm'>{errors.root}</p>
            </div>
          </div>
        }

        {/* Success Message */}
        {successMessage &&
          <div className='bg-success/10 border-l-4 border-success p-4 flex items-start gap-3'>
            <div className='w-5 h-5 rounded-full bg-success flex items-center justify-center shrink-0'>
              <span className='text-white text-xs'>✓</span>
            </div>
            <p className='text-success font-medium text-sm'>{successMessage}</p>
          </div>
        }

        {/* Identity Section */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-1'>
            <h3 className='text-sm font-bold uppercase tracking-widest text-foreground mb-2'>Company Information</h3>
            <p className='text-xs text-secondary leading-relaxed'>
              Core information about your company used in contracts and negotiations.
            </p>
          </div>
          <div className='lg:col-span-2 space-y-6 bg-stone-50/50 p-6 rounded-sm border border-stone-200/30'>
            <Field data-invalid={!!errors.companyName}>
              <FieldLabel htmlFor='companyName' className='font-bold'>COMPANY NAME</FieldLabel>
              <Input
                id='companyName'
                type='text'
                placeholder='Enter full company name'
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
              {errors.companyName && <FieldDescription>{errors.companyName}</FieldDescription>}
            </Field>

            <Field data-invalid={!!errors.address}>
              <FieldLabel htmlFor='address' className='font-bold'>HEADQUARTERS ADDRESS</FieldLabel>
              <textarea
                id='address'
                className='w-full px-3 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-primary font-body text-sm resize-none'
                placeholder='Full company address'
                rows={2}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
              {errors.address && <FieldDescription>{errors.address}</FieldDescription>}
            </Field>
          </div>
        </div>

        {/* Brand Assets Section */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-1'>
            <h3 className='text-sm font-bold uppercase tracking-widest text-foreground mb-2'>Brand Assets</h3>
            <p className='text-xs text-secondary leading-relaxed'>
              Your logo URL will be visible on all generated contracts and in the counterparty portal.
            </p>
          </div>
          <div className='lg:col-span-2 space-y-6 bg-stone-50/50 p-6 rounded-sm border border-stone-200/30'>
            <Field>
              <FieldLabel htmlFor='logoUrl' className='font-bold'>LOGO URL</FieldLabel>
              <Input
                id='logoUrl'
                type='text'
                placeholder='https://example.com/logo.png'
                value={logoUrl || ""}
                onChange={handleLogoChange}
              />
              <FieldDescription>
                Provide a direct URL to your company logo image (SVG, PNG, or JPEG)
              </FieldDescription>
              {logoUrl && (
                <div className='mt-4 flex items-center gap-4'>
                  <div className='w-20 h-20 bg-stone-100 rounded-sm border border-stone-200/50 flex items-center justify-center overflow-hidden'>
                    <img
                      src={logoUrl}
                      alt='Company logo preview'
                      className='w-full h-full object-contain'
                      onError={() => setErrors({ ...errors, logoUrl: "Failed to load image from URL" })}
                    />
                  </div>
                  <div>
                    <p className='text-xs text-secondary mb-2'>Logo preview</p>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={handleClearLogo}
                      type='button'
                    >
                      Clear
                    </Button>
                  </div>
                </div>
              )}
              {errors.logo && <FieldDescription className='text-destructive-primary'>{errors.logo}</FieldDescription>}
            </Field>
          </div>
        </div>

        {/* Description Section */}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          <div className='lg:col-span-1'>
            <h3 className='text-sm font-bold uppercase tracking-widest text-foreground mb-2'>Company Description</h3>
            <p className='text-xs text-secondary leading-relaxed'>
              Brief description of your company visible to potential counterparties.
            </p>
          </div>
          <div className='lg:col-span-2 space-y-6 bg-stone-50/50 p-6 rounded-sm border border-stone-200/30'>
            <Field>
              <FieldLabel htmlFor='description' className='font-bold'>DESCRIPTION</FieldLabel>
              <textarea
                id='description'
                className='w-full px-3 py-2 border border-stone-300 rounded-sm focus:outline-none focus:border-primary font-body text-sm resize-none'
                placeholder='Tell potential partners about your company...'
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Field>
          </div>
        </div>

        {/* Action Footer */}
        <div className='pt-8 mt-12 border-t border-stone-200/50 flex items-center justify-between'>
          <div className='flex items-center gap-3'>
            <span className='text-tertiary'>ℹ</span>
            <p className='text-xs text-secondary font-medium'>
              All changes will be reflected immediately in future documents.
            </p>
          </div>
          <div className='flex gap-4'>
            <Button
              variant='outline'
              className='h-10 px-8'
              onClick={() => navigate({ to: '/dashboard' })}
              type='button'
            >
              Cancel
            </Button>
            <Button
              className='h-10 px-8'
              onClick={handleSave}
              disabled={isSaving}
              type='button'
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </form>
    </main>
  )
}

