import React, { useState, createContext } from "react";

export const SubscriberContext = createContext(null);

export const SubscriberProvider = ({ children }) => {
  const [subscriber, setsubscriber] = useState(JSON.parse(localStorage.getItem("subscription"))||[]);

  return (
    <SubscriberContext.Provider value={{ subscriber, setsubscriber }}>
      {children}
    </SubscriberContext.Provider>
  );
};

export default SubscriberProvider;