import { Address } from "./common";

export enum StaffType {
  StaffTypeTeacher = "Teaching",
  StaffTypeSupport = "Non Teaching",
}

export interface StaffRole {
  id?: string;
  schoolID: string;
  name: string;
  description: string;
}

export interface Staff {
  id?: string;
  schoolID: string;
  UserID: string;
  firstName: string;
  lastName: string;
  staffType: StaffType;
  Address: string;
  EmailAddress: string;
  PhoneNumber: string;
  Active: boolean;
}

export interface School {
  id: string;
  address: Address;
}
