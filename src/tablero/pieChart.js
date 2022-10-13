import React from 'react';
import $ from 'jquery';
import PieChart, {
  Series,
  Label,
  Connector,
  Size,
  Export
} from 'devextreme-react/pie-chart';


class GraficoTorta extends React.Component {
  constructor(props) {
    super(props);

    this.state={
        windowWidth: $(window).width() - 30,
        datosGrafico: [{
            country: 'Russia',
            area: 12
          }, {
            country: 'Canada',
            area: 7
          }, {
            country: 'USA',
            area: 7
          }, {
            country: 'China',
            area: 7
          }, {
            country: 'Brazil',
            area: 6
          }, {
            country: 'Australia',
            area: 5
          }, {
            country: 'India',
            area: 2
          }, {
            country: 'Others',
            area: 55
          }]
    }

    this.pointClickHandler = this.pointClickHandler.bind(this);
    this.legendClickHandler = this.legendClickHandler.bind(this);

    
  }
  
  componentDidMount(){
      if(this.state.windowWidth > 600){
          this.setState({
              windowWidth: this.state.windowWidth / 3
          })
      }
  }  

  render() {
    return (
      <div>
          <h3 className="text-center mb-3"><b>Grafico Torta</b></h3>
          <PieChart
            id="pie"
            dataSource={this.state.datosGrafico}
            title=""
            //onPointClick={this.pointClickHandler}
            //onLegendClick={this.legendClickHandler}
          >
            <Series
              argumentField="country"
              valueField="area"
            >
              <Label visible={true}>
                <Connector visible={true} width={1} />
              </Label>
            </Series>
    
            <Size width={this.state.windowWidth} />
            <Export enabled={false} />
          </PieChart>
      </div>
    );
  }

  pointClickHandler(e) {
    this.toggleVisibility(e.target);
  }

  legendClickHandler(e) {
    let arg = e.target;
    let item = e.component.getAllSeries()[0].getPointsByArg(arg)[0];

    this.toggleVisibility(item);
  }

  toggleVisibility(item) {
    item.isVisible() ? item.hide() : item.show();
  }
}

export default GraficoTorta;
