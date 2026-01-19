export declare enum SiiEventStatus {
    VECCHIA = "VECCHIA",
    SCADUTA = "SCADUTA",
    SCADENZA_OGGI = "SCADENZA_OGGI",
    IN_SCADENZA = "IN_SCADENZA",
    PROSSIMAMENTE = "PROSSIMAMENTE"
}
export interface OfficeCalendarEvents {
    '@odata.nextLink'?: string;
    value: OfficeEvent[];
}
export interface Body {
    contentType: string;
    content: string;
}
export interface DateEvent {
    dateTime: Date;
    timeZone: string;
}
export interface OfficeEvent {
    date?: string;
    endDate?: string;
    time?: string;
    status?: SiiEventStatus;
    hideData?: boolean;
    '@odata.etag': string;
    id: string;
    subject: string;
    bodyPreview: string;
    body: Body;
    start: DateEvent;
    end: DateEvent;
    isAllDay: boolean;
}
