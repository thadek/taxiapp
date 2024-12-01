import { useEffect, useState } from 'react'; /*@ts-ignore */
import SockJS from 'sockjs-client'; 
import { Client } from '@stomp/stompjs';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';

const useWebSocketSubscription = (url: string, topic: string) => {
  const [status, setStatus] = useState<string>('CONNECTING');
  const [message, setMessage] = useState<Object>();
  const { data: session } = useSession();
  const [isReconnecting, setIsReconnecting] = useState(false);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    if (!session?.token || !url || !topic) return;

    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;

    const socket = new SockJS(`${url}?token=${session.token}`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { token: session.token },
      reconnectDelay: 1100, // Intenta reconectar cada 5 segundos
      onConnect: () => {
        setStatus('CONNECTED');
        setIsReconnecting(false);
        setAttempts(0);

  
        
        stompClient.subscribe(topic, (msg) => {
          setMessage(JSON.parse(msg.body));
        });
      },
      onDisconnect: () => {
        setStatus('DISCONNECTED');
        if (!isReconnecting) {
          setIsReconnecting(true);
          
        }
      },
      onStompError: (frame) => {
        console.error('Broker error:', frame.headers['message']);
        console.error('Details:', frame.body);
        setStatus('ERROR');
       
      },
      
    });

    stompClient.onWebSocketClose = () => {
      if (reconnectAttempts < maxReconnectAttempts) {
        setAttempts((prev) => prev + 1);
    
        setStatus(`RECONNECTING`);
        
      } else {
        setStatus('FAILED');
        
        setIsReconnecting(false); // Detener intentos
      }
    };

    stompClient.activate();

    return () => {
      if(stompClient){
        stompClient.deactivate();
      }
      
    };
  }, [session, url, topic]);

  return { status, message, isReconnecting };
};

export default useWebSocketSubscription;