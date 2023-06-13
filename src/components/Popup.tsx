import { FC, useRef } from 'react'
import { useOnClickOutside } from 'usehooks-ts'
import { IPopup } from '../types/popup.types'


const Popup: FC<IPopup> = ({ setOpenPopup }) => {

   const ref = useRef(null)

   const handleClickOutside = (e: any) => {
      if (e.target.nodeName !== 'BUTTON') {
         setOpenPopup(false)
      }
   }
   useOnClickOutside(ref, handleClickOutside)

   return (
      <div className="popup" ref={ref}>
         <div className="popup__title">Тема ВКР: Создание интерактивного гида по мемориальным доскам центрального района г. Красноярск</div>
         <div className="popup__student">Выпускник: Сунцов Илья Сергеевич</div>
         <div className="popup__descr">Краткое описание: В данной работе вы можете увидеть краткую информацию о мемориальных досках центрального района г. Красноярск, их фотографии, а также местоположении.</div>
      </div>
   )
}

export default Popup