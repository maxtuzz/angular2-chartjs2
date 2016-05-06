
import { Component, OnInit, OnDestroy,
    EventEmitter, ElementRef, Inject} from '@angular/core';

import { CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass } from '@angular/common';

declare var Chart: any;

@Component({
    selector: 'chart, canvas[chart]',
    template: `<canvas></canvas>`,
    directives: [CORE_DIRECTIVES, NgClass]
})
export class Charts {
    constructor(@Inject(ElementRef) element: ElementRef) {
    }
}

@Component({
    selector: 'base-chart',
    properties: [
        'data',
        'labels',
        'series',
        'colours',
        'chartType',
        'options'
    ],
    events: ['chartClick', 'chartHover'],
    template: `<canvas height="350" (click)="click($event)" (mousemove)="hover($event)"></canvas>`,
    directives: [CORE_DIRECTIVES, FORM_DIRECTIVES, NgClass]
})
export class BaseChart implements OnInit, OnDestroy {
    private ctx: any;
    private cvs: any;
    private parent: any;
    private chart: any;
    private _data: Array<any> = [];
    private _labels: Array<any> = [];
    private _options: any = { responsive: true };
    private _chartType: string;
    private _series: Array<any> = [];
    private colours: Array<any> = [];
    private initFlag: boolean = false;
    private chartClick: EventEmitter<BaseChart> = new EventEmitter<BaseChart>();
    private chartHover: EventEmitter<BaseChart> = new EventEmitter<BaseChart>();
    private backgroundColors: Array<string> = [
        'rgba(151,187,205,1)', 'rgba(220,220,220,1)', 'rgba(247,70,74,1)',
        'rgba(70,191,189,1)', 'rgba(253,180,92,1)', 'rgba(148,159,177,1)', 'rgba(77,83,96,1)'
    ]
    private hoverBackgroundColors: Array<string> = [
        'rgba(151,187,205,0.8)', 'rgba(220,220,220,0.8)', 'rgba(247,70,74,0.8)',
        'rgba(70,191,189,0.8)', 'rgba(253,180,92,0.8)', 'rgba(148,159,177,0.8)', 'rgba(77,83,96,0.8)'
    ]
    private defaultsColours: Array<any> = [
        {
            hoverBorderColor: 'rgba(151,187,205,0.2)',
            borderColor: 'rgba(151,187,205,1)',
            backgroundColor: 'rgba(151,187,205,1)',
            hoverBackgroundColor: 'rgba(151,187,205,0.8)'
        }, {
            hoverBorderColor: 'rgba(220,220,220,0.2)',
            borderColor: 'rgba(220,220,220,1)',
            backgroundColor: 'rgba(220,220,220,1)',
            hoverBackgroundColor: 'rgba(220,220,220,0.8)'
        }, {
            hoverBorderColor: 'rgba(247,70,74,0.2)',
            borderColor: 'rgba(247,70,74,1)',
            backgroundColor: 'rgba(247,70,74,1)',
            hoverBackgroundColor: 'rgba(247,70,74,0.8)'
        }, {
            hoverBorderColor: 'rgba(70,191,189,0.2)',
            borderColor: 'rgba(70,191,189,1)',
            backgroundColor: 'rgba(70,191,189,1)',
            hoverBackgroundColor: 'rgba(70,191,189,0.8)'
        }, {
            hoverBorderColor: 'rgba(253,180,92,0.2)',
            borderColor: 'rgba(253,180,92,1)',
            backgroundColor: 'rgba(253,180,92,1)',
            hoverBackgroundColor: 'rgba(253,180,92,0.8)'
        }, {
            hoverBorderColor: 'rgba(148,159,177,0.2)',
            borderColor: 'rgba(148,159,177,1)',
            backgroundColor: 'rgba(148,159,177,1)',
            hoverBackgroundColor: 'rgba(148,159,177,0.8)'
        }, {
            hoverBorderColor: 'rgba(77,83,96,0.2)',
            borderColor: 'rgba(77,83,96,1)',
            backgroundColor: 'rgba(77,83,96,1)',
            hoverBackgroundColor: 'rgba(77,83,96,0.8)'
        }];

    constructor(@Inject(ElementRef) private element: ElementRef) {
    }

    ngOnInit() {
        this.ctx = this.element.nativeElement.children[0].getContext('2d');
        this.cvs = this.element.nativeElement.children[0];
        this.parent = this.element.nativeElement;
        this.refresh();
    }

    ngOnDestroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = null;
        }
    }

    private get labels(): any {
        return this._labels;
    }

    private set labels(value) {
        this._labels = value;
        this.refresh();
    }

    private get series(): any {
        return this._series;
    }

    private set series(value) {
        this._series = value;
        this.refresh();
    }

    private get options(): any {
        return this._options;
    }

    private set options(value) {
        this._options = value;
        this.refresh();
    }

    private get data(): any {
        return this._data;
    }

    private set data(value) {
        this._data = value;
        this.refresh();
    }

    private get chartType() : any {
        return this._chartType;
    }

    private set chartType(value) {
        this._chartType = value;
        this.refresh();
    }

    getColour(colour: Array<number>): any {
        return {
            backgroundColor: this.rgba(colour, 0.6),
            borderColor: this.rgba(colour, 0.5),
            hoverBackgroundColor: this.rgba(colour, 1),
            hoverBorderColor: this.rgba(colour, 0.8)
        };
    }

    getRandomInt(min : number, max : number) : number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    rgba(colour : Array<number>, alpha : number) : string {
        return "rgba(" + colour.concat(alpha).join(',') + ")";
    }

    public click(evt : any) : void {
        let activePoints : Array<any> = null;
        if (this.chart)
            activePoints = this.chart.getElementsAtEvent(evt);
        if (activePoints != null && activePoints.length > 0) {
            let activeLabel = activePoints[0].label;
            this.chartClick.next({ activePoints: activePoints, activeLabel: activeLabel });
        }
    }

    public hover(evt : any) : void {
        let activePoints : Array<any> = null;
        if (this.chart)
            activePoints = this.chart.getElementsAtEvent(evt);
        if (activePoints != null && activePoints.length > 0) {
            let activeLabel = activePoints[0].label;
            let activePoint = activePoints[0].value;
            this.chartClick.next({ activePoints: activePoints, activePoint: activePoint, activeLabel: activeLabel });
        }
    }

    private getChartBuilder(ctx: any, data: Array<any>, options: any) : any {
        this.initFlag = true;

        return new Chart(ctx, {
            type: this.chartType,
            data: data,
            options: options
        });
    }

    private addScales(options : any) : void {
        if (!options.singlestat)
            options.scales = {
                xAxes: [{
                    display: true,
                    type: 'time'
                }],
                yAxes: [{
                    display: true
                }]
            }
    }

    private refresh() : void {
        let hasData = this.data && this.data.length > 0;
        let hasType = this.chartType != null;
        let hasCtx = this.ctx != null;
        let hasLabels = this.labels != null && this.labels.length > 0;
        let hasSeries = this.series != null && this.series.length > 0;

        let isComplete = hasData && hasType && hasCtx && hasLabels && hasSeries;
        let datasets: Array<any> = [];

        if ((this.chartType === 'line'
            || this.chartType === 'bar'
            || this.chartType === 'radar') && isComplete) {

            this.addScales(this.options);

            for (let i = 0; i < this.data.length; i++) {

                let colourDesc: Array<number> = [this.getRandomInt(0, 255), this.getRandomInt(0, 255), this.getRandomInt(0, 255)];
                let colour = i < this.colours.length ? this.colours[i] : this.defaultsColours[i] || this.getColour(colourDesc);

                let data: any = (<any>Object).assign(colour, {
                    label: this.series[i],
                    data: this.data[i]
                });

                datasets.push(data);
            }
        } else if ((this.chartType === 'pie'
            || this.chartType === 'doughnut'
            || this.chartType === 'polarArea') && isComplete) {

            let backgroundColors: Array<string> = [];
            let hoverBackgroundColors: Array<string> = [];

            for (let i = 0; i < this.data.length; i++) {

                let colourDesc: Array<number> = [this.getRandomInt(0, 255), this.getRandomInt(0, 255), this.getRandomInt(0, 255)];
                backgroundColors.push(i < this.colours.length ?
                    this.colours[i] : this.backgroundColors[i] || this.rgba(colourDesc, 0.8));
                hoverBackgroundColors.push(i < this.colours.length ?
                    this.colours[i] : this.hoverBackgroundColors[i] || this.rgba(colourDesc, 0.8));
            }

            let data: any = (<any>Object).assign({
                data: this.data,
                backgroundColor: backgroundColors,
                hoverBackgroundColor: hoverBackgroundColors
            })

            datasets.push(data);
        }

        let data: any = {
            labels: this.labels,
            datasets: datasets
        };

        this.options.maintainAspectRatio = false;
        this.options.responsive = true;

        if (isComplete && !this.initFlag) {
            this.chart = this.getChartBuilder(this.ctx, data, this.options);
        } else if (isComplete && this.initFlag) {
            this.chart.config.data = data;
            this.chart.update();
        }

    }
}

export const ChartRenderer: Array<any> = [Charts, BaseChart];