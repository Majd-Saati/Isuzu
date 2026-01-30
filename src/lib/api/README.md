# API Architecture Guide

## Structure

```
src/
├── lib/
│   ├── api/
│   │   ├── client.js           # Axios instance with interceptors
│   │   └── services/           # API service functions by domain
│   │       ├── authService.js
│   │       ├── userService.js
│   │       └── dealerService.js
│   └── queryClient.js          # React Query client config
└── hooks/
    └── api/                    # React Query hooks
        ├── useAuth.js
        ├── useUsers.js
        └── useDealers.js
```

## Usage Examples

### 1. Queries (GET requests)

```jsx
import { useUsers, useUser } from '@/hooks/api/useUsers';

function UsersList() {
  const { data, isLoading, error } = useUsers({ page: 1, limit: 10 });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return <div>{data.map(user => <div key={user.id}>{user.name}</div>)}</div>;
}
```

### 2. Mutations (POST/PUT/DELETE requests)

```jsx
import { useCreateUser, useUpdateUser, useDeleteUser } from '@/hooks/api/useUsers';

function UserForm() {
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const deleteUser = useDeleteUser();

  const handleCreate = async (formData) => {
    try {
      await createUser.mutateAsync(formData);
      toast.success('User created!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleUpdate = async (id, formData) => {
    await updateUser.mutateAsync({ id, data: formData });
  };

  const handleDelete = async (id) => {
    await deleteUser.mutateAsync(id);
  };

  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleCreate({ name: e.target.name.value });
    }}>
      {/* form fields */}
    </form>
  );
}
```

### 3. Adding New Services

1. Create service file in `src/lib/api/services/`:

```js
// src/lib/api/services/productService.js
import apiClient from '../client';

export const productService = {
  getProducts: async (params) => {
    return apiClient.get('/products', { params });
  },
  
  createProduct: async (data) => {
    return apiClient.post('/products', data);
  },
};
```

2. Create React Query hooks in `src/hooks/api/`:

```js
// src/hooks/api/useProducts.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { productService } from '@/lib/api/services/productService';

export const useProducts = (params) => {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => productService.getProducts(params),
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: productService.createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
};
```

## Configuration

Set your API base URL in `.env`:

```
VITE_API_BASE_URL=https://api.example.com
```

## Features

- ✅ Centralized axios configuration
- ✅ Request/response interceptors
- ✅ Automatic token management
- ✅ Error handling
- ✅ Query caching and invalidation
- ✅ Optimistic updates support
- ✅ Type-safe service layer
