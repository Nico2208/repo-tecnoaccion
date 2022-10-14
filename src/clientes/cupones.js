import React from 'react';
import DataGrid, { Column, Pager, Paging, Lookup, Button, Sorting } from 'devextreme-react/data-grid';
import DateBox from 'devextreme-react/date-box';
import 'devextreme-react/text-area';
import Form, { SimpleItem, Label, GroupItem, RangeRule, RequiredRule } from 'devextreme-react/form';
import 'devextreme-react/text-area';
import { Alert } from 'react-bootstrap';
import NumberFormat from 'react-number-format';
import fetchTimeout from 'fetch-timeout';
import Moment from 'moment';
import $ from 'jquery';
import moment from 'moment';


class Cupones extends React.Component {

  constructor(props) {
    super(props);

    this.dataGridRef = React.createRef();

    this.traerJuegos = this.traerJuegos.bind(this);
    this.handleCupones = this.handleCupones.bind(this);
    this.handleVerCupon = this.handleVerCupon.bind(this);
    this.addPage = this.addPage.bind(this);
    this.firstPage = this.firstPage.bind(this);
    this.lastPage = this.lastPage.bind(this);
    this.removePage = this.removePage.bind(this);
    this.ejecutarConsultarCupones = this.ejecutarConsultarCupones.bind(this);
    this.onFocusedRowChanged = this.onFocusedRowChanged.bind(this);
    this.formFieldDataChanged = this.formFieldDataChanged.bind(this);
    this.inicializarCupones = this.inicializarCupones.bind(this);
    this.maxDate = new Date();
    this.minDate = new Date().setDate(this.maxDate.getDate())
    this.state = {
      idrow: "",
    }
    this.dateOptions = {
      displayFormat: 'dd/MM/yyyy',
      pickerType: "calendar",
      format: "date",
    };

    this.formatImporte = {
      displayFormat: '###,###,###,##0.00'
    }


    this.traerJuegos();

  }

  get dataGrid() {
    return this.dataGridRef.current.instance;
  }

  formFieldDataChanged(e) {

    this.inicializarCupones();

    if (e.dataField === "fechaDesde") {
      const d1 = new Date(e.value)

      
      this.minDate = d1
      this.props.cambioFechaDesdeCupon(e.value);
    } 


  }

  inicializarCupones() {

    this.props.inicializarCupones();

    /*
    this.setState({
          totalPages: "",
          totalItems:"",
          currentPage:"",
          paginado:false,
          idCuponSeleccionado : null,
          cupones : [],
          verCupon: {
                    payload : formFieldDataChanged{
                              apuestas : [],
                              extractos: [],
                              sorteos: []
                              }
                    }

        });*/

  }


  addPage() {
    console.log(Number($("#pagConsCupon").val()));
    if (Number($("#pagConsCupon").val()) < this.props.cupones.totalPages)
      $("#pagConsCupon").val(Number($("#pagConsCupon").val()) + 1);
    else
      $("#pagConsCupon").val(this.props.cupones.totalPages);

    this.ejecutarConsultarCupones(Number($("#pagConsCupon").val()));

  }

  firstPage() {
    $("#pagConsCupon").val(1);
    this.ejecutarConsultarCupones(Number($("#pagConsCupon").val()));
  }

  lastPage() {
    $("#pagConsCupon").val(this.props.cupones.totalPages);
    this.ejecutarConsultarCupones(Number($("#pagConsCupon").val()));
  }

  removePage() {

    if (Number($("#pagConsCupon").val()) > 1)
      $("#pagConsCupon").val(Number($("#pagConsCupon").val()) - 1);
    else
      $("#pagConsCupon").val(1);

    this.ejecutarConsultarCupones(Number($("#pagConsCupon").val()));

  }

  componentDidMount() {



  }


  handleVerCupon() {


    //this.dataGrid.getSelectedRowsData();


    this.props.handleVerCupon();

    $('#cuponView').modal('toggle');

  }

  onFocusedRowChanged(e) {

    const dataRow = e.row && e.row.data;

    this.setState({ idrow: e.component.option('focusedRowKey') })


    if (dataRow) {
      this.props.setIdCuponSeleccionado(dataRow.id);
    } else {
      this.props.setIdCuponSeleccionado(null);
    }

  }

  traerJuegos() {

    this.props.traerJuegos();

  }

  handleChangePagina(e) {

    if (e.target.value.length == 0) return;
    if (!((Number($("#pagConsCupon").val()) >= 1) &&
      (Number($("#pagConsCupon").val()) <= this.props.cupones.totalPages)))
      this.ejecutarConsultarCupones(1);
    else
      this.ejecutarConsultarCupones(Number(e.target.value));

  }

  handleCupones() {
  
    this.ejecutarConsultarCupones(1);
  }

  ejecutarConsultarCupones(pagina) {

    this.props.ejecutarConsultarCupones(pagina);

  }

  render() {

    let lineasApuestas = <div></div>;
    if ((this.props.cupones.verCupon != null) && (this.props.cupones.verCupon.payload != null) && (this.props.cupones.verCupon.payload.apuestas != null))
      lineasApuestas = this.props.cupones.verCupon.payload.apuestas.map(
        (linea, index) =>
          <tr key={index}>
            <td>{linea.nro}</td>
            <td>{linea.alc}</td>
            <td>{linea.tipo === "Q2R" ? "Redoblona" : linea.imp}</td>
          </tr>

      );

    let sorteos = <div></div>;
    if ((this.props.cupones.verCupon != null) && (this.props.cupones.verCupon.payload != null) && (this.props.cupones.verCupon.payload.sorteos != null))
      sorteos = this.props.cupones.verCupon.payload.sorteos.map(
        (sorteo, index) =>
          <tr key={index}>
            <td>{sorteo.sorteo}</td>
            <td>{sorteo.loteria}</td>
          </tr>
      );

    let extractosTomboExpress = <div></div>;

    if ((this.props.cupones.verCupon != null) && (this.props.cupones.verCupon.payload != null) && (this.props.cupones.verCupon.payload.extractos != null))
      extractosTomboExpress = this.props.cupones.verCupon.payload.extractos.map(
        (linea, index) =>
          <div className="col-sm-4 text-center" key={index}>

            <b>{linea.loteria}</b>

            <table>
              <tbody>
                <tr>
                  <td style={{ width: "70px" }}>
                    <tbody>
                      <tr>
                        <td><b>1</b></td>
                        <td>{linea.extractosQuiniela[0].numero}</td>
                      </tr>
                      <tr>
                        <td><b>2</b></td>
                        <td>{linea.extractosQuiniela[1].numero}</td>
                      </tr>
                      <tr>
                        <td><b>3</b></td>
                        <td>{linea.extractosQuiniela[2].numero}</td>
                      </tr>
                      <tr>
                        <td><b>4</b></td>
                        <td>{linea.extractosQuiniela[3].numero}</td>
                      </tr>
                      <tr>
                        <td><b>5</b></td>
                        <td>{linea.extractosQuiniela[4].numero}</td>
                      </tr>
                    </tbody>
                  </td>
                  <td>
                    <tbody>
                      <tr>
                        <td><b>6</b></td>
                        <td>{linea.extractosQuiniela[5].numero}</td>
                      </tr>
                      <tr>
                        <td><b>7</b></td>
                        <td>{linea.extractosQuiniela[6].numero}</td>
                      </tr>
                      <tr>
                        <td><b>8</b></td>
                        <td>{linea.extractosQuiniela[7].numero}</td>
                      </tr>
                      <tr>
                        <td><b>9</b></td>
                        <td>{linea.extractosQuiniela[8].numero}</td>
                      </tr>
                      <tr>
                        <td><b>10</b></td>
                        <td>{linea.extractosQuiniela[9].numero}</td>
                      </tr>
                    </tbody>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
      );

    let extractosTombola = <div></div>;
    if ((this.props.cupones.verCupon != null) && (this.props.cupones.verCupon.payload != null) && (this.props.cupones.verCupon.payload.extractos != null))
      extractosTombola = this.props.cupones.verCupon.payload.extractos.map(
        (linea, index) =>
          <div className="col-sm-4 text-center" key={index}>

            <b>{linea.loteria}</b>

            <table className="mt-1">
              <tbody>
                <tr>
                  <td style={{ width: "70px" }}>
                    <tbody>
                      <tr>
                        <td><b>1</b></td>
                        <td>{linea.extractosQuiniela[0].numero}</td>
                      </tr>
                      <tr>
                        <td><b>2</b></td>
                        <td>{linea.extractosQuiniela[1].numero}</td>
                      </tr>
                      <tr>
                        <td><b>3</b></td>
                        <td>{linea.extractosQuiniela[2].numero}</td>
                      </tr>
                      <tr>
                        <td><b>4</b></td>
                        <td>{linea.extractosQuiniela[3].numero}</td>
                      </tr>
                      <tr>
                        <td><b>5</b></td>
                        <td>{linea.extractosQuiniela[4].numero}</td>
                      </tr>
                      <tr>
                        <td><b>6</b></td>
                        <td>{linea.extractosQuiniela[5].numero}</td>
                      </tr>
                      <tr>
                        <td><b>7</b></td>
                        <td>{linea.extractosQuiniela[6].numero}</td>
                      </tr>
                      <tr>
                        <td><b>8</b></td>
                        <td>{linea.extractosQuiniela[7].numero}</td>
                      </tr>
                      <tr>
                        <td><b>9</b></td>
                        <td>{linea.extractosQuiniela[8].numero}</td>
                      </tr>
                      <tr>
                        <td><b>10</b></td>
                        <td>{linea.extractosQuiniela[9].numero}</td>
                      </tr>
                    </tbody>
                  </td>
                  <td>
                    <tbody>
                      <tr>
                        <td><b>11</b></td>
                        <td>{linea.extractosQuiniela[10] != null ? linea.extractosQuiniela[10].numero : ""}</td>
                      </tr>
                      <tr>
                        <td><b>12</b></td>
                        <td>{linea.extractosQuiniela[11] != null ? linea.extractosQuiniela[11].numero : ""}</td>
                      </tr>
                      <tr>
                        <td><b>13</b></td>
                        <td>{linea.extractosQuiniela[12] != null ? linea.extractosQuiniela[12].numero : ""}</td>
                      </tr>
                      <tr>
                        <td><b>14</b></td>
                        <td>{linea.extractosQuiniela[13] != null ? linea.extractosQuiniela[13].numero : ""}</td>
                      </tr>
                      <tr>
                        <td><b>15</b></td>
                        <td>{linea.extractosQuiniela[14] != null ? linea.extractosQuiniela[14].numero : ""}</td>
                      </tr>
                      <tr>
                        <td><b>16</b></td>
                        <td>{linea.extractosQuiniela[15] != null ? linea.extractosQuiniela[15].numero : ""}</td>
                      </tr>
                      <tr>
                        <td><b>17</b></td>
                        <td>{linea.extractosQuiniela[16] != null ? linea.extractosQuiniela[16].numero : ""}</td>
                      </tr>
                      <tr>
                        <td><b>18</b></td>
                        <td>{linea.extractosQuiniela[17] != null ? linea.extractosQuiniela[17].numero : ""}</td>
                      </tr>
                      <tr>
                        <td><b>19</b></td>
                        <td>{linea.extractosQuiniela[18] != null ? linea.extractosQuiniela[18].numero : ""}</td>
                      </tr>
                      <tr>
                        <td><b>20</b></td>
                        <td>{linea.extractosQuiniela[19] != null ? linea.extractosQuiniela[19].numero : ""}</td>
                      </tr>
                    </tbody>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
      );

    return (

      <div id="data-grid-demo" className="bg-light p-3 border" style={{ maxHeight: $("#panelResultados").height() - 45 }}>

        <div className="mb-3">
          <Form formData={this.props.cupones.filtros} onFieldDataChanged={this.formFieldDataChanged} >
            <GroupItem cssClass="first-group" colCount={5}>
              <GroupItem colSpan={1}>
                {/* <DateBox defaultValue={this.state.fechaHoy}
                  onChange={() => this.changeVal}
                  max={this.state.maxDataValue}
                  editorOptions={this.dateOptions}
                  type="date" /> */}
                <SimpleItem
                  dataField="fechaDesde"
                  editorType="dxDateBox"
                  editorOptions={this.dateOptions}
                >
                  <Label text="Desde"></Label>
                  <RequiredRule message="Ingresar fecha Desde" />
                  <RangeRule max={this.maxDate} message="Tenes que ingresar una fecha válida" />
                </SimpleItem>
              </GroupItem>

              <GroupItem colSpan={1}>
                <SimpleItem
                  dataField="fechaHasta"
                  editorType="dxDateBox"

                  editorOptions={this.dateOptions}

                  /*Que hace esto */
                  value={this.props.cupones.filtros.fechaHasta}
                >
                  <Label text="Hasta"></Label>
                  <RequiredRule message="Date of birth is required" />
                  <RangeRule min={this.minDate} max={this.maxDate} message="Tenes que ingresar una fecha válida" />
                </SimpleItem>
                {/* <DateBox defaultValue={this.state.fechaHoy}

                  max={this.state.maxDataValue}
                  editorOptions={this.dateOptions}
                  type="date" /> */}
              </GroupItem>

              <GroupItem colSpan={1}>
                <SimpleItem
                  dataField="juego"
                  editorType="dxSelectBox"
                  editorOptions={
                    this.props.cupones.filtros.juegosOptions
                  }
                />
              </GroupItem>

              <GroupItem colSpan={1}>
                <SimpleItem
                  dataField="nuc"
                />
              </GroupItem>


              <GroupItem colSpan={1}>

                <button type="button" className="btn btn-dark" onClick={this.handleCupones}>
                  <span className="iconify mr-2" data-icon="bx:bx-search-alt" data-inline="false" data-width="20px"></span>
                  <b>Cupones</b>
                </button>
              </GroupItem>


            </GroupItem>


          </Form>
        </div>


        <DataGrid
          dataSource={this.props.cupones.cupones}
          showBorders={true}
          ref={this.dataGridRef}
          focusedRowKey={this.state.idrow}
          keyExpr='id'
          focusedRowEnabled={true}
          onFocusedRowChanged={this.onFocusedRowChanged}

        >

          <Paging enabled={false} />
          <Sorting mode="none" />

          {/*        
          <Editing mode="popup" allowUpdating={true} useIcons={true}>

            <Popup title="Cupones" showTitle={true} width={700} height={580}>
              <Position my="top" at="top" of={window} />
            </Popup>

            <Form>
              <Item itemType="group" colCount={2} colSpan={2}>
                <Item dataField="codigoJuego" />
                <Item dataField="cantidadApuestas" />
                <Item dataField="importeGanado" />
                <Item dataField="sorteado" />
                <Item dataField="estadoCupon" />
                <Item dataField="fecha" />
                <Item dataField="total" />
              </Item>  
              
            </Form>

          </Editing>*/
          }


          <Column dataField="codigoJuego" caption="Juego" width={125}>
            <Lookup dataSource={this.props.cupones.filtros.juegosOptions.items} valueExpr="codigo" displayExpr="nombre" />
          </Column>
          <Column dataField="cantidadApuestas" caption="Apuestas" />
          <Column dataField="importeGanado" caption="Premio" format={this.formatImporte} />
          <Column dataField="sorteo.sorteado" caption="Sorteado?" />
          <Column dataField="sorteo.fechaEvento" caption="F. Sorteo" dataType="date" format="dd/MM/yyyy HH:mm:ss" />
          <Column dataField="estadoCupon" caption="Estado" />
          <Column dataField="fecha" caption="F. Emitido" dataType="date" format="dd/MM/yyyy HH:mm:ss" />
          <Column dataField="total" caption="Tot. Cupón" format={this.formatImporte} />
          <Column dataField="nuc" caption="NUC" />

          <Column type="buttons" caption="Ver Cupón">
            <Button
              icon="search"
              text="Ver cupón"
              hint="Ver cupón"
              onClick={this.handleVerCupon}
            />
          </Column>
        </DataGrid>

        {this.props.cupones.paginado === true &&
          <div className="mt-2">
            <label htmlFor="paginador">Pagina</label>

            <a onClick={this.firstPage} style={{ cursor: "pointer" }} className="ml-1">
              <span className="iconify" data-icon="dashicons:arrow-left-alt2" data-inline="false" style={{ marginRight: "-9px" }}></span>
              <span className="iconify" data-icon="dashicons:arrow-left-alt2" data-inline="false"></span>
            </a>

            <a onClick={this.removePage} ><span style={{ cursor: "pointer" }} className="iconify" data-icon="dashicons:arrow-left-alt2" data-inline="false"></span></a>

            <input
              className="mr-1 ml-1 text-center"
              type="number"
              id="pagConsCupon"
              style={{ width: "30px" }}
              placeholder={this.props.cupones.currentPage + 1}
              onBlur={(e) => { this.handleChangePagina(e) }}
            />

            <a onClick={this.addPage}><span style={{ cursor: "pointer" }} className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false"></span></a>

            <a onClick={this.lastPage} style={{ cursor: "pointer" }} className="mr-1">
              <span className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false"></span>
              <span className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false" style={{ marginLeft: "-9px" }}></span>
            </a>

            <span>de {this.props.cupones.totalPages} ({this.props.cupones.totalItems} registros) </span>
          </div>
        }

        <div className="modal fade" style={{ marginTop: "2.5%" }} id="cuponView" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog shadow" role="document" style={{ maxWidth: "75%", height: "85%", backgroundColor: "white" }}>
            <div className="modal-content" style={{ overflowY: "scroll", overflowX: "hidden", height: "100%", border: "none" }}>
              <div style={{ position: "sticky", top: "0", zIndex: "2" }} className="modal-header bg-dark">

                <h5 className="modal-title text-light" id="exampleModalLabel">Cupón {this.props.cupones.verCupon.evento}</h5>
                <button type="button" className="close text-light" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>

              </div>

              <div className="row mt-3">
                <div className="col-sm-6">
                  <div>
                    <b>Emitido </b> {Moment(this.props.cupones.verCupon.fecEmi).format('DD/MM/YYYY HH:mm:ss')}
                  </div>
                  <div>
                    <b>Sorteo </b> {Moment(this.props.cupones.verCupon.juego == 0 ? this.props.cupones.verCupon.fecSorteo : this.props.cupones.verCupon.fecEmi).format('DD/MM/YYYY HH:mm:ss')}
                  </div>
                </div>

                <div className="col-sm-6">
                  <div><b>Total del Cupón </b> <NumberFormat value={this.props.cupones.verCupon.total} displayType={'text'} thousandSeparator={"."} decimalSeparator={","} prefix={' $ '} decimalScale={2} fixedDecimalScale={true} isNumericString={true} /> </div>
                  {this.props.cupones.verCupon.premio != null &&
                    <div>
                      <b className="text-success">Premio </b> <NumberFormat value={this.props.cupones.verCupon.premio} displayType={'text'} thousandSeparator={"."} decimalSeparator={","} prefix={' $ '} decimalScale={2} fixedDecimalScale={true} isNumericString={true} />
                    </div>
                  }
                </div>

              </div>

              <hr className="w-90 mx-auto mt-3 mb-2"></hr>

              <div className="modal-body row">
                <div className={this.props.cupones.verCupon.extractos ? "col-sm-6" : "col-sm-6 offset-sm-3"}>
                  <div className="row mb-3">

                    <div className="col-sm-12">
                      <b>Nro de control:</b> {this.props.cupones.verCupon.ctrlp}
                    </div>

                    <div className="col-sm-12">
                      <b>NUC:</b> {this.props.cupones.verCupon.nuc}
                    </div>
                  </div>

                  <table className="w-75 mx-auto table-fixed">
                    <thead>
                      <tr>
                        <th>Nro</th>
                        <th>Alcance</th>
                        <th>Importe</th>
                      </tr>

                    </thead>
                    <tbody>

                      {lineasApuestas}

                    </tbody>
                  </table>

                  <hr className="w-90 mx-auto mt-3 mb-3"></hr>

                  <table className="w-75 mx-auto table-fixeds">

                    <thead>
                      <tr>
                        <th>Sorteo</th>
                        <th>Extracto</th>
                        <th></th>
                      </tr>

                    </thead>

                    <tbody>
                      {sorteos}
                    </tbody>

                  </table>
                </div>


                {this.props.cupones.verCupon.extractos !== null &&

                  <div className="col-sm-6">
                    <h3 className="text-center mb-">Extractos</h3>
                    <div className="row p-2 mt-3">
                      {this.props.cupones.verCupon.juego === 0 && extractosTombola}
                      {this.props.cupones.verCupon.juego === 1 && extractosTomboExpress}
                    </div>

                  </div>
                }
              </div>

            </div>
          </div>
        </div>

      </div>
    );
  }
}

export default Cupones;
