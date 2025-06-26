'use client';
import React, { useEffect } from 'react';
import Script from "next/script";

const Map = ({xcoordinate, ycoordinate } : {xcoordinate :number, ycoordinate:number}) => {
    useEffect(() => {
      if (xcoordinate !== 0 && ycoordinate !== 0) {
        const initMap = () => {
          const mapOptions = {
            center: new naver.maps.LatLng(ycoordinate, xcoordinate),
            zoom: 18,
            scrollWheel: false
          };
    
          new naver.maps.Map('map', mapOptions);
        };
        if (window.naver && window.naver.maps) {
          initMap();
        } else {
          const mapScript = document.createElement('script');
          mapScript.onload = () => initMap();
          mapScript.src = `https://oapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_ID}`;
          document.head.appendChild(mapScript);
        }
      }
    }, [xcoordinate, ycoordinate]);
    return (
        <div>
            <div id="map" style={{width:'100%', height:'200px'}}></div>
        </div>
    );
};

export default Map;