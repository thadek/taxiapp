import useWebSocketSubscription from '@/app/hooks/useSocket';

const RealTimeStatus = () => {
  const { status, message } = useWebSocketSubscription('http://localhost:8080/api/v1/ws', '/topic/locations');

  return (
    <div>
      {status ? (
        <>
          <div>Status: {status}</div>
          <div>Message: {JSON.stringify(message)}</div>
        </>
      ) : (
        <div>Connecting...</div>
      )}
    </div>
  );
};

export default RealTimeStatus;