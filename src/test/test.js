import React from 'react';
import DateBox from 'devextreme-react/date-box';

import service from './data.js';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: new Date(1986, 2, 27),
            fechaHoy: new Date()
        };
        this.now = new Date();
        this.firstWorkDay2017 = new Date(2017, 0, 3);
        this.min = new Date(1900, 0, 1);
        this.dateClear = new Date(2015, 11, 1, 6);
        this.disabledDates = service.getFederalHolidays();
        this.onValueChanged = this.onValueChanged.bind(this);
        this.formFieldDataChanged = this.formFieldDataChanged.bind(this);
        this.getFecha = this.getFecha.bind(this)

        this.dateOptions = {
            displayFormat: 'dd/MM/yyyy',
            pickerType: "calendar",
            format: "date",
        };
    }


    get diffInDay() {
        return `${Math.floor(Math.abs(((new Date()).getTime() - this.state.value.getTime()) / (24 * 60 * 60 * 1000)))} days`;
    }
    //   checkDate(){
    //     new Date()
    //   }
    getFecha(e) {
        console.log(e.value)
    }

    formFieldDataChanged(e) {



        // let fechaString = JSON.stringify(e.value)
        // let nuevov = fechaString.split('T')[0].split('')
        // nuevov.shift()

        // const fechaD = new Date(nuevov.join(''))

        // console.log(fechaD)
        console.log(e.value)


    }
    onValueChanged(e) {
        this.setState({
            value: e.value,
        });
    }

    render() {
        return (
            <div>

                <div className="dx-fieldset">
                    <div className="dx-field">
                        <div className="dx-field-label">Date</div>
                        <div className="dx-field-value">
                            <DateBox defaultValue={this.state.fechaHoy}
                                min={this.state.fechaHoy}
                                editorOptions={this.dateOptions}
                                type="date" />
                        </div>
                    </div>

                    <div className="dx-field">
                        <div className="dx-field-label">Disable certain dates</div>
                        <div className="dx-field-value">
                            <DateBox defaultValue={this.firstWorkDay2017}
                                type="date"
                                pickerType="calendar"
                                disabledDates={this.disabledDates} />
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

export default App;
