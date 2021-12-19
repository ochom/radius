import { Auth } from "./common";
import { School } from "./profiles";

export interface LoginResponse {
  auth: Auth;
  school: School;
}
