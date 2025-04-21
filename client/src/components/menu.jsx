import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'primereact/card';
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import '../tailwind.css';


const Menu = () => {
     
    const userObj= useSelector((state) => state.userSlice);
    const user =userObj.user;
    const role = user.role;
    if (!role) {
        return <p>טוען פרטי משתמש...</p>; // הצגת הודעה אם role לא נמצא
    }

    const cards = Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="w-full sm:w-1/2 lg:w-1/3 p-2">
          <Card title={`כרטיס מספר ${i + 1}`} subTitle="תת כותרת">
            <p>תוכן כלשהו בתוך הכרטיס</p>
          </Card>
        </div>
      ));

    return (
        <>
        {/* <div className='menuContainer'></div> */}
        <div style={{ zIndex: 9999, position: 'relative' }}>
            {role === 'admin' && <p>ברוך הבא👩‍🦰, מנהל!</p>}
            {role === 'teacher' && <p>ברוך הבא, מורה!</p>}
            {role === 'student' && <p>ברוך הבא, תלמיד!</p>}
        </div>
        <div className="flex flex-wrap">{cards}</div>
        </>
    );
};




export default Menu;
