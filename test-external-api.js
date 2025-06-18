#!/usr/bin/env node

/**
 * Test script for external API integration
 * Usage: node test-external-api.js [external-api-url]
 */

const EXTERNAL_API_URL = process.argv[2] || 'http://127.0.0.1:8000';

async function testExternalAPI() {
  console.log('🧪 Testing External Planning API Integration\n');
  console.log(`External API URL: ${EXTERNAL_API_URL}`);
  console.log('=' * 50);

  // Test data
  const testRequest = {
    project_name: "Test Mobile App",
    project_requirements: "Create a simple mobile app for tracking daily water intake with user registration and progress visualization. Template: next\nTechnical Context: Focus on Next.js best practices",
    max_iterations: 2,
    output_format: "markdown"
  };

  try {
    console.log('\n📤 Sending test request...');
    console.log('Request body:', JSON.stringify(testRequest, null, 2));

    const startTime = Date.now();
    
    const response = await fetch(`${EXTERNAL_API_URL}/generate-project-plan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testRequest),
      signal: AbortSignal.timeout(300000), // 5 minute timeout for testing
    });

    const duration = Date.now() - startTime;
    console.log(`\n⏱️  Response time: ${duration}ms`);
    console.log(`📊 Status: ${response.status} ${response.statusText}`);

    if (!response.ok) {
      console.error('❌ HTTP Error:', response.status, response.statusText);
      const errorText = await response.text();
      console.error('Error body:', errorText);
      return false;
    }

    const data = await response.json();
    console.log('\n📥 Response received');

    // Validate response structure
    console.log('\n🔍 Validating response structure...');
    
    const validations = [
      { check: () => typeof data === 'object', name: 'Response is object' },
      { check: () => typeof data.success === 'boolean', name: 'Has success field (boolean)' },
      { check: () => data.success === true, name: 'Success is true' },
      { check: () => typeof data.markdown === 'string', name: 'Has markdown field (string)' },
      { check: () => data.markdown.length > 0, name: 'Markdown content is not empty' },
      { check: () => data.markdown.includes('#'), name: 'Markdown contains headers' },
    ];

    let allValid = true;
    validations.forEach(({ check, name }) => {
      const isValid = check();
      console.log(`${isValid ? '✅' : '❌'} ${name}`);
      if (!isValid) allValid = false;
    });

    if (allValid) {
      console.log('\n🎉 All validations passed!');
      console.log(`\n📄 Generated plan preview (first 200 chars):`);
      console.log(data.markdown.substring(0, 200) + '...');
      
      if (data.metadata) {
        console.log('\n📊 Metadata:');
        console.log(JSON.stringify(data.metadata, null, 2));
      }
      
      return true;
    } else {
      console.log('\n❌ Some validations failed');
      console.log('Full response:', JSON.stringify(data, null, 2));
      return false;
    }

  } catch (error) {
    console.error('\n💥 Error during test:', error.message);
    
    if (error.name === 'AbortError') {
      console.error('⏰ Request timed out after 30 seconds');
    } else if (error.message.includes('fetch')) {
      console.error('🌐 Network error - is the external API service running?');
    }
    
    return false;
  }
}

async function testHealthEndpoint() {
  console.log('\n🏥 Testing health endpoint...');
  
  try {
    const response = await fetch(`${EXTERNAL_API_URL}/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(5000),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Health check passed');
      console.log('Health data:', JSON.stringify(data, null, 2));
      return true;
    } else {
      console.log('⚠️  Health endpoint returned:', response.status);
      return false;
    }
  } catch (error) {
    console.log('⚠️  Health endpoint not available:', error.message);
    return false;
  }
}

async function main() {
  // Test health first
  await testHealthEndpoint();
  
  // Test main API
  const success = await testExternalAPI();
  
  console.log('\n' + '=' * 50);
  if (success) {
    console.log('🎉 External API integration test PASSED');
    console.log('\n💡 To use this API in your application, set:');
    console.log('   USE_EXTERNAL_API=true');
    console.log(`   EXTERNAL_API_URL=${EXTERNAL_API_URL}`);
  } else {
    console.log('❌ External API integration test FAILED');
    console.log('\n🔧 Troubleshooting steps:');
    console.log('1. Ensure the external API service is running');
    console.log('2. Check the API URL and port');
    console.log('3. Verify the API implements the correct endpoints');
    console.log('4. Check the response format matches expectations');
  }
}

// Handle uncaught errors
process.on('unhandledRejection', (reason, promise) => {
  console.error('💥 Unhandled promise rejection:', reason);
  process.exit(1);
});

// Run the test
main().catch(error => {
  console.error('💥 Test failed:', error);
  process.exit(1);
}); 