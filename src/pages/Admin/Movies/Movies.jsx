import { AudioOutlined, CalendarOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import { Button, Input, Space, Table } from 'antd'
import React, { Fragment, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { history } from '../../..'
import { getMovieApi, xoaPhimApi } from '../../../redux/reducers/MovieReducer'
import { HOST_BE } from '../../../util/config'


const { Search } = Input
const suffix = (
    <AudioOutlined
        style={{
            fontSize: 16,
            color: '#1890ff',
        }}
    />
)

export default function Movies() {
    const onChange = (e) => {
        if(searchRef.current){
            clearTimeout(searchRef.current);
        }
        searchRef.current = setTimeout(() => {
            dispatch(getMovieApi(e.target.value))
        },300)  
    }

    const searchRef = useRef(null);
    const dispatch = useDispatch()
    const columns = [
        {
            title: 'Mã phim',
            dataIndex: 'id',
            value: (text,object) => {return <span>{text}</span>},
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend', 'ascend'],
            sortOrder:'descend',
            width: '10%',
            className:"text-center"
        },
        {
            title: 'Hình ảnh',
            dataIndex: 'poster',
            render: (text,movie) => {
                return <Fragment>
                    <img src={movie.poster?.substring(0,4) != "http" ? `${HOST_BE}/${movie?.poster}`: movie.poster} width={100} height={150} onError={(e) => {
                        e.target.onError = null; e.target.src='https://img.meta.com.vn/Data/image/2021/08/02/anh-xin-loi-6.jpg'
                    }}/>
                    
                </Fragment>
            },
            //sorter: (a, b) => a.age - b.age,
            width:"15%"
        },
        {
            title: 'Tên phim',
            dataIndex: 'tenPhim',
            sorter: (a, b) => {
                let tenPhimA = a.tenPhim.toLowerCase().trim();
                let tenPhimB = b.tenPhim.toLowerCase().trim();
                if(tenPhimA > tenPhimB){
                    return 1
                }
                return -1
            },
            width: '10%',
            sortDirections: ['descend','ascend']
        },
        {
            title: 'Trailer',
            dataIndex: 'trailer',
            render: (text,movie) => {
                return <Fragment>
                    {/* <iframe style={{width:100,height:100}} src={movie.trailer}></iframe> */}
                    <p>{movie.trailer}</p>
                </Fragment>
            },
            width: '15%',
        },
        {
            title: 'Mô tả',
            dataIndex: 'moTa',
            sorter: (a, b) => {
                let moTaA = a.moTa.toLowerCase().trim();
                let moTaB = b.moTa.toLowerCase().trim();
                if(moTaA > moTaB){
                    return 1
                }
                return -1
                
            },
            render: (text,movie) => { return <Fragment>
                {movie.moTa.length > 80 ? movie.moTa.substr(0,80) + ' ...' : movie.moTa}
            </Fragment>},
            sortDirections: ['descend','ascend'],
            width: '20%',
        },
        {
            title: 'Ngày khởi chiếu',
            dataIndex: 'ngayKhoiChieu',
            sorter: (a, b) => {
                let tenPhimA = a.tenPhim.toLowerCase().trim();
                let tenPhimB = b.tenPhim.toLowerCase().trim();
                if(tenPhimA > tenPhimB){
                    return 1
                }
                return -1
            },
            width: '15%',
            sortDirections: ['descend','ascend']
        },
        {
            title: 'Tác vụ',
            dataIndex: 'maPhim',
            render: (text,movie) => { return <Fragment>
                <NavLink key={1} className=' mr-3 text-2xl' to={`/admin/movies/edit/${movie.id}`}><EditOutlined className='text-blue-400'/></NavLink>
                <span style={{cursor:"pointer"}} key={2} className=' text-2xl mr-3' onClick={() => {
                    if(window.confirm('Bạn có chắc muôn xóa phim ' + movie.tenPhim + " ?")){
                        dispatch(xoaPhimApi(movie.id))
                    }
                }}><DeleteOutlined style={{color:"red"}} className='text-red-500'/></span>
                <NavLink key={3} className='text-2xl text-green-400' to={`/admin/showtime/${movie.id}/${movie.tenPhim}`} onClick={() => {
                    localStorage.setItem('movieParams',JSON.stringify(movie))
                }}><CalendarOutlined /></NavLink>
            </Fragment>},
            width: '20%',
        },
    ]
    useEffect(() => {
        dispatch(getMovieApi())
    }, [])
    const { arrMovieDefault } = useSelector((state) => state.MovieReducer)
    console.log('arrMovieDefault', arrMovieDefault)
    const data = arrMovieDefault;

    const onSearch = value => {
        dispatch(getMovieApi(value))
    }
    return (
        <div>
            <h3 className="text-4xl">Quản lý Phim</h3>
            <Button className="mb-5 block" onClick={() => {
                history.push('/admin/movies/addmovie')
            }}>Thêm phim</Button>
            <Search
                className="mb-5"
                placeholder="input search text"
                //enterButton=<SearchOutlined />
                size="large"
                suffix={suffix}
                onChange={onChange}
                onSearch={onSearch}
            />
            <Table columns={columns} dataSource={data} onChange={onChange} rowKey="maPhim"/>
        </div>
    )
}
