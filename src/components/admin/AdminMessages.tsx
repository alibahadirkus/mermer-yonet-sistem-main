
import React from "react";
import { useContent } from "@/contexts/ContentContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Trash } from "lucide-react";

const AdminMessages = () => {
  const { messages, markMessageAsRead, deleteMessage } = useContent();
  const [selectedMessage, setSelectedMessage] = React.useState<string | null>(null);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  const handleOpenMessage = (id: string) => {
    setSelectedMessage(id);
    markMessageAsRead(id);
  };
  
  const handleDeleteMessage = (id: string) => {
    deleteMessage(id);
    if (selectedMessage === id) {
      setSelectedMessage(null);
    }
  };
  
  const message = selectedMessage ? messages.find(m => m.id === selectedMessage) : null;
  const unreadCount = messages.filter(m => !m.read).length;
  
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">Messages</h2>
          {unreadCount > 0 && (
            <Badge variant="default" className="bg-primary">
              {unreadCount} unread
            </Badge>
          )}
        </div>
      </div>
      
      {messages.length === 0 ? (
        <div className="text-center py-12 bg-marble-50 rounded-lg">
          <p className="text-marble-600">No messages yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2">
            {messages.map((message) => (
              <Card 
                key={message.id}
                className={`cursor-pointer transition-colors ${
                  selectedMessage === message.id ? 'border-primary' : ''
                } ${!message.read ? 'bg-marble-50' : ''}`}
                onClick={() => handleOpenMessage(message.id)}
              >
                <CardHeader className="py-3 px-4">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-base font-medium">{message.name}</CardTitle>
                    {!message.read && (
                      <Badge variant="default" className="bg-primary">New</Badge>
                    )}
                  </div>
                  <p className="text-xs text-marble-500">{formatDate(message.date)}</p>
                </CardHeader>
                <CardContent className="py-2 px-4">
                  <p className="text-sm line-clamp-2">{message.message}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="md:col-span-2">
            {message ? (
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="mb-1">{message.name}</CardTitle>
                      <p className="text-sm text-marble-600">{message.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Confirm Deletion</DialogTitle>
                          </DialogHeader>
                          <p className="py-4">
                            Are you sure you want to delete this message? This action cannot be undone.
                          </p>
                          <DialogFooter>
                            <DialogClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DialogClose>
                            <Button 
                              variant="destructive" 
                              onClick={() => handleDeleteMessage(message.id)}
                            >
                              Delete Message
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                  <p className="text-xs text-marble-500">{formatDate(message.date)}</p>
                </CardHeader>
                <CardContent className="border-t border-marble-100 pt-4">
                  <div className="prose">
                    <p className="whitespace-pre-wrap">{message.message}</p>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-marble-100 pt-4 flex justify-between">
                  <Button variant="outline" onClick={() => window.location.href = `mailto:${message.email}`}>
                    Reply via Email
                  </Button>
                </CardFooter>
              </Card>
            ) : (
              <div className="h-full flex items-center justify-center bg-marble-50 rounded-lg p-12">
                <p className="text-marble-600">Select a message to view its details</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMessages;
