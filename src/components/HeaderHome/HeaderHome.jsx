import React, { Fragment } from 'react'
import { NavLink } from 'react-router-dom'
import { history } from '../..'
import { Select } from 'antd'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import _ from 'lodash'
import { TOKEN_USER, USER_LOGIN } from '../../util/config'

export default function HeaderHome() {
    const { userLogin } = useSelector((state) => state.UserReducer)
    const handleChange = (value) => {
        i18n.changeLanguage(value)
    }
    const { t, i18n } = useTranslation()

    const renderLogin = () => {
        if (_.isEmpty(userLogin)) {
            return (
                <Fragment>
                    <button
                        onClick={() => {
                            history.push('/user')
                        }}
                        className="relative shadow-xl inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
                    >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            {t('signin')}
                        </span>
                    </button>

                    <button
                        onClick={() => {
                            history.push('/user/register')
                        }}
                        className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-pink-500 to-orange-400 group-hover:from-pink-500 group-hover:to-orange-400 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800"
                    >
                        <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                            {t('signup')}
                        </span>
                    </button>
                </Fragment>
            )
        }
        return (
            <Fragment>
                <button
                    onClick={() => {
                        history.push('/profile')
                    }}
                    className="relative shadow-xl inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-500 to-pink-500 group-hover:from-purple-500 group-hover:to-pink-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800"
                >
                    <span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
                        Hello ! {userLogin.name}
                    </span>
                </button>
                <button className='text-blue-400 mr-5' onClick={()=> {
                localStorage.removeItem(USER_LOGIN);
                localStorage.removeItem(TOKEN_USER);
                history.push('/home')
                window.location.reload();
            }}>Đăng xuất</button>
            </Fragment>
        )
    }
    return (
        <header className="p-4  bg-gray-200 bg-opacity-20 dark:text-gray-900 fixed w-full z-10">
            <div className="container flex justify-between h-16 mx-auto">
                <NavLink
                    rel="noopener noreferrer"
                    to="/"
                    aria-label="Back to homepage"
                    className="flex items-center p-2"
                >
                    <img
                        src="https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/b358cda7-9810-44f9-9bab-5fcb82773cec/ddokknb-806fad8d-dc11-4993-8ef9-e47722fa78d1.png/v1/fill/w_894,h_894,strp/fox_logo_design__no_background__by_9987neondraws_ddokknb-pre.png?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ1cm46YXBwOjdlMGQxODg5ODIyNjQzNzNhNWYwZDQxNWVhMGQyNmUwIiwiaXNzIjoidXJuOmFwcDo3ZTBkMTg4OTgyMjY0MzczYTVmMGQ0MTVlYTBkMjZlMCIsIm9iaiI6W1t7ImhlaWdodCI6Ijw9NDAwMCIsInBhdGgiOiJcL2ZcL2IzNThjZGE3LTk4MTAtNDRmOS05YmFiLTVmY2I4Mjc3M2NlY1wvZGRva2tuYi04MDZmYWQ4ZC1kYzExLTQ5OTMtOGVmOS1lNDc3MjJmYTc4ZDEucG5nIiwid2lkdGgiOiI8PTQwMDAifV1dLCJhdWQiOlsidXJuOnNlcnZpY2U6aW1hZ2Uub3BlcmF0aW9ucyJdfQ.JzP48xCSxkmMGVS3K48BV0AI6hnk_SNlCMue3oWTZ7c"
                        style={{ width: '100px', height: '70px' }}
                    />
                </NavLink>
                <ul className="items-stretch hidden space-x-3 lg:flex">
                    <li className="flex hover:bg-pink-300 rounded-full">
                        <NavLink
                            rel="noopener noreferrer"
                            to="/home"
                            className={({ isActive }) =>
                                isActive
                                    ? 'flex items-center px-4 -mb-1 border-b-2 dark:border-transparent dark:text-violet-400 dark:border-violet-400 text-pink-600 text-2xl'
                                    : 'flex items-center px-4 -mb-1 border-b-2 dark:border-transparent dark:text-violet-400 text-pink-600 text-2xl'
                            }
                        >
                            Home
                        </NavLink>
                    </li>
                    <li className="flex">
                        <NavLink
                            rel="noopener noreferrer"
                            to="/new"
                            className={({ isActive }) =>
                                isActive
                                    ? 'flex items-center px-4 -mb-1 border-b-2 dark:border-transparent dark:border-violet-400'
                                    : 'flex items-center px-4 -mb-1 border-b-2 dark:border-transparent'
                            }
                        >
                            News
                        </NavLink>
                    </li>
                    <li className="flex">
                        <NavLink
                            rel="noopener noreferrer"
                            to="/"
                            className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent"
                        >
                            Link
                        </NavLink>
                    </li>
                    <li className="flex">
                        <NavLink
                            rel="noopener noreferrer"
                            to="#"
                            className="flex items-center px-4 -mb-1 border-b-2 dark:border-transparent"
                        >
                            Link
                        </NavLink>
                    </li>
                </ul>
                <div className="items-center flex-shrink-0 hidden lg:flex">
                    {renderLogin()}
                    {/* {t('hello.2')} */}
                    <Select
                        defaultValue="en"
                        style={{
                            width: 100,
                        }}
                        onChange={handleChange}
                        options={[
                            {
                                value: 'en',
                                label: 'Eng',
                            },
                            {
                                value: 'chi',
                                label: 'Chi',
                            },
                            {
                                value: 'vi',
                                label: 'Vi',
                            },
                        ]}
                    />
                </div>
                <button className="p-4 lg:hidden">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-6 h-6 dark:text-gray-100"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h16M4 18h16"
                        ></path>
                    </svg>
                </button>
            </div>
        </header>
    )
}
