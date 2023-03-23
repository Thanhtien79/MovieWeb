import React, { useState } from 'react'
import './MovieFlip.css'
import { Button, Modal } from 'antd'
import { PlayCircleOutlined } from '@ant-design/icons'
import { NavLink } from 'react-router-dom'
import { HOST_BE } from '../../util/config'
export default function MovieFlip(props) {
    const { phim } = props
    const [isModalOpen, setIsModalOpen] = useState(false)
    const showModal = () => {
        setIsModalOpen(true)
        
    }
    const handleOk = () => {
        stopVideos();
        setIsModalOpen(false)
        
    }
    const handleCancel = () => {
        setIsModalOpen(false)
        stopVideos();
    }
    var stopVideos = function () {
        var videos = document.querySelectorAll('iframe, video');
        Array.prototype.forEach.call(videos, function (video) {
            if (video.tagName.toLowerCase() === 'video') {
                video.pause();
            } else {
                var src = video.src;
                video.src = src;
            }
        });
    };
    return (
        <div className="flip-card m-2">
            <div className="flip-card-inner">
                <div className="flip-card-front">
                    <img src={phim.poster?.substring(0,4) != "http" ? `${HOST_BE}/${phim?.poster}`: phim.poster} alt="Avatar" style={{ width: 300, height: 300 }} />
                </div>
                <div
                    className="flip-card-back"
                    style={{ position: 'relative', backgroundColor: 'rgba(0,0,0,.9' }}
                >
                    <div style={{ position: 'absolute', top: 0, left: 0 }}>
                        <img src={phim.poster?.substring(0,4) != "http" ? `${HOST_BE}/${phim?.poster}`: phim.poster} alt="Avatar" style={{ width: 300, height: 300 }} />
                    </div>
                    <div
                        className="w-full h-full"
                        style={{
                            position: 'absolute',
                            backgroundColor: 'rgba(0,0,0,.5)',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                    >
                        <div>
                            <div className="rounded-full  cursor-pointer" onClick={showModal}>
                                <PlayCircleOutlined style={{ fontSize: '50px' }} />
                            </div>
                            <Modal
                                title=<p className='text-xl' style={{color:"lightpink",margin:0}}>{phim.tenPhim}</p>
                                className="px-80"
                                open={isModalOpen}
                                onOk={handleOk}
                                onCancel={handleCancel}
                                footer=<div></div>
                            >
                                <iframe width="420" id='yvideo' height="315" src={phim.trailer} frameborder="0" allowfullscreen ></iframe>
                            </Modal>
                            <div className="text-2xl mt-2 font-bold">{phim.tenPhim}</div>
                        </div>
                    </div>
                </div>
            </div>
            <NavLink
                to={`/detail/${phim.id}`}
                className="w-full text-center my-2 relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
            >
                <span className="block w-full relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                    ĐẶT VÉ
                </span>
            </NavLink>
        </div>
    )
}
