import { AfterContentInit, ElementRef } from '@angular/core';
import { MatInput } from '@angular/material/input';
import { MatEndDate, MatStartDate } from '@angular/material/datepicker';
import { SiiToolkitService } from '../../sii-toolkit.service';
import { SiiDatePipe } from './sii-date.pipe';
import { NgControl } from '@angular/forms';
import * as i0 from "@angular/core";
export declare class DateHintDirective implements AfterContentInit {
    private el;
    private siiDatePipe;
    private siiToolkitService;
    matInput: MatInput;
    startDate: MatStartDate<Date>;
    endDate: MatEndDate<Date>;
    dateHint: HTMLSpanElement;
    startDateHint: HTMLSpanElement;
    endDateHint: HTMLSpanElement;
    constructor(el: ElementRef, siiDatePipe: SiiDatePipe, siiToolkitService: SiiToolkitService);
    ngAfterContentInit(): void;
    checkForError(): void;
    initialize(control: NgControl, hintSpan: HTMLSpanElement, addSeparator?: boolean): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<DateHintDirective, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<DateHintDirective, "[siiDateHint]", never, {}, {}, ["matInput", "startDate", "endDate"], never, true, never>;
}
