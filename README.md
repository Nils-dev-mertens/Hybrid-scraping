# Hybrid Scraping

Hybrid Scraping is an experimental scraping framework designed to support **multiple scraping strategies** in a single service. Instead of being locked into one tool (like Puppeteer or Playwright), Hybrid Scraping provides a flexible **API service** that can run different scraping engines depending on the use case.

## Why Hybrid?

Most scrapers rely on a single framework or require redeploying every time something changes. Hybrid Scraping solves this by:  

- 🚀 Supporting multiple input sources (URLs, PDFs, raw HTML, etc.)  
- 🔄 Dynamically selecting the right scraper module at runtime  
- 🐳 Running as a Dockerized API service for easy deployment  

## Features

- **API-first design** → scrape using HTTP endpoints  
- **Pluggable scrapers** → add new modules without breaking existing ones  
- **Multiple engines** → Fetch, Puppeteer, Playwright, PDF parsing, etc.  
- **Docker ready** → run anywhere with a single command  

## Supported Methods

| Method         | Description                                                                 | Example Use Case               |
|----------------|-----------------------------------------------------------------------------|--------------------------------|
| **Fetch**      | Lightweight HTTP requests for quick data extraction.                       | APIs, simple pages without JS. |
| **Playwright** | Full browser automation with JS rendering.                                 | Dynamic websites, SPAs.        |
| **Puppeteer**  | Headless Chrome automation for scraping and interaction.                   | Sites needing precise control. |
| **PDF Input**  | Extract text/content directly from PDF documents.                          | Reports, documents.            |
| **Custom URL** | Support for custom parameters or advanced scraping configurations.         | Flexible data sources.         |

## Getting Started

### Run with Docker

```bash
# pull the latest image (replace with your DockerHub repo if published)
docker pull your-dockerhub-username/hybrid-scraping:latest

# run the container
docker run -p 3000:3000 your-dockerhub-username/hybrid-scraping
```

API will be available at `http://localhost:3000`.

<!-- ### 2. Run with Docker Compose

Create a `docker-compose.yml`:

start it:

```bash
docker compose up -d
```

### 3. Example API Usage

#### Scrape a URL

```bash
curl -X POST http://localhost:3000/scrape   -H "Content-Type: application/json"   -d '{
    "id": "fetch",
    "input": "https://example.com"
  }'
```

#### Scrape a PDF

```bash
curl -X POST http://localhost:3000/scrape   -H "Content-Type: application/json"   -d '{
    "id": "pdf",
    "input": "https://example.com/report.pdf"
  }'
```

### Example Response

```json
{
  "data": "<extracted content>",
  "meta": {
    "method": "fetch",
    "durationMs": 1245,
    "success": true
  }
}
``` -->

## Roadmap

- [ ] Job queue for async scraping  
- [ ] CLI client that communicates with the API  
- [ ] Authentication (API keys)  
- [ ] Monitoring & metrics dashboard  
- [ ] Plugin system for custom scrapers  
