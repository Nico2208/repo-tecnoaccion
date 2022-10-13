import React from 'react';

import { Animated } from 'react-animated-css';
import { CircularGauge, Scale, Label, RangeContainer, Range, Export } from 'devextreme-react/circular-gauge';
import DateBox from 'devextreme-react/date-box';

import TablaPivot from './tablaPivot'
import GraficoTorta from './pieChart'

class Tablero extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tasaAbandono: 51.52
    };

  }


  render() {
  
    return (
      <Animated animationIn="fadeIn mb-3">
          <div className="bg-light pr-3 pl-3 pt-2 mt-2 pb-2 shadow mx-auto">
            <h4 className="bg-dark p-2 text-center text-light mx-auto mb-2">Tablero</h4> 
            <div className="row w-90 mx-auto text-center mb-2">
                
                <div className="col-6 col-sm-4 offset-sm-1">
                  <div className="text-center">
                      <label htmlFor="fieldFormatSeleccionadaRep" className="mb-0 mt-2 mr-3"><b>Organizacion</b></label>
                  </div>  
  
                  <div>
                      <select name="org" id="fieldFormatSeleccionadaRep" className="select w-100">
                      <option>Organziacion 1</option>
                      <option>Organziacion 2</option>
                      <option>Organziacion 3</option>
                      </select>
                  </div>
                </div>

                <div className="col-6 col-sm-4 offset-sm-2">
                  <div className="text-center">
                      <label htmlFor="fieldFormatSeleccionadaRep" className="mb-0 mt-2 mr-3"><b>Fecha</b></label>
                  </div>  
  
                  <div>
                    <DateBox id="fechaDesde" type="date" displayFormat="dd/MM/yyyy"/>
                  </div>
                </div>


            </div>
          </div>
          
          <div className="bg-light p-3 row shadow text-center mt-2 w-100 mx-auto">
              
              <div className="col-12 mb-2">
                <h3>Cupones</h3>
              </div>

              <div className="col-4">
                <span className="text-secondary mb-2">Quiniela</span>
                <h3><b>$4430.00</b></h3>
              </div>

              <div className="col-4">
                <span className="text-secondary mb-2">Q. Express</span>
                <h3><b>$3335.00</b></h3>
              </div>

              <div className="col-4">
                <span className="text-secondary mb-2">Totales</span>
                <h3><b>$7765.00</b></h3>
              </div>

          </div>

          <div className="bg-light p-3 row shadow text-center mt-2 w-100 mx-auto">

              <div className="col-12 mb-2">
                <h3>Clientes</h3>
              </div>

              <div className="col-4">
                <span className="text-secondary mb-2">Altas</span>
                <h3><b>1</b></h3>
              </div>

              <div className="col-4">
                <span className="text-secondary mb-2">Jugaron</span>
                <h3><b>5</b></h3>
              </div>

              <div className="col-4">
                <span className="text-secondary mb-2">Activos</span>
                <h3><b>33</b></h3>
              </div>

          </div>

          <div className="bg-light p-3 row shadow text-center mt-2 w-100 mx-auto mb-2">

            <div className="col-12 col-sm-6">
                <h3><b>Tasa de Abandono: {this.state.tasaAbandono}%</b></h3>
                <CircularGauge id="gauge" value={this.state.tasaAbandono}>
                    <Scale startValue={0} endValue={100} tickInterval={10}>
                        <Label useRangeColors={true} />
                    </Scale>
                    <RangeContainer palette="pastel">
                        <Range startValue={0} endValue={33} />
                        <Range startValue={33} endValue={66} />
                        <Range startValue={66} endValue={100} />
                    </RangeContainer>
                    <Export enabled={false} />
                </CircularGauge>
            </div>

            <div className="col-12 col-sm-6 bg-light pb-3 pr-0 pl-0">
              <GraficoTorta />
          </div>

          </div>

          {/*<div className="col-12 mt-2 bg-light pt-3 pb-3 pr-0 pl-0">
              <TablaPivot />
          </div>*/}

      </Animated>
    );
  }
}

export default Tablero;
