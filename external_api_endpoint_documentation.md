# Multi-Agent AI Planning System - HTTP API

This document describes the HTTP API endpoints for the Multi-Agent AI Planning System. The API provides the same functionality as the Streamlit app but through HTTP endpoints that can be integrated with other systems.

## Quick Start

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Environment Variables

Create a `.env` file with your Azure OpenAI credentials:

```bash
AZURE_OPENAI_API_KEY=your_api_key_here
AZURE_OPENAI_ENDPOINT=https://your-resource.openai.azure.com/
AZURE_OPENAI_API_VERSION=2023-12-01-preview
AZURE_OPENAI_DEPLOYMENT_NAME=your_deployment_name
```

### 3. Start the API Server

```bash
# Using Python directly
python api_server.py

# Or using uvicorn
uvicorn api_server:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000`

### 4. Test the API

```bash
# Check health
curl http://localhost:8000/health

# Or run the example client
python api_client_example.py
```

## API Endpoints

### Health Check

**GET** `/health`

Check if the API server is running and healthy.

**Response:**
```json
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00",
  "version": "1.0.0"
}
```

### Generate Project Plan (Synchronous)

**POST** `/generate-project-plan`

Generate a comprehensive project plan using the multi-agent AI system. This endpoint waits for the complete generation process before returning results.

**Request Body:**
```json
{
  "project_name": "My AI Project",
  "project_requirements": "Create a mobile app that helps users track their daily water intake...",
  "max_iterations": 3,
  "output_format": "markdown"
}
```

**Parameters:**
- `project_name` (string, required): Name of the project
- `project_requirements` (string, required): Detailed project requirements
- `max_iterations` (integer, optional): Maximum number of iterations (1-10, default: 3)
- `output_format` (string, optional): Output format "markdown" or "json" (default: "markdown")

**Response:**
```json
{
  "success": true,
  "project_plan": {
    "project_name": "My AI Project",
    "executive_summary": "...",
    "user_stories": [...],
    "technical_architecture": [...],
    "implementation_plan": [...],
    "risk_assessment": [...],
    "development_guidelines": [...]
  },
  "markdown": "# My AI Project - Project Plan\n\n...",
  "metadata": {
    "generation_time": 45.2,
    "start_time": "2024-01-15T10:30:00",
    "end_time": "2024-01-15T10:30:45",
    "current_iteration": 3,
    "max_iterations": 3,
    "project_name": "My AI Project",
    "output_format": "markdown",
    "events_count": 0
  }
}
```

### Generate Project Plan (Asynchronous)

**POST** `/generate-project-plan-async`

Start project plan generation in the background and return immediately with a task ID. Useful for long-running requests.

**Request Body:** Same as synchronous endpoint

**Response:**
```json
{
  "success": true,
  "task_id": "task_20240115_103000_123456",
  "message": "Project plan generation started in background",
  "estimated_duration": "2-5 minutes depending on complexity"
}
```

**Note:** Results are saved to the `background_results` directory. In a production environment, you would typically use a proper task queue and database to store results.

## Interactive API Documentation

Once the server is running, you can access interactive API documentation at:

- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

## Example Usage

### Python Client

```python
import requests

# Synchronous request
response = requests.post("http://localhost:8000/generate-project-plan", json={
    "project_name": "WaterTracker Mobile App",
    "project_requirements": """
    Create a mobile app that helps users track their daily water intake.
    The app should allow users to set daily goals, log water consumption, 
    and view progress over time.
    """,
    "max_iterations": 2,
    "output_format": "markdown"
})

result = response.json()
if result["success"]:
    print("✅ Project plan generated successfully!")
    print(f"📊 Generation time: {result['metadata']['generation_time']:.2f} seconds")
    
    # Save markdown to file
    with open("project_plan.md", "w") as f:
        f.write(result["markdown"])
else:
    print(f"❌ Error: {result['error']}")
```

### cURL

```bash
curl -X POST "http://localhost:8000/generate-project-plan" \
  -H "Content-Type: application/json" \
  -d '{
    "project_name": "WaterTracker Mobile App",
    "project_requirements": "Create a mobile app that helps users track their daily water intake...",
    "max_iterations": 2,
    "output_format": "markdown"
  }'
```

### JavaScript/Node.js

```javascript
const response = await fetch('http://localhost:8000/generate-project-plan', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    project_name: 'WaterTracker Mobile App',
    project_requirements: 'Create a mobile app that helps users track their daily water intake...',
    max_iterations: 2,
    output_format: 'markdown'
  })
});

const result = await response.json();
if (result.success) {
  console.log('✅ Project plan generated successfully!');
  console.log(`📊 Generation time: ${result.metadata.generation_time} seconds`);
} else {
  console.log(`❌ Error: ${result.error}`);
}
```

## Error Handling

The API returns structured error responses:

```json
{
  "success": false,
  "error": "Azure OpenAI API key is not configured. Please set the AZURE_OPENAI_API_KEY environment variable.",
  "metadata": {
    "error_time": "2024-01-15T10:30:00",
    "project_name": "My Project",
    "max_iterations": 3
  }
}
```

Common error scenarios:
- Missing or invalid Azure OpenAI credentials
- Invalid request parameters
- Network timeouts
- AI service rate limits

## Production Considerations

### Security
- Configure CORS appropriately for your domain
- Use HTTPS in production
- Implement authentication/authorization if needed
- Validate and sanitize input data

### Performance
- Consider implementing request queuing for high load
- Use proper logging and monitoring
- Implement caching for repeated requests
- Set appropriate timeout values

### Scalability
- Use a proper task queue (Redis + Celery) for async operations
- Implement database storage for results
- Consider horizontal scaling with load balancers
- Monitor resource usage and AI service quotas

## Deployment

### Docker

Create a `Dockerfile`:

```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .

CMD ["uvicorn", "api_server:app", "--host", "0.0.0.0", "--port", "8000"]
```

Build and run:

```bash
docker build -t ai-planning-api .
docker run -p 8000:8000 --env-file .env ai-planning-api
```

### Azure Container Instances

```bash
az container create \
  --resource-group myResourceGroup \
  --name ai-planning-api \
  --image ai-planning-api \
  --ports 8000 \
  --environment-variables \
    AZURE_OPENAI_API_KEY="your_key" \
    AZURE_OPENAI_ENDPOINT="your_endpoint"
```

## Monitoring and Logging

The API includes built-in logging that outputs to the console. In production, consider:

- Structured logging (JSON format)
- Log aggregation (ELK stack, Azure Monitor)
- Application monitoring (Application Insights)
- Health check endpoints for load balancers

## Support

For issues or questions:
1. Check the interactive API documentation at `/docs`
2. Review the logs for error details
3. Ensure all environment variables are properly configured
4. Verify Azure OpenAI service availability and quotas 