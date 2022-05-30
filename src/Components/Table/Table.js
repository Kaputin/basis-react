import {Component, React} from "react";
import {Card, Form, Col, Row} from "react-bootstrap";
import down from "../../Image/caretdown.svg";
import check from "../../Image/check.svg"
import axios from "axios";
import './Table.css';
import BasisLine from "../BasisLine/BasisLine"

export default class Table extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openFirst: false,
            openSecond: false,
            search: '',
            currentFirst: '',
            firstSelect: [],
            currentSecond: {},
            currentGraf: null,
            secondSelect: {},
            grafData: {
                data: [],
                intervalY: [],
                deviation: 0,
                vector: [],
                radius: 0
            }
        };
        this.changeFirstSelect = this.changeFirstSelect.bind(this);
        this.changeSecondSelect = this.changeSecondSelect.bind(this);
        this.openSecondSelectHandler = this.openSecondSelectHandler.bind(this);
        this.openSecondSelectHandler = this.openSecondSelectHandler.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
    }

    componentDidMount() {
        this.getdataoptions();
    }

    async getdataoptions() {
        await axios.get('http://localhost:3000/first-select'
        )
            .then(async response => {
                this.setState({
                    firstSelect: response.data,
                    currentFirst: response.data[0]
                })
                await this.getSecondOption(this.state.currentFirst).then(
                    responseSecond => {
                        if(responseSecond.data.length && responseSecond.data[0].value) {
                            this.setState({
                                secondSelect: responseSecond.data[0],
                                currentSecond: responseSecond.data[0],
                                currentGraf: responseSecond.data[0].value[0],
                            })
                        }
                    }
                )
            })
    }

    async getSecondOption(item) {
        const response = await axios.get(`http://localhost:3000/second-select?key=${item}`);
        return response;
    }

    handleChangeSearch(e) {
        const searchData = []
        if(this.state.secondSelect) {
            this.state.secondSelect.value.forEach(item => {
                if(item.toString().includes(e.target.value.toString())) searchData.push(item)
            })
            this.setState({
                search: e.target.value,
                currentSecond: {
                    key: this.state.currentSecond.key,
                    value: searchData
                }
            });
        }

    }

    async changeFirstSelect (item) {
        const responseSecond = await this.getSecondOption(item)

        this.setState({
            currentFirst: item,
            secondSelect: responseSecond.data[0],
            currentSecond: responseSecond.data[0],
            currentGraf: responseSecond.data[0]?.value?.length ? responseSecond.data[0].value[0] : '',
            search: '',
            openSecond: false,
            openFirst: false,
        });
    }

    changeSecondSelect(item) {
        this.setState({
            currentGraf: this.state.currentSecond.value?.length ? this.state.currentSecond.value.find(element => element === item) : ''});
        this.openSecondSelectHandler();
    }

    openSecondSelectHandler() {
        this.setState(prevState => ({
            openSecond: !prevState.openSecond
        }));
    }

    openFirstSelectHandler() {
        this.setState(prevState => ({
            openFirst: !prevState.openFirst
        }));
    }

    isCurrent(item, type) {
        if(type === 'first') return item === this.state.currentFirst
        else return item === this.state.currentGraf
    }

    async handleSubmit(event) {
        event.preventDefault();
        const response = await axios.get(`http://localhost:3000/graf-data?key=${this.state.currentGraf}`);

        this.setState( {
                grafData: {
                    data: response.data[0] ? response.data[0].data : [],
                    intervalY: response.data[0] ? response.data[0]['interval-Y'] : [],
                    deviation: response.data[0] ? response.data[0].deviation : 0,
                    vector: response.data[0] ? response.data[0].vector : 0,
                    radius: response.data[0] ? response.data[0]['R2'] : 0
                }
            });
    }

    render() {
        return (
            <Card className={'m-4 p-1 px-4 pb-4'}>
                <button className={'submit-btn'}>
                    Экспортировать
                </button>
                <Row className={'pt-2'}>
                    <Col>
                        <BasisLine data_text={'Средние цены'}
                                   grafData={this.state.grafData}
                                   color={'green'}
                        />
                    </Col>
                    <Col>
                        <BasisLine data_text={'Относительная  наценка'}
                                   grafData={this.state.grafData}
                                   color={'blue'}
                        />
                    </Col>
                </Row>
                <Row className={'pt-2'}>
                    <Col>
                        <BasisLine data_text={'Маржинальная наценка с учетом норм доходности'}
                                   grafData={this.state.grafData}
                                   color={'purple'}
                        />
                    </Col>
                    <Col>
                        <Card>
                            <Card.Header style={{'border': 'none', 'backgroundColor': 'rgb(204, 204, 204)'}}>Запрашиваемые параметры</Card.Header>
                            <Card.Body>
                                    <div style={{position: 'relative', minHeight: '260px'}}>
                                        <button onClick={this.openFirstSelectHandler.bind(this)} className={`btn-select`}>
                                            <span>{this.state.currentFirst ? this.state.currentFirst : "Выберите группу" }</span>
                                            <img
                                                src={down}
                                                alt={"down"}
                                            />
                                        </button>
                                        {this.state.openFirst && <ul className={'drop-menu'}>
                                            { this.state.firstSelect.map(item => (
                                                <li onClick={this.changeFirstSelect.bind(this, item)} key={item} className={`drop-item ${this.isCurrent(item, 'first') ? 'drop-item--current': ''}`}>
                                                    <span>{item}</span>
                                                    { this.isCurrent(item, 'first') && <img
                                                        src={check}
                                                        alt={"check"}
                                                    />
                                                    }
                                                </li>
                                            ))
                                            }
                                        </ul>}
                                    </div>
                                    <div style={{position: 'relative', minHeight: '280px'}}>
                                        <button onClick={this.openSecondSelectHandler.bind(this)} className={`btn-select`}>
                                            <span>{this.state.currentGraf ? this.state.currentGraf : this.state.currentFirst }</span>
                                            <img
                                                src={down}
                                                alt={"down"}
                                            />
                                        </button>
                                        {this.state.openSecond && <ul className={'drop-menu'}>
                                            <li className={'drop-item'}><Form.Control value={this.state.search} onChange={this.handleChangeSearch} placeholder={"Поиск.."} /></li>
                                            { this.state.currentSecond.value.map(item => (
                                                <li onClick={this.changeSecondSelect.bind(this, item)} key={item} className={`drop-item ${this.isCurrent(item, 'second') ? 'drop-item--current': ''}`}>
                                                    <span>{item}</span>
                                                    { this.isCurrent(item, 'second') && <img
                                                        src={check}
                                                        alt={"check"}
                                                    />
                                                    }
                                                </li>
                                            ))
                                            }
                                        </ul>}
                                    </div>
                                    <button onClick={this.handleSubmit} className={'submit-btn'}>
                                        Сформировать
                                    </button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Card>
        )
    }
}