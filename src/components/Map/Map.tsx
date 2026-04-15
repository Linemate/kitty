'use client';
import React, { useEffect, useState } from 'react';
declare global {
  interface Window {
    kakao: any;
  }
}
const Map = ({xcoordinate, ycoordinate } : {xcoordinate :number, ycoordinate:number}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    if (xcoordinate === 0 || ycoordinate === 0) return;

    const initMap = () => {
      const container = document.getElementById('map');
      if (!container || !window.kakao || !window.kakao.maps) return;

      const mapOptions = {
        center: new window.kakao.maps.LatLng(ycoordinate, xcoordinate),
        level: 3 //지도의 레벨(확대, 축소 정도)
      };

      new window.kakao.maps.Map(container, mapOptions);
    };

    if (window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => initMap());
    } else {
      const scriptId = 'kakao-map-script';
      let mapScript = document.getElementById(scriptId) as HTMLScriptElement;
      
      if (!mapScript) {
        mapScript = document.createElement('script');
        mapScript.id = scriptId;
        // autoload=false is required when dynamically adding script
        mapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=8c165b4c60cea49d4eb2376f677fd27d&autoload=false`;
        document.head.appendChild(mapScript);
      }
      
      mapScript.addEventListener('load', () => {
        if (window.kakao && window.kakao.maps) {
          window.kakao.maps.load(() => initMap());
        }
      });
    }
  }, [xcoordinate, ycoordinate]);
    return (
        <div>
            <div id="map" style={{width:'100%', height:'200px'}}></div>
        </div>
    );
};

export default Map;