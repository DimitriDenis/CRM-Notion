// test/load/crud-load.test.js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { uuidv4 } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';

export const options = {
  stages: [
    { duration: '30s', target: 20 }, // Montée à 20 utilisateurs
    { duration: '1m', target: 20 },  // Maintien à 20 utilisateurs
    { duration: '30s', target: 0 },  // Descente à 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% des requêtes doivent être sous 500ms
    http_req_failed: ['rate<0.01'],   // Moins de 1% d'erreurs
  },
};

const BASE_URL = 'http://localhost:3001';
let authToken;
let testPipelineId;
let testContactId;
let testUser;

export function setup() {
    console.log('Starting setup...');
  
    // Création de l'utilisateur test
    const testUserData = {
      email: `loadtest-${uuidv4()}@example.com`,
      name: 'Load Test User',
      notionUserId: `notion-${uuidv4()}`,
      notionAccessToken: `fake-token-${uuidv4()}`,
      notionWorkspaceId: `workspace-${uuidv4()}`,
      isActive: true
    };
    console.log('Test user data:', testUserData);
  
    const createTestUserRes = http.post(
      `${BASE_URL}/test/users`,
      JSON.stringify(testUserData),
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Test-Secret': 'CRM_TEST_SECRET_8X4K9P2M5L7N3J6H'
        }
      }
    );
  
    console.log('Create user response:', {
      status: createTestUserRes.status,
      body: createTestUserRes.body,
      headers: createTestUserRes.headers
    });
  
    testUser = createTestUserRes.json();
    authToken = testUser.testAuthToken;
    console.log('Received auth token:', authToken);
  
    // Création du pipeline test
    const pipelineData = {
      name: 'Load Test Pipeline',
      stages: [
        { name: 'Stage 1', order: 1 },
        { name: 'Stage 2', order: 2 },
      ],
    };
    console.log('Creating pipeline with data:', pipelineData);
  
    const pipelineRes = http.post(
      `${BASE_URL}/pipelines`,
      JSON.stringify(pipelineData),
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  
    console.log('Pipeline creation response:', {
      status: pipelineRes.status,
      body: pipelineRes.body
    });
  
    testPipelineId = pipelineRes.json('id');
    console.log('Pipeline ID:', testPipelineId);
  
    return { authToken, testPipelineId };
  }
  
  export default function (data) {
    const params = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${data.authToken}`,
      },
    };
    console.log('Request headers:', params.headers);
  
    // Test création contact
    const contactData = {
      firstName: `LoadTest${__VU}`,
      lastName: 'User',
      email: `loadtest${__VU}@example.com`,
    };
    console.log('Creating contact with data:', contactData);
  
    const contactRes = http.post(
      `${BASE_URL}/contacts`,
      JSON.stringify(contactData),
      params
    );
  
    console.log('Contact creation response:', {
      status: contactRes.status,
      body: contactRes.body
    });
  
    check(contactRes, {
      'contact created': (r) => {
        if (r.status !== 201) {
          console.error('Contact creation failed:', {
            status: r.status,
            body: r.body,
            error: r.error
          });
          return false;
        }
        return true;
      },
    });
  
    // Test création deal
    const dealData = {
      name: `Deal ${__VU}`,
      value: 1000,
      pipelineId: data.testPipelineId,
      stageId: 'stage-1',
    };
    console.log('Creating deal with data:', dealData);
  
    const dealRes = http.post(
      `${BASE_URL}/deals`,
      JSON.stringify(dealData),
      params
    );
  
    console.log('Deal creation response:', {
      status: dealRes.status,
      body: dealRes.body
    });
  
    check(dealRes, {
      'deal created': (r) => {
        if (r.status !== 201) {
          console.error('Deal creation failed:', {
            status: r.status,
            body: r.body,
            error: r.error
          });
          return false;
        }
        return true;
      },
    });
  
    // Tests de lecture
    console.log('Fetching contacts...');
    const getContactsRes = http.get(`${BASE_URL}/contacts`, params);
    console.log('Get contacts response:', {
      status: getContactsRes.status,
      body: getContactsRes.body
    });
  
    console.log('Fetching deals...');
    const getDealsRes = http.get(`${BASE_URL}/deals`, params);
    console.log('Get deals response:', {
      status: getDealsRes.status,
      body: getDealsRes.body
    });
  
    sleep(1);
  }
  
  export function teardown(data) {
    console.log('Starting cleanup...');
    const params = {
      headers: {
        Authorization: `Bearer ${data.authToken}`,
      },
    };
  
    const deleteRes = http.del(
      `${BASE_URL}/pipelines/${data.testPipelineId}`, 
      null, 
      params
    );
    console.log('Cleanup response:', {
      status: deleteRes.status,
      body: deleteRes.body
    });
  }