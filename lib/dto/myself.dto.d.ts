export interface MyselfDTO {
    userInfo: string;
    workerId: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    locale: string;
    companyId: string;
    accessType: string;
    costCenterId: string;
    costCenterDescr: string;
    toolbarMode: string;
    inUserAudit?: boolean;
    inputDatePattern: string;
    displayDatePattern: string;
    costCenterResp: MyselfCostCenterRespDTO;
    tutorFistName?: string;
    tutorLastName?: string;
    tutorWorkerId?: string;
    evaluatorFistName?: string;
    evaluatorLastName?: string;
    evaluatorWorkerId?: string;
    bu?: string;
    office?: string;
    isInDelegation?: boolean;
    delegatedUsers?: MyselfDelegateduserDTO[];
}
export interface MyselfCostCenterRespDTO {
    firstName: string;
    id: string;
    lastName: string;
    username: string;
}
export interface MyselfDelegateduserDTO {
    workerId: string;
    name: string;
    id: string;
    surname: string;
    username: string;
}
