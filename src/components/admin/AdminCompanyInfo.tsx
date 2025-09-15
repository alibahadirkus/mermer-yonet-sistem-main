
import React, { useState } from "react";
import { useContent, CompanyInfo } from "@/contexts/ContentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";

const AdminCompanyInfo = () => {
  const { companyInfo, updateCompanyInfo } = useContent();
  const [info, setInfo] = useState<CompanyInfo>(companyInfo);
  const [isEditing, setIsEditing] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setInfo(prev => ({ ...prev, [name]: value }));
  };
  
  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setInfo(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanyInfo(info);
    setIsEditing(false);
  };
  
  if (!isEditing) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Company Information</h2>
          <Button onClick={() => setIsEditing(true)}>Edit Information</Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Company Name</Label>
                <p className="text-marble-800">{companyInfo.name}</p>
              </div>
              <div>
                <Label>Description</Label>
                <p className="text-marble-800">{companyInfo.description}</p>
              </div>
              <div>
                <Label>Founded Year</Label>
                <p className="text-marble-800">{companyInfo.foundedYear}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Address</Label>
                <p className="text-marble-800">{companyInfo.address}</p>
              </div>
              <div>
                <Label>Phone</Label>
                <p className="text-marble-800">{companyInfo.phone}</p>
              </div>
              <div>
                <Label>Email</Label>
                <p className="text-marble-800">{companyInfo.email}</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>About Text</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-marble-800">{companyInfo.aboutText}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-marble-800">{companyInfo.mission}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-marble-800">{companyInfo.vision}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Edit Company Information</h2>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>General Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Company Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={info.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={info.description}
                  onChange={handleChange}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="foundedYear">Founded Year</Label>
                <Input
                  id="foundedYear"
                  name="foundedYear"
                  type="number"
                  value={info.foundedYear}
                  onChange={handleNumberChange}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={info.address}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={info.phone}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={info.email}
                  onChange={handleChange}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>About Text</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="aboutText"
                name="aboutText"
                value={info.aboutText}
                onChange={handleChange}
                className="min-h-32"
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Mission</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="mission"
                name="mission"
                value={info.mission}
                onChange={handleChange}
                rows={4}
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Vision</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                id="vision"
                name="vision"
                value={info.vision}
                onChange={handleChange}
                rows={4}
              />
            </CardContent>
          </Card>
        </div>
        
        <div className="mt-6 flex justify-end gap-4">
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => {
              setInfo(companyInfo);
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
          <Button type="submit">Save Changes</Button>
        </div>
      </form>
    </div>
  );
};

export default AdminCompanyInfo;
