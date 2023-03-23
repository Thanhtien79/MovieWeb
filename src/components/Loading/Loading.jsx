import React, { Fragment } from 'react'
import { useSelector } from 'react-redux'

export default function Loading() {
    const { loading } = useSelector((state) => state.LoadingReducer)

    return (
        <Fragment>
        {loading ? 
            <div
                className="w-full h-full flex z-50 justify-center items-center"
                style={{ position: 'fixed', top: 0, left: 0, backgroundColor: 'rgba(0,0,0,.5)' }}
            >
                <div className="text-4xl">Đang load đợi xí...</div>
            </div> : ''}
        </Fragment>
    )
}
