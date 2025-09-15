import React from 'react';
import Layout from '@/components/Layout';
import AdminCategories from '@/components/admin/AdminCategories';

const AdminCategoriesPage = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <AdminCategories />
      </div>
    </Layout>
  );
};

export default AdminCategoriesPage;
