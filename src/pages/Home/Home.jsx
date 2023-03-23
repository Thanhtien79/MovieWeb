import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ChatRoom from '../../components/ChatRoom'
import HomeCarousel from '../../components/HomeCarousel/HomeCarousel'
import Movie from '../../components/Movie/Movie'
import MultipleRowsSlick from '../../components/ReactSlick/MultipleRowsSlick'
import { getCinemaApi } from '../../redux/reducers/CinemaReducer'
import { getMovieApi } from '../../redux/reducers/MovieReducer'
import CinemaSystem from './CinemaSystem'

export default function Home() {

    const dispatch = useDispatch()
    const { arrMovie } = useSelector((state) => state.MovieReducer)
    const { arrCinema} = useSelector(state => state.CinemaReducer)
    console.log("He thong rap ",arrCinema);
    useEffect(() => {
        const actionMovie = getMovieApi()
        const actionCinema = getCinemaApi()
        dispatch(actionMovie)
        dispatch(actionCinema)
    }, [])
    return (
        <>
            <HomeCarousel />
           
            {/* <section className="text-gray-600 body-font" > */}
                <div className="container px-5 py-24 mx-auto " >
                    <MultipleRowsSlick arrMovie={arrMovie}/>
                </div>
            {/* </section> */}
            
            <CinemaSystem arrCinema={arrCinema}/>
        </>
    )
}
