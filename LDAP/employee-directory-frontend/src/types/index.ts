export interface User {
  uid: string;
  name: string;
  email: string;
  department?: string;
  title?: string;
}

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

export interface LoginResponse {
  message: string;
  user: User;
}

export interface EmployeesResponse {
  employees: Employee[];
}

export interface EmployeeResponse {
  employee: Employee;
}