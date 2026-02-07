import 'express-session';

// User type representing an employee from LDAP
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

// Session data
declare module 'express-session' {
  interface SessionData {
    userId: string;
    user: User;
  }
}