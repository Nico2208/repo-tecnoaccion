import React from 'react'
import { withRouter, Link } from 'react-router-dom';
import { Animated } from 'react-animated-css';

import LogoBg from './img/logocompleto.png';



class Home  extends React.Component {

    constructor(props) {

		super(props);

        //comentario test 1
        
        this.state = {};

        

    }

    render(){
        return(
                <div style={{marginTop: '5%'}} className="w-75 mx-auto">

                    {this.props.isLogueado() &&
                    <div className="row text-center mb-4" id="home">

                        <div className="col-sm-4">   
                            <Animated animationIn="fadeIn" animationInDelay={100} className="mx-auto">
                                <Link to="/clientes">
                                    <div className="bg-dark rounded shadow p-4 w-95 mx-auto home-btn" id="clientes"> 
                                        <span className="iconify" data-icon="fa-solid:users" data-inline="false" data-width="99px"></span>
                                        <h1><b>Clientes</b></h1>
                                    </div>
                                </Link>  
                            </Animated>
                        </div>
                        
                        <div className="col-sm-4">   
                            <Animated animationIn="fadeIn" animationInDelay={100}  className="mx-auto">
                                <Link to="/reportes">
                                    <div className="bg-dark rounded shadow p-3 pt-4 pb-4 w-95 mx-auto home-btn">
                                        <span className="iconify" data-icon="line-md:document-report" data-inline="false" data-width="79px"></span>
                                        <h1><b>Reportes estándar</b></h1>
                                    </div>
                                </Link>  
                            </Animated>
                        </div>

                        <div className="col-sm-4">   
                            <Animated animationIn="fadeIn" animationInDelay={100}  className="mx-auto">
                                <Link to="/reportesMedida">
                                    <div className="bg-dark rounded shadow p-2 pt-4 pb-4 w-95 mx-auto home-btn" id="reportesMedida">
                                        <span className="iconify" data-icon="carbon:chart-custom"  data-inline="false" data-width="79px"></span>
                                        <h1><b>Reportes a Medida</b></h1>
                                    </div>
                                </Link>  
                            </Animated>
                        </div>

                        {/*<div className="col-sm-4" style={{marginTop:"8%"}}>   
                            <Animated animationIn="fadeIn" animationInDelay={100}  className="mx-auto">
                                <Link to="/tablero">
                                    <div className="bg-dark rounded shadow p-4 w-95 mx-auto home-btn">
                                        <spanclassName="iconify" data-icon="ant-design:pie-chart-outlined" data-inline="false" data-width="79px"></span>
                                        <h1><b>Tablero</b></h1>
                                    </div>
                                </Link>  
                            </Animated>
                        </div>*/}

                        <div className="col-sm-4" style={{marginTop:"8%"}}>   
                            <Animated animationIn="fadeIn" animationInDelay={100}  className="mx-auto">
                                <Link to="/sistema">
                                    <div className="bg-dark rounded shadow p-4 w-95 mx-auto home-btn"> 
                                        <span className="iconify" data-icon="grommet-icons:system" data-inline="false" data-width="79px"></span>
                                        <h1><b>Sistema</b></h1>
                                    </div>
                                </Link>  
                            </Animated>
                        </div>
                        
                    </div>
                    }

                    {this.props.isLogueado() === false &&
                        <div className="row text-center">   
                            <div><img id="logoLotline" src={LogoBg} alt="logo" width="120%"/></div>
                        </div>
                    }

                </div>
        )
    }
    
}



export default withRouter(Home)