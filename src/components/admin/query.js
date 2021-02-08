import React, {useEffect} from 'react';
import Box from "@material-ui/core/Box";
import TextField from "@material-ui/core/TextField/TextField";
import {makeStyles} from "@material-ui/core";
import {BiDoorOpen,BiArrowToRight} from "react-icons/bi";
import Button from '@material-ui/core/Button';

export default function Query(props) {

    const classes = useStyles();
    const [responseID, setResponseID] = React.useState(null);

    const sendResponse = (event) => {
        let code = event.keyCode || event.which;
        if(code === 13) { //13 is the enter keycode
            let resID = responseID;
            setResponseID(null);
             console.log(resID)
            props.sendResponse(resID, props.query.queryID)
        }
    };

    useEffect(() => {
    }, []);

    return (
        <Box borderRadius = {10} border = {1} borderColor = {'white'} style = {{margin: 15, padding: 15, minWidth: 500}}>
            <Box display = 'flex' flexDirection = 'row' justifyContent ='space-between' alignItems = 'center' >
                <Box>
                    <p style = {{color:'white'}}>
                        {props.query.query}
                    </p>
                    <p style = {{color:'white', fontSize: 12}}> {props.query.timeStamp.toDate().toDateString()} </p>
                </Box>
                <Box
                    className = {classes.box}
                    style = {{backgroundColor: 'black', padding: 10, margin: 10}}
                    border = {2}
                    borderRadius = {10}
                    alignItems="flex-start"
                    justify = 'flex-start'
                    display="flex"
                    flexDirection="row"
                >
                    <BiArrowToRight
                        size = {25}
                        style = {{color: 'white', margin: 5}}
                    />
                    <form onSubmit={sendResponse} noValidate>
                        <TextField
                            placeholder="type response ID"
                            multiline
                            onChange={(event)=>setResponseID(event.target.value)}
                            defaultValue= {responseID}
                            onKeyPress = {(e)=>sendResponse(e)}
                            fullWidth
                            InputProps= {{className: classes.textField, disableUnderline: true}}
                            rowsMax={1}
                            type="submit"
                        />
                    </form>
                </Box>
            </Box>
        </Box>
    );
}

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },

    box: {
        color: "white",
        width: 200
    },

    textField: {
        disableUnderline: true,
        color: 'white',

    }
}));


