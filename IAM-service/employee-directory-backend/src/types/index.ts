// User type from LDAP
export interface User {
  uid: string;
  cn: string;
  sn: string;
  givenName: string;
  mail: string;
  telephoneNumber?: string;
  departmentNumber?: string;
  title?: string;
  dn: string;
}

// Employee type for API responses
export interface Employee {
  uid: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  title: string;
}

// Decoded Keycloak token
export interface KeycloakToken {
  sub: string;
  email_verified: boolean;
  name: string;
  preferred_username: string;
  given_name: string;
  family_name: string;
  email: string;
  department?: string;
  title?: string;
}

// Express Request with user info
declare global {
  namespace Express {
    interface Request {
      user?: KeycloakToken;
    }
  }
}