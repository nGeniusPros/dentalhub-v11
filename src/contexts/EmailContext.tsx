import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the shape of our context
interface EmailContextType {
  unreadCount: number;
  emails: Email[];
  markAsRead: (id: string) => void;
  sendEmail: (email: Omit<Email, 'id' | 'date'>) => void;
}

// Define the Email type
interface Email {
  id: string;
  subject: string;
  body: string;
  sender: string;
  recipient: string;
  date: Date;
  read: boolean;
}

// Create the context with a default value
const EmailContext = createContext<EmailContextType | undefined>(undefined);

// Provider component
export const EmailProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [emails, setEmails] = useState<Email[]>([]);

  // Calculate unread count
  const unreadCount = emails.filter(email => !email.read).length;

  // Mark an email as read
  const markAsRead = (id: string) => {
    setEmails(prevEmails =>
      prevEmails.map(email =>
        email.id === id ? { ...email, read: true } : email
      )
    );
  };

  // Send a new email
  const sendEmail = (email: Omit<Email, 'id' | 'date'>) => {
    const newEmail: Email = {
      ...email,
      id: Math.random().toString(36).substring(2, 9),
      date: new Date(),
    };
    
    setEmails(prevEmails => [...prevEmails, newEmail]);
  };

  // Value to be provided to consumers
  const value = {
    unreadCount,
    emails,
    markAsRead,
    sendEmail,
  };

  return <EmailContext.Provider value={value}>{children}</EmailContext.Provider>;
};

// Custom hook for using the email context
export const useEmail = (): EmailContextType => {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
};
