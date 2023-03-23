import React, { useEffect } from 'react'
import { Carousel } from 'antd'
import { useDispatch, useSelector } from 'react-redux'
import { getBannerApi } from '../../redux/reducers/BannerReducer';
import './HomeCarousel.css'

const contentStyle = {
    height: '660px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
    backgroundPosition:"center",
    backgroundSize:'cover',
    backgroundRepeat:'no-repeat'
}
export default function HomeCarousel() {
    const dispatch = useDispatch();
    const {arrBanner} = useSelector(state => state.BannerReducer);

    useEffect(() => {
        const action = getBannerApi();
        dispatch(action);
    },[])

    const renderImg = () => {
        return arrBanner.map((banner,index) => {
            return <div key={index}>
            <div className='h-full ' style={{...contentStyle, backgroundImage:`url(${banner.poster})`}}>
                <img className='w-full opacity-0 object-cover' src={banner.poster} />
            </div>
        </div>
        })
    }
    return (
        <Carousel autoplay>
            {renderImg()}
        </Carousel>
    )
}
