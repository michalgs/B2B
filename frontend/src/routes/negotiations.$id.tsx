import { createFileRoute, redirect, useNavigate, useRouter } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { Input } from '#/components/ui/input'
import { Field, FieldLabel, FieldTitle } from '#/components/ui/field'
import { cn, getApiBaseUrl } from '#/lib/utils'
import Logo from '#/components/Logo'
import { useState, useEffect } from 'react'
import { queryOptions, useSuspenseQuery, useQueryClient } from '@tanstack/react-query'

const API_BASE_URL = getApiBaseUrl();

interface ContractShard {
  uuid: string;
  title: string;
  description: string;
  price: number;
  currency: string;
  deadline: string;
  createdAt: string;
  createdByName: string;
}

interface NegotiationDetail {
  uuid: string;
  senderCompanyName: string;
  recipientCompanyName: string;
  status: string;
  updatedAt: string;
  shards: ContractShard[];
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

const negotiationQueryOptions = (id: string) => queryOptions({
  queryKey: ['negotiation', id],
  queryFn: async () => {
    const response = await fetch(`${API_BASE_URL}/api/v1/contracts/${id}`, {
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Negotiation not found');
    return response.json() as Promise<NegotiationDetail>;
  },
  refetchInterval: 15000,
})

export const Route = createFileRoute('/negotiations/$id')({
  loader: async ({ context: { queryClient }, params: { id } }) => {
    try {
      await Promise.all([
        queryClient.ensureQueryData(userQueryOptions),
        queryClient.ensureQueryData(negotiationQueryOptions(id)),
      ])
    } catch (e) {
      throw redirect({ to: '/login' })
    }
  },
  component: NegotiationView,
})

function NegotiationView() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const { data: user } = useSuspenseQuery(userQueryOptions);
  const { data: negotiation } = useSuspenseQuery(negotiationQueryOptions(id));
  
  const navigate = useNavigate();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [selectedShardUuid, setSelectedShardUuid] = useState<string | null>(null);
  const [shardsCount, setShardsCount] = useState(0);

  // Counter offer form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [currency, setCurrency] = useState("USD");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (negotiation?.shards?.length > 0) {
      const latest = negotiation.shards[negotiation.shards.length - 1];
      
      if (negotiation.shards.length > shardsCount || !selectedShardUuid) {
        setSelectedShardUuid(latest.uuid);
        setShardsCount(negotiation.shards.length);
      }
      
      if (!isSubmitting) {
        setTitle(latest.title || "");
        setDescription(latest.description || "");
        setPrice(latest.price?.toString() || "0");
        setCurrency(latest.currency || "USD");
        if (latest.deadline) {
          try {
            setDeadline(new Date(latest.deadline).toISOString().slice(0, 16));
          } catch (e) {
            console.error("Failed to parse deadline", e);
          }
        }
      }
    }
  }, [negotiation, selectedShardUuid, shardsCount, isSubmitting]);

  if (!negotiation || !negotiation.shards || negotiation.shards.length === 0) {
    return (
      <main className="page-wrap px-4 py-12 flex flex-col items-center">
        <div className='w-full lg:w-4/5 xl:w-3/4'>
           <Logo />
           <div className="mt-8 p-8 text-center border rounded-lg bg-muted/20">
             <h3 className="text-xl font-semibold">No negotiation data available</h3>
             <Button className="mt-4" onClick={() => navigate({ to: '/dashboard' })}>Return to Dashboard</Button>
           </div>
        </div>
      </main>
    );
  }

  const latestShard = negotiation.shards[negotiation.shards.length - 1];
  const viewedShard = negotiation.shards.find(s => s.uuid === selectedShardUuid) || latestShard;
  const isViewingLatest = viewedShard.uuid === latestShard.uuid;

  const partnerName = user.company?.name === negotiation.senderCompanyName
    ? negotiation.recipientCompanyName
    : negotiation.senderCompanyName;

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleString();
    } catch (e) {
      return "Invalid Date";
    }
  };

  const handleUpdateStatus = async (status: string) => {
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/contracts/${negotiation.uuid}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
        credentials: 'include',
      });

      if (response.ok) {
        await queryClient.invalidateQueries({ queryKey: ['negotiations'] });
        await queryClient.invalidateQueries({ queryKey: ['negotiation', id] });
        navigate({ to: '/dashboard' });
      }
 else {
        const data = await response.json();
        setError(data.message || "Failed to update status.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCounterOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/v1/contracts/${negotiation.uuid}/counter-offer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description,
          price: parseFloat(price),
          currency,
          deadline: new Date(deadline).toISOString(),
        }),
        credentials: 'include',
      });

      if (response.ok) {
        setShowCounterForm(false);
        queryClient.invalidateQueries({ queryKey: ['negotiation', id] });
      } else {
        const data = await response.json();
        setError(data.message || "Failed to send counter offer.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page-wrap px-4 py-12 flex flex-col items-center">
      <div className='w-full lg:w-4/5 xl:w-3/4'>
        <div className='flex justify-between items-start mb-8'>
          <div className='flex flex-col'>
            <Logo />
            <h2 className='mt-4 text-3xl font-bold'>Negotiation with {partnerName}</h2>
            <p className='font-body font-normal text-md text-base/5 text-secondary mt-2'>
              Status: <span className={cn(
                "px-2 py-0.5 rounded-full border text-xs ml-2",
                negotiation.status === "ACCEPTED" ? "bg-green-100 text-green-700 border-green-200" :
                  negotiation.status === "REJECTED" ? "bg-red-100 text-red-700 border-red-200" :
                    negotiation.status === "INVITED" || negotiation.status === "NEGOTIATING" ? "bg-yellow-100 text-yellow-700 border-yellow-200" :
                      "bg-blue-100 text-blue-700 border-blue-200"
              )}>
                {negotiation.status.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
              </span>
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate({ to: '/dashboard' })}>Back to Dashboard</Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {/* Left Column: Details */}
          <div className="lg:col-span-2">
            {!showCounterForm ? (
              <Card className="box-shadow-2xl h-full flex flex-col max-h-[600px]">
                <CardHeader className="border-b shrink-0">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle data-test="offer-details-title">
                        {isViewingLatest ? 'Current Offer Details' : 'Historical Version Details'}
                      </CardTitle>
                      <CardDescription>
                        {isViewingLatest 
                          ? 'Latest version of the proposed terms' 
                          : `Version created by ${viewedShard.createdByName} on ${formatDate(viewedShard.createdAt)}`}
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      {isViewingLatest && negotiation.status !== 'ACCEPTED' && negotiation.status !== 'REJECTED' && (
                        <Button onClick={() => setShowCounterForm(true)} data-test="counter-offer-button">Counter Offer</Button>
                      )}
                      {!isViewingLatest && (
                        <Button variant="outline" size="sm" onClick={() => setSelectedShardUuid(latestShard.uuid)} data-test="back-to-latest-button">
                          Back to Latest
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6 flex-1 overflow-y-auto">
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Title</h4>
                    <p className="text-xl font-semibold" data-test="view-offer-title">{viewedShard?.title || 'Untitled'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Description</h4>
                    <p className="text-base text-muted-foreground whitespace-pre-wrap leading-relaxed" data-test="view-offer-description">
                      {viewedShard?.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-4">
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Proposed Price</h4>
                      <p className="text-2xl font-bold text-primary" data-test="view-offer-price">
                        {(viewedShard?.price || 0).toLocaleString(undefined, { style: 'currency', currency: viewedShard?.currency || 'USD' })}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Deadline</h4>
                      <p className="text-lg font-medium" data-test="view-offer-deadline">{formatDate(viewedShard?.deadline)}</p>
                    </div>
                  </div>
                </CardContent>
                {error && (
                  <CardContent className="pt-0 shrink-0">
                    <p className="text-destructive text-sm font-medium p-4 bg-destructive/10 rounded-md" data-test="offer-error-message">{error}</p>
                  </CardContent>
                )}
                {isViewingLatest && (negotiation.status === 'INVITED' || negotiation.status === 'NEGOTIATING') && user.company?.name !== latestShard.createdByName && (
                  <CardFooter className="border-t bg-muted/30 flex justify-end gap-4 py-4 shrink-0">
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={() => handleUpdateStatus('REJECTED')}
                      disabled={isSubmitting}
                      data-test="reject-offer-button"
                    >
                      Reject Offer
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      size="lg"
                      onClick={() => handleUpdateStatus('ACCEPTED')}
                      disabled={isSubmitting}
                      data-test="accept-offer-button"
                    >
                      Accept Offer
                    </Button>
                  </CardFooter>
                )}

              </Card>
            ) : (
              <Card className="box-shadow-2xl h-full flex flex-col max-h-[600px]" data-test="counter-offer-form">
                <CardHeader className="shrink-0">
                  <CardTitle>Counter Offer</CardTitle>
                  <CardDescription>Propose new terms for this negotiation</CardDescription>
                </CardHeader>
                <form onSubmit={handleCounterOffer} className="flex-1 flex flex-col overflow-hidden">
                  <CardContent className="space-y-4 px-4 flex-1 overflow-y-auto">
                    <Field>
                      <FieldLabel>
                        <FieldTitle>Title</FieldTitle>
                        <Input
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          data-test="counter-title-input"
                        />
                      </FieldLabel>
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel>
                          <FieldTitle>Price</FieldTitle>
                          <Input
                            type="number"
                            step="0.01"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            data-test="counter-price-input"
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
                            data-test="counter-deadline-input"
                          />
                        </FieldLabel>
                      </Field>
                    </div>

                    <Field className="flex-1 flex flex-col">
                      <FieldLabel className="flex-1 flex flex-col">
                        <FieldTitle>Description</FieldTitle>
                        <textarea
                          className="w-full flex-1 min-h-[150px] px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          data-test="counter-description-input"
                        />
                      </FieldLabel>
                    </Field>
                    {error && <p className="text-destructive text-sm font-medium" data-test="counter-error-message">{error}</p>}
                  </CardContent>
                  <CardFooter className="justify-end gap-3 mt-4 shrink-0">
                    <Button variant="ghost" type="button" onClick={() => setShowCounterForm(false)} data-test="counter-cancel-button">Cancel</Button>
                    <Button type="submit" disabled={isSubmitting} data-test="counter-submit-button">
                      {isSubmitting ? "Sending..." : "Send Counter Offer"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}
          </div>

          {/* Right Column: Versions */}
          <div>
            <Card className="box-shadow-lg sticky top-8 h-full flex flex-col max-h-[600px]">
              <CardHeader className="border-b shrink-0">
                <CardTitle className="text-lg">History</CardTitle>
                <CardDescription>Previous iterations</CardDescription>
              </CardHeader>
              <CardContent className="p-0 overflow-y-auto flex-1">
                <div className="flex flex-col">
                  {negotiation.shards.slice().reverse().map((shard, index) => (
                    <div 
                      key={shard.uuid || index} 
                      className={cn(
                        "p-4 border-l-4 cursor-pointer transition-colors",
                        shard.uuid === selectedShardUuid 
                          ? "border-l-primary bg-primary/5" 
                          : "border-l-transparent hover:bg-muted/50"
                      )}
                      onClick={() => {
                        setSelectedShardUuid(shard.uuid);
                        setShowCounterForm(false);
                      }}
                      data-test="history-item"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="font-semibold text-sm">
                          {shard.createdByName || 'Unknown'}
                        </span>
                        <span className="text-[10px] text-muted-foreground">
                          {formatDate(shard.createdAt)}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{shard.price || 0} {shard.currency || 'USD'}</p>
                      <p className="text-xs text-muted-foreground line-clamp-1">{shard.title || 'Untitled'}</p>
                      {index < negotiation.shards.length - 1 && <Separator className="mt-4" />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  )
}
