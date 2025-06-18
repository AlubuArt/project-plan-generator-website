# External API Integration Guide

This guide explains how to configure the application to use an external planning API instead of OpenAI for testing purposes.

## Overview

The application now supports switching between two modes:
1. **OpenAI Mode** (default): Uses OpenAI's GPT-4 model for plan generation
2. **External API Mode**: Uses a localhost external planning service

## Configuration

Add these environment variables to your `.env.local` file:

```bash
# External API Configuration (for testing)
USE_EXTERNAL_API=true
EXTERNAL_API_URL=http://127.0.0.1:8000

# OpenAI Configuration (still needed as fallback)
OPENAI_API_KEY=your_openai_api_key_here
```

### Environment Variables

- `USE_EXTERNAL_API`: Set to `"true"` to enable external API mode, `"false"` or omit for OpenAI mode
- `EXTERNAL_API_URL`: URL of the external planning service (defaults to `http://127.0.0.1:8000`)
- `OPENAI_API_KEY`: Your OpenAI API key (required when `USE_EXTERNAL_API=false`)

## External API Requirements

The external API endpoint must implement the following specification:

### Endpoint: `POST /generate-project-plan`

**Request Body:**
```json
{
  "project_name": "Auto-Generated Project Name",
  "project_requirements": "User's project idea with additional context",
  "max_iterations": 3,
  "output_format": "markdown"
}
```

**Expected Response:**
```json
{
  "success": true,
  "markdown": "# Project Plan\n\n## Overview\n...",
  "metadata": {
    "generation_time": 45.2,
    "start_time": "2024-01-15T10:30:00",
    "end_time": "2024-01-15T10:30:45"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message description"
}
```

## How It Works

1. **Project Name Generation**: The system automatically generates a project name from the user's idea
2. **Requirements Enhancement**: The original user idea is enhanced with template-specific context
3. **API Mapping**: The internal format is mapped to the external API's expected format
4. **Response Processing**: The external API's markdown response is extracted and returned

## Template Context

The system adds template-specific context to the requirements:

- **Next.js Template**: Adds context about Next.js 14, TypeScript, and Tailwind CSS
- **Vercel AI Template**: Adds context about AI-powered features and Vercel AI SDK

## Testing

To test the external API integration:

1. Start your external planning service on `127.0.0.1:8000` (or `localhost:8000`)
2. Set `USE_EXTERNAL_API=true` in your environment or use the UI toggle
3. Restart the Next.js application
4. Generate a project plan - it should now use the external service

You can verify which service is being used by checking:
- Console logs will show "Using external planning API..." or "Using OpenAI API..."
- The API response includes a `generationMethod` field indicating the source

## Error Handling

The system handles various error scenarios:

- **External API Unavailable**: Falls back to OpenAI if configured
- **Timeout**: 2-minute timeout for external API calls
- **Invalid Response**: Validates external API response format
- **Network Errors**: Provides user-friendly error messages

## Switching Back to OpenAI

To switch back to OpenAI mode:

1. Set `USE_EXTERNAL_API=false` in your `.env.local` or use the UI toggle
2. Ensure `OPENAI_API_KEY` is configured
3. Restart the application

## Troubleshooting

### Common Issues

**External API not responding:**
- Check if the service is running on the specified port
- Verify the `EXTERNAL_API_URL` is correct
- Try using `127.0.0.1:8000` instead of `localhost:8000` to avoid IPv6 issues
- Check firewall/network settings

**Invalid response format:**
- Ensure your external API returns the expected JSON structure
- Check the `success` field is boolean
- Verify `markdown` field contains the generated plan

**Timeout errors:**
- External API calls have a 2-minute timeout
- Ensure your service responds within this timeframe
- Consider optimizing your external service performance

**IPv6 vs IPv4 Connection Issues:**
- Use `127.0.0.1` instead of `localhost` in your configuration
- Some systems default to IPv6 (::1) which might not work with your server

### Debug Logging

The application logs detailed information about API calls:

```
AI Generation request from IP: xxx.xxx.xxx.xxx, idea length: 150, using external API: true (UI: external, ENV: true)
Calling external API at http://127.0.0.1:8000/generate-project-plan
Using external planning API...
Successfully generated plan for IP: xxx.xxx.xxx.xxx, template: next, method: external
```

## API Response Format

When using the external API, the response includes an additional field:

```json
{
  "plan": "Generated markdown plan content",
  "template": "next",
  "remainingRequests": 9,
  "generationMethod": "external"
}
```

The `generationMethod` field helps identify which service generated the plan. 