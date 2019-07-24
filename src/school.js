import {Component} from 'react';
import ReatDOM, {render} from 'react-dom';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import {withStyles, MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import blue from '@material-ui/core/colors/blue';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import './css/common.css';

import {blink} from 'sudoku-matrix';

const schoolTheme = createMuiTheme({
    typography: {
        useNextVariants: true,
    },
    palette: {
        primary: blue,
        secondary: {
            main: green[600],
            background: green[50],
        },
        error: {
            main: red[500],
        },
        thirdcolor: {
            light: red[300],
            main: red[600],
            dark: red[700],
            contrastText: "#FFFFFF",
        }
    },
    overrides:{
        MuiTypography: {
            h6:{
                fontSize: "18px",
            },
        },
    }
});

class SudokuForm extends Component{
    constructor(props){
        super(props)
        this.state = {level: 5};
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event){
        this.setState({level: event.target.value});
    }

    render(){
        const {onClickSudokuGenerator} = this.props;
        var items = [];
        for(var i=5; i<=50; i+=5){
            items.push(
                <MenuItem key={"level_" + i} value={i}>{i}</MenuItem>
            );
        }
        return(
            <div key="k2" style={{backgroundColor: schoolTheme.palette.secondary.background,
                borderRadius: "5px", padding: "10px 40px", float: "left", marginLeft: "20px"}}>
                <div style={{marginBottom: "40px"}}>
                    <InputLabel htmlFor="level" style={{marginRight: "20px"}}>Level</InputLabel>
                    <Select value={this.state.level} onChange={this.handleChange} inputProps={{name: 'level', id: 'level',}}>
                        {items}
                    </Select>
                </div>
                <Button  variant="contained" onClick={()=>onClickSudokuGenerator(this.state.level)} color="primary">
                    <i className="fas fa-ambulance" style={{color: schoolTheme.palette.error.light, marginRight: "10px", fontSize: "20px"}}></i>数独</Button>
            </div>
        );
    }
}

class InputFrame extends Component {
    constructor(props){
        super(props);
        this.onChangeEvent = this.onChangeEvent.bind(this);

        this.state = {first_1: props.first_1, first_2: props.first_2, second_1: props.second_1, second_2: props.second_2};
    }

    onChangeEvent(event){
        const keyword = event.target.id;
        this.setState({[keyword]: event.target.value});
    }

    render(){
        const {show, submit, onClickMathGenerator, onClickSudokuGenerator} = this.props;
        const {first_1, first_2, second_1, second_2} = this.state;
        var content = [];
        if(show){
            content.push(
                <div key="k1" style={{backgroundColor: schoolTheme.palette.secondary.background, borderRadius: "5px", padding: "10px 40px", float: "left"}}>
                    <div style={{float: "left", marginRight: "40px", marginTop: "40px"}}>
                        数字１
                    </div>
                    <div style={{float: "left"}}>
                        <TextField error={submit && !first_1}
                                   label={"最小"} type="number" margin="normal" color="primary" multiline={false}
                                   InputProps={{style: {fontSize: "14px"}}} InputLabelProps={{style: {fontSize: "14px"}}} id="first_1"
                                   onChange={this.onChangeEvent}/>
                    </div>
                    <div style={{float: "left", marginLeft: "20px"}}>
                        <TextField error={submit && (!first_2 || (first_2-first_1<0))}
                                   label={"最大"} type="number" margin="normal" color="primary" multiline={false}
                                   InputProps={{style: {fontSize: "14px"}}} InputLabelProps={{style: {fontSize: "14px"}}} id="first_2"
                                   onChange={this.onChangeEvent}/>
                    </div>
                    <div style={{clear: "both"}}></div>
                    <div style={{float: "left", marginRight: "40px", marginTop: "40px"}}>
                        数字２
                    </div>
                    <div style={{float: "left"}}>
                        <TextField error={submit && !this.state.second_1} label={"最小"} type="number" margin="normal" color="primary" multiline={false}
                                   InputProps={{style: {fontSize: "14px"}}} InputLabelProps={{style: {fontSize: "14px"}}} id="second_1"
                                   onChange={this.onChangeEvent}/>
                    </div>
                    <div style={{float: "left", marginLeft: "20px"}}>
                        <TextField error={submit && (!second_2 || (second_2-second_1<0))}
                                   label={"最大"} type="number" margin="normal" color="primary" multiline={false}
                                   InputProps={{style: {fontSize: "14px"}}} InputLabelProps={{style: {fontSize: "14px"}}} id="second_2"
                                   onChange={this.onChangeEvent}/>
                    </div>
                    <div style={{clear: "both", marginTop: "20px"}}></div>
                    <div style={{float: "left", marginLeft: "20px"}}>
                        <Button  variant="contained" onClick={()=>{onClickMathGenerator({...this.state, type: "+"})}} color="primary">
                            <i className="fas fa-plus" style={{color: "red"}}></i></Button>
                    </div>
                    <div style={{float: "left", marginLeft: "20px"}}>
                        <Button  variant="contained" onClick={()=>{onClickMathGenerator({...this.state, type: "ー"})}} color="primary">
                            <i className="fas fa-minus" style={{color: "red"}}></i></Button>
                    </div>
                    <div style={{float: "left", marginLeft: "20px"}}>
                        <Button  variant="contained" onClick={()=>{onClickMathGenerator({...this.state, type: "x"})}} color="primary">
                            <i className="fas fa-times" style={{color: "red"}}></i></Button>
                    </div>
                    <div style={{clear: "both"}}></div>
                </div>
            );
            content.push(
                <SudokuForm key={"sudoku_form"} onClickSudokuGenerator={onClickSudokuGenerator}/>
            );
        }
        return content;
    }
}

class ElementDiv extends Component{
    render(){
        var {first_1, first_2, second_1, second_2, type} = this.props;
        first_1 = Number(first_1);
        first_2 = Number(first_2);
        second_1 = Number(second_1);
        second_2 = Number(second_2);

        var first = Math.floor( Math.random() * (first_2 + 1 - first_1) ) + first_1 ;
        var second = Math.floor( Math.random() * (second_2 + 1 - second_1) ) + second_1 ;
/*
        return(
            <div>
                <div className={"float-left math-sub-element"} style={{textAlign: "right"}}>{first}</div>
                <div className={"float-left"} style={{width: "40px", textAlign: "center"}}>{type}</div>
                <div className={"float-left math-sub-element"} style={{textAlign: "right"}}>{second}</div>
                <div className={"float-left"} style={{width: "20px", textAlign: "right"}}>=</div>
            </div>
        );
*/
        return(
            <div className={"math-element-div"}>
                <div className={""} style={{textAlign: "right"}}>{first}</div>
                <div>
                    <div className={"float-left"} style={{width: "40px", textAlign: "left"}}>{type}</div>
                    <div className={""} style={{textAlign: "right", width: "100%"}}>{second}</div>
                </div>
                <div><hr style={{width: "100%", color: "gray"}} /></div>
            </div>
        );
    }
}

class ElementLine extends Component{
    render(){
        const props = this.props;
        return(
            <div className={"element-line"}>
                <div className="float-left math-element"><ElementDiv {...props}/></div>
                <div className="float-left math-element"><ElementDiv {...props}/></div>
                <div className="float-left math-element"><ElementDiv {...props}/></div>
                <div className="float-left math-element"><ElementDiv {...props}/></div>
                <div className="float-left math-element"><ElementDiv {...props}/></div>
                <div style={{clear: "both"}}></div>
            </div>
        )
    }
}

class SchoolEducation extends Component {
    constructor(props){
        super(props);
        this.onClickMathGenerator = this.onClickMathGenerator.bind(this);
        this.onClickSudokuGenerator = this.onClickSudokuGenerator.bind(this);
        this.setPrintMode = this.setPrintMode.bind(this);
        this.state = {content: "", lineCount: 160, showInputForm:true, submit: false};
    }

    setPrintMode(){
        this.setState({showInputForm: false});
        document.body.style.marginTop = "-100px";
    }

    onClickMathGenerator(data){
        if(!data.first_1 || !data.first_2 || !data.second_1 || !data.second_2 ||
            data.first_2-data.first_1<0 || data.second_2-data.second_1<0){
            this.setState({submit: true});
            return;
        }
        const {lineCount} = this.state;
        var result = [];
        for(var i=0; i<lineCount; i++){
            result.push(<ElementLine key={"line_"+i} {...data}/>);
        }
        this.setState({content: result, submit: true});
        this.setPrintMode();
    }
    onClickSudokuGenerator(level) {
        var pageResult = [];
        var breakLine = "";
        for(var i=0; i<4; i++){
            var result = [];
            result.push(<div key={"clear_"+i} style={{clear: "both", marginTop: "40x"}}></div>);
            blink(level).forEach((line, lineIndex)=>{
                var lineResult = [];
                line.forEach((node, index) => {
                    var cssBorder = {border: "solid 1px gray"};
                    if(index%3 === 0){
                        cssBorder = {...cssBorder, borderLeft: "solid 2px black"};
                    }
                    if(index === 8){
                        cssBorder = {...cssBorder, borderRight: "solid 2px black"};
                    }
                    if(lineIndex%3 === 0){
                        cssBorder = {...cssBorder, borderTop: "solid 2px black"};
                    }
                    if(lineIndex === 8){
                        cssBorder = {...cssBorder, borderBottom: "solid 2px black"};
                    }
                    lineResult.push(
                        <div key={lineIndex+"_"+index} className="sudoku-element" style={cssBorder}>
                            {node==0 ? "" : node}
                        </div>
                    );
                });
                result.push(
                    <div key={"#_" + lineIndex}>
                        {lineResult}
                        <div style={{clear: "both"}}></div>
                    </div>
                );
            });

            var marginLeft = {marginLeft: "-10px"};
            var marginTop = <div style={{clear: "both", marginTop: "80px"}}></div>
            if(i%2 !== 0) {
                marginLeft = {marginLeft: "20px"};
                breakLine = <div key={"break_" + i} style={{clear: "both"}}></div>
            }else{
                if(i === 0){
                    marginTop = <div></div>
                }
                breakLine = <span key={"break_" + i}></span>;

            }
            pageResult.push(
                <div key={"all_" + i} style={{float: "left", ...marginLeft}}>
                    {result}
                    {marginTop}
                </div>
            );
            pageResult.push(breakLine);
        }
        this.setState({content: <div style={{marginTop: "80px"}}>{pageResult}</div>});
        this.setPrintMode();
    }

    render(){
        const {showInputForm, submit} = this.state;
        return (
            <MuiThemeProvider theme={schoolTheme}>
                <div style={{padding: "0px 0px"}}>
                    <InputFrame show={showInputForm} submit={submit}
                                onClickMathGenerator={this.onClickMathGenerator} onClickSudokuGenerator={this.onClickSudokuGenerator}/>
                    {this.state.content}
                </div>
            </MuiThemeProvider>
            )

    }
}

ReatDOM.render(<SchoolEducation />, document.getElementById('root'));