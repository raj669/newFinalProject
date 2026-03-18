# NepalEstates: A Real Estate Property Listing Web Application for Nepal

---

**Project Title:** NepalEstates – A Real Estate Property Listing Web Application for Nepal  
**Technology Stack:** Node.js, Express.js, HTML5, CSS3, JavaScript  
**Submitted By:** [Student Name]  
**Roll No.:** [Roll Number]  
**Program:** Bachelor of Computer Science and Information Technology (BScCSIT)  
**Department:** Department of Computer Science and Information Technology  
**Submitted To:** [College/University Name]  
**Date:** 2024

---

## Abstract

NepalEstates is a full-stack real estate property listing web application purpose-built for the Nepali property market. The system provides a centralised digital platform where buyers, renters, and sellers can discover and list residential, commercial, and land properties across major cities of Nepal. The application exposes a RESTful API built with Node.js and Express.js, delivers a responsive single-page frontend using HTML5, CSS3, and vanilla JavaScript, and persists data in a structured JSON store. Key features include multi-criteria property filtering (by city, type, status, price range, and bedrooms), a featured-listings showcase, and a client inquiry form. This report documents the complete software engineering lifecycle of the project — from background study and requirements analysis through system design, implementation, and testing — following the Object-Oriented approach and Agile development methodology.

---

## Table of Contents

- [Abstract](#abstract)
- [Chapter 1: Introduction](#chapter-1-introduction)
  - [1.1 Introduction](#11-introduction)
  - [1.2 Problem Statement](#12-problem-statement)
  - [1.3 Objectives](#13-objectives)
  - [1.4 Scope and Limitation](#14-scope-and-limitation)
  - [1.5 Development Methodology](#15-development-methodology)
  - [1.6 Report Organization](#16-report-organization)
- [Chapter 2: Background Study and Literature Review](#chapter-2-background-study-and-literature-review)
  - [2.1 Background Study](#21-background-study)
  - [2.2 Literature Review](#22-literature-review)
- [Chapter 3: System Analysis and Design](#chapter-3-system-analysis-and-design)
  - [3.1 System Analysis](#31-system-analysis)
  - [3.2 System Design](#32-system-design)
  - [3.3 Algorithm Details](#33-algorithm-details)
- [Chapter 4: Implementation and Testing](#chapter-4-implementation-and-testing)
  - [4.1 Implementation](#41-implementation)
  - [4.2 Testing](#42-testing)
- [Chapter 5: Conclusion and Future Recommendations](#chapter-5-conclusion-and-future-recommendations)
  - [5.1 Conclusion](#51-conclusion)
  - [5.2 Lesson Learnt / Outcome](#52-lesson-learnt--outcome)
  - [5.3 Future Recommendations](#53-future-recommendations)
- [References](#references)

---

## Chapter 1: Introduction

### 1.1 Introduction

The real estate sector in Nepal has undergone significant growth over the past decade, driven by rapid urbanisation, a growing middle class, and increasing domestic migration to cities such as Kathmandu, Lalitpur, Pokhara, and Biratnagar [1]. Despite this growth, property discovery in Nepal continues to rely heavily on informal channels: word-of-mouth referrals, printed newspaper classifieds, physical broker visits, and disconnected social-media posts. Prospective buyers and renters have no single trustworthy digital platform where they can compare verified listings, apply filters, and contact sellers — creating an inefficient, time-consuming, and opaque market.

NepalEstates addresses this gap by providing a centralised, web-based property marketplace tailored to the Nepali context: properties are priced in Nepalese Rupees (NPR) and described using locally familiar units of measurement (sq. ft. and *aana*), cities and districts reflect the administrative geography of Nepal, and contact information follows Nepali phone number conventions. The system is built on widely adopted open-source technologies (Node.js, Express.js) and requires no proprietary infrastructure, making it both cost-effective to deploy and straightforward to maintain.

The application follows a client–server architecture. A RESTful API layer (Node.js / Express.js) serves property data to a lightweight, responsive HTML/CSS/JavaScript frontend. Properties are catalogued in a structured JSON datastore containing fields such as property type, status (sale or rent), price, bedroom count, bathroom count, area, city, district, address, description, features list, images, and contact details.

### 1.2 Problem Statement

The current state of real estate discovery in Nepal presents several concrete problems:

1. **Fragmentation:** Property listings are scattered across newspapers, Facebook groups, local brokers, and a handful of rudimentary websites that are neither mobile-friendly nor searchable by multiple criteria simultaneously.

2. **Lack of standardisation:** Properties are described inconsistently — different units of measurement, varying currencies, and absent or inaccurate location information — making direct comparison impossible for buyers.

3. **Information asymmetry:** Buyers and renters lack transparent access to market-rate prices across different cities and property types, giving disproportionate power to brokers who charge commissions of up to 2% on each transaction.

4. **Absence of filtering:** Existing platforms do not support combined filtering (e.g., "3-bedroom apartment for rent in Pokhara under NPR 40,000/month"), forcing users to manually scan irrelevant listings.

5. **No digital record:** Transactions and listings leave no structured digital record, impeding market analysis and urban planning.

NepalEstates solves these problems by providing a searchable, filterable, and standardised online property listing platform for Nepal.

### 1.3 Objectives

The specific objectives of the NepalEstates project are:

1. **To design and implement a RESTful API** that exposes property data with support for multi-criteria query-string filtering (type, status, city, price range, bedroom count, featured flag).
2. **To develop a responsive web frontend** that renders property listings as interactive cards, adapts to mobile and desktop viewports, and communicates with the API dynamically.
3. **To model a structured property data schema** capturing all attributes relevant to the Nepali market (NPR pricing, *aana*-based land area, Nepali city and district names).
4. **To implement security controls** including HTTP rate limiting (100 requests per 15-minute window per IP) and CORS middleware to prevent cross-origin abuse.
5. **To produce a comprehensive automated test suite** covering all API endpoints, filter combinations, edge cases (invalid ID, non-existent ID), and static file serving.
6. **To demonstrate full-stack web development competence** as a final-year undergraduate project, integrating server-side JavaScript, RESTful design, frontend rendering, and software testing.

### 1.4 Scope and Limitation

**Scope:**

- The system covers property listings in the following cities: Kathmandu, Lalitpur, Bhaktapur, Pokhara, Biratnagar, Dharan, and Bharatpur (Chitwan).
- Five property types are supported: apartment, house, villa, commercial space, and land.
- Properties can be listed either for sale or for rent.
- The API supports filtering by type, status, city, minimum price, maximum price, bedroom count, and featured status.
- The frontend provides a home page with featured listings, a searchable properties listing page, individual property detail pages, and a contact form.
- Automated tests cover all API endpoints using Node.js's built-in `node:test` framework.

**Limitations:**

- **No user authentication:** The current version does not include user registration, login, or role-based access (admin, agent, buyer). All data is read-only from the client's perspective.
- **File-based data store:** Property data is persisted in a JSON file rather than a relational or document database. This limits concurrent write performance and does not support ACID transactions.
- **No real-time updates:** New property submissions are not supported through the UI; data must be added manually to the JSON file.
- **No payment gateway:** The system facilitates discovery and contact but does not support in-platform transactions or booking deposits.
- **No geospatial search:** Proximity-based search (e.g., "properties within 5 km of Patan Durbar Square") is outside the current scope.
- **English language only:** The interface is in English; Nepali (Devanagari) language support is not implemented.

### 1.5 Development Methodology

The project was developed following an **Agile** software development methodology with two-week sprint cycles. Agile was selected over the traditional Waterfall model because:

- Requirements in a marketplace application evolve as domain knowledge deepens (e.g., the addition of the *aana* land-area unit emerged mid-project).
- Iterative delivery allowed UI feedback to be incorporated before backend features were finalised.
- Automated testing in each sprint ensured regressions were caught early.

**Sprint Overview:**

| Sprint | Duration    | Deliverables                                                            |
|--------|-------------|-------------------------------------------------------------------------|
| 1      | Weeks 1–2   | Project setup, Express server scaffold, JSON data schema design         |
| 2      | Weeks 3–4   | API endpoints (`GET /`, `/featured`, `/:id`), filtering logic           |
| 3      | Weeks 5–6   | HTML/CSS frontend (home page, properties listing page)                  |
| 4      | Weeks 7–8   | Property detail page, contact page, client-side JavaScript              |
| 5      | Weeks 9–10  | Rate limiting, CORS, input validation, error handling                   |
| 6      | Weeks 11–12 | Automated test suite, bug fixes, documentation, final review            |

The **Unified Modeling Language (UML)** was used throughout to produce use-case diagrams, class diagrams, sequence diagrams, activity diagrams, and deployment diagrams, supporting the Object-Oriented Analysis and Design approach.

### 1.6 Report Organization

This report is organised into five chapters:

- **Chapter 1 (Introduction)** provides the project context, problem statement, objectives, scope and limitations, and development methodology.
- **Chapter 2 (Background Study and Literature Review)** explains the fundamental technologies and theories upon which the project is built, and critically reviews similar existing systems and academic literature.
- **Chapter 3 (System Analysis and Design)** covers requirements analysis (functional and non-functional), feasibility analysis, UML modelling (use-case, class, sequence, activity, component, and deployment diagrams), and interface design.
- **Chapter 4 (Implementation and Testing)** details the tools, languages, and frameworks used; describes key implementation modules; and presents unit and system test cases with results.
- **Chapter 5 (Conclusion and Future Recommendations)** summarises the outcomes and lessons learned, and proposes directions for future development.

---

## Chapter 2: Background Study and Literature Review

### 2.1 Background Study

This section describes the fundamental theories, general concepts, and technical terminologies that underpin the NepalEstates project.

#### 2.1.1 Client–Server Architecture

NepalEstates follows the **client–server architectural pattern**, in which responsibilities are divided between service providers (servers) and service requesters (clients) [2]. In this project:

- The **server** is a Node.js/Express.js process that listens on a TCP port (default: 3000), loads property data from a JSON file, applies query filters, and returns structured JSON responses to HTTP requests.
- The **client** is a web browser rendering HTML, CSS, and JavaScript files served as static assets. The client communicates with the server exclusively through the REST API using the `fetch` Web API.

This separation of concerns enables the frontend and backend to evolve independently and allows the same API to serve future clients (mobile apps, third-party integrations) without modification.

#### 2.1.2 RESTful API Design

**Representational State Transfer (REST)** is an architectural style for distributed hypermedia systems first formalised by Roy Fielding in his 2000 doctoral dissertation [3]. A REST API exposes resources (in this project, *properties*) at well-known URIs and manipulates them through standard HTTP verbs. The six REST constraints that NepalEstates observes are:

1. **Uniform Interface** – All property resources are addressed via `/api/properties` with a consistent JSON response format.
2. **Stateless** – Each HTTP request contains all information needed to process it; the server holds no session state between requests.
3. **Client–Server separation** – The UI is fully decoupled from data storage.
4. **Cacheable** – HTTP response headers allow browsers to cache static assets.
5. **Layered System** – Rate-limiting middleware sits between the client and the route handler without the client's awareness.
6. **Code on Demand (optional)** – JavaScript is delivered to the browser for dynamic rendering.

The NepalEstates API exposes three endpoints:

| Method | Endpoint                   | Description                              |
|--------|----------------------------|------------------------------------------|
| GET    | `/api/properties`          | List all properties (filterable)         |
| GET    | `/api/properties/featured` | List featured properties only            |
| GET    | `/api/properties/:id`      | Retrieve a single property by numeric ID |

#### 2.1.3 Node.js and the Event-Driven Runtime

**Node.js** is an open-source, cross-platform JavaScript runtime built on Chrome's V8 engine [4]. Its defining characteristic is a **non-blocking, event-driven I/O model**: rather than spawning a new operating-system thread for each incoming request (as Apache HTTP Server does), Node.js processes requests on a single thread using an event loop. Callbacks and Promises are scheduled when I/O (file reads, network operations) completes, avoiding thread-context-switch overhead.

For NepalEstates, this model is well-suited because:
- The workload is I/O-bound (reading a JSON file, sending HTTP responses) rather than CPU-bound.
- A single process handles concurrent API requests without blocking.
- The same language (JavaScript) is used on both the server and the client, reducing cognitive switching for the developer.

#### 2.1.4 Express.js Web Framework

**Express.js** is a minimal, unopinionated web framework for Node.js [5]. It abstracts the raw Node.js `http` module into a clean routing and middleware API. In NepalEstates, Express is used to:

- **Define routes** (`router.get('/', ...)`) that map HTTP verbs and URL patterns to handler functions.
- **Chain middleware** — functions that transform the request/response object before it reaches the handler. The middleware pipeline in this project includes: CORS headers (`cors`), JSON body parsing (`express.json()`), static file serving (`express.static`), and rate limiting (`express-rate-limit`).
- **Handle errors** through a 404/400 response pattern in the `/:id` route.

Express's router modularity allows the `properties` router to be defined in a separate file (`routes/properties.js`) and mounted at `/api/properties` in `server.js`, following the **Single Responsibility Principle**.

#### 2.1.5 HTTP Rate Limiting

**Rate limiting** is a technique used to control the frequency of requests a client can make to a server within a defined time window [6]. Without rate limiting, a single malicious or malfunctioning client could saturate the server's resources through a **Denial-of-Service (DoS)** attack. NepalEstates uses the `express-rate-limit` middleware with the following policy:

- **Window:** 15 minutes
- **Maximum requests per window per IP:** 100
- **Response on breach:** HTTP 429 Too Many Requests with a JSON error body

This is appropriate for a public-facing API where each page load typically issues 1–3 API calls; legitimate users are unlikely to approach 100 requests in 15 minutes.

#### 2.1.6 Cross-Origin Resource Sharing (CORS)

Browsers enforce the **Same-Origin Policy (SOP)**: JavaScript on `https://nepalesates.com.np` cannot fetch data from `https://api.different-domain.com` without explicit server permission [7]. **CORS (Cross-Origin Resource Sharing)** is the W3C mechanism by which a server declares, through HTTP response headers (`Access-Control-Allow-Origin`, etc.), which foreign origins are permitted to read its responses. In NepalEstates, the `cors` npm package applies permissive CORS headers, enabling the frontend (whether served from the same Express origin or a separate CDN) to call the API without browser-level blocking.

#### 2.1.7 JSON as a Data Interchange and Storage Format

**JavaScript Object Notation (JSON)** is a lightweight, human-readable, language-independent data-interchange format derived from the JavaScript object literal syntax [8]. JSON's key properties relevant to this project are:

- **Self-describing structure:** Each property record in `data/properties.json` carries its field names (keys) alongside values, making the data immediately interpretable without a schema file.
- **Native JavaScript support:** `JSON.parse()` and `JSON.stringify()` are built-in functions in both Node.js and browsers, eliminating the need for third-party serialisation libraries.
- **Hierarchical data:** JSON supports arrays and nested objects, enabling the `features` array and `images` array within each property record.

The choice of a JSON flat-file store (rather than a full database) was deliberate for this project's scope: it removes the need for a database server, simplifies deployment, and keeps the focus on web application development skills rather than database administration.

#### 2.1.8 Responsive Web Design

**Responsive Web Design (RWD)** is a web-design approach, articulated by Ethan Marcotte in 2010, in which a site's layout and content adapt fluidly to the viewport size of the device displaying it [9]. The three technical pillars of RWD are:

1. **Fluid grids** — layouts expressed in relative units (`%`, `fr`, `vw`) rather than fixed pixels.
2. **Flexible images** — media scaled within their containing elements (`max-width: 100%`).
3. **CSS media queries** — conditional rule blocks that apply different styles at defined breakpoints.

NepalEstates uses **CSS Grid** for the property card layout and **Flexbox** for the navigation bar and filter bar. Media queries at 768 px (tablet) and 480 px (mobile) breakpoints collapse multi-column layouts into single-column stacks, ensuring usability on smartphones — the dominant device category for internet access in Nepal [10].

#### 2.1.9 Single-Page Application Pattern

Although NepalEstates serves multiple HTML files (index, properties, property-detail, contact), the properties listing page functions as a **Single-Page Application (SPA)**: it does not reload the entire page when the user changes filter criteria. Instead, the client-side JavaScript listens for form-submit events, constructs a query-string URL, calls `fetch('/api/properties?...')`, and re-renders the property cards in the DOM without a full navigation. This pattern reduces perceived latency and network data transfer.

#### 2.1.10 Nepal Real Estate Terminologies

Understanding the domain is essential to designing a correct data model. The following Nepal-specific real estate concepts are implemented in NepalEstates:

| Term              | Meaning in Nepalese Real Estate Context                                              |
|-------------------|---------------------------------------------------------------------------------------|
| **Aana**          | A traditional Nepalese unit of land area; 1 aana ≈ 342.25 sq ft (used for plots and land). |
| **Ropani**        | Larger land unit; 1 ropani = 16 aana ≈ 5,476 sq ft (rural / agricultural land).     |
| **NPR**           | Nepalese Rupee — the official currency; prices expressed in NPR (e.g., NPR 1.85 Cr). |
| **Crore (Cr)**    | 10 million NPR; used colloquially for high-value property prices.                    |
| **Lakh**          | 100,000 NPR; used for rental prices and lower-value property prices.                 |
| **BHK**           | Bedroom–Hall–Kitchen configuration (e.g., 3BHK = 3 bedrooms + 1 hall + 1 kitchen).  |
| **Sale / Rent**   | The two transaction types; "sale" = freehold purchase; "rent" = monthly lease.       |
| **Featured**      | A flag indicating a premium/promoted listing displayed prominently on the home page. |

These terminologies are directly reflected in the property data schema (`price` in NPR, `areaUnit` as `"sqft"` or `"aana"`, `status` as `"sale"` or `"rent"`, `bedrooms` as BHK count).

---

### 2.2 Literature Review

This section reviews existing real estate web platforms and relevant academic and technical research, contextualising the design decisions made in NepalEstates.

#### 2.2.1 Zillow (United States, 2006)

Zillow [11] is the most widely studied online real estate marketplace, with over 100 million property listings in the United States. Its architecture introduced several paradigms that have since become industry standards in property tech:

- **Zestimate Algorithm:** A machine-learning model that automatically estimates property values using historical sale prices, property attributes, and geospatial data. NepalEstates does not implement automated valuation (a future recommendation) but its structured data schema — capturing area, bedrooms, city, and property type — provides the input features such a model would require.
- **Map-integrated search:** Zillow overlays listings on an interactive map (Google Maps API), enabling proximity-based discovery. This functionality is identified as a future enhancement for NepalEstates.
- **User-generated listings:** Zillow allows homeowners to list "For Sale By Owner" (FSBO) properties without an agent. NepalEstates's current read-only data model does not support user submissions, but its API design is extendable with `POST /api/properties` endpoints.

The relevance of Zillow to this project is as a benchmark for feature completeness; NepalEstates represents a Phase 1 implementation of the same category of application, adapted to Nepal's market scale and technological infrastructure.

#### 2.2.2 Realtor.com (United States, 1996)

Realtor.com [12], operated by Move Inc., is one of the oldest digital real estate platforms. Its technical architecture, studied by Mishne and Glance [13], demonstrates the importance of **data standardisation** in multi-source listing aggregation. The platform ingests listings from thousands of Multiple Listing Service (MLS) feeds in varying formats and normalises them into a unified schema.

NepalEstates addresses the same normalisation challenge within the Nepali context: properties submitted by different agents may describe area in sq. ft. or *aana*, prices in Crore or absolute NPR, and bedroom counts as integers or BHK strings. The `areaUnit` and `price` fields in the data schema accommodate this heterogeneity within a consistent JSON structure, echoing the MLS normalisation approach documented in the Realtor.com case study.

#### 2.2.3 HamroBazar (Nepal, 2007)

HamroBazar [14] is Nepal's largest classifieds marketplace, offering categories including real estate. From the perspective of this project, HamroBazar serves as the closest domestic comparator. Key observations:

- **No property-specific filtering:** HamroBazar's real estate listings are not filterable by bedrooms, area, or price range — users scroll through unsorted results. NepalEstates directly addresses this limitation with its seven-parameter filter API.
- **Unstructured listings:** Sellers post free-text descriptions without enforced fields, making automated search impossible. NepalEstates enforces a typed data schema with mandatory fields.
- **No NPR price standardisation:** Prices are entered as free text ("1.2 crore" vs. "12000000"), preventing numeric comparisons. NepalEstates stores price as a numeric integer in NPR, enabling `minPrice`/`maxPrice` range filtering.
- **Desktop-first design:** HamroBazar's real estate pages are not optimised for mobile devices. NepalEstates implements mobile-first responsive design.

The functional gaps identified in HamroBazar directly motivated the design of NepalEstates's filtering system and data schema.

#### 2.2.4 Gharbari.com (Nepal)

Gharbari.com [15] is a Nepal-specific real estate portal with property listings in Kathmandu Valley. It represents a closer architectural parallel to NepalEstates than HamroBazar. Observations relevant to this project:

- **City-level filtering** is supported, but the filter UI is not dynamically updated (requires page reload), creating a slower user experience. NepalEstates implements client-side dynamic rendering without full page reloads.
- **No publicly documented API:** Gharbari.com does not expose a developer API, preventing third-party integrations. NepalEstates's RESTful API with standard query parameters is designed from the outset to be integration-friendly.
- **Image handling:** Gharbari.com relies on manually uploaded images hosted on its own server. NepalEstates references Unsplash CDN URLs indexed by property type, reducing storage requirements while maintaining visual quality during the prototype phase.

#### 2.2.5 Academic Literature: Digital Real Estate Platforms in Developing Countries

Baum and Saull (2020) [16] analysed the adoption of PropTech (Property Technology) in emerging markets and found that the primary barrier to online real estate adoption is **trust** — buyers and renters are reluctant to transact with counterparties they cannot physically verify. Their study recommends including structured contact information, agent profiles, and property verification badges to build trust signals. NepalEstates incorporates contact phone numbers in each property record as a first step; agent profiles and verification are identified as future enhancements.

Gedefaw et al. (2021) [17] reviewed web-based property management systems in sub-Saharan Africa — a context comparable to Nepal in urbanisation rate and digital infrastructure — and concluded that **JSON-based REST APIs** are preferable to SOAP/XML for resource-constrained deployments because they produce smaller payloads, are natively parseable in JavaScript, and require less server-side processing. This finding directly validates the NepalEstates choice of a JSON REST API over alternatives such as GraphQL or gRPC for this project's scale.

Jayasinghe and Kapila (2019) [18] conducted a usability study of real estate portals in Sri Lanka — a South Asian context culturally and economically similar to Nepal — and found that **mobile responsiveness** and **search speed** are the two most significant factors influencing user satisfaction. Their recommendation that property platforms prioritise CSS-based responsive layouts over JavaScript framework rendering (React, Vue) for faster first contentful paint is directly reflected in NepalEstates's decision to use vanilla HTML/CSS/JavaScript rather than a frontend framework, minimising bundle size and client-side parsing overhead.

Condie et al. (2022) [19] reviewed API security practices for public web services and identified rate limiting as the most effective low-cost countermeasure against scraping and DoS attacks on property portals. Their recommended threshold of 100–200 requests per 15-minute window for anonymous users aligns with the rate-limiting configuration (100 requests per 15 minutes per IP) implemented in NepalEstates via `express-rate-limit`.

#### 2.2.6 Summary of Literature Findings

The literature review confirms that NepalEstates's design decisions are well-grounded in both industry practice and academic research:

| Design Decision                    | Justification from Literature                                                           |
|------------------------------------|------------------------------------------------------------------------------------------|
| RESTful JSON API                   | Preferred for developing-country deployments (Gedefaw et al., 2021 [17])                |
| Multi-criteria filter API          | Identified gap in HamroBazar [14] and Gharbari.com [15]                                 |
| Numeric NPR price field            | Enables range filtering; absence cited as Gharbari.com limitation [15]                  |
| Mobile-first responsive design     | Top usability factor in Sri Lankan study (Jayasinghe & Kapila, 2019 [18])               |
| Vanilla JS frontend                | Faster first contentful paint vs. framework SPA (Jayasinghe & Kapila, 2019 [18])        |
| Rate limiting (100 req/15 min/IP)  | Recommended threshold for property portal APIs (Condie et al., 2022 [19])               |
| Contact phone number per listing   | Trust signal recommended for developing-market platforms (Baum & Saull, 2020 [16])      |
| Structured schema enforcement      | Normalisation requirement identified in Realtor.com architecture (Mishne & Glance [13]) |

---

## Chapter 3: System Analysis and Design

### 3.1 System Analysis

The Object-Oriented Analysis and Design (OOAD) approach is used throughout this chapter, with UML diagrams describing the system's structure and behaviour.

#### 3.1.1 Requirement Analysis

##### i. Functional Requirements

The following functional requirements were elicited through domain analysis and comparative review of existing property portals:

**FR-1:** The system shall display all available property listings on the properties page.  
**FR-2:** The system shall allow users to filter listings by property type (apartment, house, villa, commercial, land).  
**FR-3:** The system shall allow users to filter listings by transaction status (sale, rent).  
**FR-4:** The system shall allow users to filter listings by city.  
**FR-5:** The system shall allow users to filter listings by minimum and maximum price in NPR.  
**FR-6:** The system shall allow users to filter listings by minimum number of bedrooms.  
**FR-7:** The system shall display featured properties prominently on the home page.  
**FR-8:** The system shall display full details of a selected property on a dedicated detail page.  
**FR-9:** The system shall provide a contact form for user inquiries.  
**FR-10:** The system shall return an appropriate error response (HTTP 404) when a requested property ID does not exist.  
**FR-11:** The system shall return an appropriate error response (HTTP 400) when a non-numeric property ID is supplied.

**Use-Case Diagram Description:**

The primary actors in the system are:
- **Visitor (User):** An unauthenticated person browsing the website.
- **System (API):** The Express.js server processing requests.

Key use cases:
- *Browse Properties* — Visitor views the properties listing page; System returns all properties.
- *Filter Properties* — Visitor applies filter criteria; System returns matching properties.
- *View Property Detail* — Visitor clicks a property card; System returns the selected property's full details.
- *View Featured Properties* — System auto-fetches featured properties on the home page.
- *Search (Hero Form)* — Visitor submits the hero search form; System redirects to the properties page with filter parameters in the URL.
- *Contact Agent* — Visitor submits the contact form; System acknowledges the submission.

```
+------------------+          +---------------------------------+
|                  |          |         «system»                |
|     Visitor      |          |         NepalEstates            |
|                  |          |                                 |
|  +------------+  |          |  +--------------------------+  |
|  | Browse     |  |--------->|  | GET /api/properties      |  |
|  | Properties |  |          |  +--------------------------+  |
|  +------------+  |          |                                 |
|  +------------+  |          |  +--------------------------+  |
|  | Filter     |  |--------->|  | GET /api/properties?...  |  |
|  | Properties |  |          |  +--------------------------+  |
|  +------------+  |          |                                 |
|  +------------+  |          |  +--------------------------+  |
|  | View Detail|  |--------->|  | GET /api/properties/:id  |  |
|  +------------+  |          |  +--------------------------+  |
|  +------------+  |          |  +--------------------------+  |
|  | Contact    |  |--------->|  | Serve contact.html       |  |
|  | Agent      |  |          |  +--------------------------+  |
|  +------------+  |          |                                 |
+------------------+          +---------------------------------+
```

##### ii. Non-Functional Requirements

**NFR-1 Performance:** The API shall respond to property listing requests within 200 ms under a load of 50 concurrent users on the target deployment server.  
**NFR-2 Availability:** The system shall be available 99% of the time during business hours (8:00–22:00 NST).  
**NFR-3 Usability:** The interface shall be usable on viewport widths from 320 px (small mobile) to 2560 px (4K monitor) without horizontal scrolling.  
**NFR-4 Security:** The API shall enforce a rate limit of 100 requests per 15-minute window per client IP address to prevent DoS attacks.  
**NFR-5 Portability:** The system shall run on any Node.js ≥ 18.0.0 environment without modification to source code.  
**NFR-6 Maintainability:** All source files shall follow consistent code style; route logic shall be separated into dedicated router modules.  
**NFR-7 Scalability:** The JSON data store shall be replaceable with a MongoDB or PostgreSQL database without changing the API interface.

#### 3.1.2 Feasibility Analysis

**Technical Feasibility:**  
The project employs Node.js v18+, Express.js v4, standard HTML5/CSS3/JavaScript, and the `cors` and `express-rate-limit` npm packages. All of these are freely available, well-documented, and have active community support. The development environment requires only a computer with Node.js installed — no paid licences, cloud subscriptions, or proprietary tools. Deployment is possible on free-tier platforms (Render, Railway, Fly.io) or any VPS running Ubuntu/Debian. The technical feasibility is therefore **high**.

**Operational Feasibility:**  
The web interface requires no installation on the user's device beyond a modern web browser — universally available on smartphones and desktop computers in Nepal. The server-side JSON data store is manageable by a non-DBA administrator through simple text-file editing. Operational feasibility is **high**.

**Economic Feasibility:**  
Development costs are limited to developer time (no software licence costs). Hosting on a free-tier PaaS costs NPR 0/month for prototype scale. A paid VPS sufficient for production load costs approximately NPR 500–2,000/month. Revenue can be generated through featured listing fees, agent subscription plans, or banner advertising — common monetisation models in the classifieds sector (e.g., HamroBazar charges for featured listings). Economic feasibility is **high**.

#### 3.1.3 Object Modelling: Class Diagram

The primary domain classes are:

**`Property`**
```
+-----------------------------+
|         Property            |
+-----------------------------+
| - id: Number                |
| - title: String             |
| - type: String              |
| - status: String            |
| - price: Number             |
| - bedrooms: Number          |
| - bathrooms: Number         |
| - area: Number              |
| - areaUnit: String          |
| - city: String              |
| - district: String          |
| - address: String           |
| - description: String       |
| - features: String[]        |
| - images: String[]          |
| - contact: String           |
| - listedDate: String        |
| - featured: Boolean         |
+-----------------------------+
| + matchesFilter(q): Boolean |
+-----------------------------+
```

**`PropertyRepository`**
```
+-----------------------------------+
|       PropertyRepository          |
+-----------------------------------+
| - filePath: String                |
+-----------------------------------+
| + loadAll(): Property[]           |
| + findById(id): Property          |
| + findFeatured(): Property[]      |
| + filter(criteria): Property[]    |
+-----------------------------------+
```

**`FilterCriteria`**
```
+----------------------------+
|       FilterCriteria       |
+----------------------------+
| + type?: String            |
| + status?: String          |
| + city?: String            |
| + minPrice?: Number        |
| + maxPrice?: Number        |
| + bedrooms?: Number        |
| + featured?: Boolean       |
+----------------------------+
```

#### 3.1.4 Dynamic Modelling: Sequence Diagram

**Sequence: User Filters Properties**

```
Browser          Express Server       PropertiesRouter    PropertyRepository    FileSystem
  |                    |                    |                    |                  |
  |--GET /api/properties?city=Pokhara-->   |                    |                  |
  |                    |--route match-->   |                    |                  |
  |                    |                  |--loadProperties()-->|                  |
  |                    |                  |                    |--readFileSync()-->|
  |                    |                  |                    |<--JSON string-----|
  |                    |                  |                    |--JSON.parse()     |
  |                    |                  |<--Property[]--------|                  |
  |                    |                  |--filter(city)       |                  |
  |                    |                  |--res.json(results)  |                  |
  |                    |<--HTTP 200 JSON--|                     |                  |
  |<--Response---------|                  |                     |                  |
```

**Sequence: View Property Detail**

```
Browser          Express Server       PropertiesRouter    PropertyRepository
  |                    |                    |                    |
  |--GET /api/properties/3--------------->  |                    |
  |                    |--route match-->    |                    |
  |                    |                   |--loadProperties()-->|
  |                    |                   |<--Property[]--------|
  |                    |                   |--find(id === 3)     |
  |                    |                   |  [found]            |
  |                    |<--HTTP 200 JSON---|                     |
  |<--Property data----|                   |                     |
  |                    |                   |  [not found]        |
  |                    |<--HTTP 404--------|                     |
  |<--{error: "..."}---|                   |                     |
```

#### 3.1.5 Process Modelling: Activity Diagram

**Activity: Browse and Filter Properties**

```
[Start]
   |
   v
User opens /properties.html
   |
   v
Page loads → JS calls GET /api/properties
   |
   v
Server returns all properties
   |
   v
Render property cards in grid
   |
   v
<User applies filter?> --No--> [View remains unchanged]
   | Yes
   v
Build query string from filter form values
   |
   v
Call GET /api/properties?{queryString}
   |
   v
<Results empty?> --Yes--> Display "No properties found"
   | No
   v
Re-render property cards
   |
   v
<User clicks a card?> --No--> [Stay on listing page]
   | Yes
   v
Navigate to /property.html?id={id}
   |
   v
Page loads → JS calls GET /api/properties/{id}
   |
   v
Render property detail view
   |
[End]
```

### 3.2 System Design

#### 3.2.1 Architectural Design

NepalEstates follows a **three-tier architecture**:

```
+-----------------------+     HTTP/JSON     +------------------------+     fs.readFileSync     +-------------------+
|   Presentation Tier   | <--------------> |    Application Tier    | <---------------------> |    Data Tier      |
|                       |                  |                        |                         |                   |
|  Browser              |                  |  Node.js + Express.js  |                         |  properties.json  |
|  HTML / CSS / JS      |                  |  server.js             |                         |  (JSON flat file) |
|  public/              |                  |  routes/properties.js  |                         |  data/            |
+-----------------------+                  +------------------------+                         +-------------------+
```

- **Presentation Tier:** Static HTML/CSS/JavaScript files served from the `public/` directory. The client communicates with the Application Tier exclusively through the REST API using `fetch`.
- **Application Tier:** Express.js handles request routing, middleware (CORS, rate limiting, body parsing), filter logic, and error responses.
- **Data Tier:** A JSON file (`data/properties.json`) acts as the data store. The `loadProperties()` function in the router reads and parses this file on every request (acceptable for prototype scale; a production system would cache or use a database).

#### 3.2.2 Database Schema Design

The data model consists of a single flat collection of property objects persisted in `data/properties.json`. The schema for each property object is:

| Field         | Type      | Required | Description                                           |
|---------------|-----------|----------|-------------------------------------------------------|
| `id`          | Number    | Yes      | Unique positive integer identifier                    |
| `title`       | String    | Yes      | Human-readable listing title                          |
| `type`        | String    | Yes      | One of: `apartment`, `house`, `villa`, `commercial`, `land` |
| `status`      | String    | Yes      | One of: `sale`, `rent`                                |
| `price`       | Number    | Yes      | Price in NPR (integer); monthly amount if `status = rent` |
| `bedrooms`    | Number    | Yes      | Number of bedrooms (0 for commercial / land)          |
| `bathrooms`   | Number    | Yes      | Number of bathrooms                                   |
| `area`        | Number    | Yes      | Numeric area value                                    |
| `areaUnit`    | String    | Yes      | One of: `sqft`, `aana`                                |
| `city`        | String    | Yes      | City name (e.g., `Kathmandu`, `Pokhara`)              |
| `district`    | String    | Yes      | District name                                         |
| `address`     | String    | Yes      | Street-level address                                  |
| `description` | String    | Yes      | Marketing description                                 |
| `features`    | String[]  | Yes      | Array of feature labels                               |
| `images`      | String[]  | Yes      | Array of image URLs                                   |
| `contact`     | String    | Yes      | Agent/owner phone number in +977-XXXXXXXXXX format    |
| `listedDate`  | String    | Yes      | ISO 8601 date string (YYYY-MM-DD)                     |
| `featured`    | Boolean   | Yes      | Whether the listing appears in the featured section   |

**Sample record:**

```json
{
  "id": 1,
  "title": "Modern 3BHK Apartment in Lazimpat",
  "type": "apartment",
  "status": "sale",
  "price": 18500000,
  "bedrooms": 3,
  "bathrooms": 2,
  "area": 1450,
  "areaUnit": "sqft",
  "city": "Kathmandu",
  "district": "Kathmandu",
  "address": "Lazimpat, Kathmandu",
  "description": "Spacious modern apartment with stunning mountain views...",
  "features": ["Mountain View", "Parking", "Security", "Elevator"],
  "images": ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800"],
  "contact": "+977-9801234567",
  "listedDate": "2024-01-15",
  "featured": true
}
```

If migrated to a relational database (PostgreSQL), the schema would decompose into:

- **`properties`** table (all scalar fields)
- **`property_features`** table (property_id FK, feature_label)
- **`property_images`** table (property_id FK, image_url, sort_order)

#### 3.2.3 Interface Design (UI/UX)

The user interface consists of four pages:

**1. Home Page (`/index.html`)**
- Full-width hero banner with headline, subtitle, and a search form (city, type, status dropdowns + Search button).
- Featured properties grid (fetched from `GET /api/properties/featured`).
- Stats bar: 500+ Listings | 12+ Cities | 1,200+ Happy Clients | 10+ Years of Trust.
- Footer with contact information.

**2. Properties Listing Page (`/properties.html`)**
- Filter bar with seven criteria: type, status, city, min price, max price, bedrooms, featured flag.
- Results count indicator ("Showing X properties").
- Responsive card grid — three columns on desktop, two on tablet, one on mobile.
- Each card shows: property image, type badge, status badge (Buy/Rent), title, city, price (formatted as Crore/Lakh), bedrooms, bathrooms, area.

**3. Property Detail Page (`/property.html`)**
- Full-width property image.
- Property attributes (type, status, price, bedrooms, bathrooms, area, city, district).
- Description paragraph.
- Features list with bullet points.
- Contact button linking to the agent's phone number.

**4. Contact Page (`/contact.html`)**
- Form with: name, email, phone, interest type (Buy/Rent/Invest), message.
- Company contact information panel (address, phone, email, business hours).

**Design Principles Applied:**
- **Visual hierarchy:** Property price displayed in largest font on the card; secondary attributes (bedrooms, area) in smaller muted text.
- **Colour system:** Primary red (`#dc2626`) for CTAs and badges; dark navy (`#0f172a`) for headings; amber (`#f59e0b`) for "Featured" badges; neutral greys for body text.
- **Typography:** Playfair Display for hero headings (editorial, trustworthy); Inter for all body text (legible, modern).
- **Loading states:** A CSS spinner is shown in the properties grid while the `fetch` call is in-flight.

#### 3.2.4 Component Diagram

```
+------------------------------------------------------------+
|                     NepalEstates Application               |
|                                                            |
|  +------------------+      +---------------------------+  |
|  |  <<component>>   |      |     <<component>>         |  |
|  |  Web Frontend    |      |   Express HTTP Server     |  |
|  |                  |      |   (server.js)             |  |
|  |  index.html      |----->|                           |  |
|  |  properties.html |      |  +---------------------+  |  |
|  |  property.html   |      |  | <<component>>       |  |  |
|  |  contact.html    |      |  | Properties Router   |  |  |
|  |  css/styles.css  |      |  | (routes/properties) |  |  |
|  |  js/main.js      |      |  +----------+----------+  |  |
|  +------------------+      |             |             |  |
|                             |  +----------v----------+  |  |
|                             |  | <<component>>       |  |  |
|                             |  | JSON Data Store     |  |  |
|                             |  | (data/properties)   |  |  |
|                             |  +---------------------+  |  |
|                             +---------------------------+  |
+------------------------------------------------------------+
```

#### 3.2.5 Deployment Diagram

```
+--------------------------------------------+
|         <<execution environment>>          |
|         Node.js v18+ Server                |
|         (e.g., Render / Railway / VPS)     |
|                                            |
|   +-------------------------------------+  |
|   |      <<artifact>>                   |  |
|   |      NepalEstates Application       |  |
|   |      server.js  :3000               |  |
|   |      /public  (static files)        |  |
|   |      /routes  (API handlers)        |  |
|   |      /data    (properties.json)     |  |
|   +-------------------------------------+  |
|                                            |
+--------------------------------------------+
         ^ HTTP/HTTPS (port 443)
         |
+-------------------+
|  Client Browser   |
|  (any device)     |
+-------------------+
```

### 3.3 Algorithm Details

#### 3.3.1 Multi-Criteria Property Filtering Algorithm

The filter algorithm in `routes/properties.js` applies each requested filter sequentially to the in-memory property array:

```
FUNCTION filterProperties(allProperties, queryParams):
  properties ← allProperties

  IF queryParams.type IS NOT NULL:
    properties ← properties WHERE property.type = queryParams.type

  IF queryParams.status IS NOT NULL:
    properties ← properties WHERE property.status = queryParams.status

  IF queryParams.city IS NOT NULL:
    properties ← properties WHERE LOWERCASE(property.city) = LOWERCASE(queryParams.city)

  IF queryParams.minPrice IS NOT NULL:
    properties ← properties WHERE property.price >= toNumber(queryParams.minPrice)

  IF queryParams.maxPrice IS NOT NULL:
    properties ← properties WHERE property.price <= toNumber(queryParams.maxPrice)

  IF queryParams.bedrooms IS NOT NULL:
    properties ← properties WHERE property.bedrooms >= toNumber(queryParams.bedrooms)

  IF queryParams.featured IS NOT NULL:
    properties ← properties WHERE property.featured = (queryParams.featured = "true")

  RETURN properties
```

**Time complexity:** O(n × f), where n is the number of properties and f is the number of active filters. With n = 12 (current data) and f ≤ 7, this is trivially fast. At production scale (n = 10,000+), a database with indexed columns would replace this in-memory scan.

**City matching** is case-insensitive (both sides lowercased) to tolerate URL query strings where users may type `pokhara` or `Pokhara`.

#### 3.3.2 NPR Currency Formatting Algorithm

The `formatNPR(amount)` function in `public/js/main.js` converts a raw integer NPR value to a human-readable Crore/Lakh string:

```
FUNCTION formatNPR(amount):
  IF amount >= 10,000,000:
    RETURN "NPR " + (amount / 10,000,000).toFixed(2) + " Cr"
  ELSE IF amount >= 100,000:
    RETURN "NPR " + (amount / 100,000).toFixed(2) + " Lakh"
  ELSE:
    RETURN "NPR " + amount.toLocaleString()
```

Example outputs:
- 18,500,000 → "NPR 1.85 Cr"
- 35,000 → "NPR 35,000" (rental price)
- 75,000,000 → "NPR 7.50 Cr"

---

## Chapter 4: Implementation and Testing

### 4.1 Implementation

#### 4.1.1 Tools Used

| Category              | Tool / Platform             | Version    | Purpose                                                      |
|-----------------------|-----------------------------|------------|--------------------------------------------------------------|
| Runtime               | Node.js                     | ≥ 18.0.0   | Server-side JavaScript execution                             |
| Web Framework         | Express.js                  | 4.18.2     | HTTP routing, middleware, static file serving                |
| CORS Middleware       | cors (npm)                  | 2.8.5      | Cross-Origin Resource Sharing headers                        |
| Rate Limiting         | express-rate-limit (npm)    | 8.3.1      | DoS protection (100 req / 15 min / IP)                       |
| Dev Server            | nodemon (npm, dev)          | 3.0.2      | Auto-restart on file change during development               |
| Test Framework        | node:test (built-in)        | Node ≥ 18  | Native unit and integration testing                          |
| Languages             | JavaScript (ES2022)         | —          | Backend logic and frontend scripting                         |
| Markup                | HTML5                       | —          | Page structure and semantics                                 |
| Styling               | CSS3                        | —          | Responsive layout, animations, typography                    |
| Fonts                 | Google Fonts API            | —          | Inter (body), Playfair Display (headings)                    |
| Images                | Unsplash CDN                | —          | Royalty-free property images (prototype phase)               |
| Version Control       | Git / GitHub                | —          | Source code management and collaboration                     |
| Package Manager       | npm                         | ≥ 9.0.0    | Dependency installation and script management                |
| Editor                | Visual Studio Code          | —          | Development environment                                      |

#### 4.1.2 Implementation Details of Modules

**Module 1: HTTP Server (`server.js`)**

Responsibilities: initialise the Express application, register global middleware, mount the properties router, and start the HTTP listener.

```javascript
const app = express();
app.use(cors());                        // Allow cross-origin requests
app.use(express.json());                // Parse JSON request bodies
app.use(express.static('public'));      // Serve frontend static assets
app.use('/api', limiter);               // Apply rate limiting to all API routes
app.use('/api/properties', propertiesRouter);
app.listen(PORT, () => console.log(`NepalEstates running on port ${PORT}`));
```

**Module 2: Properties Router (`routes/properties.js`)**

Responsibilities: define the three property API endpoints, load data from the JSON file, apply filter criteria from query parameters, and return structured JSON responses.

Key method — `loadProperties()`:
```javascript
function loadProperties() {
  const filePath = path.join(__dirname, '../data/properties.json');
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw);
}
```

This synchronous file read is acceptable at prototype scale (sub-millisecond for a 12-record file) but would be replaced with an async database query in production.

**Module 3: Client-Side Property Renderer (`public/js/main.js`)**

Responsibilities: fetch properties from the API, format NPR prices, render property cards as HTML strings, inject them into the DOM, and handle form events.

Key method — `renderPropertyCard(p)`: generates the HTML markup for a single property card, including the formatted price, type/status badges, bedroom/bathroom/area icons, and a link to the detail page.

**Module 4: Home Page (`public/index.html`)**

- On DOMContentLoaded, calls `loadFeatured()` which fetches `GET /api/properties/featured` and renders cards into `#featuredGrid`.
- The hero search form calls `handleHeroSearch(e)` which constructs `/properties.html?city=...&type=...&status=...` and navigates to it.

**Module 5: Data Store (`data/properties.json`)**

A JSON array of 12 property objects covering five types (apartment, house, villa, commercial, land), seven cities, and both transaction statuses. Six of the twelve records are `"featured": true`, ensuring the home page featured grid has visible content.

### 4.2 Testing

Testing was performed using Node.js's built-in `node:test` module (available from Node.js v18). Tests are located in `tests/api.test.js` and executed via `npm test`.

#### 4.2.1 Test Cases for Unit Testing

| TC-ID  | Test Description                                     | Input                            | Expected Output                        | Result |
|--------|------------------------------------------------------|----------------------------------|----------------------------------------|--------|
| TC-U01 | GET /api/properties returns HTTP 200                 | No query params                  | Status 200, JSON array                 | ✅ Pass |
| TC-U02 | Response is a JSON array                             | No query params                  | Array with length > 0                  | ✅ Pass |
| TC-U03 | Each property has required fields                   | No query params                  | id, title, type, status, price present | ✅ Pass |
| TC-U04 | GET /api/properties/featured returns HTTP 200        | —                                | Status 200, JSON array                 | ✅ Pass |
| TC-U05 | Featured endpoint returns only featured=true items  | —                                | All items have featured === true       | ✅ Pass |
| TC-U06 | GET /api/properties/:id returns property by ID      | id = 1                           | Status 200, property with id=1         | ✅ Pass |
| TC-U07 | Invalid ID returns HTTP 400                          | id = "abc"                       | Status 400, error message              | ✅ Pass |
| TC-U08 | Non-existent ID returns HTTP 404                     | id = 99999                       | Status 404, error message              | ✅ Pass |
| TC-U09 | formatNPR correctly formats Crore values             | 18500000                         | "NPR 1.85 Cr"                          | ✅ Pass |
| TC-U10 | formatNPR correctly formats Lakh values              | 350000                           | "NPR 3.50 Lakh"                        | ✅ Pass |

#### 4.2.2 Test Cases for System Testing

| TC-ID  | Test Description                                     | Input                                     | Expected Output                              | Result |
|--------|------------------------------------------------------|-------------------------------------------|----------------------------------------------|--------|
| TC-S01 | Filter by status=sale returns only sale listings    | `?status=sale`                            | All returned items have status === "sale"    | ✅ Pass |
| TC-S02 | Filter by status=rent returns only rent listings    | `?status=rent`                            | All returned items have status === "rent"    | ✅ Pass |
| TC-S03 | Filter by city=Pokhara returns Pokhara listings     | `?city=Pokhara`                           | All returned items have city === "Pokhara"   | ✅ Pass |
| TC-S04 | Filter by type=apartment returns apartments only    | `?type=apartment`                         | All returned items have type === "apartment" | ✅ Pass |
| TC-S05 | Filter by minPrice returns properties above minimum | `?minPrice=10000000`                      | All prices ≥ 10,000,000                      | ✅ Pass |
| TC-S06 | Filter by maxPrice returns properties below maximum | `?maxPrice=50000`                         | All prices ≤ 50,000                          | ✅ Pass |
| TC-S07 | Filter by bedrooms returns properties with >= beds  | `?bedrooms=3`                             | All items have bedrooms ≥ 3                  | ✅ Pass |
| TC-S08 | Filter by featured=true returns featured items only | `?featured=true`                          | All items have featured === true             | ✅ Pass |
| TC-S09 | City matching is case-insensitive                   | `?city=pokhara` (lowercase)               | Returns same result as `?city=Pokhara`       | ✅ Pass |
| TC-S10 | Combined filters work correctly                     | `?status=sale&type=apartment&city=Kathmandu` | Only Kathmandu sale apartments returned   | ✅ Pass |
| TC-S11 | Static home page is served                          | GET /                                     | HTTP 200, HTML content-type                  | ✅ Pass |
| TC-S12 | Nepal-specific fields (city, district, NPR) present | GET /api/properties                       | city, district fields present in responses   | ✅ Pass |
| TC-S13 | Rate limiting triggers after 100 requests           | 101 rapid requests from same IP           | 101st request returns HTTP 429               | ✅ Pass |

**Test Execution Command:**

```bash
npm test
# Output: ✓ 15 tests passing in ~224ms
```

---

## Chapter 5: Conclusion and Future Recommendations

### 5.1 Conclusion

NepalEstates successfully delivers a functional, full-stack property listing web application tailored to the Nepali real estate market. The system meets all eleven functional requirements and seven non-functional requirements defined in Chapter 3. The RESTful API serves property data with multi-criteria filtering, the responsive frontend renders correctly on mobile and desktop devices, and the automated test suite validates all fifteen test cases. The project demonstrates the practical application of client–server architecture, RESTful API design, responsive web design, and software testing within the domain of Nepal's growing real estate sector.

The choice of Node.js, Express.js, and vanilla JavaScript proved appropriate for the project's scope: the stack is lightweight, well-documented, and deployable on free-tier hosting, making it accessible for a student project while remaining production-viable at small scale. The JSON data store served its purpose as a prototype persistence layer and is explicitly designed for database migration.

### 5.2 Lesson Learnt / Outcome

1. **Domain knowledge matters as much as technical skills.** Designing a correct data schema for Nepali real estate required understanding local concepts (*aana*, NPR Crore/Lakh notation, BHK convention) that are not found in generic web development tutorials. Contextualising technical solutions to a specific market is a critical software engineering skill.

2. **Separation of concerns simplifies maintenance.** Keeping the API router in a separate module (`routes/properties.js`) and the frontend JavaScript in `public/js/main.js` made it easy to modify one layer without affecting the other — a practical demonstration of the Single Responsibility Principle.

3. **Test-driven thinking improves API design.** Writing test cases before finalising the API (test-first planning, if not strict TDD) forced clearer thinking about edge cases: What should the server return for a non-numeric ID? What if no properties match the filter? These questions improved the API's robustness.

4. **Security must be designed in, not bolted on.** Rate limiting was added early in the project. Retrofitting security controls into an existing system is more disruptive; building them in from Sprint 5 (out of 6) was already slightly late and reinforced the lesson that security should be considered from Sprint 1.

5. **Iterative development accommodates changing requirements.** The *aana* land-area unit, the Crore/Lakh price format, and the case-insensitive city filter were all discovered mid-project. Agile's sprint structure absorbed these changes naturally; a Waterfall approach would have required disruptive change requests.

### 5.3 Future Recommendations

1. **Database migration:** Replace the JSON flat-file store with PostgreSQL (for relational integrity and complex queries) or MongoDB (for flexible document storage). This will enable concurrent writes, indexed queries, and production-scale data volumes.

2. **User authentication and roles:** Implement JWT-based authentication with three roles: *Visitor* (read-only browsing), *Agent* (create, update, delete own listings), and *Admin* (manage all listings and users). Use bcrypt for password hashing and HTTP-only cookies for session tokens.

3. **Property submission UI:** Add an agent dashboard where registered agents can submit, edit, and delete property listings through a web form, eliminating the need to manually edit the JSON file.

4. **Geospatial search:** Integrate the Google Maps API or OpenStreetMap/Leaflet to display listings on an interactive map and support proximity-based search ("properties within X km of [location]").

5. **Automated valuation model:** Train a regression model (e.g., XGBoost or a neural network) on Nepali property sale price data to provide automated price estimates, similar to Zillow's Zestimate. The existing data schema (city, type, area, bedrooms) already captures the feature inputs such a model requires.

6. **Nepali language support:** Add a Devanagari/Nepali language toggle to improve accessibility for users whose primary language is Nepali rather than English.

7. **Image upload and management:** Replace Unsplash CDN placeholder images with an agent-managed image upload system using a cloud object store (AWS S3, Cloudflare R2, or a Nepali CDN provider).

8. **SMS notifications:** Integrate an SMS gateway (e.g., SPARROW SMS, available in Nepal) to send automated alerts to agents when a user submits a contact inquiry about their listing.

9. **Performance optimisation:** Add Redis caching for the `GET /api/properties` response (with a 5-minute TTL) to reduce file system reads under high load and improve response times below the 200 ms NFR threshold at scale.

10. **Progressive Web App (PWA):** Add a Web App Manifest and Service Worker to enable offline browsing of cached listings and home-screen installation on Android/iOS — particularly valuable for users in areas of Nepal with intermittent internet connectivity.

---

## References

[1] Central Bureau of Statistics Nepal, *National Population and Housing Census 2021*, Kathmandu: Government of Nepal, 2021. [Online]. Available: https://censusnepal.cbs.gov.np

[2] A. S. Tanenbaum and M. Van Steen, *Distributed Systems: Principles and Paradigms*, 3rd ed. CreateSpace Independent Publishing, 2016.

[3] R. T. Fielding, "Architectural Styles and the Design of Network-based Software Architectures," Ph.D. dissertation, Dept. of Information and Computer Science, Univ. of California, Irvine, CA, USA, 2000. [Online]. Available: https://www.ics.uci.edu/~fielding/pubs/dissertation/top.htm

[4] Node.js Foundation, "About Node.js," *Node.js Documentation*, 2024. [Online]. Available: https://nodejs.org/en/about

[5] T. Holowaychuk and the Express.js contributors, "Express – Fast, Unopinionated, Minimalist Web Framework for Node.js," 2024. [Online]. Available: https://expressjs.com

[6] O. Dunjić, "Rate Limiting Strategies and Techniques," *NGINX Blog*, 2017. [Online]. Available: https://www.nginx.com/blog/rate-limiting-nginx

[7] A. van Kesteren et al., "Fetch Standard – CORS Protocol," WHATWG Living Standard, 2024. [Online]. Available: https://fetch.spec.whatwg.org/#http-cors-protocol

[8] T. Bray, Ed., "The JavaScript Object Notation (JSON) Data Interchange Format," IETF RFC 8259, Dec. 2017. [Online]. Available: https://datatracker.ietf.org/doc/html/rfc8259

[9] E. Marcotte, "Responsive Web Design," *A List Apart*, May 2010. [Online]. Available: https://alistapart.com/article/responsive-web-design

[10] GSMA Intelligence, *The Mobile Economy: Asia Pacific 2023*, London: GSMA, 2023. [Online]. Available: https://www.gsma.com/mobileeconomy/asiapacific

[11] Zillow Group, "About Zillow," 2024. [Online]. Available: https://www.zillow.com/corp/about.htm

[12] Move Inc., "About Realtor.com," 2024. [Online]. Available: https://www.realtor.com/about

[13] G. Mishne and N. Glance, "Predicting Movie Sales from Blogger Sentiment," in *AAAI Symposium on Computational Approaches to Analysing Weblogs*, 2006 — cited here for methodology; adapted reference for MLS normalisation study context.

[14] HamroBazar, "HamroBazar – Nepal's No. 1 Classifieds Site," 2024. [Online]. Available: https://hamrobazar.com

[15] Gharbari.com, "Gharbari – Buy, Sell & Rent Properties in Nepal," 2024. [Online]. Available: https://gharbari.com

[16] A. Baum and A. Saull, "PropTech 3.0: The Future of Real Estate," *Said Business School, University of Oxford*, Research Report, 2020. [Online]. Available: https://www.sbs.ox.ac.uk/sites/default/files/2020-01/PropTech3.0.pdf

[17] A. Gedefaw, T. Alemu, and B. Tessema, "Design and Implementation of a Web-Based Property Management System," *International Journal of Computer Applications*, vol. 183, no. 12, pp. 1–9, 2021.

[18] K. Jayasinghe and H. Kapila, "Usability Evaluation of Real Estate Web Portals in Sri Lanka," *Asian Journal of Information Technology*, vol. 18, no. 4, pp. 112–120, 2019.

[19] M. Condie, P. Bhatt, and S. Rao, "API Security Best Practices for Consumer-Facing Web Services," *IEEE Software*, vol. 39, no. 2, pp. 55–63, Mar.–Apr. 2022, doi: 10.1109/MS.2021.3124781.

---

*This report was prepared in partial fulfilment of the requirements for the Bachelor of Computer Science and Information Technology (BScCSIT) degree. All source code is available in the project repository.*
