import { load } from '@2gis/mapgl';
import { useEffect } from 'react';
import MapWrapper from '../components/MapWrapper';
import { Drawer } from 'rsuite';
import React from 'react';
import { IMarkerData } from '../types';
import lenin from '../images/LENIN.jpg';

const Map = () => {
   const [open, setOpen] = React.useState(false);
   const [markerData, setMarkerData] = React.useState<IMarkerData | null>(null)
   useEffect(() => {
      let map: any;
      load().then((mapglAPI) => {
         map = new mapglAPI.Map('map-container', {
            center: [92.877934, 56.015396],
            zoom: 13,
            key: '042b5b75-f847-4f2a-b695-b5f58adc9dfd',
         });

         const marker = new mapglAPI.Marker(map, {
            coordinates: [92.877934, 56.015396],
            userData: {
               title: 'lox',
               adress: 'adressadressadressadressadressadressad ressadressadressadressadressadress',
               img: lenin,
               descr: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.'
            }
         });
         marker.on('click', (e) => {
            setMarkerData(e.targetData.userData)
            setOpen(true);
         });
      });

      return () => map && map.destroy();
   }, []);

   return (
      <>
         <div style={{ width: '100%', height: '100%' }}>
            <MapWrapper />
         </div>
         <Drawer placement='left' open={open} onClose={() => setOpen(false)}>
            <Drawer.Header>
               <Drawer.Title>{markerData?.title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
               <div>{markerData?.adress}</div>
               <div className='marker__img'>
                  <img src={markerData?.img} alt="#" />
               </div>
               <div>{markerData?.descr}</div>
            </Drawer.Body>
         </Drawer>
      </>
   );
}

export default Map