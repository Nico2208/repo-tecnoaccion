import React from 'react';

import DataGrid, {
  Column,
  Editing,
  Popup,
  Paging,
  Lookup,
  Position,
  Form
} from 'devextreme-react/data-grid';
import 'devextreme-react/text-area';
import { Item } from 'devextreme-react/form';
import { clientes, provincias, agencias } from './mock/dataMOCK.js';

class Mensajeria extends React.Component {
  render() {
    return (
      <div id="data-grid-demo" className="shadow">
        <DataGrid
          dataSource={clientes}
          keyExpr="ID"
          showBorders={true}
        >
          <Paging enabled={false} />

          <Editing mode="popup" allowUpdating={true} useIcons={true}>

            <Popup title="Datos Personales" showTitle={true} width={700} height={580}>
              <Position my="top" at="top" of={window} />
            </Popup>

            <Form>
              <Item itemType="group" colCount={2} colSpan={2}>
                <Item dataField="Nombre" />
                <Item dataField="Apellido" />
                <Item dataField="FechNac" />
                <Item dataField="DNI" />
                <Item dataField="Agencia" />
                
                <Item
                  dataField="Notas"
                  editorType="dxTextArea"
                  colSpan={2}
                  editorOptions={{ height: 100 }} />
              </Item>

              <Item itemType="group" caption="Datos de Contacto" colCount={2} colSpan={2}>
                <Item dataField="Direccion" />
                <Item dataField="Localidad" />
                <Item dataField="Provincia" />
                <Item dataField="Correo" />
              </Item>
              
            </Form>

          </Editing>


          <Column dataField="Nombre"  caption="Nombre"/>
          <Column dataField="Apellido" caption="Apellido"/>
          <Column dataField="FechNac" caption="Fecha Nacimiento" dataType="date"/>
          <Column dataField="DNI" />

          <Column dataField="Agencia" caption="Agencia">
            <Lookup dataSource={agencias} valueExpr="ID" displayExpr="Nombre" />
          </Column>
          <Column dataField="Provincia" caption="Provincia" width={125}>
            <Lookup dataSource={provincias} valueExpr="ID" displayExpr="Nombre" />
          </Column>
          <Column dataField="Direccion" caption="Direccion" />
          <Column dataField="Localidad" caprion="Localidad" />
          <Column dataField="Correo" caption="Correo" />
          <Column dataField="Notas" visible={false} />

        </DataGrid>
      </div>
    );
  }
}

export default Mensajeria;
