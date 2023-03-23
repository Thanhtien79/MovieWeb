import { Radio, Rate, Space, Tabs } from 'antd'
import React, { useEffect, useState } from 'react'
import './DetailStyleBlur.css'
import './Rating.scss'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useParams } from 'react-router-dom'
import { getMovieDetailApi } from '../../redux/reducers/MovieReducer'
import moment from 'moment'
import { HOST_BE } from '../../util/config'

export default function Detail() {
    const { movieDetail } = useSelector((state) => state.MovieReducer)
    const dispatch = useDispatch()
    const { id } = useParams()

    useEffect(() => {
        const action = getMovieDetailApi(id)
        dispatch(action)
    }, [])
    console.log(movieDetail)
    return (
        <>
            <div
                className="App"
                style={{
                    backgroundImage: `url(${movieDetail.poster?.substring(0,4) != "http" ? `${HOST_BE}/${movieDetail?.poster}`: movieDetail.poster})`,
                    objectFit: 'contain',
                    display: 'flex',
                    flexDirection: 'column',
                }}
            >
                <div className="box1 pt-36">
                    <div className="grid grid-cols-12">
                        <div className="col-span-5 col-start-3">
                            <div className="grid grid-cols-4">
                                <img
                                    className="col-span-2"
                                    style={{ width: '250px', height: '350px', objectFit: 'cover' }}
                                    src={movieDetail.poster?.substring(0,4) != "http" ? `${HOST_BE}/${movieDetail?.poster}`: movieDetail.poster}
                                />
                                <div className="col-span-2 text-left my-auto">
                                    <p className="text-sm">
                                        Ngày chiếu:{' '}
                                        {moment(movieDetail.ngayKhoiChieu).format('DD - MM - YYYY')}
                                    </p>
                                    <p className="text-4xl pb-2">{movieDetail.tenPhim}</p>
                                    <p>{movieDetail.moTa}</p>
                                </div>
                            </div>
                        </div>

                        <div className="col-span-4">
                            <h1
                                style={{}}
                                className=" text-green-400 text-2xl text-center w-1/2"
                            ></h1>
                            <h1
                                style={{
                                    marginLeft: '15%',
                                    color: 'yellow',
                                    fontWeight: 'bold',
                                    fontSize: 15,
                                }}
                            >
                                Đánh giá
                            </h1>
                            <h1 style={{ marginLeft: '5%' }} className="text-green-400 text-2xl">
                                <Rate
                                    allowHalf
                                    value={movieDetail.danhGia / 2}
                                    style={{ color: '#78ed78', fontSize: 30 }}
                                />
                            </h1>

                            <div className={`c100 p${movieDetail.danhGia * 10} big`}>
                                <span>{movieDetail.danhGia * 10}%</span>
                                <div className="slice">
                                    <div className="bar"></div>
                                    <div className="fill"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-10 ml-72 w-2/3 container bg-white px-5 py-5">
                    <Tabs defaultActiveKey="1" centered>
                        <Tabs.TabPane style={{ minHeight: '300px' }} tab="Lịch Chiếu" key="1">
                            <div className="">
                                <Tabs className="ml-10" tabPosition={'left'}>
                                    {movieDetail.heThongRapChieu?.map((htr, index) => {
                                        return (
                                            <Tabs.TabPane
                                                tab={
                                                    <div>
                                                        <img
                                                            className="rounded-full"
                                                            width="70"
                                                            src={htr.logo}
                                                        />
                                                        {htr.tenHeThongRap}
                                                    </div>
                                                }
                                                key={index}
                                            >
                                                {htr.listCumrap?.map((cumRap, index) => {
                                                    return (
                                                        <div className="mt-5" key={index}>
                                                            <div className="flex flex-row">
                                                                <img
                                                                    style={{
                                                                        width: 60,
                                                                        height: 60,
                                                                    }}
                                                                    src={cumRap.hinhAnh}
                                                                />
                                                                <div className="ml-5 text-left">
                                                                    <p className="text-2xl font-bold mb-0">
                                                                        {cumRap.tenCumRap}
                                                                    </p>
                                                                    <p className="text-green-400">
                                                                        {cumRap.diaChi}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div style={{display:'flex' ,flexDirection:'row',flexWrap:'wrap'}} className="thong-tin-lich-chieu ml-20">
                                                                {cumRap.danhSachPhim?.map(
                                                                    (lichChieu, index) => {
                                                                        return (
                                                                            <NavLink
                                                                                className='text-green-600 bg-gray-300 rounded-xl py-2 px-1 ml-3 mb-2'
                                                                                style={{width:'22%'}}
                                                                                to={`/checkout/${lichChieu.idShowtime}`}
                                                                                key={index}
                                                                            >
                                                                                {
                                                                                    moment(lichChieu.showtime).format('MM-DD-YYYY hh:mm A')
                                                                                }
                                                                            </NavLink>
                                                                        )
                                                                    }
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                            </Tabs.TabPane>
                                        )
                                    })}
                                </Tabs>
                            </div>
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Thông tin" key="2">
                            Content of Tab Pane 2
                        </Tabs.TabPane>
                        <Tabs.TabPane tab="Đánh giá" key="3">
                            Content of Tab Pane 3
                        </Tabs.TabPane>
                    </Tabs>
                </div>
            </div>
        </>
    )
}
