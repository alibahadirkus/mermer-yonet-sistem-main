import React from 'react';

const Map: React.FC = () => {
  const latitude = 40.217103;
  const longitude = 28.072503;

  return (
    <div className="w-full h-[400px] rounded-lg overflow-hidden">
      <iframe
        width="100%"
        height="100%"
        frameBorder="0"
        style={{ border: 0 }}
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyB41DRUbKWJHPxaFjMAwdrzWzbVKartNGg&q=${latitude},${longitude}&zoom=15`}
        allowFullScreen
      />
    </div>
  );
};

export default Map; 