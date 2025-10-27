


import Layout from "./Layout"
import UserSlide from "./User/UserSlide"
import Services from "./Services"
import  About  from './About'
import  Testimonials  from './Testimonials'
import Products from './Products'
import ChooseUs from './ChooseUs'
import ServiceBrand from './ServiceBrand'
import Comprehensive from './Comprehensive'
import Navbar from './NavBar'
import LocationSection from './LocationSection'

const Home = () => {

  return (
    <Layout>
      
      <UserSlide/>
      <Products/>
      <Services/>
      <Testimonials/>
      <ChooseUs/>
      <Navbar/>
      <About/>
      <Comprehensive />
      <LocationSection/>
      <ServiceBrand/>
      

    </Layout>
  )
}

export default Home
