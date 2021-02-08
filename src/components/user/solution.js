import React, {useEffect} from 'react';
import Box from '@material-ui/core/Box';
import { BiQuestionMark, BiPlus, BiSearch} from "react-icons/bi"
import TextField from "@material-ui/core/TextField/TextField";
import Grid from "@material-ui/core/Grid";
import { makeStyles } from '@material-ui/core';
import {db} from "../../api/firebase";

function Solution(props) {
    const classes = useStyles();
    const [label, setLabel] = React.useState('');
    const [query, setQuery] = React.useState(null);
    const [response,setResponse] = React.useState( null);

    const [isEditing, setIsEditing] = React.useState(false);

    const handleEditLabel = (event) => {
        if (!isEditing){setIsEditing(true)}
        setLabel(event.target.value)
    };

    useEffect(() => {

    }, []);

    let currentQuery = query ? query : props.query;

    return (
        <div className={classes.root}>
            <Grid container justify={'flex-start'} alignItems = 'center'>
            {!props.response
                ?
                <p style = {{color: "white", fontSize: 16, margin: 10}}>
                    Make better decisions.
                </p>
                :
                <Box>
                    <p style={{color: 'white', fontSize: 50, fontWeight: 800}}> {props.response.header} </p>
                    <img style={{maxHeight: 200}} src={props.response.img}/>
                    <p style={{color: "white", fontSize: 20}}> {props.response.body} </p>
                </Box>
            }
            </Grid>
        </div>
    );
}



const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    box: {
        color: "white"
    },
    textField: {
        disableUnderline: true,
        color: 'white',

    }
}));


export default Solution;
