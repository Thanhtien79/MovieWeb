import React from 'react'
import {useFormik} from 'formik'
import {NavLink} from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { userLoginApi } from '../../redux/reducers/UserReducer';
import LoginFacebook from './LoginFacebook';

export default function Login() {
    const dispatch = useDispatch();
    const formik = useFormik({
        initialValues:{
            username:'',
            password:''
        },
        onSubmit: values => {
          const action = userLoginApi(values);
          dispatch(action)
        }

    });

    const {userLogin} = useSelector(state => state.UserReducer);

    return (
        <div className="lg:w-1/2 xl:max-w-screen-sm">
            <div className="py-12 bg-indigo-100 lg:bg-white flex justify-center lg:justify-start lg:px-12">
                <div className="cursor-pointer flex items-center">
                    <div>
                        <img className=' w-20 h-20' src='https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b358cda7-9810-44f9-9bab-5fcb82773cec/ddokknb-806fad8d-dc11-4993-8ef9-e47722fa78d1.png/v1/fill/w_894,h_894,strp/fox_logo_design__no_background__by_9987neondraws_ddokknb-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDAwMCIsInBhdGgiOiJcL2ZcL2IzNThjZGE3LTk4MTAtNDRmOS05YmFiLTVmY2I4Mjc3M2NlY1wvZGRva2tuYi04MDZmYWQ4ZC1kYzExLTQ5OTMtOGVmOS1lNDc3MjJmYTc4ZDEucG5nIiwid2lkdGgiOiI8PTQwMDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.JzP48xCSxkmMGVS3K48BV0AI6hnk_SNlCMue3oWTZ7c'/>
                    </div>
                    
                </div>
            </div>
            <div className="mt-10 px-12 sm:px-24 md:px-48 lg:px-12 lg:mt-3 xl:px-24 xl:max-w-2xl">
                <h2 className="text-center text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl xl:text-bold">
                    Log in
                </h2>
                <div className="mt-12">
                    <form onSubmit={formik.handleSubmit}>
                        <div>
                            <div className="text-sm font-bold text-gray-700 tracking-wide">
                               Tài khoản
                            </div>
                            <input
                                name='username' onChange={formik.handleChange}
                                className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                                placeholder="Mời nhập tài khoản"
                            />
                        </div>
                        <div className="mt-8">
                            <div className="flex justify-between items-center">
                                <div className="text-sm font-bold text-gray-700 tracking-wide">
                                    Mật khẩu
                                </div>
                                <div>
                                    <a className="text-xs font-display font-semibold text-indigo-600 hover:text-indigo-800 cursor-pointer">
                                       Quên mật khẩu
                                    </a>
                                </div>
                            </div>
                            <input
                             name='password' onChange={formik.handleChange}
                                className="w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500"
                                type='password'
                                placeholder="Mời nhập mật khẩu"
                            />
                        </div>
                        <div className="mt-10">
                            <button type='submit' className="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600 shadow-lg">
                                Đăng nhập
                            </button>
                        </div>
                    </form>
                    <div className="mt-12 text-sm font-display font-semibold text-gray-700 text-center">
                        Bạn chưa có tài khoản ?{' '}
                        <NavLink to='/user/register' className="cursor-pointer text-indigo-600 hover:text-indigo-800">
                            Đăng ký
                        </NavLink>
                    </div>
                    <LoginFacebook/>
                </div>
            </div>
        </div>
    )
}
