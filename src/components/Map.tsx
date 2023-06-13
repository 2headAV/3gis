import React, { FC, useEffect } from 'react'
import { load } from '@2gis/mapgl'
import { Clusterer } from '@2gis/mapgl-clusterer'
import { Drawer } from 'rsuite'

import { coordinates } from '../db'

import Popup from './Popup'
import MapWrapper from '../components/MapWrapper'

const Map: FC = () => {
   const [open, setOpen] = React.useState(false)
   const [markerData, setMarkerData] = React.useState<any>(null)
   const [openPopup, setOpenPopup] = React.useState<boolean>(false)

   const windowWidth = window.innerWidth


   function calculateAverage(matrix: number[][]) {
      const averages = []

      for (let i = 0; i < matrix[0].length; i++) {
         let sum = 0
         for (let j = 0; j < matrix.length; j++) {
            sum += matrix[j][i]
         }
         const average = sum / matrix.length
         averages.push(average)
      }

      return averages
   }

   useEffect(() => {
      let map: any
      load().then((mapglAPI) => {
         map = new mapglAPI.Map('map-container', {
            center: [92.877934, 56.015396],
            zoom: 15,
            key: '042b5b75-f847-4f2a-b695-b5f58adc9dfd',
         })

         const clusterer = new Clusterer(map, {
            radius: 40,

         })
         clusterer.load(coordinates) // располагает маркеры
         clusterer.on('click', (event) => { // при клике на маркер
            if (Array.isArray(event.target.data)) { // проверяет это маркер или кластер
               let centerCoord: number[][] = []
               event.target.data.forEach((el) => centerCoord.push(el.coordinates)) // раскрывает кластер
               map.setCenter(calculateAverage(centerCoord))
               map.setZoom(17, { duration: 500, easing: "easeInQuint" })
            } else {
               setMarkerData(event.target.data) // открывается маркер
               setOpen(true)
            }
         })

         const control = new mapglAPI.Control(map, `<button class="about__project">О проекте</button>`, {
            position: 'bottomLeft',
         })
         control!
            .getContainer()!
            .querySelector('button')!
            .addEventListener('click', (event) => {
               setOpenPopup(prev => !prev)
            })


         const controlContent = `
            <div class="buttonRoot" id="find-me">
                <button class="button">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="32"
                        height="32"
                        viewBox="0 0 32 32"
                    >
                        <path
                            fill="currentColor"
                            d="M17.89 26.27l-2.7-9.46-9.46-2.7 18.92-6.76zm-5.62-12.38l4.54 1.3 1.3 4.54 3.24-9.08z"
                        />
                    </svg>
                </button>
            </div>
            <p id="status"></p>
        `

         const controlMe = new mapglAPI.Control(map, controlContent, {
            position: 'topLeft',
         })

         const status = controlMe.getContainer().querySelector('#status')
         let circle: any

         function success(pos: any) {
            const center = [pos.coords.longitude, pos.coords.latitude]

            if (status) {
               status.textContent = ''
               if (circle) {
                  circle.destroy()
               }
            }

            circle = new mapglAPI.CircleMarker(map, {
               coordinates: center,
               radius: 14,
               color: '#0088ff',
               strokeWidth: 4,
               strokeColor: '#ffffff',
               stroke2Width: 6,
               stroke2Color: '#0088ff55',
            })
            map.setCenter(center)
            map.setZoom(16)
         }

         function error() {
            if (status) {
               status.textContent = 'Unable to retrieve your location'
            }
         }

         function geoFindMe() {
            if (!navigator.geolocation) {
               if (status) {
                  status.textContent = 'Geolocation is not supported by your browser'
               }
            } else {
               if (status) {
                  status.textContent = 'Locating…'
                  navigator.geolocation.getCurrentPosition(success, error)
               }
            }
         }

         controlMe!
            .getContainer()!
            .querySelector('#find-me')!
            .addEventListener('click', geoFindMe)
      })

      return () => map && map.destroy()
   }, [])


   return (
      <>
         <div className='map'>
            <MapWrapper />
         </div>
         <Drawer size={windowWidth >= 820 ? 'md' : 'xs'} placement='left' open={open} onClose={() => setOpen(false)}>
            <Drawer.Header>
               <Drawer.Title className='map__title'>{markerData?.title}</Drawer.Title>
            </Drawer.Header>
            <Drawer.Body>
               <div className='map__adress'>{markerData?.adress}</div>
               <div className='marker__img'>
                  <img src={markerData?.img} alt="#" />
               </div>

               <div className='map__descr' style={{ whiteSpace: 'pre-line' }}  >{markerData?.descr}</div>


            </Drawer.Body>
         </Drawer>
         {
            openPopup && <><div className="popup__wrapper"></div><Popup setOpenPopup={setOpenPopup} /></>
         }

      </>
   )
}

export default Map