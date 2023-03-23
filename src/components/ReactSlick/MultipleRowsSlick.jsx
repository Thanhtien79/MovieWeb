import React, { Component } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import Slider from 'react-slick'
import { getPhimDangChieu, getPhimSapChieu } from '../../redux/reducers/MovieReducer'
import Movie from '../Movie/Movie'
import MovieFlip from '../Movie/MovieFlip'
import styleSlick from './MultipleRowSlick.module.css'



function SampleNextArrow(props) {
    const { className, style, onClick } = props
    return (
        <div
            className={`${className} ${styleSlick['slick-prev']}`}
            style={{ ...style, display: 'block' }}
            onClick={onClick}
        ></div>
    )
}

function SamplePrevArrow(props) {
    const { className, style, onClick } = props
    return (
        <div
            className={`${className} ${styleSlick['slick-prev']}`}
            style={{ ...style, display: 'block', left: '-50px' }}
            onClick={onClick}
        ></div>
    )
}

export default function MultipleRowsSlick(props) {
    const dispatch = useDispatch();
    const{dangChieu,sapChieu} = useSelector(state => state.MovieReducer);

    const renderMovie = () => {
        return props.arrMovie.slice(0,20).map((movie, index) => {
            return (
                <div key={index} className="mt-3">
                    <MovieFlip phim={movie} />
                </div>
            )
        })
    }

    let activeDC = dangChieu === true ? 'active_Film' : '';
    let activeSC = sapChieu === true ? 'active_Film' : '';
    const settings = {
        className: 'center variable-width',
        centerMode: true,
        infinite: true,
        centerPadding: '60px',
        slidesToShow: 1.8,
        speed: 500,
        rows: 2,
        autoplay:true,
        slidesPerRow: 2,
        variableWidth: true,
        nextArrow: <SampleNextArrow />,
        prevArrow: <SamplePrevArrow />,
    }
    return (
        <div className="container">
            <div>
                <button className={`relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 ${styleSlick[activeDC]}`} onClick={ () => {
                  const action = getPhimDangChieu();
                  dispatch(action);
                }}>
                    <span className={`relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 ${styleSlick[activeDC]}`}>
                        PHIM ĐANG CHIẾU
                    </span>
                </button>
                <button className={`relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 ${styleSlick[activeSC]}`} onClick={ () => {
                  const action = getPhimSapChieu();
                  dispatch(action);
                }}>
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        PHIM SẮP CHIẾU
                    </span>
                </button>
            </div>

            <Slider {...settings}>{renderMovie()}</Slider>
        </div>
    )
}
