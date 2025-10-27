// src/pages/UserHome.jsx
import React from 'react';



import UserSlide from './UserSlide';
import UserProducts from './UserProducts';

import OnlineRepairing from './OnlineRepairing';

import WaterEffect from './WaterEffect';
import ThankYouPage from './ThankYouPage';
import ServiceBrand from './ServiceBrand';
import Comprehensive from './Comprehensive';
import Services from './Services';
import Testimonials from './Testimonials';
import ChooseUs from './ChooseUs';
import LocationSection from './LocationSection';
const UserHome = () => {
  return (

    <>
    <UserSlide/>
    <UserProducts/>
    <OnlineRepairing/>
    <Services/>
    <Testimonials/>
    <ChooseUs/>
    <Comprehensive/>
    <WaterEffect/>
    <LocationSection/>
    <ServiceBrand/>
    <ThankYouPage/>
    
    
          
    </>
  );
};

export default UserHome;
