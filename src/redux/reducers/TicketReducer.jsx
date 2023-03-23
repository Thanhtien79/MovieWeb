import { createSlice } from '@reduxjs/toolkit'
import { stompClient } from '../../pages/Checkout/Checkout';
//import { connection } from '../..';
import { http } from '../../util/config';
import { ThongTinDatVe } from '../../_core/models/ThongTinDatVe';
import { ThongTinLichChieu } from '../../_core/models/ThongTinPhongVe';
import { DisplayLoading, HideLoading } from './LoadingReducer';

const initialState = {
    chiTietPhongve: {},
    danhSachGheDangDat:[],
    tabActive:"1",
    danhSachGheKhachDat:[]
    //danhSachGheKhachDat:[{maGhe:48041},{maGhe:48042}]
}

const TicketReducer = createSlice({
  name: "TicketReducer",
  initialState,
  reducers: {
    getThongTinPhongVeAction: (state,action) => {
        state.chiTietPhongve=action.payload;
    },
    getVeDangDat: (state,action) => {
        console.log(action.payload);
       let danhSachGheCapNhat =[...state.danhSachGheDangDat];

       let index = danhSachGheCapNhat.findIndex(gheDD => gheDD.maGhe == action.payload.maGhe)
       if(index != -1){
        danhSachGheCapNhat.splice(index,1)
       }
       else{
        danhSachGheCapNhat.push(action.payload)
       }
        state.danhSachGheDangDat= danhSachGheCapNhat;
    },
    pushVeDangDat: (state,action) => {
        state.danhSachGheDangDat = []
    },
    chuyenTabThongTinVe: (state,action) => {
        state.tabActive="2"
    },
    chuyenTabChonVe: (state,action) => {
        state.tabActive=action.payload.toString();
    },
    datGheAction: (state,action) => {
        let danhSachGheCapNhat =[...state.danhSachGheDangDat];

        let index = danhSachGheCapNhat.findIndex(gheDD => gheDD.id == action.payload.id)
        if(index != -1){
         danhSachGheCapNhat.splice(index,1)
        }
        else{
         danhSachGheCapNhat.push(action.payload)
        }
         state.danhSachGheDangDat= danhSachGheCapNhat;
    },
    getGheNguoiKhacDat: (state,action) => {
        state.danhSachGheKhachDat = action.payload;
    }
  }
});

export const {getThongTinPhongVeAction,getVeDangDat,pushVeDangDat,chuyenTabThongTinVe,chuyenTabChonVe,datGheAction,getGheNguoiKhacDat} = TicketReducer.actions

export default TicketReducer.reducer

//=================== asyn action ===================
export const getThongTinPhongVeApi = (maLC) => {
    return async (dispatch) => {
        try {
            let result = await http.get(`/ticket?maLC=${maLC}`)
            //let result = await managerMovieService.layDanhSachBanner();
            if (result.status === 200) {
                const action = getThongTinPhongVeAction(result.data.data)
                dispatch(action)
               
            }
        } catch (errors) {
            console.log('errors', errors)
        }
        
    }
}

//export const guiThongtinDatVe = (dsVe = new ThongTinDatVe()) => {
export const guiThongtinDatVe = (dsVe,userId,maLC) => {
    return async (dispatch,getState) => {
        try {
            dispatch(DisplayLoading())
            let result = await http.post(`/ticket/${userId}`,dsVe)
            //let result = await managerMovieService.layDanhSachBanner();
            if (result.status === 200) {
                const action = pushVeDangDat(result.data.data)
                // đặt vé thành công gọi api load lại Phòng vé
                await dispatch(getThongTinPhongVeApi(maLC))
                dispatch(action)
               
            }
            await dispatch(HideLoading())
            let userLogin = getState().UserReducer.userLogin;
            //connection.invoke('datGheThanhCong',userLogin.taiKhoan,dsVe.maLichChieu)
            let infor = {
                email:userLogin.id,
                list:[],
                maLC:maLC
            }
            stompClient.send('/app/muaVe',{},JSON.stringify(infor))
            dispatch(chuyenTabThongTinVe())

        } catch (errors) {
            dispatch(HideLoading())
            console.log('errors', errors)
        }
        
    }
}


export const datGhe = (ghe,maLC) => {
    return async (dispatch,getState) => {
        try {
            dispatch(datGheAction(ghe))
            //call api về Backend
            let danhSachGheDangDat = getState().TicketReducer.danhSachGheDangDat;
            let taiKhoan = getState().UserReducer.userLogin.email;

            console.log("======",danhSachGheDangDat);
            console.log("======",taiKhoan);
            console.log("======",maLC);

            //call api của signR
            //danhSachGheDangDat = JSON.stringify(danhSachGheDangDat);
            //let seat = danhSachGheDangDat[danhSachGheDangDat.length-1]
            //let infor = {...seat,"email":taiKhoan}
            let infor = {
                email:taiKhoan,
                list:danhSachGheDangDat,
                maLC:maLC
            }
            ////connection.invoke('datGhe',taiKhoan,danhSachGheDangDat,maLC)
            stompClient.send('/app/datGhe',{},JSON.stringify(infor))
            // let result = await http.post(`QuanLyDatVe/DatVe`)
           
            // if (result.status === 200) {
            //     const action = pushVeDangDat(result.data.content)
            //     // đặt vé thành công gọi api load lại Phòng vé
            //     await dispatch(getThongTinPhongVeApi(dsVe.maLichChieu))
            //     dispatch(action)
               
            // }
            // await dispatch(HideLoading())
            // dispatch(chuyenTabThongTinVe())
        } catch (errors) {
            dispatch(HideLoading())
            console.log('errors', errors)
        }
        
    }
}

