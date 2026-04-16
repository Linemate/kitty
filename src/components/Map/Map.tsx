'use client';
import React, { useEffect } from 'react';
declare global {
  interface Window {
    kakao: any;
  }
}
const Map = ({xcoordinate, ycoordinate, isPoint } : {xcoordinate :number, ycoordinate:number, isPoint:boolean}) => {
  useEffect(() => {
    if (xcoordinate === 0 || ycoordinate === 0) return;

    const initMap = () => {
      const container = document.getElementById('map');
      if (!container || !window.kakao || !window.kakao.maps) return;

      const mapOptions = {
        center: new window.kakao.maps.LatLng(ycoordinate, xcoordinate),
        level: 3 //지도의 레벨(확대, 축소 정도)
      };

      const map = new window.kakao.maps.Map(container, mapOptions);
      if (isPoint) {
        var markerPosition  = new window.kakao.maps.LatLng(ycoordinate, xcoordinate); 
        var marker = new window.kakao.maps.Marker({
          position: markerPosition
        });
        marker.setMap(map);
      } else {
        var circle = new window.kakao.maps.Circle({
          center : new window.kakao.maps.LatLng(ycoordinate, xcoordinate),  // 원의 중심좌표입니다 
          radius: 100, // 미터 단위의 반지름입니다 
          strokeWeight: 0, // 선의 두께입니다 
          strokeColor: '#fff', // 선의 색깔입니다
          strokeOpacity: 0, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
          strokeStyle: 'solid', // 선의 스타일 입니다
          fillColor: '#CFE7FF', // 채우기 색깔입니다
          fillOpacity: 0.7  // 채우기 불투명도 입니다   
        }); 

        // 지도에 원을 표시합니다 
        circle.setMap(map);
      }
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