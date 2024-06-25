// src/app/Kernel/worker.worker.ts
/// <reference lib="webworker" />

addEventListener('message', async ({ data }) => {
  if (data.action === 'performHttpTask') {
    try {
      const result = await performHttpRequest(data.obj);
      postMessage({ result });
    } catch (error) {
      postMessage({ error: error });
    }
  }
});

async function performHttpRequest(obj:any): Promise<any> {
  // Simulate a heavy processing task
  await new Promise(resolve => setTimeout(resolve, 2000));

 
  const apiUrl = 'https://10.1.8.112:8111/datacrowd';
//console.log("apiUrl<><>",apiUrl)
  // Simulate an HTTP request using the payload in the request body
  const response = await fetch(apiUrl, {
    method: 'POST', // or 'PUT', 'DELETE', etc. depending on your API
    headers: {
      'Content-Type': 'application/json',
      // Add any additional headers if needed
    },
    body: JSON.stringify(obj), // Serialize the payload as JSON
  });
//console.log("response<><>",apiUrl)

  const result = await response.json();
  //console.log("result<><>",apiUrl)

  return result;
}
