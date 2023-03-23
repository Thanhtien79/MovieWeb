import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import 'antd/dist/antd.css'
import { Provider } from 'react-redux'
import { store } from './redux/configStore'
import { createBrowserHistory } from 'history'
import { Navigate, Route, Routes, unstable_HistoryRouter as HistoryRouter } from 'react-router-dom'
import Home from './pages/Home/Home'
import HomeTemplate from './templates/HomeTemplate/HomeTemplate'
import Login from './pages/Login/Login'
import Contact from './pages/Contact/Contact'
import Register from './pages/Register/Register'
import New from './pages/New/New'
import Detail from './pages/Detail/Detail'
import UserTemplate from './templates/UserTemplate/UserTemplate'
import CheckoutTemplate from './templates/CheckoutTemplate/CheckoutTemplate'
import Checkout from './pages/Checkout/Checkout'
import { Suspense, lazy } from 'react'
import Loading from './components/Loading/Loading'
import { DOAMIN_SOCKET } from './util/config'
//import * as signalR from '@aspnet/signalr'
//import đa ngôn ngữ
import './i18n';
import Profile from './pages/Profile/Profile'
import AdminTemplate from './templates/AdminTemplate/AdminTemplate'
import Movies from './pages/Admin/Movies/Movies'
import ShowTime from './pages/Admin/Showtime/ShowTime'
import Dashboard from './pages/Admin/Dashborad/Dashboard'
import AddMovie from './pages/Admin/Movies/AddMovie'
import EditMovie from './pages/Admin/Movies/EditMovie'
import MessagerBoot from './components/MessagerBoot'

//const CheckoutTemplateLazy = lazy(() => import('./templates/CheckoutTemplate/CheckoutTemplate.jsx'))
export const history = createBrowserHistory()

//export const connection = new signalR.HubConnectionBuilder().withUrl(`${DOAMIN_SOCKET}/DatVeHub`).configureLogging(signalR.LogLevel.Information).build();
const root = ReactDOM.createRoot(document.getElementById('root'))
// connection.start().then(() => {
    root.render(
        <Provider store={store}>
            <HistoryRouter history={history}>
                {/* <Suspense fallback={<h1>LOADING...</h1>}> */}
                    <Loading/>
                    <Routes>
                        <Route path="" element={<HomeTemplate />}>
                            <Route index element={<Home />}></Route>
                            <Route path="contact" element={<Contact />}></Route>
                            <Route path="home" element={<Home />}></Route>
                            <Route path="new" element={<New />}></Route>
                            <Route path="profile" element={<Profile />}></Route>
                            <Route path="detail">
                                <Route path=":id" element={<Detail />}></Route>
                            </Route>
                            <Route path="*" element={<Navigate to={''} />}></Route>
                        </Route>
    
                        <Route path="user" element={<UserTemplate />}>
                            <Route index element={<Login />}></Route>
                            <Route path="login" element={<Login />}></Route>
                            <Route path="register" element={<Register />}></Route>
                            
                            <Route path="*" element={<Navigate to={''} />}></Route>
                        </Route>
    
                        <Route path="checkout" element={<CheckoutTemplate />}>
                            <Route path=''>
                                <Route path=":id" element={<Checkout />}></Route>
                            </Route>
                            <Route path="checkout">
                                <Route path=":id" element={<Checkout />}></Route>
                            </Route>
                            <Route path="*" element={<Navigate to={''} />}></Route>
                        </Route>
                        <Route path="admin" element={<AdminTemplate />}>
                             <Route index element={<Movies />}></Route>
                            <Route path="" element={<Movies />}></Route>
                            <Route path="movies" element={<Movies />}></Route>
                            <Route path="movies/addmovie" element={<AddMovie />}></Route>
                            <Route path="movies/edit">
                                <Route path=":id" element={<EditMovie />}></Route>
                            </Route>
                            <Route path="showtime">
                                <Route path=':id/:name' element={<ShowTime />}></Route>
                            </Route>
                            <Route path="dashboard" element={<Dashboard />}></Route>
                            <Route path="*" element={<Navigate to={''} />}></Route>
                        </Route>
                    </Routes>
                {/* </Suspense> */}
            </HistoryRouter>
            <MessagerBoot/>
        </Provider>
    )
    
// }).catch(err =>{
//     console.log(err);
// })





