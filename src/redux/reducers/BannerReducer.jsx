import { createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { managerMovieService } from '../../services/ManagerMovieService';
import { http } from '../../util/config';

const initialState = {
    arrBanner: [{
        "maBanner": 1,
        "maPhim": 1282,
        "hinhAnh": "https://movienew.cybersoft.edu.vn/hinhanh/ban-tay-diet-quy.png"
      }
    ]
}

const BannerReducer = createSlice({
  name: "BannerReducer",
  initialState,
  reducers: {
    getBannerAction: (state,action) => {
      let arrBanner = action.payload;
      state.arrBanner = arrBanner;
    }
  }
});

export const {getBannerAction} = BannerReducer.actions

export default BannerReducer.reducer

//=================== asyn action ===================
export const getBannerApi = () => {
  return async dispatch => {
    let result = await http.get(`/movie`);
    //let result = await managerMovieService.layDanhSachBanner();
    const action =getBannerAction(result.data.data);
    dispatch(action);
  }
} 