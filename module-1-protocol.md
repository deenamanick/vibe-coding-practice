# Module 1: Protocols (how two parties communicate)

## What is a protocol?
A **protocol** is an agreed set of rules that lets **two parties communicate** (client/server, service/service, app/API).

A protocol typically defines:
- **Message format** (text/binary, fields)
- **Sequence** (who sends what, and when)
- **Delivery properties** (reliable vs best-effort)
- **Errors** (timeouts, retries, acknowledgements)
- **Security** (auth, encryption)

## Why many protocols exist
Different purposes need different trade-offs:
- **Reliable vs low-latency**
- **Connection-oriented vs connectionless**
- **Human-readable vs efficient binary**
- **Stateless vs stateful**

---

## Examples (TCP, UDP, HTTP, gRPC, FTP)

### TCP
- **Type:** transport protocol
- **Properties:** connection-oriented, **reliable**, ordered
- **Good for:** logins, payments, databases, most web traffic
- **Student demo:** simple TCP client sends `1..10`; server prints in order.

### UDP
- **Type:** transport protocol
- **Properties:** connectionless, **best-effort** (may drop/reorder)
- **Good for:** gaming, voice/video, DNS
- **Student demo:** send 100 UDP datagrams; simulate loss; observe no automatic retransmit.

### HTTP
- **Type:** application protocol
- **Properties:** **request/response**, status codes, headers; stateless by default
- **Good for:** websites, REST APIs
- **Student demo:** build endpoints:
  - `GET /health -> OK`
  - `GET /time -> {"time":...}`
  - `POST /echo -> returns request body`

### gRPC
- **Type:** RPC framework/protocol (commonly Protobuf + HTTP/2)
- **Properties:** strongly typed, fast binary messages, supports streaming
- **Good for:** microservice-to-microservice communication
- **Student demo:** `Calculator.Add(a,b)->sum`; compare with HTTP `POST /add`.

### FTP
- **Type:** file transfer protocol
- **Properties:** dedicated commands for listing/upload/download; typically TCP-based
- **Good for:** transferring files (especially legacy systems)
- **Student demo:** connect, `LIST`, `GET file.txt`, `PUT new.txt`.

---

## Hands-on demos (runnable)

### Demo A: TCP (using `nc`)
Open two terminals.

**Terminal 1 (server):**
```bash
nc -l 127.0.0.1 9001
```

**Terminal 2 (client):**
```bash
printf "msg-1\nmsg-2\nmsg-3\n" | nc 127.0.0.1 9001
```

### Demo B: UDP (using `nc -u`)
Open two terminals.

**Terminal 1 (receiver):**
```bash
nc -u -l 127.0.0.1 9002
```

**Terminal 2 (sender):**
```bash
printf "packet-1\npacket-2\npacket-3\n" | nc -u 127.0.0.1 9002
```

### Demo C: HTTP (server + curl)
**Terminal 1 (HTTP server):**
```bash
python3 -m http.server 9003 --bind 127.0.0.1
```

**Terminal 2 (request):**
```bash
curl -i http://127.0.0.1:9003
```

### Demo D: gRPC (what to show in class)
- **Show:** `.proto` defines messages/services, then client calls `Service.Method()`.
- **Run idea:** use any “HelloWorld gRPC” example in your preferred language and compare it to a REST `curl` call.

### Demo E: FTP (command-line)
```bash
ftp <host>
# then try: ls, get <file>, put <file>
```

## Quick comparison
| Protocol | Layer | Reliable? | Best for |
|---|---|---:|---|
| TCP | Transport | Yes | Correctness + order |
| UDP | Transport | No | Real-time + low overhead |
| HTTP | App | Depends on transport | Web + APIs |
| gRPC | App/RPC | Depends on transport | Internal service APIs |
| FTP | App | Typically over TCP | File transfer |
