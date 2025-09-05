export interface Role {
  ID: number;
  role_name: string;
  description: string;
}

export interface CreateRoleRequest {
  role_name: string;
  description: string;
}

export interface UpdateRoleRequest {
  ID: number;
  role_name?: string;
  description?: string;
}
