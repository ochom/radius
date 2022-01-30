export interface Address {
  streetName: string;
  city: string;
  county: string;
  postCode: string;
  country: string;
}

export interface Auth {
  uid: string;
  firstName: string;
  lastName: string;
  email: string;
  token: string;
  refreshToken: string;
  school: any;
}

export interface GraphError {
  message: string;
}

export interface GraphResponse {
  errors?: GraphError[] | null;
  payload?: any;
}

export interface Response {
  status?: number;
  message: string;
  data?: any;
}
