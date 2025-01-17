// test/load/crud-load.test.js
import http from 'k6/http';
import { check, sleep } from 'k6';

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

export function setup() {
  // Authentification initiale

  // Créez d'abord un utilisateur de test
  const createUserRes = http.post(`${BASE_URL}/auth/register`, JSON.stringify({
    email: 'loadtest@example.com',
    password: 'testpassword',
    // autres champs nécessaires
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
  console.log('Create user response:', createUserRes.body);
  
  const loginRes = http.post(`${BASE_URL}/auth/login`, {
    email: 'loadtest@example.com',
    password: 'testpassword',
  });
  authToken = loginRes.json('access_token');

  // Création d'un pipeline de test
  const pipelineRes = http.post(
    `${BASE_URL}/pipelines`,
    JSON.stringify({
      name: 'Load Test Pipeline',
      stages: [
        { name: 'Stage 1', order: 1 },
        { name: 'Stage 2', order: 2 },
      ],
    }),
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authToken}`,
      },
    }
  );
  testPipelineId = pipelineRes.json('id');

  return { authToken, testPipelineId };
}

export default function (data) {
  const params = {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${data.authToken}`,
    },
  };

  // Test de création de contact
  const contactRes = http.post(
    `${BASE_URL}/contacts`,
    JSON.stringify({
      firstName: `LoadTest${__VU}`,
      lastName: 'User',
      email: `loadtest${__VU}@example.com`,
    }),
    params
  );

  check(contactRes, {
    'contact created': (r) => r.status === 201,
  });

  // Test de création de deal
  const dealRes = http.post(
    `${BASE_URL}/deals`,
    JSON.stringify({
      name: `Deal ${__VU}`,
      value: 1000,
      pipelineId: data.testPipelineId,
      stageId: 'stage-1',
    }),
    params
  );

  check(dealRes, {
    'deal created': (r) => r.status === 201,
  });

  // Test de lecture des contacts
  const getContactsRes = http.get(`${BASE_URL}/contacts`, params);
  check(getContactsRes, {
    'contacts retrieved': (r) => r.status === 200,
  });

  // Test de lecture des deals
  const getDealsRes = http.get(`${BASE_URL}/deals`, params);
  check(getDealsRes, {
    'deals retrieved': (r) => r.status === 200,
  });

  sleep(1);
}

export function teardown(data) {
  // Nettoyage des données de test
  const params = {
    headers: {
      Authorization: `Bearer ${data.authToken}`,
    },
  };

  http.del(`${BASE_URL}/pipelines/${data.testPipelineId}`, null, params);
}