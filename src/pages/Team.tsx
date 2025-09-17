import React from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Building2, Users, Briefcase, Factory, MapPin, Package, Truck, ClipboardCheck, UserCircle, FileText, ShoppingCart, Users2 } from 'lucide-react';
import { useContent } from '@/contexts/ContentContext';

const Team = () => {
  const { teamMembers } = useContent();
  
  console.log('Team component - teamMembers:', teamMembers);
  console.log('Team members length:', teamMembers.length);
  
  // API'den gelen veriyi organize et
  const organizeTeamData = () => {
    console.log('All team members:', teamMembers);
    console.log('Team members departments:', teamMembers.map(m => ({ name: m.name, department: m.department, position: m.position })));
    
    const founders = teamMembers.filter(member => member.department === 'Kurucular');
    const finance = teamMembers.filter(member => member.department === 'Finans');
    const bursaDepot = teamMembers.filter(member => member.department === 'Bursa Depo');
    const bandirmaDepot = teamMembers.filter(member => member.department === 'Bandırma Depo');
    const exportDept = teamMembers.filter(member => member.department === 'İhracat');
    
    console.log('Founders:', founders);
    console.log('Finance:', finance);
    console.log('Bursa Depot:', bursaDepot);
    console.log('Bandırma Depot:', bandirmaDepot);
    console.log('Export Dept:', exportDept);
    
    return {
      founders: {
        name: "KURUCULAR",
        position: "",
        icon: <Building2 className="w-5 h-5 text-gray-500" />,
        children: founders.map(founder => ({
          name: founder.name,
          position: founder.position,
          icon: <Users className="w-5 h-5 text-gray-500" />
        }))
      },
      finance: {
        name: finance[0]?.position || "Finans Departmanı",
        position: finance[0]?.name || "Veri Yok",
        icon: <UserCircle className="w-5 h-5 text-gray-500" />
      },
      depots: [
        {
          name: "Bursa Depo",
          position: "Departman",
          icon: <MapPin className="w-5 h-5 text-gray-500" />,
          children: bursaDepot.map(member => ({
            name: member.position,
            position: member.name,
            icon: <Users className="w-4 h-4 text-gray-500" />,
            isManager: member.position.includes('Müd.')
          }))
        },
        {
          name: "Bandırma Depo",
          position: "Departman",
          icon: <MapPin className="w-5 h-5 text-gray-500" />,
          children: bandirmaDepot.map(member => ({
            name: member.position,
            position: member.name,
            icon: <Users className="w-4 h-4 text-gray-500" />,
            isManager: member.position.includes('Müd.')
          }))
        }
      ],
      export: {
        name: "İhracat Departmanı",
        position: exportDept.find(m => m.position.includes('Departmanı'))?.name || "Veri Yok",
        icon: <Briefcase className="w-5 h-5 text-gray-500" />,
        children: exportDept.map(member => ({
          name: member.position,
          position: member.name,
          icon: <Users className="w-4 h-4 text-gray-500" />
        }))
      }
    };
  };

  const organization = organizeTeamData();

  // Eğer veritabanından veri gelmiyorsa, fallback veri göster
  if (teamMembers.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-elegant font-bold text-center mb-8 marble-border pb-4">
            Organizasyon Şeması
          </h1>
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center bg-gray-100 rounded-full">
                <Users className="h-10 w-10 text-gray-400" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">Ekip verisi bulunamadı</h3>
              <p className="text-gray-500 mb-6">Veritabanında ekip üyesi verisi bulunmuyor. Admin panelinden ekip üyelerini ekleyebilirsiniz.</p>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-sm text-yellow-800">
                  <strong>Not:</strong> Bu sayfa veritabanından ekip üyesi verilerini çekiyor. 
                  Eğer veri görünmüyorsa, admin panelinden ekip üyelerini eklemeniz gerekiyor.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  const renderNode = (node: any, level: number = 0) => {
    const isTopLevel = level === 0;
    const isSecondLevel = level === 1;
    const isThirdLevel = level === 2;

    return (
      <div key={node.name} className="flex flex-col items-center">
        <div className={`relative ${isTopLevel ? 'mb-8' : isSecondLevel ? 'mb-6' : 'mb-4'}`}>
          <Card className={`
            bg-white shadow-md hover:shadow-lg transition-all duration-300
            ${isTopLevel ? 'border-2 border-gold-500 w-48' : 
              isSecondLevel ? 'border border-gold-300 w-40' : 'w-36'}
            transform hover:scale-102
            ${isTopLevel ? 'bg-gradient-to-br from-gold-50 to-white' : ''}
          `}>
            <CardContent className={`p-3 ${isTopLevel ? 'text-center' : ''}`}>
              <div className={`flex ${isTopLevel ? 'justify-center' : ''} items-center mb-1`}>
                <div className={`
                  p-1 rounded-full
                  ${isTopLevel ? 'bg-gold-500 text-white' : 
                    isSecondLevel ? 'bg-gold-100 text-gold-700' : 'bg-marble-100 text-marble-700'}
                `}>
                  {node.icon}
                </div>
              </div>
              <h3 className={`font-semibold text-marble-900 ${isTopLevel ? 'text-lg' : 'text-sm'}`}>
                {node.name}
              </h3>
              <p className={`text-marble-600 ${isTopLevel ? 'text-xs' : 'text-xs'} mt-0.5`}>
                {node.position}
              </p>
            </CardContent>
          </Card>
          
          {/* Vertical connecting line with gradient */}
          {node.children && (
            <div className="absolute left-1/2 -bottom-4 w-0.5 h-4 bg-gradient-to-b from-gold-300 to-gold-200"></div>
          )}
        </div>

        {node.children && (
          <div className="relative">
            {/* Horizontal connecting line with gradient */}
            <div className="absolute left-0 right-0 top-0 h-0.5 bg-gradient-to-r from-gold-200 via-gold-300 to-gold-200"></div>
            
            <div className="flex space-x-4">
              {node.children.map((child: any, index: number) => (
                <div key={child.name} className="relative">
                  {index > 0 && (
                    <div className="absolute left-0 top-0 w-4 h-0.5 bg-gradient-to-r from-gold-200 to-gold-300"></div>
                  )}
                  {renderNode(child, level + 1)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render logic for new structure
  const renderDepots = () => (
    <div className="flex flex-wrap justify-center gap-12 mt-8">
      {organization.depots.filter(depot => depot.position !== "Veri Yok").map((depot) => (
        <div key={depot.name} className="flex flex-col items-center">
          <Card className="w-56 bg-white border border-gray-200 mb-2">
            <CardContent className="p-3 text-center">
              <div className="flex justify-center mb-1">{depot.icon}</div>
              <h3 className="font-bold text-marble-900">{depot.name}</h3>
              <p className="font-semibold text-marble-800">{depot.position}</p>
            </CardContent>
          </Card>
          <div className="flex flex-wrap justify-center gap-2">
            {depot.children && depot.children.map((child) => (
              <Card key={child.position} className={`w-40 mb-2 ${child.isManager ? 'bg-gold-50 border-gold-300' : 'bg-white border-gray-200'}`}>
                <CardContent className="p-2 text-center">
                  <div className="flex justify-center mb-1">{child.icon}</div>
                  <h4 className={`font-semibold ${child.isManager ? 'text-gold-800' : 'text-marble-700'}`}>{child.name}</h4>
                  <p className={`text-xs ${child.isManager ? 'text-gold-600' : 'text-marble-600'}`}>{child.position}</p>
                  {child.isManager && (
                    <div className="mt-1">
                      <span className="inline-block px-2 py-1 text-xs bg-gold-200 text-gold-800 rounded-full">
                        Müdür
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <Layout>
      <div className="container mx-auto px-2 py-8">
        <h1 className="text-3xl font-elegant font-bold text-center mb-3 marble-border pb-4">
          Organizasyon Şeması
        </h1>
        <div className="flex flex-col items-center">
          <Card className="w-64 bg-white border border-gray-200 mb-2">
            <CardContent className="p-3 text-center">
              <div className="flex justify-center mb-1">{organization.founders.icon}</div>
              <h3 className="font-bold text-marble-900">{organization.founders.name}</h3>
            </CardContent>
          </Card>
          <div className="flex gap-4 mb-2">
            {organization.founders.children.map((founder) => (
              <Card key={founder.name} className="w-48 bg-white border border-gray-200">
                <CardContent className="p-2 text-center">
                  <div className="flex justify-center mb-1">{founder.icon}</div>
                  <h4 className="font-semibold text-marble-800">{founder.name}</h4>
                  <p className="text-xs text-marble-600">{founder.position}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          {organization.finance.position !== "Veri Yok" && (
            <Card className="w-72 bg-white border border-gray-200 mb-4">
              <CardContent className="p-2 text-center">
                <div className="flex justify-center mb-1">{organization.finance.icon}</div>
                <h4 className="font-bold text-marble-900">{organization.finance.name}</h4>
                <p className="text-xs text-marble-800">{organization.finance.position}</p>
              </CardContent>
            </Card>
          )}
        </div>
        {renderDepots()}
        {organization.export.position !== "Veri Yok" && (
          <div className="flex flex-col items-center mt-8">
            <Card className="w-72 bg-red-200 border-red-400 border-2 mb-2">
              <CardContent className="p-2 text-center">
                <div className="flex justify-center mb-1">{organization.export.icon}</div>
                <h4 className="font-bold text-red-700">{organization.export.name}</h4>
                <p className="text-xs text-red-700">{organization.export.position}</p>
              </CardContent>
            </Card>
            <div className="flex flex-wrap justify-center gap-2">
              {organization.export.children && organization.export.children.map((child) => (
                <Card key={child.position} className="w-40 bg-white border border-gray-200 mb-2">
                  <CardContent className="p-2 text-center">
                    <div className="flex justify-center mb-1">{child.icon}</div>
                    <h4 className="font-semibold text-gray-700">{child.name}</h4>
                    <p className="text-xs text-gray-500">{child.position}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Team;