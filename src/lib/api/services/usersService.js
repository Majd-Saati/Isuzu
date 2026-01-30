import apiClient from '../client';

export const usersService = {
  getUsers: async (params = {}) => {
    const { 
      page = 1, 
      perPage = 20, 
      companyId,
      isAdmin,
      status,
      search 
    } = params;
    
    const queryParams = {
      page,
      per_page: perPage,
    };
    
    // Only add optional params if they have values
    if (companyId) queryParams.company_id = companyId;
    if (isAdmin !== undefined) queryParams.is_admin = isAdmin;
    if (status !== undefined) queryParams.status = status;
    if (search) queryParams.search = search;
    
    return apiClient.get('/users_list', { params: queryParams });
  },

  getUser: async (id) => {
    return apiClient.get(`/user/${id}`);
  },

  createUser: async (data) => {
    return apiClient.post('/create_user', data);
  },

  updateUser: async ({ id, ...data }) => {
    return apiClient.post('/update_users', {
      user_id: id,
      ...data,
    });
  },

  deleteUser: async (id) => {
    return apiClient.post('/delete_users', { user_id: id });
  },
};

