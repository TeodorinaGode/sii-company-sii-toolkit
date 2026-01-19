export interface SiiMenuUserInfo {
    workerId: string;
    companyId: string;
    firstName: string;
    lastName: string;
    userLocale: string;
    imgUrl: string;
    companies: Map<string, EngCompany>;
}
export interface EngCompany {
    id: string;
    code3: string;
    briefDescription: string;
    longDescription: string;
}
