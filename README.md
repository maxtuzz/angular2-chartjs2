# Chart.js v2 Angular 2 Component
This repository contains a component for Chart v2 used in an Angular 2 component. The basic principles were taken from: https://github.com/valor-software/ng2-charts, but differed that far a some point, that I created an own repository. 

## Usage
Currently there are no sample files, and also no things package.json files. What you need to do, to get Chart.js v2 running with this Angular 2 component is as follows:

Include your Chart.js file in your `index.html` as follows:

`<script src="lib/Chart.js"></script>`

Include the `chart-renderer.ts` in your `bootstrap.ts` as follows:

`import { ChartRenderer } from './services/chart/chart-renderer';`

Include the `chart-renderer.ts` in your `@Component/@View` as follows:

`import { ChartRenderer } from '../../services/chart/chart-renderer';``

```ts
@Component({
  ...
  directives: [
    ChartRenderer
  ]
})
...
```

Include a chart in your HTML file as follows:

```html
<base-chart class="chart"
		 [data]="chart.data"
		 [labels]="chart.labels"
		 [series]="chart.series"
		 [chartType]="chart.type"
		 [options]="chart.options"
		 (chart-hover)="chartHovered($event)"
		 (chart-click)="chartClicked($event)"></base-chart>
```

## API

### Properties

- `data` (`Array<any>`) -  set of points of the chart, it should be Array&lt;Array&lt;number&gt;&gt; only for line, bar and radar, otherwise Array&lt;number&gt;
- `labels` (`?Array<any>`) - x axis labels. It's necessary for charts: line, bar and radar. And just labels (on hover) for charts: polar area, pie and doughnut
- `chartType` (`?string`) - indicates the type of charts, it can be: 'Line', 'Bar', 'Radar', 'Pie', 'PolarArea', 'Doughnut'
- `options` (`?any`) - chart options (as from [Chart.js documentation](http://www.chartjs.org/docs/))
- `series` (`?Array<any>`) - name points on the chart, work for line, bar and radar
- `colours` (`?Array<any>`) - data colours, will use default colours if not specified ([see readme for components](https://github.com/valor-software/ng2-charts/blob/master/components/charts/readme.md))
- `legend`: (`?boolean=false`) - if true show legend below the chart, otherwise not be shown

### Events

- `chartClick`: fires when click on a chart has occurred, returns information regarding active points and labels
- `chartHover`: fires when mousemove (hover) on a chart has occurred, returns information regarding active points and labels


## Troubleshooting

Please follow this guidelines when reporting bugs and feature requests:

1. Use [GitHub Issues](https://github.com/valor-software/ng2-charts/issues) board to report bugs and feature requests (not our email address)
2. Please **always** write steps to reproduce the error. That way we can focus on fixing the bug, not scratching our heads trying to reproduce it.

Thanks for understanding!

### License

The MIT License (see the [LICENSE](https://github.com/valor-software/ng2-charts/blob/master/LICENSE) file for the full text)

