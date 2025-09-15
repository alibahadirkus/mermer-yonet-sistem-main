export const API_URL = 'http://localhost:3000/api';

export interface Product {
  id: number;
  name: string;
  description: string;
  image_path: string;
  category: string;
  pdf_path?: string;
  created_at: string;
  updated_at: string;
}

export interface News {
  id: number;
  title: string;
  content: string;
  summary?: string;
  image_path: string;
  created_at: string;
  updated_at: string;
}

export interface Reference {
  id: number;
  name: string;
  description: string;
  location: string;
  image_path: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// Ürün API'leri
export const getProducts = async (): Promise<Product[]> => {
  const response = await fetch(`${API_URL}/products`);
  if (!response.ok) {
    throw new Error('Ürünler yüklenirken bir hata oluştu');
  }
  return response.json();
};

export const addProduct = async (formData: FormData): Promise<Product> => {
  const response = await fetch(`${API_URL}/products`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Ürün eklenirken bir hata oluştu');
  }
  return response.json();
};

export const updateProduct = async (id: number, formData: FormData): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Ürün güncellenirken bir hata oluştu');
  }
  return response.json();
};

export const deleteProduct = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/products/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Ürün silinirken bir hata oluştu');
  }
};

// Haber API'leri
export const getNews = async (): Promise<News[]> => {
  const response = await fetch(`${API_URL}/news`);
  if (!response.ok) {
    throw new Error('Haberler yüklenirken bir hata oluştu');
  }
  return response.json();
};

export const addNews = async (formData: FormData): Promise<News> => {
  const response = await fetch(`${API_URL}/news`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Haber eklenirken bir hata oluştu');
  }
  return response.json();
};

export const updateNews = async (id: number, formData: FormData): Promise<News> => {
  const response = await fetch(`${API_URL}/news/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Haber güncellenirken bir hata oluştu');
  }
  return response.json();
};

export const deleteNews = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/news/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Haber silinirken bir hata oluştu');
  }
};

// Referans API'leri
export const getReferences = async (): Promise<Reference[]> => {
  const response = await fetch(`${API_URL}/references`);
  if (!response.ok) {
    throw new Error('Referanslar yüklenirken bir hata oluştu');
  }
  return response.json();
};

export const addReference = async (formData: FormData): Promise<Reference> => {
  const response = await fetch(`${API_URL}/references`, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Referans eklenirken bir hata oluştu');
  }
  return response.json();
};

export const updateReference = async (id: number, formData: FormData): Promise<Reference> => {
  const response = await fetch(`${API_URL}/references/${id}`, {
    method: 'PUT',
    body: formData,
  });
  if (!response.ok) {
    throw new Error('Referans güncellenirken bir hata oluştu');
  }
  return response.json();
};

export const deleteReference = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/references/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Referans silinirken bir hata oluştu');
  }
};

// Kategori API'leri
export const getCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${API_URL}/categories`);
  if (!response.ok) {
    throw new Error('Kategoriler yüklenirken bir hata oluştu');
  }
  return response.json();
};

export const addCategory = async (name: string, description: string): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  });
  if (!response.ok) {
    throw new Error('Kategori eklenirken bir hata oluştu');
  }
  return response.json();
};

export const updateCategory = async (id: number, name: string, description: string): Promise<Category> => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, description }),
  });
  if (!response.ok) {
    throw new Error('Kategori güncellenirken bir hata oluştu');
  }
  return response.json();
};

export const deleteCategory = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/categories/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Kategori silinirken bir hata oluştu');
  }
}; 