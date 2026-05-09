---
title: "gRPC does not make your services reliable. It makes the contract enforceable."
tldr: "REST leaves contract validation to whoever remembers to do it. gRPC makes it non-negotiable. Reach for it only when that enforcement is worth the surgery."
date: "2026-05-10"
tags: [grpc, rest, backend, system-design, typescript]
---


Downstream never failed to honor the contract because it was unreliable. It had no obligation to honor it in the first place.

### The problem setup: two services, one REST call

Consider two services communicating. Upstream service requests from a downstream service.

``` typescript
interface UserRequest {
  id: string
}

interface UserResponse {
  id: string
  name: string
  email: string
}

// Upstream calling downstream
const res = await fetch('https://downstream/users/123')
// de-serialising the response by parsing the stringified JSON to JavaScript Object
const data: UserResponse = await res.json()
```

``` typescript
// Downstream responding — no shared type, no contract
// email is missing and nothing here will catch it
res.json({ id: "123", name: "Rahul" })
```

Downstream shipped without email and nothing threw.

### The hidden problem: contract is the client's responsibility

Downstream has failed to honor the contract not because it is non-reliable by nature. It has no obligation to honor it unless it has a copy of the contract to validate before shipping.

However, people do enforce validation at client side with robust error handling to throw early.

>"Be conservative in what you do, be liberal in what you accept from others."
>
> — Postel's Law (The Robustness Principle)

Postel's Law is why client-side validation became the norm.

> So what? TypeScript catches this at compile time. Why do we need gRPC? > 

TypeScript helps if every service is TypeScript, typed correctly, and disciplined. However:

1. You've already paid the network cost. You received broken data, decoded it, allocated memory for it, then threw it away. At scale with high-volume service-to-service calls, that's wasted CPU and latency on every bad response.

2. Worse, if validation is missing or inconsistent across services, broken data propagates further before anyone catches it.

3. Notorious validation complexity if 10 services of different run time environment (Python, Go, Node) depending on the same downstream.


### What gRPC actually does differently

gRPC introduces a shared contract file called .proto living in a place accessible to both communicating services. 

``` Protobuf
service UserService {
  rpc GetUser (UserRequest) returns (UserResponse);
}

message UserRequest { string id = 1; }
message UserResponse { string name = 1; string email = 2; }
```

Downstream tries to serialize. email is missing. Serialization fails before anything leaves the server. Upstream never receives broken data. The error surfaces at the source and not three hops downstream.


### The wire: binary vs text

REST sends JSON, human-readable text. gRPC sends Protocol Buffers (binary). Smaller. Faster to parse.

The serialized binary is unreadable bytes — you can't read it as text. It's compact encoding of field numbers and values. For a JavaScript object, it might look like raw bytes:

 `{ id: "123", name: "John Doe" }` -> `\x0a\x03123\x12\x08John Doe`

Downstream serializes to binary using .proto. Upstream's gRPC client deserializes binary back into a typed object. Both sides use the same .proto — that's why the shared location matters. Server uses it to serialize. Client uses it to deserialize valid responses.


### Why the browser is out

Browser expects JSON. gRPC speaks binary Protocol Buffers. Browser doesn't have a gRPC runtime to deserialize binary into JS objects. You'd need a proxy between browser and gRPC service. So: browser → REST → your API → gRPC → downstream. The seam stays at the first hop.

### When gRPC actually makes sense
gRPC makes sense when the overhead of client-side contract validation and JSON deserialization becomes the bottleneck.

1. High-frequency service-to-service calls (high volume internal APIs)

2. Polyglot environments (Go, Python, Node all talking to each other)

3. Streaming data (real-time feeds, large datasets in chunks)

4. When contract drift between teams is a real risk

### What to be careful about
Do not reach for gRPC unless the pain is real.
1. Binary is not human-readable — harder to debug without tooling

2. Browser can't call gRPC directly without a proxy

3. Both services must agree on and version the .proto — schema evolution needs discipline

4. Smaller ecosystem than REST, less familiar to most engineers

5. All-or-nothing at each hop — every service in a communication path must support gRPC; one REST-only legacy service breaks the chain and forces a proxy or translation layer


gRPC is not just a plug and play adapter. It requires surgery to make your services compatible. A thoughtful, strategic approach is not optional.
