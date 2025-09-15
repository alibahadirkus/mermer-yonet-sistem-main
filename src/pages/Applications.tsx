import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { useContent } from '@/contexts/ContentContext';

const Applications = () => {
  const { applications } = useContent();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-3xl font-elegant font-bold text-center mb-8 marble-border pb-4">
          Uygulamalarımız
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {applications.map((app) => (
            <Card key={app.id} className="h-full hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6">
                <div className="relative h-48 overflow-hidden mb-4">
                  <img 
                    src={app.image} 
                    alt={app.name} 
                    className="w-full h-full object-cover"
                  />
                  {app.video && (
                    <button 
                      onClick={() => window.open(app.video, '_blank')}
                      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white px-4 py-2 rounded-full hover:bg-white hover:text-black transition-colors"
                    >
                      Video İzle
                    </button>
                  )}
                </div>
                <h3 className="text-xl font-bold mb-2">{app.name}</h3>
                <p className="text-gray-600 mb-4">{app.description}</p>
                {app.features && (
                  <div className="space-y-2">
                    {app.features.map((feature, index) => (
                      <p key={index} className="text-gray-700">• {feature}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Applications;
