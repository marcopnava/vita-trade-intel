import React, { useState, useRef, useEffect } from 'react';
import { VitaLogo } from '@/components/VitaLogo';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Users, MessageCircle, TrendingUp } from 'lucide-react';
import { MOCK_CHAT_MESSAGES, MOCK_USERS } from '@/lib/mockData';
import { useAuth } from '@/hooks/useAuth';
import { ChatMessage } from '@/lib/types';

const Communication: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('general');
  const [messages, setMessages] = useState<ChatMessage[]>(MOCK_CHAT_MESSAGES);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !user) return;

    const message: ChatMessage = {
      id: `M${Date.now()}`,
      content: newMessage,
      user_id: user.id,
      user_name: user.name,
      channel: activeTab,
      created_at: new Date().toISOString(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getMessageTypeIcon = (type: string) => {
    switch (type) {
      case 'proposal':
        return <TrendingUp className="w-4 h-4 text-primary" />;
      default:
        return null;
    }
  };

  const filteredMessages = messages.filter(msg => msg.channel === activeTab);
  const otherUsers = MOCK_USERS.filter(u => u.id !== user?.id);

  const renderMessages = () => (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {filteredMessages.map((message) => {
          const isCurrentUser = message.user_id === user?.id;
          return (
            <div
              key={message.id}
              className={`flex gap-3 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isCurrentUser && (
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {getInitials(message.user_name)}
                  </AvatarFallback>
                </Avatar>
              )}
              
              <div className={`max-w-[70%] ${isCurrentUser ? 'order-1' : ''}`}>
                {!isCurrentUser && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-foreground">
                      {message.user_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatTime(message.created_at)}
                    </span>
                    {message.type === 'proposal' && (
                      <Badge variant="outline" className="text-xs">
                        Proposal
                      </Badge>
                    )}
                  </div>
                )}
                
                <div
                  className={`rounded-lg p-3 ${
                    isCurrentUser
                      ? 'bg-primary text-primary-foreground'
                      : message.type === 'proposal'
                      ? 'bg-primary/10 border border-primary/20'
                      : 'bg-muted'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    {getMessageTypeIcon(message.type)}
                    <span className="text-sm leading-relaxed">
                      {message.content}
                    </span>
                  </div>
                </div>
                
                {isCurrentUser && (
                  <div className="text-xs text-muted-foreground mt-1 text-right">
                    {formatTime(message.created_at)}
                  </div>
                )}
              </div>
              
              {isCurrentUser && (
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                    {getInitials(message.user_name)}
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );

  const renderMessageInput = () => (
    <div className="p-4 border-t border-border">
      <div className="flex gap-2">
        <Input
          placeholder={`Message ${activeTab === 'general' ? 'trading floor' : 'market alerts'}...`}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        <Button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          size="sm"
        >
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="vita-container py-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => window.location.href = '/dashboard'}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
            <div className="text-sm text-muted-foreground">Communication Hub</div>
          </div>
          <VitaLogo size="sm" showText={false} />
        </div>
      </header>

      <main className="vita-container py-8">
        <div className="grid grid-cols-4 gap-6 h-[calc(100vh-200px)]">
          {/* Sidebar */}
          <Card className="vita-card p-4 flex flex-col">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Team Members
            </h3>
            <div className="space-y-3 flex-1">
              {otherUsers.map((member) => (
                <div key={member.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-foreground truncate">
                      {member.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {member.role === 'admin' ? 'Administrator' : 'Trader'}
                    </div>
                  </div>
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                </div>
              ))}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className="vita-card col-span-3 flex flex-col">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full h-full flex flex-col">
              <div className="p-4 border-b border-border">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="general" className="flex items-center gap-2">
                    <MessageCircle className="w-4 h-4" />
                    Trading Floor
                  </TabsTrigger>
                  <TabsTrigger value="alerts" className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    Market Alerts
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="general" className="flex-1 flex flex-col mt-0">
                {renderMessages()}
                {renderMessageInput()}
              </TabsContent>

              <TabsContent value="alerts" className="flex-1 flex flex-col mt-0">
                {renderMessages()}
                {renderMessageInput()}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Communication;