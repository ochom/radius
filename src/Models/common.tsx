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
}

export interface Response {
  status?: number;
  message: string;
  data?: any;
}
