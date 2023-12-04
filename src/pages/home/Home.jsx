import React from 'react'
import Banner from '../../components/Banner'
import SpecialDishes from './SpecialDishes'
import Testimonials from './Testimonials'
import OurServices from './OurServices'
import Catagories from './Categories'

const Home = () => {
  return (
    <div>
       <Banner/>
       <Catagories />
       <SpecialDishes/>
       <Testimonials/>
       <OurServices/>
    </div>
  )
}

export default Home