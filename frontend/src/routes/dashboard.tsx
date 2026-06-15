import { createFileRoute, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { Field, FieldLabel, FieldTitle } from '#/components/ui/field'
import { Input } from '#/components/ui/input'
import { cn, getApiBaseUrl } from '#/lib/utils'
import Logo from '#/components/Logo'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { useState } from 'react'
import { queryOptions, useSuspenseQuery, useQueryClient } from '@tanstack/react-query'

const API_BASE_URL = getApiBaseUrl();

interface Negotiation {
  uuid: string;
  senderCompanyName: string;
  recipientCompanyName: string;
  status: string;
  initialOffering: string;
  updatedAt: string;
}

interface Company {
  uuid: string;
  name: string;
}

const userQueryOptions = queryOptions({
  queryKey: ['user', 'me'],
  queryFn: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Unauthorized');
    return response.json();
  },
})

const negotiationsQueryOptions = queryOptions({
  queryKey: ['negotiations'],
  queryFn: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/contracts`, {
      credentials: 'include',
    });
    const data = response.ok ? await response.json() : { content: [] };
    return (data.content || []) as Negotiation[];
  },
})

const companiesQueryOptions = queryOptions({
  queryKey: ['companies'],
  queryFn: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/companies`, {
      credentials: 'include',
    });
    return (response.ok ? await response.json() : []) as Company[];
  },
})

export const Route = createFileRoute('/dashboard')({
  loader: async ({ context: { queryClient } }) => {
    try {
      await Promise.all([
        queryClient.ensureQueryData(userQueryOptions),
        queryClient.ensureQueryData(negotiationsQueryOptions),
        queryClient.ensureQueryData(companiesQueryOptions),
      ])
    } catch (e) {
      throw redirect({ to: '/login' })
    }
  },
  component: Dashboard,
})

function Dashboard() {
  const queryClient = useQueryClient();
  const { data: user } = useSuspenseQuery(userQueryOptions);
  const { data: negotiations } = useSuspenseQuery(negotiationsQueryOptions);
  const { data: companies } = useSuspenseQuery(companiesQueryOptions);

  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNegotiation, setSelectedNegotiation] = useState<Negotiation | null>(null);

  // Form states
  const [recipientCompanyUuid, setRecipientCompanyUuid] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [deadline, setDeadline] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const handleUpdateStatus = async (uuid: string, status: string) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/contracts/${uuid}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
        credentials: 'include',
      });

      if (response.ok) {
        setSelectedNegotiation(null);
        queryClient.invalidateQueries({ queryKey: ['negotiations'] });
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update status.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateNegotiation = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/contracts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipientCompanyUuid,
          title,
          description,
          price: parseFloat(price),
          currency,
          deadline: new Date(deadline).toISOString(),
        }),
        credentials: 'include',
      });

      if (response.ok) {
        setIsModalOpen(false);
        // Clear form
        setRecipientCompanyUuid("");
        setTitle("");
        setDescription("");
        setPrice("");
        setDeadline("");
        queryClient.invalidateQueries({ queryKey: ['negotiations'] });
      } else {
        const data = await response.json();
        setError(data.message || "Failed to create negotiation.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-wrap px-4 py-12 flex flex-col items-center">
      <div className='w-full md:w-3/4 lg:w-1/2'>
        <div className='flex flex-col mb-8'>
          <Logo />
          <h2 className='mt-4 text-3xl font-bold'>Welcome, {user.firstName} {user.lastName}!</h2>
          <p className='font-body font-normal text-md text-base/5 text-secondary mt-2'>
            You are logged in as <span className="font-semibold">{user.email}</span>
            {user.company && (
              <> from <span className="font-semibold">{user.company.name}</span></>
            )}
          </p>
        </div>

        <div className="grid gap-6">
          <Card className='box-shadow-2xl'>
            <CardHeader className="border-b">
              <CardTitle>Active Negotiations</CardTitle>
              <CardDescription>Manage your ongoing business agreements</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="flex flex-col">
                {negotiations.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground">
                    No active negotiations found.
                  </div>
                ) : (
                  negotiations.map((negotiation, index) => (
                    <div key={negotiation.uuid} data-test="negotiation-item">
                      <div
                        className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                        onClick={() => navigate({ to: '/negotiations/$id', params: { id: negotiation.uuid } })}
                      >
                        <div className="flex flex-col gap-1">
                          <span className="font-semibold text-base" data-test="negotiation-partner">
                            {user.company?.name === negotiation.senderCompanyName
                              ? negotiation.recipientCompanyName
                              : negotiation.senderCompanyName}
                          </span>
                          <span className="text-sm text-muted-foreground">Last updated: {formatDate(negotiation.updatedAt)}</span>
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span className="font-medium">{negotiation.initialOffering}</span>
                          <span className={cn(
                            "text-xs px-2 py-0.5 rounded-full border",
                            negotiation.status === "ACCEPTED" ? "bg-green-100 text-green-700 border-green-200" :
                              negotiation.status === "REJECTED" ? "bg-red-100 text-red-700 border-red-200" :
                                negotiation.status === "INVITED" || negotiation.status === "NEGOTIATING" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                                  "bg-blue-100 text-blue-700 border-blue-200"
                          )} data-test="negotiation-status">
                            {negotiation.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                        </div>
                      </div>
                      {index < negotiations.length - 1 && <Separator />}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
            <CardFooter className="justify-center border-t">
              <Button variant="ghost" size="sm">View All Negotiations</Button>
            </CardFooter>
          </Card>

          <Button
            size="lg"
            className="w-full py-6 text-lg font-semibold shadow-lg"
            onClick={() => setIsModalOpen(true)}
            data-test="new-negotiation-button"
          >
            New Negotiation
          </Button>
        </div>
      </div>

      {/* New Negotiation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-test="negotiation-modal">
          <Card className="w-full max-w-2xl bg-background shadow-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Start New Negotiation</CardTitle>
              <CardDescription>Invite a partner to start a negotiation.</CardDescription>
            </CardHeader>
            <form onSubmit={handleCreateNegotiation}>
              <CardContent className="space-y-4 px-4">
                {error && <p className="text-destructive text-sm font-medium">{error}</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel>
                      <FieldTitle>Recipient Company</FieldTitle>
                      <Select
                        required
                        value={recipientCompanyUuid}
                        onValueChange={setRecipientCompanyUuid}
                      >
                        <SelectTrigger className="w-full" data-test="recipient-company-select">
                          <SelectValue placeholder="Select a company">
                            {recipientCompanyUuid
                              ? companies.find(c => c.uuid === recipientCompanyUuid)?.name
                              : undefined}
                          </SelectValue>
                        </SelectTrigger>                        <SelectContent>
                          {companies.map(c => (
                            <SelectItem key={c.uuid} value={c.uuid} data-test="company-option">
                              {c.name}
                            </SelectItem>
                          ))}                        </SelectContent>
                      </Select>
                    </FieldLabel>
                  </Field>

                  <Field>
                    <FieldLabel>
                      <FieldTitle>Title</FieldTitle>
                      <Input
                        placeholder="e.g. Software Development Project"
                        required
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        data-test="negotiation-title-input"
                      />
                    </FieldLabel>
                  </Field>

                  <Field>
                    <FieldLabel>
                      <FieldTitle>Price</FieldTitle>
                      <Input
                        placeholder="e.g. 5000"
                        type="number"
                        step="0.01"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        data-test="negotiation-price-input"
                      />
                    </FieldLabel>
                  </Field>

                  <Field>
                    <FieldLabel>
                      <FieldTitle>Deadline</FieldTitle>
                      <Input
                        type="datetime-local"
                        required
                        value={deadline}
                        onChange={(e) => setDeadline(e.target.value)}
                        data-test="negotiation-deadline-input"
                      />
                    </FieldLabel>
                  </Field>
                </div>

                <Field>
                  <FieldLabel>
                    <FieldTitle>Description</FieldTitle>
                    <textarea
                      className="w-full min-h-[150px] px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                      placeholder="Detailed terms..."
                      required
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      data-test="negotiation-description-input"
                    />
                  </FieldLabel>
                </Field>
              </CardContent>
              <CardFooter className="justify-end gap-3 mt-4">
                <Button variant="ghost" type="button" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit" disabled={isSubmitting} data-test="negotiation-submit-button">
                  {isSubmitting ? "Sending..." : "Send Offer"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      )}

      {/* Detail / Action Modal */}
      {selectedNegotiation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" data-test="negotiation-details-modal">
          <Card className="w-full max-w-lg bg-background shadow-2xl overflow-y-auto">
            <CardHeader>
              <CardTitle>Negotiation Details</CardTitle>
              <CardDescription>Review the offer from {selectedNegotiation.senderCompanyName}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground">STATUS</h4>
                  <p className="font-medium" data-test="modal-status">{selectedNegotiation.status}</p>
                </div>
                <div>
                  <h4 className="text-sm font-bold text-muted-foreground">SENDER</h4>
                  <p className="font-medium" data-test="modal-sender">{selectedNegotiation.senderCompanyName}</p>
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-muted-foreground">OFFERING</h4>
                <p className="font-medium" data-test="modal-offering">{selectedNegotiation.initialOffering}</p>
              </div>
              {error && <p className="text-destructive text-sm font-medium">{error}</p>}
            </CardContent>
            <CardFooter className="justify-end gap-3 mt-4 border-t pt-4">
              <Button variant="ghost" type="button" onClick={() => setSelectedNegotiation(null)}>Close</Button>

              {selectedNegotiation.status === 'INVITED' && user.company?.name === selectedNegotiation.recipientCompanyName && (
                <>
                  <Button
                    variant="destructive"
                    onClick={() => handleUpdateStatus(selectedNegotiation.uuid, 'REJECTED')}
                    disabled={isSubmitting}
                    data-test="reject-offer-button"
                  >
                    Reject Offer
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={() => handleUpdateStatus(selectedNegotiation.uuid, 'IN_PROGRESS')}
                    disabled={isSubmitting}
                    data-test="accept-offer-button"
                  >
                    Accept Offer
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      )}
    </main>
  )
}
