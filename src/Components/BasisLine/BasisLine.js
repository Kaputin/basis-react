import {Component, React} from "react";
import { Line, XAxis, YAxis, CartesianGrid, ComposedChart, Scatter, ReferenceLine } from "recharts";
import {Card} from "react-bootstrap";
import './BasisLine.css';

export default class BasisLine extends Component {
    constructor(props) {
        super(props);
        this.getXValue = this.getXValue.bind(this);
    }

    getXValue(e) {
        const fun = this.props.grafData.vector[0] + this.props.grafData.vector[1]* e.x + this.props.grafData.vector[2]* Math.pow(e.x, 2) + this.props.grafData.vector[3] * Math.pow(e.x, 3);
        return fun
    }

    render() {
        return (
            <Card style={{'border': 'none'}}>
                <Card.Header className={`header--${this.props.color}`}>Базис «{this.props.data_text}»</Card.Header>
                <Card.Body className={`body body--${this.props.color}`}>
                    <div style={{'position': 'relative'}}>
                    {this.props.grafData &&
                            <ComposedChart width={570} height={570} data={this.props.grafData.data}>
                                <CartesianGrid vertical={false} stroke="#ccc"/>
                                <ReferenceLine x="0" stroke="black" />
                                <XAxis dataKey={"x"} type={"number"}
                                       domain={[this.props.grafData.deviation * -1, this.props.grafData.deviation]}
                                       tickCount={9}/>
                                <YAxis axisLine={false} tickLine={false} dataKey={"y"} type={"number"} domain={this.props.grafData.intervalY} tickCount={11}/>
                                <Scatter dataKey={this.props.grafData.data} fill="#82ca9d" shape="triangle"/>
                                <Line type="basis" dataKey={this.getXValue} dot={false} stroke="#8884d8" strokeWidth={2}/>
                            </ComposedChart>
                    }
                        <span className={`radius body--${this.props.color}`}>R<sup>2</sup>={this.props.grafData.radius}</span>
                    </div>
                </Card.Body>
            </Card>
        )
    }
}