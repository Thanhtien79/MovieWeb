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
import React, { Fragment, useState } from 'react'
import { useDispatch } from 'react-redux'
import { addMovieApi } from '../../../redux/reducers/MovieReducer'

export default function AddMovie() {
    const [imgSrc, setImgSrc] = useState('')
    const [componentSize, setComponentSize] = useState('default')
    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size)
    }
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues: {
            tenPhim: '',
            trailer: '',
            moTa: '',
            ngayKhoiChieu: '',
            dangChieu: false,
            sapChieu: false,
            hot: false,
            danhGia: 0,
            hinhAnh: {},
        },
        onSubmit: (value) => {
            console.log('value', value)

            //Tạo đối tượng form data
            let formData = new FormData();
            for(let key in value){
                if(key != 'hinhAnh'){
                    formData.append(key,value[key])
                }
                else{
                    formData.append('hinhAnh', value.hinhAnh,value.hinhAnh.name)
                }
            }   
            //gọi api đưa form data lên DB
            dispatch(addMovieApi(formData));
            //console.log("formData",formData.get('tenPhim'));
        },
    })

    const handleChangeDatePicker = (value) => {
        let ngayKhoiChieu = moment(value).format('DD/MM/YYYY')
        formik.setFieldValue('ngayKhoiChieu', ngayKhoiChieu)
    }

    const handleChangeSwitch = (name) => {
        return (value) => {
            formik.setFieldValue(name, value)
        }
    }
    const handleChangeFile = (e) => {
        // lấy file ra từ e
        let file = e.target.files[0]
        if (
            file.type === 'image/jpeg' ||
            file.type === 'image/jpg' ||
            file.type === 'image/png' ||
            file.type === 'image/gif'
        ) {
            // Tạo ra doois tượng để đọc file
            let reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = (e) => {
                console.log(e.target.result)
                setImgSrc(e.target.result)
            }
            formik.setFieldValue('hinhAnh',file)
        }

        //console.log("file",file);
    }
    return (
        <Fragment>
            <h1>Add new Movie</h1>
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
                    <Input name="tenPhim" onChange={formik.handleChange} />
                </Form.Item>
                <Form.Item label="Trailer: ">
                    <Input name="trailer" onChange={formik.handleChange} />
                </Form.Item>
                <Form.Item label="Mô tả: ">
                    <Input name="moTa" onChange={formik.handleChange} />
                </Form.Item>
                <Form.Item label="Ngày khởi chiếu">
                    <DatePicker format={'DD/MM/YYYY'} onChange={handleChangeDatePicker} />
                </Form.Item>
                <Form.Item label="Đang chiếu" valuePropName="checked">
                    <Switch onChange={handleChangeSwitch('dangChieu')} />
                </Form.Item>
                <Form.Item label="Sắp chiếu" valuePropName="checked">
                    <Switch onChange={handleChangeSwitch('sapChieu')} />
                </Form.Item>
                <Form.Item label="Hot" valuePropName="checked">
                    <Switch onChange={handleChangeSwitch('hot')} />
                </Form.Item>
                <Form.Item label="Số sao">
                    <InputNumber onChange={handleChangeSwitch('danhGia')} min={1} max={10} />
                </Form.Item>

                <Form.Item label="Hình ảnh">
                    <input
                        type="file"
                        onChange={handleChangeFile}
                        accept="image/png,image/jpg,image/jpeg,image/gif"
                    />
                    <br />
                    <img src={imgSrc} style={{ width: 200, height: 200 }} alt="..." />
                </Form.Item>

                <Form.Item label="Tác vụ">
                    <button className="bg-pink-300 p-2 rounded-xl shadow-xl" type="submit">
                        Thêm phim
                    </button>
                </Form.Item>
            </Form>
        </Fragment>
    )
}
