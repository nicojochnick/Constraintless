import React, {useEffect} from 'react';
import {convertFromRaw, Editor, EditorState} from "draft-js";
import Box from "@material-ui/core/Box";
import Divider from '@material-ui/core/Divider';
import { makeStyles, fade } from '@material-ui/core';


function Model(props) {
    const classes = useStyles();

    return (
        <div>
            <Box display = 'flex' alignItems = 'center' flexDirection ='column' justify = 'center' borderRadius = {25} style = {{margin: 10, maxWidth: 550, backgroundColor: 'white', boxShadow: "0px 2px 10px #C9C9C9"}}>
                <p style={{color: '#403E47', fontSize: 25, fontWeight: 800, padding: 0}}> {props.header} </p>
                <Divider className={classes.divider}/>
                <Box style = {{margin: 20}}>
                <img style={{maxHeight: 275, margin: 5}} src={props.img}/>
                <div style={{color: '#403E47', margin: 10, fontSize: 18, marginTop:20}}>
                    <Editor editorState={ EditorState.createWithContent(convertFromRaw(JSON.parse(props.body))) } readOnly={true}/>
                </div>
                </Box>
            </Box>

        </div>
    );
}

const useStyles = makeStyles((theme) => ({
    divider: {
        // Theme Color, or use css color in quote
        background: '#403E47',
    },
}));

export default Model;
