import React from "react";
import Layout from "@/components/Layout";
import { useContent } from "@/contexts/ContentContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";
import Map from "@/components/Map";

const formSchema = z.object({
  name: z.string().min(2, "İsim en az 2 karakter olmalıdır"),
  email: z.string().email("Lütfen geçerli bir e-posta adresi girin"),
  message: z.string().min(10, "Mesaj en az 10 karakter olmalıdır")
});

type FormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const { companyInfo, addMessage } = useContent();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: ""
    }
  });
  
  function onSubmit(data: FormValues) {
    // Here's the fix: ensuring all required properties are present and not undefined
    const messageData = {
      name: data.name,
      email: data.email,
      message: data.message
    };
    
    addMessage(messageData);
    form.reset();
  }
  
  return (
    <Layout>
      {/* Header */}
      <section className="bg-marble-800 py-16 text-white">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-elegant font-bold mb-4">İletişim</h1>
          <p className="text-lg text-marble-200">
            Sorularınız, fiyat teklifleri veya herhangi bir konuda bizimle iletişime geçin
          </p>
        </div>
      </section>
      
      {/* Contact Form & Info */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="lg:w-2/3 bg-white p-8 rounded-lg shadow-md">
              <h2 className="text-2xl font-elegant font-bold mb-6 marble-border pb-4">Bize Mesaj Gönderin</h2>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>İsim</FormLabel>
                        <FormControl>
                          <Input placeholder="İsminiz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-posta</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="E-posta adresiniz" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Mesaj</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Size nasıl yardımcı olabiliriz?" 
                            className="min-h-32"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <Button 
                    type="submit"
                    className="bg-primary text-white w-full py-6"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? "Gönderiliyor..." : "Mesaj Gönder"}
                  </Button>
                </form>
              </Form>
            </div>
            
            {/* Contact Information */}
            <Card className="p-6">
              <CardContent>
                <h2 className="text-xl font-elegant font-bold mb-4">İletişim Bilgileri</h2>
                <div className="space-y-4">
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {companyInfo.address}
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    +90 266 715 42 80
                  </p>
                  <p className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    info@acmadencilik.com.tr
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Map */}
      <section className="bg-marble-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-elegant font-bold mb-8">Bizi Bulun</h2>
          <div className="h-[400px]">
            <Map />
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contact;
