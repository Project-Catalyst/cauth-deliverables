---
title: OAuth Bridge
date: 
weight: 4
---

### OAuth Bridge for cAuth
The OAuth bridge enables traditional Web2 applications to authenticate users through Cardano NFT credentials. This bridge acts as a translator between blockchain-based authentication and the widely-adopted OAuth 2.0 protocol.
[GitHub](https://github.com/Project-Catalyst/cauth-deliverables/tree/8692a135a23642e1e749567c85b37ed846521c1f/milestone%204)

### Why OAuth Bridge?

- Widespread Adoption: OAuth 2.0 is the industry standard for authorization, used by millions of applications worldwide. Many existing platforms and frameworks have built-in support for OAuth 2.0, making it the de-facto standard for authentication and authorization.
- Legacy System Integration: While Web3 technologies are growing, many organizations still rely on traditional Web2 applications. The OAuth bridge allows these systems to benefit from blockchain-based authentication without requiring major architectural changes.

### How OAuth 2.0 Works

1. User Initiates Login
    - User clicks "Login" on the application
    - Application redirects to the authorization server


2. Authorization Request
    - Application requests specific permissions (scopes)
    - User reviews and approves these permissions

3. Token Exchange

    - Authorization server provides an authorization code
    - Application exchanges this code for access tokens
    - Tokens are used to access protected resources


### How the cAuth OAuth Bridge Works

#### Bridge as Authorization Server

The bridge acts as an OAuth 2.0 authorization server
It verifies NFT credentials on the Cardano blockchain

##### Authentication Flow

 - User initiates login with Web2 application
 - Bridge connects to user's Cardano wallet
 - Bridge verifies NFT credential
 - Upon verification, bridge issues OAuth tokens
 - Web2 application receives standard OAuth response


##### Token Management

- Bridge manages token lifecycle
- Handles token refresh and revocation
- Maps OAuth sessions to blockchain credentials

#### Implementation Benefits

- No Code Changes: Web2 applications can implement cAuth using existing OAuth libraries
- Standard Compliance: Follows OAuth 2.0 specification for maximum compatibility
- Security: Leverages both OAuth security practices and blockchain verification
- Flexibility: Supports various OAuth flows (Authorization Code, Implicit, etc.)

[demo](https://wiki.cauth.org/login)

<iframe width="560" height="315" src="https://www.youtube.com/embed/ff2XFuq8S3o?si=vh_AKkA1ef83_m9T" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>