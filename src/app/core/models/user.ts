import { Department } from "./department";

export interface User{
  id: number
  email: string,
  password?: string,
  role:string,
  department_id:string | null,
  created_at: string;
  updated_at: string;
  is_approved: boolean;
  status: string,
  email_verified_at: string,
  profile?: Profile | null,
  department?: Department | null
}

export interface Profile{
  id: number
  name: string,
  profile_pic: string | null,
  user_id: number,
  birth_date: string,
  address: string,
  phone_no: string,
  created_at:string,
  updated_at: string,
}