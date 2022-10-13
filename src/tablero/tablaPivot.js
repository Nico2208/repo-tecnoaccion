import React from 'react';

import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import $ from 'jquery';

import Chart, {
  AdaptiveLayout,
  CommonSeriesSettings,
  Size,
  Tooltip,
} from 'devextreme-react/chart';

import PivotGrid, {
  FieldChooser
} from 'devextreme-react/pivot-grid';

import { datosPivot } from './datosTablaPivot.js';

class TablaPivot extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
                        windowWidth: $(window).width(),
                    };

    }

  componentDidMount() {
    this._pivotGrid.bindChart(this._chart, {
      dataFieldsDisplayMode: 'splitPanes',
      alternateDataFields: false,
    });
    setTimeout(function() {
      dataSource.expandHeaderItem('row', ['North America']);
      dataSource.expandHeaderItem('column', [2013]);
    });
  }

  render() {
    return (
      <div  className="mx-auto" style={{overflowX: 'scroll', width: '99%'}} id="tablaPivot">
          <h3 className="mb-3 text-center"><b>Tabla Pivot</b></h3>
          <React.Fragment>
            <Chart ref={(ref) => this._chart = ref.instance} >
              <Size height={200} />
              <Tooltip enabled={true} customizeTooltip={customizeTooltip} />
              <CommonSeriesSettings type="bar" />
              <AdaptiveLayout width={this.state.windowWidth} />
            </Chart>
    
            <PivotGrid
              id="pivotgrid"
              dataSource={dataSource}
              allowSortingBySummary={true}
              allowFiltering={false}
              showBorders={true}
              showColumnTotals={false}
              showColumnGrandTotals={false}
              showRowTotals={false}
              showRowGrandTotals={false}
              ref={(ref) => this._pivotGrid = ref.instance}
            >
              <FieldChooser enabled={false} height={400} />
            </PivotGrid>
          </React.Fragment>
      </div>
    );
  }
}

const dataSource = new PivotGridDataSource({
  fields: [{
    caption: 'Region',
    width: 30,
    dataField: 'region',
    area: 'row',
    sortBySummaryField: 'Total'
  }, {
    caption: 'City',
    dataField: 'city',
    width: 30,
    area: 'row'
  }, {
    dataField: 'date',
    dataType: 'date',
    area: 'column'
  }, {
    groupName: 'date',
    groupInterval: 'month',
    visible: false
  }, {
    caption: 'Total',
    dataField: 'amount',
    dataType: 'number',
    summaryType: 'sum',
    format: 'currency',
    area: 'data'
  }],
  store: datosPivot
});

const currencyFormatter = new Intl.NumberFormat(
  'en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }
);

function customizeTooltip(args) {
  const valueText = currencyFormatter.format(args.originalValue);
  return {
    html: `${args.seriesName} | Total<div class="currency">${valueText}</div>`
  };
}

export default TablaPivot;
