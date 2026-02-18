import Keycloak from 'keycloak-js';

// Initialize Keycloak instance
const keycloak = new Keycloak({
  url: 'http://localhost:8081',
  realm: 'techcorp',
  clientId: 'employee-directory',
});

export default keycloak;