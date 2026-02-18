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

export interface EmployeesResponse {
  employees: Employee[];
}

export interface EmployeeResponse {
  employee: Employee;
}

export interface UserProfile {
  uid: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  department?: string;
  title?: string;
}