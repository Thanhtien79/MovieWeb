import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import {history} from '../../../index'
import {
    Button,
    Cascader,
    Checkbox,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Select,
    Space,
} from 'antd'
import { getAllCinemaApi, getThongTinCumRap, getThongTinPhong, taoLichChieu } from '../../../redux/reducers/CinemaReducer'
import { useFormik } from 'formik'
import moment from 'moment'

export default function ShowTime() {
    const maPhim = useParams().id
    const tenPhim = useParams().name
    //console.log(maPhim);
    const formik = useFormik({
        initialValues: {
            maPhim: maPhim,
            ngayChieuGioChieu: '',
            maRap: '',
            maPhong:"",
            giaVe: '',
        },
        onSubmit: (values) => {
            console.log('value', values)
            try{
              const result = taoLichChieu(values)
              alert("Tạo lịch chiếu thành công")
              history.push(`/detail/${maPhim}`)
            }catch(err){
              console.log(err);
            }
        },
    })
    const onChangeDate = (value, dateString) => {
      console.log('onOk: ', value)
      formik.setFieldValue('ngayChieuGioChieu', moment(value).format('DD/MM/YYYY hh:mm:ss'))
    }
    const onOk = (value) => {
        console.log('onOk: ', value)
        formik.setFieldValue('ngayChieuGioChieu', moment(value).format('DD/MM/YYYY hh:mm:ss'))
    }
    const onChangeInputNumber = (value) => {
        formik.setFieldValue('giaVe',value)
    }
    const [state, setState] = useState({
        heThongRapChieu: [],
        cumRapChieu: [],
        phong:[]
    })
    const handleChangeHeThongRap = async (value) => {
        //call api lấy thông tin cụm rạp
        try {
            let result = await getThongTinCumRap(value)
            //gán giá trị cụm rạp vào state
            setState({
                ...state,
                cumRapChieu: result.data.data,
            })
        } catch (err) {
            console.log(err)
        }
    }
    const handleChangeCumRap = async(value) => {
        formik.setFieldValue('maRap', value)
        try {
            let result = await getThongTinPhong(value)
            //gán giá trị cụm rạp vào state
            setState({
                ...state,
                phong: result.data.data,
            })
        } catch (err) {
            console.log(err)
        }
    }
    const handleChangeRoom = async(value) => {
        formik.setFieldValue('maPhong', value)
    }
    useEffect(() => {
        try {
            const getData = async () => {
                //async function getData () {
                const result = await getAllCinemaApi()
                setState({
                    ...state,
                    heThongRapChieu: result.data.data,
                })
            }
            getData()
        } catch (err) {}
    }, [])

    const convertSelectHeThongRap = () => {
        // state.heThongRapChieu?.map((heThong, index) => ({
        //     label: heThong.tenHeThongRap,
        //     value: heThong.maHeThongRap,
        // }))
        return state.heThongRapChieu?.map((heThong, index) => {
            return { label: heThong.tenHtr, value: heThong.maHtr }
        })
    }
    let movieParams ={}
    if(localStorage.getItem('movieParams')){
      movieParams = JSON.parse(localStorage.getItem('movieParams'))
    }
    return (
        <Form
            name="basic"
            onSubmitCapture={formik.handleSubmit}
            labelCol={{
                span: 8,
            }}
            wrapperCol={{
                span: 16,
            }}
            initialValues={{
                remember: true,
            }}
            autoComplete="off"
        >
            <h1>Tạo Lịch chiếu - {tenPhim}</h1>
            <img style={{width:150 ,height:200}} src={movieParams.poster} />
            <Form.Item label="Hệ thống Rạp">
                <Select
                    options={convertSelectHeThongRap()}
                    onChange={handleChangeHeThongRap}
                    placeholder="Chọn hệ thống Rạp"
                />
            </Form.Item>

            <Form.Item label="Cụm Rạp">
                <Select
                    options={state.cumRapChieu?.map((cumRap, index) => {
                        return { label: cumRap.nameCinema, value: cumRap.idCinema }
                    })}
                    onChange={handleChangeCumRap}
                    placeholder="Chọn Cụm Rạp"
                />
            </Form.Item>
            <Form.Item label="Phòng chiếu">
                <Select
                    options={state.phong?.map((phong, index) => {
                        return { label: phong.nameRoom, value: phong.idRoom }
                    })}
                    onChange={handleChangeRoom}
                    placeholder="Chọn phòng chiếu"
                />
            </Form.Item>
            <Form.Item label="Thời gian chiếu">
                <Space direction="vertical" size={12}>
                    <DatePicker
                        format="DD/MM/YYYY hh:mm:ss"
                        showTime
                        onChange={onChangeDate}
                        onOk={onOk}
                    />
                </Space>
            </Form.Item>

            <Form.Item label="Giá vé">
                <InputNumber
                    min={75000}
                    max={150000}
                    onChange={onChangeInputNumber}
                />
            </Form.Item>

            <Form.Item label="Tác vụ">
                <Button htmlType='submit'>Tạo lịch chiếu</Button>
            </Form.Item>
        </Form>
    )
}
