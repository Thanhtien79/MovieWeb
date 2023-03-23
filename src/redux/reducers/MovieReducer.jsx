import { createSlice } from '@reduxjs/toolkit'
import { http } from '../../util/config'
import { history } from '../../index'

const initialState = {
    arrMovie: [
        {
            maPhim: 6060,
            tenPhim: 'Amsterdam: Vụ Án Mạng Kỳ Bí ',
            biDanh: 'amsterdam-vu-an-mang-ky-bi',
            trailer: 'https://www.youtube.com/embed/PsytxwRTMIo',
            hinhAnh:
                'https://movienew.cybersoft.edu.vn/hinhanh/amsterdam-vu-an-mang-ky-bi_gp01.jpg',
            moTa: 'Bộ phim gốc này kể về ba người bạn thân vô tình trở thành nhân vật chính trong một trong những vụ án chấn động lịch sử Hoa Kỳ.',
            maNhom: 'GP01',
            ngayKhoiChieu: '2022-10-30T00:00:00',
            danhGia: 8,
            hot: true,
            dangChieu: true,
            sapChieu: true,
        },
    ],
    dangChieu: false,
    sapChieu: false,
    arrMovieDefault: [],
    movieDetail: {},
    thongTinPhimEdit:{}
}

const MovieReducer = createSlice({
    name: 'MovieReducer',
    initialState,
    reducers: {
        getListMovieAction: (state, action) => {
            state.arrMovie = action.payload
            state.arrMovieDefault = action.payload
        },
        getPhimDangChieu: (state, action) => {
            state.dangChieu = !state.dangChieu
            if (state.dangChieu == state.sapChieu) {
                state.sapChieu = !state.sapChieu
            }
            state.arrMovie = state.arrMovieDefault.filter(
                (movie) => movie.dangChieu === state.dangChieu
            )
        },
        getPhimSapChieu: (state, action) => {
            state.sapChieu = !state.sapChieu
            if (state.sapChieu == state.dangChieu) {
                state.dangChieu = !state.dangChieu
            }
            state.arrMovie = state.arrMovieDefault.filter(
                (movie) => movie.sapChieu === state.sapChieu
            )
        },
        getMovieDetailAction: (state, action) => {
            state.movieDetail = action.payload
        },
        addMovieAction: (state, action) => {
            // state.arrMovie = action.payload
            // state.arrMovieDefault = action.payload
        },
        layThongTinPhimEdit: (state, action) => {
            state.thongTinPhimEdit = action.payload
        },
        capNhatPhimAction: (state, action) => {
            state.thongTinPhimEdit = action.payload
        },
    },
})

export const { getListMovieAction, getPhimDangChieu, layThongTinPhimEdit,getPhimSapChieu,getMovieDetailAction,addMovieAction,capNhatPhimAction} = MovieReducer.actions

export default MovieReducer.reducer

//=================== asyn action ===================
export const getMovieApi = (tenPhim='') => {
    return async (dispatch) => {
       if(tenPhim.trim()!=''){
        let result = await http.get(`/movie/name?tenPhim=${tenPhim}`)
        //let result = await managerMovieService.layDanhSachBanner();
        console.log(result);
        const action = getListMovieAction(result.data.data)
        dispatch(action)
       }
       else{
        let result = await http.get('/movie')
        //let result = await managerMovieService.layDanhSachBanner();
        console.log(result.data.data);
        const action = getListMovieAction(result.data.data)
        dispatch(action)
       }
    }
}
export const getMovieDetailApi = (idMovie) => {
    return async (dispatch) => {
        try {
            let result = await http.get('/movie/detail?idMovie=' + idMovie)
            //let result = await managerMovieService.layDanhSachBanner();
            const action = getMovieDetailAction(result.data.data)
            dispatch(action)
        } catch (err) {
            console.log(err)
        }
    }
}
export const addMovieApi = (formData) => {
    return async (dispatch) => {
        try {
            let result = await http.post('/movie/add',formData)
            alert("Chúc mừng bạn đã thêm thành công. Bạn thật tài giỏi!!")
            //let result = await managerMovieService.layDanhSachBanner();
            const action = addMovieAction(result.data.data)
            dispatch(action)
        } catch (err) {
            console.log(err)
        }
    }
}

export const layThongTinPhimEditApi = (idMovie) => {
    return async (dispatch) => {
        try {
            let result = await http.get(`/movie/get-movie-edit?idMovie=${idMovie}`)
            const action = layThongTinPhimEdit(result.data.data)
            dispatch(action)
        } catch (err) {
            console.log(err)
        }
    }
}

export const xoaPhimApi = (idMovie) => {
    return async (dispatch) => {
        try {
            let result = await http.delete(`/movie?idMovie=${idMovie}`)
            alert("Xóa phim thành công Hehe")
            dispatch(getMovieApi())
        } catch (err) {
            console.log(err)
        }
    }
}

export const capNhatPhimApi = (formData) => {
    return async (dispatch) => {
        try {
            let result = await http.post('/movie/edit',formData)
            alert("Chúc mừng bạn đã cập nhật thành công. Bạn thật tài giỏi!!")
            //let result = await managerMovieService.layDanhSachBanner();
            const action = capNhatPhimAction(result.data.data)
            dispatch(action)

            dispatch(getMovieApi())
            history.push("/admin/movies");
        } catch (err) {
            console.log(err.response.data)
        }
    }
}
