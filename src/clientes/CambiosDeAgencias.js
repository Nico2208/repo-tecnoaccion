import React from 'react';

import DataGrid, { Column, Pager, Paging, Sorting } from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';

import $ from 'jquery';
import Moment from 'moment';
import fetchTimeout from 'fetch-timeout';
import NumberFormat from 'react-number-format';



import Form, {
    SimpleItem,
    GroupItem,
    Label
} from 'devextreme-react/form';
import 'devextreme-react/text-area';
import M from 'minimatch';


class CambiosDeAgencias extends React.Component {

    constructor(props) {
        super(props);


        this.dateOptions = {
            displayFormat: 'dd/MM/yyyy',
            pickerType: "calendar",
            format: "date",
        };

        this.handleMovimientos = this.handleMovimientos.bind(this);
        this.addPage = this.addPage.bind(this);
        this.removePage = this.removePage.bind(this);
        this.firstPage = this.firstPage.bind(this);
        this.lastPage = this.lastPage.bind(this);
        this.formFieldDataChanged = this.formFieldDataChanged.bind(this);
        this.inicializarCambiosDeAgencias = this.inicializarCambiosDeAgencias.bind(this);
        this.ClickAcelerarCambioAgencia = this.ClickAcelerarCambioAgencia.bind(this);
        this.isMostrarAcelerarCambio = this.isMostrarAcelerarCambio.bind(this);


    }

    isMostrarAcelerarCambio(e) {
        return e.row.data.pendiente===true;
    }

    ClickAcelerarCambioAgencia(e) {

        let objThis = this;
        let aId = e.row.data.id;

        $.confirm({
            title: "<div class='text-center pt-2 mb-2'><span class='material-icons mr-2 text-warning text-center' style='font-size: 50px'>error_outline</span></div>",
            backgroundDismiss: true,
            columnClass: 'medium',
            animation: 'zoom',
            closeIcon: true,
            closeAnimation: 'scale',
            content: `<h4 class="text-center mb-4">
						¿Cambiar agencia?  
					 </h4>`,
            buttons: {
                No: {
                    text: "No",
                    action: function () { }
                }
                ,
                Si: {
                    text: "Si",
                    action: function () {
                        objThis.props.ClickAcelerarCambioAgencia();
                    }
                    
                }

            }
        });



    }

    inicializarCambiosDeAgencias() {
        this.props.inicializarCambiosDeAgencias();
    }

    formFieldDataChanged(e) {

        this.inicializarCambiosDeAgencias();

        if (e.dataField === "fechaDesde") {
            this.props.cambioFechaDesdeCambioAgencia(e.value);
        }
    }

    firstPage() {
        $("#pagConsCupon").val(1);
        this.ejecutarConsultar(Number($("#pagConsCupon").val()));
    }

    lastPage() {

        $("#pagConsCupon").val(this.props.cambiosDeAgencias.totalPages);
        this.ejecutarConsultar(Number($("#pagConsCupon").val()));

    }

    addPage() {
        if (Number($("#pagConsCupon").val()) < this.props.cambiosDeAgencias.totalPages)
            $("#pagConsCupon").val(Number($("#pagConsCupon").val()) + 1);
        else
            $("#pagConsCupon").val(this.props.cambiosDeAgencias.totalPages);
        this.ejecutarConsultar(Number($("#pagConsCupon").val()));
    }

    removePage() {
        if (Number($("#pagConsCupon").val()) > 1)
            $("#pagConsCupon").val(Number($("#pagConsCupon").val()) - 1);
        else
            $("#pagConsCupon").val(1);

        this.ejecutarConsultar(Number($("#pagConsCupon").val()));
    }

    handleChangePagina(e) {
        if (e.target.value.length == 0) return;
        if (!((Number($("#pagConsCupon").val()) >= 1) &&
            (Number($("#pagConsCupon").val()) <= this.props.cambiosDeAgencias.totalPages)))
            this.ejecutarConsultar(1);
        else
            this.ejecutarConsultar(Number(e.target.value));
    }

    ejecutarConsultar(pagina) {
        this.props.ejecutarConsultarCambioAgencias(pagina);
    }


    handleMovimientos() {

        this.ejecutarConsultar(1);

    }


    render() {
        return (
            <div className="bg-light p-3 border" style={{ maxHeight: $("#panelResultados").height() - 45 }}>

                <div className="mb-3">
                    <Form formData={this.props.cambiosDeAgencias.filtros} onFieldDataChanged={this.formFieldDataChanged}>
                        <GroupItem cssClass="first-group" colCount={9}>
                            <GroupItem colSpan={2}>
                                <SimpleItem
                                    dataField="fechaDesde"
                                    editorType="dxDateBox"
                                    editorOptions={this.dateOptions}
                                    value={this.props.cambiosDeAgencias.filtros.fechaDesde}
                                > 
                                    <Label text="Desde"></Label>
                                </SimpleItem>
                            </GroupItem>

                            <GroupItem colSpan={2}>
                                <SimpleItem
                                    dataField="fechaHasta"
                                    editorType="dxDateBox"
                                    editorOptions={this.dateOptions}
                                    value={this.props.cambiosDeAgencias.filtros.fechaHasta}
                                >
                                    <Label text="Hasta"></Label>
                                </SimpleItem>
                            </GroupItem>


                            <GroupItem colSpan={3}>

                                <button type="button"className="btn btn-dark" onClick={this.handleMovimientos}>
                                    <span className="iconify mr-2" data-icon="bx:bx-search-alt" data-inline="false" data-width="20px"></span>
                                    <b>Cambios de Agencia</b>
                                </button>
                            </GroupItem>
                        </GroupItem>


                    </Form>
                </div>


                <DataGrid
                    dataSource={this.props.cambiosDeAgencias.cambiosDeAgencias}
                    showBorders={true}
                    
    
                >

                    <Paging enabled={false} />
                    <Sorting mode="none" />

                    <Column dataField="fechaSolicitud" dataType="date" format="dd/MM/yyyy HH:mm:ss" />
                    <Column dataField="agencia" />
                    <Column dataField="pendiente" />
                    <Column dataField="fechaCambio" dataType="date" format="dd/MM/yyyy HH:mm:ss" />
                  
                    <Column type="buttons" width={110}
                        buttons={['edit', {
                            hint: 'Realizar cambio de agencia',
                            icon: 'repeat',
                            visible: this.isMostrarAcelerarCambio,
                            onClick: this.ClickAcelerarCambioAgencia
                        }]} />

                </DataGrid>

                {this.props.cambiosDeAgencias.paginado === true &&
                    <div className="mt-2">
                        <label htmlFor="paginador">Pagina</label>

                        <a onClick={this.firstPage} style={{ cursor: "pointer" }} className="ml-1">
                            <span className="iconify" data-icon="dashicons:arrow-left-alt2" data-inline="false" style={{ marginRight: "-9px" }}></span>
                            <span className="iconify" data-icon="dashicons:arrow-left-alt2" data-inline="false"></span>
                        </a>

                        <a onClick={this.removePage} ><span style={{ cursor: "pointer" }}className="iconify ml-1" data-icon="dashicons:arrow-left-alt2" data-inline="false"></span></a>

                        <input
                            className="mr-1 ml-1 text-center"
                            type="number"
                            id="pagConsCupon"
                            style={{ width: "30px" }}
                            placeholder={this.props.cambiosDeAgencias.currentPage + 1}
                            onBlur={(e) => { this.handleChangePagina(e) }}
                        />

                        <a onClick={this.addPage}><span style={{ cursor: "pointer" }}className="iconify mr-1" data-icon="dashicons:arrow-right-alt2" data-inline="false"></span></a>

                        <a onClick={this.lastPage} style={{ cursor: "pointer" }} className="mr-1">
                            <span className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false"></span>
                            <span className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false" style={{ marginLeft: "-9px" }}></span>
                        </a>
                        {
                            <span>de {this.props.cambiosDeAgencias.totalPages} ({this.props.cambiosDeAgencias.totalItems} registros) </span>
                        }
                    </div>
                }
            </div>
        );
    }
}

export default CambiosDeAgencias;

