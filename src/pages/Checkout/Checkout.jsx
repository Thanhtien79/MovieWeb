import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom'
import { over } from 'stompjs'
import Sockjs from 'sockjs-client'
import {
    chuyenTabChonVe,
    chuyenTabThongTinVe,
    datGhe,
    datGheAction,
    getGheNguoiKhacDat,
    getThongTinPhongVeApi,
    getVeDangDat,
    guiThongtinDatVe,
    pushVeDangDat,
} from '../../redux/reducers/TicketReducer'
import './Checkout.css'
import _ from 'lodash'
import { Ghe } from '../../_core/models/ThongTinPhongVe'
import {
    CheckOutlined,
    CloseOutlined,
    HomeOutlined,
    SmileOutlined,
    UserAddOutlined,
    UserDeleteOutlined,
} from '@ant-design/icons'

import { ThongTinDatVe } from '../../_core/models/ThongTinDatVe'
import { Tabs } from 'antd'
import { lichSuDatVeApi } from '../../redux/reducers/UserReducer'
import moment from 'moment'
//import { connection, history } from '../../index.js'
import {history } from '../../index.js'
import { DOAMIN_SOCKET, TOKEN_USER, USER_LOGIN } from '../../util/config'

export var stompClient = null
export function Checkout(props) {
    const dispatch = useDispatch()
    const { id } = useParams()
    const { userLogin } = useSelector((state) => state.UserReducer)
    const { chiTietPhongve, danhSachGheDangDat, danhSachGheKhachDat } = useSelector(
        (state) => state.TicketReducer
    )
    const { thongTinPhim, danhSachGhe } = chiTietPhongve

    useEffect(() => {
        const action = getThongTinPhongVeApi(id)
        dispatch(action)
        
        let Sock = new Sockjs(DOAMIN_SOCKET)
        stompClient = over(Sock)
        stompClient.connect({}, onConnected, onError)
        
        // có 1 client nào thực hiện việc đặt vé thành công mình sẽ reload lại danh sách phòng vé của lịch chiếu đó
        // connection.on('datVeThanhCong', () => {
        //     dispatch(action)
        // })

        //Vừa vào trang load lại tất cả ghế của các người khác đang đặt
        //connection.invoke('loadDanhSachGhe', id)


        //load danh sách ghế đang đặt từ server về
        // connection.on('loadDanhSachGheDaDat', (dsGheKhachDat) => {
        //     console.log('Danh Sach Ghe Khach Dat', dsGheKhachDat)
        //     //B1: Loại mình ra khỏi danh sách
        //     dsGheKhachDat = dsGheKhachDat.filter((item) => item.taiKhoan !== userLogin.taiKhoan)
        //     //B2; gộp tất cả danh sách khách đặt thành 1 mảng lớn
        //     let arrGheKhachDat = dsGheKhachDat.reduce((result, item, index) => {
        //         let arrGhe = JSON.parse(item.danhSachGhe)
        //         return [...result, ...arrGhe]
        //     }, [])
        //     console.log('===========', arrGheKhachDat)
        //     // Đưa ghế người khác đặt lên cập nhật redux
        //     arrGheKhachDat = _.uniq(arrGheKhachDat, 'maGhe')
        //     dispatch(getGheNguoiKhacDat(arrGheKhachDat))

        //     // Cài đặt sự kiện khi reload trang
        //     window.addEventListener('beforeunload', clearGhe)

        //     return () => {
        //         clearGhe()
        //         window.removeEventListener('beforeunload', clearGhe)
        //     }
        // })
        // Cài đặt sự kiện khi reload trang
        window.addEventListener('beforeunload', clearGhe)
        return () => {
                    clearGhe()
                    window.removeEventListener('beforeunload', clearGhe)
                }
    }, [])
    const clearGhe =() => {
        if(stompClient){
            let infor = {
                email:userLogin.id,
                list:[],
                maLC:id
            }
            stompClient.send('/app/huyDat',{},JSON.stringify(infor))
        }
    }

    const onConnected = () => {
        stompClient.subscribe('/booking/danhSachGheDat', (payload => {
            let payloadData = JSON.parse(payload.body)
            
            payloadData = payloadData.filter(item => item.idUser !== userLogin.id)
            payloadData = _.uniqBy(payloadData,"id")
            console.log("Danh sach ghe khach dat",payloadData);
            const action = getGheNguoiKhacDat(payloadData);
            dispatch(action)
        }))
        stompClient.subscribe('/booking/datVeThanhCong', (payload => {
            const action = getThongTinPhongVeApi(id)
            dispatch(action)
        }))
        if(stompClient){
            let infor = {
                email:userLogin.id,
                list:[],
                maLC:id
            }
            stompClient.send('/app/loadDanhSachGhe',{},JSON.stringify(infor))
        }
    }
    const onError = (err) => {
        console.log("loi ne", err)
    }
    const sendPublicMess = () => {
        if(stompClient){
            stompClient.send('/app/datGhe',{},JSON.stringify("Hello"))
        }
    }
    // const onPublicMessReceived = (payload) => {
    //     //let payloadData = JSON.parse(payload.body)
    //     let payloadData = payload
    //     console.log("payloadData====",payloadData);
    // }
    // const clearGhe = function (event) {
    //     connection.invoke('huyDat', userLogin.taiKhoan, id)
    // }
    const renderSeat = () => {
        return danhSachGhe?.map((seat, index) => {
            let classGheVip = seat.loaiGhe === 'Vip' ? 'gheVip' : ''
            let classGheDaDat = seat.daDat === true ? 'gheDaDat' : ''
            let classGheDangDat = ''
            let indexGheDD = danhSachGheDangDat.findIndex((gheDD) => gheDD.id === seat.id)
            if (indexGheDD != -1) {
                classGheDangDat = 'gheDangDat'
            }
            let classGheCuaBan = ''
            if (userLogin.id === seat.idUser&&seat.daDat==true) {
                classGheCuaBan = 'gheDaDuocDat'
            }
            //check mỗi ghế xem có phải ghế người khác đang đặt không
            let classGheKhachDat = ''
            let indexGheKD = danhSachGheKhachDat.findIndex((gheKD) => gheKD.id === seat.id)
            if (indexGheKD !== -1) {
                classGheKhachDat = 'gheKhachDat'
            }

            return (
                <Fragment key={index}>
                    <button
                        onClick={(e) => {
                            //dispatch(getVeDangDat(seat))
                            const action = datGhe(seat, id)
                            dispatch(action)
                        }}
                        disabled={seat.daDat || classGheKhachDat !== ''}
                        className={`ghe ${classGheKhachDat} ${classGheCuaBan} hover:bg-green-400 ${classGheVip} ${classGheDangDat} ${classGheDaDat}`}
                        key={index}
                    >
                        {seat.daDat ? (
                            classGheDaDat != '' ? (
                                <UserAddOutlined
                                    style={{ marginBottom: '5px', fontWeight: 'bold' }}
                                />
                            ) : (
                                <UserDeleteOutlined
                                    style={{ marginBottom: '5px', fontWeight: 'bold' }}
                                />
                            )
                        ) : classGheKhachDat !== '' ? (
                            <SmileOutlined style={{ marginBottom: '5px', fontWeight: 'bold' }} />
                        ) : (
                            seat.ghe
                        )}
                    </button>
                    {(index + 1) % 16 === 0 ? <br /> : ''}
                </Fragment>
            )
        })
    }

    return (
        <div className="min-h-full mt-5">
            <div className="grid grid-cols-12">
                <div className="col-span-9">
                    <div className="w-5/6 mx-auto">
                        <button onClick={sendPublicMess} className="h-full shadow-xl w-full relative  inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-400 to-blue-600 group-hover:from-green-400 group-hover:to-blue-600 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800">
                            <span className="text-2xl shadow-xl relative w-full h-full py-3 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                                SCREEN
                            </span>
                        </button>
                    </div>
                    <div className="flex justify-center items-center flex-wrap px-12">
                        {renderSeat()}
                    </div>
                    <div className="mt-5 flex justify-center">
                        <table className=" divide-y divide-gray-200 w-2/3">
                            <thead className="bg-gray-50 p-5">
                                <tr>
                                    <th>Ghế chưa đặt</th>
                                    <th>Ghế đang đặt</th>
                                    <th>Ghế vip</th>
                                    <th>Ghế đã đặt</th>
                                    <th>Ghế mình đặt</th>
                                    <th>Ghế khách đang đặt</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    <td>
                                        <button className="ghe text-center">
                                            {' '}
                                            <CheckOutlined
                                                style={{ marginBottom: 7.5, fontWeight: 'bold' }}
                                            />{' '}
                                        </button>{' '}
                                    </td>
                                    <td>
                                        <button className="ghe gheDangDat text-center">
                                            {' '}
                                            <CheckOutlined
                                                style={{ marginBottom: 7.5, fontWeight: 'bold' }}
                                            />
                                        </button>{' '}
                                    </td>
                                    <td>
                                        <button className="ghe gheVip text-center">
                                            <CheckOutlined
                                                style={{ marginBottom: 7.5, fontWeight: 'bold' }}
                                            />
                                        </button>{' '}
                                    </td>
                                    <td>
                                        <button className="ghe gheDaDat text-center">
                                            {' '}
                                            <CheckOutlined
                                                style={{ marginBottom: 7.5, fontWeight: 'bold' }}
                                            />{' '}
                                        </button>{' '}
                                    </td>
                                    <td>
                                        <button className="ghe gheDaDuocDat text-center">
                                            {' '}
                                            <CheckOutlined
                                                style={{ marginBottom: 7.5, fontWeight: 'bold' }}
                                            />{' '}
                                        </button>{' '}
                                    </td>
                                    <td>
                                        <button className="ghe gheKhachDat text-center">
                                            {' '}
                                            <CheckOutlined
                                                style={{ marginBottom: 7.5, fontWeight: 'bold' }}
                                            />{' '}
                                        </button>{' '}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="col-span-3">
                    <h3 className="text-center text-2xl text-green-400">
                        {danhSachGheDangDat
                            .reduce((tongTien, ghe, index) => {
                                return (tongTien += ghe.giaVe)
                            }, 0)
                            .toLocaleString()}{' '}
                        VNĐ
                    </h3>
                    <hr />
                    <h3 className="text-xl mt-2">{thongTinPhim?.tenPhim}</h3>
                    <p>
                        Địa điểm: {thongTinPhim?.tenCumRap} - {thongTinPhim?.tenRap}
                    </p>
                    <p>
                        Ngày chiếu: {thongTinPhim?.ngayChieu} - {thongTinPhim?.gioChieu}
                    </p>
                    <hr />
                    <div className="grid grid-cols-2 my-5">
                        <div className="col-span-1">
                            <span className="text-red-400 text-lg">Ghe</span>
                            {_.sortBy(danhSachGheDangDat, ['stt']).map((gheDD, index) => {
                                return (
                                    <span key={index} className="text-green-400 text-xl">
                                        {' '}
                                        {gheDD.ghe}
                                    </span>
                                )
                            })}
                        </div>
                        <div className="text-right col-span-1">
                            <span className="text-green-800 text-lg">
                                {danhSachGheDangDat
                                    .reduce((tongTien, ghe, index) => {
                                        return (tongTien += ghe.giaVe)
                                    }, 0)
                                    .toLocaleString()}{' '}
                                VNĐ
                            </span>
                        </div>
                    </div>
                    <hr />
                    <div className="my-5">
                        <i>Email</i>
                        <br />
                        {userLogin.email}
                    </div>
                    <hr />
                    <div className="my-5">
                        <i>Phone</i>
                        <br />
                        {userLogin.soDT}
                    </div>
                    <hr />
                    <div className=" mt-16 flex flex-col justify-end items-center">
                        <div
                            onClick={() => {
                                const thongTinDatVe = new ThongTinDatVe()
                                thongTinDatVe.maLichChieu = id
                                thongTinDatVe.danhSachVe = danhSachGheDangDat
                                //console.log(thongTinDatVe)
                                console.log(danhSachGheDangDat)
                                //console.log(localStorage.getItem(TOKEN_USER))
                                dispatch(guiThongtinDatVe(danhSachGheDangDat,userLogin.id,id))
                            }}
                            className="bg-green-500 cursor-pointer text-white w-full text-center py-3 text-2xl"
                        >
                            ĐẶT VÉ
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function (props) {
    const { userLogin } = useSelector((state) => state.UserReducer)

    const { tabActive } = useSelector((state) => state.TicketReducer)

    const dispatch = useDispatch()

    useEffect(() => {
        return () => {
            dispatch(chuyenTabChonVe(1))
        }
    },[])

    const operations = <Fragment>
            {!_.isEmpty(userLogin) ? <Fragment> <button onClick={() => {
                history.push('/profile')
            }}><div style={{width:40,height:40}} className='m-auto rounded-full flex justify-center items-center bg-red-200 text-2xl'>{userLogin.name.substr(0,1)}</div> Hello ! {userLogin.name} </button> <button className='text-blue-400' onClick={()=> {
                localStorage.removeItem(USER_LOGIN);
                localStorage.removeItem(TOKEN_USER);
                history.push('/home')
                window.location.reload();
            }}>Đăng xuất</button> </Fragment> : ''}
    </Fragment>
    return (
        <Tabs
            tabBarExtraContent={operations}
            defaultActiveKey="1"
            activeKey={tabActive}
            onChange={(key) => {
                dispatch(chuyenTabChonVe(key))
            }}
        >
            <Tabs.TabPane tab="01 CHỌN GHẾ & THANH TOÁN" key="1">
                <Checkout />
            </Tabs.TabPane>
            <Tabs.TabPane tab="02 KẾT QUẢ ĐẶT VÉ" key="2">
                <HistoryBooking />
            </Tabs.TabPane>
            <Tabs.TabPane tab={<div className='text-center flex justify-center items-center'><NavLink to='/'><HomeOutlined style={{margin:'auto',fontSize:20}}/></NavLink></div>} key="3">
                
            </Tabs.TabPane>
        </Tabs>
    )
}

function HistoryBooking(props) {
    const { thongTinNguoiDung } = useSelector((state) => state.UserReducer)
    const { userLogin } = useSelector((state) => state.UserReducer)
    const dispatch = useDispatch()
    console.log('thong tin nguoi dung', thongTinNguoiDung)
    useEffect(() => {
        const action = lichSuDatVeApi(userLogin.accessToken)
        dispatch(action)
    }, [])

    const renderTicketItem = () => {
        return thongTinNguoiDung?.map((ticket, index) => {
            const seats = _.first(ticket.ticket)
            return (
                <div key={index} className="p-2 lg:w-1/3 md:w-1/2 w-full">
                    <div className="h-full flex items-center border-gray-200 border p-4 rounded-lg">
                        <img
                            alt="team"
                            className="w-40 h-40 bg-gray-100 object-cover object-center flex-shrink-0 rounded-full mr-4"
                            src={ticket.hinhAnh}
                        />
                        <div className="flex-grow">
                            <h2 className="text-gray-900 title-font font-medium">
                                {ticket.tenPhim}
                            </h2>
                            <p className="text-gray-500">
                                Giờ chiếu:
                                {moment(ticket.thoiGian).format(' hh:mm A ')}<br/>- Ngày chiếu:
                                {moment(ticket.thoiGian).format(' DD/MM/YYYY')}
                            </p>
                            <img src={ticket.logoCinema} className="w-20 h-20 rounded-full"></img>
                            <p className="text-gray-500">{ticket.diaChi}</p>
                            <p className="text-gray-500">
                                - Phòng: {ticket.phongChieu} - Ghế:{' '}
                                
                                        <span className="text-green-400" key={index}>
                                            {'[ ' + ticket.ticket.ghe + ' ] '}
                                        </span>
                            </p>
                        </div>
                    </div>
                </div>
            )
        })
    }
    return (
        <section className="text-gray-600 body-font">
            <div className="container px-5 py-24 mx-auto">
                <div className="flex flex-col text-center w-full mb-20">
                    <h1 className="sm:text-3xl text-2xl font-medium title-font mb-4 text-purple-600">
                        Lịch Sử Đặt Vé
                    </h1>
                    <p className="lg:w-2/3 mx-auto leading-relaxed text-base">
                        Coi thông tin phim và lịch chiếu của bạn tại đây để có thể trải nghiệm dịch
                        vụ một cách tốt nhất bạn nhé :)) AHIHI <br />
                        Đánh giá 5 sao (Nếu có)
                    </p>
                </div>
                <div className="flex flex-wrap -m-2">{renderTicketItem()}</div>
            </div>
        </section>
    )
}
