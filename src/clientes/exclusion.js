/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react';
import DataGrid, { Column, Pager, Paging, Sorting, Button } from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';
import $ from 'jquery';
import Form, {
    SimpleItem,
    GroupItem,
    Label
} from 'devextreme-react/form';
import 'devextreme-react/text-area';
import Moment from 'moment'


class Exclusion extends React.Component {

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
        this.inicializarConsultaExclusiones = this.inicializarConsultaExclusiones.bind(this);
        this.anularExclusion = this.anularExclusion.bind(this);
        this.ClickAnularExclusion = this.ClickAnularExclusion.bind(this);
        this.ClickNuevaExclusion = this.ClickNuevaExclusion.bind(this);
        this.nuevaExclusion = this.nuevaExclusion.bind(this);
    }

    
    ClickAnularExclusion(e) {

        let objThis = this;

        $.confirm({
            title: "<div class='text-center pt-2 mb-2'><span class='material-icons mr-2 text-warning text-center' style='font-size: 50px'>error_outline</span></div>",
            backgroundDismiss: true,
            columnClass: 'medium',
            animation: 'zoom',
            closeIcon: true,
            closeAnimation: 'scale',
            content: `<h4 class="text-center mb-4">
						¿Desea anular la exclusion?  
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
                        objThis.props.anularExclusion();
                    }
                    
                }

            }
        });
    }

    ClickNuevaExclusion(){

       let objThis = this;

       $.confirm({
        title: 'Nueva Exclusion', 
        content: '' +
        '<form action="" class="nuevaExclusion">' +
        '<div class="form-group">' +
        '<label>Fecha desde</label>' +
        '<input type="date" id="exclusionAltaFechDesde" placeholder="desde" class="desde form-control" required />' +
        '<label>Fecha hasta</label>' +
        '<input type="date" id="exclusionAltaFechHasta" placeholder="hasta" class="hasta form-control" required />' +
        '<label>Observaciones</label>' +
        '<input type="text" id="exclusionObersaciones" placeholder="observaciones" class="observaciones form-control" required />' +
        '</div>' +
        '</form>',
        buttons: {
            formSubmit: {
                text: 'submit',
                btnClass: 'btn-blue',
                action : ()=>{
                    let desde = encodeURIComponent(Moment($("#exclusionAltaFechDesde").val()).format('YYYYMMDD'));
                    let hasta = encodeURIComponent(Moment($("#exclusionAltaFechHasta").val()).format('YYYYMMDD'));
                    let observaciones = $("#exclusionObersaciones").val();
                    objThis.props.nuevaExclusion(desde,hasta,observaciones);
                }
            },
            cancel: function () {
            },
        },
        onContentReady: function () {
            var jc = this;
            this.$content.find('form').on('submit', (e)=>{
                objThis.props.nuevaExclusion()});
        }
    });
    }


    inicializarConsultaExclusiones() {
        this.props.inicializarConsultaExclusiones();
    }

    formFieldDataChanged(e) {

        this.inicializarConsultaExclusiones();

        if (e.dataField === "fechaDesde") {
            this.props.cambioFechaDesdeExclusion(e.value);
        }
    }

    firstPage() {
        $("#pagConsExclusion").val(1);
        this.ejecutarConsultar(Number($("#pagConsExclusion").val()));
    }

    lastPage() {

        $("#pagConsExclusion").val(this.props.exclusiones.totalPages);
        this.ejecutarConsultar(Number($("#pagConsExclusion").val()));

    }

    addPage() {
        if (Number($("#pagConsExclusion").val()) < this.props.exclusiones.totalPages)
            $("#pagConsExclusion").val(Number($("#pagConsExclusion").val()) + 1);
        else
            $("#pagConsExclusion").val(this.props.exclusiones.totalPages);
        this.ejecutarConsultar(Number($("#pagConsExclusion").val()));
    }

    removePage() {
        if (Number($("#pagConsExclusion").val()) > 1)
            $("#pagConsExclusion").val(Number($("#pagConsExclusion").val()) - 1);
        else
            $("#pagConsExclusion").val(1);

        this.ejecutarConsultar(Number($("#pagConsExclusion").val()));
    }

    handleChangePagina(e) {
        if (e.target.value.length == 0) return;
        if (!((Number($("#pagConsExclusion").val()) >= 1) &&
            (Number($("#pagConsExclusion").val()) <= this.props.exclusiones.totalPages)))
            this.ejecutarConsultar(1);
        else
            this.ejecutarConsultar(Number(e.target.value));
    }

    ejecutarConsultar(pagina) {
        this.props.ejecutarConsultaExclusiones(pagina);
    }


    handleMovimientos() {
        this.ejecutarConsultar(1);
    }

    anularExclusion(){
        this.props.anularExclusion();
    }

    nuevaExclusion(){

        this.props.nuevaExclusion();
    }
    


    render() {
        return (
            <div className="bg-light p-3 border" style={{ maxHeight: $("#panelResultados").height() - 45 }}>

                <div className="mb-3">
                    <Form formData={this.props.exclusiones.filtros} onFieldDataChanged={this.formFieldDataChanged}>
                        <GroupItem cssClass="first-group" colCount={9}>
                            <GroupItem colSpan={2}>
                                <SimpleItem
                                    dataField="fechaDesde"
                                    editorType="dxDateBox"
                                    editorOptions={this.dateOptions}
                                    value={this.props.exclusiones.filtros.fechaDesde}
                                >
                                    <Label text="Desde"></Label>
                                </SimpleItem>
                            </GroupItem>

                            <GroupItem colSpan={2}>
                                <SimpleItem
                                    dataField="fechaHasta"
                                    editorType="dxDateBox"
                                    editorOptions={this.dateOptions}
                                    value={this.props.exclusiones.filtros.fechaHasta}
                                >
                                    <Label text="Hasta"></Label>
                                </SimpleItem>
                            </GroupItem>

                            
                        </GroupItem>
                        <GroupItem colCount={9}>
                        <GroupItem colSpan={3}>
                                <button type="button"className="btn btn-dark" onClick={this.handleMovimientos}>
                                    <span className="iconify mr-2" data-icon="bx:bx-search-alt" data-inline="false" data-width="20px"></span>
                                    <b>CONSULTA</b>
                                </button>
                            </GroupItem>  
                            <GroupItem colSpan={2}>
                                <button type="button"className="btn btn-dark" onClick={this.ClickNuevaExclusion}>
                                    <span className="iconify mr-2" data-icon="bx:bx-search-alt" data-inline="false" data-width="20px"></span>
                                    <b>NUEVO</b>
                                </button>
                            </GroupItem>
                            <GroupItem colSpan={2}>
                                <button type="button"className="btn btn-dark" onClick={this.ClickAnularExclusion}>
                                    <span className="iconify mr-2" data-icon="bx:bx-search-alt" data-inline="false" data-width="20px"></span>
                                    <b>ANULAR</b>
                                </button>
                            </GroupItem>
                        </GroupItem>
                    </Form>
                </div>


                <DataGrid
                    dataSource={this.props.exclusiones.exclusiones}
                    showBorders={true}
                >
                    <Paging enabled={false} />
                    <Sorting mode="none" />

                    <Column dataField="desde" dataType="dateTime" format="dd/MM/yyyy" />
                    <Column dataField="hasta" dataType="dateTime" format="dd/MM/yyyy" />
                    <Column dataField="active" dataType="boolean" caption="Activa"/>
                    <Column dataField="observaciones" />
                    <Column dataField="fechaGeneracion" dataType="date" format="dd/MM/yyyy"/>
                    <Column dataField="creacionOperador" />
                    <Column dataField="anulacionOperador" />
                    <Column dataField="fechaAnulacion" dataType="date" format="dd/MM/yyyy"/>
                </DataGrid> 

                {this.props.exclusiones.paginado === true &&
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
                            id="pagConsExclusion"
                            style={{ width: "30px" }}
                            placeholder={this.props.exclusiones.currentPage + 1}
                            onBlur={(e) => { this.handleChangePagina(e) }}
                        />

                        <a onClick={this.addPage}><span style={{ cursor: "pointer" }}className="iconify mr-1" data-icon="dashicons:arrow-right-alt2" data-inline="false"></span></a>

                        <a onClick={this.lastPage} style={{ cursor: "pointer" }} className="mr-1">
                            <span className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false"></span>
                            <span className="iconify" data-icon="dashicons:arrow-right-alt2" data-inline="false" style={{ marginLeft: "-9px" }}></span>
                        </a>
                        {
                            <span>de {this.props.exclusiones.totalPages} ({this.props.exclusiones.totalItems} registros) </span>
                        }
                    </div>
                }
            </div>
        );
    }
}

export default Exclusion;

