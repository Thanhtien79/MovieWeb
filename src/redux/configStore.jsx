import {configureStore} from '@reduxjs/toolkit'
import BannerReducer from './reducers/BannerReducer'
import CinemaReducer from './reducers/CinemaReducer'
import LoadingReducer from './reducers/LoadingReducer'
import MovieReducer from './reducers/MovieReducer'
import TicketReducer from './reducers/TicketReducer'
import UserReducer from './reducers/UserReducer'

export const store = configureStore({
    reducer: {
        BannerReducer:BannerReducer,
        MovieReducer:MovieReducer,
        CinemaReducer:CinemaReducer,
        UserReducer:UserReducer,
        TicketReducer:TicketReducer,
        LoadingReducer:LoadingReducer
    }
})