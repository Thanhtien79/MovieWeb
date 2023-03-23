import { baseService } from "./BaseServices";

export class ManagerMovieService extends baseService{
    constructor() {
        super();
    }
    layDanhSachBanner = () => {
        return this.get(`QuanLyPhim/LayDanhSachBanner`);
    }
}

export const managerMovieService = new ManagerMovieService();