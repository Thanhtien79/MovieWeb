import {
    Button,
    Cascader,
    DatePicker,
    Form,
    Input,
    InputNumber,
    Radio,
    Select,
    Switch,
    TreeSelect,
} from 'antd'
import { useFormik } from 'formik'
import moment from 'moment'
import React, { Fragment, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import {
    addMovieApi,
    capNhatPhimApi,
    layThongTinPhimEditApi,
} from '../../../redux/reducers/MovieReducer'
import { HOST_BE } from '../../../util/config'

export default function EditMovie() {
    const [imgSrc, setImgSrc] = useState('')
    const [componentSize, setComponentSize] = useState('default')
    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size)
    }
    let { id } = useParams()
    const { thongTinPhimEdit } = useSelector((state) => state.MovieReducer)
    console.log('=====', thongTinPhimEdit)
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(layThongTinPhimEditApi(id))
    }, [])
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            maPhim: thongTinPhimEdit?.id,
            tenPhim: thongTinPhimEdit?.tenPhim,
            trailer: thongTinPhimEdit?.trailer,
            moTa: thongTinPhimEdit?.moTa,
            //ngayKhoiChieu: moment(thongTinPhimEdit?.ngayKhoiChieu).format("DD/MM/YYYY"),
            ngayKhoiChieu: thongTinPhimEdit?.ngayKhoiChieu,
            dangChieu: thongTinPhimEdit?.dangChieu,
            sapChieu: thongTinPhimEdit?.sapChieu,
            hot: thongTinPhimEdit?.hot,
            danhGia: thongTinPhimEdit?.danhGia,
            hinhAnh: null,
        },
        onSubmit: (value) => {
            console.log('value', value)

            //Tạo đối tượng form data
            let formData = new FormData()
            for (let key in value) {
                if (key != 'hinhAnh') {
                    formData.append(key, value[key])
                } else {
                    if (value.hinhAnh !== null) {
                        formData.append('hinhAnh', value.hinhAnh)
                    }
                }
            }
            //gọi api đưa form data lên DB
            dispatch(capNhatPhimApi(formData))
            //console.log("formData",formData.get('tenPhim'));
        },
    })

    const handleChangeDatePicker = (value) => {
        let ngayKhoiChieu = moment(value).format("DD/MM/YYYY")
        formik.setFieldValue('ngayKhoiChieu', ngayKhoiChieu)
    }

    const handleChangeSwitch = (name) => {
        return (value) => {
            formik.setFieldValue(name, value)
        }
    }
    const handleChangeFile = async (e) => {
        // lấy file ra từ e
        let file = e.target.files[0]
        if (
            file.type === 'image/jpeg' ||
            file.type === 'image/jpg' ||
            file.type === 'image/png' ||
            file.type === 'image/gif'
        ) {
            await formik.setFieldValue('hinhAnh', file)
            // Tạo ra doois tượng để đọc file
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (e) => {
                //console.log(e.target.result)
                setImgSrc(e.target.result)
            }
        }

        //console.log("file",file);
    }
    return (
        <Fragment>
            <h1>Edit Movie</h1>
            <Form
                onSubmitCapture={formik.handleSubmit}
                labelCol={{
                    span: 4,
                }}
                wrapperCol={{
                    span: 14,
                }}
                layout="horizontal"
                initialValues={{
                    size: componentSize,
                }}
                onValuesChange={onFormLayoutChange}
                size={componentSize}
            >
                <Form.Item label="Form Size" name="size">
                    <Radio.Group>
                        <Radio.Button value="small">Small</Radio.Button>
                        <Radio.Button value="default">Default</Radio.Button>
                        <Radio.Button value="large">Large</Radio.Button>
                    </Radio.Group>
                </Form.Item>
                <Form.Item label="Tên phim: ">
                    <Input
                        name="tenPhim"
                        onChange={formik.handleChange}
                        value={formik.values.tenPhim}
                    />
                </Form.Item>
                <Form.Item label="Trailer: ">
                    <Input
                        name="trailer"
                        onChange={formik.handleChange}
                        value={formik.values.trailer}
                    />
                </Form.Item>
                <Form.Item label="Mô tả: ">
                    <Input name="moTa" onChange={formik.handleChange} value={formik.values.moTa} />
                </Form.Item>
                <Form.Item label="Ngày khởi chiếu">
                    <DatePicker
                        format={'DD/MM/YYYY'}
                        onChange={handleChangeDatePicker}
                        value={moment(formik.values.ngayKhoiChieu,"DD/MM/YYYY")}
                    />
                </Form.Item>
                <Form.Item label="Đang chiếu" valuePropName="checked">
                    <Switch
                        onChange={handleChangeSwitch('dangChieu')}
                        checked={formik.values.dangChieu}
                    />
                </Form.Item>
                <Form.Item label="Sắp chiếu" valuePropName="checked">
                    <Switch
                        onChange={handleChangeSwitch('sapChieu')}
                        checked={formik.values.sapChieu}
                    />
                </Form.Item>
                <Form.Item label="Hot" valuePropName="checked" >
                    <Switch onChange={handleChangeSwitch('hot')} checked={formik.values.hot}/>
                </Form.Item>
                <Form.Item label="Số sao">
                    <InputNumber
                        onChange={handleChangeSwitch('danhGia')}
                        min={1}
                        max={10}
                        value={formik.values.danhGia}
                    />
                </Form.Item>

                <Form.Item label="Hình ảnh">
                    <input
                        type="file"
                        onChange={handleChangeFile}
                        accept="image/png,image/jpg,image/jpeg,image/gif"
                    />
                    <br />
                    <img
                        src={imgSrc === '' ? `${HOST_BE}/${thongTinPhimEdit?.poster}` : imgSrc}
                        style={{ width: 200, height: 200 }}
                        alt="..."
                    />
                </Form.Item>

                <Form.Item label="Tác vụ">
                    <button className="bg-pink-300 p-2 rounded-xl shadow-xl" type="submit">
                        Cập nhật
                    </button>
                </Form.Item>
            </Form>
        </Fragment>
    )
}
