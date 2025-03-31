---
title: Getting Started
date: 2025-01-21T14:48:21.446Z
weight: 1
---

CAuth consists of several components that allow for integration of the mechanism on new and existing sites.

### State of the Art Report

At the beginning of the project we have created state of the art report. This deliverable was first milestone of the project. Its purpose was to establish groundlevel for the project.
The report can be read [here](https://github.com/Project-Catalyst/cauth-deliverables/tree/main/milestone%201)

### NFT Issuer

cAuth NFT Issuer is a web application that enables authorized parties to generate and issue authentication credentials as NFTs on the Cardano blockchain. Connect your CIP-30 compatible wallet, specify credential parameters, and mint authentication tokens directly to user wallets. These NFTs serve as blockchain-based login credentials for applications implementing the cAuth authentication system. [link]({{< ref "nft-issuer" >}})


### Frontend and Backend libraries

For new applications or existing dapps we have created libraries in Typescript for front and backend. They allow integration with CAuth mechanism.
Both libraries are designed to work together seamlessly but can be used independently based on your application's needs. [link]({{< ref "libraries" >}})

### OAuth Bridge

The OAuth bridge enables traditional Web2 applications to authenticate users through Cardano NFT credentials. This bridge acts as a translator between blockchain-based authentication and the widely-adopted OAuth 2.0 protocol. [link]({{< ref "oauth-bridge" >}})
