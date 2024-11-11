import { useEffect, useState } from 'react'; /*@ts-ignore */
import SockJS from 'sockjs-client'; 
import { Client } from '@stomp/stompjs';
import { useSession } from 'next-auth/react';

const useWebSocketSubscription = (url:string, topic:string) => {
  const [status, setStatus] = useState<string>("Connecting...");
  const [message, setMessage] = useState(null);
  const { data: session } = useSession();

  useEffect(() => {
    if (!session?.token || !url || !topic) return;

    const socket = new SockJS(`${url}?token=${session.token}`);
    const stompClient = new Client({
      webSocketFactory: () => socket,
      connectHeaders: { "token": session.token },
      onConnect: () => {
        setStatus("Connected");
        stompClient.subscribe(topic, (msg) => {
          setMessage(JSON.parse(msg.body));
        });
      },
      onStompError: (frame) => {
        console.error('Broker error:', frame.headers['message']);
        console.error('Details:', frame.body);
      },
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [session, url, topic]);

  return { status, message };
};

export default useWebSocketSubscription;
