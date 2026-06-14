import { createFileRoute, redirect, useNavigate, Link, useRouter } from '@tanstack/react-router'
import { Button } from '#/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '#/components/ui/card'
import { Separator } from '#/components/ui/separator'
import { Input } from '#/components/ui/input'
import { Field, FieldLabel, FieldTitle } from '#/components/ui/field'
import { cn, getApiBaseUrl } from '#/lib/utils'
import Logo from '#/components/Logo'
import { useState, useEffect } from 'react'

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

export const Route = createFileRoute('/negotiations/$id')({
  beforeLoad: async ({ params }) => {
    try {
      const userResponse = await fetch(`${API_BASE_URL}/api/v1/users/me`, {
        credentials: 'include',
      });
      if (!userResponse.ok) {
        throw redirect({ to: '/login' })
      }
      const user = await userResponse.json();

      const negotiationResponse = await fetch(`${API_BASE_URL}/api/v1/contracts/${params.id}`, {
        credentials: 'include',
      });
      if (!negotiationResponse.ok) {
        throw redirect({ to: '/dashboard' })
      }
      const negotiation = await negotiationResponse.json();

      return {
        user,
        negotiation: negotiation as NegotiationDetail,
      }
    } catch (error) {
      if (error instanceof Error && 'to' in error) {
        throw error;
      }
      throw redirect({ to: '/login' })
    }
  },
  component: NegotiationView,
})

function NegotiationView() {
  const { user, negotiation } = Route.useRouteContext();
  const navigate = useNavigate();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [showCounterForm, setShowCounterForm] = useState(false);
  const [selectedShardUuid, setSelectedShardUuid] = useState<string | null>(null);
  const [shardsCount, setShardsCount] = useState(0);

  // Counter offer form state - initialized to empty and synced via useEffect
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [currency, setCurrency] = useState("USD");
  const [deadline, setDeadline] = useState("");

  useEffect(() => {
    if (negotiation?.shards?.length > 0) {
      const latest = negotiation.shards[negotiation.shards.length - 1];
      
      // Auto-select newest shard if a new one is added or if nothing is selected
      if (negotiation.shards.length > shardsCount || !selectedShardUuid) {
        setSelectedShardUuid(latest.uuid);
        setShardsCount(negotiation.shards.length);
      }
      
      // Only sync form state if it's the latest shard we're looking at
      // and we're not currently submitting a counter offer
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

  console.log('Rendering NegotiationView', { 
    negotiationStatus: negotiation?.status, 
    shardsCount: negotiation?.shards?.length,
    selectedShardUuid
  });

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
        navigate({ to: '/dashboard' });
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
        router.invalidate();
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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details */}
          <div className="lg:col-span-2 space-y-6">
            {!showCounterForm ? (
              <Card className="box-shadow-2xl">
                <CardHeader className="border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>
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
                        <Button onClick={() => setShowCounterForm(true)}>Counter Offer</Button>
                      )}
                      {!isViewingLatest && (
                        <Button variant="outline" size="sm" onClick={() => setSelectedShardUuid(latestShard.uuid)}>
                          Back to Latest
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-6 space-y-6">
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Title</h4>
                    <p className="text-xl font-semibold">{viewedShard?.title || 'Untitled'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Description</h4>
                    <p className="text-base text-muted-foreground whitespace-pre-wrap leading-relaxed">
                      {viewedShard?.description || 'No description provided.'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-8 pt-4">
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Proposed Price</h4>
                      <p className="text-2xl font-bold text-primary">
                        {(viewedShard?.price || 0).toLocaleString(undefined, { style: 'currency', currency: viewedShard?.currency || 'USD' })}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">Deadline</h4>
                      <p className="text-lg font-medium">{formatDate(viewedShard?.deadline)}</p>
                    </div>
                  </div>
                </CardContent>
                {error && (
                  <CardContent className="pt-0">
                    <p className="text-destructive text-sm font-medium p-4 bg-destructive/10 rounded-md">{error}</p>
                  </CardContent>
                )}
                {isViewingLatest && negotiation.status === 'INVITED' && user.company?.name === negotiation.recipientCompanyName && (
                  <CardFooter className="border-t bg-muted/30 flex justify-end gap-4 py-4">
                    <Button
                      variant="destructive"
                      size="lg"
                      onClick={() => handleUpdateStatus('REJECTED')}
                      disabled={isSubmitting}
                    >
                      Reject Offer
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      size="lg"
                      onClick={() => handleUpdateStatus('IN_PROGRESS')}
                      disabled={isSubmitting}
                    >
                      Accept Offer
                    </Button>
                  </CardFooter>
                )}
              </Card>
            ) : (
              <Card className="box-shadow-2xl">
                <CardHeader>
                  <CardTitle>Counter Offer</CardTitle>
                  <CardDescription>Propose new terms for this negotiation</CardDescription>
                </CardHeader>
                <form onSubmit={handleCounterOffer}>
                  <CardContent className="space-y-4">
                    <Field>
                      <FieldLabel>
                        <FieldTitle>Title</FieldTitle>
                        <Input
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
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
                          />
                        </FieldLabel>
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel>
                        <FieldTitle>Description</FieldTitle>
                        <textarea
                          className="w-full min-h-[150px] px-3 py-2 bg-background border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                          required
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                        />
                      </FieldLabel>
                    </Field>
                    {error && <p className="text-destructive text-sm font-medium">{error}</p>}
                  </CardContent>
                  <CardFooter className="justify-end gap-3 mt-4">
                    <Button variant="ghost" type="button" onClick={() => setShowCounterForm(false)}>Cancel</Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? "Sending..." : "Send Counter Offer"}
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            )}
          </div>

          {/* Right Column: Versions */}
          <div className="space-y-6">
            <Card className="box-shadow-lg h-full">
              <CardHeader className="border-b">
                <CardTitle className="text-lg">History</CardTitle>
                <CardDescription>Previous iterations</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
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
