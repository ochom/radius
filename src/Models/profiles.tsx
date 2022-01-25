import { Address } from "./common";

export enum TeacherType {
  TeacherTypeTeacher = "Teaching",
  TeacherTypeSupport = "Non Teaching",
}

export interface Role {
  id?: string;
  schoolID?: string;
  name: string;
  description: string;
}

export interface Teacher {
  id?: string;
  schoolID: string;
  UserID: string;
  firstName: string;
  lastName: string;
  teacherType: TeacherType;
  Address: string;
  EmailAddress: string;
  PhoneNumber: string;
  Active: boolean;
}

export interface School {
  id: string;
  address: Address;
}
