import React, { FC, useEffect } from 'react';
import { load } from '@2gis/mapgl';
import { Clusterer } from '@2gis/mapgl-clusterer';
import { Drawer } from 'rsuite';
import { coordinates } from '../db';


import Popup from './Popup';
import MapWrapper from '../components/MapWrapper';



const Map: FC = () => {
   const [open, setOpen] = React.useState(false);
   const [markerData, setMarkerData] = React.useState<any>(null)
   const [openPopup, setOpenPopup] = React.useState<boolean>(false)
   // const [markerData, setMarkerData] = React.useState<IMarkerData | null>(null)


   function calculateAverage(matrix: number[][]) {
      const averages = [];

      for (let i = 0; i < matrix[0].length; i++) {
         let sum = 0;
         for (let j = 0; j < matrix.length; j++) {
            sum += matrix[j][i];
         }
         const average = sum / matrix.length;
         averages.push(average);
      }

      return averages;
   }


   useEffect(() => {
      let map: any;
      load().then((mapglAPI) => {
         map = new mapglAPI.Map('map-container', {
            center: [92.877934, 56.015396],
            zoom: 13,
            key: '042b5b75-f847-4f2a-b695-b5f58adc9dfd',
         });

         const clusterer = new Clusterer(map, {
            radius: 40,

         });
         clusterer.load(coordinates);
         clusterer.on('click', (event) => {
            if (Array.isArray(event.target.data)) {
               let centerCoord: number[][] = []
               event.target.data.forEach((el) => centerCoord.push(el.coordinates))
               map.setCenter(calculateAverage(centerCoord))
               map.setZoom(17, { duration: 500, easing: "easeInQuint" })
            } else {
               setMarkerData(event.target.data)
               setOpen(true);
            }
         });

         const control = new mapglAPI.Control(map, `<button class="about__project">О проекте</button>`, {
            position: 'bottomLeft',
         });
         control!
            .getContainer()!
            .querySelector('button')!
            .addEventListener('click', (event) => {
               setOpenPopup(prev => !prev)
            });
      });

      return () => map && map.destroy();
   }, []);


   return (
      <>
         <div className='map'>
            <MapWrapper />
         </div>
         <Drawer size='md' placement='left' open={open} onClose={() => setOpen(false)}>
            <Drawer.Header>
               <Drawer.Title className='map__title'>{markerData?.title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
               <div className='map__adress'>{markerData?.adress}</div>
               <div className='marker__img'>
                  <img src={markerData?.img} alt="#" />
               </div>

               <div className='map__descr' >{markerData?.descr}</div>

               {/* <div style={{ whiteSpace: 'pre-line' }}>{markerData?.descr}</div> */}

            </Drawer.Body>
         </Drawer>
         {
            openPopup && <><div className="popup__wrapper"></div><Popup setOpenPopup={setOpenPopup} /></>
         }

      </>
   );
}

export default Map